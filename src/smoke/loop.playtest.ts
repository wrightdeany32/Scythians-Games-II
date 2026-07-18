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
import { explorerDb } from "../content/explorer";
import {
  newGame, serialize, deserialize, applyOutcome, simulateClash,
  drawFromMounted, mountedDecks, harvestCrossRun, newCrossRunStore, bandOf,
} from "../engine/engine";
import { dayMenu, runAction, startQueuedScene, advanceDay, runStatus } from "../engine/loop";
import { lintContent } from "../tools/lint";
import { dispositionCentroid, lensCentroid } from "../engine/centroid";
import { journalLines } from "../engine/journal";
import { SceneRunner } from "../engine/scene";
import { seedToState } from "../engine/rng";
import type { ContentDB, GameState } from "../engine/types";

const SEED = 20260707;

const line = (s = "") => console.log(s);
let failed = false;
function check(name: string, ok: boolean, detail = ""): void {
  if (!ok) failed = true;
  line(`  ${ok ? "OK  " : "FAIL"} ${name}${detail ? `  (${detail})` : ""}`);
}
type Check = typeof check;
const quiet: Check = () => {};   // replay/save-load runs assert nothing — they only rebuild state

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
  check("actions refused while a morning scene is pending",
    runAction(g, loopDb, "lw_work").reason === "scene pending");
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

const poolIds = ["lw_street_1", "lw_street_2", "lw_street_lens", "lw_undercurrent_1"];
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
const arSeen = new Set<string>();
for (let i = 0; i < poolIds.length; i++) {
  const d = drawFromMounted(gAR, dbAntiRepeat, 1);
  if (d) arSeen.add(d.id);
}
check("anti-repeat: factor 0 never repeats within memory", arSeen.size === poolIds.length, `${arSeen.size} distinct draws`);
check("anti-repeat: exhausted pool draws NOTHING (never a forced repeat)",
  drawFromMounted(gAR, dbAntiRepeat, 1) === undefined, "then silence");

// -- Contract 1: lens-bias = proximity in lens space (WO-3), off by default
line(`\n-- lens-bias (Contract 1) --`);
const dbLensOn: ContentDB = { ...loopDb, tuning: { ...loopDb.tuning, lensBias: { enabled: true, strength: 9 } } };
const countLensWins = (db: ContentDB): number => {
  let wins = 0;
  for (let i = 0; i < 30; i++) {
    const gi = clone(gA);
    gi.rngState = seedToState(9000 + i);
    if (drawFromMounted(gi, db, 1)?.id === "lw_street_lens") wins++;
  }
  return wins;
};
const lensOff = countLensWins(loopDb);
const lensOn = countLensWins(dbLensOn);
check("lens-bias OFF: flavored card wins ~1/4 of draws", lensOff >= 2 && lensOff <= 15, `${lensOff}/30`);
check("lens-bias ON: draw drifts toward the digger's register", lensOn > lensOff && lensOn >= 13, `${lensOn}/30`);

// Floor 1.0, never a gate: a card whose flavor has ZERO affinity mass stays
// fully drawable (a one-card pool must still draw it with the bias on).
const dbZero: ContentDB = {
  ...dbLensOn,
  decks: [{ id: "deck:zero" }],
  events: {
    ...loopDb.events,
    lw_zero: { id: "lw_zero", tags: ["deck:zero"], lensFlavor: "lens_three", title: "Zero Affinity", body: "…", choices: [{ label: "ok", outcome: {} }] },
  },
};
const gZero = clone(gA);
check("lens-bias never gates: zero-affinity card still draws (floor 1.0)",
  drawFromMounted(gZero, dbZero, 1)?.id === "lw_zero");
check("lens-bias is deterministic under a fixed seed", (() => {
  const g1 = clone(gA); g1.rngState = seedToState(4242);
  const g2 = clone(gA); g2.rngState = seedToState(4242);
  return drawFromMounted(g1, dbLensOn, 1)?.id === drawFromMounted(g2, dbLensOn, 1)?.id;
})());

// -- Contract 2: band-select at card-fire (WO-3), noise off by default
line(`\n-- band-select (Contract 2) --`);
check("band boundaries: 7-10 grounded / 4-6 worn / 0-3 frayed",
  bandOf(10) === "grounded" && bandOf(7) === "grounded" && bandOf(6) === "worn" &&
  bandOf(4) === "worn" && bandOf(3) === "frayed" && bandOf(0) === "frayed");

// A banded card selects its authored variant by the player's TRUE band when
// the noise is off — deterministic presentation, no RNG consumed.
const fireBanded = (g: GameState, db: ContentDB) => {
  const resolutions: { band: { trueBand: string; resolvedBand: string } | null }[] = [];
  g.queue.push("lw_banded");
  const r = startQueuedScene(g, db, { onResolve: (res) => resolutions.push({ band: res.band }) })!;
  const prose = r.current.prose;
  const rng = g.rngState;
  driveScene(r);
  return { prose, band: resolutions[0]?.band ?? null, rngAtFire: rng };
};
const gB1 = clone(gA);                        // grip 10 → grounded
const b1 = fireBanded(gB1, loopDb);
check("noise off: variant = the true band, frozen on the record",
  b1.prose.includes("just a room") && b1.band?.trueBand === "grounded" && b1.band?.resolvedBand === "grounded");
const gB2 = clone(gA);
applyOutcome(gB2, loopDb, { stats: { grip: -8 } });   // grip 2 → frayed
const b2 = fireBanded(gB2, loopDb);
check("bands read the meter at fire (frayed shows the frayed room)",
  b2.prose.includes("will not resolve") && b2.band?.trueBand === "frayed");

const dbNoise: ContentDB = { ...loopDb, tuning: { ...loopDb.tuning, bandNoise: { enabled: true, p: 1 } } };
const gB3 = clone(gA);                        // grounded, p=1 → MUST leak, adjacent only
const b3 = fireBanded(gB3, dbNoise);
check("noise on (p=1): grounded leaks exactly one band, to worn",
  b3.band?.trueBand === "grounded" && b3.band?.resolvedBand === "worn" && b3.prose.includes("mostly just a room"));
const gB4 = clone(gA);
applyOutcome(gB4, loopDb, { stats: { grip: -8 } });   // frayed, p=1 → worn (never a two-band jump)
const b4 = fireBanded(gB4, dbNoise);
check("noise on (p=1): frayed leaks to worn, never two bands",
  b4.band?.trueBand === "frayed" && b4.band?.resolvedBand === "worn");
