// ============================================================================
// tools/import-boundary.run.ts — runs the WO-4 wall check. Two steps, both must
// pass or it exits 1:
//   1 · SELF-TEST — synthetic renderer/non-renderer files through checkImports,
//       asserting the wall fires on a leak and stays quiet on legal code. This
//       proves the checker works without planting a forbidden import in the tree.
//   2 · SCAN — walk src/ for renderer-scoped files (src/render/** or any file
//       carrying an @renderer directive) and report any real violation.
// Run: npm run lint:imports
// ============================================================================

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { checkImports, isRendererFile, checkSurfaceTelemetry } from "./import-boundary";

// ---- 1 · self-test ---------------------------------------------------------
interface Case { name: string; file: string; text: string; expectViolations: number }
const CASES: Case[] = [
  { name: "renderer importing centroid → blocked", file: "src/render/bad.ts",
    text: `import { dispositionCentroid } from "../engine/centroid";`, expectViolations: 1 },
  { name: "renderer importing an engine internal → blocked", file: "src/render/bad2.ts",
    text: `import { bandOf } from "../engine/engine";`, expectViolations: 1 },
  { name: "renderer importing the surface → allowed", file: "src/render/ok.ts",
    text: `import { renderSurface } from "../engine/surface";`, expectViolations: 0 },
  { name: "renderer type-only import from types → allowed", file: "src/render/ok2.ts",
    text: `import type { DiamondCoord } from "../engine/types";`, expectViolations: 0 },
  { name: "renderer importing a non-engine module → allowed", file: "src/render/ok3.ts",
    text: `import { html } from "./view-helpers";`, expectViolations: 0 },
  { name: "NON-renderer importing centroid → unconstrained", file: "src/engine/engine.ts",
    text: `import { dispositionCentroid } from "./centroid";`, expectViolations: 0 },
  { name: "@renderer-tagged file outside src/render → constrained", file: "src/ui/panel.ts",
    text: `// @renderer\nimport { lensCentroid } from "../engine/centroid";`, expectViolations: 1 },
];

let selfFail = 0;
for (const c of CASES) {
  const got = checkImports(c.file, c.text).length;
  const ok = got === c.expectViolations;
  if (!ok) selfFail++;
  console.log(`  ${ok ? "OK  " : "FAIL"} self-test: ${c.name}${ok ? "" : ` (expected ${c.expectViolations}, got ${got})`}`);
}

// The telemetry fence self-test: the surface module may never read a
// telemetry/trajectory field (the fence that keeps "log the cause, never the
// effect" true on the render side as the trace grows).
interface SCase { name: string; file: string; text: string; expect: number }
const SURFACE_CASES: SCase[] = [
  { name: "surface reading rngState → blocked", file: "src/engine/surface.ts",
    text: `const s = { entropy: g.rngState };`, expect: 1 },
  { name: "surface reading a sub-stream → blocked", file: "src/engine/surface.ts",
    text: `if (g.subStreams?.drip) show();`, expect: 1 },
  { name: "surface deriving the centroid → blocked", file: "src/engine/surface.ts",
    text: `const c = dispositionCentroid(g, db);`, expect: 1 },
  { name: "surface exposing the clue tier → blocked", file: "src/engine/surface.ts",
    text: `return { ...s, tier: res.clue.tierLanded };`, expect: 1 },
  { name: "surface header prose naming what it omits → allowed", file: "src/engine/surface.ts",
    text: `// deliberately OMITS the trajectory (coordLog, the centroids, rngState)`, expect: 0 },
  { name: "surface projecting player-legal state → allowed", file: "src/engine/surface.ts",
    text: `const grip = bandOf(g.player.stats.grip);`, expect: 0 },
  { name: "a non-surface file reading rngState → unconstrained", file: "src/engine/loop.ts",
    text: `const r = g.rngState;`, expect: 0 },
];
for (const c of SURFACE_CASES) {
  const got = checkSurfaceTelemetry(c.file, c.text).length;
  const ok = got === c.expect;
  if (!ok) selfFail++;
  console.log(`  ${ok ? "OK  " : "FAIL"} self-test: ${c.name}${ok ? "" : ` (expected ${c.expect}, got ${got})`}`);
}

// ---- 2 · scan the tree -----------------------------------------------------
function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) { if (entry.name !== "node_modules") out.push(...walk(full)); }
    else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

let scanViolations = 0;
let rendererFiles = 0;
for (const file of walk("src")) {
  const text = readFileSync(file, "utf8");
  if (isRendererFile(file, text)) rendererFiles++;
  for (const v of [...checkImports(file, text), ...checkSurfaceTelemetry(file, text)]) {
    scanViolations++;
    console.log(`  VIOLATION ${v.file}:${v.line} — "${v.specifier}": ${v.reason}`);
  }
}

console.log(`\nlint:imports — self-test ${selfFail ? `${selfFail} FAILED` : "passed"} · scanned ${rendererFiles} renderer file(s) + the surface telemetry fence · ${scanViolations} violation(s)`);
if (selfFail || scanViolations) process.exit(1);
