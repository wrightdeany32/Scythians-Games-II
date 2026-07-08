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
  drawFromMounted, mountedDecks, harvestCrossRun, newCrossRunStore, bandOf,
} from "../engine/engine";
import { dayMenu, runAction, startQueuedScene, advanceDay, runStatus } from "../engine/loop";
import { lintContent } from "../tools/lint";
import { dispositionCentroid, lensCentroid } from "../engine/centroid";
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

line(`\n${failed ? "SOME LOOP CRITERIA FAILED" : "ALL LOOP CRITERIA PASS"}\n`);
if (failed) process.exit(1);
