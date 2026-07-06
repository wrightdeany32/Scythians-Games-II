# Slate — how the geometry, cards, and dice wire into the engine
### net-new connections for the Fable work order, on top of what's already designed
*From: Slate (idea-lot) · carried by Dean · 2026-07-06 · for Dean, Armature, Vigil, Azimuth, Loom, Concordance*

You asked for ideas *on top of* the corpus — connections that tighten how cards, dice, and the diamond meet the engine, as input to the Fable work order. So this **assumes everything already designed** (the trace-layer/Recorder, band-select/noise resolver, lens-bias, the dome-cluster = decks-within-decks unification, the `drawWeight` chokepoint, `queueEvent`/`nextQueuedEvent`, the diamond coordinates, grip-as-the-only-disposition-stat, the two no- invariants) and proposes only **net-new wiring**. The idea-lot proposes connections; it doesn't spec the engine — **everything here routes to Armature for feasibility and Vigil for blessing.** Armature will know what's cheap and what isn't; I'm offering the *what-connects-to-what-and-why*, and the guardrails.

Markers: **[KEYSTONE]** the load-bearing one · **[WIRE]** a connection to build · **[CONTRACT]** a resolution order to lock · **[GUARDRAIL]** a must-not · **[SOLVES]** speaks to a live problem (the Batch A divergence finding).

---

## §1 — [KEYSTONE] The player's position in the diamond is *emergent*, never stored

The dome-cluster draw weights content by the player's position relative to each deck's position — but nothing yet says **where the player's position comes from.** Here's the answer that closes the loop with zero new stored state:

**The player's dispositional position = the recency-weighted centroid of the coordinates of the cards they've actually resolved.** Every card already carries a coordinate (the deck registry). The trace already records every resolved card. So the centroid of those coordinates *is* where the player sits in the volume right now — computed on demand from the trace, never saved. Recent cards weigh more, so the position *moves* as they play.

Three things fall out for free:
- **The dome-cluster gets its missing input.** Draw-weighting needs a position to weight against; this is it. Trace → card coordinates → centroid → next draw's weights. One loop.
- **Trajectory becomes legible.** Straight-shot vs. spiral is literally *the shape of the path the centroid traces* through the volume over the run — readable straight off the trace, no instrumentation added. (This is also what a future "how did this run move" analyst view reads.)
- **It can't desync or be cheesed.** Because position is always recomputed from what you actually did, there's no saved coordinate to drift out of sync with play. **[GUARDRAIL]** the engine stores grip + resource stats + physical position + flags; it never stores a dispositional coordinate. (This is the third no-, §7.)

*Route: Armature (the centroid function + recency window are the spec) / Vigil (bless the "position is emergent" principle).*

## §2 — [WIRE] The nested deck tree, with coordinates propagating up as centroids

Your "groups of cards within larger groups within larger groups" has a clean recursive shape that reuses §1's math at every level:

**cards ∈ fixture-decks ∈ sector-clusters ∈ the volume.** Each level's coordinate is the **centroid of its children** — a fixture-deck's coordinate is the centroid of its cards; a sector-cluster's is the centroid of its decks. So proximity-weighting works *identically* at every level of the tree (weight a deck by its distance from the player-centroid; weight a card within a mounted deck the same way), and the same centroid primitive from §1 does all of it. One rule, applied recursively, and the nesting Dean wants is just the containment tree with coordinates rolling up. The deck registry is its home.

*Route: Armature (tree schema + rollup) / Vigil.*

## §3 — [WIRE] The dice encode the incline

Right now difficulty is a world constant (`SQUEEZE_TARGET`) plus creation-seeded floors. Two additions make the geometry *mechanically real* through the dice — the thing R5 (depth is the toll, distance is the cost) predicted, now in the roll rather than only in authoring:

- **Difficulty scales with depth and with disposition-distance.** A check on a card drawn *far* from the player's centroid (you're bulling into a sector that isn't yours) takes a friction modifier; a card near your position is easier. Deeper tiers add friction. So "the incline gets steeper toward the center, and steeper when you go against your corner" becomes a dice modifier, not just a metaphor.
- **Grip bends the dice.** Low grip doesn't only gate the ▓▓ options — it *tilts the checks*: as grip erodes, the "sane/grounded" checks get harder and the attuned reads open up (the band the noise resolver routes into widens toward the uncanny). The eroding-grip descent becomes self-reinforcing at the dice layer — the fog pulls you deeper mechanically.

**[GUARDRAIL]** modifiers, never gates (weighting-never-gating holds for dice too); and **felt, never shown** — no visible "distance penalty" or "grip malus" number. The player feels the ground tilt; they never read a stat doing it.

*Route: Armature (is this a clean modifier on the existing roll? probably) / Vigil.*

## §4 — [WIRE][SOLVES] Research is how the player *chooses a lens* — and it manufactures divergence

This is the one I'd most want considered, because it connects a new system (research, from the player-home) to a built mechanism (lens-bias), answers the Batch A finding, and stays inside the anti-noun — all at once.

**Research spends time/energy to develop a player-held *theory*, and that theory drives lens-bias toward its framing.** You dig into the paranormal angle → your lens tilts paranormal → you draw more paranormal-leaning content and build a coherent paranormal reading. Dig into the institutional angle instead → you build a coherent institutional reading. Research is the **player-facing driver** for the lens-bias layer that already exists (which the pack currently feeds only from inferred choices — research is a deliberate, sustained choice of the same kind).

