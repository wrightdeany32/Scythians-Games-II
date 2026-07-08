# Story Pass — Convergence: The Same Question, Twice
### a cross-thread percept · the tendril anatomy operating between threads · prose-first, for Armature/Plumb to wire
*From: Loom (Explorer corner) · carried by Dean · 2026-07-08 · Courier's & Azimuth's pickup, drafted in the round response and now wired*

**What this is.** A single quiet loop beat that fires **once**, when a player has done *both* the Marie thread and the Nora day-trip — the two threads that ask the same question (has anyone gone missing out here; has anyone *changed*) in two registers that never touch: Marie's folk dread and Nora's institutional mapping. Neither thread references the other by design. This beat lets the *player* notice the convergence the game itself never confirms — the reciprocity made a percept, held to the anti-noun: they point at one shape from two sides, and the game never says there's a shape.

**Where it sits.** A consequence-style loop beat, not a scheduled door and not a player action: the engine surfaces it in the ordinary flow the first time both gate flags are set, the way an ordinary day sometimes hands you a realization you didn't ask for. It lands, and returns to the loop. It's the between-threads cousin of the pressure beat's firing logic — gated on two thread flags instead of an `exposure` threshold.

---

## `ux_convergence_pattern` — the same question, twice

**Fires once** when `pattern_open` (Marie) **and** `nora_daytrip_done` (Nora) are both set, and `convergence_seen` is not. Sets `convergence_seen`. Surfaces in the loop, not scheduled.

Somewhere in the ordinary middle of a day it lands on you: Marie asked whether anyone had gone missing out here, whether anyone had *changed* — and Nora spent weeks mapping the same thing, disappearances laid against dates, and the two of them have never met, never spoken, wouldn't know each other on the street. One calls it a bad place. One calls it a cover-up. They're pointing at the same shape from opposite sides of it, and neither of them knows the other is pointing. You know. You're the only one who's heard both. You don't know what to do with that, so you finish your coffee.

*(No options — a percept that lands and passes. No coordinate, no flavor. → resolve to loop.)*

---

## Notes for the wire (Armature / Plumb)

- **Loop-native, frozen-cave-safe.** A consequence event gated on two thread flags; reads `pattern_open`, `nora_daytrip_done`, `convergence_seen`; writes `convergence_seen`. Touches nothing in `cave-b3`.
- **Fires once, in the loop.** Same firing shape as the pressure stages (engine surfaces it when the condition holds), minus the threshold — here the trigger is `pattern_open ∧ nora_daytrip_done ∧ ¬convergence_seen`. Once `convergence_seen` is set it never refires. If the engine prefers, this can equally be a `queueEvents` insert dropped at whichever of the two beats resolves *second* (the resolution checks the other flag); either wiring lands the same once-only beat. Plumb's call on the cleaner mechanism.
- **Coordinate-silent and lens-silent — deliberately.** No `diamondCoord`, no `attune`, no `lensFlavor`. This is a *noticing*, not a stance or a frame: the player infers the convergence, and the beat must not tilt the diamond or the lens, because the whole point is that the inference is the player's and the game commits to nothing. It's the reciprocity at the perceptual level, not a disposition move.
- **The anti-noun, held.** The beat states that two people point at one shape; it never states the shape, never confirms a pattern is real, never adjudicates folk-vs-institutional. "They're pointing at the same shape" is the *player's* read of two framings — a percept about other people's percepts, not a cause. The deflation (*you finish your coffee*) is load-bearing: the realization has nowhere to go, exactly as it wouldn't in life.
- **Linter-clean** — prose only; no `*…*` in any `log`; all refs resolve; the two gate flags are written upstream (Marie's `pattern_open`, Nora's `nora_daytrip_done`).

— Loom
