# Keel — the render pipeline, and the split it implies
### the generated plates are good and the bottleneck was never fidelity · what a scene file holds that a prompt cannot · the camera guard as an assertion · the asset list divided by which tool each half actually suits · and what's rough, said plainly
*From: Keel (engine seat) · 2026-07-27 · for Dean (§0, §5 — the two purchases and the one call), Vitrine (§1–4 — this is your seat's ground and you should overrule me freely when you're caught up), Concordance (§3 — the guard becomes mechanical, so the ledger claim can name its enforcer), Vigil (§3), Loom, the team*

Dean brought me a working problem rather than a design question: the diorama direction has been generated through Gemini and Midjourney, the results are good, and the process is *tedious*. He asked what tools would let us build something in-house, even at much lower fidelity. This note is the answer, a working pipeline landed in `render/`, and one recommendation that is narrower than "build it in 3D."

**Vitrine owns graphics.** They're on a Fable model and Dean is rationing that usage, so I picked this up on his word with the explicit plan of catching Vitrine up rather than replacing them. Nothing here re-opens the ratified look — Direction A, painted-wood figurines, macro photography, the overlook camera, paint-the-vessel — and nothing here reads as a call I'm entitled to make on the art direction.

## §0 — The first finding: the plates are good, and the bottleneck is not fidelity
Dean's three reference images (`art/`) are strong work. The Dale plate in particular — chisel marks in the hair, burlap weave in the jacket, the eyes painted rather than modelled — is better than anything this pipeline will produce for a character close-up in the foreseeable future, and I want that on the record before anything below reads as a pitch to replace it.

The tell in how the problem was described is that the word was **tedious**, not *ugly*. Tedium is the signature of fighting non-determinism. A generator holds no state between generations: every asset is a fresh roll, matching is done by re-rolling, and the art director absorbs the variance personally. That cost does not fall as the models improve, because it isn't a fidelity problem — which is also why "the technology may not be there yet" is, I think, the wrong diagnosis of a real frustration.

The second tell is *which* errors he reported: power lines that don't extend far enough for the depth they cross, two light poles implying miles the ground doesn't have, perspective coming apart as prompt complexity rises. Every one of those is a **geometry and consistency** failure. None of them is a surface failure. That distinction turns out to be the whole design of the fix.

## §1 — What a scene file has that a prompt does not: state
A diorama is literally a 3D scene, which makes this the one art direction where the expensive-looking path is the cheap one. Build the scene once and the camera, the lights, and the materials are free forever after.

`render/` is that, running: **Blender driven headless as a Python module** — free, no GUI, `pip install bpy`, CPU-only, no GPU anywhere in the loop. A figurine renders in ~25 seconds and the town in ~4 minutes on this container.

The thing a scene file holds is *values that persist*. Camera height, aperture, sun elevation, paint roughness — reviewable, versioned, and they **stay put**. Concretely: when Dean says "warmer, lower, less contrast," that becomes three numbers that then apply to every asset the project ever renders. Today the same instruction costs a re-roll and buys no guarantee about the next image.

## §2 — Two things worth knowing, because they're counter-intuitive
**The miniature illusion is one number.** What makes an eye read "a small object photographed close" rather than "a large scene rendered" is a shallow aperture at short range — the tilt-shift effect. In `dio.camera` it is `fstop`, it lives in one shared function, and it is therefore *identical on every asset forever*. It is not an art skill and it does not need one.

**The unifier is material, not shape.** Applying one matte, faintly-fibrous painted recipe to every surface is what makes a pile of unrelated geometry read as a single hand-built object. A crude form in a consistent material reads as *carved*; a good form in an inconsistent one reads as *CG*. This is also why a purchased asset pack's own art style barely matters — we override its materials on import and keep only its geometry.

## §3 — The camera guard, promoted from a review note to an assertion [→ Concordance, Vigil]
The presentation guards currently hold because a human checks each image. One of them can stop needing that. `dio.camera(..., max_height=...)` raises `CameraGuardError` at render time when the camera floats above the world — so *shot from within, never above* fails the build rather than fails review. Same shape as the never-opens-▓▓ linter, and the ledger claim can name its enforcer instead of being [ASSERTED].

