// ============================================================================
// tools/import-boundary.ts — the WO-4 wall's enforcement half. A renderer (any
// player-facing view: the graphics engine, a UI) may talk to the engine through
// ONE door — engine/surface.ts — and no other. This linter reads a file's
// imports and fails if a renderer-scoped file reaches past the surface into an
// engine internal (centroid.ts above all, but any engine module), which is how
// the trajectory (the diamond/lens centroids, `attune`, the exposure meter)
// would leak to a "who you're becoming" surface.
//
// Pure and zero-dep: it string-scans import specifiers (no TS compiler API), so
// it runs anywhere `tsx` does. `checkImports` is the testable core; the runner
// (import-boundary.run.ts) self-tests it, then scans the tree.
//
// SCOPE: only RENDERER files are constrained. A file is renderer-scoped if it
// lives under src/render/ OR carries an `@renderer` / `@surface-only` header
// directive (so a render helper placed elsewhere is still covered). Everything
// else — the engine, content, tools, the cold-read harness — imports freely.
// ============================================================================

export interface ImportViolation {
  file: string;
  specifier: string;
  line: number;
  reason: string;
}

// The one engine module a renderer may import at runtime.
const SURFACE_RE = /(^|\/)engine\/surface(\.js|\.ts)?$/;
// Any engine module (the wall is: only `surface` of these is allowed).
const ENGINE_RE = /(^|\/)engine\//;
// Belt-and-suspenders: the trajectory readers AND the trace/telemetry channel
// must never appear in a renderer import, even if a future reshuffle moved them
// out of engine/. The recorder carries the trace (the derived-never-shown
// stream — landed tiers, origins, sub-stream draws); a renderer reaching it is
// the "log the cause, never the effect" fence breaking at the import.
const ALWAYS_FORBIDDEN = /centroid|coordLog|recorder|telemetry/i;

// A DIRECTIVE line only — `// @renderer` / `// @surface-only` as its own comment,
// not prose that merely mentions the word (this file, and the docs, talk about
// the directive without being renderer-scoped). Anchored so "…carries an
// `@renderer` header" never trips it.
const DIRECTIVE_RE = /^[ \t]*\/\/[ \t]*@(?:renderer|surface-only)\b/m;

export function isRendererFile(filePath: string, fileText: string): boolean {
  const p = filePath.replace(/\\/g, "/");
  if (/(^|\/)src\/render\//.test(p)) return true;
  const head = fileText.split("\n").slice(0, 40).join("\n");
  return DIRECTIVE_RE.test(head);
}

// Every import/export-from specifier in a file, with its line and whether it's
// type-only (a type import carries no runtime access to a value, so it can't
// leak the number — `import type { DiamondCoord }` is harmless).
export function extractImports(fileText: string): { specifier: string; line: number; typeOnly: boolean }[] {
  const out: { specifier: string; line: number; typeOnly: boolean }[] = [];
  const fromRe = /^\s*(?:import|export)\b([^'"]*?)\bfrom\s*['"]([^'"]+)['"]/;
  const sideEffectRe = /^\s*import\s*['"]([^'"]+)['"]/;
  fileText.split("\n").forEach((ln, i) => {
    const m = fromRe.exec(ln);
    if (m) { out.push({ specifier: m[2], line: i + 1, typeOnly: /^\s*type\b/.test(m[1]) }); return; }
    const s = sideEffectRe.exec(ln);
    if (s) out.push({ specifier: s[1], line: i + 1, typeOnly: false });
  });
  return out;
}

// The rule, applied only to renderer-scoped files:
//   · a `centroid`/`coordLog` specifier is a violation, always;
//   · a type-only import is fine (no runtime read);
//   · engine/surface is the one legal engine door;
//   · any other engine/* runtime import is a violation;
//   · non-engine imports (react, ./local, etc.) are unconstrained.
export function checkImports(filePath: string, fileText: string): ImportViolation[] {
  if (!isRendererFile(filePath, fileText)) return [];
  const violations: ImportViolation[] = [];
  for (const imp of extractImports(fileText)) {
    const spec = imp.specifier;
    if (ALWAYS_FORBIDDEN.test(spec)) {
      violations.push({ file: filePath, specifier: spec, line: imp.line, reason: "renderer imports the trajectory or the trace channel (centroid/coordLog/recorder) — the exact leak the wall exists to stop" });
      continue;
    }
    if (imp.typeOnly) continue;
    if (SURFACE_RE.test(spec)) continue;
    if (ENGINE_RE.test(spec)) {
      violations.push({ file: filePath, specifier: spec, line: imp.line, reason: "renderer imports an engine internal — a renderer may import engine/surface only" });
    }
  }
  return violations;
}

// ---- the telemetry fence at the render boundary -----------------------------
// The WO-4 wall (above) constrains RENDERER files. But the render surface
// itself (engine/surface.ts) is the one door renderers walk through — so if a
// telemetry/trajectory field ever appeared IN the surface projection, every
// renderer would legally receive it and the "log the cause, never the effect"
// fence would break on the far side of the wall. As telemetry grows (the RNG
// sub-streams, the landed-tier stamps, the unbidden counter — all derived,
// never-shown), this makes that fence mechanical: the surface module may never
// reference a telemetry/trajectory field. A source-scan (field reads, not just
// imports), because the leak here is reading `g.rngState`, not importing a type.
const SURFACE_FILE_RE = /(^|\/)engine\/surface\.ts$/;
// The derived/telemetry/trajectory state the render surface must never carry.
const TELEMETRY_IDENT = /\b(rngState|subStreams|recentDraws|coordLog|resolveCount|lastMorningUnbidden|dispositionCentroid|lensCentroid)\b/;
const COMMENT_LINE = /^\s*(\/\/|\*|\/\*)/;   // header prose NAMES what it omits — that's documentation, not a leak

export function isSurfaceFile(filePath: string): boolean {
  return SURFACE_FILE_RE.test(filePath.replace(/\\/g, "/"));
}

export function checkSurfaceTelemetry(filePath: string, fileText: string): ImportViolation[] {
  if (!isSurfaceFile(filePath)) return [];
  const out: ImportViolation[] = [];
  fileText.split("\n").forEach((ln, i) => {
    if (COMMENT_LINE.test(ln)) return;
    const m = TELEMETRY_IDENT.exec(ln);
    if (m) out.push({ file: filePath, specifier: m[1], line: i + 1, reason: "the render surface references a telemetry/trajectory field — it must project player-legal state only (log the cause, never the effect)" });
  });
  return out;
}
