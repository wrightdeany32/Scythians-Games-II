# Story Pass — The Disturbance Answers
### the mid-run exposure beat · non-knife pressure · prose-first, for Armature/Plumb to wire
*From: Loom (Explorer corner) · carried by Dean · 2026-07-07 · blessed by Vigil & Azimuth*

**What this is.** The mid-run exposure-threshold beat, built to Vigil's ruling: the knife is the deterministic terminal at the return, and *this* is what the exposure meter cashes out to before then — a non-knife pressure that raises the temperature without spending the lever. It gives `took_shard` its mid-run payoff (the shard was a disturbance; now the disturbance answers), and it turns the meter from a vestige into a felt gradient. **It inherits the mid-run role the knife vacated** — Concordance carries that in the knife's errata trail so the lineage stays legible.

**The two seals, held (flagged so I can be held to them):**
- **No cosmology leak.** The watching stays ambiguous in the anti-noun's own way — it reads as the cult's human agents *or* as the thing, and the game never says which. The shard's resonance is never explained: not what it is, not what it does. Percept, never cause.
- **Not a second closer.** Ambient escalation only — no cut-off, no discharge-shaped climax. Each stage lands and hands back to the loop. The knife remains the only thing that ends anything.

**The three build notes, folded in:**
- **Bounded** (Vigil): three staged notches that *plateau*. It is not an unbounded climb and it is not a beat that repeats forever — after stage three it holds as weather, it does not keep escalating.
- **Every stage lands in the trace** (Azimuth): threshold crossings and stage transitions are first-class trace records — the gradient is a tuning surface (how many players reach stage two? does `took_shard` dominate the crossings?).
- **No `lensFlavor`** (Azimuth): pre-frame, like the rangers. The player's existing frame decides what the watching "is"; the beat must not tilt the frame that's meant to interpret it.

**Two strands.** The **watched** strand always runs (the disturbances that raised exposure drew attention). The **shard** strand runs only if `took_shard` (the shard is the disturbance that resonates). Where a stage has both, they're written together; the shard lines are gated.

---

## Mechanics

`ux_pressure_stageN` — fired by the engine when `exposure` crosses threshold N (N = 1, 2, 3). Not a scheduled beat and not a player action — a **consequence event**, tripped by accumulated disturbance (`took_shard` +2, the cave pushes, later disturbances). Each stage fires **once**, in order; stage 3 is the ceiling and re-crossing past it fires nothing. A short beat that lands and returns to the loop. No `lensFlavor` anywhere; no position gate; the small reactions carry a narration-only `diamondCoord` lean and nothing else.

---

## `ux_pressure_stage1` — the first notice

There's a car.

You've seen it before — you're almost sure. Grey, nothing, the kind of car that's every third car, except it was on your street yesterday and it's on your street now, parked a little down the block with no one in it, or with someone in it you can't quite make out through the glare. You watch it for a second longer than you'd admit to. Then a neighbor walks past it and nothing happens and it's just a car, and you feel stupid, and you go inside.

**[if `took_shard`]** That night the piece of stone is warm.

You notice it packing your bag — the shard, warm to the touch, warmer than the room, and you tell yourself it sat by the window and caught the afternoon. Your sleep's been bad since the cave. That's the cave. Everything's the cave. You put the shard in the drawer and you don't quite manage to leave it there; in the morning it's in your bag again and you don't remember moving it.

- **"It's a car. It's a rock. Get a grip."** *(you set it down)* → narration only, `diamondCoord` leans *grounded* (small). *(narration: "You say it and it helps, the way saying the sensible thing out loud always helps, and you get on with your day, and the helping lasts until about the time you see the car again.")* → resolve to loop.
- **"…I'm being watched."** *(you let yourself think it)* → narration only, `diamondCoord` leans *attuned* (small). *(narration: "You think it plainly, once, and then you make yourself stop, because there's nowhere useful to go with it and no way on earth to prove it. But you thought it. And a thought like that, once you've had it, doesn't leave — it just waits.")* → resolve to loop.

