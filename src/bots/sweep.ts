// ============================================================================
// bots/sweep.ts — the dose-response sweep (npm run bots:sweep): the retune's
// missing number. The factor A/Bs (run.ts) measure each Weight-step switch at
// its SHIPPED default; the retune question is what strength to ship, and
// diamondProximity's default has never had a ruled contract window the way
// lensBias's +10–20% did. This sweep measures the near-centroid drift across a
// strength ladder for BOTH proximity factors, so Azimuth can pick the dose by
// window instead of inheriting a constant.
//
// Same discipline as run.ts's factor A/Bs (seed-matched, chokepoint-sampled,
// loopworld): the prepared state leans the logs hard onto the probe cards so
// the factors have full signal — these are CEILING doses (distance ≈ 0 / full
// affinity), so a shipped strength's real-world drift sits at-or-under its row.
// ============================================================================

import { loopDb } from "../smoke/loopworld";
import { newGame, drawFromMounted } from "../engine/engine";
import type { ContentDB, GameState } from "../engine/types";

const N = 400;
const SEEDS = [11, 12, 13];

// The prepared state, verbatim from run.ts's A/B section: undercurrent deck
// mounted (pool of 4), logs leaned onto lens_two + (0.7, −0.5).
function preparedState(db: ContentDB, seed: number): GameState {
  const g = newGame({ seed, name: "AB", age: 25, body: { height: 0.5, build: 0.5 }, townId: "region_one", tier: "outer" }, db);
  g.queue = [];
  g.flags.lw_scene_done = true;
  for (let i = 1; i <= 8; i++) {
    g.resolveCount = i;
    (g.coordLog ??= []).push({ index: i, lensFlavor: "lens_two", diamondCoord: { sanction: 0.7, vertical: -0.5 } });
  }
  return g;
}

function share(db: ContentDB, pred: (id: string) => boolean): number {
  let hit = 0, total = 0;
  for (const seed of SEEDS) {
    const g = preparedState(db, seed);
    for (let i = 0; i < N; i++) {
      g.recentDraws = [];
      const ev = drawFromMounted(g, db, 1);
      if (ev) { total++; if (pred(ev.id)) hit++; if (ev.once) delete g.flags[ev.once]; }
    }
  }
  return hit / Math.max(1, total);
}

const withTuning = (patch: object): ContentDB => ({ ...loopDb, tuning: { ...loopDb.tuning, ...patch } });
const pct = (x: number) => `${(100 * x).toFixed(1)}%`;
const rel = (off: number, on: number) => (off > 0 ? `${(100 * (on - off) / off).toFixed(0)}%` : "n/a");

const STRENGTHS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1.0];

console.log("\n=== Dose-response sweep — proximity factors at the chokepoint ===");
console.log(`(${SEEDS.length} seeds × ${N} draws per row · ceiling doses: distance ≈ 0 / full affinity)\n`);

// diamondProximity: near-centroid card share vs strength (range at default 1.5)
const diaBase = share(loopDb, (id) => id === "lw_undercurrent_1");
console.log(`diamondProximity — near-centroid share (lw_undercurrent_1) · OFF baseline ${pct(diaBase)}`);
for (const s of STRENGTHS) {
  const on = share(withTuning({ diamondProximity: { enabled: true, strength: s } }), (id) => id === "lw_undercurrent_1");
  const marker = s === 0.5 ? "   <-- shipped default" : "";
  console.log(`  strength ${s.toFixed(2)} -> ${pct(on)}  (${rel(diaBase, on)} relative)${marker}`);
}

// lensBias: matching-flavor share vs strength (context for the same retune call)
const lensBase = share(loopDb, (id) => id === "lw_street_lens");
console.log(`\nlensBias — matching-flavor share (lw_street_lens) · OFF baseline ${pct(lensBase)} · contract window +10–20% relative`);
for (const s of STRENGTHS) {
  const on = share(withTuning({ lensBias: { enabled: true, strength: s } }), (id) => id === "lw_street_lens");
  const marker = s === 0.3 ? "   <-- shipped default" : "";
  console.log(`  strength ${s.toFixed(2)} -> ${pct(on)}  (${rel(lensBase, on)} relative)${marker}`);
}

console.log("\n(Deterministic by construction: seeded draws only, fixed seeds — rerun reproduces byte-identically.)\n");
