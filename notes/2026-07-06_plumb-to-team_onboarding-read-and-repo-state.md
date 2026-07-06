# Plumb — onboarding read complete, one repo-state finding before the build window opens
### the incoming engine agent reports in: callsign, what I've internalized, the green bar as-found, and a code-sync gap that gates WO-1a
*From: Plumb (engine coding agent) · carried by Dean · 2026-07-06 · for Dean, Armature, Vigil, Azimuth, Loom, Slate, Concordance*

**Status: onboarded, oriented, ready to build — pending one sync question (§4) that Dean or Armature can settle in a sentence.**

---

## §1 — Callsign

**Plumb.** A plumb line stores nothing and computes nothing — hang it anywhere and it *derives* true vertical from what's already acting on it. That's the emergent-position keystone as a hand tool: store the events, derive the position, never persist a disposition. It's also the standard I'm building to — Azimuth asked for the centroid "boring and true," and plumb-and-true is the older phrase for the same virtue. That's the job as I understand it.

## §2 — What I read, and what I hold

Read end-to-end: Vigil's onboarding doc, Armature's finalized work-order pack v1, Concordance's master ledger v2.0 (including §2 — I'm compass-burned, and anything I spawn inherits that status per the burn register), Azimuth's sign-off + two clarifications and Batch-3 contracts v0.2, Armature's centroid-spec synthesis, Vigil's handoff-readiness take, Loom's Batch-A read and content roadmap, and the engine itself (`engine.ts`, `types.ts`, `rng.ts`, `cave.ts`, the playtest, the smoke test).

What I hold, so the team can check my grip on it:
- **The four walls** — no stored meaning, no shown structure, no stored position, no confirmed meta — and the north star they armor: *does this preach, or does it hand the question back?* That's the test under every decision, including engine ones.
- **The engineering walls** — determinism with a shipped seed-replay assertion, content-is-data, additive/optional/backfill-safe types, zero runtime deps, green bar before merge, verify by driving.
- **Azimuth's two clarifications, acknowledged as load-bearing:** (1) `proximity_diamond` runs over **(Y, Z) only** — grip/X never enters the Weight step, which makes don't-bake-the-spiral mechanical rather than disciplinary; (2) the lens-centroid is a **recency-weighted affinity distribution over one-hot vectors**, with `proximity_lens` = affinity mass on the card's flavor mapped **linearly into [1.0, 1.3]** — continuous, never categorical-jumpy.
- **Build order:** WO-0 (vestige cleanup, `Team → Faction`, cross-run store scaffold) → WO-1 (loop + SceneRunner + centroid) with WO-2 (registry + pipeline) → WO-3 (both contracts, off by default) → WO-4/WO-5 as content demands. Branch → PR → Armature reviews → no self-merge. If a contract fights the engine, I flag it; we bend the spec, not the machine.

## §3 — The green bar, as found

On the repo as it stands: `tsc --noEmit` clean; `npm run demo` runs end-to-end including the save/load roundtrip; `npm run playtest:cave` passes all assertions on both the turn-back and deep paths. A sound floor to build from.

## §4 — The finding: this repo predates Batch 1 + Batch 2 (gates WO-1a)

The notes describe engine state the repo doesn't contain. The code here matches the **06-24 "engine v2 + cave converted"** commits; everything Armature reports landing on **07-03** (`batch2-landed`) is absent — I searched the full git history on every branch, not just the working tree:

- **No cold-read harness**: no `Session`, no `Recorder`/trace stream, no operator console, no `coldread`/`coldread:sample` scripts, no `coldreads/` directory. **WO-1a is "extract a recorder-agnostic SceneRunner from the cold-read `Session`" — that file isn't here to extract from.**
- **No `nextQueuedEvent`** (the queue-only draw primitive; the pack names it a seam).
- **No `{kind:"count"}` condition** (Batch 1).
- **No invariants header** in `engine.ts` (the walls aren't yet written where the pack says a reaching hand will hit them).
- **No `@types/node`** dev dep; and the cave prose here presumably predates the `cave-b2`/`cave-b3` build tags the transcripts baseline against.

**My recommendation: sync Armature's working copy into this repo before my window opens, rather than having me rebuild.** Rebuilding is feasible but wrong: the Batch-A transcripts and the frozen `cave-b3` baseline reference artifacts (build tags, byte-identical replays, the trace schema) that a reimplementation can't reproduce exactly, and Armature has already made and documented design decisions inside that code (recorder-at-session-layer, the scene-start option (b), the reserved `{trueBand, resolvedBand}` slot) that I'd be re-deriving blind. One upload/push from wherever Batch 2 lives, and WO-1a becomes an extraction again instead of an excavation.

If the sync isn't possible and the team would rather I rebuild the harness from the `batch2-landed` note's spec, I can — but that's a decision to make out loud, and Armature should re-baseline expectations for the seven acceptance criteria if so.

## §5 — Ready state

Nothing else blocks. Once the code question is settled and Dean opens the window, I start at WO-0 and the WO-1/WO-2 pair on this branch, drive everything end-to-end before the PR, and route anything ambiguous to the right seat through Dean. Glad to be here — the foundation reads as carefully built as advertised, and the thing it protects is worth protecting.

— Plumb
