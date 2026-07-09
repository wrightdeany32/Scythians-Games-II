// ============================================================================
// bots/run.ts — the bot A/B driver (npm run bots): Azimuth's measurement rig,
// built to the Batch-3 contracts and the Phase-2 round's tuning asks.
//
// TWO INSTRUMENTS IN ONE RUNNER:
//
//   1 · PACING SWEEP (the explorer pack): deterministic bot personas play the
//       whole campaign across seeds — quiet-to-thread action ratio, exposure
//       trajectory + stage-crossing days, thread-exhaustion days (which beats
//       a run reaches, and when), terminal mix, defer-terminal exercise. This
//       is the data Loom + Armature tune `lastDay` and the exposure economy
//       against.
//   2 · FACTOR A/Bs (seed-matched, loopworld): each Weight-step switch
//       (diamondProximity, lensBias, antiRepeat) measured OFF vs ON on
//       identical seeds — the ratified isolate-each-factor's-drift guardrail —
//       plus the band-noise leak rate. Direct draw-sampling, not full runs:
//       the switches only touch weightedPick/resolveBand, so sampling the
//       chokepoint IS the measurement.
//
// DISCIPLINE NOTES:
//   · Bot decisions use their OWN seeded PRNG (mulberry32) — the game's RNG
//     advances only through engine calls, so a bot run replays exactly and
//     factor A/Bs stay seed-matched.
//   · Bots are telemetry: they read flags, stats, and resolution records —
//     the legal readers. Nothing here feeds a decision back into the draw.
//   · Every resolution lands in a trace-only Recorder stream (the canonical
//     record shape — the Session invariant's bot mode, at loop level).
// ============================================================================

import { writeFileSync, mkdirSync } from "node:fs";
import { explorerDb } from "../content/explorer";
import { loopDb } from "../smoke/loopworld";
import {
  newGame, applyOutcome, resolveBand, drawFromMounted, serialize,
} from "../engine/engine";
import { dayMenu, runAction, startQueuedScene, advanceDay, runStatus } from "../engine/loop";
import type { RunStatus } from "../engine/loop";
import { SceneRunner } from "../engine/scene";
import { Recorder } from "../coldread/recorder";
import type { ContentDB, GameState } from "../engine/types";

// ---- the bot's own PRNG (never the game's) --------------------------------------
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- personas ---------------------------------------------------------------------
// Action classes: quiet = the breather set; thread = everything else.
const isQuiet = (id: string) => id.startsWith("ux_life_");

interface Persona {
  name: string;
  // pick an affordable action id, or null to end the day
  pickAction: (g: GameState, db: ContentDB, rnd: () => number, used: Set<string>) => string | null;
  // pick an option index among available ones
  pickChoice: (available: number[], rnd: () => number) => number;
}

const PERSONAS: Persona[] = [
  {
    // The thread-chaser: engages everything, prefers beats it hasn't tried.
    name: "chaser",
    pickAction: (g, db, rnd, used) => {
      const menu = dayMenu(g, db);
      const affordable = menu.actions.filter((a) => a.cost <= g.player.stats.energy);
      const threads = affordable.filter((a) => !isQuiet(a.id));
      const fresh = threads.filter((a) => !used.has(a.id));
      const pool = fresh.length ? fresh : threads.length ? threads : affordable;
      if (!pool.length) return null;
      return pool[Math.floor(rnd() * pool.length)].id;
    },
    pickChoice: (avail, rnd) => avail[Math.floor(rnd() * avail.length)],
  },
  {
    // The quiet-liver: breathers only; in scenes, always the first (usually
    // the sensible/dismissive) option. The denial-brake made a policy.
    name: "quiet",
    pickAction: (g, db) => {
      const menu = dayMenu(g, db);
      const pool = menu.actions.filter((a) => isQuiet(a.id) && a.cost <= g.player.stats.energy);
      return pool.length ? pool[0].id : null;
    },
    pickChoice: (avail) => avail[0],
  },
  {
    // The balanced life: one thread beat a day if one's fresh, breathers after.
    name: "balanced",
    pickAction: (g, db, rnd, used) => {
      const menu = dayMenu(g, db);
      const affordable = menu.actions.filter((a) => a.cost <= g.player.stats.energy);
      const freshThreads = affordable.filter((a) => !isQuiet(a.id) && !used.has(a.id));
      const quiet = affordable.filter((a) => isQuiet(a.id));
      if (freshThreads.length && ![...used].some((u) => !isQuiet(u) && used.has(u + ":" + g.day))) {
        const a = freshThreads[Math.floor(rnd() * freshThreads.length)];
        used.add(a.id + ":" + g.day);   // one thread beat per day
        return a.id;
      }
      return quiet.length ? quiet[Math.floor(rnd() * quiet.length)].id : null;
    },
    pickChoice: (avail, rnd) => avail[Math.floor(rnd() * avail.length)],
  },
];

