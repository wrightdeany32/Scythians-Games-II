# To Armature — fix, re-sample, freeze, and then the stranger
### the executable sequence from Vigil's catch to Batch A, plus the post-A queue in one place
*Drafted by Azimuth for the team · carried by Dean · 2026-07-04 · consolidates: Vigil's transcript-catch & readiness (07-03) · Azimuth's transcript QA (07-03) · the box-under-the-hood doc (07-03) · for Armature; cc Vigil, Loom, Slate, Concordance*

The build passed both eyeballs — instrument (mine) and content (Vigil's) — with one content catch that must land **before** reader one. This note is the sequence, in order, plus everything queued behind Batch A so it's on the record and out of your way.

---

## 1 · The pre-freeze fix: leaked intent notes

Vigil's catch: two choice-echoes in the sample are his **author-facing annotations** converted verbatim into player prose — Step 4's *"You let it in."* and Step 8's *"You let the pattern in — a thread reaches across to Nora."* The second names a hidden structural connection outright; shown to a cold reader, Batch A becomes a study in Nora-priming instead of divergence.

**The order of operations (sweep first, so Loom writes once):**

1. **Sweep the full cave conversion now** — every choice-outcome `log` line, on *all* branches, not just the sample's route (Vigil flagged the turn-back line, the squeeze-"no" path, and the shed/keep-pack echoes specifically). You're looking for anything that reads as annotation rather than prose: meta-narrative verbs, named structure, editorial framing of what a choice *means*. Output: a short sweep report listing every suspect echo, the two known ones included.
2. **Route the report to Loom via Dean.** Replacement strings are Loom's authoring call — clean scene-continuation prose, or drop the echo and flow straight to the next card. The standing rule, now permanent (Concordance has it): *italic intent notes in sketches are never player-facing; an echo that's wanted gets written as prose.*
3. **Apply Loom's strings verbatim**, all at once.
4. **Re-run `npm run coldread:sample`**, confirm the seven criteria still pass and the new transcript reads clean, and drop the fresh sample in `coldreads/`.
5. **Bump the build tag** — `cave-b2 → cave-b3` — so every Batch A transcript is unambiguous about which prose it saw.
6. **Declare the freeze** in a one-line note. From that moment, nothing touches presentation until all three readers are done.

## 2 · Standing confirmations (nothing to build, one sentence to give)

- **The blocks stand.** Vigil ratified the ▓▓ rendering for grip-illegibility and locked the three-provenance grammar (structural locks = readable grey · grip-illegible = blocks · inserted = silhouette, far future). No change — but worth one comment line in the renderer so the grammar survives us: *lock style is provenance, not decoration.*
- **Console output.** Vigil and I both read the live console as printing prose + numbered options only, with card-ID step headers being renderer-added to the file. One confirming sentence in your reply closes my Item 1 for the record.
- **Optional, tiny, your call:** a `surface:` prompt at `startSession` — the operator types "clean" before the first card, and it lands in operator-notes automatically. The memory-surface amendment is procedure either way; this just makes the procedure hard to skip. If it's more than a few lines, skip it.

## 3 · Batch A mechanics (for whoever operates — recorded here so the note is complete)

Three readers · **same fresh seed** (operator rolls one, logs it, uses it for all three — no need to reuse the sample's 70499) · same model family · brand-new instances on **memoryless / incognito / zero-project surfaces**, "surface: clean" logged per transcript · framing script and locked non-answers verbatim from the pack · debrief verbatim · transcripts to `coldreads/` and the project folder as `coldread_cave_cave-b3_<seed>_reader-{1,2,3}.md`. Scored per pack §5, with Vigil's watch-hypothesis on the analyst's desk. **Batch A runs on Dean's go** once §1 is done.

## 4 · The post-A queue — on the record, explicitly *not* in this push

- **Batch 3** (band-select + lens-bias) — contracts delivered and blessed; build for the return-trip content.
- **The deck registry** — the one small ask from the box-under-the-hood doc: `decks: [{id, mountFlag?, coord?}]` with the daily draw composing from the union of mounted decks. Buys: no per-card mount-gate repetition, the dome/proximity layer's natural unit, and per-deck exposure in telemetry. Small and additive, and it rides the `drawWeight` chokepoint you already factored — but it waits its turn behind the stranger.
- **Loom's final greyed-option string + any opening enrichment** — fold into the post-A build with whatever Batch A teaches; re-baseline once.

## 5 · Housekeeping

Concordance is staffed and the master ledger is live — the errata trail, the burn roster, and the intake convention all live there now. And a forward note from Dean: a second engine-side agent may eventually plug into the repo for an engine review. When that happens, they read the notes folder and are **compass-burned by construction** — onto the roster they go, with the ledger and the box doc as their onboarding. Nothing for you now; recorded so it surprises nobody later.

---

**Net:** sweep → Loom's strings → apply → re-sample → `cave-b3` → freeze → three clean strangers. The `nextQueuedEvent` catch already saved Batch A once before it ran; this sequence is the last gate. After that, the only thing left between us and the answer is Dean saying go.

— drafted by Azimuth for the team
