// ============================================================================
// smoke/loop.playtest.ts — the WO-1/WO-2 acceptance harness (npm run loop).
// Drives the daily loop end-to-end against smoke/loopworld.ts and PROVES the
// invariants by exercising them, per the green bar's "verify by driving":
//
//   · creation is turn-zero through the SceneRunner; origins seed both centroids
//   · day → scene → day: a scene ending returns to the day, never game-over
//   · the day menu routes actions by surface and reflects what happened
//   · met-doors and scheduled beats fire on advance and greet the morning
//   · the centroid is DERIVED, never stored (the save carries no disposition)
//   · recency: what you did lately outweighs what you did first
//   · the deck registry mounts by location and thread; the daily draw composes
//     from the union of mounted decks; queue-chained cards always win first
//   · every Weight factor ships OFF (behavior unchanged) and biases the draw
//     deterministically when switched on
//   · the designed terminals (lost grip, a terminal flag) end the run
//   · the cross-run store carries faction scars into the next vessel
//   · seed-replay: same seed + same script ⇒ byte-identical end state, and a
//     mid-run save/load continues byte-identically
// ============================================================================

import { loopDb } from "./loopworld";
import {
  newGame, serialize, deserialize, applyOutcome, simulateClash,
  drawFromMounted, mountedDecks, harvestCrossRun, newCrossRunStore,
} from "../engine/engine";
import { dayMenu, runAction, startQueuedScene, advanceDay, runStatus } from "../engine/loop";
import { dispositionCentroid, lensCentroid } from "../engine/centroid";
import { SceneRunner } from "../engine/scene";
import { seedToState } from "../engine/rng";
import type { ContentDB, GameState } from "../engine/types";

const SEED = 20260707;

const line = (s = "") => console.log(s);
let failed = false;
const mkCheck = (live: boolean) => (name: string, ok: boolean, detail = "") => {
  if (!live) return;
  if (!ok) failed = true;
  line(`  ${ok ? "OK  " : "FAIL"} ${name}${detail ? `  (${detail})` : ""}`);
};
type Check = ReturnType<typeof mkCheck>;
const quiet: Check = () => {};

const clone = (g: GameState): GameState => deserialize(serialize(g));
const ids = (xs: { id: string }[]) => xs.map((x) => x.id).sort().join(",");

// Drive a begun runner to done, picking by card id (default option 0).
function driveScene(runner: SceneRunner, route: Record<string, number> = {}): string[] {
  const cards: string[] = [];
  let guard = 0;
  while (!runner.done && guard++ < 50) {
    cards.push(runner.current.card);
    const r = runner.pick(route[runner.current.card] ?? 0);
    if (!r.ok) throw new Error(`refused on ${runner.current.card}: ${r.reason}`);
  }
  return cards;
}

// ---- the scripted run, split at a save point --------------------------------
// part1: creation + day 1 (the scene day) + advance. part2: day 2 (the door,
// research, errands) + advance + day 3 (the scheduled beat, faction clashes).
function part1(seed: number, check: Check): GameState {
  const g = newGame(
    { seed, name: "You", age: 25, body: { height: 0.5, build: 0.5 }, townId: "region_one", tier: "outer" },
    loopDb,
  );

  // -- turn-zero creation through the ordinary scene machinery
  const menu0 = dayMenu(g, loopDb);
  check("creation pending on day 1 (openingQueue)", menu0.pendingScene);
  const creation = startQueuedScene(g, loopDb)!;
  const creationCards = driveScene(creation, { lw_create: 0 });   // the careful origin
  check("creation ran as a scene (turn-zero)", creationCards.join(">") === "lw_create>lw_origin_careful");
  const c0 = dispositionCentroid(g, loopDb);
  check("creation seeded the diamond origin", c0.sanction === -0.5 && c0.vertical === 0.3);
  const l0 = lensCentroid(g, loopDb);
  check("creation seeded the lens origin", l0.lens_one === 1 && Object.keys(l0).length === 1);

  // -- the day menu routes by surface
  const menu1 = dayMenu(g, loopDb);
  check("menu routes: map", ids(menu1.bySurface.map ?? []) === "lw_venture");
  check("menu routes: phone", ids(menu1.bySurface.phone ?? []) === "lw_call");
  check("menu routes: home", ids(menu1.bySurface.home ?? []) === "lw_research,lw_rest");
  check("menu routes: default surface", ids(menu1.bySurface.here ?? []) === "lw_work");
  check("flag-gated follow-up hidden before the scene", !menu1.actions.some((a) => a.id === "lw_followup"));

  // -- day → scene: the venture enters a chained scene through the one code path
  const venture = runAction(g, loopDb, "lw_venture");
  check("runAction enters the scene", venture.ok && venture.runner!.current.card === "lw_scene_1");
  driveScene(venture.runner!, { lw_scene_1: 0 });
  check("scene ended, run did NOT (never game-over)", venture.runner!.done && !runStatus(g, loopDb).over);
  check("scene set its flags", g.flags.lw_scene_done === true);
  check("scene spent grip", g.player.stats.grip === 9);

  // -- a plain errand is an immediately-done scene; recovery beat restores grip
  const rest = runAction(g, loopDb, "lw_rest");
  check("plain errand = instant scene end with narration",
    rest.ok && rest.runner!.done && rest.runner!.current.card === "__end__" && rest.runner!.current.prose.includes("on purpose"));
  check("rest beat recovered grip (recoverability discipline)", g.player.stats.grip === 10);

  // -- polite refusals
  check("too tired refused politely", runAction(g, loopDb, "lw_work").reason === "too tired");
  check("unknown action refused politely", runAction(g, loopDb, "lw_nothing").reason === "unknown action");

  // -- the day turns
  const st = advanceDay(g, loopDb);
  check("day advanced", g.day === 2 && !st.over);
  check("met-door fired on advance", g.queue.includes("lw_visitor"));
  return g;
}

