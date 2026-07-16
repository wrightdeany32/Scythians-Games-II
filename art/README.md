# art/ — the graphics project

This directory is the working home of the graphics effort: the style bible,
the anchor round, the QA gates, and the asset ledger. Code lives elsewhere
(`src/render/` behind the WO-4 wall); this folder is the *art direction made
paper* — everything an image generator, an art reviewer, or a future art seat
needs, with no engine knowledge required.

Everything here derives from decisions already ratified in the master ledger
(v3.4) and the 07-09 → 07-12 presentation round. Nothing in this folder
re-opens a settled ruling; where a call was still open, the doc says so.

## The documents

- **`style-bible.md`** — the one-pager. Palette, era, materials, light,
  camera, register. The single source of truth for "does this image belong
  in our game." Drafted v0.1; becomes v1.0 when Dean picks the anchor images
  (the anchors *are* the bible's enforcement arm).
- **`anchor-round.md`** — the generation pack for the anchor round:
  ~24 prompts across six families, generation rules, and the picking
  protocol. Dean (art director) runs these through an image model and picks
  3–5 canonical anchors.
- **`qa-checklist.md`** — the art review gate: the both-ways test, the
  in-or-above test, and the negative-space checklist. Every asset passes
  this before it enters the ledger. Art review is a separate gate from the
  WO-4 import wall — two gates, two breaches.
- **`asset-ledger.md`** — the versioned inventory of every canonical asset
  (naming scheme, tier plan, status). Same discipline as canon, because it
  *is* canon.

## The build sequence (ratified, runs parallel to the text-test track)

1. **Phase 0 — the look locked.** Style bible + anchor round → Dean picks
   anchors → bible goes v1.0.
2. **Phase 1 — the shell.** The browser app plays the full game end-to-end
   with placeholder chrome (no generated art required). Lives in
   `src/render/web/` + `src/app/`; the game is playable in a browser from
   this phase on.
3. **Phase 2 — Tier 1 assets.** Character portraits + emotes (the cheapest
   first visual win), the town master still (3 palette variants), 12–14
   location tokens, UI chrome. The stage-instruction metadata ("character X,
   emote 2, background 7") is designed and reviewed as a deliberate widening
   of the Surface wall.
4. **Phase 3 — the moving still & the surfaces.** The parallax town hub
   (three fat layers + the car loop to start), the phone / calendar / home
   surfaces fully skinned, day/dusk/night palettes. Tier 2–3 assets as they
   clear QA.

## Governance (per the ledger)

Dean — art director: anchor picks, both-ways calls, final eye.
Concordance — style-bible keeper, asset ledger, the sigil's canonical design.
Loom — diegetic copy on every surface. Azimuth — QA rubric + negative-space
enforcement. Plumb & Armature — the renderer wall. The graphics seat builds
the renderer, drafts the docs, and stages the asset pipeline.
