// ============================================================================
// coldread/session.ts — the thin interactive layer over the engine. ONE Session
// wraps the engine loop and emits the trace/presentation/reader stream via its
// Recorder; both front-ends (the scripted driver and the interactive CLI) go
// through it (the invariant: everything that wants a trace goes through Session).
//
// The reader NEVER sees stats, dice, flags, or card ids — only prose and
// numbered options. Rolls surface only as their prose outcomes. Determinism:
// same seed + same picks => byte-identical presentation (the engine's RNG is
// seeded and the cave is queue-driven, so nothing here adds unseeded noise).
// ============================================================================

import type { ContentDB, GameState, GameEvent, LocationAction, Stats } from "../engine/types";
import {
  newGame, availableActions, takeAction, nextQueuedEvent, resolveChoice,
  continueRoll, choiceAvailable,
} from "../engine/engine";
import { Recorder } from "./recorder";

export interface SessionOpts {
  contentId: string;
  seed: number;
  buildTag: string;
  entryActionId: string;   // the daily-loop hook that sets the scene up and queues the first card
  tier: GameState["tier"];
  townId: string;
  mode?: "read" | "bot";   // "read" (default) emits trace+presentation+reader; "bot" emits trace only (telemetry backbone)
}

export interface Screen {
  step: number;
  card: string;
  prose: string;
  options: { index: number; label: string; available: boolean; showWhenLocked: boolean }[];
}

export interface PickResult { ok: boolean; reason?: string }

const STAT_KEYS: (keyof Stats)[] = ["money", "energy", "energyMax", "tradecraft", "standing", "exposure", "grip"];

function diffStats(before: Stats, after: Stats): Record<string, number> {
  const out: Record<string, number> = {};
  for (const k of STAT_KEYS) if (after[k] !== before[k]) out[k] = after[k] - before[k];
  return out;
}
function diffFlags(before: Record<string, unknown>, after: Record<string, unknown>): Record<string, boolean | number | string> {
  const out: Record<string, boolean | number | string> = {};
  for (const k of Object.keys(after)) if (after[k] !== before[k]) out[k] = after[k] as boolean | number | string;
  return out;
}

export class Session {
  readonly recorder: Recorder;
  private g: GameState;
  private db: ContentDB;
  private mode: "read" | "bot";
  private stepCounter = 0;
  private currentEvent: GameEvent | null = null;
  private pendingNarration = "";
  current: Screen = { step: 0, card: "", prose: "", options: [] };
  done = false;
  nudgeUsed = false;

  constructor(db: ContentDB, opts: SessionOpts) {
    this.db = db;
    this.mode = opts.mode ?? "read";
    this.recorder = new Recorder({ contentId: opts.contentId, buildTag: opts.buildTag, seed: opts.seed });
    this.g = newGame(
      { seed: opts.seed, name: "You", age: 25, body: { height: 0.5, build: 0.5 }, tier: opts.tier, townId: opts.townId },
      db,
    );
    // Scene start, option (b): run the entry action to set the scene up mechanically
    // (grants gear, sets flags, queues the first card), and present its authored
    // flavor as unnumbered opening narration — the orientation a real player has.
    const action = db.actions.find((a) => a.id === opts.entryActionId) as LocationAction | undefined;
    if (!action) throw new Error(`entry action not found: ${opts.entryActionId}`);
    if (!availableActions(this.g, db).some((a) => a.id === action.id)) throw new Error(`entry action not available: ${action.id}`);
    takeAction(this.g, db, action);
    this.pendingNarration = [action.sub, action.outcome.log].filter(Boolean).join("\n\n");
    this.advance();
  }

  private advance(): void {
    const ev = nextQueuedEvent(this.g, this.db);   // queue-only: the scene ends when the queue empties
    this.stepCounter += 1;
    if (!ev) {
      this.done = true;
      this.currentEvent = null;
      const prose = this.pendingNarration.trim();
      this.current = { step: this.stepCounter, card: "__end__", prose, options: [] };
      if (this.mode === "read") this.recorder.pushPresentation({ step: this.stepCounter, card: "__end__", prose, options: [] });
      this.pendingNarration = "";
      return;
    }
    this.currentEvent = ev;
    const prose = (this.pendingNarration ? this.pendingNarration + "\n\n" : "") + ev.body;
    this.pendingNarration = "";
    const options = ev.choices.map((c, i) => ({
      index: i, label: c.label, available: choiceAvailable(this.g, c), showWhenLocked: !!c.showWhenLocked,
    }));
    this.current = { step: this.stepCounter, card: ev.id, prose, options };
    if (this.mode === "read") this.recorder.pushPresentation({ step: this.stepCounter, card: ev.id, prose, options });
  }

  // Resolve the reader's pick. Returns {ok:false, reason} for an out-of-range or
  // greyed (showWhenLocked) option WITHOUT advancing — the CLI prints the refusal
  // and re-prompts; a real player can't take it either.
  pick(idx: number, note = ""): PickResult {
    if (this.done || !this.currentEvent) return { ok: false, reason: "session over" };
    const opt = this.current.options[idx];
    if (!opt) return { ok: false, reason: "no such option" };
    if (!opt.available) return { ok: false, reason: "unavailable" };

    const ev = this.currentEvent;
    const step = this.current.step;
    if (this.mode === "read") this.recorder.pushReader({ step, card: ev.id, note, pick: idx, pickLabel: ev.choices[idx].label });

    const beforeStats: Stats = { ...this.g.player.stats };
    const beforeFlags = { ...this.g.flags };
    const dayBefore = this.g.day;
    const logLenBefore = this.g.log.length;

    const res = resolveChoice(this.g, this.db, ev, idx);
    let roll: import("./recorder").TraceRecord["roll"] = null;
    if (res.roll) {
      const r = res.roll;
      roll = { tag: r.tag, target: r.target, die: r.die, mod: r.mod, total: r.total, success: r.success };
      continueRoll(this.g, this.db, r);
    }

    // New log entries (newest-first in g.log) → chronological narration for the next screen.
    const added = this.g.log.slice(0, this.g.log.length - logLenBefore).map((l) => l.text).reverse();
    this.pendingNarration = added.join("\n\n");

    this.recorder.pushTrace({
      step, day: dayBefore, card: ev.id,
      choiceIndex: idx, choiceLabel: ev.choices[idx].label,
      statDeltas: diffStats(beforeStats, this.g.player.stats),
      flagsChanged: diffFlags(beforeFlags, this.g.flags),
      roll,
      band: { trueBand: null, resolvedBand: null },   // reserved (Batch 3)
    });

    this.advance();
    return { ok: true };
  }

  appendDebrief(qa: { q: string; a: string }[], operatorNotes?: string): void {
    this.recorder.appendDebrief({ qa, operatorNotes });
  }
}