const gB5 = clone(gA);
applyOutcome(gB5, loopDb, { stats: { grip: -5 } });   // grip 5, worn, p=1 → leaves worn, either way
const b5 = fireBanded(gB5, dbNoise);
check("noise on (p=1): worn leaks symmetrically off worn",
  b5.band?.trueBand === "worn" && (b5.band?.resolvedBand === "grounded" || b5.band?.resolvedBand === "frayed"));
check("band-select is seed-deterministic", (() => {
  const x = clone(gA); x.rngState = seedToState(777);
  const y = clone(gA); y.rngState = seedToState(777);
  return fireBanded(x, dbNoise).band?.resolvedBand === fireBanded(y, dbNoise).band?.resolvedBand;
})());
check("unbanded cards never touch the resolver (band slot stays null)", (() => {
  const g = clone(gA);
  const res: (object | null)[] = [];
  g.queue.push("lw_promise");
  driveScene(startQueuedScene(g, dbNoise, { onResolve: (r) => res.push(r.band) })!);
  return res.length === 1 && res[0] === null;
})());

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

// The terminal CONTRACT: a flag set mid-scene doesn't abort the scene — the
// run is over when control returns to the day, surfaced on the next dayMenu.
const gTrap = clone(gA);
gTrap.queue.push("lw_trap");
const trap = startQueuedScene(gTrap, loopDb)!;
const trapCards = driveScene(trap);
check("terminal mid-scene: the scene still completes",
  trapCards.join(">") === "lw_trap>lw_trap_after");
const menuAfterTrap = dayMenu(gTrap, loopDb);
check("terminal mid-scene: caught the moment control returns to the day",
  menuAfterTrap.status.over && menuAfterTrap.status.flag === "lw_taken");

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
const store = harvestCrossRun(gA, loopDb, newCrossRunStore());
const gNext = newGame({ seed: 777, name: "Next", age: 30, body: { height: 0.5, build: 0.5 }, townId: "region_one", tier: "outer", crossRun: store }, loopDb);
check("faction scars persist into the next run",
  gNext.factions.faction_dawn.rating === gA.factions.faction_dawn.rating && gNext.factions.faction_dawn.rating !== 60);
check("the next run's per-run state is fresh", (gNext.coordLog ?? []).length === 0 && gNext.day === 1);
check("the store stays tiny (no meaning, no run state)",
  !serialize(gNext).includes("crossRun") && Object.keys(store).sort().join(",") === "factions,version");

// Content grows between vessels: the store contributes SCARS only — the
// world's shape is always content's.
const dbGrown: ContentDB = {
  ...loopDb,
  factions: {
    ...loopDb.factions,
    faction_noon: { id: "faction_noon", name: "Noon", homeTownId: "region_one", tier: "outer", rating: 50 },
  },
};
const gGrown = newGame({ seed: 778, name: "G", age: 30, body: { height: 0.5, build: 0.5 }, townId: "region_one", tier: "outer", crossRun: store }, dbGrown);
check("a faction added to content since the harvest still exists (authored power)",
  gGrown.factions.faction_noon?.rating === 50);
check("known factions still carry their scars under grown content",
  gGrown.factions.faction_dawn.rating === gA.factions.faction_dawn.rating);

// ================= Phase 1 additives (the content-wave prerequisites) ========
line(`\n-- Phase 1: branch-level fields, counters, multi-queue, statsMax --`);

// A mini world exercising every additive at once.
const miniDb: ContentDB = {
  ...loopDb,
  openingQueue: [],
  tuning: {
    ...loopDb.tuning,
    exposure: { coolPerDay: 0, stages: [{ at: 3, eventId: "p_stage1" }, { at: 6, eventId: "p_stage2" }] },
    calendar: { lastDay: 3 },
    lens: { vocabulary: ["lens_one", "lens_two", "null_lens"], nullFlavor: "null_lens" },
    crossRun: { harvestFlags: ["denied_thing"] },
    terminal: { onGripZero: true, flags: ["ended_quietly"] },
  },
  endings: [
    { eventId: "end_special", when: { kind: "flag", flag: "special_path" } },
    { eventId: "end_default" },
  ],
  doors: [],
  decks: [],
  events: {
    // branch-level fields + counters + multi-queue conditional insert
    m_fork: {
      id: "m_fork",
      title: "Fork",
      body: "base",
      diamondCoord: { sanction: 0.2, vertical: 0.2 },
      choices: [
        // branch coord+flavor override the card's
        { label: "a", diamondCoord: { sanction: -1, vertical: 1 }, lensFlavor: "lens_one", outcome: { addFlags: { theory: 1 }, queueEvents: ["m_insert", "m_after"] } },
        // branch flavor only — the card's coord inherits
        { label: "b", lensFlavor: "null_lens", outcome: { addFlags: { theory: 1 }, queueEvents: ["m_insert", "m_after"] } },
      ],
    },
    m_insert: {
      id: "m_insert",
      condition: { kind: "counter", flag: "theory", op: ">=", value: 2 },   // the conditional insert
      title: "Insert",
      body: "the insert fired",
      choices: [{ label: "ok", outcome: {} }],
    },
    m_after: { id: "m_after", title: "After", body: "the continuation", choices: [{ label: "ok", outcome: {} }] },
    // attune (Phase 2, option 3): card-level default, branch-level override
    m_intro: {
      id: "m_intro",
      title: "Introspective",
      body: "…",
      attune: 0.3,
      choices: [
        { label: "ground yourself", attune: -0.5, outcome: {} },
        { label: "let it drift", outcome: {} },   // inherits the card's +0.3
      ],
    },
    // exposure snapshot (Phase 2): the resolution raises the meter AFTER fire
    m_exposed: {
      id: "m_exposed",
      title: "Exposed",
      body: "…",
      choices: [{ label: "push it", outcome: { stats: { exposure: 3 } } }],
    },
    // conditional text
    m_echo: {
      id: "m_echo",
      title: "Echo",
      body: "plain base",
      bodyVariants: [{ when: { kind: "flag", flag: "charged" }, text: "charged base" }],
      bodyExtras: [
        { when: { kind: "flag", flag: "met_x" }, text: "echo of x" },
        { when: { kind: "flag", flag: "met_y" }, text: "echo of y" },
      ],
      choices: [{ label: "ok", outcome: {} }],
    },
    p_stage1: { id: "p_stage1", once: "p1_seen", title: "Stage 1", body: "…", choices: [{ label: "ok", outcome: { setFlags: { pressure_stage: 1 } } }] },
    p_stage2: { id: "p_stage2", once: "p2_seen", title: "Stage 2", body: "…", choices: [{ label: "ok", outcome: { setFlags: { pressure_stage: 2 } } }] },
    end_special: { id: "end_special", once: "end_special_seen", title: "Special End", body: "…", choices: [{ label: "ok", outcome: { setFlags: { ended_quietly: true } } }] },
    end_default: { id: "end_default", once: "end_default_seen", title: "Default End", body: "…", choices: [{ label: "ok", outcome: { setFlags: { ended_quietly: true, denied_thing: true } } }] },
  },
  actions: [
    { id: "m_train", name: "Train", sub: "…", cost: 1, outcome: { stats: { tradecraft: 2 }, statsMax: { tradecraft: 3 } } },
  ],
};
const newMini = (seed: number): GameState =>
  newGame({ seed, name: "M", age: 25, body: { height: 0.5, build: 0.5 }, townId: "region_one", tier: "outer" }, miniDb);

