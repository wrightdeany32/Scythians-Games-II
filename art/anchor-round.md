# The Anchor Round — generation pack v1

**Purpose.** Generate 20–30 candidate images from the scaffold below. Dean
picks **3–5 canonical anchors** — the images every future asset is checked
against. The anchors *are* the style bible's enforcement arm; until they
exist, the bible is prose. Nothing from this round ships in the game
directly; anchors are reference, not assets.

**How to run it.** Any capable image model. Use the **base scaffold**
verbatim at the head of every prompt, then the subject line. Generate 3–4
variants per prompt family; discard freely. Never add an artist's name,
a film title, or a game title to a prompt — taste-calibrate on craft,
generate from our own words.

---

## The base scaffold (prepend to every prompt)

> A handcrafted diorama scene, carved basswood and walnut figures with
> visible toolmarks and slightly imperfect paint edges, felt and moss
> foliage, photographed as fine-art macro photography with shallow depth of
> field, warm workshop-lamp light like golden hour, muted autumn Appalachian
> palette of greens and rusts, quiet and still, no hands, no table edge, no
> workshop visible, the frame entirely inside the miniature world.

For night subjects, swap the light clause for: *"a cool blue wash of night,
one warm practical light (a porch bulb or window lamp) carrying the scene."*

---

## Prompt families

### A. The town from the overlook (the hub — 4 variants)
1. Base + "a small Appalachian town seen from a ridge-road overlook at a
   gentle high three-quarter angle, horizon visible, foreground foliage at
   eye height, a single road winding through, house windows catching late
   light, the treeline closing around the far edge of town."
2. Same, at dusk: "windows beginning to light, the ridgeline going blue."
3. Same, at night: "a handful of lit windows, one porch bulb, the woods a
   held-breath dark."
4. Same, with weather: "low cotton-batting fog pooled in the valley seams."

**Watch for:** any variant that reads as a model on a table instead of a
town from a hill — that's the in-or-above test failing; regenerate.

### B. Dale — the both-ways portrait (4 variants)
Base + "a close portrait of a carved and painted wooden figure of a man in
his mid-fifties, weathered face, work jacket, seated on the porch step of
the last house on a dead-end road, at figurine eye level, his expression
open to two readings at once — a kind man worn down by years, or a hollow
man keeping something — the paint deciding nothing."

**The pick test:** show a candidate to someone cold and ask what the man
did. If they're sure — either way — it fails. The keeper is the one that
starts an argument.

### C. Aunt Marie's kitchen (3 variants)
Base + "the warm yellow kitchen of an aunt's house rendered in miniature,
hand-painted wallpaper, a landline phone with an answering machine on the
counter, late golden light through a small window, a chair pulled slightly
out — someone was just here."

**Why it anchors:** Marie's kitchen yellow is the palette's recurring warm
accent; this image sets that exact hue.

### D. The reunion's golden yard (3 variants)
Base + "a backyard family reunion in golden hour, folding tables and
mismatched chairs, small painted figures mid-gesture around food, the yard
running up to a dark treeline that takes the frame's top edge, warmth in
front, the woods simply present behind."

**Why it anchors:** the register keystone — the life the horror needs to
erupt into. Warmth must genuinely read as warmth.

### E. The cave mouth (3 variants)
Base (night-light clause) + "the mouth of a cave in a wooded hillside past
a reservoir, rendered in carved wood and moss, reading as either an
ordinary geological feature or something subtly wrong — decided by nothing
in the frame, the darkness inside just darkness."

**Watch for:** anything overtly monstrous or glowing — that decides the
cause and fails both-ways.

### F. Material & chrome studies (4–6 variants)
1. Base + "a single tin-toy pickup truck, 1980s model, parked under a
   modern cell tower rendered in miniature — era markers layered."
2. Base + "a small carved-wood location token of a country gas station,
   the kind that would sit on a game map, paper label beneath it in a
   penciled hand."
3. Base + "a wooden card-stand holding a paper character card, blank face,
   museum-glass reflection faint in the foreground."
4. Base + "close macro of painted basswood texture, a brushstroke slightly
   over a carved line, warm lamp light" — the handmade tell, isolated.

---

## Picking protocol (Dean)

1. Kill anything failing a hard negative (hands/table/top-down/decided
   cause) before judging beauty.
2. From survivors, pick **one town, one portrait, one interior or yard,
   plus 1–2 free picks** — 3–5 total.
3. Name them into the ledger as `anchor_01`… with one line each on *why*
   (the why-lines become bible v1.0 language).
4. Note near-misses worth a re-roll; the generation seat re-runs only
   those.

## Deliverable

3–5 anchor images + their why-lines → `style-bible.md` goes v1.0 →
Tier 1 asset generation (portraits first) begins against the anchors.
