// ============================================================================
// smoke/startdeck.playtest.ts — acceptance for the start-deck (engine/creation.ts).
// Proves Dean's shape end-to-end: a fixed intro/menu, then a start card is drawn
// that seats the scenario — and the engine guarantees that matter:
//   · the CreationRunner presents the intro and produces a dealt start;
//   · a start-deck newGame is a playable run (the scenario's cold-open mounts);
//   · the DEAL is deterministic, weighted, qualifier-filtered, fallback-total;
//   · the deal draws from a CREATION-SCOPED stream — gameplay RNG is UNTOUCHED
//     (a dealt run and a legacy run on the same seed share rngState);
//   · BACKFILL: no startId → the legacy openingQueue path, unchanged.
// Run: npm run startdeck
// ============================================================================

import { explorerDb } from "../content/explorer";
import { newGame } from "../engine/engine";
import { CreationRunner, dealStart, resolveCreation } from "../engine/creation";
import { seedToState } from "../engine/rng";
import { startQueuedScene, runStatus } from "../engine/loop";
import { SceneRunner } from "../engine/scene";
import type { ContentDB, StartDef } from "../engine/types";

const results: [string, boolean, string][] = [];
const check = (name: string, ok: boolean, detail = "") => results.push([name, ok, detail]);
const base = { name: "You", age: 25, body: { height: 0.5, build: 0.5 } };

// Drive a CreationRunner picking a fixed option each question (0 = the intro's "Begin.").
function driveCreation(seed: number): { startId: string; answers: number[]; townId: string; tier: string; screens: string[] } {
  const screens: string[] = [];
  const r = new CreationRunner(explorerDb, { seed }, { onScreen: (s) => screens.push(s.card) });
  let guard = 0;
  while (!r.done && guard++ < 50) { if (!r.pick(0).ok) break; }
  const res = r.result!;
  return { ...res, screens };
}

// ---- 1 · the CreationRunner: intro → deal → the flagship start ----
const c1 = driveCreation(70499);
check("1 · creation presents the intro then deals a start",
  c1.screens.includes("__creation_common__") && c1.screens.includes("__creation_done__") && c1.startId === "start_explorer_reunion",
  `screens=${c1.screens.join(">")} · start=${c1.startId}`);

// ---- 2 · a start-deck newGame is a playable run, gameplay RNG untouched ----
const dealt = newGame({ ...base, seed: 70499, tier: "outer", townId: "town_edge", startId: c1.startId, answers: c1.answers }, explorerDb);
const legacy = newGame({ ...base, seed: 70499, tier: "outer", townId: "town_edge" }, explorerDb);
check("2 · dealt run mounts the scenario cold-open and is live",
  dealt.queue.includes("ux_explorer_opening") && !runStatus(dealt, explorerDb).over && dealt.townId === "town_edge",
  `queue=[${dealt.queue.join(",")}]`);
check("3 · the deal used a CREATION-SCOPED stream — gameplay rngState is identical to a legacy run",
  dealt.rngState === legacy.rngState && dealt.rngState === seedToState(70499),
  `dealt=${dealt.rngState} legacy=${legacy.rngState}`);

// Drive the reunion opening to prove the dealt run actually plays.
let openingPlayed = false;
const r2 = startQueuedScene(dealt, explorerDb);
if (r2) { let g = 0; while (!r2.done && g++ < 20) { const o = r2.current.options.find((x) => x.available); if (!o) break; r2.pick(o.index); } openingPlayed = dealt.flags.arrived_town === true; }
check("4 · the dealt run plays: the reunion opening resolves and seats the player", openingPlayed);

// ---- 5 · determinism: same seed ⇒ same deal, byte-identical ----
const c1b = driveCreation(70499);
check("5 · same seed ⇒ same start + answers (deterministic)",
  c1b.startId === c1.startId && JSON.stringify(c1b.answers) === JSON.stringify(c1.answers));

// ---- 6–8 · the deal semantics on a synthetic multi-scenario register ----
const SYNTH: StartDef[] = [
  { id: "reunion", townId: "t", tier: "outer", openingQueue: [], weight: 3 },   // unqualified, heavy
  { id: "doctor",  townId: "t", tier: "outer", openingQueue: [], weight: 1 },   // unqualified, light
  { id: "veteran", townId: "t", tier: "outer", openingQueue: [], qualifiers: { kind: "flag", flag: "served" } },
];
const synthDb = { starts: SYNTH } as ContentDB;
const sweep = (profile: Record<string, boolean>) =>
  new Set(Array.from({ length: 60 }, (_, i) => dealStart(synthDb, 1000 + i, profile).id));

const emptyProfile = sweep({});
check("6 · deal filters by qualifier: with no profile, the qualified start never deals; the fallbacks do",
  !emptyProfile.has("veteran") && emptyProfile.has("reunion") && emptyProfile.has("doctor"),
  `dealt=${[...emptyProfile].join("/")}`);

const servedProfile = sweep({ served: true });
check("7 · deal opens the qualified start when the profile qualifies it",
  servedProfile.has("veteran"), `dealt=${[...servedProfile].join("/")}`);

check("8 · deal is deterministic (same seed + profile ⇒ same start)",
  dealStart(synthDb, 4242, {}).id === dealStart(synthDb, 4242, {}).id);

// Fallback totality: a register whose only qualified starts all fail still deals
// the unqualified fallback (never an empty set).
const onlyFallback = new Set(Array.from({ length: 20 }, (_, i) => dealStart({ starts: [SYNTH[2], SYNTH[0]] } as ContentDB, 7000 + i, {}).id));
check("9 · fallback totality: a non-matching profile still deals the unqualified start",
  onlyFallback.size === 1 && onlyFallback.has("reunion"));

// ---- 10 · BACKFILL: no startId ⇒ the legacy path, unchanged ----
check("10 · backfill: a start-deck-bearing db still runs the legacy path when no startId is passed",
  legacy.queue.length === 1 && legacy.queue[0] === "ux_explorer_opening" && legacy.tier === "outer",
  `legacy queue=[${legacy.queue.join(",")}]`);

// ---- report ----------------------------------------------------------------
console.log(`\n=== Start-deck acceptance ===\n`);
let allOk = true;
for (const [name, ok, detail] of results) { if (!ok) allOk = false; console.log(`  ${ok ? "OK  " : "FAIL"} ${name}${detail ? `  (${detail})` : ""}`); }
console.log(`\n${allOk ? "ALL CRITERIA PASS" : "SOME CRITERIA FAILED"}\n`);
if (!allOk) process.exit(1);
