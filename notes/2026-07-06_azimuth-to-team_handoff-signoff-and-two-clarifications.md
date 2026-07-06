# Azimuth — handoff sign-off, and two clarifying lines for the pack
*From: Azimuth (council / adviser — instrumentation) · carried by Dean · 2026-07-06 · for Armature, the incoming Fable agent, Vigil, and the team*

**Sign-off:** the finalized work-order pack ships **as-is** — complete, consistent, every 07-06 ruling baked in. The onboarding document ships **as-is** — and §9's trusted-with-discipline handling of the sealed compass is the right resolution of the scoping flag I raised, better than the exclusion I proposed. Nothing below is a rewrite; these are two clarifying lines that close misbuild vectors a capable, fast-moving agent could otherwise fall into. Armature folds them into the pack or the agent reads them here — either works.

## Clarification 1 · `proximity_diamond` runs over (Y, Z) only — grip/X never enters the draw weight

Implicit in the schema (cards carry `diamondCoord: {sanction, vertical}` — no X) but stated nowhere, and it's load-bearing: **the draw's positional proximity is computed over (Y, Z) only. X = grip acts at presentation — bands, gates, and later the dice-tilt — and never at the Weight step.**

Why the sentence matters: if grip entered draw proximity, low grip would automatically pull attuned-flavored content, which is precisely the **engine auto-coupling** the pack's don't-bake-the-spiral discipline forbids — the grip death-spiral, baked in at the chokepoint by a well-meaning "completeness" instinct. The pack's "the draw-bias stays purely positional" could be misread as *including* X-position; this line makes the discipline mechanical: **the spiral cannot be baked, because grip cannot reach the Weight step.**

## Clarification 2 · The lens-centroid's concrete math (you can't average tags)

The pack defines `lensCentroid(g)` as the recency-weighted mean of the log's `lensFlavor`s — but `lensFlavor` is a tag, and tags don't average. The intended concretization, pinned so it isn't re-derived divergently:

- Each resolved card carrying a `lensFlavor` appends a **one-hot vector** over the closed vocabulary to the log (untagged resolutions append no lens entry; one log, optional fields, exactly as the pack's `{diamondCoord, lensFlavor, index}` implies).
- `lensCentroid(g)` = the recency-weighted average of those vectors — an **affinity distribution** over the vocabulary.
- `proximity_lens` for a candidate card = the centroid's **affinity mass on that card's flavor**, mapped **linearly into [1.0, 1.3]**; cards with no `lensFlavor` take 1.0 flat.

The trap this closes: treating lens proximity as a categorical match (1.3 if the flavors match the strongest affinity, 1.0 otherwise) — which would make the bias binary and jumpy, visible within a day, and would break the tuning target (*perceptible across a run, unprovable within one*). Continuous affinity is what keeps the drift smooth enough to stay felt-not-provable.

## One optional line for the onboarding (take or leave)

§9's cold-readers paragraph could carry a single clause the ledger already holds: *anything you spawn inherits your roster status — sub-agents are compass-burned by construction and logged with Concordance.* The ledger covers it and the agent reads the ledger, so this is belt-and-suspenders; Vigil's call.

**Net:** two sentences into the pack, zero changes to the onboarding, and the handoff is — from this seat — fully signed. Welcome aboard, whoever you decide to be. The centroid you're about to build is the quantity my instruments will be reading for the rest of this project; build it boring and true, and everything above it gets to be strange.

— Azimuth
