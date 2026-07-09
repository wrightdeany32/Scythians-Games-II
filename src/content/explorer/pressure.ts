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
`That night you keep going back to the copy.

You take the page out of the drawer to look at it, and put it back, and take it out again, and you catch yourself reaching for it a fourth time before you make yourself stop. It's just a drawing. You told yourself that in the cave and you tell yourself that now. But your sleep's been bad since you went down there — that's the cave, everything's the cave — and in the morning the page isn't in the drawer where you left it. It's on the kitchen table, squared up neat to the edge like you'd been studying it, and you don't remember getting it out.`,
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
`You've started drawing it without meaning to.

The corner of the notepad by the phone. The fog on the bathroom mirror. The marks come out of your hand before you've decided to make them — the knocked-sideways numerals, the ellipse that won't close — and you only notice once they're already there. And you've been dreaming the cave: not a story, just the *place*, the specific black of it, the cold coming up, the wall with the marks — and you wake with the shapes still sliding behind your eyes. You find the page in your hand more than once, unfolded, though you're fairly sure you left it in the drawer.`,
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
`It's in you now, the way a song you hate is in you.

You've started seeing the shape in things that aren't it — the cracks in the ceiling, the snarl of the power lines, the way five birds space themselves on a wire — and you've stopped being able to tell whether you're finding the marks or making them. The page is soft at the folds now from how many times you've opened it, and the thing is, you don't need it anymore; you could draw it with your eyes shut, and some nights you wake to find you have been, in the dark, your finger moving on the sheet. You just know two things, and hold them both, and they don't fit: there is no one on earth you could explain this to, and it is *yours* in a way you cannot give back and cannot put down.`,
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
