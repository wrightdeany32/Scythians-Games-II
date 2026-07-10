# Concordance — graphics direction & the image model
### the diorama-as-thesis, the two candidate directions, and the disciplines the art must satisfy — raw material for the style bible
*Kept by: Concordance (librarian) · 2026-07-09 · for Dean, and the team's graphics takes; Azimuth (style-bible), Vigil, Loom, Plumb, Armature cc*

A capture of Dean's graphics brainstorm, structured for the style-bible decision and the team's input. **The art-direction *choice* is Dean's and the team's; what this seat holds is the thesis the art can carry and the disciplines it must satisfy** — the direction is open (two strong candidates below, and Dean is open to a third). This complements the five presentation guards (which are art-agnostic — §7). Not a ruling; a resource.

---

## §1 — The thesis: the diorama is the theme made visible
The art can carry the game's deepest layer *visually*, which the prose is forbidden to state. A **diorama** — a constructed, staged scene of stand-ins, viewed and handled from *outside* — is, at once: the **anti-noun** (nothing is what it appears), the **roots-are-the-player keystone** (a small world manipulated from above by someone the world can't perceive — literally the player's relationship to the game), and the **vessels** (figures that are stand-ins, not the real thing). So the look isn't decoration — it's the cosmology rendered as a medium, and it can seed the meta-layer **felt-but-never-stated**. Both candidate directions below share this DNA: *a diorama viewed from outside.*

## §2 — THE OVERRIDING GUARD: the art subverts, but never reveals
Percept-never-cause, at the image level, and it governs **both** directions and **every** asset. The image shows what is *perceived*, ambiguously — Dale's portrait reads **both ways at once** (weathered-kind or hollow-guilty, depending on what the player brought to him), the cave reads wrongness-or-nothing — and it **never confirms the cause**: never draws Dale as guilty, never draws the cult as supernatural, never lets the picture adjudicate what the prose refuses to. The art can be as uncanny and staged as it likes and should reward the deep player's unease, but it stays a **seam that implies** (like the ▓▓), never a **reveal that confirms**. *This is the single most important art constraint; a look that visually decides breaches the anti-noun the whole game is built on.*

## §3 — The two candidate directions (one or the other — Dean's / the team's call)
Each is an internally-unified aesthetic world; the town-view and the character-view match within a direction. Both serve §1; they differ in **medium**, not thesis.

