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
import { checkImports, isRendererFile } from "./import-boundary";

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
  for (const v of checkImports(file, text)) {
    scanViolations++;
    console.log(`  VIOLATION ${v.file}:${v.line} — imports "${v.specifier}": ${v.reason}`);
  }
}

console.log(`\nlint:imports — self-test ${selfFail ? `${selfFail} FAILED` : "passed"} · scanned ${rendererFiles} renderer file(s) · ${scanViolations} violation(s)`);
if (selfFail || scanViolations) process.exit(1);