// branch-level fields feed the log at branch granularity
const gM = newMini(11);
gM.queue.push("m_fork");
driveScene(startQueuedScene(gM, miniDb)!, { m_fork: 0 });
const entryA = (gM.coordLog ?? [])[0];
check("branch coord+flavor override the card's",
  entryA?.diamondCoord?.sanction === -1 && entryA?.diamondCoord?.vertical === 1 && entryA?.lensFlavor === "lens_one");
check("conditional insert skipped below its counter (theory 1 < 2)",
  gM.flags.theory === 1 && !gM.flags.p1_seen && serialize(gM).includes('"m_insert"') === false);

const gM2 = newMini(12);
gM2.flags.theory = 1;                       // second dig: counter reaches 2 → the insert fires
gM2.queue.push("m_fork");
const cardsM2 = driveScene(startQueuedScene(gM2, miniDb)!, { m_fork: 1 });
check("conditional insert fires at its counter (theory 2)",
  cardsM2.join(">") === "m_fork>m_insert>m_after" && gM2.flags.theory === 2);
const entryB = (gM2.coordLog ?? [])[0];
check("branch flavor with inherited card coord (per-field fallback)",
  entryB?.lensFlavor === "null_lens" && entryB?.diamondCoord?.sanction === 0.2);

// statsMax: the soft ceiling
const gS = newMini(13);
driveScene(runAction(gS, miniDb, "m_train").runner!);
driveScene(runAction(gS, miniDb, "m_train").runner!);
check("statsMax caps the repeatable raiser (2+2 → 3, not 4)", gS.player.stats.tradecraft === 3);
gS.player.stats.tradecraft = 5;             // already above the cap: a raise never lowers it
gS.player.stats.energy = 1;
driveScene(runAction(gS, miniDb, "m_train").runner!);
check("statsMax never lowers a stat already above the cap", gS.player.stats.tradecraft === 5);

// conditional card text, frozen at fire
line(`\n-- Phase 1: conditional text, stages, endings, null pole, seeds --`);
const fireEcho = (setup: Record<string, boolean>): string => {
  const g = newMini(14);
  Object.assign(g.flags, setup);
  g.queue.push("m_echo");
  const r = startQueuedScene(g, miniDb)!;
  const prose = r.current.prose;
  driveScene(r);
  return prose;
};
check("bodyVariants: first match replaces the base", fireEcho({ charged: true }).startsWith("charged base"));
check("bodyVariants: no match keeps the base", fireEcho({}).startsWith("plain base"));
check("bodyExtras: every match appends in order",
  fireEcho({ met_x: true, met_y: true }) === "plain base\n\necho of x\n\necho of y");
check("bodyExtras: absent flags drop their echo", fireEcho({ met_y: true }) === "plain base\n\necho of y");

// staged exposure: one stage per morning, in order, plateau
const gP = newMini(15);
applyOutcome(gP, miniDb, { stats: { exposure: 7 } });   // past BOTH thresholds at once
advanceDay(gP, miniDb);
check("stages: the lowest unfired stage queues first", gP.queue.join(",") === "p_stage1");
driveScene(startQueuedScene(gP, miniDb)!);
advanceDay(gP, miniDb);
check("stages: the next stage follows on the next morning", gP.queue.join(",") === "p_stage2");
driveScene(startQueuedScene(gP, miniDb)!);
advanceDay(gP, miniDb);   // (day 4 also queues the calendar ending — the selector, not a stage)
check("stages: the plateau holds (fired stages never refire)",
  !gP.queue.includes("p_stage1") && !gP.queue.includes("p_stage2") && gP.flags.pressure_stage === 2);

// the calendar end + the ending-selector (flags-only, first match, once)
const gE = newMini(16);
gE.flags.special_path = true;
while (gE.day <= 3) advanceDay(gE, miniDb);
check("ending-selector: first matching ending greets the morning", gE.queue.join(",") === "end_special");
const endStatus = (() => { driveScene(startQueuedScene(gE, miniDb)!); return dayMenu(gE, miniDb).status; })();
check("ending's exit flag is the terminal", endStatus.over && endStatus.flag === "ended_quietly");
const gE2 = newMini(17);
while (gE2.day <= 3) advanceDay(gE2, miniDb);
check("ending-selector: unconditional fallback selected otherwise", gE2.queue.join(",") === "end_default");

// the null pole: null-flavored resolutions dilute every affinity toward zero
const gN = newMini(18);
for (let i = 0; i < 2; i++) { gN.queue.push("m_fork"); driveScene(startQueuedScene(gN, miniDb)!, { m_fork: 0 }); gN.flags.theory = 0; }
const massBefore = lensCentroid(gN, miniDb).lens_one ?? 0;
for (let i = 0; i < 4; i++) { gN.queue.push("m_fork"); driveScene(startQueuedScene(gN, miniDb)!, { m_fork: 1 }); gN.flags.theory = 0; }
const after = lensCentroid(gN, miniDb);
check("null pole: leaning null decays the centroid toward origin",
  (after.lens_one ?? 0) < massBefore * 0.5, `${massBefore.toFixed(2)} → ${(after.lens_one ?? 0).toFixed(2)}`);
check("null pole: the null flavor never accumulates mass of its own", after.null_lens === undefined);
const gN2 = newMini(19);
gN2.queue.push("m_fork");
driveScene(startQueuedScene(gN2, miniDb)!, { m_fork: 1 });
check("null pole: pure-null play sits at the origin (empty distribution)",
  Object.keys(lensCentroid(gN2, miniDb)).length === 0);

