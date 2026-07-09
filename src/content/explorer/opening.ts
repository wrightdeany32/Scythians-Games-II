// ============================================================================
// content/explorer/opening.ts — the Explorer run's opening beats, now AUTHORED
// (Loom's 2026-07-09 pass replaces all three engine-seat stubs):
//
//   · ux_explorer_opening — THE WELCOME (the family-reunion start, per Dean's
//     vision): the whole ensemble lands in one afternoon — Aunt Marie, cousins
//     Reese and Nora, family-friend Doug — with one wrong note inside the
//     warmth. Sets `arrived_town` + `thread_doug` (both choices); schedules
//     Marie's warning (+2). Coordinate- and lens-silent; the two choices are
//     ORIGIN SEEDS for the creation deck (origin_fresh_start / origin_last_door),
//     not a branch. The solo-arrival draft is FALLBACK only — never wire both.
//   · ux_nora_intro — THE CALL: Nora's establishing beat after the first cave
//     trip. The eccentric-but-right cousin, the records wall, the fray and the
//     one biographical silence (the quarry-pattern instance) on the engaged
//     choice; the cipher recognition as a took_shard extra.
//   · ux_shard_settles — THE COPY YOU MADE (the shard reframed per Dean:
//     recorded symbol, not pocketed stone): the page's first night home; the
//     ratified +2 exposure banked as a percept.
// ============================================================================

import type { Door, GameEvent } from "../../engine/types";

export const openingQueue = ["ux_explorer_opening"];

export const openingDoors: Door[] = [
  // The call lands two days after the cave trip (Loom's §3 call: the day of
  // ordinary breath between is the point) — the afterDays promise carries it.
  { eventId: "ux_nora_intro", when: { kind: "flag", flag: "cave_done" }, afterDays: 1 },
  { eventId: "ux_shard_settles", when: { kind: "flag", flag: "took_shard" } },
];

