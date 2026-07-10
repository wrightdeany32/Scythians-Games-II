// @renderer
// ============================================================================
// render/surface-consumer.example.ts — EXAMPLE / REFERENCE (not wired into the
// game). The legal pattern for a renderer talking to the engine: import ONLY
// engine/surface at runtime (plus type-only from engine/types), turn the
// `Surface` into something a player sees, and never reach for anything else.
//
// This file exists to (a) document the pattern the graphics engine will follow
// and (b) give `npm run lint:imports` a real renderer file to PASS — proving the
// wall doesn't false-positive on legal code. Note what it CAN'T do: there is no
// import that would let it read the trajectory or the exposure meter, because
// `Surface` doesn't carry them and `engine/surface` is the only door open.
// ============================================================================

import type { GameState, ContentDB } from "../engine/types";
import { renderSurface } from "../engine/surface";
import type { Surface } from "../engine/surface";

// A trivial text "town screen" built entirely from the Surface. Grip shows as
// its band ("feeling grounded"), never a number; exposure and the trajectory
// simply aren't available to show.
export function renderTownScreenExample(g: GameState, db: ContentDB): string {
  const s: Surface = renderSurface(g, db);
  const lines: string[] = [s.date.label];
  lines.push(`money ${s.have.money} · energy ${s.have.energy}/${s.have.energyMax} · feeling ${s.grip}`);
  if (s.circle.length) lines.push("with you: " + s.circle.map((f) => f.name).join(", "));
  if (s.have.items.length) lines.push("carrying: " + s.have.items.map((i) => i.label).join(", "));
  for (const k of s.known) lines.push(`· ${k}`);
  return lines.join("\n");
}
