// ============================================================================
// app/websession.ts — the browser game's session driver (the graphics track's
// counterpart to coldread/loop-session.ts, and deliberately modeled on it: the
// same loop verbs, the same morning-drain and afterScene sentinel guards, the
// same "one screen, whatever shape is under it" contract).
//
// THE WALL STANCE: this file is NOT renderer-scoped — like the cold-read
// console, it may import the loop freely. It exists so the files that ARE
// renderer-scoped (src/render/web/*) never have to: they receive WebScreen /
// Surface data from here and import nothing from the engine but the surface.
// Everything on WebScreen is player-legal by construction — diegetic labels,
// prose, availability, the fatigue line — and the day screen's routing hints
// (surface / place / contact) are exactly the fields types.ts declares as
// renderer routing, read by no engine math.
//
// Saves are REPLAY RECORDS ({seed, picks}), not state dumps: determinism is
// the engine's contract (same seed + same picks ⇒ byte-identical screens), so
// replaying the pick list IS loading the game — mid-scene saves included, and
// a save can never disagree with the engine that made it.
// ============================================================================

import type { ContentDB, GameState, CrossRunStore, LocationAction } from "../engine/types";
import { newGame } from "../engine/engine";
import { CreationRunner } from "../engine/creation";
import { dayMenu, runAction, startQueuedScene, advanceDay, runStatus } from "../engine/loop";
import { SceneRunner } from "../engine/scene";
import type { SceneHooks, PickResult } from "../engine/scene";
import type { Surface } from "../engine/surface";
import { renderSurface } from "../engine/surface";

export interface WebSessionOpts {
  seed: number;
  tier: GameState["tier"];
  townId: string;
  playerName?: string;
  startDeck?: boolean;         // the deck-start cutover flag — OFF until that milestone
  crossRun?: CrossRunStore;
}

export type WebScreenKind = "creation" | "scene" | "day" | "end";

export interface WebOption {
  index: number;               // the coordinate pick() takes — never a display position
  label: string;
  available: boolean;
  lockedReason?: string;       // the diegetic felt-reason, when greyed (day screens)
}

// A day action carries its routing hints so the renderer can seat it on the
// right surface (map / phone / home / here) — hints only, no mechanics.
export interface WebDayAction extends WebOption {
  surface: string;
  place?: string;
  contact?: string;
}

export interface WebScreen {
  kind: WebScreenKind;
  card: string;                // scene card id, "__day__", or "__run_over__"
  prose: string;
  options: WebOption[];        // every pickable option on this screen, day's end included
  dayActions?: WebDayAction[]; // day screens only — the actions with routing hints
  endIndex?: number;           // day screens only — pick(endIndex) ends the day
  day: number;
  dateLabel?: string;
  over: boolean;
  terminal?: string;           // the end screen only
}

// The replay save: the seed and every accepted pick, in order. Loading is
// replaying. `v` guards against replaying across a content change that would
// desync the record (bump on breaking content revisions).
export interface WebSave {
  v: 1;
  seed: number;
  picks: number[];
}

const END_LABEL = "Call it a day.";
const TIRED_DEFAULT = "Not today — there's nothing left in you for it.";
const DEFAULT_SURFACE = "here";

export class WebSession {
  private g!: GameState;
  private db: ContentDB;
  private opts: WebSessionOpts;
  private hooks: SceneHooks;
  private scene?: SceneRunner;
  private creation?: CreationRunner;
  private endProse = "";
  private screen!: WebScreen;
  private picks: number[] = [];

