# The Box Under the Hood
### decks-within-decks, doors, and the cameo layer — Dean's board-game model, mapped onto the machine we already built
*From: Azimuth (council / adviser — cross-corner concepts & instrumentation) · carried by Dean · 2026-07-03 · for Dean, Vigil, Loom, Armature, Slate, Concordance*

Dean described the game as **a board game under the hood: a deck of cards, where some cards each represent decks** — character cards as entry points in an overarching deck; engaging Reese or Nora opens the parts of *their* deck that aren't in the overworld; occupations and a map so you meet people where their lives actually happen. This document does three things: shows that this is the engine's **native shape** (almost nothing is missing), formalizes the model so we all say the same words, and stages the build path so that **nothing touches the Batch A freeze.**

---

## §1 · The vision, mapped onto what exists

| Dean's board-game element | What it already is in the machine |
|---|---|
| The overarching deck | The tag axis — `deck:mundane` and friends, deck-scoped weighted draw, built in Batch 1 of the fork |
| A card that *represents a deck* | A card whose outcome sets a flag (`thread_reese`) that other cards `require` — the cave entry works exactly this way today |
| "Opening up parts of the deck" | Flag-gated eligibility — live since the first conversion |
| The cave storyline "attached to" Reese's card | The queue — `queueEvent` / `nextQueuedEvent`, the chained-scene primitive Armature just made first-class |
| The dice | The d20 resolver, with world-constant targets and creation-seeded stats ("tune the person, not the rock") |
| The map menu | A renderer over the actions layer — presentation, not engine |
| Turns, timers | The daily loop, expirations, the clock verbs |

The vision is roughly eighty percent built. What's genuinely new is a **name for the pattern**, one **cross-membership convention**, one **craft rule**, and — eventually, post-A — one **small engine affordance.**

## §2 · The model, formalized

**Fixture decks.** One deck per load-bearing person, place, or thread: `deck:reese`, `deck:nora`, `deck:whites_hall`, `deck:hospital`, `deck:wake`. Each has a **mount flag**; mounting adds its cards to the world's live pool.

**Doors.** A deck opens through a door, and there are exactly two kinds — this duality *is* Dean's organic feel:
- **Sought doors** — map actions. You went to the hospital; the hospital's rim is now in your world.
- **Met doors** — drawn cards. Reese texts about a cave. A cameo in the diner turns out to be the surgeon. The world came to *you*.

**Rings within decks.** Mounting exposes a deck's **rim**, never its depths — the tier machinery (`setTier`, ring gates) operates *inside* each deck. The rim of `deck:nora` is coffee and family gossip; Ellen is core-ring, several doors deeper. **Doors within doors:** deep cards of one deck are themselves doors into others — Nora's photograph is a core-ish card of her deck *and* a door back into White's Hall's second ring. Dean's "finding out more about the Ellen story" is exactly this: Ellen isn't a card you draw, she's a depth you reach.

**Cross-membership — the cameo layer.** This is the occupations idea systematized, and mechanically it's *free*: **a card can carry two deck tags.** The surgeon has his own thin deck, and his cameo card is *also* tagged into `deck:hospital` — so players who frequent the hospital meet him at work before they've ever pulled his thread. It's the tendril anatomy generalized from "deep fixture surfacing shallow" to "any fixture surfacing where life would put it." Cameos obey tendril discipline: texture until engaged, noticing is a reply, never a gate.

**The phone is the hand.** The geometry doc's replay loop already leans on a contacts surface, and it solves the model's one UI question perfectly: the player's visible index is **people they've met, not content remaining.** A phone full of contacts is diegetically invisible — everyone has one — and playing a hand card (call Nora, visit Doug) is a sought door. Run 3's "talk to someone I didn't last time" becomes literal: a card in your hand you never played.

## §3 · The unification — a deck *is* a dome **[read → Vigil]**