> DESIGN: The lightest stage — deniable, ordinary, each percept individually nothing. The shard strand lands the frugality tell (warm when it shouldn't be, the small wrongness of the drawer) without a single word of what it *is*. The two reactions are pure framing color — grounded dismissal or attuned acknowledgment — with no grip swing (the pressure isn't a grip lever; it's atmosphere) and no flavor (pre-frame). First threshold crossing only.

---

## `ux_pressure_stage2` — closer

It's a person now.

At the edge of wherever you are — the far end of the grocery, across the street from the coffee place, in the thinning crowd as something lets out — there's someone who is there again. You'd swear they were there yesterday, somewhere else. You can never hold the face; every time you go to fix it, they're bent to something ordinary, a phone, a shelf, a shoelace, and the face slides. And every time you look away you feel the weight of being looked *at*, square between the shoulder blades, the oldest animal alarm there is.

You've started taking different routes. You haven't told anyone you've started taking different routes.

**[if `took_shard`]** The shard hums.

Not a sound — a feeling, in the back teeth, when you hold it, a pressure like a struck tuning fork you can feel and not hear. And you've been dreaming the cave. Not a story, just the *place* — the specific black of it, the cold coming up, the wall with the marks — and you wake with your jaw aching from the hum that isn't a sound, and the shard is in your hand, and you don't remember taking it out.

- **"People look like other people. I'm keyed up and I'm pattern-matching."** *(you reach for the reasonable read)* → narration only, `diamondCoord` leans *grounded* (small). *(narration: "You build the sensible version and it's airtight and you almost believe it, and the almost is the problem. You're a careful person. You've never in your life taken this many different routes home.")* → resolve to loop.
- **"They keep finding me."** *(you name the pattern)* → narration only, `diamondCoord` leans *attuned* (small). → resolve to loop.

> DESIGN: The middle stage — the watching acquires a body and a persistence, and the player's own behavior (different routes, told no one) is the tell that the reasonable read isn't holding, without the narration ever confirming there's anyone there. The shard strand escalates the resonance and pulls the cave into the player's sleep — still no word of mechanism. Second threshold crossing only.

---

## `ux_pressure_stage3` — the weather

It isn't an event anymore. It's a climate.

You've stopped being able to pretend you're not being watched, and the terrible part — the part that would sound insane to anyone you tried to tell — is that *nothing happens.* No one approaches. No one speaks. No car door opens, no hand falls on your shoulder, no note appears. There is only the constant, low, total certainty that you are *known* — that somewhere someone with the reach to do it decided you were worth keeping eyes on, and the eyes do not blink and do not close and do not ever do anything at all except watch, and go on watching, for as long as you're here.

You could almost wish it would *do* something. That's how you know how bad it's gotten.

**[if `dale_bond`]** There's one place it lifts. You've noticed it and you haven't examined it: out at the end of that dead-end road, on the old man's porch under his yellow light, the weight comes off your back. You don't know if it's really quieter out there or if it's just the only place anyone ever told you to come *because* nobody watches it. You've started driving out more than you'd admit — to sit on a porch with a lonely man, and feel, for an hour, unwatched.

**[if `took_shard`]** The shard is a coal.

Warm as a living thing, all the time now, and the dreams are every night, and somewhere in the last while you stopped telling yourself it's the cave. You don't have a story for it anymore. You just know two things, and hold them both, and they don't fit together: you cannot make yourself leave it behind, and every sane part of you knows you should. You carry it anyway. You've started to think of it as *yours* in a way you can't defend.

- **"I can live inside this. People live inside worse."** *(you find a way to carry it)* → narration only, `diamondCoord` leans *grounded* (small). → resolve to loop.
- **"Nothing is ever going to be normal again."** *(you let it be true)* → narration only, `diamondCoord` leans *attuned* (small). → resolve to loop.

> DESIGN: The ceiling. The watching becomes ambient weather that *goes nowhere* — which is the specific horror (a power on a budget doesn't spend; it watches), and it's the anti-noun of dread: maximal pressure, zero confirmation, nothing you could ever prove or point to. And it **plateaus here** — no stage four, no repeat; once tripped it holds as the run's background until the terminal. The shard strand reaches its resonance ceiling and lands the possession beat (*yours*, un-defendable) that the knife will pay off at the return. Crucially: it does **not** resolve — no knife, no confrontation, no reveal. The knife at the return is the only thing that ever ends this. Third threshold crossing; ceiling.

---

## Notes for the wire (Armature / Plumb)

- **Loop-native, frozen-cave-safe.** A consequence event tripped by `exposure` thresholds; reads `exposure`, `took_shard`; writes `pressure_stage` (1/2/3). Touches nothing in `cave-b3`.
- **Fires the exposure threshold's consequence** — this is the event `exposure.threshold` re-points to (per Vigil's ruling). Stage N fires on crossing threshold N, **once, in order**; stage 3 is the ceiling (re-crossing fires nothing). Bounded by construction.
- **Every stage transition is a first-class trace record** (Azimuth) — `{stage, exposure_at_crossing, took_shard}` at minimum, so the gradient is a tuning surface from day one.
- **No `lensFlavor` on any line** (Azimuth) — pre-frame. The two reactions per stage carry a narration-only small `diamondCoord` (grounded/attuned) and **no grip change** (the pressure is atmosphere, not a grip lever — this keeps it from becoming a grip farm across three stages). No position gate.
- **Shard strand gates on `took_shard`** — the watched strand always runs; the shard lines are additive.
- **`dale_bond` easing (stage 3)** — an additive `[if dale_bond]` insert (bodyExtras-style, per Plumb): the one place the watching loosens is Dale's porch, held percept-only (really quieter, or just where you feel safe? — never said). It's the cross-thread relief valve the team flagged; it deepens the Dale bond and renders the unwatched-house payoff. Drops cleanly if `dale_bond` is unset.
- **Ledger lineage** (Concordance): this beat inherited the mid-run role the knife vacated (errata trail: discharge → deep reward → provoked → deterministic terminal → *mid-run role re-homed here*).
- **Linter-clean** — echoes are prose; no `*…*` in any `log`; all refs resolve.

— Loom
