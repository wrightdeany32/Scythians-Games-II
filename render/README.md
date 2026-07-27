# render/ — the asset pipeline

Offline 3D rendering of game assets. Scenes are Python; assets are **build
artifacts**, regenerated deterministically from source rather than uploaded
from a chat. Nothing here runs at play time.

This folder is *not* a replacement for image generation, and it is not a
re-opening of the ratified look (Direction A, painted-wood figurines, macro
photography, shot from the overlook). It is the half of the art plan that
generation structurally cannot serve. See "the split" below.

## Why it exists

The problem this solves is **consistency, not fidelity**. A generator can
produce one excellent diorama image; it cannot produce the *same* diorama
forty times, because there is no state between generations. Each asset is a
fresh roll and the art director absorbs the variance by re-rolling.

A scene file holds state. The camera height, the aperture, the sun angle, the
paint roughness are *values* — they get reviewed, they persist, they stay put.
Three consequences the project cares about:

1. **The presentation guards become enforceable rather than agreed.** "Shot
   from within, never above" is currently a rule a human checks on every
   image. Here it is `dio.camera(..., max_height=...)`, and a scene that
   violates it fails at render time. Same shape as the ▓▓ linter.
2. **Variants are free and provably the same object.** The art plan's "town
   master, 3 palette variants" is one geometry file and three light rigs, so
   day/dusk/night are *guaranteed* to be one town rather than hoped to be.
3. **Geometry cannot come apart.** Power lines that stop short, pole spacing
   implying distances the ground doesn't have, perspective failing as
   complexity rises — the reported failure modes of the generated wides — are
   not "less likely" here. A pole is a coordinate and a wire is a curve
   between two pole-tops; the error has nowhere to live.

## The split (what goes where)

Use 3D where you need **many consistent variants of one thing**. Use
generation where you need **one beautiful thing**. Counting the actual asset
list, that line falls cleanly:

| Asset | Count | Tool | Why |
|---|---|---|---|
| **Player-vessel figurines** | ~100 (one per start) | **3D** | The ledger wants a blank figurine that *morphs*. A hundred variants of one carving is the case no generator can hold. |
| **Town master, day/dusk/night** | 1 × 3 | **3D** | Palette variants must be the same town. Also the parallax layers, which need real depth separation. |
| **Location tokens** | 12–14 | **3D** | Same town model, different cameras — each automatically consistent with the master. |
| **Character portraits + emotes** | ~20–40 fixtures | **generation** | Carved faces, chisel marks, burlap weave. Generation is genuinely better here and the existing Dale/Marie plates prove it. |
| **Hero stills** | few | **generation** | One image, maximum quality, no consistency burden. |
| **Textures** (wood grain, paint scuff, paper) | many | **generation** | The job diffusion models are best at and cheapest for. |

The honest form of the recommendation: generation was being pointed at the
hardest thing it does (consistent structure) instead of the easiest (surface).

## Layout

- `lib/dio.py` — the shared rig. One material recipe, one camera recipe, one
  render call, one light setup. Every scene imports it, so no two assets can
  disagree about the world they live in.
- `scenes/vessel.py` — the parametric player-vessel figurine.
- `scenes/town_overlook.py` — the town, from the overlook vantage.
- `out/` — rendered PNGs (gitignored; regenerate rather than commit).

## Running

Blender is used as a **Python module**, so there is no GUI and no install step
beyond pip:

```bash
pip install --target .bpylib bpy          # ~400MB, Python 3.11
PYTHONPATH=$PWD/.bpylib python3 render/scenes/town_overlook.py dusk
PYTHONPATH=$PWD/.bpylib python3 render/scenes/vessel.py
```

CPU rendering, no GPU required. Roughly 25s for a figurine and 4min for the
town at 1024×576 on this container. A GPU would cut that by ~10× but nothing
here needs one.

## The wall

**This pipeline never imports the engine.** Scenes take plain numbers. That is
deliberate: an asset pipeline able to read `GameState` would be a route around
the WO-4 surface wall, and "the renderer receives a `Surface`, never a
`GameState`" has to hold for the thing that *makes* the pictures too.

The vessel scene's parameters happen to match `BodyArchetype { height, build }`
and `portrait { skin, hair }` from `src/engine/types.ts` — but they arrive as a
plain dict from a sheet-generation step, never by importing the engine. The app
picks a pre-baked sprite; it does not render at play time.

## Current state

Rough. The geometry is primitives and the materials are procedural — no
scanned textures, no purchased models. What the current renders demonstrate is
that the *pipeline* is sound (deterministic, consistent, guard-enforced), not
that the look is finished.

The two things that close most of the remaining gap, in order:

1. **Scanned material textures** (CC0, ambientCG / Poly Haven) — real wood
   grain, paint, gravel, ground cover. The single largest quality jump
   available, and free. Flat procedural colour is the loudest "CG" tell.
2. **A low-poly building/prop pack** — skips modelling fifteen Appalachian
   houses by hand. Materials get overridden with `dio.paint` anyway, so the
   pack's own art style barely matters; what is bought is *geometry*.

Neither changes a line of the pipeline; both drop into the existing scenes.
