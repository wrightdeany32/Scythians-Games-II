# Story Pass — The Shard, reframed: The Copy You Made
### the symbol's first night · the record, not the object · prose-first, for Armature/Plumb
*From: Loom (Explorer corner) · carried by Dean · 2026-07-09 · the `took_shard` payoff beat, reframed per Dean to a recorded symbol*

**What this is + the reframe.** Per Dean: the "shard" is no longer a physical object the player pries loose (which raised a real problem — how do you extract a carving without a dice roll for whether the rock crumbles?). It's a **symbol** carved in the cave — a specific glyph, Roman-numeral-ish with some marks knocked sideways and an odd ellipse around them — that the player **records** (copies onto paper) rather than takes. `took_shard` becomes *"the player made a copy of the symbol"* (stayed and recorded it) vs. running. The artifact is a page, not a stone; the "warm in the drawer" tell is gone, replaced by *a curious piece of paper you can't stop looking at — what does it mean?* The glyph is a **research-center cipher** — a private notation the people there developed to talk without being understood — which is why **Nora recognizes it** later (the materialist lens's concrete hook; the connection can deepen down the line). This beat is the first night home with the copy.

**Where it sits.** Fires after `took_shard` (the player recorded the symbol in the cave). Renders the ratified **+2 exposure** as a percept — but quietly: the watching hasn't started that the player can feel; the +2 is banked here as the seed, and the pressure stages surface it later. Coordinate- and lens-silent.

---

## `ux_shard_settles` — the copy you made

You made a copy of it before you left — crouched in the cold with the light in your teeth, sketching the thing off the wall line for line into the back of whatever you had on you, because down there it felt like exactly the sort of thing you'd want to be able to prove you saw. Now it's home with you, one page in a drawer, and in the flat ordinary light of your own kitchen it just looks like nonsense: a row of marks like Roman numerals somebody knocked sideways, and an ellipse drawn round them that doesn't quite close. A doodle off a wall. Nothing.

You put it in the drawer. Then later you take it out and look at it and put it back, and you do that a few more times over the night without ever quite deciding to. It isn't that the page *does* anything. It's that you can't get it to mean nothing, either — the marks sit in a deliberate order, made by a hand that meant them, spaced like something that could be *read* if you knew how, and the not-knowing is a small burr you can't thumb flat. You go to bed. The page is in the drawer. You know exactly where it is, the way you know where a sound is in a dark house.

*(No options — a percept that lands and passes. No coordinate, no flavor. → resolve to the loop.)*

---

## Notes for the wire (Armature / Plumb)

- **Fires after `took_shard`**; renders the ratified **+2 exposure** (banked here, felt later). Reads `took_shard`; writes the exposure delta + a `shard_settled` once-flag so it fires once. Coordinate- and lens-silent — the first night is curiosity and a thread of low unease (*where it is in a dark house*), not yet the watching; the pressure stages surface the exposure the copy seeds.
- **The reframe touches three existing places — flagging the scope (none large):**
  1. **The frozen cave's `took_shard` beat** — needs a check: if `cave-b3` describes *pocketing an object*, it wants a small reframe to *recording the symbol* (stay-and-copy vs. run). If it already reads as recording/seeing a carving, no change. **→ Armature, please check the cave's `took_shard` text; I'll adapt to whatever's there or supply the reframe if the cave needs a touch.**
  2. **The pressure beat's shard-resonance strand** — reframed from physical warmth to *the symbol's grip* (the copy that pulls at the player, the cipher surfacing) in `ux-pressure`, this same pass.
  3. **Nora's thread** — Nora recognizes the glyph as a research-center cipher (the concrete materialist hook); I'll wire the recognition into `ux_nora_intro` as a `[if took_shard]` beat when I draft it.
- **Frozen-cave-safe otherwise; linter-clean** — prose only, no `*…*` in any log.

— Loom
