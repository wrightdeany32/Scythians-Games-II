// ============================================================================
// engine/scene.ts — the SceneRunner: ONE scene model for every consumer (the
// cold-read Session, the daily loop, the cave, and creation-as-turn-zero).
// Extracted from coldread/session.ts (WO-1a) so there is a single code path
// that drives a queue-chained scene: present a screen, take a pick, resolve,
// fold the narration, advance until the queue empties.
//
// RECORDER-AGNOSTIC by design: this file knows nothing about the trace layer.
// Callers that want telemetry wire the hooks (the cold-read Session maps them
// onto its Recorder — presentation/trace records fall out of onScreen/onResolve
// for free). The ratified invariant is unchanged: everything that wants a
// COLD-READ trace goes through Session; the hooks are how Session feeds it.
//
// The scene contract (Batch 2, kept exactly):
//  - advance is QUEUE-ONLY (nextQueuedEvent) — the scene ends when the queue
//    empties; "exit the scene" is a choice that queues nothing.
//  - the player-facing screen carries prose + numbered options only — no stats,
//    no dice, no card ids; rolls surface only as their prose outcomes.
//  - locked options: showWhenLocked ⇒ greyed-but-visible (refuses resolution);
//    otherwise NOT PRESENT on the screen (bookkeeping twins never show).
//    `index` is the engine index — consoles print positionally and translate.
//  - determinism: same seed + same picks ⇒ byte-identical screens.
// ============================================================================

import type {
  ContentDB, GameState, GameEvent, GripBand, LocationAction, Stats,
} from "./types";
import {
  takeAction, nextQueuedEvent, resolveChoice, continueRoll, choiceAvailable,
  resolveBand, evalCondition,
} from "./engine";
import { lensCentroid } from "./centroid";

// What the player (or reader) sees for one step of a scene.
export interface SceneScreen {
  step: number;
  card: string;    // event id, or "__end__" on the closing screen
  prose: string;
  options: { index: number; label: string; available: boolean; showWhenLocked: boolean }[];
}

// Engine-side truth for one resolved step — the raw material of a trace record.
export interface SceneResolution {
  step: number;
  day: number;
  card: string;
  choiceIndex: number;
  choiceLabel: string;
  statDeltas: Record<string, number>;
  flagsChanged: Record<string, boolean | number | string>;
  roll: { tag: string; target: number; die: number; mod: number; total: number; success: boolean } | null;
  // Band-select (Contract 2), FROZEN at this card's fire — null for unbanded
  // cards. resolvedBand chose the presented variant; telemetry audits the leak.
  band: { trueBand: GripBand; resolvedBand: GripBand } | null;
  // The exposure meter at THIS card's fire, frozen like band (ratified round
  // decision: the snapshot is first-class on fire records, not reconstructed).
  // On every resolution — a stage-fire record reads its trigger value here,
  // and statDeltas already carries what the resolution then did to the meter.
  exposure: number;
  // The clue-tier stamp (the provability model), DERIVED at fire from the
  // card's authored anchor × the player's lens centroid — null for clueless
  // cards. NEVER stored on GameState and NEVER rendered: this is cause-side
  // telemetry ("log the cause, never the effect"), frozen at fire like band
  // and exposure. The tier law: an authored antidote lands free (1); an
  // anchor matching the player's dominant lens crowns (3); cross-type — or a
  // player with no lens history yet — creaks (2).
  clue: {
    anchor: string;
    antidoted: boolean;
    centroidAtFire: Record<string, number>;
    tierLanded: 1 | 2 | 3;
  } | null;
}

