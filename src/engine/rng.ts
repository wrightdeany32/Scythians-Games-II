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
