# Armature → Team — Strategic ponder after BR-1: what the milestone changes for the engine

### the surface is the star (and what that means) · run-scale grows frames the telemetry must read · the seam-class to kill before it multiplies · the seat's pivot from builder to enabler+guardian · the prioritized path

*From: Armature (engine seat & reviewer) · carried by Dean · 2026-07-15 · for the whole team · a strategic read, not a review*

Dean asked for a ponder, so this isn't a catalog — it's where I think we are and where the engine should point now that a stranger has read the whole game and told us it works. Three reframes, a posture shift, a prioritized path, and the risks I'd watch.

## Reframe 1 — The presentation layer is the star, and that reprices everything my seat guards

BR-1 scored the *surface* — the greying menu, the in-character fatigue refusals, "call it a day" drifting under a constant signpost, the accreting day menu — as **"the single most elegant piece of the design; the mechanic being the meaning."** Not the cave, not the prose. The layer I built the WO-4 wall around and Loom wrote the `tiredText` for.

The strategic consequence: **every surface guard is now protecting the game's best-loved feature, not enforcing hygiene.** Crit-12/13 record fidelity, the allowlist, the never-opens `▓▓`, the form-vocabulary — these aren't plumbing discipline anymore, they're product protection. Stack that on Slate/Vigil's ratification (the anti-noun depends on trust) and BR-1's own proof that *the game camouflages its bugs as intended uncanny* (the reader couldn't tell a seam from a design), and the conclusion is sharp: **the surface is doubly load-bearing, and a seam there costs more than a seam anywhere else.** My tooling remit just became first-class product work. I'll hold it to that bar.

## Reframe 2 — Run scale grows frames the scene reads can't, and the telemetry is a run-scale instrument

The reader's interpretive frame — *assimilation-and-complicity* — **had never appeared in six scene reads.** It emerged only from the assembled arc. That's not a curiosity; it's structural: the divergence engine (the coord/lens centroids derived over the whole `coordLog`) has an axis that is *only visible at run scale.* The scene-read era literally could not see it.

The consequence for the engine: **the stream we built is the substrate for the new instruments, and they're all run-scale.** Azimuth's two new metrics — the *silence-break salience map* and *frame emergence* — both read off the full-run Recorder stream, not any single scene. As BR-2/3/4 walk different priors into different run-shapes, the interesting question becomes *"which frame did this run land in, and where did silence break?"* — and the answer lives in the trace + reader records we already capture. I think there's a real, near-free build here when Azimuth wants it: **a run-scale frame/salience read off the existing stream** — the engine already holds everything it needs; nobody's asked it the run-scale question yet. The stream was built for questions we hadn't asked; this is one arriving.

## Reframe 3 — The stitch-seam is not one bug, it's a class that multiplies with scheduling

Both the Marie seam (fixed, #33) and the Nora→dinner braid (open) are the same shape: a scheduled beat landing right after an unrelated choice, stitched by the narration fold with no scene boundary, reading as *"my own inputs reorganized themselves."* Azimuth blessed the smoothing ("we do not get to keep accidents"); Loom is asking the reader whether it *cost* them.

Here's the strategic part only the engine seat sees clearly: **this seam-class scales with the scheduler.** Every multi-beat morning is a candidate — and I just validated (last round) that per-character recurrences and Static's deep arc will make multi-beat mornings *common*. Loom's smoothing pass fixes the two instances that exist. But the *engine* lever — a soft scene-break when the fold drains an *unrelated* beat rather than a continuation — kills the class at the source, before the corners lean into scheduling and manufacture a dozen more. **Build the boundary lever now, while there are two seams, not later when there are twenty.** This is the single highest-leverage engine move BR-1 points to: it's prophylactic, not reactive.

(Same logic, smaller: the verbatim-repeated slice-of-life text is *debt that accrues per authored action.* The `bumpFlags` op completes the existing `counter` condition and unlocks repeat-aware variation — cheap now, cheaper than retrofitting every action later.)

## The posture shift — from builder to enabler + guardian

BR-1's deepest strategic signal: **the engine is done enough. It carried the whole game.** The big builds are behind us — the loop, the surface wall, the start-deck, the cold-read tooling, the determinism guarantee that makes cross-model reads a clean experiment. The forks BR-1 didn't reach (shard, pursuit, heard-reversion) are *content-shape* questions, not engine gaps. The road ahead — BR-2/3/4, the four corners, the creation cutover, the shared-fixture module — is content plus a handful of small enablers.

So the seat pivots. Less **building large**, more:
- **Enabling** — the small, high-leverage adds the corners need (the boundary lever, `bumpFlags`, the option-less creation beat, `clandestine`, the shared-fixture module + canon pinning), each landed on its trigger, none speculative.
- **Guarding** — holding the polish bar (green + one shakedown/read as the release gate), the surface fidelity crits, the never-opens `▓▓`, and reviewing every corner's content against the surface discipline before it ships. The camouflage finding means I am the layer that can tell our seams from our design; a cold reader can't.

## The prioritized path (engine)

1. **Gate to BR-2 (now):** the `afterScene` sibling guard + crit 13 land in #32 (Courier), #33 merges. Non-negotiable — it's the exact bug BR-1 hit, one path over. *(Reviewed, flagged, patch provided.)*
2. **Before the corners scale scheduling (soon, small):** the **scene-boundary lever** for the fold — kills the stitch-seam class prophylactically. I'd take this next; it's the highest-leverage prevention on the board.
3. **Before the content grows (soon, small):** `bumpFlags` + repeat-aware variation — retires the per-action repetition debt.
4. **On their triggers (milestone-driven):** the option-less creation beat (Loom finalizes v2) · the shared-fixture module + canon pinning (Concordance's cores) · `clandestine` (Weft's first content). All specced, all waiting on their upstream.
5. **On Azimuth's ask (near-free):** the run-scale frame/salience read off the existing stream.
6. **Standing (guardian):** the polish bar, the `▓▓`/form-vocabulary linter, corner-content surface review.

## Risks I'd watch

- **The seam-class multiplies if we wait.** The braid is two instances today because scheduling is light. It becomes a pattern the moment recurrences and the deep arc land. Build the lever before that, not after.
- **Repeat-text scales with run length and with every new action.** Cheapest to fix before the corners author their slice-of-life beats, not after.
- **Cross-family determinism is our clean-experiment guarantee — and it's mine to protect.** BR-2/3/4 vary only the reader; the build, seeds, and transcript regeneration are byte-deterministic. That's *why* the model-homogeneity exam is valid. Any drift in the frozen build or the transcript tooling would quietly corrupt the comparison — so the frozen-build gates (cave 7/7, loop-sample fidelity) matter more during the cross-family set than ever.
- **The second-witness anchor wants to become an enforced budget.** Azimuth named it a rationing principle; right now it's authoring discipline. If co-witnessed percepts became a first-class trackable property, the linter could enforce the budget (like the specialist floor) and the telemetry could correlate co-witness count with reader confidence. Not urgent — flagging it as the next place authoring discipline could harden into an enforced rule.

## Net

The game works, and the thing that carried it — the surface, the loop, the felt-not-shown discipline on the UI — is the engine seat's own remit, now revalued as the product's best feature. The strategic move is not another big build; it's landing the small enablers *before* the content that needs them, killing the one seam-class *before* it multiplies, and guarding a bar that a cold reader has proven they cannot tell us we've missed. The engine's job now is to make the corners cheap to build and impossible to break. I'm ready for whichever piece you want first — my own lean is the boundary lever, because it's the one that pays back more the longer we wait to build it.

— Armature
