// ============================================================================
// content/explorer/nora.ts — the Nora thread's centerpiece (Loom's story pass,
// wired): the day-trip to the stripped research center, the rangers who turn
// out to be looking for THEM, and Nora's breakdown in the woods.
//
// The right-axis thread in the institutional register: the counterweight to
// Marie's folk-avoidant down and Doug's spiritual up. The horror is not
// supernatural — it's being hunted by competent people, and a dead place that
// someone still watches. It breaks the skeptic honestly: nothing's there, you
// were right… and then someone is still guarding the nothing.
//
// Nora's breakdown is the grip mechanic pointed at a companion — fraying seen
// from outside, at no grip cost to the player (deliberate; the teaching
// function). Push and she turns on you; go gentle and she surfaces.
//
// Wiring shape: a committed full-day action (cost 3, like the cave) once
// `thread_nora ∧ nora_center_known`, then one queue-chained scene. The sealed
// layer — who watches, what the center was — surfaces in NOTHING.
// ============================================================================

import type { GameEvent, LocationAction } from "../../engine/types";

export const noraActions: LocationAction[] = [
  {
    id: "ux_act_nora_daytrip",
    tiredText: "Not today. Your legs are done, and you know it.",
    name: "Drive out to the center with Nora",
    sub: "Past the county line. She doesn't want to see it alone.",
    cost: 3,   // a committed outing — the whole day
    requires: {
      kind: "all",
      of: [
        { kind: "flag", flag: "thread_nora" },
        { kind: "flag", flag: "nora_center_known" },
        { kind: "noflag", flag: "nora_daytrip_done" },
      ],
    },
    outcome: {
      log: "You pick Nora up early. The folder rides in her lap the whole way, like it might try to leave.",
      tone: "n",
      queueEvent: "ux_nora_daytrip",
    },
  },
];