// cross-run seeds: content-declared flags persist, verbatim
const gEnd = newMini(20);
while (gEnd.day <= 3) advanceDay(gEnd, miniDb);
driveScene(startQueuedScene(gEnd, miniDb)!);            // end_default sets denied_thing
const storeSeeds = harvestCrossRun(gEnd, miniDb, newCrossRunStore());
const gVessel2 = newGame({ seed: 21, name: "V2", age: 30, body: { height: 0.5, build: 0.5 }, townId: "region_one", tier: "outer", crossRun: storeSeeds }, miniDb);
check("cross-run seeds: declared exit flags persist into the next vessel",
  storeSeeds.seeds?.denied_thing === true && gVessel2.flags.denied_thing === true);
check("cross-run seeds: undeclared flags never enter the store",
  Object.keys(storeSeeds.seeds ?? {}).join(",") === "denied_thing");

// -- the linter: a deliberately broken db yields exactly the expected issues
line(`\n-- Phase 1: the content linter --`);
const brokenDb: ContentDB = {
  ...loopDb,
  decks: [{ id: "deck:x" }],
  doors: [{ eventId: "no_such_event", when: { kind: "flag", flag: "f" } }],
  tuning: { lens: { vocabulary: ["lens_one"], nullFlavor: "lens_two" }, terminal: { flags: ["never_set"] } },
  events: {
    bad: {
      id: "bad",
      diamondCoord: { sanction: 2, vertical: 0 },          // out of range
      lensFlavor: "not_in_vocab",                          // outside the declared list
      title: "Bad",
      body: "…",
      choices: [
        { label: "a", outcome: { queueEvent: "also_missing", log: "You let it in — *the intent note leaks*." } },
        { label: "b", requires: { kind: "counter", flag: "ghost_counter", op: ">=", value: 2 }, outcome: {} },
      ],
    },
  },
  actions: [],
};
const found = lintContent(brokenDb, "broken");
const has = (needle: string, level: "error" | "warning") =>
  found.some((i) => i.level === level && i.message.includes(needle));
check("linter: unresolved event refs are errors", has('unknown event "no_such_event"', "error") && has('unknown event "also_missing"', "error"));
check("linter: out-of-range coords are errors", has("out of range", "error"));
check("linter: vocabulary violations are errors", has('"not_in_vocab"', "error") && has('nullFlavor "lens_two"', "error"));
check("linter: the intent-note leak is an error", has("*intent-note*", "error"));
check("linter: dead terminals and ghost counters warn", has('"never_set"', "warning") && has('"ghost_counter"', "warning"));
check("linter: the flag-web warns on a gate nothing writes", has('flag "f" is read', "warning"));
check("linter: the shipped dbs carry zero errors",
  lintContent(loopDb, "l").every((i) => i.level !== "error") &&
  lintContent(miniDb, "m").every((i) => i.level !== "error"));

// -- Phase 2: attune (option 3 — record now, read later) --------------------------
line(`\n-- Phase 2: attune (record-now-read-later) --`);
const gA1 = newMini(30);
gA1.queue.push("m_intro");
driveScene(startQueuedScene(gA1, miniDb)!, { m_intro: 0 });
const aEntry = (gA1.coordLog ?? [])[0];
check("attune: the chosen branch's value overrides the card's", aEntry?.attune === -0.5);
check("attune: an attune-only source appends index + attune, nothing else",
  aEntry?.diamondCoord === undefined && aEntry?.lensFlavor === undefined);
check("attune: recorded, never derived — both centroids ignore it",
  dispositionCentroid(gA1, miniDb).sanction === 0 && dispositionCentroid(gA1, miniDb).vertical === 0 &&
  Object.keys(lensCentroid(gA1, miniDb)).length === 0);
const gA2 = newMini(31);
gA2.queue.push("m_intro");
driveScene(startQueuedScene(gA2, miniDb)!, { m_intro: 1 });
check("attune: the card-level value is inherited when the branch carries none",
  (gA2.coordLog ?? [])[0]?.attune === 0.3);
check("linter: out-of-range attune is an error",
  lintContent({ ...miniDb, events: { ...miniDb.events, m_bad_att: { id: "m_bad_att", title: "x", body: "…", choices: [{ label: "a", attune: 2, outcome: {} }] } } }, "att")
    .some((i) => i.level === "error" && i.message.includes("attune out of range")));

// -- Phase 2: terminal precedence (grip-zero-wins) + the exposure snapshot --------
line(`\n-- Phase 2: terminal precedence, exposure snapshot --`);
// grip zero at the boundary: the morning queues NOTHING — no stages, no
// consequence, and no calendar ending stacked on top of the terminal.
const gT = newMini(32);
applyOutcome(gT, miniDb, { stats: { grip: -10, exposure: 7 } });   // terminal + past both stage thresholds
while (gT.day <= 3) advanceDay(gT, miniDb);                        // crosses lastDay too
check("terminal precedence: a lost morning queues nothing (no stages, no ending)",
  gT.queue.length === 0 && runStatus(gT, miniDb).cause === "grip");
// a designed terminal flag takes the same precedence
const gT2 = newMini(33);
gT2.flags.ended_quietly = true;
while (gT2.day <= 3) advanceDay(gT2, miniDb);
check("terminal precedence: a terminal flag also silences the selector",
  gT2.queue.length === 0 && runStatus(gT2, miniDb).flag === "ended_quietly");
// the substrate still runs at a lost boundary (uniform day turn)
check("terminal precedence: the substrate still turns the day", gT.day === 4 && gT2.day === 4);
// the exposure snapshot: frozen at card fire, before the resolution moves the meter
const gX = newMini(34);
applyOutcome(gX, miniDb, { stats: { exposure: 5 } });
gX.queue.push("m_exposed");
const snap: number[] = [];
const rX = new SceneRunner(gX, miniDb, { onResolve: (r) => snap.push(r.exposure) });
rX.begin();
rX.pick(0);
check("exposure snapshot: frozen at fire (5, not the post-resolution 8)",
  snap[0] === 5 && gX.player.stats.exposure === 8);

// -- Phase 2 follow-up: front-insert scene-chain continuations -----------------------
// Armature's morning-pileup ruling: a chained card continues the CURRENT scene
// before any other queued beat, so stacked mornings play each scene whole.
line(`\n-- Phase 2: front-insert (scene contiguity) --`);
const gF = newMini(35);
gF.queue.push("m_fork", "m_echo");   // a chained scene stacked beside another morning beat
check("front-insert: a scene plays contiguously before the next queued beat",
  driveScene(startQueuedScene(gF, miniDb)!, { m_fork: 0 }).join(">") === "m_fork>m_after>m_echo");
const gF2 = newMini(36);
gF2.flags.theory = 1;                // the insert's counter is met on this dig
gF2.queue.push("m_fork", "m_echo");
check("front-insert: the conditional insert still self-selects mid-chain",
  driveScene(startQueuedScene(gF2, miniDb)!, { m_fork: 1 }).join(">") === "m_fork>m_insert>m_after>m_echo");

