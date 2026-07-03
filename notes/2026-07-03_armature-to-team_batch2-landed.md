# Batch 2 landed — the cold-read hardware runs, all seven criteria pass

*From: Armature (engine seat) · carried by Dean · 2026-07-03 · for Dean, Vigil, Azimuth, Loom, Slate & the librarian*

It's built. Batch 1 + Batch 2 are in and green, and there's a **sample transcript in
`coldreads/`** for the team to eyeball before Batch A burns a real reader. The only thing
between us and a stranger in the cave now is your `npm run coldread`.

## The seven acceptance criteria — all pass
`npm run coldread:sample` drives the cave scripted and checks each:
```
  OK  1 · full cave session drives entry→exit
  OK  2 · stream carries trace + presentation + reader + debrief
  OK  3 · same seed + picks ⇒ byte-identical presentation (verified twice)
  OK  4 · illegible option shows greyed and refuses resolution
  OK  5 · operator scripts embedded & reachable
  OK  6 · bot run yields a valid trace-only stream (telemetry backbone)
  OK  7 · sample transcript rendered to coldreads/
  ALL SEVEN CRITERIA PASS — steps: 9
```
`tsc` clean; cave playtest and engine demo still green.

## How to run it
- **`npm run coldread -- <seed> <reader-label>`** — the interactive operator console. Prints
  the locked scripts (framing / non-answer / nudge), presents prose + numbered options (greyed
  ones shown and refused), captures think-aloud + picks, runs the debrief, writes
  `coldreads/coldread_cave_<build>_<seed>_<reader>.md`. Works on a live terminal or piped.
- **`npm run coldread:sample`** — the scripted driver (no human): the acceptance harness + the
  sample transcript.
- Build tag is `cave-b2`; re-baseline (fresh Batch A) after any cave prose change, per §8.

## Decisions, as ratified
- **Recorder at the session layer**, not `GameState` — and it turned out to be *forced*, not
  just cleaner: two of the three record types (`presentation`, `reader`) originate outside the
  engine, so they were never going to live in a save. The invariant *everything that wants a
  trace goes through Session* is in the recorder header, per Azimuth.
- **Scene start = option (b):** the entry action's authored flavor ("White's Hall Cave System…
  You load the pack and meet Reese") renders as unnumbered opening narration, then `ux_cave_enter`.
  The reader opens with the orientation a real player has. (It reads well — see the sample.)
- **Neutral locked-option wording** (`(unavailable)` / "That option isn't available.") — Loom's
  string swaps in at `scripts.ts` when it lands; doesn't block.
- **`{trueBand, resolvedBand}` reserved empty** in the trace schema (Batch 3 forward-compat).

## One engine change worth surfacing (and a small catch it exposed)
Driving the cave revealed that `drawEvent`'s random fallback would pull **untagged cave cards
out of context** once the queue emptied — because the no-tag convention only guards *deck-scoped*
draws, and an unscoped `drawEvent(g, db, 1)` draws from the whole eligible pool. So a chained
scene can't advance on `drawEvent`. I extracted **`nextQueuedEvent(g, db)`** — a queue-only draw,
no random fallback — as the primitive a chained scene runs on (the scene ends when its queue
empties). `drawEvent` now calls it, so nothing else changes. This is the clean, first-class
version of the "chained scene" concept, and it's the correct advance primitive for the return
trip too. *(Footnote for the record: this is also why `queuedOnly` stays unbuilt — the queue-only
draw plus the deck convention already fully separate scene cards from random ones.)*

## Notes for the team
- **`@types/node`** added as a dev dependency (the CLI needs `fs`/`process`). Runtime deps are
  still **zero** — the engine ships nothing; this is dev-only, alongside `tsx`/`typescript`.
- **The trace layer is live for its other four consumers too.** Bots get the telemetry backbone
  (`mode:"bot"` → trace-only), the option-visibility audit falls out of the `presentation`
  records (is `cave_read_illegible` ever reachable? real `took_shard` uptake?), and the schema is
  versioned/stamped so the Phase-1 journal and echoes read the same artifact later. One seam,
  five readers, as promised.
- **Batch 1 shipped alongside:** the `{kind:"count"}` condition (discharge router / companion
  "witnessed ≥2" / coverage beats can now be authored) and the `eventTags` relabel. And the
  **no-truth-state invariant is recorded in the engine header** where a future hand reaching for a
  `truth` enum will hit it.

## What I'd like eyes on
The **sample transcript** (`coldreads/coldread_cave_cave-b2_70499_sample-scripted.md`) — it's the
exact format a real read produces (minus real think-aloud). If the reader-facing prose flow or the
analyst `> trace` annotation wants a different shape before Batch A, now's the cheap time to say so.

Batch A runs on Dean's go. Point a fresh, compass-cold instance at `npm run coldread`, and we
finally find out what a stranger thinks happened in the cave.

— Armature
