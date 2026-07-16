// ============================================================================
// engine/creation.ts — THE START-DECK (spec v3.3 §7, built to Armature's review).
// Dean's shape: the first events are a fixed intro/menu (creationCommon), then a
// start card is DRAWN and it decides the scenario (family reunion, doctor visit,
// …). This module is the deal + the interactive front; newGame (engine.ts) is
// the pure finalizer that applies whatever the deal produced.
//
// TWO DECISIONS FROM THE §11.3 REVIEW, realized here:
//  · A separate CreationRunner (mirrors SceneRunner: prose + numbered screens),
//    NOT a callback into newGame — so newGame stays a pure finalizer the bots and
//    harnesses call headlessly, and a Run Read genuinely starts at creation
//    through the same screen shape.
//  · The deal draws from a CREATION-SCOPED derived stream, NOT the game RNG:
//    `randFloat` on a local state seeded from `dealSeed(seed)`. So gameplay RNG
//    starts identically for every run of a seed — dealt, pinned, or re-specced —
//    and is immune to creation-content changes. (Same discipline the bots use:
//    the game RNG advances only through gameplay.)
//
// THE PROFILE is pre-game scratch — the keys the common answers write, read only
// by the deal's qualifiers, never game state (no-stored-disposition). The deal
// is invisible at the surface (no-catalog): the reader answers and a life begins.
// ============================================================================

import type { ContentDB, GameState, StartDef, CreationQuestion, Stats } from "./types";
import type { SceneScreen, PickResult } from "./scene";
import { evalCondition } from "./engine";
import { seedToState, randFloat } from "./rng";

export type Profile = Record<string, boolean | number | string>;

export interface CreationResult {
  startId: string;
  answers: number[];     // common answers followed by the dealt start's specialized answers
  townId: string;
  tier: GameState["tier"];
}

export interface CreationHooks {
  onScreen?: (screen: SceneScreen) => void;
}

const ZERO_STATS: Stats = { money: 0, energy: 0, energyMax: 0, tradecraft: 0, standing: 0, exposure: 0, grip: 0 };

// A fixed offset from the game seed, so the deal's stream is seed-derived but
// disjoint from the gameplay stream (which starts at seedToState(seed)).
function dealSeed(seed: number): number {
  return ((seedToState(seed) ^ 0x9e3779b9) >>> 0) || 1;
}

// The pre-game profile: every `profile` key the chosen common answers write.
export function buildProfile(commonQs: CreationQuestion[], commonAnswers: number[]): Profile {
  const profile: Profile = {};
  commonQs.forEach((question, i) => {
    const ans = question.answers[commonAnswers[i] ?? 0];
    if (ans?.profile) Object.assign(profile, ans.profile);
  });
  return profile;
}

// THE DEAL: pick one eligible start, weighted, from the creation-scoped stream.
// Eligibility = qualifiers pass against the profile (unqualified starts are
// always eligible — the linter guarantees at least one, so the pool is never
// empty). Deterministic: same seed + same profile ⇒ same start.
export function dealStart(db: ContentDB, seed: number, profile: Profile): StartDef {
  const starts = db.starts ?? [];
  if (!starts.length) throw new Error("dealStart: db.starts is empty");
  // The profile as a condition-view: qualifiers read it as flags (flag/noflag/
  // counter). Stats are zeroed — qualifiers gate on the profile, not on stats.
  const view = { flags: profile, player: { stats: ZERO_STATS } } as unknown as GameState;
  const eligible = starts.filter((s) => !s.qualifiers || evalCondition(s.qualifiers, view));
  const pool = eligible.length ? eligible : starts.filter((s) => !s.qualifiers);
  // The linter's fallback-totality rule makes this unreachable on linted
  // content; the throw is for a db that skipped the linter (a silent undefined
  // here would surface as a crash three calls later).
  if (!pool.length) throw new Error("dealStart: no eligible start and no unqualified fallback");
  const draw = { rngState: seedToState(dealSeed(seed)) };
  const total = pool.reduce((sum, s) => sum + (s.weight ?? 1), 0);
  let r = randFloat(draw) * total;
  for (const s of pool) { r -= (s.weight ?? 1); if (r < 0) return s; }
  return pool[pool.length - 1];
}

// Headless resolve (bots / harnesses / a pinned start): deal from the common
// answers, return the finalize-ready result. Specialized answers default to
// option 0 in newGame, so callers may omit them.
export function resolveCreation(
  db: ContentDB, seed: number, commonAnswers: number[] = [], specializedAnswers: number[] = [],
): CreationResult {
  const start = dealStart(db, seed, buildProfile(db.creationCommon ?? [], commonAnswers));
  return {
    startId: start.id,
    answers: [...commonAnswers, ...specializedAnswers],
    townId: start.townId,
    tier: start.tier,
  };
}

