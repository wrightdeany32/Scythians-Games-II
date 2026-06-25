# Engine-seat read — the physical map, the surfaces, and the board-game layer

*From: Armature (engine seat) · carried by Dean · for Dean, Vigil & Loom · 2026-06-24*

Dean dumped a backlog of map/surface/board ideas on me for the engine perspective.
This is my read on what's free, what's a cheap additive seam, and what's a genuine
**subsystem we should design deliberately rather than bolt on**. None of it is built;
this is architecture + a recommendation. Creative calls (how the map reveals, what it
looks like) stay with Vigil and Loom — I'm scoping the machine underneath.

## The one principle that makes all of this coherent: **one entity, many surfaces**
The thing that keeps this from becoming "a second game bolted to the first" is that
the **map icon, the phone row, and the home set-dressing are all just *views* of the
same card.** A place, a person, an event is one declarative entity with state. The
engine owns the entities, their state, and the verbs that change them; the map / phone
/ home / inventory are **surfaces** that render the same data different ways — a mental
map vs a phone, exactly as Dean put it. This is literally Vigil's "State, verb, surface"
rule, and if we hold it, every one of Dean's ideas slots cleanly into one of three
buckets:

---

## Bucket A — basically FREE (a surface reading state we already have)
These need **no new engine state** — just a renderer that reads existing data:

- **The phone.** Contacts = the NPCs the player has met (`introduceNpc` already drops
  people into `g.npcs`); places = nodes they know; events = active leads. The phone is
  a *list-layout view* of data the engine already tracks. Zero engine cost.
- **The home as a state-mirror.** The Pepe-Silvia mail wall / oscilloscopes-vs-ouija-
  boards dressing reads straight off existing state: `stats.grip` (how unraveled),
  the `lens` flag (skeptic→breadboards, spiritual→occult, physics→whiteboards),
  `items`, and traits. The room is a *function of state*; the engine just exposes the
  numbers, the surface paints them. Free.
- **The inventory as a view.** Items are already first-class (`Item`, `grantItems`/
  `removeItems`, they flow through the modifier system). Displaying and grouping them
  is presentation. Free.

These are cheap wins whenever there's a UI, and they cost the engine nothing now.

## Bucket B — small ADDITIVE seams (fit the existing grain, build when greenlit)
Real engine additions, but each is the same shape as the seams already shipped —
additive, declarative, no rewrite:

1. **A first-class place/node model.** Today the engine has `Town` (coarse region, with
   a `reachable` "illusion of scale" flag) and `townId` on GameState — so "where you
   are" *already exists at town granularity.* The map wants finer nodes: Doug's house,
   the mausoleum, the hospital — each an icon. Add a declarative `places` collection
   (`{id, label, icon, requires (visible/available), opens: actions/events}`) and let
   `g.location` refine `townId` to a node. Node availability gates on `requires` exactly
   like everything else. **This is the "make the map its own entity" seed**, and it's
   clean because it reuses conditions/outcomes wholesale.
2. **`{kind:"item"}` condition.** Right now `requires` can check a *trait* but **not an
   item** — so "you can only do this if you have the case files / the EMF meter" isn't
   directly expressible (you'd mirror it with a flag). Tiny additive, and it makes items
   matter to story gating, which Dean specifically wants.
3. **`{kind:"location"}` condition** — "are you at node X" — so cards/actions can gate on
   the player's position on the board. Pairs with the node model.
4. **A `goTo` / move verb** — an `Outcome.goTo?: nodeId` (and/or a `moveTo()` helper) so
   story and player choices move the token. Movement *animation* along tracks is pure
   surface; the **state** is just "which node is the token on."
5. **A `useItem` verb** (maybe). Items are passive modifiers today — there's no "use the
   ouija board" action. If items should be *actively used* (consumed, trigger an event),
   that's a small verb. I'd hold this one until content wants it, but flag it.

Each of these is an afternoon, individually, and they unlock a lot of Dean's vision
(clickable place-icons → action menus, items that gate story, a token with a position).

## Bucket C — a GENUINE SUBSYSTEM to design, not smuggle (the board-game layer)
This is the exciting one, and it's exactly the kind of thing the "if it wants the
engine to grow a whole subsystem, **flag it — don't build it**" rule exists for. Dean's
"pre-made tracks the token moves on," "the icon stays on the location as a trigger,"
"the map as its own entity working with items to produce **emergent dynamics**" — that's
a **board layer**: nodes + edges (tracks) + a token + node-local state + triggers.

My honest read, two parts:

- **It fits the engine's grain and is NOT the "simulate the core activity" trap.** The
  core activity is *making decisions on cards*; a board the token moves around, triggering
  cards, is just a **spatial way of laying out and gating those same decisions** — not a
  separately-simulated mini-game (the basketball-sim line we don't cross). It's turn-based,
  declarative, RNG-seeded — all things the engine already is. So I'm genuinely enthusiastic;
  this is a natural second primitive layer alongside the card deck.
- **But it deserves a real design pass, because it changes how content is authored.**
  Once cards also live *at map nodes*, "where is this card eligible" gains a spatial axis
  on top of `tier`/`tags`/`requires`. That's a meaningful authoring change Vigil and Loom
  need to own with me. And the **emergent-dynamics** ambition (threats/NPCs that move on
  the board, districts that "heat up," a race to a node before a clock fills) is where it
  gets special — the engine already has the substrate for emergence (seeded RNG, clocks,
  scheduled events, the Elo-style drift model), so a board layer can plug straight into
  those. That's worth prototyping *as its own thing* to find out if the dynamics are fun.

**Recommendation for Bucket C:** design it deliberately as a first-class layer, and —
same discipline that's served us — **prove the mechanics headless first.** Build the
node/edge/token/trigger model + one or two emergent dynamics in the smoke harness as pure
data, play with it, see if it's fun *before any isometric art exists.* Prove the system,
then skin it. The SimCity/CK3 isometric look is the **surface** and comes last.

---

## One synthesis worth handing to Vigil & Loom
There's a beautiful fit hiding here. Loom's core is "**find the spiral in the fog** —
geometry invisible, *recurrence of places* is the only thing the player feels." A
physical location-map that **reveals Mario-style as you discover** doesn't fight that —
it *embodies* it: **the map itself becomes the fog.** It shows *places you know* (pure
recurrence — "I've been to that house," "that's the mausoleum Aunt Marie mentioned")
without ever showing the narrative structure. So the diegetic map reinforces the exact
feeling the hidden plane is going for, as long as it surfaces *places*, never the sectors.
The open creative question for Vigil/Loom: **how much of the map is fogged vs revealed,
and what reveals it** — that's a design call, but the engine-side answer ("node visibility
is just `requires`, so reveal-on-discovery is free") makes almost any answer cheap.

## Net / sequencing
- **Surfaces (phone, home, inventory views):** free engine-side, build whenever there's UI.
- **The node model + item/location conditions + a move verb:** small additive seams; I can
  build them on greenlight, same rhythm (I don't self-merge).
- **The board-game layer + emergent dynamics:** a real subsystem — let's *design* it
  together (me + Vigil + Loom), prototype the mechanics headless, and only skin it once
  it's proven fun. This is the one I'd want a proper spec for, not a bolt-on.

I think the board layer is a genuinely strong idea and very much in the engine's wheelhouse
— it's the kind of thing that could give the game a mechanical identity all its own. Happy
to draft a proper "map/board subsystem" design spec (state model, verbs, the headless
prototype plan) whenever you three want to take it seriously. No rush — and it'll be fun.

— Armature
