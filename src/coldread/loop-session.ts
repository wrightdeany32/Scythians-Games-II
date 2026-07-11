// ============================================================================
// coldread/loop-session.ts — the loop-level cold-read console (Courier's gap:
// the harness only knew ONE queue-chained scene, but the game is a daily-loop
// campaign). LoopSession is to the loop what Session is to a single scene: it
// wraps the loop verbs (dayMenu / runAction / advanceDay / runStatus, and the
// startQueuedScene morning-pickup) and emits the SAME trace/presentation/reader
// stream through one Recorder — so a human or AI reader can play a whole run
// (mornings, scheduled beats, the day menu, scenes, the terminal) and a
// transcript builds exactly the way a cave read's does.
//
// THE UNIFIED SCREEN: a reader always faces prose + numbered options. Two shapes
// wear that costume — a SCENE screen (a queued morning beat, or an action's
// scene, presented by the shared SceneRunner) and a DAY screen (the menu: the
// day's actions by their diegetic names, plus "call it a day"). The reader never
// sees ids, costs, energy numbers, stats, flags, or card ids (the WO-4 surface
// guard; Courier's ask) — an action you're too tired to take renders greyed, the
// way a scene's locked option does, and nothing mechanical reaches the prose.
//
// Determinism: same seed + same picks => byte-identical presentation (the cave
// contract, now at loop scale). Cross-run (opts.crossRun): a new vessel arrives
// in the world a prior one left — the harvest seeds inject at newGame, so the
// Denise -> Dale collision (a two-vessel beat) is finally readable end to end.
// ============================================================================

import type { ContentDB, GameState, CrossRunStore, LocationAction } from "../engine/types";
import { newGame, harvestCrossRun } from "../engine/engine";
import { dayMenu, runAction, startQueuedScene, advanceDay } from "../engine/loop";
import { runStatus } from "../engine/loop";
import { journalLines } from "../engine/journal";
import { SceneRunner } from "../engine/scene";
import type { SceneHooks, PickResult } from "../engine/scene";
import { Recorder } from "./recorder";

export interface LoopSessionOpts {
  contentId: string;
  seed: number;
  buildTag: string;
  tier: GameState["tier"];
  townId: string;
  mode?: "read" | "bot";       // "read" (default): trace+presentation+reader; "bot": trace only
  crossRun?: CrossRunStore;    // a prior vessel's harvest — §3 (the cross-run collision, readable)
  showJournal?: boolean;       // fold journalLines into the day screen — a DESIGN call, default OFF
  playerName?: string;
}

export type LoopScreenKind = "scene" | "day" | "end";

// The one screen a reader ever faces — prose + numbered options — whichever
// shape (scene / day / end) is under it. No mechanical fields ever populate it.
export interface LoopScreen {
  kind: LoopScreenKind;
  step: number;
  card: string;                // scene card id, or "__day__", or "__run_over__"
  prose: string;
  options: { index: number; label: string; available: boolean }[];
  day: number;
  dateLabel?: string;
  over: boolean;
  terminal?: string;           // the terminal flag/cause, on the end screen only
}

const END_LABEL = "Call it a day.";

export class LoopSession {
  readonly recorder: Recorder;
  private g: GameState;
  private db: ContentDB;
  private mode: "read" | "bot";
  private showJournal: boolean;
  private hooks: SceneHooks;
  private scene?: SceneRunner;    // the live scene, when one is playing
  // One monotonic step counter for the WHOLE run's stream (Azimuth's rider:
  // stream-level tooling sorts by step, so per-scene restarts would collide).
  // stepSeq is the run-level high-water mark; stepBase anchors each scene's
  // local 1..N counter onto it, so scene, day, and end screens share one line.
  private stepSeq = 0;
  private stepBase = 0;
  private screen!: LoopScreen;

  constructor(db: ContentDB, opts: LoopSessionOpts) {
    this.db = db;
    this.mode = opts.mode ?? "read";
    this.showJournal = opts.showJournal ?? false;
    this.recorder = new Recorder({ contentId: opts.contentId, buildTag: opts.buildTag, seed: opts.seed });
    this.g = newGame(
      {
        seed: opts.seed, name: opts.playerName ?? "You", age: 25,
        body: { height: 0.5, build: 0.5 }, tier: opts.tier, townId: opts.townId,
        crossRun: opts.crossRun,
      },
      db,
    );
    this.hooks = {
      onScreen: (s) => {
        this.stepSeq = this.stepBase + s.step;
        if (this.mode === "read") this.recorder.pushPresentation({ step: this.stepBase + s.step, card: s.card, prose: s.prose, options: s.options });
      },
      onResolve: (r) => {
        this.recorder.pushTrace({
          step: this.stepBase + r.step, day: r.day, card: r.card, choiceIndex: r.choiceIndex, choiceLabel: r.choiceLabel,
          statDeltas: r.statDeltas, flagsChanged: r.flagsChanged, roll: r.roll,
          band: r.band ?? { trueBand: null, resolvedBand: null }, exposure: r.exposure,
        });
      },
    };
    // Morning of day 1: drain the opening/creation queue, then present.
    this.enterMorning();
  }

  get current(): LoopScreen { return this.screen; }
  get done(): boolean { return this.screen.kind === "end"; }

  // Resolve the reader's pick against whichever screen is up. Scene picks route
  // to the SceneRunner (refuses greyed/out-of-range WITHOUT advancing, like the
  // cave); day picks take an action (refusing "too tired") or end the day.
  pick(idx: number, note = ""): PickResult {
    if (this.screen.kind === "end") return { ok: false, reason: "the run is over" };
    return this.screen.kind === "scene" ? this.pickScene(idx, note) : this.pickDay(idx, note);
  }

