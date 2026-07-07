// ============================================================================
// engine/centroid.ts — the emergent-position keystone (WO-1c).
//
// THE RULE, so it can't be misbuilt in either direction: store the EVENTS,
// derive the POSITION. The per-run save holds a thin resolved-coordinate log
// (GameState.coordLog); everything here is a pure, deterministic derivation
// over it — O(resolved cards), computed on demand, never written back
// (invariant #3, no-stored-disposition).
//
// ONE centroid primitive (weightedCentroid) serves all three consumers:
//   · dispositionCentroid — the diamond space, (Y, Z) ONLY. X is grip, and
//     grip never enters any draw computation (Azimuth clarification 1: the
//     spiral cannot be baked, because grip cannot reach the Weight step).
//   · lensCentroid — the lens space, as a recency-weighted AFFINITY
//     DISTRIBUTION over one-hot vectors (Azimuth clarification 2: tags don't
//     average; one-hot vectors do). Continuous, never a categorical match.
//   · deckCentroid — Slate's recursive rollup: a deck's coordinate is the
//     plain centroid of its members' coordinates, one rule at every level of
//     the nesting (cards ∈ fixture-decks ∈ sector-clusters ∈ volume).
//
// Recency kernel: exponential decay over the resolution clock — an entry's
// age is (resolveCount - entry.index), measured in CARD-RESOLUTIONS (not
// days; RNG-independent), so neutral resolutions push old coordinates into
// the past at the pace the player actually plays. One knob:
// tuning.disposition.window. Loom's fate-dial (window lengthens with depth:
// shallow = free will, deep = fated) is a post-tune refinement that rides
// this knob — do not build it yet.
// ============================================================================

import type { ContentDB, DiamondCoord, GameState } from "./types";

// PLACEHOLDER default, to be tuned once the loop runs real content: ~a full
// day's resolutions still carry real weight, a week ago barely registers.
export const DISPOSITION_WINDOW_DEFAULT = 12;

export function dispositionTuning(db: ContentDB): { window: number } {
  return { window: db.tuning?.disposition?.window ?? DISPOSITION_WINDOW_DEFAULT };
}

// e^(-age/window): weight 1 at age 0, ~0.37 at one window, ~0.05 at three.
export function recencyWeight(age: number, window: number): number {
  return Math.exp(-age / window);
}

// ---- THE primitive -------------------------------------------------------------
// Weighted mean of coordinate vectors. Returns undefined for an empty (or
// zero-weight) set — callers decide their own neutral origin. This is the one
// function both spaces and the deck rollup reuse (a ratified seam: refactor
// freely, preserve the contract).
export function weightedCentroid(points: { w: number; v: number[] }[]): number[] | undefined {
  let total = 0;
  let acc: number[] | undefined;
  for (const p of points) {
    if (p.w <= 0) continue;
    acc ??= new Array<number>(p.v.length).fill(0);
    for (let i = 0; i < p.v.length; i++) acc[i] += p.w * p.v[i];
    total += p.w;
  }
  if (!acc || total <= 0) return undefined;
  return acc.map((x) => x / total);
}

// ---- the diamond space ----------------------------------------------------------
// The player's derived (Y, Z) position: recency-weighted centroid of the log's
// diamondCoords. Neutral origin (0, 0) before any coordinated card resolves —
// creation (turn-zero) seeds index-0 entries, so a created character starts
// where their creation choices put them.
export function dispositionCentroid(g: GameState, db: ContentDB): DiamondCoord {
  const window = dispositionTuning(db).window;
  const now = g.resolveCount ?? 0;
  const c = weightedCentroid(
    (g.coordLog ?? [])
      .filter((e) => e.diamondCoord)
      .map((e) => ({ w: recencyWeight(now - e.index, window), v: [e.diamondCoord!.sanction, e.diamondCoord!.vertical] })),
  );
  return c ? { sanction: c[0], vertical: c[1] } : { sanction: 0, vertical: 0 };
}

// ---- the lens space ---------------------------------------------------------------
// The player's interpretive affinity: each lens-carrying resolution is a one-hot
// vector over the (content-owned, closed) vocabulary; the centroid of those is a
// distribution — affinity mass per flavor, summing to 1. Empty object before any
// lens-carrying card resolves (⇒ every proximity_lens factor is a flat 1.0).
// The engine never hardcodes the vocabulary: the distribution ranges over
// whatever flavors the log actually contains.
export function lensCentroid(g: GameState, db: ContentDB): Record<string, number> {
  const window = dispositionTuning(db).window;
  const now = g.resolveCount ?? 0;
  const entries = (g.coordLog ?? []).filter((e) => e.lensFlavor);
  if (!entries.length) return {};
  const flavors = [...new Set(entries.map((e) => e.lensFlavor!))];
  const c = weightedCentroid(
    entries.map((e) => ({
      w: recencyWeight(now - e.index, window),
      v: flavors.map((f) => (f === e.lensFlavor ? 1 : 0)),   // the one-hot vector
    })),
  );
  const out: Record<string, number> = {};
  if (c) for (let i = 0; i < flavors.length; i++) out[flavors[i]] = c[i];
  return out;
}

// ---- the deck tree ---------------------------------------------------------------
// Slate's rollup: a deck's diamond coordinate is the plain (unweighted) centroid
// of its members' coordinates — and because it's the same primitive, the rule
// nests: a cluster's coordinate is the centroid of its decks', and so on up.
export function deckCentroid(coords: DiamondCoord[]): DiamondCoord | undefined {
  const c = weightedCentroid(coords.map((d) => ({ w: 1, v: [d.sanction, d.vertical] })));
  return c ? { sanction: c[0], vertical: c[1] } : undefined;
}