export const noraEvents: Record<string, GameEvent> = {
  // -- she asks you to come ---------------------------------------------------------
  ux_nora_daytrip: {
    id: "ux_nora_daytrip",
    title: "She Asks You to Come",
    body:
`Nora's been building something for weeks and you've watched her build it — the way she talks faster now, sleeps less, has a folder on her phone she turns away from you to open. When she finally asks, she asks like it costs her: "I found where it goes. The center. It's real, it's out past the county line, and it's abandoned, and I want to see it, and I don't want to see it alone." She looks at you. "You're the only person I know who wouldn't tell me I'm crazy."`,
    choices: [
      {
        label: `"Then let's go see it."`,
        outcome: { setFlags: { nora_daytrip_committed: true }, queueEvent: "ux_nora_arrive" },
      },
      {
        label: `"I'll come. But Nora — you doing okay? You seem wound pretty tight."`,
        outcome: {
          log: "She waves it off — she's fine, she's just close to something, she'll rest when she knows. You've flagged it, to yourself. You'll be glad, later, that you did, and sorry it didn't change anything.",
          tone: "n",
          setFlags: { nora_daytrip_committed: true, noticed_nora_fray: true },
          queueEvent: "ux_nora_arrive",
        },
      },
    ],
  },

  // -- the place that was cleaned, not abandoned ----------------------------------------
  ux_nora_arrive: {
    id: "ux_nora_arrive",
    title: "The Place That Was Cleaned",
    body:
`The drive is an hour past anywhere. She talks the whole way, laying it out — the holding companies, the dates, the disappearances she's mapped against them — and it's *coherent*, it's the institutional read built to a fine point, and you can't find the hole in it. Then the trees open and there it is.

It's a building the way a skull is a head. Low, concrete, industrial, every window gone, the parking lot cracked to rubble with saplings coming up through it. Decades dead. And Nora stops the car and doesn't get out and says, quietly, "Okay. Okay, it's real."`,
    choices: [
      {
        label: `"Let's look. Carefully."`,
        outcome: { queueEvent: "ux_nora_explore" },
      },
      {
        label: `"Nora. Doors and windows only. We do not go deep, and we leave the second either of us says leave."`,
        outcome: {
          log: "She agrees, fast, grateful for the rule — a rule is a thing to hold when the place in front of you is this quiet. You both know you'll keep it right up until you don't.",
          tone: "n",
          setFlags: { nora_pact_careful: true },
          queueEvent: "ux_nora_explore",
        },
      },
    ],
  },

  // -- nothing here, and the wrongness of that --------------------------------------------
  ux_nora_explore: {
    id: "ux_nora_explore",
    title: "Nothing Here",
    body:
`Inside, it's empty. Not looted-empty — *emptied.* Where there should be the wreckage of a dead institution — files, furniture, the tide-line of forty years of trespassers — there is swept concrete and clean bolt-holes where heavy things were unbolted and carried out. Someone took this building apart on purpose and took the pieces somewhere and swept the floor behind them.

And a part of you — the skeptical, sensible part that has doubted this whole thing — feels *vindicated*, and says so, because look: there's nothing here. No horror. No sigils. No monster. A dead building somebody stripped for salvage. You were right to doubt.

Nora walks the empty rooms with her phone out and her face falling, because she came for proof and the proof is an absence, and an absence proves nothing to anyone but her.`,
    choices: [
      {
        label: `"There's nothing here, Nora. I'm sorry. But this is — this is a stripped building. That's all it is."`,
        lensFlavor: "skeptic",
        outcome: {
          log: "You say it kindly and you mean it and it's the reasonable read, and you watch it land on her like a door closing, and something in you settles at having said the sensible thing out loud. There's nothing here. You're almost sure.",
          tone: "n",
          setFlags: { read_skeptic: true },
          queueEvent: "ux_nora_rangers",
        },
      },
      {
        label: `"This wasn't abandoned. Somebody cleaned this. That's not the same thing."`,
        lensFlavor: "institutional",
        outcome: {
          log: "You feel it before you can argue it — that emptied is different from empty, that someone chose this, paid for it, swept up after. It's the most rational dread there is, all documents and bolt-holes and nothing supernatural at all, and it's worse for that. Nora looks at you like you've thrown her a rope.",
          tone: "n",
          setFlags: { read_institutional: true },
          queueEvent: "ux_nora_rangers",
        },
      },
      {
        label: `"We should go. Right now. I don't like this."`,
        requires: { kind: "any", of: [{ kind: "flag", flag: "noticed_nora_fray" }, { kind: "flag", flag: "nora_pact_careful" }] },
        attune: -0.25,
        outcome: {
          setFlags: { wants_out_early: true },
          queueEvent: "ux_nora_rangers",
        },
      },
    ],
  },

  // -- the green truck ------------------------------------------------------------------------
  ux_nora_rangers: {
    id: "ux_nora_rangers",
    title: "The Green Truck",
    body:
`You hear the engine before you see it. You're near a gaping window when a truck noses up the cracked drive and stops — green, official, a gold star on the door, PARK SERVICE or something like it stenciled underneath. Two people get out in uniform, unhurried, competent, the body language of people who do this a lot.

You and Nora go down below the sill without a word, some animal agreement, and you listen.

They're not sightseeing. They walk the lot like they're checking it. One of them is on a radio, and the flat carry of a voice across empty concrete brings you pieces:

*"—nothing here, we don't see anyone—"*

*"—description again?—"* and then a description, and it is loose, and it is general, and it is close enough to you and Nora that your blood goes cold.

*"—yeah. If they come through, same as always, we flag it and we sit on it. Somebody wants eyes on this place, so we keep eyes on this place—"*

And that's the whole horror, delivered in a bored voice over a cheap radio in the middle of nowhere: they are *looking for people.* Not you specifically, maybe — a description, a type, whoever comes pulling at this — but people, and it's *routine* for them, and this dead stripped building that has nothing in it is watched, still, by someone with the reach to put uniforms on the ground and keep them there. Someone decided this nothing is worth guarding. And you are crouched under a window inside it.`,
    choices: [
      {
        label: `Do not move. Do not breathe.`,
        outcome: {
          log: "You go still in a way you didn't know your body knew how to, and you wait, and the radio crackles, and a boot scuffs somewhere too close, and every second is a year. And under the fear a cold clean thought assembles itself: someone is still watching an empty building. You will never be able to un-know that, and you will never be able to prove what it means.",
          tone: "b",
          stats: { exposure: 2 },
          setFlags: { rangers_hidden: true },
          queueEvent: "ux_nora_escape",
        },
      },
    ],
  },

  // -- out the back ------------------------------------------------------------------------------
  ux_nora_escape: {
    id: "ux_nora_escape",
    title: "Out the Back",
    body:
`You wait for the truck to work the far side of the lot and you go — low, fast, out a rear door and into the treeline, Nora's hand fisted in your sleeve, the two of you crashing into the woods with your hearts going and the building shrinking behind you until the green truck is gone and there's only trees.

You don't stop for a long time. When you finally stop, chests heaving, miles of nothing around you, you turn to say *we made it* —

and Nora isn't okay.`,
    choices: [
      {
        label: `"Nora. Hey. Look at me. We're clear."`,
        outcome: { queueEvent: "ux_nora_breakdown" },
      },
    ],
  },

  // -- she comes apart, and it's a choice how you meet it ------------------------------------------
  ux_nora_breakdown: {
    id: "ux_nora_breakdown",
    title: "She Comes Apart",
    body:
`She's shaking, and it's not the running. Her eyes are wrong — too wide, too fast, going from tree to tree like the woods are full of the truck. "We can't go home," she says. "You understand that? They had a *description.* They're *watching.* We can't go back, we can't go home, they'll be — they know, they *know* now—" and her voice is climbing toward something that won't come back down easy.

This is where you decide how to hold her. Choose carefully.`,
    choices: [
      {
        label: `"Nora, we have to move. We have to get out of these woods and get you home and get you calm — come on, we're leaving, now."`,
        outcome: {
          log: "You grab for her arm and you push, because pushing is what you do when someone's coming apart and you're scared too — and it goes wrong. She wrenches back from you so hard she stumbles. 'Don't — do NOT put your hands on me,' and there's something in her face you've never seen, cornered and furious and gone, and she's got a rock in her hand off the ground before you understand she's picked it up. 'I will put you down, I swear to God, get AWAY from me—' and she's not seeing you anymore, she's seeing the thing that's hunting her, and you realize the only way this doesn't get worse is if you stop being one more person closing in.",
          tone: "b",
          setFlags: { nora_pushed: true, nora_left_behind: true },
          queueEvent: "ux_nora_close",
        },
      },
      {
        label: `"Okay. Okay. I'm right here, I'm not going anywhere, we don't have to move yet. Just breathe with me. In. Out. Nothing's coming. I've got you."`,
        outcome: {
          log: "You stop pushing. You make yourself the one still thing in a spinning world, and you breathe, loud and slow, until she catches it — one ragged breath, then a slower one, then her eyes find you and it's her again, surfacing, exhausted, back. 'Okay,' she says, small. 'Okay. I'm here. I'm sorry.' She wipes her face. 'But I meant it. We can't be seen around here for a while. I'm gonna go stay with my — with somebody, out of the county, till this dies down. And you should keep your head down too.' And she means it, and she's right, and she walks out of these woods beside you instead of against you.",
          tone: "n",
          setFlags: { nora_gentled: true, nora_pact: true },
          queueEvent: "ux_nora_close",
        },
      },
    ],
  },

  // -- the walk out, and the thread stays live -------------------------------------------------------
  ux_nora_close: {
    id: "ux_nora_close",
    title: "The Walk Out",
    body:
`You back away with your hands up and you leave her there, because staying makes it worse, and it's the worst thing you've done in a while — walking out of woods and leaving someone you love holding a rock and shaking at shadows. You get to the road. You go home the long way, alone, sick with it. She'll surface — Nora always surfaces — and when she calls, days from now, she'll be flat and apologetic and she won't quite meet the memory of it, and neither will you.

Either way, this is where the day ends. Not with an answer — with a place too valuable to abandon and no way to say why, a cousin who was *right about the shape of it* and will never be able to prove the rest, and the specific institutional cold of knowing that the danger out here might not be a ghost at all. It might be people. That's worse.`,
    bodyVariants: [
      {
        when: { kind: "flag", flag: "nora_pact" },
        text:
`You walk out of the woods together. At the trailhead she grips your hand hard, once, and says she'll call you when it's safe, and she means it, and she drives off toward wherever *out of the county* is, and you're left with a stripped building an hour behind you, a description that fits you, and the cold clean fact that someone still watches a place with nothing in it.

Either way, this is where the day ends. Not with an answer — with a place too valuable to abandon and no way to say why, a cousin who was *right about the shape of it* and will never be able to prove the rest, and the specific institutional cold of knowing that the danger out here might not be a ghost at all. It might be people. That's worse.`,
      },
    ],
    choices: [
      {
        label: `Head home.`,
        outcome: { setFlags: { nora_daytrip_done: true, thread_nora_active: true } },
      },
    ],
  },
};
