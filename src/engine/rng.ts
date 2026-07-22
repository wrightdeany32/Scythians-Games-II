// ============================================================================
// rng.ts — the ONE source of randomness (Pillar 8: determinism via seeding).
// State lives in GameState.rngState, so it advances during play AND survives
// save/load. Never call Math.random() elsewhere in the codebase.
// (mulberry32 — a small, well-tested PRNG.)
// ============================================================================

export interface RngState { rngState: number; }

export function seedToState(seed: number): number {
  return (seed >>> 0) || 1;
}

export function randFloat(g: RngState): number {
  let a = g.rngState | 0;
  a = (a + 0x6d2b79f5) | 0;
  g.rngState = a; // persist advanced state
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function randInt(g: RngState, min: number, max: number): number {
  return min + Math.floor(randFloat(g) * (max - min + 1));
}

export function d20(g: RngState): number {
  return randInt(g, 1, 20);
}

export function pick<T>(g: RngState, arr: T[]): T {
  return arr[randInt(g, 0, arr.length - 1)];
}

export function chance(g: RngState, p: number): boolean {
  return randFloat(g) < p;
}

// ---- isolated sub-streams (the Tier-1 rails) --------------------------------
// A named sub-stream keeps a roll-system's draws OFF the gameplay stream:
// adding a drip roll never perturbs a band or clash draw, so a frozen
// transcript survives however much stochastic content lands around it. Each
// stream is seeded deterministically from (run seed × name) and its state lives
// in GameState.subStreams[name] — persisted through serialize/deserialize,
// reconstructed by replay. Lazy: a run that draws no sub-stream carries no field
// and serializes byte-identically to a pre-rails run.
//
// The mulberry32 step is reused verbatim (via a throwaway RngState handle), so a
// sub-stream's distribution is identical to the gameplay stream's — only its
// seed, and therefore its sequence, differs.

// A holder that carries the run seed and the lazy sub-stream map. GameState
// satisfies it; so does any minimal test object.
export interface SubStreamHolder { seed: number; subStreams?: Record<string, number>; }

// Deterministic derivation of a stream's initial state from (seed, name) — an
// FNV-1a-style mix, never Math.random. Distinct names ⇒ distinct sequences;
// the same (seed, name) ⇒ the same sequence, every run.
export function subSeed(seed: number, name: string): number {
  let h = (seedToState(seed) ^ 0x9e3779b9) | 0;
  for (let i = 0; i < name.length; i++) {
    h = Math.imul(h ^ name.charCodeAt(i), 0x01000193) | 0;
  }
  return (h >>> 0) || 1;
}

function subFloatState(g: SubStreamHolder, name: string): number {
  (g.subStreams ??= {});
  if (g.subStreams[name] === undefined) g.subStreams[name] = subSeed(g.seed, name);
  const handle: RngState = { rngState: g.subStreams[name] };
  const r = randFloat(handle);
  g.subStreams[name] = handle.rngState;   // persist the advanced sub-stream state
  return r;
}

export function subFloat(g: SubStreamHolder, name: string): number {
  return subFloatState(g, name);
}
export function subInt(g: SubStreamHolder, name: string, min: number, max: number): number {
  return min + Math.floor(subFloat(g, name) * (max - min + 1));
}
export function subChance(g: SubStreamHolder, name: string, p: number): boolean {
  return subFloat(g, name) < p;
}
