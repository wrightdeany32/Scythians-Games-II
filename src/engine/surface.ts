// ============================================================================
// engine/surface.ts — THE RENDER SURFACE (WO-4: the import-allowlist wall, made
// code). This is the ONE module a renderer (the graphics engine, a UI, any
// player-facing view) may import from the engine. It hands back a `Surface` —
// a plain, pre-filtered snapshot of everything a player is allowed to see —
// and nothing else. The renderer receives a `Surface`, never a `GameState`, so
// the forbidden numbers are not merely un-read, they are UNREACHABLE.
//
// THE WALL, in two layers:
//   1 · The `Surface` TYPE is the allowlist. It carries what-you-have,
//       what-you-know, who's-in-your-life, where-you-are, and the calendar —
//       and it deliberately OMITS the trajectory (the diamond/lens centroids,
//       `attune`), the exposure meter, grip-as-a-number, NPC ability/loyalty,
//       faction ratings, and the queue/schedule. A renderer given a `Surface`
//       cannot render "who you're becoming" because the number is not on it.
//   2 · The import-boundary linter (src/tools/import-boundary.ts, npm run
//       lint:imports) fails the build if a renderer-tagged file imports any
//       engine module OTHER than this one — so a renderer cannot go around the
//       Surface to `centroid.ts` and read the trajectory directly.
//
// WHY THESE FIELDS AND NOT OTHERS (the five presentation guards, as a type):
//   · what-you-HAVE, never what-you're-BECOMING  (Slate's "you" guard) — money,
//     energy, items are here; the centroid/lens/attune are not, and there is no
//     accessor on this module that would return them.
//   · grip renders as its BAND, never its number  — `grip: GripBand`, never a 0..10.
//   · exposure is ABSENT entirely — it is the liability meter the ambience guard
//     forbids from driving the skyline; the renderer cannot read it to try.
//   · the circle is FACES, not dossiers — {id, name} only; NPC ability/loyalty
//     never cross.
//   · what-you-KNOW is percepts only — journalLines (already no-catalog by shape).
// ============================================================================

import type { ContentDB, GameState, GripBand, Tier } from "./types";
import type { GameDate } from "./calendar";
import { dateOf } from "./calendar";
import { bandOf } from "./engine";
import { journalLines } from "./journal";

// A person in your life — a face and a name, never a stat line (the character-
// cards guard). An accruing adjective can join here later; ability/loyalty never.
export interface SurfaceFixture {
  id: string;
  name: string;
}

// Everything a player-facing view is allowed to see, and nothing else. Adding a
// field here is a deliberate widening of the wall — review it as such.
export interface Surface {
  date: GameDate;                       // the calendar (diegetic; the ambience reads THIS, never state)
  place: { tier: Tier; townId: string };// where you are
  have: {                               // what you HAVE (never what you're becoming)
    money: number;
    energy: number;
    energyMax: number;
    items: { id: string; label: string }[];
  };
  grip: GripBand;                       // grip as its BAND — never the number
  circle: SurfaceFixture[];             // who's in your life — faces, not dossiers
  known: string[];                      // what you know — percepts only (journalLines)
}

// Derive the render surface from live state, on read. Pure: it reads the legal
// fields and returns a fresh snapshot; it never writes state, and — the point
// of the wall — it never touches centroid.ts, the coordLog, `attune`, or the
// exposure meter. There is deliberately NO function here that returns the
// trajectory; a renderer cannot ask this module for it.
export function renderSurface(g: GameState, db: ContentDB): Surface {
  const items = g.player.items.map((id) => ({ id, label: db.items[id]?.label ?? id }));
  // The circle = the people in your life, by name only. Reads the assigned
  // circle first, falling back to any authored fixtures the run has met.
  const circleIds = g.player.circle.length
    ? g.player.circle
    : Object.values(g.npcs).filter((n) => n.isFixture).map((n) => n.id);
  const circle: SurfaceFixture[] = circleIds
    .map((id) => g.npcs[id])
    .filter((n): n is NonNullable<typeof n> => !!n)
    .map((n) => ({ id: n.id, name: n.name }));
  return {
    date: dateOf(g.day),
    place: { tier: g.tier, townId: g.townId },
    have: {
      money: g.player.stats.money,
      energy: g.player.stats.energy,
      energyMax: g.player.stats.energyMax,
      items,
    },
    grip: bandOf(g.player.stats.grip),   // BAND, not number
    circle,
    known: journalLines(g, db),
  };
}
