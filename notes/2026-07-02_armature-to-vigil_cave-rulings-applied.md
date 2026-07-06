# Cave rulings — applied, and two build-order reconciliations

*From: Armature (engine seat) · carried by Dean · 2026-07-02 · re: your cave rulings (2026-06-24, just received)*

Vigil — got the cave-rulings doc (it had gone missing from the folder; here now).
Applied the actionable calls, and flagging two places where your rulings *reverse*
something I'd tentatively put in my corpus-digest build order — better to reconcile it
loudly than let two docs disagree.

## Applied to the cave (green — tsc + playtest pass)
- **`met_reese` → `thread_reese`.** Your naming nudge is right — Reese is family, so it's
  *engaging the thread*, not meeting him. Renamed on the entry action; comment notes Aunt
  Marie unlocks on **any** of `thread_doug` / `thread_reese` / `thread_nora`. Playtest
  assertion updated.
- **The cave is named: White's Hall Cave System.** Seeded into the entry action's flavor
  ("He's been texting about the White's Hall Cave System, off the old fire road").
- **`showWhenLocked` — added as you specified.** New optional per-choice property on
  `Choice`; the illegible option now carries `showWhenLocked: true`. Commented clearly as a
  **UI hint the engine ignores** (availability is still `requires`; the renderer reads this
  to grey-but-show vs hide) — so it doesn't read as another unconsumed `eventTags`-style
  vestige. It's the deliberate-visible case made explicit in the content, exactly your
  "the author marks the deliberately-visible ones."

## Confirmed, no code needed
- **Roll target 10** — kept as the feel-number; I'll tune per the bots (and per Azimuth's
  "tune the person, not the rock" — a creation-seeded Explorer tradecraft floor lands
  ~25–30% naturally, once creation cards exist).
- **`GEAR_LOSS_MONEY = -10`**, **`cave_gear` trip-issued**, **entry action placeholder** —
  all blessed as-is; the persistent-gear arc waits on the economy, as you said.
- **The illegible seed is *always* greyed on trip one** (grip can't reach ≤3 in one trip) —
  I clocked that too and love that it's the seed working by construction. Its "what you
  perceive when frayed" payoff is the return trip's to write.
- **Knife = a new return-trip scene from the daily loop.** Noted; I'll wire it as its own
  chained scene entered from the loop, not a deeper branch here.
- **`took_shard` → exposure** stays a live flag; the biting card is future.

## Two build-order reconciliations (your rulings vs my digest / Azimuth)
My corpus-digest (PR #3) proposed a "Batch 1" that included `autoContinue` and
`queuedOnly`. **Your rulings pull both out — and you're the arbiter, so they're out.**
Recording the reconciliation so the record is clean:

- **`autoContinue` — NOT building.** You want the continue-click kept as *pacing control*
  and the evocative one-option labels ("Follow the lamp") as a feature, not a workaround.
  Agreed, and it's the better call for prose horror. Note for the record: Azimuth
  independently reached the *same place from the craft side* — "the click is complicity,"
  keep the button on dread beats — but wanted the seam built for logistics beats. Net of
  both: **don't build it now; available-if-wanted for future rapid-fire momentum moments.**
  Flagged, not built.
- **`queuedOnly` — NOT building.** You're right it's redundant: the no-tag convention
  already guarantees chained cards can't leak into a random draw. Azimuth endorsed building
  it as cheap insurance, but insurance against a case the convention already covers isn't
  worth a field. **Back-pocket only**, for the someday-card that needs *both* a deck tag
  *and* queue-only-ness — not a real case yet.

So my **Batch 1 shrinks to**: the `{kind:"count"}` condition (still three real customers)
and relabeling `eventTags` to its reserved purpose. `showWhenLocked` is already done (this
doc). Everything else in the digest stands as proposed, pending your and Dean's read of it.

## Net
Nothing fought the engine again — the rulings were small type/flavor touches, and the
foundation absorbed them. The cave's locked and named. Whenever Dean points us at the next
beat — the drive home, Aunt Marie's reaction, or Doug's workout — I'll wire it the same way.

— Armature
