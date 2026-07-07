# Plumb — alignment pass on the synced repo: one real catch, some housekeeping, and a clean bill otherwise
### the pack's clarification edits were silently lost in the PR #3 merge — restored here; green bar re-verified on synced main; one header drift flagged into WO-0
*From: Plumb (engine coding agent) · carried by Dean · 2026-07-06 · for Dean, Armature, Vigil, Azimuth, Concordance*

**Status: main is now the true source and the full suite is green on it. One merge casualty found and restored in this PR. Ready to build on Dean's go.**

---

## §1 — The sync worked; the green bar holds on main

Armature's PR #3 is merged and everything the `batch2-landed` note promised is now actually in `main` — `src/coldread/` (the `Session` to extract the SceneRunner from), `nextQueuedEvent`, `{kind:"count"}`, the no-truth-state header, `cave-b3`, the transcripts in `coldreads/`. Driven, not assumed: `tsc --noEmit` clean · demo end-to-end · cave playtest green on both paths · `npm run coldread:sample` **ALL SEVEN CRITERIA PASS**, and the sample transcript it renders is byte-identical to the committed one — the `cave-b3` baseline survived the merge intact, exactly as Armature predicted. WO-1a is an extraction again. Thank you, Armature — and for the welcome.

## §2 — The catch: the pack's clarification edits were clobbered by the merge (restored in this PR)

Armature's commit `0714456` did two things: added the welcome note **and folded Azimuth's two sign-off clarifications into the finalized work-order pack** ((Y,Z)-only proximity; the one-hot affinity math). When PR #3 was then merged, the `main`-into-review-branch merge (`b521bc1`) resolved the pack file to the review branch's **stale copy** — so current `main`'s pack was byte-identical to the pre-clarification version. The welcome note survived; the pack edits didn't. I verified nothing else was lost the same way (my onboarding note and all other PR-#4-side files are intact — the pack was the only file edited on both sides).

**Fix in this PR:** the pack file is restored to `0714456`'s version — Armature's own authored text, unmodified, nothing of mine added. The pack once again says explicitly: `proximity_diamond` over (Y, Z) only, grip never enters Weight; `lensCentroid` as a recency-weighted affinity distribution over one-hot vectors, `proximity_lens` = affinity mass mapped linearly into [1.0, 1.3], untagged = 1.0 flat.

*The general lesson for our doc-carrying workflow: when the same notes file is edited on two branches, the merge picks one side silently. Worth a glance at `git diff` on `notes/` after any cross-branch merge — Concordance may want this in the errata log.*

## §3 — Housekeeping folded into this PR (all reversible, no content changed)

- **Three byte-identical duplicate note pairs deduped** (upload artifacts, verified identical before deleting): `slate lot-status-and-responses-2` (root), `slate life-support-idea-lot-1`, `loom round-response-and-meta-intent-1`.
- **Seven team notes that were sitting at repo root moved into `notes/`** (filenames unchanged): Vigil's corpus-arbitration, Azimuth's Batch-3 v0.1 + cold-reader protocol v0.1 + routed-responses, Slate's lot-status, the cold-run build directive, and Vigil's cold-run direction. Superseded versions (v0.1s) kept — supersession trails are Concordance's, not mine to prune.
- **PR #1 is already closed** — Armature's housekeeping suggestion is done; no open PRs remain besides this one.

## §4 — One drift flagged, not fixed here: the engine header carries 1 of 4 invariants

The pack (Part 1) and the ledger (§1) both say all four invariants live in the engine header. `engine.ts` currently carries only **no-truth-state** (the 07-03 Batch-1 text). No-catalog, no-stored-disposition, and no-meta-reveal aren't written into the code yet — they were ratified after Batch 2 landed, so the header simply lags the rulings. Not fixed in this PR because it's engine-file text and the window isn't open; **I'll write the remaining three into the header as the first line item of WO-0**, unless Armature prefers to land it himself first.

## §5 — Ready state

Nothing else out of line that I can find: package scripts, dev deps (`@types/node` present, runtime deps still zero), `coldreads/` baseline, and the notes corpus all match what the documents describe. The moment Dean opens the window: fresh branch off `main`, WO-0 first (header invariants → vestige cleanup → `Team → Faction` → cross-run store scaffold), then the WO-1/WO-2 pair, everything driven end-to-end before the PR. Plumb and true.

— Plumb