export interface SceneHooks {
  onScreen?: (screen: SceneScreen) => void;        // fires for every screen, incl. the "__end__" screen
  onResolve?: (res: SceneResolution) => void;      // fires once per resolved pick, before the next screen
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

// The dominant lens: the flavor carrying strictly the most affinity mass —
// keys walked in sorted order so a dead tie lands deterministically (first
// alphabetically). Null for an empty centroid (no lens history yet).
function dominantLens(centroid: Record<string, number>): string | null {
  let best: string | null = null;
  let bestW = 0;
  for (const k of Object.keys(centroid).sort()) {
    if (centroid[k] > bestW) { best = k; bestW = centroid[k]; }
  }
  return best;
}

// The provability stamp, derived ONCE at card fire (exported for the crits).
// Pure derivation — no RNG, nothing written to GameState, nothing rendered.
// Tier law (ratified in the drip design round): authored antidote → 1 (lands
// free); anchor === the player's dominant lens → 3 (crowns — the lens that
// loves this clue-type most makes the player hold it hardest); cross-type or
// no lens history → 2 (creaks). The centroid snapshot rides along so the
// analyst can audit the landing without reconstructing state.
export function landClue(g: GameState, db: ContentDB, ev: GameEvent): SceneResolution["clue"] {
  if (!ev.clue) return null;
  const centroidAtFire = lensCentroid(g, db);
  const dominant = dominantLens(centroidAtFire);
  const tierLanded: 1 | 2 | 3 = ev.clue.antidoted ? 1 : dominant === ev.clue.anchor ? 3 : 2;
  return { anchor: ev.clue.anchor, antidoted: !!ev.clue.antidoted, centroidAtFire, tierLanded };
}

export class SceneRunner {
  current: SceneScreen = { step: 0, card: "", prose: "", options: [] };
  done = false;
  private stepCounter = 0;
  private currentEvent: GameEvent | null = null;
  private currentBand: { trueBand: GripBand; resolvedBand: GripBand } | null = null;
  private currentExposure = 0;   // frozen at card fire, like currentBand
  private currentClue: SceneResolution["clue"] = null;   // likewise frozen at fire
  private pendingNarration = "";

  constructor(
    private g: GameState,
    private db: ContentDB,
    private hooks: SceneHooks = {},
  ) {}

  // Scene start "option (b)" (Batch 2, ratified): run the entry action so the
  // mechanics land (energy spend, grants, flags, the queued first card), and
  // open with the action's `sub` followed by what actually HAPPENED — folded
  // from the log exactly like every later step, one narration rule throughout.
  // For the ordinary case that is `sub` + the outcome's log line, byte-for-byte
  // what the frozen cold-read transcripts carry. If the action is refused
  // (too tired), only the refusal line shows — never the flavor of an action
  // that didn't run. An entry-action roll is continued and narrated (the old
  // Session silently dropped entry rolls; this is the deliberate fix).
  beginWithAction(action: LocationAction): void {
    const logLenBefore = this.g.log.length;
    const refused = this.g.player.stats.energy < action.cost;
    const res = takeAction(this.g, this.db, action);
    if (res.roll) continueRoll(this.g, this.db, res.roll);
    const added = this.g.log.slice(0, this.g.log.length - logLenBefore).map((l) => l.text).reverse();
    const parts = refused ? added : [action.sub, ...added].filter(Boolean);
    this.pendingNarration = parts.join("\n\n");
    this.advance();
  }

  // Scene start from whatever is already queued (creation-as-turn-zero, the
  // opening queue, a door/scheduled beat firing at day start). If the queue is
  // empty the scene is immediately done — the "__end__" screen carries any
  // opening narration and the day resumes.
  begin(openingNarration = ""): void {
    this.pendingNarration = openingNarration;
    this.advance();
  }

  // Would this pick be accepted? Split from pick() so wrappers (the Session)
  // can record reader intent only for picks that will actually resolve.
  checkPick(idx: number): PickResult {
    if (this.done || !this.currentEvent) return { ok: false, reason: "scene over" };
    // idx is the ENGINE index; the options list is filtered (hidden-locked
    // choices absent), so look the option up by its index field — a hidden
    // choice is unpickable by construction (not on the screen ⇒ no such option).
    const opt = this.current.options.find((o) => o.index === idx);
    if (!opt) return { ok: false, reason: "no such option" };
    if (!opt.available) return { ok: false, reason: "unavailable" };
    return { ok: true };
  }