// -- Phase 2.1: defer-terminal (the unanimous ruling: no authored climax dies
// to the calendar guillotine — the selector holds while a declared climax is
// in flight, and fires the morning after it resolves) -----------------------------
line(`\n-- Phase 2.1: defer-terminal --`);
const deferDb: ContentDB = { ...miniDb, tuning: { ...miniDb.tuning, calendar: { lastDay: 3, deferForScheduled: ["m_after"] } } };
const gD = newGame({ seed: 37, name: "D", age: 25, body: { height: 0.5, build: 0.5 }, townId: "region_one", tier: "outer" }, deferDb);
(gD.scheduled ||= []).push({ onDay: 5, eventId: "m_after" });   // the climax, promised past the calendar's end
while (gD.day <= 3) advanceDay(gD, deferDb);
check("defer-terminal: the selector holds while a declared climax is in flight", gD.queue.length === 0 && gD.day === 4);
advanceDay(gD, deferDb);
check("defer-terminal: the climax morning queues the climax, not the ending", gD.queue.join(",") === "m_after");
driveScene(startQueuedScene(gD, deferDb)!);
advanceDay(gD, deferDb);
check("defer-terminal: the calendar closes the morning after the climax resolves", gD.queue.join(",") === "end_default");

// -- Phase 2: the Explorer pack, verified by driving ---------------------------------
// A scripted two-week run through the wired content: opening → threads →
// pressure gradient → the return terminal; then the never-returned calendar
// ending on a second game. Cave correctness is the cave playtest's job — the
// cave exit flags are set directly here so this section tests the NEW wiring.
line(`\n-- Phase 2: the Explorer pack (scripted run) --`);

const newExplorer = (seed: number): GameState =>
  newGame({ seed, name: "You", age: 27, body: { height: 0.5, build: 0.5 }, townId: "town_edge", tier: "outer" }, explorerDb);

const gU = newExplorer(41);
// Day 1: the opening stub (creation-as-turn-zero), then Doug's workout.
driveScene(startQueuedScene(gU, explorerDb)!);
check("explorer: the welcome sets the start flags, seeds the origin, schedules Marie",
  gU.flags.arrived_town === true && gU.flags.thread_doug === true && gU.flags.origin_fresh_start === true &&
  (gU.scheduled ?? []).some((s) => s.eventId === "ux_marie_warning"));
driveScene(runAction(gU, explorerDb, "ux_act_doug_workout").runner!, { ux_doug_workout_first: 0 });
check("explorer: the workout beat fires once and schedules the message",
  gU.flags.doug_warmth === true && gU.player.stats.tradecraft === 1 &&
  (gU.scheduled ?? []).some((s) => s.eventId === "ux_doug_message"));
check("explorer: the workout introspective is locked before any anomaly",
  (() => { gU.queue.push("ux_doug_workout_first"); const r = startQueuedScene(gU, explorerDb); if (r && !r.done) { const ok = r.current.card === "__end__"; return ok; } return true; })());
// (the once-flag ate the re-queue: the scene ends immediately)
advanceDay(gU, explorerDb);
advanceDay(gU, explorerDb);
// Day 3: Marie's warning + Doug's message land together; engage Marie, note the text.
driveScene(startQueuedScene(gU, explorerDb)!, { ux_marie_warning: 1, ux_doug_message: 0, ux_marie_offer: 0 });
check("explorer: Marie engaged — the woods are planned",
  gU.flags.marie_engaged === true && gU.flags.marie_woods_planned === true &&
  (gU.scheduled ?? []).some((s) => s.eventId === "ux_marie_woods"));
// The first cave trip stands in as flags (the cave playtest owns that scene).
applyOutcome(gU, explorerDb, { setFlags: { cave_done: true, took_shard: true, cave_etchings_seen: true, etchings_link_nora: true, cave_heard_voice: true } });
advanceDay(gU, explorerDb);
// Day 4: the copy's first night fires; Nora's call is PROMISED, not queued —
// the afterDays door keeps Loom's two-day beat (an ordinary day between).
driveScene(startQueuedScene(gU, explorerDb)!, { ux_shard_settles: 0 });
check("explorer: the copy banks its charge; the call keeps the two-day beat (promised, not queued)",
  gU.player.stats.exposure === 2 && !gU.flags.nora_intro_seen &&
  (gU.scheduled ?? []).some((s) => s.eventId === "ux_nora_intro"));
driveScene(runAction(gU, explorerDb, "ux_act_research_symbol").runner!, { ux_research_symbol: 1 });
check("explorer: the shallow dig advances the theory without the grip cost",
  gU.flags.theory_spiritual === 1 && gU.player.stats.grip === 10);
advanceDay(gU, explorerDb);
// Day 5: the woods walk (scheduled day 3) and Nora's call land together; the
// walk plays contiguously (front-insert), then the call.
driveScene(startQueuedScene(gU, explorerDb)!,
  { ux_marie_woods: 0, ux_marie_ellen: 0, ux_marie_grave: 0, ux_marie_close: 0, ux_nora_intro: 0 });
check("explorer: the walk opens the pattern and the suspicion; the call lands on its own morning",
  gU.flags.pattern_open === true && gU.flags.grave_suspicion === true &&
  gU.flags.thread_nora === true && gU.flags.nora_center_known === true);
check("explorer: the Marie split — Dale's pointer lands beside the pattern, never traded",
  gU.flags.pointed_to_dale === true && !serialize(gU).includes("knows_ellen"));
// The vault and Dale, same day (energy: walk 1 + grave 1 + Dale 1).
driveScene(runAction(gU, explorerDb, "ux_act_grave_visit").runner!, { ux_grave_visit: 0, ux_grave_look: 0, ux_grave_close: 0 });
check("explorer: the vault opens once and the action retires",
  gU.flags.grave_confirmed_empty === true && gU.flags.grave_beat_done === true &&
  !dayMenu(gU, explorerDb).actions.some((a) => a.id === "ux_act_grave_visit"));
driveScene(runAction(gU, explorerDb, "ux_act_dale_visit").runner!, { ux_dale_warning: 1 });
check("explorer: the split lets one run hold Dale's bond and the pattern", gU.flags.dale_bond === true);
advanceDay(gU, explorerDb);
// Day 6: stage 1 (exposure 4 ≥ 3: the copy + the vault), then the day-trip.
check("explorer: stage 1 greets the morning", gU.queue.includes("ux_pressure_stage1"));
driveScene(startQueuedScene(gU, explorerDb)!, { ux_pressure_stage1: 0 });
check("explorer: stage 1 fired once", gU.flags.pressure_stage === 1 && gU.flags.pressure1_seen === true);
driveScene(runAction(gU, explorerDb, "ux_act_nora_daytrip").runner!,
  { ux_nora_daytrip: 0, ux_nora_arrive: 0, ux_nora_explore: 0, ux_nora_rangers: 0, ux_nora_escape: 0, ux_nora_breakdown: 1, ux_nora_close: 0 });