The other guards stay human: the both-ways test, the-mismatch-is-never-illustrated, and the-diorama-never-acknowledges-itself are all semantic, and building false machinery for them would be worse than the checklist. One guard mechanised, six honestly left to the eye.

The palette variants are a related free win. The plan wants a town master in three palettes; here that is one geometry file and three light rigs, so day / dusk / night are **guaranteed to be the same town** rather than hoped to be. The parallax layers Phase 3 asks for need real depth separation, which a flat generated plate cannot provide and a scene gives away.

## §4 — The split, and it is narrower than "build it in 3D"
Having built both halves, the honest recommendation is a division, not a replacement. **Use 3D where you need many consistent variants of one thing; use generation where you need one beautiful thing.** Counting the real asset list, the line falls cleanly:

| Asset | Count | Tool |
|---|---|---|
| Player-vessel figurines | ~100, one per start | **3D** — a hundred variants of one carving is the case no generator can hold |
| Town master, day/dusk/night | 1 × 3 | **3D** — variants must provably be one town; parallax needs real depth |
| Location tokens | 12–14 | **3D** — same model, different cameras, consistent by construction |
| Character portraits + emotes | ~20–40 fixtures | **generation** — carved faces and fabric; the Dale plate settles it |
| Hero stills | few | **generation** — one image, max quality, no consistency burden |
| Textures (grain, scuff, paper) | many | **generation** — the cheapest thing diffusion does well |

The player-vessel is the strongest single case and it's already half-built: the ledger's *paint the player-vessel (a blank figurine morphs)* is ~100 variants of one object, and `src/engine/types.ts` **already carries the parameters** — `BodyArchetype { height, build }` and `portrait { skin, hair }`. The figurine scene renders straight off that shape. (It takes them as a plain dict; the pipeline never imports the engine, because an asset tool that could read `GameState` would be a route around the WO-4 wall.)

So the frustration has a one-line diagnosis: **generation was pointed at the hardest thing it does — consistent structure — instead of the easiest, which is surface.** Inverting that keeps the plates Dean already likes and removes the re-rolling.

## §5 — What's rough, and the two things that close most of it [→ Dean]
Said plainly, because the ledger convention cuts both ways: **the current renders are rough.** Primitive geometry, procedural materials, no scanned textures, no purchased models. They demonstrate the *pipeline* is sound — deterministic, consistent, guard-enforced, four minutes a frame — not that the look is finished. The town reads as a town; it does not yet read as Dean's reference, and it won't until the two items below land. I spent a stretch of tuning that stopped paying, which is itself the finding: the remaining gap is not in the numbers I can turn.

Two purchases, in order of leverage:
1. **Scanned CC0 material textures** (ambientCG, Poly Haven) — real wood grain, paint, gravel, ground cover, plus captured lighting environments. **Free**, and the largest single quality jump available. Flat procedural colour is the loudest CG tell in every frame above.
2. **A low-poly building and prop pack** (~$20–60) — skips hand-modelling fifteen Appalachian houses. Materials get overridden anyway, so what's bought is geometry alone.

Neither changes a line of the pipeline; both drop into the existing scenes.

**The one call I'd like from Dean:** whether the town's remaining fidelity gap is worth closing at all, or whether the right answer is that his *generated* town plate is already the town master (it's one asset, and it's good), with 3D taking only the jobs where count and consistency bite — the ~100 vessels, the palette variants, the location tokens. That's a genuinely open question and it's his to answer, not mine.

## Net
The plates are good and the bottleneck was consistency, not fidelity — which is why better image models wouldn't have fixed it. A scene file holds the state a prompt cannot, so the miniature effect becomes one shared number, the palette variants become provably one town, and the overlook guard becomes an assertion that fails the build instead of a note that fails review. The split that falls out is narrower than replacing generation: 3D takes the many-variants-of-one-object work (~100 vessels, the town's variants and tokens), generation keeps the one-beautiful-thing work (faces, hero plates, textures) that the Dale plate proves it's better at. The pipeline is landed and running in `render/`; the look is rough and honestly labelled, and the two things that close most of the gap are one free download and one small purchase. Vitrine — this is your ground, and I've tried to leave every ratified call exactly where I found it; overrule me freely when you're caught up.

— Keel
