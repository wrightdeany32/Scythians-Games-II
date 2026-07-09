// ============================================================================
// engine/loop.ts — the daily loop (WO-1d): what turns isolated scenes into a
// life. Three verbs and a status check:
//
//   dayMenu     what can I do today?   (actions routed by surface metadata)
//   runAction   do it                  (EVERY action runs through the
//                                       SceneRunner — a plain errand is just a
//                                       scene that ends immediately, so there
//                                       is exactly one code path and telemetry
//                                       is free everywhere)
//   advanceDay  the day turns          (endDay: energy refill, exposure cool,
//                                       scheduled sweep — then met-doors fire)
//   runStatus   is the run still live? (the ONLY run-enders are the designed
//                                       terminals: lost grip, and content's
//                                       terminal flags. A scene ending is
//                                       NEVER game-over — it returns here.)
//
// The driver's rhythm (a UI, the harness, a bot): morning — startQueuedScene
// picks up whatever the night queued (doors, scheduled beats, the exposure
// consequence, the opening queue on day 1); then act while energy lasts; then
// advanceDay; repeat. The menu each morning reflects what happened, because
// availability is condition-gated on the flags the player's own resolutions
// set.
//
// THE TERMINAL CONTRACT: check runStatus (dayMenu carries it as `status`)
// whenever a scene ends and at every day boundary — a terminal set mid-scene
// takes effect when control RETURNS TO THE DAY, not mid-card, so an authored
// pull-back-from-the-brink inside one scene is content's prerogative, but a
// run that comes back to the day lost is over before anything else happens.
// ============================================================================

import type { ContentDB, GameState, LocationAction } from "./types";
import { availableActions, endDay, terminalTuning } from "./engine";
import { SceneRunner } from "./scene";
import type { SceneHooks } from "./scene";
import { dateOf } from "./calendar";

// ---- terminal tuning -----------------------------------------------------------
// Lives in engine.ts since Phase 2 (endDay's terminal-precedence guard shares
// it); re-exported here so loop consumers keep their import.
export { terminalTuning };

export interface RunStatus {
  over: boolean;
  cause?: "grip" | "flag";
  flag?: string;              // which designed terminal flag ended it (cause "flag")
}

// The designed terminals, nothing else. No endings codex lives here: what a
// run's end MEANS is content's to author off flags + coordinates (invariant #1).
export function runStatus(g: GameState, db: ContentDB): RunStatus {
  const t = terminalTuning(db);
  if (t.onGripZero && g.player.stats.grip <= 0) return { over: true, cause: "grip" };
  for (const f of t.flags) if (g.flags[f]) return { over: true, cause: "flag", flag: f };
  return { over: false };
}

// ---- the day menu ----------------------------------------------------------------
export interface DayMenu {
  day: number;
  dateLabel: string;
  energy: number;
  status: RunStatus;                           // the terminal check, surfaced where every driver already looks
  pendingScene: boolean;                       // something queued wants to run before the errands (see startQueuedScene)
  actions: LocationAction[];                   // every action available right now (tier ∧ town ∧ requires)
  bySurface: Record<string, LocationAction[]>; // the same actions, routed by their surface hint ("here" when unset)
}

export const DEFAULT_SURFACE = "here";

export function dayMenu(g: GameState, db: ContentDB): DayMenu {
  const actions = availableActions(g, db);
  const bySurface: Record<string, LocationAction[]> = {};
  for (const a of actions) (bySurface[a.surface ?? DEFAULT_SURFACE] ??= []).push(a);
  return {
    day: g.day,
    dateLabel: dateOf(g.day).label,
    energy: g.player.stats.energy,
    status: runStatus(g, db),
    pendingScene: g.queue.length > 0,
    actions,
    bySurface,
  };
}

// ---- running an action -------------------------------------------------------------
export interface RunActionResult {
  ok: boolean;
  reason?: "unknown action" | "unavailable" | "too tired" | "scene pending";
  runner?: SceneRunner;   // present when ok — already begun; drive it to done, then return to the day
}

// Take an action by id, through the one scene path. Polite refusals (no state
// touched) for the cases a UI must handle: not on today's menu, not enough
// energy, or a queued morning scene that hasn't run yet — an action begun over
// a non-empty queue would present the PENDING card under the action's opening
// narration (the runner advances the queue head), so the day must drain via
// startQueuedScene first. When ok, the returned runner has already presented
// its first screen — a chained scene runs to done; a plain errand is done
// immediately with its outcome narration on the "__end__" screen.
export function runAction(g: GameState, db: ContentDB, actionId: string, hooks?: SceneHooks): RunActionResult {
  if (g.queue.length) return { ok: false, reason: "scene pending" };
  const action = availableActions(g, db).find((a) => a.id === actionId);
  if (!action) {
    const exists = db.actions.some((a) => a.id === actionId);
    return { ok: false, reason: exists ? "unavailable" : "unknown action" };
  }
  if (g.player.stats.energy < action.cost) return { ok: false, reason: "too tired" };
  const runner = new SceneRunner(g, db, hooks);
  runner.beginWithAction(action);
  return { ok: true, runner };
}

// Morning pickup: if the queue holds anything (a met-door, a scheduled beat, the
// exposure consequence, day-1's opening/creation queue), run it as a scene.
// Returns undefined when nothing waits. Creation-as-turn-zero is exactly this
// call on a fresh game whose openingQueue seeded the creation cards.
export function startQueuedScene(g: GameState, db: ContentDB, hooks?: SceneHooks): SceneRunner | undefined {
  if (!g.queue.length) return undefined;
  const runner = new SceneRunner(g, db, hooks);
  runner.begin();
  return runner;
}

// ---- advancing the day ---------------------------------------------------------------
// endDay does everything that fires when the day turns — the substrate (day++,
// energy refill, exposure cool + threshold consequence, scheduled sweep) AND
// the met-door sweep, all at one depth in the engine so every day-advance
// driver gets identical mornings. This wrapper adds only the loop's concern:
// the run-status check at the day boundary.
export function advanceDay(g: GameState, db: ContentDB): RunStatus {
  endDay(g, db);
  return runStatus(g, db);
}