check("explorer: the day-trip lands — pact kept, the sticky meter at the three-act total",
  gU.flags.nora_pact === true && gU.flags.nora_daytrip_done === true && gU.player.stats.exposure === 6 &&
  (gU.coordLog ?? []).some((e) => e.lensFlavor === "skeptic"));
advanceDay(gU, explorerDb);
// Day 7: the nudge (scheduled), the convergence (door), stage 2 (6 ≥ 5) — one
// morning, each scene playing whole. The convergence stays coordinate-silent:
// the log grows by exactly the stage's attune entry.
check("explorer: the convergence door fires once both threads have spoken", gU.queue.includes("ux_convergence_pattern"));
const coordLenBeforeConv = (gU.coordLog ?? []).length;
driveScene(startQueuedScene(gU, explorerDb)!, { ux_doug_nudge: 0, ux_convergence_pattern: 0, ux_pressure_stage2: 0 });
check("explorer: stage 2 fired; the nudge fired for the silent player", gU.flags.pressure_stage === 2 && gU.flags.doug_nudge_seen === true);
check("explorer: the convergence is coordinate- and lens-silent (only the stage's attune landed)",
  gU.flags.convergence_seen === true && (gU.coordLog ?? []).length === coordLenBeforeConv + 1 &&
  (gU.coordLog ?? []).slice(-1)[0]?.attune === -0.25);
driveScene(runAction(gU, explorerDb, "ux_act_doug_reply").runner!, { ux_doug_dinner_invite: 0 });
check("explorer: the reply reaches back and books the dinner",
  gU.flags.doug_reached_back === true && (gU.scheduled ?? []).some((s) => s.eventId === "ux_doug_dinner_arrive"));
advanceDay(gU, explorerDb);
// Day 8: THE APEX — stage 3 at the three-act total (the 3/5/6 ladder's whole
// point: the committed-deep player reaches the Weather, and the dale_bond
// easing gets to exist) — then the dinner, the knife.
check("explorer: stage 3 greets the committed-deep morning (the revived apex)", gU.queue.includes("ux_pressure_stage3"));
driveScene(startQueuedScene(gU, explorerDb)!,
  { ux_pressure_stage3: 0, ux_doug_dinner_arrive: 0, ux_doug_dinner_cake: 0, ux_doug_dinner_cut: 3, ux_doug_dinner_close: 0 });
check("explorer: the Weather fired for the three-act player, easing in reach",
  gU.flags.pressure_stage === 3 && gU.flags.pressure3_seen === true && gU.flags.dale_bond === true);
check("explorer: the knife is complicity — flag set, enable-lean logged",
  gU.flags.dinner_took_knife === true &&
  (gU.coordLog ?? []).some((e) => e.diamondCoord?.vertical === 0.3));
advanceDay(gU, explorerDb); advanceDay(gU, explorerDb); advanceDay(gU, explorerDb);
// Day 11: the ask — commit (money set aside), meeting in two days.
driveScene(startQueuedScene(gU, explorerDb)!, { ux_doug_invitation: 0 });
check("explorer: the commitment hook sets the money aside",
  gU.flags.doug_committed === true && gU.flags.money_set_aside_doug === true);
advanceDay(gU, explorerDb); advanceDay(gU, explorerDb);
// Day 13: the observation meeting — the mark insert fires off the cave flag.
const meetingCards = driveScene(startQueuedScene(gU, explorerDb)!,
  { ux_doug_meeting_arrive: 0, ux_doug_meeting_observe: 0, ux_doug_meeting_mark: 0, ux_doug_meeting_close: 1 });
check("explorer: the meeting chain runs with the conditional mark insert",
  meetingCards.join(">") === "ux_doug_meeting_arrive>ux_doug_meeting_observe>ux_doug_meeting_mark>ux_doug_meeting_close" &&
  gU.flags.meeting_mark_seen === true && gU.flags.doug_meeting_embraced === true);
advanceDay(gU, explorerDb);
// Day 14: the return — introspective entry (attune), grounded descent, the truth held.
const returnCards = driveScene(runAction(gU, explorerDb, "ux_act_return_whites").runner!,
  { ux_return_enter: 1, ux_return_descend: 0, ux_return_erased: 0, ux_return_fork: 0, ux_return_deep: 0, ux_return_knife_deep: 3, ux_return_end: 0 });
check("explorer: the illegible insert stays shut at high grip",
  !returnCards.includes("ux_return_illegible") && returnCards.includes("ux_return_deep"));
check("explorer: attune recorded on the introspective entry",
  (gU.coordLog ?? []).some((e) => e.attune === 0.25));
check("explorer: the run ends on the authored terminal",
  gU.flags.run_end_whites_return === true && gU.flags.held_truth === true && gU.flags.reese_strained === true &&
  runStatus(gU, explorerDb).flag === "run_end_whites_return");
advanceDay(gU, explorerDb);
check("explorer: terminal precedence — the lost morning queues nothing", gU.queue.length === 0);
const harvestU = harvestCrossRun(gU, explorerDb, newCrossRunStore());
check("explorer: held_truth persists across vessels; denied_knife does not (not chosen)",
  harvestU.seeds?.held_truth === true && harvestU.seeds?.denied_knife === undefined);

// THE TERMINAL FENCE, asserted automatically (Armature's belt-and-suspenders,
// endorsed four seats): ux_return_end's certainty clause must follow the route
// actually taken — and a stray path that never touched the fork must read the
// route-neutral base, never a contradiction. Guards the fence's route selection
// the way crit 13 guards the empty screen: a future edit to the card can't
// silently re-open BR-2's seam.
line(`\n-- the terminal fence (ux_return_end route selection) --`);
const fireReturnEnd = (flags: Record<string, boolean>): string => {
  const g = newExplorer(48);
  driveScene(startQueuedScene(g, explorerDb)!);   // clear the opening (the mis-probe lesson: a seeded queue reads the wrong card)
  Object.assign(g.flags, flags);
  g.queue.push("ux_return_end");
  const r = startQueuedScene(g, explorerDb)!;
  const prose = r.current.prose;
  driveScene(r);
  return prose;
};
const deepEnd = fireReturnEnd({ return_went_deep: true });
const backEnd = fireReturnEnd({ return_turned_back: true });
const strayEnd = fireReturnEnd({});
check("fence: the went-deep run earns the deep clause",
  deepEnd.includes("came anyway and didn't turn back"));
