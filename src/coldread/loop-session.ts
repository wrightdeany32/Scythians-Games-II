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
// sees ids, stats, flags, or card ids (the WO-4 surface guard; Courier's ask) —
// with ONE ruled exception: ENERGY IS THE DAY'S VISIBLE CURRENCY (Dean's
// ruling, 2026-07-17 — the player spends it to decide, so they see it; hiding
// it was over-applied concealment). The day screen shows "Energy: N of M".
// The grip NUMBER, exposure, and every trajectory stay sealed as always; an
// action you're too tired to take still renders greyed with its felt reason.
//
// Determinism: same seed + same picks => byte-identical presentation (the cave
// contract, now at loop scale). Cross-run (opts.crossRun): a new vessel arrives
// in the world a prior one left — the harvest seeds inject at newGame, so the
// Denise -> Dale collision (a two-vessel beat) is finally readable end to end.
// ============================================================================

import type { ContentDB, GameState, CrossRunStore, LocationAction } from "../engine/types";
import { newGame, harvestCrossRun } from "../engine/engine";
import { CreationRunner } from "../engine/creation";
import { dayMenu, runAction, startQueuedScene, advanceDay, actionSub } from "../engine/loop";
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
  // THE START-DECK CUTOVER FLAG. THE DECK IS THE SHIPPED DEFAULT (the cutover
  // milestone, 2026-07-19: the BR set of four closed on the legacy opening;
  // this flip is the named re-baseline event Azimuth's ruling required). ON
  // (default): the session starts at creation — CreationRunner screens
  // through this same surface, the deal invisible (no-catalog: the reader
  // answers and a life begins), and the dealt start seats the run
  // (`tier`/`townId` below are overridden). Pass FALSE explicitly for the
  // legacy opening — historical replays (the BR-1..4 transcripts predate the
  // deck) and any harness whose baseline hasn't re-baselined yet.
  startDeck?: boolean;
}

export type LoopScreenKind = "creation" | "scene" | "day" | "end";

// The one screen a reader ever faces — prose + numbered options — whichever
// shape (scene / day / end) is under it. No mechanical fields ever populate it.
export interface LoopScreen {
  kind: LoopScreenKind;
  step: number;
  card: string;                // scene card id, or "__day__", or "__run_over__"
  prose: string;
  options: { index: number; label: string; available: boolean; lockedReason?: string; cost?: number; moneyCost?: number }[];
  day: number;
  dateLabel?: string;
  energy?: number;             // day screens only — the visible currency (also in the prose line)
  energyMax?: number;
  over: boolean;
  terminal?: string;           // the terminal flag/cause, on the end screen only
}

const END_LABEL = "Call it a day.";
// The generic fatigue line (Loom's), the fallback when an action carries no
// tiredText of its own - same precedent as DEFAULT_OPENING_LOG: an engine
// fallback for unauthored content, overridden per action in the pack.
const TIRED_DEFAULT = "Not today — there's nothing left in you for it.";
// The money sibling (born-visible discipline): the felt line when a price
// gates a day action — same fallback pattern, overridden per action (brokeText).
const BROKE_DEFAULT = "Not this week — the money just isn't there.";

export class LoopSession {
  readonly recorder: Recorder;
  private g!: GameState;          // set at construction (legacy) or when creation completes (startDeck)
  private db: ContentDB;
  private opts: LoopSessionOpts;
  private mode: "read" | "bot";
  private showJournal: boolean;
  private hooks: SceneHooks;
  private scene?: SceneRunner;    // the live scene, when one is playing
  private creation?: CreationRunner;   // the live creation phase (startDeck only), before day 1 exists
  // One monotonic step counter for the WHOLE run's stream (Azimuth's rider:
  // stream-level tooling sorts by step, so per-scene restarts would collide).
  // stepSeq is the run-level high-water mark; stepBase anchors each scene's
  // local 1..N counter onto it, so scene, day, and end screens share one line.
  private stepSeq = 0;
  private stepBase = 0;
  private endProse = "";          // a finished scene's closing narration, riding to the next screen
  private screen!: LoopScreen;

