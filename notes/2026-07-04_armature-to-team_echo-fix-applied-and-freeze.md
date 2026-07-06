# Echo audit applied · confirmations · **`cave-b3` is FROZEN**

*From: Armature (engine seat) · carried by Dean · 2026-07-04 · for Dean, Vigil, Loom, Azimuth, Slate & Concordance*

Loom's audit is applied, the sample is clean, and per the directive's final step I'm
declaring the freeze. One small content fix stood between us and a stranger in the cave;
it's done.

## The sweep — applied, line by line
Loom did the authoritative full-branch sweep; I applied it verbatim. Record of what changed:

- **Three echoes dropped** (card now opens on its own written prose): the voice line
  (was *"You let it in."*), the **Nora line** (was *"You let the pattern in — a thread
  reaches across to Nora."*), and the redundant *"You call the long way."* before the high
  passage. Mechanical effects are untouched — critically, **`etchings_link_nora` still
  sets**, so the reader makes the Nora connection from their own choice label and the game
  never confirms it in narration. That was the serious one.
- **Loom's richer prose swapped in** on the remaining `🔍 VERIFY` echoes: Reese-ahead,
  the turn-back exit, the bat, the dismiss, the rib, spot-you, teenagers, church, the
  question, shed-pack, and keep-pack win/lose — all verbatim from the audit.
- **`✅ CLEAN` lines kept as-is:** "You take point," "You press on," "You don't love it;
  you don't say so," "You follow the beam to the wall," the two throat-roll branches, and
  the take-the-shard chip/win/lose.

**Verification:** `tsc` clean · all seven acceptance criteria still pass on `cave-b3` ·
**zero** occurrences of any leaked intent phrase in the new transcript · the Nora card now
opens on *"'We're going,' Reese says"*, not on a confirmed link. Fresh sample dropped:
`coldreads/coldread_cave_cave-b3_70499_sample-scripted.md`.

## Your two confirmations (Azimuth Item 1, Vigil/Azimuth Item 2)
- **Item 1 — the live console shows prose + numbered options only.** Confirmed. `run.ts`
  prints `screen.prose` and the numbered option labels; **no card-ID step headers reach the
  reader.** The `ux_cave_etchings`-style headers exist *only* in the transcript renderer
  (the analyst-facing file), never in the session output. No priming.
- **Item 2 — the ▓▓ blocks stand, and the grammar is recorded.** No change to the rendering
  (the blocks were already what shows, so confirming them keeps the freeze intact). I added
  a renderer comment locking the three-provenance grammar per Vigil: *lock style is
  provenance, not decoration* — structural locks = greyed readable label · grip-illegible =
  ▓▓ blocks · inserted (far future) = silhouette/? — the renderer only marks availability
  and never restyles the label, so the three never blur.
- **Memory-surface amendment (§6):** added a `surface:` confirmation prompt at
  `startSession` in the operator console; the operator's answer lands in the transcript's
  operator-notes ("surface: clean"). Makes the memoryless/incognito check hard to skip. It
  was a few lines, so I took the optional call.

## 🧊 FREEZE — `cave-b3`
**As of this note, `cave-b3` is frozen. Nothing touches presentation — prose, options, the
opening stitch, the `(unavailable)` marker — until all three Batch A readers are done.**
Loom's final greyed-option string and any opening enrichment fold into the **post-A**
re-baseline, once, with whatever Batch A teaches. If anything needs to change before reader
one, say so now; after reader one, a change forks the experiment.

## Batch A is go on Dean's word
Everything the ghost run needs is in place: `npm run coldread -- <seed> <reader-label>`,
three fresh **memoryless/incognito, same-family** instances, one operator-rolled seed reused
across all three, "surface: clean" logged, framing + debrief verbatim from the pack,
transcripts to `coldreads/` as `coldread_cave_cave-b3_<seed>_reader-{1,2,3}.md`, scored per
pack §5 — with Vigil's watch-hypothesis on the analyst's desk (theories clustering on *who
made the marks* = the cave leaning human, a lesson for the return trip, not the bet failing).

## Answering Dean's question — the ghost-run outputs
No need to hand-commit them to `main`. The sample transcript lives in `coldreads/` on this
branch and rides **PR #3** — it lands on `main` when that merges, alongside the whole
Batch 1 + Batch 2 build. (I also removed the two stale **`cave-b2`** sample copies — one in
`coldreads/`, one you'd added to `notes/` — since they're the *pre-fix, contaminated* version;
`cave-b3` supersedes them. Didn't want a reader or analyst grabbing the wrong prose.) When the
real Batch A transcripts come in, drop them in `coldreads/` and they're versioned by the
`cave-b3` build tag automatically.

## Post-A queue, noted (explicitly not now)
On the record so it's out of the way: Batch 3 (band-select + lens-bias, contracts in hand) ·
the **deck registry** from the box-under-the-hood doc (`decks:[{id,mountFlag?,coord?}]`, the
daily draw composing the union of mounted decks — small, additive, rides the `drawWeight`
chokepoint I already factored; it's also the dome's unit, so decks-as-domes lands there) ·
Loom's final greyed string + opening enrichment. None of it touches the freeze.

The stranger walks in on your go.

— Armature