  constructor(db: ContentDB, opts: WebSessionOpts) {
    this.db = db;
    this.opts = opts;
    // The one hook this driver needs: a finished scene's __end__ screen is
    // never shown — its closing narration rides to the next presented screen.
    this.hooks = {
      onScreen: (s) => {
        if (s.card === "__end__") this.endProse = s.prose;
      },
    };
    if (opts.startDeck) {
      this.creation = new CreationRunner(db, { seed: opts.seed }, {});
      if (this.creation.done) this.finishCreation();
      else this.syncCreation();
    } else {
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

  get current(): WebScreen { return this.screen; }
  get done(): boolean { return this.screen.kind === "end"; }

  // The ambient HUD's data — the render surface, and nothing else. Undefined
  // during creation (the run hasn't begun; there is no world to surface yet).
  surface(): Surface | undefined {
    return this.g ? renderSurface(this.g, this.db) : undefined;
  }

  // The replay record for persistence. A copy — callers can't mutate history.
  save(): WebSave {
    return { v: 1, seed: this.opts.seed, picks: [...this.picks] };
  }

  // Rebuild a session by replaying a save. Returns undefined if the record no
  // longer replays cleanly (content changed under it) — callers start fresh.
  static restore(db: ContentDB, opts: Omit<WebSessionOpts, "seed">, save: WebSave): WebSession | undefined {
    if (save.v !== 1) return undefined;
    try {
      const s = new WebSession(db, { ...opts, seed: save.seed });
      for (const idx of save.picks) {
        if (s.done) return undefined;
        if (!s.pick(idx).ok) return undefined;
      }
      return s;
    } catch {
      return undefined;
    }
  }

  // Resolve a pick against whichever screen is up. Accepted picks append to
  // the replay record; refusals touch nothing, exactly like the consoles.
  pick(idx: number): PickResult {
    if (this.screen.kind === "end") return { ok: false, reason: "the run is over" };
    const res = this.screen.kind === "creation" ? this.pickCreation(idx)
      : this.screen.kind === "scene" ? this.pickScene(idx)
      : this.pickDay(idx);
    if (res.ok) this.picks.push(idx);
    return res;
  }

  // ---- internals -----------------------------------------------------------

  private pickCreation(idx: number): PickResult {
    const runner = this.creation!;
    const check = runner.checkPick(idx);
    if (!check.ok) return check;
    runner.pick(idx);
    if (runner.done) this.finishCreation();
    else this.syncCreation();
    return { ok: true };
  }

  private finishCreation(): void {
    const res = this.creation!.result!;
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
    this.enterMorning();
  }

  private pickScene(idx: number): PickResult {
    const runner = this.scene!;
    const check = runner.checkPick(idx);
    if (!check.ok) return check;
    const res = runner.pick(idx);
    if (runner.done) this.afterScene();
    else this.syncScene();
    return res;
  }

  private pickDay(idx: number): PickResult {
    const menu = dayMenu(this.g, this.db);
    const endIdx = menu.actions.length;
    if (idx < 0 || idx > endIdx) return { ok: false, reason: "no such option" };

    if (idx === endIdx) {
      const st = advanceDay(this.g, this.db);
      if (st.over) this.presentEnd();
      else this.enterMorning();
      return { ok: true };
    }

    const action = menu.actions[idx];
    if (this.g.player.stats.energy < action.cost) return { ok: false, reason: "too tired" };
    const res = runAction(this.g, this.db, action.id, this.hooks);
    if (!res.ok) return { ok: false, reason: res.reason };
    this.scene = res.runner!;
    if (this.scene.done) this.afterScene();
    else this.syncScene();
    return { ok: true };
  }

  private takeEndProse(): string {
    const p = this.endProse;
    this.endProse = "";
    return p;
  }

  private enterMorning(): void {
    if (runStatus(this.g, this.db).over) return this.presentEnd();
    const r = startQueuedScene(this.g, this.db, this.hooks, this.takeEndProse());
    if (r) {
      this.scene = r;
      if (this.scene.done) this.afterScene();
      else this.syncScene();
    } else this.presentDay();
  }

  private afterScene(): void {
    this.scene = undefined;
    if (runStatus(this.g, this.db).over) return this.presentEnd();
    if (this.g.queue.length) {
      const r = startQueuedScene(this.g, this.db, this.hooks, this.takeEndProse());
      // The BR-1 sentinel guard, same as the console: a queued follow-up whose
      // events all fail drains to an immediately-done runner — recurse, never
      // present the __end__ sentinel.
      if (r) {
        this.scene = r;
        return r.done ? this.afterScene() : this.syncScene();
      }
    }
    this.presentDay();
  }

  private syncCreation(): void {
    const s = this.creation!.current;
    this.screen = {
      kind: "creation", card: s.card, prose: s.prose,
      options: s.options.map((o) => ({ index: o.index, label: o.label, available: o.available })),
      day: 0, over: false,
    };
  }

  private syncScene(): void {
    const s = this.scene!.current;
    this.screen = {
      kind: "scene", card: s.card, prose: s.prose,
      options: s.options.map((o) => ({ index: o.index, label: o.label, available: o.available })),
      day: this.g.day, over: false,
    };
  }

  private presentDay(): void {
    const menu = dayMenu(this.g, this.db);
    const dayActions: WebDayAction[] = menu.actions.map((a, i) => ({
      index: i, label: dayLabel(a), available: a.cost <= menu.energy,
      ...(a.cost <= menu.energy ? {} : { lockedReason: a.tiredText ?? TIRED_DEFAULT }),
      surface: a.surface ?? DEFAULT_SURFACE,
      ...(a.place ? { place: a.place } : {}),
      ...(a.contact ? { contact: a.contact } : {}),
    }));
    const endIndex = menu.actions.length;
    const options: WebOption[] = [
      ...dayActions.map(({ index, label, available, lockedReason }) => ({ index, label, available, ...(lockedReason ? { lockedReason } : {}) })),
      { index: endIndex, label: END_LABEL, available: true },
    ];
    const closing = this.takeEndProse();
    const prose = (closing ? closing + "\n\n" : "") + menu.dateLabel;
    this.screen = {
      kind: "day", card: "__day__", prose, options, dayActions, endIndex,
      day: menu.day, dateLabel: menu.dateLabel, over: false,
    };
  }

  private presentEnd(): void {
    const st = runStatus(this.g, this.db);
    const terminal = st.flag ?? st.cause ?? "over";
    const closing = this.takeEndProse();
    const prose = (closing ? closing + "\n\n" : "") + "The run is over.";
    this.screen = { kind: "end", card: "__run_over__", prose, options: [], day: this.g.day, over: true, terminal };
  }
}

// The player-facing label: diegetic name plus flavor — never ids or costs.
function dayLabel(a: LocationAction): string {
  return a.sub ? `${a.name} — ${a.sub}` : a.name;
}