  constructor(db: ContentDB, opts: LoopSessionOpts) {
    this.db = db;
    this.opts = opts;
    this.mode = opts.mode ?? "read";
    this.showJournal = opts.showJournal ?? false;
    // THE CUTOVER: deck-on is the shipped default (re-baseline 2026-07-19) —
    // for any db that HAS a deck. A pack with no `starts` is a legacy pack by
    // definition (synthetic fixtures, loopworld), so it opens legacy without
    // every harness having to pin the flag.
    const deckOn = (opts.startDeck ?? true) && !!db.starts?.length;
    this.recorder = new Recorder({
      contentId: opts.contentId, buildTag: opts.buildTag, seed: opts.seed,
      // Vessel B stamps what it was born carrying (v0.3: a chained read is
      // self-describing for replay). Absent/empty store ⇒ no field — first-
      // vessel stamps stay byte-identical to before.
      ...(opts.crossRun?.seeds && Object.keys(opts.crossRun.seeds).length
        ? { crossRunSeeds: { ...opts.crossRun.seeds } } : {}),
      // The opening era, stamped (self-describing replay): deck-era streams
      // say so; legacy streams omit the field, so every pre-cutover stamp
      // (BR-1..4) stays byte-identical.
      ...(deckOn ? { openingEra: "deck" as const } : {}),
    });
    this.hooks = {
      onScreen: (s) => {
        // The __end__ screen is never SHOWN at loop scale (the day resumes
        // instead), so it must not be recorded as if it were - its prose is
        // stashed and folded into the NEXT presented screen (the wave's
        // dropped-narration fix; record = surface truth). Its step is not
        // consumed on the shown line.
        if (s.card === "__end__") { this.endProse = s.prose; return; }
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
    if (deckOn) {
      // The deck path (the shipped default): the run starts at creation.
      // Screens present through the one surface; presentations record (read
      // mode); the deal is silent at the phase boundary. newGame waits until
      // creation completes.
      this.creation = new CreationRunner(db, { seed: opts.seed }, {
        onScreen: (s) => {
          if (s.card === "__creation_done__") return;   // internal boundary marker, never a reader screen
          this.stepSeq = s.step;   // creation runs first — its local 1..N IS the stream's opening line
          if (this.mode === "read") this.recorder.pushPresentation({ step: s.step, card: s.card, prose: s.prose, options: s.options });
        },
      });
      if (this.creation.done) this.finishCreation();   // a deck with zero questions deals immediately
      else this.syncCreation();
    } else {
      // The legacy path (explicit opt-out post-cutover: historical replays
      // and un-re-baselined harnesses): opts seat the run; morning of day 1
      // drains the opening queue.
      this.g = newGame(
        {
          seed: opts.seed, name: opts.playerName ?? "You", age: 25,
          body: { height: 0.5, build: 0.5 }, tier: opts.tier, townId: opts.townId,
          crossRun: opts.crossRun,
        },
        db,
      );
      this.enterMorning();
    }
  }

  get current(): LoopScreen { return this.screen; }
  get done(): boolean { return this.screen.kind === "end"; }

  // Resolve the reader's pick against whichever screen is up. Scene picks route
  // to the SceneRunner (refuses greyed/out-of-range WITHOUT advancing, like the
  // cave); day picks take an action (refusing "too tired") or end the day.
  pick(idx: number, note = ""): PickResult {
    if (this.screen.kind === "end") return { ok: false, reason: "the run is over" };
    if (this.screen.kind === "creation") return this.pickCreation(idx, note);
    return this.screen.kind === "scene" ? this.pickScene(idx, note) : this.pickDay(idx, note);
  }

  appendDebrief(qa: { q: string; a: string }[], operatorNotes?: string): void {
    this.recorder.appendDebrief({ qa, operatorNotes });
  }

  // Analyst/telemetry read (flags are legal readers; the reader-facing SCREEN
  // never carries them). Lets a harness verify cross-run injection through the
  // actual tool without cracking the surface open.
  flag(name: string): boolean | number | string | undefined { return this.g ? this.g.flags[name] : undefined; }

  // Harvest this run into a cross-run store at its terminal (the second save
  // scope) — so the NEXT vessel can be built with opts.crossRun and the
  // Denise -> Dale collision becomes readable across two sessions (Courier §3).
  harvestInto(store: CrossRunStore): CrossRunStore { return harvestCrossRun(this.g, this.db, store); }

  // ---- internals -----------------------------------------------------------

  // A creation pick: routes to the CreationRunner exactly as scene picks route
  // to the SceneRunner — refusals touch nothing, reader records carry the
  // label. When the runner finishes, the dealt start seats the run and day 1
  // begins; the reader never sees the boundary (no-catalog: no start names,
  // no "you drew" — the next screen is simply the morning).
  private pickCreation(idx: number, note: string): PickResult {
    const runner = this.creation!;
    const check = runner.checkPick(idx);
    if (!check.ok) return check;
    if (this.mode === "read") {
      this.recorder.pushReader({ step: this.screen.step, card: this.screen.card, note, pick: idx, pickLabel: this.screen.options.find((o) => o.index === idx)!.label });
    }
    runner.pick(idx);
    if (runner.done) this.finishCreation();
    else this.syncCreation();
    return { ok: true };
  }

  // Hand over (and clear) a finished scene's closing narration - exactly one
  // next screen carries it, whichever kind that screen is.
  private takeEndProse(): string {
    const p = this.endProse;
    this.endProse = "";
    return p;
  }

  private syncCreation(): void {
    const s = this.creation!.current;
    this.screen = {
      kind: "creation", step: s.step, card: s.card, prose: s.prose,
      options: s.options.map((o) => ({ index: o.index, label: o.label, available: o.available })),
      day: 0, over: false,   // day 0: the run hasn't begun — creation is before the calendar
    };
  }

  private finishCreation(): void {
    const res = this.creation!.result!;
    // Rider (a) of the option-less-beat fold: a TRAILING creation beat (the
    // radio's last murmur, nothing presenting after it) rides the same
    // endProse seam a finished scene's closing narration does - it folds
    // above the first gameplay screen, whichever kind that turns out to be.
    if (this.creation!.trailingProse) this.endProse = this.creation!.trailingProse;
    this.creation = undefined;
    this.g = newGame(
      {
        seed: this.opts.seed, name: this.opts.playerName ?? "You", age: 25,
        body: { height: 0.5, build: 0.5 }, tier: res.tier, townId: res.townId,
        startId: res.startId, answers: res.answers,
        crossRun: this.opts.crossRun,
      },
      this.db,
    );
    // enterMorning anchors stepBase to the high-water mark, so day-1 scenes
    // continue the monotonic line the creation screens opened.
    this.enterMorning();
  }

  private pickScene(idx: number, note: string): PickResult {
    const runner = this.scene!;
    const check = runner.checkPick(idx);
    if (!check.ok) return check;   // greyed / out of range — no state touched, no reader record
    if (this.mode === "read") {
      this.recorder.pushReader({ step: this.screen.step, card: this.screen.card, note, pick: idx, pickLabel: this.screen.options.find((o) => o.index === idx)!.label });
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
    if (action.moneyCost != null && this.g.player.stats.money < action.moneyCost) return { ok: false, reason: "can't afford" };   // greyed — no state touched
    if (this.mode === "read") this.recorder.pushReader({ step: this.screen.step, card: "__day__", note, pick: idx, pickLabel: dayLabel(this.g, action) });
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
    const r = startQueuedScene(this.g, this.db, this.hooks, this.takeEndProse());
    if (r) {
      this.scene = r;
      if (this.scene.done) this.afterScene();
      else this.syncScene();
    } else this.presentDay();
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
      const r = startQueuedScene(this.g, this.db, this.hooks, this.takeEndProse());
      // Same guard as enterMorning/pickDay (the BR-1 fix's sibling seam): a
      // queued follow-up whose events all fail their conditions drains to an
      // immediately-done runner - recurse, never sync the __end__ sentinel.
      if (r) {
        this.scene = r;
        return r.done ? this.afterScene() : this.syncScene();
      }
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
    // Day-menu greying is only ever energy, so a greyed option carries its
    // diegetic fatigue line (tired-vs-gone: absence means gone; greyed says
    // why, in the fiction, never as a number).
    // cost: the day-action's energy price, a STRUCTURED field (never folded into
    // the diegetic label) so the reader can budget — Dean's ruling (2026-07-17):
    // a person knows a 6am run costs more than an evening at the laptop, so
    // hiding the price kills immersion. Consoles render it beside the option;
    // the label stays name-only, the leak-checks stay honest.
    const options: LoopScreen["options"] = menu.actions.map((a, i) => {
      const tired = a.cost > menu.energy;
      const broke = !tired && a.moneyCost != null && a.moneyCost > menu.money;
      return {
        index: i, label: dayLabel(this.g, a), available: !tired && !broke, cost: a.cost,
        ...(a.moneyCost != null ? { moneyCost: a.moneyCost } : {}),
        // Greying carries its felt reason (never a bare "unavailable"): energy
        // first (the primary currency), else money (born-visible discipline —
        // the price gates, so the refusal speaks).
        ...(tired ? { lockedReason: a.tiredText ?? TIRED_DEFAULT }
          : broke ? { lockedReason: a.brokeText ?? BROKE_DEFAULT } : {}),
      };
    });
    options.push({ index: menu.actions.length, label: END_LABEL, available: true });
    const closing = this.takeEndProse();
    // The finished scene's payoff, then the diegetic date, then the day's
    // CURRENCY. Energy is visible by ruling (Dean, 2026-07-17): the player
    // spends it to decide, so they see it — hiding it was over-applied
    // concealment. Money joins the line the moment any menu action carries a
    // price (born visible: level and price ship together; menus with no
    // money-gated action stay byte-identical to before). What stays sealed is
    // what was always sealed: the grip number (band/felt word only), exposure,
    // and every trajectory.
    const anyMoneyCost = menu.actions.some((a) => a.moneyCost != null);
    let prose = (closing ? closing + "\n\n" : "") + menu.dateLabel
      + `\n\nEnergy: ${menu.energy} of ${menu.energyMax}.`
      + (anyMoneyCost ? ` Money: $${menu.money}.` : "");
    if (this.showJournal) {
      const known = journalLines(this.g, this.db);
      if (known.length) prose += "\n\nWhat you know:\n" + known.map((l) => `· ${l}`).join("\n");
    }
    this.stepSeq++;
    this.screen = { kind: "day", step: this.stepSeq, card: "__day__", prose, options, day: menu.day, dateLabel: menu.dateLabel, energy: menu.energy, energyMax: menu.energyMax, over: false };
    if (this.mode === "read") {
      this.recorder.pushPresentation({
        step: this.stepSeq, card: "__day__", prose,
        options: options.map((o) => ({ index: o.index, label: o.label, available: o.available, showWhenLocked: !o.available, ...(o.lockedReason ? { lockedReason: o.lockedReason } : {}), ...(o.cost != null ? { cost: o.cost } : {}), ...(o.moneyCost != null ? { moneyCost: o.moneyCost } : {}) })),
      });
    }
  }

  private presentEnd(): void {
    const st = runStatus(this.g, this.db);
    const terminal = st.flag ?? st.cause ?? "over";
    const closing = this.takeEndProse();
    const prose = (closing ? closing + "\n\n" : "") + "The run is over.";
    this.stepSeq++;
    this.screen = { kind: "end", step: this.stepSeq, card: "__run_over__", prose, options: [], day: this.g.day, over: true, terminal };
    if (this.mode === "read") this.recorder.pushPresentation({ step: this.stepSeq, card: "__run_over__", prose, options: [] });
  }
}

// The reader-facing label for a menu action: its diegetic name, plus the sub as
// flavor when present (subVariants drift the sub by state — the case-file /
// White's Hall device, resolved through the one engine function). Never
// ids/costs — those live in the engine, not the eye.
function dayLabel(g: GameState, a: LocationAction): string {
  const sub = actionSub(g, a);
  return sub ? `${a.name} — ${sub}` : a.name;
}