check("fence: the turned-back run reads its own certainty, never the deep clause (BR-2's seam)",
  backEnd.includes("turning around bought you nothing") && !backEnd.includes("didn't turn back"));
check("fence: a stray path that never touched the fork reads the route-neutral base",
  strayEnd.includes("that it meant to. Certainty and proof") &&
  !strayEnd.includes("didn't turn back") && !strayEnd.includes("turning around bought you nothing"));

// SCHEDULER RECURRENCE, verified by driving (the ledger's open engine
// question — Static's deep arc and the long-Run-Read loop-back depend on it):
// the same event CAN re-present on a later day. scheduleEvent carries no
// dedup and the sweep re-queues whatever is due, so a fixture re-presents by
// re-scheduling (or an un-fenced door re-firing); the ONLY recurrence fence
// is the event's own `once` flag.
line(`\n-- scheduler recurrence (a fixture can re-present) --`);
const gRec = newMini(50);
applyOutcome(gRec, miniDb, { scheduleEvent: { eventId: "m_after", inDays: 1 } });
advanceDay(gRec, miniDb);
const recFirst = gRec.queue.includes("m_after");
driveScene(startQueuedScene(gRec, miniDb)!);
applyOutcome(gRec, miniDb, { scheduleEvent: { eventId: "m_after", inDays: 2 } });   // re-promise the SAME event
advanceDay(gRec, miniDb);
const recQuietDay = !gRec.queue.includes("m_after");   // not due yet — no early fire
advanceDay(gRec, miniDb);
check("recurrence: a re-scheduled event fires again on its later day (no dedup, no hidden fence)",
  recFirst && recQuietDay && gRec.queue.includes("m_after"));
driveScene(startQueuedScene(gRec, miniDb)!);
const gRec2 = newMini(51);
applyOutcome(gRec2, miniDb, { scheduleEvent: { eventId: "p_stage1", inDays: 1 } });
advanceDay(gRec2, miniDb);
driveScene(startQueuedScene(gRec2, miniDb)!);         // fires; p_stage1 sets its once flag
applyOutcome(gRec2, miniDb, { scheduleEvent: { eventId: "p_stage1", inDays: 1 } });
advanceDay(gRec2, miniDb);
check("recurrence: the `once` flag is the one fence — a re-scheduled once-event queues but its scene ends immediately",
  (() => { const r = startQueuedScene(gRec2, miniDb); return !!r && r.done; })());

// The never-returned run: dismiss Marie, never go back, reach the calendar's end.
const gV = newExplorer(42);
driveScene(startQueuedScene(gV, explorerDb)!);
applyOutcome(gV, explorerDb, { setFlags: { doug_lingering: true, money_set_aside_doug: true, cave_etchings_seen: true } });
let endingProse = "";
for (let i = 0; i < 20 && !runStatus(gV, explorerDb).over; i++) {
  advanceDay(gV, explorerDb);
  const r = startQueuedScene(gV, explorerDb);
  if (r) {
    endingProse = r.current.prose;
    driveScene(r, { ux_marie_warning: 0, ux_ending_never_returned: 0, ux_ending_never_close: 1 });
    if (r.current.card === "__end__" && endingProse.includes("season turns")) break;
  }
}
check("explorer: the calendar hands the quiet run its authored ending",
  gV.flags.run_end_never_returned === true && runStatus(gV, explorerDb).flag === "run_end_never_returned");
check("explorer: the ending reflects THIS run (echoes present, absent ones dropped)",
  endingProse.includes("Doug still picks you up at six") &&
  endingProse.includes("The pieces you bought that night") &&
  !endingProse.includes("Nora calls, eventually"));
check("explorer: the closing attune fork recorded the kept question",
  (gV.coordLog ?? []).some((e) => e.attune === 0.25));

// Defer-terminal in the shipped pack: the Doug break scheduled past lastDay 14
// holds the calendar open, fires, and THEN the quiet ending closes the run.
const gW = newExplorer(43);
driveScene(startQueuedScene(gW, explorerDb)!);
applyOutcome(gW, explorerDb, { setFlags: { doug_meeting_open: true }, scheduleEvent: { eventId: "ux_doug_break", inDays: 15 } });
while (gW.day < 15) {
  advanceDay(gW, explorerDb);
  const r = startQueuedScene(gW, explorerDb);
  if (r) driveScene(r, { ux_marie_warning: 0 });
}
advanceDay(gW, explorerDb);   // day 16 would be next — but first verify day 15 deferred
check("explorer: defer-terminal holds the calendar for the scheduled break",
  gW.day === 16 && gW.queue.join(",") === "ux_doug_break");
driveScene(startQueuedScene(gW, explorerDb)!,
  { ux_doug_break: 0, ux_doug_break_meet: 0, ux_doug_break_open_route: 0, ux_doug_break_linger: 0 });
advanceDay(gW, explorerDb);
driveScene(startQueuedScene(gW, explorerDb)!, { ux_ending_never_returned: 0, ux_ending_never_close: 0 });
check("explorer: the climax lands past the calendar, then the quiet ending closes the run",
  gW.flags.doug_lingering === true && gW.flags.run_end_never_returned === true &&
  runStatus(gW, explorerDb).flag === "run_end_never_returned");

// Denise (first build): the mirror's two paths — the crack, and the pursuit's
// threshold terminal with its cross-run harvest.
const gDe = newExplorer(44);
driveScene(startQueuedScene(gDe, explorerDb)!);
applyOutcome(gDe, explorerDb, { setFlags: { marie_episode_done: true } });
advanceDay(gDe, explorerDb);
check("denise: the pointer door fires off the Ellen thread", gDe.queue.includes("ux_denise_pointer"));
driveScene(startQueuedScene(gDe, explorerDb)!);
driveScene(runAction(gDe, explorerDb, "ux_act_denise_visit").runner!, { ux_denise_visit: 1, ux_denise_crack: 1 });
check("denise: catching the gap cracks the certainty — and resolves nothing about Dale",
  gDe.flags.denise_broke === true && gDe.flags.denise_met === true && !gDe.flags.dale_suspected);
const gP2 = newExplorer(45);
driveScene(startQueuedScene(gP2, explorerDb)!);
applyOutcome(gP2, explorerDb, { setFlags: { marie_episode_done: true } });
advanceDay(gP2, explorerDb);
driveScene(startQueuedScene(gP2, explorerDb)!);
driveScene(runAction(gP2, explorerDb, "ux_act_denise_visit").runner!, { ux_denise_visit: 0 });
check("denise: taking the certainty arms the pursuit (the close carries the assembling case)",
  gP2.flags.dale_suspected === true && gP2.flags.denise_met === true);