  // Resolve a pick. Refuses (without advancing) exactly the picks checkPick
  // refuses — a greyed option can be seen but never taken.
  pick(idx: number): PickResult {
    const check = this.checkPick(idx);
    if (!check.ok) return check;

    const ev = this.currentEvent!;
    const step = this.current.step;
    const beforeStats: Stats = { ...this.g.player.stats };
    const beforeFlags = { ...this.g.flags };
    const dayBefore = this.g.day;
    const logLenBefore = this.g.log.length;

    const res = resolveChoice(this.g, this.db, ev, idx);
    let roll: SceneResolution["roll"] = null;
    if (res.roll) {
      const r = res.roll;
      roll = { tag: r.tag, target: r.target, die: r.die, mod: r.mod, total: r.total, success: r.success };
      continueRoll(this.g, this.db, r);
    }

    // New log entries (newest-first in g.log) → chronological narration for the next screen.
    const added = this.g.log.slice(0, this.g.log.length - logLenBefore).map((l) => l.text).reverse();
    this.pendingNarration = added.join("\n\n");

    this.hooks.onResolve?.({
      step, day: dayBefore, card: ev.id,
      choiceIndex: idx, choiceLabel: ev.choices[idx].label,
      statDeltas: diffStats(beforeStats, this.g.player.stats),
      flagsChanged: diffFlags(beforeFlags, this.g.flags),
      roll,
      band: this.currentBand,   // frozen at fire — never re-rolled between fire and resolve
      exposure: this.currentExposure,   // likewise frozen at fire (the stage-pacing snapshot)
      clue: this.currentClue,   // likewise frozen at fire (the provability stamp)
    });

    this.advance();
    return { ok: true };
  }

  private advance(): void {
    const ev = nextQueuedEvent(this.g, this.db);   // queue-only: the scene ends when the queue empties
    this.stepCounter += 1;
    if (!ev) {
      this.done = true;
      this.currentEvent = null;
      this.currentBand = null;
      this.currentClue = null;
      const prose = this.pendingNarration.trim();
      this.current = { step: this.stepCounter, card: "__end__", prose, options: [] };
      this.hooks.onScreen?.(this.current);
      this.pendingNarration = "";
      return;
    }
    this.currentEvent = ev;
    // Resolve-noise-once (Contract 2): a banded card resolves its band HERE, at
    // fire — once, frozen for this fire, selecting an authored variant of the
    // body. Unbanded cards never touch the resolver (and consume no RNG).
    this.currentBand = ev.bandText ? resolveBand(this.g, this.db, this.g.player.stats.grip, ev.noiseProfile) : null;
    this.currentExposure = this.g.player.stats.exposure;   // fire-time snapshot for the resolution record
    this.currentClue = landClue(this.g, this.db, ev);      // derived at fire, never authored, never stored
    // Conditional card text, evaluated once at fire and frozen: the base is the
    // band variant (banded cards) or the first matching bodyVariant (the
    // charge-gate pattern), else `body`; every matching bodyExtra appends in
    // authored order (the thread-echo pattern). Pure condition reads — no RNG.
    let body = (this.currentBand && ev.bandText?.[this.currentBand.resolvedBand]) || ev.body;
    if (!ev.bandText && ev.bodyVariants) {
      const variant = ev.bodyVariants.find((v) => evalCondition(v.when, this.g));
      if (variant) body = variant.text;
    }
    if (ev.bodyExtras) {
      for (const extra of ev.bodyExtras) if (evalCondition(extra.when, this.g)) body += "\n\n" + extra.text;
    }
    const prose = (this.pendingNarration ? this.pendingNarration + "\n\n" : "") + body;
    this.pendingNarration = "";
    // THE SCREEN IS THE ALLOWLIST (Courier's dry-run catch): a locked choice
    // without showWhenLocked is bookkeeping (a requires-gated twin, a retired
    // line) and must NOT PRESENT — greyed-visible is an authored opt-in
    // (showWhenLocked: true), never the default. `index` stays the ENGINE
    // index (resolveChoice's coordinate), so filtering never renumbers picks;
    // consoles print positionally and translate.
    const options = ev.choices
      .map((c, i) => ({
        index: i, label: c.label, available: choiceAvailable(this.g, c), showWhenLocked: !!c.showWhenLocked,
      }))
      .filter((o) => o.available || o.showWhenLocked);
    this.current = { step: this.stepCounter, card: ev.id, prose, options };
    this.hooks.onScreen?.(this.current);
  }
}