function part2(g: GameState, check: Check): void {
  // -- the door's beat greets the morning
  const menu2 = dayMenu(g, loopDb);
  check("morning scene pending (the door)", menu2.pendingScene);
  check("menu reflects what happened (follow-up gated in, venture retired)",
    ids(menu2.bySurface.map ?? []) === "lw_followup");
  const visitor = startQueuedScene(g, loopDb)!;
  check("door beat runs as a scene", visitor.current.card === "lw_visitor");
  driveScene(visitor);

  // -- research is an ordinary coordinated resolution; recency shows in the lens
  driveScene(runAction(g, loopDb, "lw_research").runner!);
  const lens = lensCentroid(g, loopDb);
  check("lens is a distribution over both flavors", lens.lens_one > 0 && lens.lens_two > 0);
  check("lens distribution sums to 1", Math.abs(lens.lens_one + lens.lens_two - 1) < 1e-9);
  check("recency: the recent flavor outweighs the origin", lens.lens_two > lens.lens_one);
  const c = dispositionCentroid(g, loopDb);
  check("centroid moved toward recent coordinates", c.sanction > 0 && c.vertical < 0);

  // -- errands, then the day turns again
  driveScene(runAction(g, loopDb, "lw_call").runner!);
  driveScene(runAction(g, loopDb, "lw_work").runner!);
  const st = advanceDay(g, loopDb);
  check("day advanced again", g.day === 3 && !st.over);
  check("scheduled beat swept in on its day", g.queue.includes("lw_promise"));
  check("door did not re-fire (once)", !g.queue.includes("lw_visitor"));

  const promise = startQueuedScene(g, loopDb)!;
  check("scheduled beat runs as a scene", promise.current.card === "lw_promise");
  driveScene(promise);

  // -- the living world drifts
  for (let i = 0; i < 5; i++) simulateClash(g, loopDb, "faction_dawn", "faction_dusk");
  check("faction power drifted", g.factions.faction_dawn.rating !== 60);
}

// ================================ run it =====================================
line(`\n=== WO-1/WO-2 acceptance — the daily loop, the centroid, the registry ===\n`);
line(`-- day → scene → day (seed ${SEED}) --`);
const check = mkCheck(true);
const gA = part1(SEED, check);
const midA = serialize(gA);
part2(gA, check);
const endA = serialize(gA);

// -- seed-replay: identical script, identical bytes
line(`\n-- determinism --`);
const gB = part1(SEED, quiet);
const midB = serialize(gB);
part2(gB, quiet);
check("seed-replay: byte-identical mid-run state", midB === midA);
check("seed-replay: byte-identical end state", serialize(gB) === endA);

// -- save/load mid-run, then continue: byte-identical continuation
const gC = deserialize(midA);
part2(gC, quiet);
check("save/load mid-run continues byte-identically", serialize(gC) === endA);

// -- derived, never stored
line(`\n-- no-stored-disposition, driven --`);
const s1 = serialize(gA);
const d1 = dispositionCentroid(gA, loopDb);
const d2 = dispositionCentroid(gA, loopDb);
check("derivation is pure (twice, same answer)", d1.sanction === d2.sanction && d1.vertical === d2.vertical);
check("derivation left the save untouched", serialize(gA) === s1);
check("the save stores the events, never the position",
  s1.includes("sanction") && !s1.includes("disposition") && !s1.includes("centroid"),
  "coordLog present; no disposition/centroid key");