// ---- the pacing sweep ---------------------------------------------------------------
const MILESTONES = [
  "cave_done", "took_shard", "marie_episode_done", "grave_suspicion", "grave_beat_done",
  "thread_nora", "nora_daytrip_done", "doug_dinner_done", "doug_meeting_done", "doug_break_done",
  "dale_met", "dale_bond", "pointed_to_denise", "denise_met", "convergence_seen",
  "pressure1_seen", "pressure2_seen", "pressure3_seen",
  "run_end_whites_return", "run_end_never_returned", "went_after_dale",
] as const;

interface BotRun {
  persona: string;
  seed: number;
  days: number;
  terminal: string;
  quietActions: number;
  threadActions: number;
  exposureByDay: number[];
  milestoneDay: Record<string, number>;
  traceRecords: number;
  deferredMornings: number;   // mornings past lastDay the selector held
}

const MAX_DAYS = 40;

function runBot(db: ContentDB, seed: number, persona: Persona): BotRun {
  const rnd = mulberry32(seed * 2654435761 + persona.name.length);
  const g = newGame({ seed, name: "Bot", age: 27, body: { height: 0.5, build: 0.5 }, townId: "town_edge", tier: "outer" }, db);
  const recorder = new Recorder({ contentId: "explorer-bot", buildTag: "bots-v1", seed });
  const used = new Set<string>();
  const milestoneDay: Record<string, number> = {};
  const exposureByDay: number[] = [];
  let quietActions = 0, threadActions = 0, traceRecords = 0, deferredMornings = 0;

  const hooks = {
    onResolve: (r: import("../engine/scene").SceneResolution) => {
      traceRecords++;
      recorder.pushTrace({
        step: r.step, day: r.day, card: r.card, choiceIndex: r.choiceIndex, choiceLabel: r.choiceLabel,
        statDeltas: r.statDeltas, flagsChanged: r.flagsChanged, roll: r.roll,
        band: r.band ?? { trueBand: null, resolvedBand: null }, exposure: r.exposure,
      });
    },
  };
  const drive = (runner: SceneRunner): void => {
    let guard = 0;
    while (!runner.done && guard++ < 60) {
      const avail = runner.current.options.filter((o) => o.available).map((o) => o.index);
      if (!avail.length) break;
      runner.pick(persona.pickChoice(avail, rnd));
    }
  };
  const noteMilestones = (): void => {
    for (const m of MILESTONES) if (g.flags[m] && milestoneDay[m] === undefined) milestoneDay[m] = g.day;
  };

  let status: RunStatus = runStatus(g, db);
  let guard = 0;
  const lastDay = db.tuning?.calendar?.lastDay ?? Infinity;
  while (!status.over && g.day <= MAX_DAYS && guard++ < 200) {
    // morning: drain queued scenes
    let r = startQueuedScene(g, db, hooks);
    while (r) { drive(r); r = startQueuedScene(g, db, hooks); }
    noteMilestones();
    status = runStatus(g, db);
    if (status.over) break;
    // act while the persona wants to and energy lasts
    let picks = 0;
    while (picks++ < 8) {
      const id = persona.pickAction(g, db, rnd, used);
      if (!id) break;
      const res = runAction(g, db, id, hooks);
      if (!res.ok) break;
      used.add(id);
      if (isQuiet(id)) quietActions++; else threadActions++;
      drive(res.runner!);
      noteMilestones();
      if (runStatus(g, db).over) break;
    }
    exposureByDay.push(g.player.stats.exposure);
    status = advanceDay(g, db);
    if (!status.over && g.day > lastDay && g.queue.length === 0 && (g.scheduled ?? []).length > 0) deferredMornings++;
    noteMilestones();
  }
  noteMilestones();
  return {
    persona: persona.name, seed, days: g.day,
    terminal: status.over ? (status.flag ?? status.cause ?? "over") : "none(maxDays)",
    quietActions, threadActions, exposureByDay, milestoneDay, traceRecords,
    deferredMornings,
  };
}

