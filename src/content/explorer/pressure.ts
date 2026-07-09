// ============================================================================
// content/explorer/pressure.ts — the Disturbance Answers (Loom's story pass,
// wired): the mid-run exposure gradient. Three staged notches that PLATEAU —
// ambient escalation only, no cut-off, no discharge-shaped climax; the knife
// at the return remains the only thing that ends anything.
//
// The two seals, held: no cosmology leak (the watching reads as human agents
// or as the thing, never said which); not a second closer. No lensFlavor
// anywhere (pre-frame, per Azimuth — the player's existing frame decides what
// the watching is). The reactions carry narration-only small attune leans
// and NO grip change (atmosphere, not a grip lever).
//
// Wiring: tuning.exposure.stages fires the lowest unfired stage at the day
// boundary (one per morning); the shard strand is bodyExtras on took_shard;
// the dale_bond easing (stage 3) is the cross-thread relief valve. Stage-fire
// records carry the exposure snapshot first-class (engine, Phase 2b).
// ============================================================================

import type { GameEvent } from "../../engine/types";

export const pressureEvents: Record<string, GameEvent> = {
  // -- stage 1: the first notice ---------------------------------------------------
  ux_pressure_stage1: {
    id: "ux_pressure_stage1",
    once: "pressure1_seen",
    title: "The First Notice",
    body:
`There's a car.

You've seen it before — you're almost sure. Grey, nothing, the kind of car that's every third car, except it was on your street yesterday and it's on your street now, parked a little down the block with no one in it, or with someone in it you can't quite make out through the glare. You watch it for a second longer than you'd admit to. Then a neighbor walks past it and nothing happens and it's just a car, and you feel stupid, and you go inside.`,
    bodyExtras: [
      {
        when: { kind: "flag", flag: "took_shard" },
        text:
`That night the piece of stone is warm.

You notice it packing your bag — the shard, warm to the touch, warmer than the room, and you tell yourself it sat by the window and caught the afternoon. Your sleep's been bad since the cave. That's the cave. Everything's the cave. You put the shard in the drawer and you don't quite manage to leave it there; in the morning it's in your bag again and you don't remember moving it.`,
      },
    ],
    choices: [
      {
        label: `"It's a car. It's a rock. Get a grip."`,
        attune: -0.25,
        outcome: {
          log: "You say it and it helps, the way saying the sensible thing out loud always helps, and you get on with your day, and the helping lasts until about the time you see the car again.",
          tone: "n",
          setFlags: { pressure_stage: 1 },
        },
      },
      {
        label: `"…I'm being watched."`,
        attune: 0.25,
        outcome: {
          log: "You think it plainly, once, and then you make yourself stop, because there's nowhere useful to go with it and no way on earth to prove it. But you thought it. And a thought like that, once you've had it, doesn't leave — it just waits.",
          tone: "n",
          setFlags: { pressure_stage: 1 },
        },
      },
    ],
  },

  // -- stage 2: closer -----------------------------------------------------------------
  ux_pressure_stage2: {
    id: "ux_pressure_stage2",
    once: "pressure2_seen",
    title: "Closer",
    body:
`It's a person now.

At the edge of wherever you are — the far end of the grocery, across the street from the coffee place, in the thinning crowd as something lets out — there's someone who is there again. You'd swear they were there yesterday, somewhere else. You can never hold the face; every time you go to fix it, they're bent to something ordinary, a phone, a shelf, a shoelace, and the face slides. And every time you look away you feel the weight of being looked *at*, square between the shoulder blades, the oldest animal alarm there is.

You've started taking different routes. You haven't told anyone you've started taking different routes.`,
    bodyExtras: [
      {
        when: { kind: "flag", flag: "took_shard" },
        text:
`The shard hums.

Not a sound — a feeling, in the back teeth, when you hold it, a pressure like a struck tuning fork you can feel and not hear. And you've been dreaming the cave. Not a story, just the *place* — the specific black of it, the cold coming up, the wall with the marks — and you wake with your jaw aching from the hum that isn't a sound, and the shard is in your hand, and you don't remember taking it out.`,
      },
    ],
    choices: [
      {
        label: `"People look like other people. I'm keyed up and I'm pattern-matching."`,
        attune: -0.25,
        outcome: {
          log: "You build the sensible version and it's airtight and you almost believe it, and the almost is the problem. You're a careful person. You've never in your life taken this many different routes home.",
          tone: "n",
          setFlags: { pressure_stage: 2 },
        },
      },
      {
        label: `"They keep finding me."`,
        attune: 0.25,
        outcome: {
          setFlags: { pressure_stage: 2 },
        },
      },
    ],
  },

  // -- stage 3: the weather (the ceiling; plateaus here) ------------------------------------
  ux_pressure_stage3: {
    id: "ux_pressure_stage3",
    once: "pressure3_seen",
    title: "The Weather",
    body:
`It isn't an event anymore. It's a climate.

You've stopped being able to pretend you're not being watched, and the terrible part — the part that would sound insane to anyone you tried to tell — is that *nothing happens.* No one approaches. No one speaks. No car door opens, no hand falls on your shoulder, no note appears. There is only the constant, low, total certainty that you are *known* — that somewhere someone with the reach to do it decided you were worth keeping eyes on, and the eyes do not blink and do not close and do not ever do anything at all except watch, and go on watching, for as long as you're here.

You could almost wish it would *do* something. That's how you know how bad it's gotten.`,
    bodyExtras: [
      {
        when: { kind: "flag", flag: "dale_bond" },
        text:
`There's one place it lifts. You've noticed it and you haven't examined it: out at the end of that dead-end road, on the old man's porch under his yellow light, the weight comes off your back. You don't know if it's really quieter out there or if it's just the only place anyone ever told you to come *because* nobody watches it. You've started driving out more than you'd admit — to sit on a porch with a lonely man, and feel, for an hour, unwatched.`,
      },
      {
        when: { kind: "flag", flag: "took_shard" },
        text:
`The shard is a coal.

Warm as a living thing, all the time now, and the dreams are every night, and somewhere in the last while you stopped telling yourself it's the cave. You don't have a story for it anymore. You just know two things, and hold them both, and they don't fit together: you cannot make yourself leave it behind, and every sane part of you knows you should. You carry it anyway. You've started to think of it as *yours* in a way you can't defend.`,
      },
    ],
    choices: [
      {
        label: `"I can live inside this. People live inside worse."`,
        attune: -0.25,
        outcome: {
          setFlags: { pressure_stage: 3 },
        },
      },
      {
        label: `"Nothing is ever going to be normal again."`,
        attune: 0.25,
        outcome: {
          setFlags: { pressure_stage: 3 },
        },
      },
    ],
  },
};
