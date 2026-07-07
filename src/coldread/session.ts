// ============================================================================
// coldread/session.ts — the thin interactive layer over the engine. ONE Session
// wraps a SceneRunner (engine/scene.ts, the shared scene model) and emits the
// trace/presentation/reader stream via its Recorder; both front-ends (the
// scripted driver and the interactive CLI) go through it (the invariant:
// everything that wants a trace goes through Session).
//
// Since WO-1a the scene mechanics live in the recorder-agnostic SceneRunner;
// this file only adds what a COLD READ needs: the Recorder wiring (presentation
// + trace fall out of the runner's hooks), the reader records (think-aloud +
// picks), and the debrief. The reader NEVER sees stats, dice, flags, or card
// ids — only prose and numbered options. Determinism: same seed + same picks
// => byte-identical presentation.
// ============================================================================

import type { ContentDB, GameState, LocationAction } from "../engine/types";
import { newGame, availableActions } from "../engine/engine";
import { SceneRunner } from "../engine/scene";
import type { SceneScreen, PickResult } from "../engine/scene";
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

export type Screen = SceneScreen;
export type { PickResult };

export class Session {
  readonly recorder: Recorder;
  private g: GameState;
  private db: ContentDB;
  private mode: "read" | "bot";
  private runner: SceneRunner;
  nudgeUsed = false;

  constructor(db: ContentDB, opts: SessionOpts) {
    this.db = db;
    this.mode = opts.mode ?? "read";
    this.recorder = new Recorder({ contentId: opts.contentId, buildTag: opts.buildTag, seed: opts.seed });
    this.g = newGame(
      { seed: opts.seed, name: "You", age: 25, body: { height: 0.5, build: 0.5 }, tier: opts.tier, townId: opts.townId },
      db,
    );
    const action = db.actions.find((a) => a.id === opts.entryActionId) as LocationAction | undefined;
    if (!action) throw new Error(`entry action not found: ${opts.entryActionId}`);
    if (!availableActions(this.g, db).some((a) => a.id === action.id)) throw new Error(`entry action not available: ${action.id}`);
    this.runner = new SceneRunner(this.g, db, {
      onScreen: (s) => {
        if (this.mode === "read") this.recorder.pushPresentation({ step: s.step, card: s.card, prose: s.prose, options: s.options });
      },
      onResolve: (r) => {
        this.recorder.pushTrace({
          step: r.step, day: r.day, card: r.card,
          choiceIndex: r.choiceIndex, choiceLabel: r.choiceLabel,
          statDeltas: r.statDeltas, flagsChanged: r.flagsChanged,
          roll: r.roll,
          band: { trueBand: null, resolvedBand: null },   // reserved (Batch 3)
        });
      },
    });
    this.runner.beginWithAction(action);
  }

  get current(): Screen { return this.runner.current; }
  get done(): boolean { return this.runner.done; }

  // Resolve the reader's pick. Returns {ok:false, reason} for an out-of-range or
  // greyed (showWhenLocked) option WITHOUT advancing — the CLI prints the refusal
  // and re-prompts; a real player can't take it either. The reader record is
  // written only for picks that will actually resolve.
  pick(idx: number, note = ""): PickResult {
    const check = this.runner.checkPick(idx);
    if (!check.ok) return check;
    if (this.mode === "read") {
      this.recorder.pushReader({
        step: this.current.step, card: this.current.card,
        note, pick: idx, pickLabel: this.current.options[idx].label,
      });
    }
    return this.runner.pick(idx);
  }

  appendDebrief(qa: { q: string; a: string }[], operatorNotes?: string): void {
    this.recorder.appendDebrief({ qa, operatorNotes });
  }
}
