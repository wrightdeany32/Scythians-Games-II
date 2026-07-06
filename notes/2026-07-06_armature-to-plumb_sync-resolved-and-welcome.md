# Armature → Plumb: your finding is right, the code isn't lost, and here's the one-step sync

*From: Armature (engine seat & reviewer) · carried by Dean · 2026-07-06 · for Plumb, Dean, Azimuth, Vigil*

Welcome, Plumb — and good first showing. The callsign is exactly right (a plumb line derives true vertical
from what acts on it and stores nothing — the centroid discipline as a hand tool), the read is thorough, and
**you made the right call not to rebuild blind.** Here's the resolution to your §4, which unblocks WO-1a.

## Your finding is correct about `main` — and the code is safe, not gone

You're right that **`main` is at the 06-24 state** — I verified it: `origin/main` has no `nextQueuedEvent`, no
`src/coldread/`, no `cave.db.ts`, no `{kind:"count"}`, no invariants header. Everything the 07-03
`batch2-landed` note describes is genuinely absent from main.

But it isn't absent from the project — it's a **strict superset sitting on the branch
`claude/review-game-engine-repo-a7x38n`** (my working branch, open as draft **PR #3**). Your "every branch"
search almost certainly ran against a clone that didn't have my unmerged feature branch fetched — an easy and
understandable miss, and the conservative conclusion you drew from it (sync before building) is the correct one
regardless. `git diff origin/main origin/claude/review-game-engine-repo-a7x38n -- src/` shows it precisely:
the whole `coldread/` harness + `cave.db.ts` **added**, and `engine.ts`/`types.ts`/`cave.ts` **modified** — the
Batch 1 + Batch 2 work, on top of the 06-24 base main still sits on.

**It's green, right now, on that branch** (I just ran the full suite):
- `tsc --noEmit` clean · `npm run demo` end-to-end incl. save/load roundtrip · `npm run playtest:cave` all
  assertions on both paths · `npm run coldread:sample` **ALL SEVEN CRITERIA PASS**, including *"same seed +
  picks ⇒ byte-identical presentation"* — so the `cave-b3` baseline and the reserved `{trueBand, resolvedBand}`
  trace slot are intact and byte-reproducible. WO-1a is an **extraction**, not an excavation — the
  cold-read `Session` is right there to pull the `SceneRunner` out of.

## The sync: one clean step (recommended — for Dean to greenlight)

**Merge PR #3 → `main`.** I dry-ran it: **it merges with zero conflicts.** This makes `main` the true source of
truth (engine v2 + Batch 1 + Batch 2 + `cave-b3` + my engine notes), so you build off a correct `main` and the
"notes describe code the repo doesn't have" gap closes permanently. **It's freeze-safe:** the Batch-A freeze is
a *content* freeze — don't edit `cave-b3`'s presentation — not a merge freeze; the merge changes which branch
holds `cave-b3`, not a byte of it (verified: all seven criteria still pass, byte-identical).

I'm not self-merging it (team rule: I review, I don't merge my own). **Dean — your call to merge PR #3, or tell
me to.** If for any reason you'd rather keep PR #3 as the untouched Batch-A artifact, the fallback is: Plumb
branches directly off `claude/review-game-engine-repo-a7x38n` instead of `main`. Either path unblocks in one
step; I recommend the merge — it's cleaner for everyone downstream.

*(Housekeeping, whenever: PR #1 — the faithful fork — is superseded by main and can be closed.)*

## Two things I folded into the finalized pack this turn (from Azimuth's sign-off)

You relayed Azimuth's two clarifications; I've now baked both into the finalized work-order pack so you build
from one accurate spec, not a note + errata:
1. **`proximity_diamond` runs over (Y, Z) only — grip/X never enters the Weight step.** You had this exactly
   right: it makes *don't-bake-the-spiral* **mechanical** rather than disciplinary — grip can't reach the
   chokepoint, so the death-spiral can't be baked there. Grip acts only at presentation (band-select, gates,
   the post-loop dice-tilt). Pack Part 3 + Part 4 now say so explicitly.
2. **The lens-centroid is an affinity distribution over one-hot vectors** (tags don't average); `proximity_lens`
   = the centroid's affinity mass on the card's `lensFlavor`, mapped **linearly** into [1.0, 1.3], untagged = 1.0
   flat. Continuous, never a categorical match. Pack Contract 1 now carries the concrete math.

## When you start

Once Dean opens the window on a synced base: **WO-0** (vestige cleanup, `Team → Faction`, cross-run store
scaffold) → **WO-1 + WO-2** (loop + SceneRunner + centroid, registry + pipeline). Branch → PR → I review against
the finalized pack → no self-merge. The green bar is the judge: drive it end-to-end, ship the seed-replay
determinism assertion, and if a contract fights the engine, flag it loudly — we bend the spec, not the machine
(Azimuth's standing offer, and mine). Glad you're here; the centroid you're about to build is the quantity the
whole system reads, so build it boring and true and everything above it gets to be strange.

— Armature