Why this matters right now: **Batch A showed divergence needs a *mechanism*** — same-family readers share priors and converge because nothing makes them lean differently. Research *is* that mechanism, sourced from **player agency** rather than reader diversity: different players research different angles and therefore diverge, by construction. It's also a per-run divergence engine for Concordance's replay model (run 2: "what if I'd chased the other thread"). **[SOLVES]** the divergence question, from the content side, without waiting on cross-family readers.

**[GUARDRAIL]** research reveals *what you know* (earned connections) and grows *theories* (player interpretations) — it **never confirms which theory is true.** No-truth-state holds: a player who researches the demonic reading builds a complete demonic story the game never blesses, exactly as another builds a complete institutional one. Research chooses *your* coherent framing; it never crowns a correct one. That's the anti-noun realized as agency — and it's why lens-choice isn't "solving" the game (there's nothing to solve, only a direction to inhabit).

*Route: Armature (research as a time/energy action feeding the lens-bias weight) / Vigil / Loom (the idea-deck research draws from).*

## §5 — [WIRE] The new world systems, each wired to the one deck engine

Your locked systems (calendar, map, phone) and the softer ones (job, research, statuses) all attach to the deck/draw machinery rather than being separate subsystems:

- **Calendar = the player-facing view of the scheduled-deck queue.** A scheduled meeting is a queued card with a date condition (`queueEvent` + a day/date gate, the `{kind:"count"}` sibling); the calendar just *surfaces that queue diegetically*. It's not a new system — it's a window onto the one the engine already runs.
- **Map = the physical coordinate space, distinct from the dispositional diamond.** Two independent coordinate systems, and naming it now prevents them tangling: the **map** is where you physically are; the **diamond** (§1) is where you dispositionally are. A **location is a deck**, mounted by presence, carrying **both** a map-position *and* a diamond-position (White's Hall sits at a physical spot *and* deep-fringe). Travel costs time/energy (the day loop) and can trigger transit cards. So "how does the map touch cards" → locations are decks; visiting mounts them; they know both their places.
- **Phone / contacts = the reciprocity-tether interface.** Contacts are person-decks; engaging one draws from their deck and drifts your centroid toward their sector (the Imani/Walt/Lena tethers, made a surface). And it's the replay-divergence handle — "the someone I didn't call last time." **[GUARDRAIL]** no-catalog: contacts you've *met*, never a "collect all contacts" meter.
- **Job = a recurring scheduled deck** doing three jobs at once: a **money** spigot, a **standing/sanction anchor** (your job leans your Y-coordinate — a badge is sanctioned, a cash gig deniable), and a **time** cost on the day loop. It's one of the inputs to where you sit in the diamond.
- **Statuses = qualitative flags surfaced, never meters.** "You work at X," "you're close to Reese / estranged from Nora" — what you *know*, shown as state, not "Reese 4/12." **[GUARDRAIL]** no-catalog again; a relationship bar is a truth-state for structure.

*Route: Armature (mounting rules per system) / Vigil (the no-catalog application) / Loom (diegetic surfaces).*

## §6 — [CONTRACT] The draw pipeline, as the engine's one resolution order

As these systems multiply, the *order* they resolve in matters, and the Fable agent should build to **one documented pipeline** so they compose predictably instead of fighting:

1. **Mount** decks — by physical location, active threads, and calendar/schedule.
2. **Filter** eligible cards — `tier ∧ tags ∧ requires ∧ date`.
3. **Weight** — dome-proximity (§1/§2 centroid distance) × lens-bias (§4) × recency/anti-repeat.
4. **Draw** — seed-deterministic, from the weighted eligible pool (or `nextQueuedEvent` for a chained scene).
5. **Resolve noise once** — band-select at draw-time, `{trueBand, resolvedBand}` recorded (Catch A).
6. **Apply + record** — outcome to state, everything to the trace.

Writing this down as *the* contract is itself a lock-down: it tells the Fable agent exactly where lens-bias sits relative to dome-proximity relative to the date filter, so nobody wires them in a conflicting order and quietly breaks weighting-never-gating.

*Route: Armature (owns and refines the actual pipeline) / Vigil.*

## §7 — [GUARDRAIL] The three no- invariants, as one family

For the Fable agent, what the engine must **not** do is as load-bearing as what it must. Three now, and they rhyme:

- **No-truth-state** — no stored *meaning*; the machine holds no canonical answer.
- **No-catalog** — no shown *structure*; surfaces show what you know, never what remains, and never a completion meter.
- **No-stored-disposition** (new, §1) — no saved *position*; the player's place in the diamond is emergent from the trace, never a written coordinate.

Together they define the negative space the whole design depends on. A hand reaching to add a `truth` enum, an endings codex, or a stored `player.disposition` should hit all three, documented in the engine header.

*Route: Concordance logs the third beside the first two; Vigil blesses.*

---

**Net.** The through-line is that the geometry doesn't need much *new* machinery — it needs the existing pieces *connected*: the trace already knows what you drew, so it can compute where you are (§1); that same centroid runs the whole nested deck tree (§2), the dice (§3), and the draw pipeline (§6); research gives the built lens-bias a player-facing driver that also manufactures the divergence Batch A said we lacked (§4); and the new world systems are all windows onto the one deck engine, not new engines (§5). If one thing gets prototyped in the Fable window beyond the world substrate, my vote is **§4** — it's the cheapest path to the divergence the central bet leans on.

All of it is idea-lot input, routed to Armature and Vigil. Happy to tighten any section into a sharper spec, or to pull §4 out on its own if it earns a closer look.

— Slate
