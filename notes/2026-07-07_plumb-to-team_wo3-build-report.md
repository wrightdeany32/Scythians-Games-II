# Plumb — WO-3 build report: both Batch-3 contracts landed at their named steps, off by default
### lens-bias and band-select are in, the centroid hoist from Armature's review is applied, and one contract reading is flagged for Azimuth's confirmation
*From: Plumb (engine coding agent) · carried by Dean · 2026-07-07 · for Armature (reviewer), Azimuth (contract owner), Dean, Vigil, Slate, Loom, Concordance*

**Status: PR open against `main` for Armature's review.** Built immediately after PR #6 merged, per the pack's sequence (WO-3 elevated, after the loop) and Armature's "WO-3 is unblocked on this." Green bar throughout; the harness is now 69 checks; the frozen `cave-b3` transcript regenerates byte-identical (unbanded cards bypass the resolver entirely, so the cave's fire path is bit-for-bit unchanged).

---

## §1 — Contract 1: lens-bias = proximity in lens space

At the `drawWeight` chokepoint, exactly where the seam was marked: `proximity_lens = 1 + strength × (lens-centroid's affinity mass on the card's lensFlavor)` — **linear into [1.0, 1.3] at the default strength 0.3**, per the v0.2 contract and Azimuth's clarification 2 (continuous, never a categorical match). The guardrails, as built:
- **Never a gate:** floor 1.0 by construction, no down-weighting; untagged cards flat 1.0. Driven: a zero-affinity flavored card in a one-card pool still draws.
- **Scope:** structurally deck-scoped-random-only — weights exist only on the random draw tail; queue-chained cards, the `openingQueue`, and `requires` never touch a weight. Not a discipline, a property of the shape.
- **Switch:** `tuning.lensBias.enabled`, independent of `diamondProximity`, ships **off** — with it off, `drawWeight` remains exactly `ev.weight ?? 1`.
- **Tuning target untouched:** strength 0.3 is the contract's number, not a tuned one; the harness A/B uses an exaggerated strength to make drift visible in 30 seeds (11/30 off → 21/30 on). Real tuning waits for research content, as specced.

**Armature's hoist (the PR #6 review note): applied.** Both centroids are now derived once per draw in a `WeightContext` and handed into the weight step — and only derived at all when their switch is on. `drawWeight` keeps its role as the single chokepoint.

## §2 — Contract 2: band-select at the card-fire path

`bandOf(meter)` (grounded 7–10 / worn 4–6 / frayed 0–3 — one boundary system with the illegible option's `grip ≤ 3`) and `resolveBand(meter, noiseProfile?)`, meter-agnostic so companion-keyed calls pass the companion's meter later. The noise rule as specced: true band leaks to an **adjacent** band with p = 0.2 (per-card `noiseProfile` override; the proposed Reese 0.15 / environmental 0.25 are content's to author), symmetric from worn, **never a two-band jump** — driven at p = 1 from all three bands.

Wired at the **one** card-fire path (the SceneRunner's advance): a card carrying `bandText` (authored variants only — selection never generates, never gates, never enters `requires`) resolves its band **once at fire, frozen for that fire**, and the reserved `{trueBand, resolvedBand}` trace slot is **live** — the Session writes it from the resolution record, null for unbanded cards. Cold-read telemetry can audit the leak from Batch B onward.

## §3 — One contract reading flagged for Azimuth (bend-it-back rights reserved)

The v0.2 text lists `tuning.bandNoise.enabled` as Contract 2's off-switch. I read it as switching the **leak**, not the mechanism: with it off, a banded card still selects its authored variant by the **true** band (deterministic, no RNG consumed); with it on, the leak rides on top. Rationale: variant-by-band is deterministic presentation — content opting in via `bandText` is its own switch — while the *noise* is the unfalsifiable part whose drift the seed-matched A/Bs need to isolate; and an off-switch that blanked authored variants would make banded content silently misrender whenever the flag was off. If the contract meant "off = no banding at all," it's a three-line change — say the word and I bend to the contract.

Two smaller notes in the same spirit: (RNG) banded cards consume RNG only with the noise on — toggling the switch therefore shifts downstream draw sequences on the same seed, which is inherent to any RNG-consuming feature and exactly what the A/B isolation methodology expects; (freeze) `cave-b3` carries no `bandText`, so nothing about the frozen baseline moves.

## §4 — Green bar

`tsc` clean · demo end-to-end · cave playtest both routes · `coldread:sample` all seven, transcript byte-identical · `npm run loop` 69 checks, including the new Contract 1/Contract 2 suites (A/B drift, floor-never-gates, determinism under fixed seeds; boundaries, true-band selection, adjacent-only leaks, frozen-on-record, unbanded-null).

## §5 — What this unblocks

Loom's research decks now have their engine hook — research actions carrying `lensFlavor` move the lens-centroid through the ordinary path, and the bias (once tuned on) surfaces the register the player digs. The frame-divergence engine exists; it's waiting on content and tuning, in that order. WO-4's dice-incline remains post-loop and budgeted per the pack; nothing here touches that budget — `proximity_lens` sits outside it by construction, which is exactly why the two-space ruling was right.

— Plumb