**Direction A — the diorama world (painted-wood figurines).** The town is a handcrafted diorama; characters are wooden/painted **figurines**, rendered as fine art photography — strategic depth-of-field (background soft, clarity resolving onto the character) and figurine-glow (the *almost-magical, not-quite-a-real-person* quality a figurine has under light and a human doesn't).
- *Serves the theme:* the medium **is** the thesis — staged stand-ins handled from outside — and the figurine's "not quite real" quality seeds the vessels most naturally; the strategic blur *is* percept-discipline in an image (clarity on the perceived, softness on the cause). Visually distinctive and pleasant (the craftsmanship appeal Dean named).
- *Feasibility/ceiling:* the town-as-a-moving-still is a **layered diorama photo** (parallax + light animation, cheap per Azimuth); multi-character events are composited figurine photos; the look is more **bespoke** (each figurine-photo wants care to read handcrafted) — generatable with AI figurine-photography, but it lives or dies on a **tight style bible**.

**Direction B — the isometric sim (SimCity-2000 + PS2-era models).** The town is a **SimCity-2000 isometric city** — zoomable, buildings-as-locations, little **decorative** people and cars on scripted paths (no simulation); character events use **PS2-era 3D character models** (Metal Gear Solid 2 / Resident Evil 3 register).
- *Serves the theme:* an isometric town **is** a diorama-from-above; the retro-3D register is nostalgic, coherent, and ages well; the decorative town is charming and cheap (scripted paths, **no tracked state**).
- *Feasibility/ceiling:* PS2-era models read a touch more as "game characters" than as "not-quite-real stand-ins," so the meta-seed is **subtler** than the figurine's; the isometric town wants more building-asset variety than a single diorama photo.

**For the decision (offered, not ruled):** both satisfy §2 if the assets read-both-ways. **A** seeds the *"these aren't the real thing"* meta-layer most naturally (the figurine's uncanny staged quality); **B** does the *"little followable world"* most naturally (the zoomable town, the recognizable models). Either is coherent, and a third alternative is fine so long as it keeps the **diorama-viewed-from-outside** DNA (§1) and the **subvert-never-reveal** guard (§2).

## §4 — The asset-library + composition model (works for either direction)
Dean's image-math is the right shape, and the ceiling isn't where the cost lives. It's a **bounded asset library** plus a per-scene **composition**:
- **Per character:** one **portrait** + a few **numbered emotes** (e.g., a set of four: portrait + three emotes).
- **Shared:** a library of **~10 backgrounds**.
- **An event's visuals = an instruction** — *character X, emote 2, background 7* — which is exactly "writing a scene by telling the engine which images to show." **Cheap because there is no new image per event**; every scene composites from the library.
- **Multi-character scenes supported** (Dean's intent — events with more than two): a scene composites **1..N** character-images onto a background. The variables the engine tracks per scene are just **who's on screen (1..N), each one's emote, the background** — bounded, not a moving-parts explosion.
- Generic cards carry an ambient image or none; character events composite from the library. Same **generativity win as fixture-reuse**, one layer up: author a small library once, compose many distinct scene-images from it.

## §5 — The map: the moving-still hub, and the reconciliation
The map is the **hub** between all locations (the mausoleum, graveyard, gym, diner, research center, …). Dean's *all-locations-from-the-start* insight collides with an earlier ruling (Azimuth: *icons appear as places become known, as a quiet reward*) — and both are right; they reconcile on **three rules**:
1. **Ambient geography is pre-placed** (Dean) — places that just *exist* and anyone living there would know (the graveyard, gym, diner, mausoleum) are on the map from the start, **no quest markers**, so a location used for the first time in week three doesn't telegraph "incoming mission." *(This is mundane-as-camouflage applied to the map — the knife principle: pre-placed, so it hides in plain sight.)*
2. **Genuinely hidden locations reveal on discovery** (Azimuth) — a place the player couldn't already know (a private research center Nora names) appears when discovered, keeping the reveal-reward.
3. **The map never shows content-availability** (no-catalog) — no "go here," no active-mission marker, no quest icon; it shows known geography, never content remaining.
→ **Refined map guard routed to Vigil & Azimuth for blessing.** Ambient-from-the-start + discovered-reveal + content-never-shown — all three hold.

## §6 — The registers connection
Each character's canonical **portrait + emotes live in the fixture register**, beside that character's coordinate — so the register is the **single source of truth for what a fixture *is* (mechanically) and what it *looks like*.** Reciprocity-aligned: the same Dale portrait appears wherever Dale appears, across every corner. The composition model (§4) is the reuse-engine applied to images. When the corners grow, a new corner's cast that reuses a shared fixture reuses its image, too.

## §7 — The engine separation + the presentation guards (art-agnostic — apply to either direction)
The graphics engine is **separate** from the game engine — and that separation is a feature: it lives behind the **WO-4 import-allowlist** wall and can render only what the allowlist hands it — *what you have, who's in your life, where you are* — **never the trajectory** (the diamond centroid / lens / `attune` have **no accessor** the renderer can reach; Armature's structural guarantee). So the presentation layer can be as rich as either direction wants and **cannot leak the game's hand by construction.** The **five presentation guards** apply to whichever look wins:
- **The circle** — felt presence (a photo on the fridge, a coat by the door, appearing and receding), never a scored/ranked panel.
- **The home** — qualitative, derived-on-read (the string-wall, the dishes), never the position it's derived from.
- **Character cards** — faces, not dossiers (a face, a name, an accruing adjective), never a stats panel or a "true nature" line.
- **The "you" surface** — what you *have* (money, energy, the page, the research), never who you're *becoming*.
- **The ambience** — calendar-driven (dusk because it's evening, rain because it's October), never state-driven, so the skyline never becomes a mood meter.
- **(New — the map, §5)** — ambient geography pre-placed, hidden places revealed on discovery, content-availability never shown.

## §8 — The path (Azimuth's, direction-agnostic)
**Style bible (one page — palette, era, light, register: the A-vs-B decision lands here)** → **the phone content job** (Loom's, ready, front-runs the visuals — mock texts read great even in a text UI) → **portraits** (the cheapest first visual win, and where a character's register-image is authored) → **the surfaces build under WO-4**, after the current text-only test sequence (the prose is what's being tested; the protocol already anticipated a later UI-read).

## §9 — Open decisions
- **Direction A vs B vs a third** — the core call, for the style bible (Dean + team). This doc frames both; the disciplines (§2, §7) bind whichever wins.
- **The refined map guard** (§5) — Vigil / Azimuth blessing.
- **The style-bible register** — painted-figurine warmth vs. retro-isometric, and the light/palette/era that unify a town shot with N portraits.
- Whatever the team's graphics takes surface — this is one input, not the final word.

**Net:** the diorama is the theme made visible; the art subverts but never reveals; two coherent directions share that DNA and either can carry it; the image model is a bounded library plus composition that scales to multi-character scenes; the map reconciles ambient-from-the-start with reveal-on-discovery and no-catalog; the images live in the fixture register; and the whole surface sits behind the WO-4 wall, rich but unable to leak. The choice is yours and the team's — this is the ground it stands on.

— Concordance
