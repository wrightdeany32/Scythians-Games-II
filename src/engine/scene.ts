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
//  - greyed (showWhenLocked) options render but refuse resolution.
//  - determinism: same seed + same picks ⇒ byte-identical screens.
// ============================================================================

import type {
  ContentDB, GameState, GameEvent, LocationAction, Stats,
} from "./types";
import {
  takeAction, nextQueuedEvent, resolveChoice, continueRoll, choiceAvailable,
} from "./engine";

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

export class SceneRunner {
  current: SceneScreen = { step: 0, card: "", prose: "", options: [] };
  done = false;
  private stepCounter = 0;
  private currentEvent: GameEvent | null = null;
  private pendingNarration = "";

  constructor(
    private g: GameState,
    private db: ContentDB,
    private hooks: SceneHooks = {},
  ) {}

  // Scene start "option (b)" (Batch 2, ratified): run the entry action so the
  // mechanics land (energy spend, grants, flags, the queued first card), and
  // present its authored flavor — sub + outcome log — as unnumbered opening
  // narration: the orientation a real player has. Caller validates availability
  // and energy first (Session throws; the loop's runAction refuses politely).
  beginWithAction(action: LocationAction): void {
    const res = takeAction(this.g, this.db, action);
    const parts = [action.sub, action.outcome.log].filter(Boolean) as string[];
    if (res.roll) {
      continueRoll(this.g, this.db, res.roll);
      const branch = res.roll.success ? res.roll.win : res.roll.lose;
      if (branch.log) parts.push(branch.log);   // roll-branch narration follows the authored flavor
    }
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
    const opt = this.current.options[idx];
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
      const prose = this.pendingNarration.trim();
      this.current = { step: this.stepCounter, card: "__end__", prose, options: [] };
      this.hooks.onScreen?.(this.current);
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
    this.hooks.onScreen?.(this.current);
  }
}