// ---- the factor A/Bs (seed-matched, at the chokepoint) --------------------------------
// A prepared state whose recent resolutions lean hard one way, so proximity
// factors have signal to bite on; then N draws sampled OFF vs ON per seed.
function preparedState(db: ContentDB, seed: number): GameState {
  const g = newGame({ seed, name: "AB", age: 25, body: { height: 0.5, build: 0.5 }, townId: "region_one", tier: "outer" }, db);
  g.queue = [];   // no opening scene; pure draw sampling
  g.flags.lw_scene_done = true;   // mounts deck:undercurrent beside deck:street (pool of 4)
  // Lean the logs hard toward the flavored/coordinated in-deck cards, so the
  // proximity factors have full signal: lens_two (lw_street_lens's flavor) and
  // the undercurrent card's own corner (0.7, −0.5).
  for (let i = 1; i <= 8; i++) {
    g.resolveCount = i;
    (g.coordLog ??= []).push({ index: i, lensFlavor: "lens_two", diamondCoord: { sanction: 0.7, vertical: -0.5 } });
  }
  return g;
}

interface AbResult { factor: string; off: string; on: string; note: string }

function factorAbs(): AbResult[] {
  const N = 400;
  const seeds = [11, 12, 13];
  const out: AbResult[] = [];
  const dbOn = (patch: object): ContentDB => ({ ...loopDb, tuning: { ...loopDb.tuning, ...patch } });

  // helper: share of draws matching a predicate across seeds
  const share = (db: ContentDB, pred: (id: string) => boolean): number => {
    let hit = 0, total = 0;
    for (const seed of seeds) {
      const g = preparedState(db, seed);
      for (let i = 0; i < N; i++) {
        g.recentDraws = [];   // isolate from anti-repeat unless that's the factor
        const ev = drawFromMounted(g, db, 1);
        if (ev) { total++; if (pred(ev.id)) hit++; if (ev.once) delete g.flags[ev.once]; }
      }
    }
    return hit / Math.max(1, total);
  };

  // lens-bias: share of the matching-flavor winner (lw_street_lens, lens_two)
  const lensOff = share(loopDb, (id) => id === "lw_street_lens");
  const lensOn = share(dbOn({ lensBias: { enabled: true } }), (id) => id === "lw_street_lens");
  out.push({
    factor: "lensBias", off: pct(lensOff), on: pct(lensOn),
    note: `matching-flavor share at full affinity (${rel(lensOff, lensOn)} relative); contract target ≈ +10–20% relative across a run`,
  });

  // diamond proximity: share of the coordinated in-deck card (lw_undercurrent_1
  // at (0.7, −0.5) — the prepared centroid sits on it, distance ≈ 0)
  const diaOff = share(loopDb, (id) => id === "lw_undercurrent_1");
  const diaOn = share(dbOn({ diamondProximity: { enabled: true } }), (id) => id === "lw_undercurrent_1");
  out.push({ factor: "diamondProximity", off: pct(diaOff), on: pct(diaOn), note: `near-centroid card share at distance ≈ 0 (${rel(diaOff, diaOn)} relative)` });

  // anti-repeat: immediate-repeat rate across consecutive draws
  const repeatRate = (db: ContentDB): number => {
    let repeats = 0, total = 0;
    for (const seed of seeds) {
      const g = preparedState(db, seed);
      let prev = "";
      for (let i = 0; i < N; i++) {
        const ev = drawFromMounted(g, db, 1);
        if (!ev) continue;
        if (ev.once) delete g.flags[ev.once];
        total++; if (ev.id === prev) repeats++;
        prev = ev.id;
      }
    }
    return repeats / Math.max(1, total);
  };
  const arOff = repeatRate(loopDb);
  const arOn = repeatRate(dbOn({ antiRepeat: { enabled: true } }));
  out.push({ factor: "antiRepeat", off: pct(arOff), on: pct(arOn), note: "immediate-repeat rate (memory 5, factor 0.5)" });

  // band-noise: leak rate at a worn meter (5) — adjacent-only by construction
  const leakRate = (db: ContentDB): number => {
    const g = preparedState(db, 21);
    let leaks = 0;
    for (let i = 0; i < N; i++) { if (resolveBand(g, db, 5).resolvedBand !== "worn") leaks++; }
    return leaks / N;
  };
  const bnOff = leakRate(loopDb);
  const bnOn = leakRate(dbOn({ bandNoise: { enabled: true } }));
  out.push({ factor: "bandNoise", off: pct(bnOff), on: pct(bnOn), note: "adjacent-leak rate at a worn meter (p default 0.2)" });

  return out;
}