export const openingEvents: Record<string, GameEvent> = {
  // -- the welcome (family-reunion start; creation-deck qualifiers: Explorer
  // sector, solo character, grounded/ordinary origin) -----------------------------
  ux_explorer_opening: {
    id: "ux_explorer_opening",
    once: "arrived_town_seen",
    title: "The Welcome",
    body:
`They throw you a thing the first weekend, because that's what this family does — any excuse, and you moving back is a good one. It's at Aunt Marie's, which means the good folding chairs and three times too much food and the cooler Doug always brings, and it spills off the back deck into a yard that runs right up to the treeline. Half the town filters through at some point. You'd forgotten how that goes out here — how everyone turns out to be somebody's cousin or somebody's old coach, how a place this size holds onto you.

Marie gets to you first, both hands on your arms, looking you over like she's checking for damage. She's your mother's sister and she has decided — in the way she decides things, which is to say it's already done — that keeping an eye on you is her job now. She's got a plate in your hand before you've managed ten words, and she keeps touching your shoulder through the afternoon like she's making sure you didn't leave again.

Reese is talking about the caves before you've finished the plate. Your cousin Reese, who never met a hole in the ground he didn't want to go down, who calls the whole business "just rock and dark, don't be dramatic" and honestly means it — he's got White's Hall half-planned for you already, headlamps and rope and a Saturday. His certainty is a comfortable thing to stand next to. You can see how a person could hide inside it.

Nora catches you by the cooler to tell you, low, like it costs something to say out loud, about the thing she's been looking into. She won't say what — not here, not with people around — but there's a lot of it, and she's got that particular shine in her eye. The family's fond of Nora the way you're fond of weather: you don't argue with it, you just dress for it. Thing is, she's not wrong nearly as often as everyone likes to think.

And Doug holds the grill the whole afternoon, the way he has at every one of these since you were a kid mowing his lawn for gas money. He and Marie went to school together a hundred years ago; he taught you the fire road and how to hold a pace and how not to quit partway up a thing. When he catches your eye across the yard he just lifts his chin — *good, you made it* — and goes back to the burgers. Some things don't get said between people who go back that far.

It's a good afternoon, the whole long warm length of it. And only once — late, when the food's gone cold and the smallest kids are melting into tears and you step off the deck to breathe — only once do you look to where the mown grass quits and the woods start, close and dark and brimming with the evening, and feel the quiet that comes off them go wrong. Not the quiet of trees. The quiet of a room where the talking stopped because you walked in. Then Reese is hollering something from the deck about headlamps, and it's just trees again, black against a failing sky, saying nothing, being woods. You go back to your people. You don't think about it again. It was a long week. You're just tired.`,
    choices: [
      {
        label: `You came back to start something.`,
        outcome: {
          log: "That's the version you'd say out loud — new chapter, clean slate, the whole line — and it's even mostly true. You mean to stay this time.",
          tone: "n",
          setFlags: { arrived_town: true, thread_doug: true, origin_fresh_start: true },
          scheduleEvent: { eventId: "ux_marie_warning", inDays: 2 },
        },
      },
      {
        label: `You came back because it was the one door still open.`,
        outcome: {
          log: "You wouldn't put it that way to anyone, and you don't put it that way to yourself. But here you are, and the people are real, and whatever you were leaving is a long drive back the way you came.",
          tone: "n",
          setFlags: { arrived_town: true, thread_doug: true, origin_last_door: true },
          scheduleEvent: { eventId: "ux_marie_warning", inDays: 2 },
        },
      },
    ],
  },

  // -- the call (Nora's establishing beat) ------------------------------------------
  ux_nora_intro: {
    id: "ux_nora_intro",
    once: "nora_intro_seen",
    title: "The Call",
    body:
`Nora calls two days after you get back from White's Hall — which is how you find out Nora knows you went to White's Hall, a small unsettling thing you decide not to poke at. "Don't tell me it was nothing," she says, before hello. "You went down there. What did you see."

She's been waiting years, she says, for somebody in the family to go down there who'd actually *pay attention* — not Reese, God, Reese would step over a body and call it a rock — somebody who'd notice things. She wants you to go back. Properly, this time: lights, a camera, a real record. "You're the explorer, you know how to document a site — I need it documented." She frames it like a favor to the hobby, footage for the channel, a diagnostic pass. But there's a pitch under the pitch and you can both hear it humming.

Because Nora has a *wall*, it turns out — actual string, she admits, not embarrassed enough to stop: forty years of people who went into those woods and came out wrong, or didn't come out, laid against dates. And at the middle of the dates there's a place. A research station, past the hall, back in the fifties and sixties — federal money, then no money, then nothing, and the records gone in the specific way records go when somebody made them gone. "That's not a theory," she says. "That's a records request that came back with a black rectangle where a building used to be."`,
    bodyExtras: [
      {
        when: { kind: "flag", flag: "took_shard" },
        text:
`You mention the marks — describe them, the numerals knocked sideways, the ellipse that won't close — and Nora goes very quiet on the line. "Send me a picture," she says, and her voice isn't the same voice. "Now. Send it now." You do. The silence runs long enough that you say her name into it. "Where did you *see* this," she says, and it isn't a question the way she says it — it's the sound of a thing she's been afraid of for a long time finally walking in the door. She won't say one more word about it over the phone.`,
      },
    ],
    choices: [
      {
        label: `"Nora. Is this the lizard-people thing again?"`,
        outcome: {
          log: "'Laugh,' she says — and she does, a little, because you two have ribbed each other about this since you were kids and the ribbing is load-bearing. Then she stops. 'I'm wrong about a lot of it. I keep a whole folder of the stuff I've been wrong about. This one I'm not wrong about. And it scares me that you went down there, and I need you to take it a little bit seriously, because I can't get one other person on this earth to.'",
          tone: "n",
          setFlags: { thread_nora: true, nora_center_known: true },
        },
      },
      {
        label: `"Okay. Show me the wall."`,
        outcome: {
          log: "Something goes out of her all at once — relief, or the particular tiredness of being believed after a long time of not being. 'Yeah,' she says. 'Yeah. Come over.' And then, quieter, careful: 'You said you drew something, down there. Bring that.' There's a beat where you catch it — how worn she sounds under the wire of her, like she hasn't slept the good kind of sleep in a while. And when she says a year — 'I've been keeping track since —,' and names one — she says it the way you'd say a scar, and you go to ask why that year, what happened that year, and something in how she said it closes the door before you reach it. She's your cousin. You've known her your whole life. There's a room in her you have never once been inside.",
          tone: "n",
          setFlags: { thread_nora: true, nora_center_known: true, noticed_nora_fray: true },
        },
      },
    ],
  },

  // -- the copy you made (the shard reframed: record, not object) ---------------------
  ux_shard_settles: {
    id: "ux_shard_settles",
    once: "shard_settled",
    title: "The Copy You Made",
    body:
`You made a copy of it before you left — crouched in the cold with the light in your teeth, sketching the thing off the wall line for line into the back of whatever you had on you, because down there it felt like exactly the sort of thing you'd want to be able to prove you saw. Now it's home with you, one page in a drawer, and in the flat ordinary light of your own kitchen it just looks like nonsense: a row of marks like Roman numerals somebody knocked sideways, and an ellipse drawn round them that doesn't quite close. A doodle off a wall. Nothing.

You put it in the drawer. Then later you take it out and look at it and put it back, and you do that a few more times over the night without ever quite deciding to. It isn't that the page *does* anything. It's that you can't get it to mean nothing, either — the marks sit in a deliberate order, made by a hand that meant them, spaced like something that could be *read* if you knew how, and the not-knowing is a small burr you can't thumb flat. You go to bed. The page is in the drawer. You know exactly where it is, the way you know where a sound is in a dark house.`,
    choices: [
      {
        label: `Leave it in the drawer. Go to bed.`,
        outcome: {
          stats: { exposure: 2 },   // the ratified charge, banked here — felt later, at the stages
        },
      },
    ],
  },
};