  appendDebrief(qa: { q: string; a: string }[], operatorNotes?: string): void {
    this.recorder.appendDebrief({ qa, operatorNotes });
  }

  // Analyst/telemetry read (flags are legal readers; the reader-facing SCREEN
  // never carries them). Lets a harness verify cross-run injection through the
  // actual tool without cracking the surface open.
  flag(name: string): boolean | number | string | undefined { return this.g.flags[name]; }

  // Harvest this run into a cross-run store at its terminal (the second save
  // scope) — so the NEXT vessel can be built with opts.crossRun and the
  // Denise -> Dale collision becomes readable across two sessions (Courier §3).
  harvestInto(store: CrossRunStore): CrossRunStore { return harvestCrossRun(this.g, this.db, store); }

  // ---- internals -----------------------------------------------------------

  private pickScene(idx: number, note: string): PickResult {
    const runner = this.scene!;
    const check = runner.checkPick(idx);
    if (!check.ok) return check;   // greyed / out of range — no state touched, no reader record
    if (this.mode === "read") {
      this.recorder.pushReader({ step: this.screen.step, card: this.screen.card, note, pick: idx, pickLabel: this.screen.options[idx].label });
    }
    const res = runner.pick(idx);
    if (runner.done) this.afterScene();
    else this.syncScene();
    return res;
  }

  private pickDay(idx: number, note: string): PickResult {
    const menu = dayMenu(this.g, this.db);
    const endIdx = menu.actions.length;
    if (idx < 0 || idx > endIdx) return { ok: false, reason: "no such option" };

    if (idx === endIdx) {
      if (this.mode === "read") this.recorder.pushReader({ step: this.screen.step, card: "__day__", note, pick: idx, pickLabel: END_LABEL });
      const st = advanceDay(this.g, this.db);
      if (st.over) this.presentEnd();
      else this.enterMorning();
      return { ok: true };
    }

    const action = menu.actions[idx];
    if (this.g.player.stats.energy < action.cost) return { ok: false, reason: "too tired" };   // greyed — no state touched
    if (this.mode === "read") this.recorder.pushReader({ step: this.screen.step, card: "__day__", note, pick: idx, pickLabel: dayLabel(action) });
    this.stepBase = this.stepSeq;
    const res = runAction(this.g, this.db, action.id, this.hooks);
    if (!res.ok) return { ok: false, reason: res.reason };
    this.scene = res.runner!;
    if (this.scene.done) this.afterScene();   // a plain errand resolves immediately
    else this.syncScene();
    return { ok: true };
  }

  // Drain queued morning scenes; when they're exhausted show the day menu (or
  // the end screen if a terminal already landed). Presents the first queued
  // scene and hands control to the reader — draining continues in afterScene().
  private enterMorning(): void {
    if (runStatus(this.g, this.db).over) return this.presentEnd();
    this.stepBase = this.stepSeq;
    const r = startQueuedScene(this.g, this.db, this.hooks);
    if (r) { this.scene = r; this.syncScene(); }
    else this.presentDay();
  }

  // A scene finished. A terminal set mid-scene takes effect now (control has
  // returned to the day, per the loop's terminal contract). Otherwise: if more
  // beats are queued this same morning (two doors fired), play the next; else
  // the day menu.
  private afterScene(): void {
    this.scene = undefined;
    if (runStatus(this.g, this.db).over) return this.presentEnd();
    if (this.g.queue.length) {
      this.stepBase = this.stepSeq;
      const r = startQueuedScene(this.g, this.db, this.hooks);
      if (r) { this.scene = r; return this.syncScene(); }
    }
    this.presentDay();
  }

  private syncScene(): void {
    const s = this.scene!.current;
    this.screen = {
      kind: "scene", step: this.stepBase + s.step, card: s.card, prose: s.prose,
      options: s.options.map((o) => ({ index: o.index, label: o.label, available: o.available })),
      day: this.g.day, over: false,
    };
  }

  private presentDay(): void {
    const menu = dayMenu(this.g, this.db);
    const options = menu.actions.map((a, i) => ({ index: i, label: dayLabel(a), available: a.cost <= menu.energy }));
    options.push({ index: menu.actions.length, label: END_LABEL, available: true });
    let prose = menu.dateLabel;   // diegetic date only — never energy/stats
    if (this.showJournal) {
      const known = journalLines(this.g, this.db);
      if (known.length) prose += "\n\nWhat you know:\n" + known.map((l) => `· ${l}`).join("\n");
    }
    this.stepSeq++;
    this.screen = { kind: "day", step: this.stepSeq, card: "__day__", prose, options, day: menu.day, dateLabel: menu.dateLabel, over: false };
    if (this.mode === "read") {
      this.recorder.pushPresentation({
        step: this.stepSeq, card: "__day__", prose,
        options: options.map((o) => ({ index: o.index, label: o.label, available: o.available, showWhenLocked: !o.available })),
      });
    }
  }

  private presentEnd(): void {
    const st = runStatus(this.g, this.db);
    const terminal = st.flag ?? st.cause ?? "over";
    const prose = "The run is over.";
    this.stepSeq++;
    this.screen = { kind: "end", step: this.stepSeq, card: "__run_over__", prose, options: [], day: this.g.day, over: true, terminal };
    if (this.mode === "read") this.recorder.pushPresentation({ step: this.stepSeq, card: "__run_over__", prose, options: [] });
  }
}

// The reader-facing label for a menu action: its diegetic name, plus the sub as
// flavor when present. Never ids/costs — those live in the engine, not the eye.
function dayLabel(a: LocationAction): string {
  return a.sub ? `${a.name} — ${a.sub}` : a.name;
}