// The interactive front: presents each creation question as a screen (prose +
// numbered options), deals silently at the phase boundary, and on completion
// exposes `result` (a CreationResult the caller hands to newGame). Mirrors
// SceneRunner so a console drives it identically and the Run Read starts here.
export class CreationRunner {
  current: SceneScreen = { step: 0, card: "", prose: "", options: [] };
  done = false;
  result?: CreationResult;

  private db: ContentDB;
  private seed: number;
  private hooks: CreationHooks;
  private commonQs: CreationQuestion[];
  private specQs: CreationQuestion[] = [];
  private commonAnswers: number[] = [];
  private specializedAnswers: number[] = [];
  private phase: "common" | "specialized" = "common";
  private qIndex = 0;
  private dealt?: StartDef;
  private step = 0;
  // THE FOLD (the option-less beat, Armature-approved option 1): a question
  // with NO answers is a BEAT - it lands and passes. Its prose stashes here
  // and folds above the next real screen (the one-narration rule at creation).
  private pendingBeat = "";
  // Rider (a): a TRAILING beat (nothing presents after it) rides out to the
  // caller - LoopSession threads it into the first gameplay screen via the
  // same endProse seam the scene fold uses.
  trailingProse = "";

  constructor(db: ContentDB, opts: { seed: number }, hooks?: CreationHooks) {
    this.db = db;
    this.seed = opts.seed;
    this.hooks = hooks ?? {};
    this.commonQs = db.creationCommon ?? [];
    if (!(db.starts && db.starts.length)) throw new Error("CreationRunner: db.starts is empty");
    this.settle();
  }

  // Present the current question; at the common→specialized boundary, deal
  // first; when both phases are exhausted, finish. Option-less BEATS never
  // present - their prose folds forward (across the deal boundary too, so a
  // beat placed last in the common phase folds into the first affinity
  // screen). Beats are INERT by construction (rider b): no answers means no
  // profile write, no attune seed, and no consumed answer slot - answers stay
  // question-indexed, so newGame's existing answers[i] lookup skips the holes.
  private settle(): void {
    for (;;) {
      if (this.phase === "common" && this.qIndex >= this.commonQs.length) {
        this.dealt = dealStart(this.db, this.seed, buildProfile(this.commonQs, this.commonAnswers));
        this.specQs = this.dealt.questions ?? [];
        this.phase = "specialized";
        this.qIndex = 0;
      }
      const qs = this.phase === "common" ? this.commonQs : this.specQs;
      const question = qs[this.qIndex];
      if (question && question.answers.length === 0) {
        this.pendingBeat += (this.pendingBeat ? "\n\n" : "") + question.q;
        this.qIndex += 1;
        continue;   // the beat lands and passes - nothing pauses, nothing asks
      }
      if (this.phase === "specialized" || this.qIndex < qs.length) break;
    }
    const qs = this.phase === "common" ? this.commonQs : this.specQs;
    if (this.qIndex < qs.length) {
      const question = qs[this.qIndex];
      this.step += 1;
      this.current = {
        step: this.step,
        card: this.phase === "common" ? "__creation_common__" : "__creation_start__",
        prose: (this.pendingBeat ? this.pendingBeat + "\n\n" : "") + question.q,
        options: question.answers.map((a, i) => ({ index: i, label: a.label, available: true, showWhenLocked: false })),
      };
      this.pendingBeat = "";
      this.hooks.onScreen?.(this.current);
      return;
    }
    this.finish();
  }

  private finish(): void {
    this.done = true;
    this.trailingProse = this.pendingBeat;   // rider (a): the trailing beat rides out
    this.pendingBeat = "";
    const start = this.dealt!;
    this.result = {
      startId: start.id,
      answers: [...this.commonAnswers, ...this.specializedAnswers],
      townId: start.townId,
      tier: start.tier,
    };
    this.step += 1;
    this.current = { step: this.step, card: "__creation_done__", prose: "", options: [] };
    this.hooks.onScreen?.(this.current);
  }

  checkPick(idx: number): PickResult {
    if (this.done) return { ok: false, reason: "creation over" };
    const qs = this.phase === "common" ? this.commonQs : this.specQs;
    const question = qs[this.qIndex];
    if (!question || idx < 0 || idx >= question.answers.length) return { ok: false, reason: "no such option" };
    return { ok: true };
  }

  pick(idx: number): PickResult {
    const check = this.checkPick(idx);
    if (!check.ok) return check;
    if (this.phase === "common") this.commonAnswers[this.qIndex] = idx;
    else this.specializedAnswers[this.qIndex] = idx;
    this.qIndex += 1;
    this.settle();
    return { ok: true };
  }
}