The one genuinely new synthesis in this document: **Dean's decks-within-decks and the dome-cluster composition principle are the same structure seen twice.** A dome was defined as a cluster of related content around a fixture, proximity-weighted at the `drawWeight` chokepoint. A fixture deck is *exactly that cluster*, given a mount flag and doors. So when the composition layer eventually builds, it doesn't need a new unit — **decks carry the coordinates**, and proximity weighting operates over mounted decks. One structure, one registry, and Armature's factored `drawWeight` seam was already waiting for it: `weight × proximity × lensBias`, per the Batch 3 contract, each factor switchable.

This also snaps into the geometry doc's reciprocity principle: **one fixture, one deck, many doors.** The cult deck's Explorer door is a cave. Its Paranormal door is a political network. Deck contents stay corner-agnostic; the lens and the band-select flavor the rendering. Authoring cost stays flat while the world gains faces.

## §4 · The guardrails — one new rule, three inherited disciplines

**The no-card-catalog rule (new — proposed as the sibling of the no-truth-state invariant).** *Decks are felt, never shown.* No deck names in UI, no "Reese: 4/12," no completion meters, no unlock toasts — ever. A visible content inventory is a **truth-state for structure**: it tells the player exactly how much world remains, which murders both the unfalsifiable discipline and the organic feel Dean is chasing. The only legitimate deck-awareness is the felt kind — *there seems to be more to Nora* — plus the diegetic phone. The map shows **places you know about**, never content availability. [Q→Vigil to ratify; Concordance to log beside the no-truth-state invariant.]

Inherited, restated for deck-scale: cameos obey **frugality and noise**; **mounting ≠ depth** (rings still gate inward); doors are **earned or encountered, never listed.**

## §5 · The authoring assets

- **The person × place index [→ Concordance].** A ledger register: each named character's occupation, haunts, and plausible hours. Not engine data — an *authoring* index. Whoever writes the diner deck consults it: who might be here on a weekday morning? This is how occupations stay canon-consistent as the cast grows, and it's squarely the librarian's kind of table.
- **The fixture-deck anatomy [→ Loom, when relevant — nothing owed now].** When a deck gets authored, it wants: its door(s) — at least one sought and ideally one met; a rim of three-to-five texture cards; ring gates inward; one or two tendrils *out* (its cards appearing in other decks); and its coordinate, for the registry later. The cave content already fits this shape retroactively — `deck:whites_hall` with the Reese action as its sought door — which is the best evidence the model describes what we build rather than prescribing something new.

## §6 · The build path — staged so Batch A feels nothing

- **Now: zero engine work, zero content work.** Everything above is expressible today by convention (deck tags + mount flags + `requires`). The freeze holds; nothing here goes near `cave-b2`.
- **Post-A, the one small ask (pre-drafted for the Armature note):** a **deck registry** — `decks: [{id, mountFlag?, coord?}]` — with the daily draw composing from the **union of mounted decks.** What it buys: authors stop repeating the mount gate on every card; the dome/proximity layer gets its unit for free; telemetry can report per-deck exposure (which decks does a natural run actually live in?). Small, additive, and it rides the chokepoints Armature already factored for exactly this.
- **Later, when content justifies them:** the map renderer (sought doors as a surface), the phone/contacts surface (the hand), coordinates on decks feeding the Batch-3-family composition.

## §7 · Lot items **[→ Slate]**

Two sprouts, parked at might-use: **haunts-by-time** — occupations imply light schedules (the diner's morning regulars vs. its night crowd), ridable on the clock verbs someday, pure texture; and **corner-skinned surfaces** — the same registry rendered as *places* for the Explorer, *case files* for the Detective, *sightings* for the Paranormal — one structure, four skins, reciprocity applied to UI. Both are post-content by definition.

---

**Net.** The board game was always under the hood — the fork inherited a deck engine, and the project has been quietly authoring toward this shape since the first flag. What Dean's session adds is the *name*, the cameo layer, the phone-as-hand, and the deck-dome unification — for the price of one convention, one craft rule, one ledger table, and one small post-A registry. The stranger walks into the cave first; the box gets its labels after.

— Azimuth
