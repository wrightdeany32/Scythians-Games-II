// ============================================================================
// coldread/recorder.ts — the trace layer's typed, append-only record stream.
//
// INVARIANT (ratified 2026-07-03): EVERYTHING THAT WANTS A TRACE GOES THROUGH
// Session (which owns a Recorder). Never bolt telemetry onto the bare engine
// loop — that forks the stream format. One emitter, one canonical artifact.
//
// One session = one stream, stamped once at open. Three per-step record types
// plus a trailing debrief. This is the shared substrate for: cold-read
// transcripts, telemetry (bots write `trace` only), the Phase-1 journal (a prose
// rendering of the stream), the option-visibility audit (reads `presentation`),
// and — later — echoes (a dead run's stream is the seed). Read-only w.r.t. the
// engine: the engine never sees this file; the Session feeds it.
// ============================================================================

export const SCHEMA_VERSION = 1;

export interface StreamStamp {
  contentId: string;
  buildTag: string;
  seed: number;
  schemaVersion: number;
  // A chained (two-vessel) read is SELF-DESCRIBING for replay: the cross-run
  // seeds injected at newGame are part of "same seed + same picks", so vessel
  // B's stream stamps what it was born carrying (v0.3 rider; additive within
  // schema v1 — absent means a first vessel).
  crossRunSeeds?: Record<string, boolean | number | string>;
  // The opening era (the cutover re-baseline, 2026-07-19): "deck" = the run
  // starts at creation (the shipped default from the cutover on). Absent =
  // the legacy opening — every pre-cutover stamp (BR-1..4) stays
  // byte-identical, and a replayer knows which door the run came in through.
  openingEra?: "deck";
}

// Engine-side truth for one resolved step.
export interface TraceRecord {
  type: "trace";
  step: number;
  day: number;
  card: string;                                   // event id that fired
  choiceIndex: number;
  choiceLabel: string;
  statDeltas: Record<string, number>;             // changed stats only
  flagsChanged: Record<string, boolean | number | string>;
  roll: { tag: string; target: number; die: number; mod: number; total: number; success: boolean } | null;
  // Reserved for Batch 3 (band-select). Empty until then; present now so
  // Batch-2 streams stay parseable against Batch-3 ones.
  band: { trueBand: string | null; resolvedBand: string | null };
  // The exposure meter at this card's fire (Phase 2, ratified: the stage-fire
  // pacing snapshot is FIRST-CLASS, not reconstructed). Additive within schema
  // v1 — readers tolerate its absence on pre-Phase-2 streams; the transcript
  // renderer does not print it, so frozen transcripts are unchanged.
  exposure: number;
  // The clue-tier stamp (the drip's provability model), derived at fire —
  // PRESENT only on resolutions of clue-carrying cards, so every pre-drip
  // stream and every clueless resolution stays byte-identical. Cause-side
  // telemetry only: no renderer prints any of this ("log the cause, never
  // the effect" — the fence-lint guards the renderer side).
  clue?: {
    anchor: string;
    antidoted: boolean;
    centroidAtFire: Record<string, number>;
    tierLanded: 1 | 2 | 3;
  };
}

// What the reader actually SAW for one screen — prose + ALL options (incl. greyed).
export interface PresentationRecord {
  type: "presentation";
  step: number;
  card: string;
  prose: string;
  // lockedReason (additive, day screens): the diegetic fatigue line the reader
  // actually saw on an energy-greyed option - presentation truth, so the
  // transcript can render exactly what was shown.
  options: { index: number; label: string; available: boolean; showWhenLocked: boolean; lockedReason?: string; cost?: number; moneyCost?: number }[];
}

// Operator-entered: the reader's think-aloud for the step, and the pick.
export interface ReaderRecord {
  type: "reader";
  step: number;
  card: string;
  note: string;
  pick: number;
  pickLabel: string;
}

// Appended once after the session ends (operator pastes the §3 Q&A).
export interface DebriefRecord {
  type: "debrief";
  qa: { q: string; a: string }[];
  operatorNotes?: string;
}

export type StreamRecord = TraceRecord | PresentationRecord | ReaderRecord | DebriefRecord;

export interface Stream {
  stamp: StreamStamp;
  records: StreamRecord[];
}

export class Recorder {
  readonly stamp: StreamStamp;
  private records: StreamRecord[] = [];

  constructor(stamp: Omit<StreamStamp, "schemaVersion">) {
    this.stamp = { ...stamp, schemaVersion: SCHEMA_VERSION };
  }

  pushPresentation(r: Omit<PresentationRecord, "type">): void { this.records.push({ type: "presentation", ...r }); }
  pushReader(r: Omit<ReaderRecord, "type">): void { this.records.push({ type: "reader", ...r }); }
  pushTrace(r: Omit<TraceRecord, "type">): void { this.records.push({ type: "trace", ...r }); }
  appendDebrief(r: Omit<DebriefRecord, "type">): void { this.records.push({ type: "debrief", ...r }); }

  stream(): Stream { return { stamp: this.stamp, records: this.records.slice() }; }
  toJSON(): string { return JSON.stringify(this.stream(), null, 2); }
}
