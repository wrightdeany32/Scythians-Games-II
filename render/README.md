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
| **Player-vessel figurines** | one per start (**1 today**, ~100 planned) | **3D** | Many variants of one carving, each staying recognisably the same object. That is the case no generator can hold — and the only one where the count is the whole argument. |
| **Town master, day/dusk/night** | 1 × 3 | **3D** | Palette variants must be the same town. Also the parallax layers, which need real depth separation. |
| **Location tokens** | 12–14 | **3D** | Same town model, different cameras — each automatically consistent with the master. |
| **Character portraits + emotes** | ~20–40 fixtures | **generation** | Carved faces, chisel marks, burlap weave. Generation is genuinely better here and the existing Dale/Marie plates prove it. |
| **Hero stills** | few | **generation** | One image, maximum quality, no consistency burden. |
| **Textures** (wood grain, paint scuff, paper) | many | **generation** | The job diffusion models are best at and cheapest for. |

The honest form of the recommendation: generation was being pointed at the
hardest thing it does (consistent structure) instead of the easiest (surface).

**Two corrections to an earlier version of this table, both caught by Gesso and
both verified against the repo:**

*The count.* `src/content/explorer/index.ts` ships **one** start
(`start_explorer_reunion`, "the deck's fallback"). The ~100 in the ledger is the
plan, not the state, and every character created today gets an identical
figurine — `portrait` is hardcoded at `engine.ts:863` and all 24 `newGame` call
sites pass `body: {height: 0.5, build: 0.5}`. So the honest size of the vessel
job right now is **one figurine**, and the thing to build is the airlock that
lets it scale with the content rather than a hundred sprites nothing asks for.

*The warrant.* This table used to cite the ledger's "PAINT the player-vessel (a
blank figurine morphs)" as a request for a figurine that morphs. **It is the
opposite.** Static's original
(`notes2/2026-07-11_static-to-team_paranormal-corner-and-round-takes.md`) reads:
*"instructing the generator to keep a figurine blank makes it morph the shape
(chess-piece drift) — a blank figure gives the model nothing to hold — while a
painted figure stays stable. So paint them."* "Morphs" names a **diffusion
defect**; painting is the **fix**. Ledger v3_4 recorded it in full and v3.5/v3.6
compressed it to the parenthetical this pipeline then misread.

The consequence is worth stating because it cuts against this folder's own
case: for a parametric mesh the finding is **moot**. A blank 3D figurine cannot
drift — there is no model to give nothing to hold. The ratified look still says
paint the vessel, on Direction A grounds (painted wood, macro photography), and
those grounds are good. They are simply not this one, and `render/` should not
have been leaning on it.

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

## Assets (textures and skies)

`render/assets/manifest.json` lists the CC0 material and HDRI sets the scenes
want. **The binaries are not committed** — a 2K PBR set is 5–15MB and ten of
them would dwarf the repo — so the manifest is the source of truth and
`render/assets/<kind>/<slot>/` is gitignored.

```bash
python3 render/fetch_assets.py           # download whatever is missing
python3 render/fetch_assets.py --list    # print the shopping list instead
```

Everything is CC0: public domain, no attribution, no licence file to track.

**Nothing here is a prerequisite.** Every surface goes through
`dio.textured(name, slot, fallback_hex, ...)`, which uses a scanned set when
one is present and the procedural recipe when it isn't. The scenes render on a
clean checkout with no assets at all; the textures are an upgrade that switches
itself on. Same for skies via `dio.hdri(slot)`.

One trick worth knowing: `textured(..., tint=)` multiplies a scanned colour
map, so **one** scanned wood serves as all seven painted wall finishes — real
grain and wear underneath, our palette on top. That is why a single download is
worth more than seven authored colours, and it is the specific thing that makes
"painted wood" stop reading as plastic.

### If the download is blocked

The asset CDNs may be outside this environment's network policy (they were
when this was written; `fetch_assets.py` detects it and prints the manual
list). The hosts to allow are:

```
ambientcg.com
acg-download.struffelproductions.com     # where ambientCG's zips actually serve from
polyhaven.com
api.polyhaven.com
dl.polyhaven.org
```

Network access is an *environment* setting, not a repo one — see
https://code.claude.com/docs/en/claude-code-on-the-web. A container generally
has to restart to pick up a policy change.

Two things worth knowing about that policy:

* It is read when the **container starts**, so changing it does not reach a
  session already running — open a new one.
* It has nothing to do with Claude Code's `/permissions`, which govern *tool*
  calls (Bash, Edit) rather than network egress. Different layer entirely, and
  the desktop app is only a window onto the same remote container, so switching
  interfaces changes nothing.

### Fetching from your own machine instead

`fetch_assets.py` has **no dependencies** — pure stdlib, no Blender, no pip
install — so it runs anywhere Python 3 does. That makes this the fastest
unblock when the sandbox can't reach the CDNs:

```bash
python3 render/fetch_assets.py            # on your machine; ~20MB at 1K
git add -f render/assets/materials render/assets/hdris   # -f: they're gitignored
git commit -m "render: CC0 asset sets" && git push
```

`-f` is needed because the directories are deliberately gitignored. At 1K the
whole set is ~20MB, which is a tolerable one-time commit; strip it back out
later with `git rm -r --cached` once the environment can fetch them directly.

Failing all that, downloading by hand and dropping the folders in place works
identically; `--list` prints exactly what and where.

## Current state

Rough. The geometry is primitives and the materials are procedural — no
scanned textures, no purchased models. What the current renders demonstrate is
that the *pipeline* is sound (deterministic, consistent, guard-enforced), not
that the look is finished.

The two things that close most of the remaining gap, in order:

1. **Scanned material textures** (CC0, ambientCG / Poly Haven) — real wood
   grain, paint, gravel, ground cover, plus captured skies. The single largest
   quality jump available, and free. Flat procedural colour is the loudest "CG"
   tell. The manifest, the fetcher and the shader support are all in place;
   only the files are missing.
2. **A low-poly building/prop pack** — skips modelling fifteen Appalachian
   houses by hand. Materials get overridden with `dio.paint` anyway, so the
   pack's own art style barely matters; what is bought is *geometry*.

Neither changes a line of the pipeline; both drop into the existing scenes.
