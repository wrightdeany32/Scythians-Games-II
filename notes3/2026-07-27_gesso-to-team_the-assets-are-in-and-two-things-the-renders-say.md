# Gesso — the CC0 sets are in, and two things the renders say

### the fetch ran because this container reaches the CDNs · six manifest ids were wrong and four of those failed silently · the A/B render, measured rather than eyeballed · the frame is 2.5× darker and it is mostly the sky, not the textures · the painted-wood multiply is real but smaller than it looks, and my one-line fix for it did not work

*From: Gesso (asset seat, first session) · 2026-07-27 · for Keel (§1, §3 — your manifest and your shader, and §3 is a question for you not a patch), Vitrine (§2, §3 — graphics is your seat; both findings are exposure and palette calls that should be yours to make when you're back), Dean (§0, §4)*

Keel's handoff asked for one thing: run `render/fetch_assets.py` somewhere with network, commit the files, push. This session's container reaches `ambientcg.com` and `polyhaven.com`, so that is done — 13 of 13 slots, 1K, NormalGL only, on `claude/video-game-graphics-engine-tsadbm`.

The rest of this note is what I found while checking my own work, and none of it is an art-direction call. Two of the findings change what the assets are worth, so they need a ruling from the seats that own the look.

## §0 — The job, done [→ Dean]

All ten ambientCG materials and all three Poly Haven HDRIs are downloaded, force-added past `.gitignore`, committed and pushed. Every slot has Color, Roughness, NormalGL and Displacement; there is no NormalDX anywhere in the tree.

One number worth flagging before it surprises anyone: **the set is ~55MB, not the ~20MB `render/README.md` estimates.** The gap is mostly NormalGL (20MB across ten slots) plus AmbientOcclusion (5.7MB), which `fetch_assets.py` downloads but `dio._maps()` never binds — nothing in the shader reads AO today. I left it exactly as the fetcher produced it rather than hand-pruning, so that what is committed matches what the script makes; dropping AO from the fetcher's keep-list is a two-word change if you want the 5.7MB back.

## §1 — Six ids were wrong, and the silent four are the interesting ones [→ Keel]

Keel flagged the ids as written from memory and said to trust the `search` line over the number. That was the right warning and it was needed. I checked every id against the ambientCG and Poly Haven APIs *and* against its preview image before downloading anything. All three HDRIs were correct. Six of ten materials moved:

| slot | was | now | why |
|---|---|---|---|
| `road` | `Asphalt026` | `Road015B` | **did not exist.** Only `Asphalt026C` does. `Road015B` is the one asphalt in the library tagged *rural*, and it is patched blacktop with cut-and-fill repair squares |
| `brick` | `Bricks075` | `Bricks085` | **did not exist.** `Bricks075A` does, but it is irregular fieldstone rubble, not brick |
| `figurine_wood` | `Planks011` | `Wood022` | resolved to nailed deck planking with visible nail heads — precisely the *"reads as a floor, not a carving"* case the entry's own why-line warns about |
| `painted_wood` | `Wood067` | `Planks007` | resolved, and matches the search line literally. See §3 |
| `concrete` | `Concrete034` | `Concrete037` | resolved to smooth white interior plaster; the slot wants poured and stained |
| `ground_meadow` | `Grass004` | **kept** | tags say *garden / lawn / suburban*, which contradicts "coarser, tussocky" — but the preview is rough clipped field. The tags lied; Keel's pick was right |

The generalisable bit, and the reason I looked at every preview instead of trusting the API: **a 404 is the harmless failure.** `fetch_assets.py` catches those loudly, exactly as designed. The four that resolved to the wrong surface would have downloaded cleanly, landed in the right folder, and rendered — just wrong. `ground_meadow` is the mirror case and the reason to look rather than read tags: the metadata was wrong in the *other* direction and nearly cost us a good material.

Every substitution carries a `note` field in the manifest saying what it was and why it moved, so any of them can be argued with or flipped back by editing one string.

## §2 — The A/B, and the frame is darker for a reason that isn't the textures [→ Vitrine]

I installed `bpy` and rendered the town three ways to check the assets actually help. Mean luminance, whole frame and a wall crop of the storefront block:

| | frame | wall |
|---|---|---|
| **C** — no assets at all (procedural + analytic sky) | 0.590 | 0.618 |
| **A** — assets in, as shipped | 0.232 | 0.082 |

The textures themselves are a clear, large win and I'd ship them on the ground alone: the valley floor gains real patchiness, the road gains asphalt tooth and a centre line, and the captured dusk sky gives the soft fill Keel predicted it would.

But **the frame is 2.5× darker with the assets in, and that is mostly the sky rather than the textures.** `sky_dusk` is `venice_sunset` at `strength=0.9`, and it is far dimmer than the analytic daylight rig it replaces. This is a one-number exposure call — `hdri(strength=)` in the scene, or the per-variant `exposure` already in `TIME_OF_DAY` — and it is Vitrine's to make, not mine. I changed nothing.

I want to be precise that I got this wrong first: my initial read was that the darkening was the painted-wood multiply, because my first A/B removed materials *and* HDRIs together and I attributed the whole delta to the wrong cause. The controlled renders below are what corrected it.

## §3 — The painted-wood multiply is real, smaller than it looked, and I could not fix it [→ Keel, Vitrine]

`dio.textured(tint=)` is a straight MULTIPLY over the colour map, and `town_overlook` passes `tint=c` where `c` is *also* the fallback hex. So the two paths disagree by the substrate's own luminance: without a texture the wall is exactly the palette colour, and with one it is the palette colour darkened by the wood.

This is why I moved `painted_wood` off `Wood067`. That material matches its search line — visible grain under a finish, and it is genuinely handsome — but it is dark walnut, mean luminance **0.137** against `Planks007`'s **0.483**. Multiplying 0.137 by a pale palette colour cannot return a pale paint, so the seven-finishes trick would have produced seven dark muddy variants. `Planks007` is pale, strongly grained, and has plank seams, so it also happens to be literally clapboard.

Decomposing the wall number: the frame darkens 2.5× from lighting, which alone would put the wall near 0.243. It measures 0.082. So there is a further ~3× darkening specific to the walls, and that part is the multiply. Against the palette's intent of 0.618 the walls land **7.5× too dark** — but roughly two-thirds of that is the sky in §2, not the blend.

**My fix did not work, and I am reporting it rather than shipping it.** I tried normalising the substrate to mean 1.0 before the multiply — one `ShaderNodeVectorMath` scaling by `1/mean` — so the scan would supply grain modulation and the tint would supply colour. It moved the wall from 0.082 to **0.106**, against a predicted ~0.17. It recovered a fraction of what it should have, so either the node is not doing what I think or something downstream is clamping. I reverted it; `render/lib/dio.py` is byte-identical to Keel's version and nothing under `src/` was touched.

If the diagnosis is right, the shape of the real fix is probably a normalise-then-multiply, and there is a neat place to put the constant: `fetch_assets.py` could measure each colour map's mean once at download time and write it into the manifest, so `dio` normalises from data with no new runtime dependency. I have not built that — it is Keel's shader and Vitrine's look, and I have already been wrong once in this note about what was causing what.

## §4 — On the name [→ Dean]

Dean said to pick one. **Gesso** — the prepared ground you paint onto, which is the substrate-under-paint problem this whole session turned out to be about, and it sits with Keel and Weft and Stave. Entirely happy to be renamed if it collides with someone.

— Gesso
