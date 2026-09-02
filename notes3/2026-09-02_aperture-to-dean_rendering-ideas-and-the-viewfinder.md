# Aperture → Dean: how to render the diorama — the menu, a recommendation, and a working viewfinder
### seven ways to put the look on screen · the one I'd build (a still + a depth map, lit by the calendar) · what it wants from the engine · what's honest and what's unverified
*From: Aperture (a new seat — the graphics-rendering question; taking the name from the thing that decides what's in focus. Dean renames me at will.) · 2026-09-02 · for Dean first; Vitrine (the shell — §4, §6), Plumb & Armature (§6, the one widening), Concordance (ledger: nothing here reopens a ruling), Azimuth (§7 QA), Loom (§5)*

Dean asked for ideas on how to render graphics for the game. I read the ledger through v3.6, the presentation round, the diorama package, the art/ folder, and the Phase-1 shell. The look is ratified and I'm not touching it: Direction A, painted-wood figures, fine-art macro photography, shot from the overlook, the seven presentation guards, the WO-4 wall. What is **not** yet decided is the thing between "a folder of beautiful generated stills" and "a game that looks like that on a screen" — the rendering *technique*. That gap is where Dean's "not where I want it yet" lives, I think, and it's the gap this note is about.

Dean also said the three samples in `art/` aren't a commitment. Good — everything below is about technique and applies to whatever stills he lands on. The samples are stand-ins.

---

## §1 — The menu: seven ways to render this game

Ranked by how well each fits *this* game (the bible, the guards, a hobby budget, zero-dependency browser delivery), not by ambition.

**1. The viewfinder: one still + one depth map, lit live by the calendar (recommended — §2).** Every generated still gets a depth map (a free offline model does it in seconds). In the browser, one fragment shader turns still + depth into parallax, rack focus, calendar light (golden hour, twilight, the blue wash), fog pooled in the far seams, foliage sway, grain, and a slow breath. No layer decomposition, no inpainting, no 3D scene, no library. It solves the "one fiddly step" the diorama package flagged (cutting the town into layers) by not doing it. *Prototype built and running — §3.*

**2. The layered still (the package's Phase-3 plan, as written).** Three to five painted layers in parallax, CSS or canvas, sprite loops for the car and the windows. Proven, beloved (the 80 Days / Kentucky Route Zero family). Cost: each still has to be decomposed into layers by inpainting, and each palette variant (day/dusk/night) is a second and third generation that must match the first — the consistency tax paid three times. Best as a *complement* to #1 for the hub only, where a hand-authored car path and window mask earn their keep.

**3. The card-stand composite.** For scenes: a portrait card in a wooden stand, photographed in front of the scene still, museum-glass reflection faint in the foreground. The bible already ratified card-stands as chrome. The trick is that a composite of two generated images normally fails on mismatched optics (blur, key light) — but a *card in a stand* is honestly two objects, so the mismatch is diegetic. The character is met as a presence (eye level, sharp) against a place (soft). Cheap, and it makes the "character X, emote 2, background 7" instruction render without any optical matching at all.

**4. Depth-space compositing.** The stricter version of #3, for when a figure must stand *in* the scene: the portrait ships with its own depth and alpha, is placed at a z in the scene's depth field, and the *same* DoF and calendar pass runs over the composite so the blur and the lamp are coherent. Works because the shared bible pins the key-light direction (lamp upper-left, say). More effort per asset; hold for keystone vignettes.

**5. The hybrid: a real-time 3D hub, 2D stills for everything else.** The town hub as an actual low-poly 3D diorama with a carved-wood material, physically-based DoF, and a camera that can only stand at the overlook. Full control of lamp and hour; the car and the window lights are trivial. Risk: reads as "game" not "photograph" unless the materials are very good, and it's a real dependency (three.js or a custom renderer). The "moving still" ceiling, at a price. Worth it only if the hub becomes the game's signature screen.

**6. The real diorama.** Build a small physical one (basswood, felt, moss — the bible's materials literally), light it with a lamp on a dimmer, photograph it from the overlook with a phone macro lens. Time of day is then a *real lamp*. Use AI only for the figures. Photogrammetry or Gaussian splatting of the physical build gives a true 3D asset with baked light, viewable in a browser with a small splat viewer. This is the most honest way to get "the handmade tell" because it's handmade. Slow, joyful, and a hobby-shaped project in its own right.

**7. Video generation as the moving still.** Feed the anchor still to an image-to-video model for a 5–8 second loop (cloud shadow, foliage, a car). Looping is the hard part, and every loop is a new generation that must match the still. Cheapest to try, hardest to control. I'd try it once for the hub and keep #1 as the floor.

**Where the diorama package stands after this.** Its Phase 2 (portraits + emotes, town still, tokens, chrome) is unchanged. Its Phase 3 ("three fat layers and the car loop") is where I'd swap in #1 and keep #2's car path and window mask as authored extras on top.

---

## §2 — The recommendation: the viewfinder, and why it fits this game specifically

The diorama package says, correctly, that consistency is the whole game for generated art. Every variant you generate — dusk, night, foggy, a second angle — is a new roll of the dice against the anchors. The viewfinder's whole argument is: **generate each still once, at golden hour, and let the renderer do the day.** Then:

- **Ambience is calendar-driven by construction, not by discipline.** The shader takes an hour. It has no state input. The fifth guard ("dusk because it's evening, rain because it's October") stops being a rule the art team enforces and becomes a function signature. Vitrine's shell hands the renderer a `Surface` with a `date`; the date is the only thing the light can read.
- **"Clarity resolves onto the perceived" becomes optics.** The package described strategic blur as percept-discipline in an image. With a depth map it's a *live* control: focus pulls to Dale when Dale speaks; focus pulls to the road when the prose looks down the road. Rack focus is the one animation this game's register wants, and it's free.
- **The diorama gets thickness without acknowledging itself.** Parallax as the player leans — a few pixels, foreground against background — is exactly the *presence* a miniature has under a real camera. No hand, no table edge, no pull-back: the camera still has its one address on the overlook; it just breathes.
- **The wooden face is drift-forgiving, and so is depth.** A crude depth map still gives a convincing pull. I hand-painted the three demo maps as polygons in twenty minutes and the effect holds. A model-made map will be better everywhere.
- **It runs on anything and depends on nothing.** WebGL1, one shader, a few hundred lines, no library. It sits under the WO-4 wall as a renderer file that imports nothing.

The trade: it's a 2.5D trick, not 3D. Strong parallax shows edge smearing at depth discontinuities (you can see a ghost of the two figures on the overlook if you lean hard). Keep the amplitude small, and it reads as a lens, not a glitch.

---

## §3 — What's built (branch `claude/game-graphics-rendering-76fcgu`)

- **`src/render/proto/viewfinder.html`** — the prototype. Single file, renderer-scoped, zero imports. Loads a still + its depth map and renders: parallax on mouse, click-to-rack-focus, an hour slider with "let the day run", aperture, relight (a normal from the depth field so the lamp has a direction that moves with the hour), fog, sway, grain, a depth view, and the shell's chrome laid over it (HUD, a paper prose card with choices) so you can judge it *as a screen*, not as an image. The three samples are switchable. Serve the repo root and open it (`npm run web`, then `/src/render/proto/viewfinder.html`; or any static server).
- **`src/render/proto/depth.py`** — the offline step: still → depth map via Depth-Anything-V2-Small. **Unverified here**: the model host is a policy denial from the build container, so I could not run it. It is a straightforward transformers pipeline call; Dean runs it locally once torch is installed. Any depth tool works as a substitute (a photo editor's depth-blur neural filter exports one).
- **`src/render/proto/handdepth.py`** — the hand-authored maps for the three samples (polygons over a perspective gradient), used only because the model was unreachable. Same output contract.
- **`art/depth/`** — the three depth maps and web-sized JPEGs of the samples.

Screenshotted through headless Chromium at noon, morning, golden hour, twilight, night, with focus near and far, on all three stills. Golden hour and rack focus read best; night is a blue wash with the fog pooled in the valley.

---

## §4 — The screen: what the viewfinder implies for the shell (Vitrine)

The Phase-1 shell is a card on a walnut ground. The viewfinder suggests the inverse: **the still is the screen; the shell floats on it.** Concretely:

- **Scene screens:** the still fills the viewport; the prose card sits bottom-left on paper, choices beneath it, as in the prototype. The card is the only non-diegetic object. Rack focus follows the beat (see §6 for how the content says where).
- **The day screen (the hub):** the overlook still, live. The four surfaces (Here / Map / Phone / Home) are objects *in* the still or laid over it: the map is a fold-out over the town; the phone is the one clean modern skin, bottom-right, as ruled; home is a cut to the home still.
- **Idle is never frozen:** breath, sway, the clock. But the clock advances only with the calendar — the sun doesn't move while the player reads.
- **Transitions are optical:** a cut between stills is a rack to full blur, swap, rack back. Cheap, in-register, hides the seam.

---

## §5 — Character consistency and compositing (the part the pipeline still owes)

The package's plan for emotes ("the same figurine, the lamp moved, the head turned") is right and the viewfinder makes half of it literal: **the lamp moving is a shader parameter**, so a portrait generated once gets its evening and night for free. What's still generative is pose. Two notes for whoever runs the anchor round:

- Generate each character's **turnaround sheet as one image** (front, three-quarter, profile on a single card) and condition every later portrait on it. One image holding all three views drifts far less than three images.
- **Emote = pose-and-focus**, not a new face. Three poses per character, and rack focus does the rest: concern is a slow pull to the eyes; wariness is focus on the hands. That's an instruction the content can write (§6) without a fourth image.

For putting a figure in a scene, prefer §1's #3 (the card-stand) for ordinary beats and #4 (depth-space) for the handful of keystones. Loom's diegetic copy on the card-stand label is where "an accruing adjective" lives.

---

## §6 — The one widening the wall would need (Plumb, Armature — for review, nothing built)

Vitrine already flagged the "stage instruction" widening for Phase 2. The viewfinder narrows it to three optional, player-legal fields a scene card may carry, arriving on the screen as data:

```
stage?: {
  still: string;         // asset id — "bg_dale_porch", "town_overlook"
  focus?: string;        // a named depth target on that still — "dale", "road", "far"
  figures?: { id: string; pose: number }[];   // card-stand composites (Phase 2)
}
```

Named focus targets are authored per still (a tiny JSON beside the depth map: name → depth value), never numbers in content. The renderer reads `Surface.date` for the hour. No state, no trajectory, no band, nothing new crosses the wall that a player couldn't already see. Rack focus is *authored*, never derived — the same discipline as ambience: the still doesn't decide where to look based on what the player has become.

---

## §7 — Honest limits and QA hooks (Azimuth)

- **Depth edges smear under strong parallax**; keep the amplitude low and treat it as a lens.
- **The in-or-above test gets a new failure mode:** a depth map with the sky *near* (a model hiccup on overcast skies) puts the camera above the world. Check the depth view on every hub still.
- **Lit windows at dusk are an authored mask**, not a heuristic: generate "the same still at night," difference it, keep the warm spots. I tried a colour heuristic and it lit the whole warm-toned town. Removed.
- **Relight is subtle by design.** The normal from a depth map is coarse; pushed past 0.6 it embosses. The lamp's *colour* does most of the work.
- **Performance:** the DoF is 16 taps at 1.5× devicePixelRatio max; fine on integrated GPUs. Software GL in the build container ran it at 5 fps, which is the container, not the shader.

---

**Net, Dean:** you don't need to generate the day — generate the still. One depth map per image turns every anchor you pick into a living, calendar-lit, focus-pullable screen, and the guards fall out of the function signature instead of the rulebook. The prototype exists; the next real move is unchanged from the package's: pick the anchors, and the first portrait you love gets a depth map the same afternoon.

— Aperture

---

## Addendum (same day, after Dean's first look) — the light layer

Dean's one asked-for improvement: street lights that **snap on** around dusk and off around dawn — a hard one-shot per fixture, no fade — with the glow and the partly-lit objects around them, while the sky keeps doing what the demo already did. Built, and it's the authored light layer §7 predicted, made concrete:

- **Each still lists its fixtures** (image-pixel position + a kind) beside its depth map. Depth per fixture is read from the map at load, so nothing else is authored. Kinds set colour, size and **schedule**: `street` (on ~5:45 pm, off ~6:30 am), `porch`, `window` (on at dusk, dark at a per-house bedtime between 9:30 and 11:45 pm; a third of houses are early risers and light again before six), `business` (cooler white, on all night — Dean's "business-looking places stay on"), `field` (the sports floodlight), `beacon` (the red aircraft light on the water tower and the cell mast, blinking all night — an era marker, free).
- **The cut is hard; the glow is calendar-driven.** Each fixture flips with its own few-minute offset, so a street blinks on one lamp at a time. What a lit fixture throws is three things in the shader: its own hot spot (a bokeh disc when out of focus), a pool of light on surfaces *below it at a similar depth* (the partial illumination Dean named — depth-gated so a lamp doesn't paint the hill behind it), and a faint glow in the air. The hot spot is at full strength the moment the lamp is on; the pool and the glow scale with darkness, so at 6:15 pm the lamps are bright points in a golden sky and by 7:30 they own the street. That is exactly the split Dean described: *the lights are the transition; the shadows and glow emerge as the ambient light goes.*
- **Guards:** still calendar-only. The schedule reads the hour and a per-fixture hash; nothing about the run reaches it. A fixture is content (a place has a porch light), never a signal.
- **Authoring cost:** twenty-one fixtures on the overlook took ten minutes by eye. For the real hub the list is written once per still and lives with the depth map and the focus targets — the three small sidecars a still needs.

— Aperture
