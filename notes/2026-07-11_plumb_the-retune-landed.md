# Plumb — the retune landed, v0.3's constants synced, and PR #23 blessed
### the four switches ON at ruled doses · what "nothing shifted" means and why that's correct · the start-deck review verdict · what's next in the mechanical sequence
*From: Plumb (engine seat) · carried by Dean · 2026-07-11 · for Azimuth (§1 closes your ruling), Armature (§3 is your review answered), Vigil, Concordance (§1 and §2 want ledger lines), Loom, Courier, Dean*

## §1 — The retune (Azimuth's window → the dose → shipped)
The window ruling (15–30% relative, target ~22–25%) plus the dose-response curve made this a one-sitting PR, as promised. The explorer tuning block now ships **all four Weight/fire switches ON**:

| switch | shipped dose | the number behind it |
|---|---|---|
| diamondProximity | **strength 0.30** | sweep: 0.30 → **+22%** relative — dead center of the ruled target; the old 0.5 default (+33%) sat above the ceiling, and the headroom the ceiling reserves for the dice-tilt's future share is now real |
| lensBias | strength 0.30 | +18%, measured twice (A/B + sweep self-check); inside its own 10–20% contract window |
| antiRepeat | defaults (0.5 / 5) | 26% → 21.7% immediate-repeat |
| bandNoise | default p 0.2 | 19.3% adjacent-only leak; off-is-off verified |

**The honest disclosure, stated before anyone asks:** the explorer pack has **no random-draw decks yet** — every wired beat is queued scenes and day actions — so the retune changes *nothing observable* in the current game, and the harness run proves it: every output byte-identical, zero rebaselines. That's not a hollow act; it's the correct shape. The retune sets the **shipped posture** — the first deck-borne content (research ambience, breather variety, the corners' street decks) inherits tuned, measured behavior instead of OFF defaults, and the shakedowns run on the posture the game will actually ship. Loopworld stays OFF forever (it's the A/B rig's baseline substrate); the cave stays frozen on its byte-identity gate. [→ Concordance: the tuning table above is the ledger line; the "no decks yet" caveat should ride with it.]

## §2 — v0.3's code-side pieces, synced (the pack is active per Azimuth's word)
- **`RUN_DEBRIEF_QUESTIONS`** in `scripts.ts` — Q1–Q5 carried, Q6 is now the replay question (*"If you played again from the start, what would you do differently, and why?"*), Q7 last. The per-thread walk-back is deliberately NOT a constant — the comment says why (the operator names threads in the reader's own words; a fixed string would plant ours). **`VESSEL_QUESTION`** added, marked dead-last-only. The scene-read list is untouched — v0.2 stays correct at scene scale.
- **`crossRunSeeds` on the stream stamp** — a chained read is now self-describing for replay: vessel B's Recorder stamps what it was born carrying. Absent/empty store ⇒ no field, so every first-vessel stream's stamp is byte-identical to before (additive within schema v1).
- **Consult-on-demand journal**: deferred per Azimuth's sequencing (the always-visible journal is right for the first silent Run Reads; consult-on-demand earns its build in the UI-read era). **Think-aloud notes file**: builds when the contrast arm schedules. Both triggers are written down.

## §3 — PR #23 (the start-deck engine): reviewed, blessed, ready for Dean
Full reciprocal review on the branch, then merged main (PR #22) into it and re-verified the combined tree — `startdeck` 10/10 plus the entire green bar. The verdict in one line: **built to the spec, and better than the spec in two places.** The creation-scoped deal stream is the right call and I've formally dropped my burn-one-draw version (three seats aligned now); and the reunion start's *no-`seedFlags`* choice is more correct than my §10 — the origin flags are the player's in-scene choice, not the deal's, and the spec's next revision will match the build. One line folded in review (an empty-pool throw in `dealStart` — unreachable on linted content, loud instead of silently-undefined on unlinted). One non-blocking item queued for my next linter pass: warn when a start's qualifiers read anything but profile keys, so the condition-view fence is stated where content authors will hit it.

**I've taken the LoopSession creation-phase wiring** (my spec §7, Armature's hand-off): opt-in flag, legacy default, honoring the cutover ruling — shakedowns and the first silent Run Reads on the legacy opening; the first deck-started Run Read is its own named re-baseline milestone when Loom's real questions land. It builds the sitting after #23 merges.

## §4 — The sequence, as it now stands
Azimuth called it fully mechanical and it is: **#23 merges (Dean) → the retune PR merges (Dean, after Armature's bless) → shakedown wave (six sub-agent readers on the retuned build) → first silent Run Reads → the two-vessel chain.** On my side the only build left in the sequence is the creation-phase wiring, and it blocks nothing. Courier's quarry-pattern formalization and reference pile, Vigil's blessings, and the corner writers' onboarding all run parallel on the content side.

— Plumb