// The pursuit is ONE chosen escalation: the lead action, then commit → commit
// → the threshold. Every step picked, never railroaded.
const pursuitCards = driveScene(runAction(gP2, explorerDb, "ux_act_pursue_dig").runner!,
  { ux_pursue_dig: 0, ux_pursue_authorities: 1, ux_pursue_drastic: 0 });
check("denise: the chosen escalation runs dig → refusal → threshold",
  pursuitCards.join(">") === "ux_pursue_dig>ux_pursue_authorities>ux_pursue_drastic");
check("denise: the run ends at the open car door — the authored terminal, harvested for the collision",
  gP2.flags.run_end_pursuit === true && gP2.flags.went_after_dale === true &&
  runStatus(gP2, explorerDb).flag === "run_end_pursuit" &&
  harvestCrossRun(gP2, explorerDb, newCrossRunStore()).seeds?.went_after_dale === true);
// The stop-exit is a real off-ramp: a second run drops the pursuit at the dig
// and the lead retires for good.
const gP3 = newExplorer(46);
driveScene(startQueuedScene(gP3, explorerDb)!);
applyOutcome(gP3, explorerDb, { setFlags: { marie_episode_done: true } });
advanceDay(gP3, explorerDb);
driveScene(startQueuedScene(gP3, explorerDb)!);
driveScene(runAction(gP3, explorerDb, "ux_act_denise_visit").runner!, { ux_denise_visit: 0 });
driveScene(runAction(gP3, explorerDb, "ux_act_pursue_dig").runner!, { ux_pursue_dig: 1 });
check("denise: the dig's off-ramp wakes the player up and retires the lead",
  gP3.flags.pursuit_dropped === true && !runStatus(gP3, explorerDb).over &&
  !dayMenu(gP3, explorerDb).actions.some((a) => a.id === "ux_act_pursue_dig"));
// The cross-run collision: a vessel whose harvest carries went_after_dale sits
// on Dale's porch — nameless shame, once, never confirmed.
const gCol = newGame(
  { seed: 47, name: "You", age: 27, body: { height: 0.5, build: 0.5 }, townId: "town_edge", tier: "outer",
    crossRun: { version: 1, seeds: { went_after_dale: true, dale_suspected: true } } },
  explorerDb);
driveScene(startQueuedScene(gCol, explorerDb)!);
applyOutcome(gCol, explorerDb, { setFlags: { pointed_to_dale: true, dale_met: true, dale_bond: true } });
const porch1 = runAction(gCol, explorerDb, "ux_act_dale_porch").runner!;
check("denise: the collision surfaces on the porch — nameless, never confirmed",
  porch1.current.prose.includes("unbearably ashamed of something you have never done"));
driveScene(porch1);
const porch2 = runAction(gCol, explorerDb, "ux_act_dale_porch").runner!;
check("denise: the collision fires once; the porch stays a porch after",
  !porch2.current.prose.includes("unbearably ashamed") && porch2.current.prose.includes("second cup"));
driveScene(porch2);

// -- the journal surface: derived on read, stored nowhere, authored order --------
line(`\n-- Phase 2.2: the journal surface --`);
const jDb: ContentDB = {
  ...miniDb,
  journal: [
    { when: { kind: "flag", flag: "met_x" }, line: "You met X." },
    { when: { kind: "flag", flag: "charged" }, line: "The thing was charged when you found it." },
  ],
};
const gJ = newMini(38);
check("journal: empty before anything is known", journalLines(gJ, jDb).length === 0);
gJ.flags.charged = true;
check("journal: a line exists only once earned", journalLines(gJ, jDb).join("|") === "The thing was charged when you found it.");
gJ.flags.met_x = true;
check("journal: authored order, not earn order",
  journalLines(gJ, jDb).join("|") === "You met X.|The thing was charged when you found it.");
check("journal: derived on read, stored nowhere (the save carries no journal key)",
  !serialize(gJ).includes("journal"));
check("linter: a journal intent-note leak is an error",
  lintContent({ ...jDb, journal: [{ when: { kind: "flag", flag: "f" }, line: "You saw it — *the note leaks*." }] }, "j")
    .some((i) => i.level === "error" && i.message.includes("journal line")));

check("linter: the explorer db carries zero errors",
  lintContent(explorerDb, "explorer").every((i) => i.level !== "error"));

// ── the route-neutral-base regression crit (BR-2's recurring seam class) ──────
// A terminal/summary beat that references a route-specific choice gets a
// route-neutral BASE + bodyVariants, so a path reaching it WITHOUT passing the
// fork reads a true line, never a contradiction — the seam that has bitten
// three times (Marie's mouth-words, the Nora→dinner braid, this return
// terminal). This pins ux_return_end: fired under each route flag it renders
// that route's certainty; fired under NEITHER it must fall to the neutral base
// and carry NO route-specific "that it knows you…" clause. Locks the fix so a
// future edit that folds a route assumption back into the base fails here.
function returnEndBody(route: Record<string, boolean>): string {
  const g = newGame({ seed: 99, name: "N", age: 25, body: { height: 0.5, build: 0.5 }, townId: "town_edge", tier: "outer" }, explorerDb);
  applyOutcome(g, explorerDb, { setFlags: route });
  g.queue.length = 0;                 // drop newGame's opening seed; fire only the terminal
  g.queue.push("ux_return_end");
  const r = new SceneRunner(g, explorerDb);
  r.begin();
  return r.current.prose;
}
const rnBase = returnEndBody({});
const rnDeep = returnEndBody({ return_went_deep: true });
const rnBack = returnEndBody({ return_turned_back: true });
const ROUTE_CLAUSE = "that it knows you";   // the opener of every route-specific certainty clause
check("route-neutral base: ux_return_end neutral base carries no route-specific clause",
  rnBase.includes("that it meant to. Certainty") && !rnBase.includes(ROUTE_CLAUSE),
  rnBase.includes(ROUTE_CLAUSE) ? "LEAK: a route clause reached the neutral base" : "base reads route-neutral");
check("route-neutral base: each route selects its own variant, all three distinct",
  rnDeep.includes("didn't turn back") && rnBack.includes("kept to the shallows") &&
  rnDeep !== rnBase && rnBack !== rnBase && rnDeep !== rnBack);

line(`\n${failed ? "SOME LOOP CRITERIA FAILED" : "ALL LOOP CRITERIA PASS"}\n`);
if (failed) process.exit(1);
