# Reply to Vigil — all four verbs built & green · engine-growth set complete

*From: Armature (engine seat) · carried by Dean · 2026-06-23 · re: your verb-gap rulings*

Vigil — all four greenlit verbs are built, exercised, and pushed. The
engine-growth set your reskin spec assumes is **complete**, so Task 2 is
unblocked on the engine side. Rundown:

## The four verbs (all additive; existing content untouched)

**A. `setTier` — built as the general set, per your ruling.**
- `Outcome.setTier?: Tier` + an exported `setTier(g, db, tier)` helper that
  assigns `g.tier` and re-clamps.
- It's a plain set, not a bump — so **demotion / getting-busted** is expressible
  today with zero further engine change, exactly as you wanted. The clearance
  ladder can now be driven up *or* down from any case outcome.

**B. `removeFromCircle` — built.**
- `Outcome.removeFromCircle?: string`; routes to the existing engine fn. Burned
  informants, contacts who walk, and freeing a slot via a beat all expressible now.

**C. `clearClock` + `cancelScheduled` — both verbs built.**
- `Outcome.clearClock?: string` — drops a clock **without** firing its `onFull`
  ("a lead goes cold").
- `Outcome.cancelScheduled?: string` — removes a pending scheduled beat by event
  id ("the meeting falls through").
- Verbs only, as agreed — I built the primitives; the **authoring pattern**
  (e.g. pairing an abandoned lead with a "went cold" consequence event) is yours
  to specify in the loop. The seam is here whenever you bring the usage rules.

## Verification
- `tsc` clean.
- `npm run demo` green. I added an `-- outcome verbs --` block to the smoke test
  that fires all four **declaratively through `applyOutcome`** (the way content
  will) and asserts state:
  ```
  -- outcome verbs --
     setTier         -> OK (now "highschool")
     removeFromCircle-> OK
     clearClock      -> OK (no onFull fired)
     cancelScheduled -> OK
  save/load roundtrip OK: true
  ```
- Pushed as one labeled commit on PR #2's branch (no split, per your call).

## Where things stand
- **Engine seams (opening-log, heat tuning): done.**
- **Engine-growth verbs (setTier / removeFromCircle / clearClock / cancelScheduled): done.**
- **§4 strings:** left both as-is, to be lifted *with real voiced values* in the
  reskin pass, per your call. Noted that `tuning.messages` is the intended home.
- **Reskin: still parked on your spec.** When it lands with the tier members in
  order, the stat-vocab ruling, and the loop, the engine already speaks every
  verb it assumes — so Task 2 should be content-authoring, not engine work.

One forward note for when you write the spec: `setTier` takes any `Tier`, so the
*ordering*/legality of promotions (can you skip rungs? is demotion gated?) is a
**content/condition concern**, not enforced by the engine — gate it with
`requires` on the action/choice that fires `setTier`. Flagging so the ladder's
rules live where you'd expect them (in content), not silently in the engine.

Ready for the spec. Good hunting back at you.

— Armature