// -- the registry: mounting, the union draw, queue-first
line(`\n-- deck registry & pipeline --`);
const fresh = newGame({ seed: 1, name: "N", age: 25, body: { height: 0.5, build: 0.5 }, townId: "region_one", tier: "outer" }, loopDb);
check("location-mounted only, pre-thread", ids(mountedDecks(fresh, loopDb)) === "deck:street");
check("thread-mounted after the flag", ids(mountedDecks(gA, loopDb)) === "deck:street,deck:undercurrent");

const poolIds = ["lw_street_1", "lw_street_2", "lw_undercurrent_1"];
const gDraw = clone(gA);
const drawn = drawFromMounted(gDraw, loopDb, 1);
check("union draw stays inside mounted decks", !!drawn && poolIds.includes(drawn.id), drawn?.id ?? "none");
const gQueued = clone(gA);
gQueued.queue.push("lw_promise");
check("queue-first: a chained card preempts the random draw", drawFromMounted(gQueued, loopDb, 1)?.id === "lw_promise");

// -- Weight factors: off = flat, on = a measurable, deterministic bias
const dbProxOn: ContentDB = { ...loopDb, tuning: { ...loopDb.tuning, diamondProximity: { enabled: true, strength: 9, range: 3 } } };
const countWins = (db: ContentDB): number => {
  let wins = 0;
  for (let i = 0; i < 30; i++) {
    const gi = clone(gA);
    gi.rngState = seedToState(5000 + i);           // vary the draw, keep everything else fixed
    if (drawFromMounted(gi, db, 1)?.id === "lw_undercurrent_1") wins++;
  }
  return wins;
};
const winsOff = countWins(loopDb);
const winsOn = countWins(dbProxOn);
check("proximity OFF: coordinated card wins ~1/3 of draws", winsOff >= 4 && winsOff <= 17, `${winsOff}/30`);
check("proximity ON: draw drifts toward the centroid", winsOn > winsOff && winsOn >= 18, `${winsOn}/30`);

const dbAntiRepeat: ContentDB = { ...loopDb, tuning: { ...loopDb.tuning, antiRepeat: { enabled: true, factor: 0, memory: 5 } } };
const gAR = clone(gA);
const first = drawFromMounted(gAR, dbAntiRepeat, 1)!.id;
const second = drawFromMounted(gAR, dbAntiRepeat, 1)!.id;
check("anti-repeat: consecutive random draws differ", first !== second, `${first} then ${second}`);

// -- the designed terminals
line(`\n-- terminal states --`);
const gGrip = clone(gA);
applyOutcome(gGrip, loopDb, { stats: { grip: -10 } });
const stGrip = runStatus(gGrip, loopDb);
check("lost grip ends the run", stGrip.over && stGrip.cause === "grip");
const gTaken = clone(gA);
applyOutcome(gTaken, loopDb, { setFlags: { lw_taken: true } });
const stTaken = runStatus(gTaken, loopDb);
check("designed terminal flag ends the run", stTaken.over && stTaken.cause === "flag" && stTaken.flag === "lw_taken");
check("otherwise the run never ends by itself", !runStatus(gA, loopDb).over);

// -- questionnaire cold-start (the other creation path)
line(`\n-- creation seeding via questionnaire --`);
const dbQ: ContentDB = {
  ...loopDb,
  openingQueue: [],
  questionnaire: { questions: [{ q: "Origin?", answers: [{ label: "A", diamondCoord: { sanction: -0.9, vertical: 0.9 }, lensFlavor: "lens_one" }] }] },
};
const gQ = newGame({ seed: 2, name: "Q", age: 25, body: { height: 0.5, build: 0.5 }, townId: "region_one", tier: "outer" }, dbQ);
const cQ = dispositionCentroid(gQ, dbQ);
check("questionnaire seeds index-0 origins", (gQ.coordLog ?? [])[0]?.index === 0 && cQ.sanction === -0.9 && cQ.vertical === 0.9);

// -- the cross-run store: the next vessel arrives in a scarred world
line(`\n-- cross-run store --`);
const store = harvestCrossRun(gA, newCrossRunStore());
const gNext = newGame({ seed: 777, name: "Next", age: 30, body: { height: 0.5, build: 0.5 }, townId: "region_one", tier: "outer", crossRun: store }, loopDb);
check("faction scars persist into the next run",
  gNext.factions.faction_dawn.rating === gA.factions.faction_dawn.rating && gNext.factions.faction_dawn.rating !== 60);
check("the next run's per-run state is fresh", (gNext.coordLog ?? []).length === 0 && gNext.day === 1);
check("the store stays tiny (no meaning, no run state)",
  !serialize(gNext).includes("crossRun") && Object.keys(store).sort().join(",") === "factions,version");

line(`\n${failed ? "SOME LOOP CRITERIA FAILED" : "ALL LOOP CRITERIA PASS"}\n`);
if (failed) process.exit(1);
