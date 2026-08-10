# Handoff — fetching the CC0 asset sets

*For whoever runs the fetch. From Keel (engine seat), 2026-07-27. Short on
purpose: this is a task brief, not an onboarding packet. If you want the
reasoning, `render/README.md` has it and
`notes3/2026-07-27_keel-to-team_the-render-pipeline-and-the-split.md` has the
argument.*

## The job

`render/` renders game assets in Blender instead of prompting them from an
image generator. It works today on procedural materials, and it looks rough
because of it. The single largest available quality jump is free scanned CC0
textures — and the session that built the pipeline **can't reach the asset
CDNs** (its environment is on `Trusted` network access, which covers package
registries and GitHub and nothing else).

So: run the fetch somewhere with network, commit the files, push. That's the
whole task.

```bash
python3 render/fetch_assets.py
```

No dependencies — pure Python stdlib, no Blender, no pip install. It reads
`render/assets/manifest.json`, downloads into `render/assets/`, and prints a
manual shopping list for anything it can't get.

## Three things that will trip you up

**1 · `git add` will silently do nothing.** `render/assets/materials` and
`render/assets/hdris` are gitignored on purpose (they're binaries and they
don't belong in history long-term). You must force it:

```bash
git add -f render/assets/materials render/assets/hdris
git commit -m "render: CC0 asset sets" && git push
```

Without `-f` the push succeeds, contains nothing, and everyone downstream
wonders why the textures didn't arrive. This is the one that gets people.

**2 · The asset IDs in the manifest are unverified.** They were written from
memory. ambientCG numbers its materials (`Wood067`, `Ground037`) and the exact
number for a given look is not something to take on trust. **Every entry has a
`search` line describing what actually matters — trust that over the number.**
If the fetcher 404s, that's a wrong id, not a broken site: open the page, pick
whatever matches the description, and drop the files in the same slot folder.
Slot names are what the shader binds to; ids are just how we found them.

**3 · Push somewhere reachable.** Branch `claude/dark-rpg-project-review-pltanx`
or `main` both work. Any branch is fetchable — just say which.

## Layout the shader expects

```
render/assets/materials/<slot>/    Color, Roughness, NormalGL, Displacement
render/assets/hdris/<slot>/        one .hdr
```

`<slot>` is the `slot` field in the manifest (`painted_wood`, `ground_grass`,
`road`, …) — **not** the ambientCG id. Keep **NormalGL**, not NormalDX: Blender
uses the OpenGL green-channel convention, and the DirectX map inverts lighting
subtly enough to ship by accident.

## If you're short on time

Get **one**: the `painted_wood` slot — *"wood, visible grain under a finish."*
It tints seven ways into every painted surface in the town (real grain
underneath, our palette on top), and it's the specific thing that stops painted
wood reading as plastic. One material is enough to tell Dean whether this
direction is worth the rest.

## Don't

Change anything under `src/`. The engine seats own that, and this task doesn't
touch it. `render/` never imports the engine either — an asset tool that could
read `GameState` would be a way around the WO-4 surface wall, and that has to
hold for the thing that makes the pictures too.

— Keel
