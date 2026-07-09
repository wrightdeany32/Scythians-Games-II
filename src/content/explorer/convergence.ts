// ============================================================================
// content/explorer/convergence.ts — the Same Question, Twice (Loom's story
// pass, wired): the cross-thread percept. Marie asked whether anyone had gone
// missing or changed; Nora spent weeks mapping the same thing; they've never
// met, and only the player has heard both.
//
// Wired as a met-door (my call, per Loom's "whichever mechanism is cleaner"):
// the door's day-boundary check IS "the engine surfaces it in the ordinary
// flow the first time both gate flags are set" — the same firing shape as the
// pressure stages, minus the threshold, with no insert bookkeeping at either
// thread's beats.
//
// Coordinate-silent and lens-silent — DELIBERATELY. No diamondCoord, no
// attune, no lensFlavor: this is a noticing, not a stance or a frame. The
// anti-noun held: two people point at one shape; the game never says there's
// a shape. The deflation (you finish your coffee) is load-bearing.
// ============================================================================

import type { Door, GameEvent } from "../../engine/types";

export const convergenceDoors: Door[] = [
  {
    eventId: "ux_convergence_pattern",
    when: { kind: "all", of: [{ kind: "flag", flag: "pattern_open" }, { kind: "flag", flag: "nora_daytrip_done" }] },
  },
];

export const convergenceEvents: Record<string, GameEvent> = {
  ux_convergence_pattern: {
    id: "ux_convergence_pattern",
    once: "convergence_seen",
    title: "The Same Question, Twice",
    body:
`Somewhere in the ordinary middle of a day it lands on you: Marie asked whether anyone had gone missing out here, whether anyone had *changed* — and Nora spent weeks mapping the same thing, disappearances laid against dates, and the two of them have never met, never spoken, wouldn't know each other on the street. One calls it a bad place. One calls it a cover-up. They're pointing at the same shape from opposite sides of it, and neither of them knows the other is pointing. You know. You're the only one who's heard both.

You don't know what to do with that, so you finish your coffee.`,
    choices: [
      {
        label: `Finish your coffee.`,
        outcome: {},
      },
    ],
  },
};