const pct = (x: number) => `${(100 * x).toFixed(1)}%`;
const rel = (off: number, on: number) => (off > 0 ? `${(100 * (on - off) / off).toFixed(0)}%` : "n/a");

// ---- run everything, print + write the report --------------------------------------------
const SEEDS = [101, 202, 303];
const runs: BotRun[] = [];
for (const p of PERSONAS) for (const s of SEEDS) runs.push(runBot(explorerDb, s, p));

// determinism spot-check: same seed + persona ⇒ identical run
const rA = runBot(explorerDb, 101, PERSONAS[0]);
const rB = runBot(explorerDb, 101, PERSONAS[0]);
const deterministic = JSON.stringify(rA) === JSON.stringify(rB);

const abs = factorAbs();

const md: string[] = [];
md.push(`# Bot measurement v1 — the pacing sweep + the factor A/Bs`);
md.push(`*Generated by \`npm run bots\` (src/bots/run.ts) · personas × seeds ${SEEDS.join("/")} · deterministic: ${deterministic ? "YES (seed-matched replay identical)" : "NO — BUG"}*\n`);
md.push(`## 1 · The pacing sweep (explorer pack, lastDay ${explorerDb.tuning?.calendar?.lastDay})\n`);
md.push(`| persona | seed | days | terminal | quiet:thread | stages (day) | trace recs |`);
md.push(`|---|---|---|---|---|---|---|`);
for (const r of runs) {
  const st = [1, 2, 3].map((n) => r.milestoneDay[`pressure${n}_seen`] ?? "—").join("/");
  md.push(`| ${r.persona} | ${r.seed} | ${r.days} | ${r.terminal} | ${r.quietActions}:${r.threadActions} | ${st} | ${r.traceRecords} |`);
}
md.push(`\n## 2 · Thread exhaustion — first day each milestone lands (— = never)\n`);
md.push(`| milestone | ${runs.map((r) => `${r.persona[0]}${r.seed}`).join(" | ")} |`);
md.push(`|---|${runs.map(() => "---").join("|")}|`);
for (const m of MILESTONES) {
  md.push(`| ${m} | ${runs.map((r) => r.milestoneDay[m] ?? "—").join(" | ")} |`);
}
md.push(`\n## 3 · Exposure trajectories (per day)\n`);
for (const r of runs) md.push(`- **${r.persona}/${r.seed}**: ${r.exposureByDay.join(" ")}`);
md.push(`\n## 4 · The factor A/Bs (seed-matched, loopworld, N=400×3 seeds)\n`);
md.push(`| factor | OFF | ON | note |`);
md.push(`|---|---|---|---|`);
for (const a of abs) md.push(`| ${a.factor} | ${a.off} | ${a.on} | ${a.note} |`);
md.push(`\n*Every switch ships OFF; the OFF column is the shipped behavior. The ON deltas are each factor's isolated drift, per the ratified guardrail.*`);

mkdirSync("reports", { recursive: true });
writeFileSync("reports/bot-measurement-v1.md", md.join("\n") + "\n");

console.log(md.join("\n"));
console.log(`\nbots — ${runs.length} runs, deterministic=${deterministic}, report: reports/bot-measurement-v1.md`);
if (!deterministic) process.exit(1);
