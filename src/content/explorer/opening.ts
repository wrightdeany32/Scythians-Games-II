// ============================================================================
// content/explorer/opening.ts — the Explorer run's opening stubs. THREE small
// engine-authored beats (all flagged in the edit log for Loom to replace or
// bless — the pack names them as needed hosts but writes none of them):
//
//   · ux_explorer_opening — creation-as-turn-zero stub: arrival in town. Sets
//     `arrived_town` (the Explorer start's flag; nothing else sets it by
//     design) and `thread_doug` (Doug is a lifelong contact), and its
//     resolution is the host that schedules Marie's warning (+2 days), per
//     Loom's confirmed shape.
//   · ux_nora_intro — the met-door that establishes Nora as a contact after
//     the first cave trip (`thread_nora`, `nora_center_known`).
//   · ux_shard_settles — the shard's first night home: the ratified
//     took_shard exposure charge (+2), rendered as a percept instead of
//     silent math (the cave is frozen and cannot carry it).
// ============================================================================

import type { Door, GameEvent } from "../../engine/types";

export const openingQueue = ["ux_explorer_opening"];

export const openingDoors: Door[] = [
  { eventId: "ux_nora_intro", when: { kind: "flag", flag: "cave_done" } },
  { eventId: "ux_shard_settles", when: { kind: "flag", flag: "took_shard" } },
];

export const openingEvents: Record<string, GameEvent> = {
  // -- arrival (creation stub) ------------------------------------------------------
  ux_explorer_opening: {
    id: "ux_explorer_opening",
    once: "arrived_town_seen",
    title: "The Edge of the Map You Grew Up On",
    body:
`The boxes are mostly still boxes. The rental smells like someone else's cooking and the landlord's cigarettes, and out the kitchen window the hills start where the yards stop, green-black and close, the woods you half-remember from being a kid out here — the reservoir, the fire roads, the places with names nobody wrote down.

You came back for your own reasons: work that travels, rent that doesn't, family thin on the ground but present — Aunt Marie in town, your cousin Nora a county over, and Doug, who isn't family and has been family since you were nineteen. It's quiet out here. That's the point. That's what you tell people.

Your phone buzzes. Reese, who found out you'd moved back before you'd finished unpacking, has sent you a pin and too many exclamation points. There's a cave system off the old fire road, and apparently it has your name on it.`,
    choices: [
      {
        label: `Unpack first. The hills aren't going anywhere.`,
        outcome: {
          log: "You flatten boxes until the place looks like someone lives in it. The pin sits in your phone, patient.",
          tone: "n",
          setFlags: { arrived_town: true, thread_doug: true },
          scheduleEvent: { eventId: "ux_marie_warning", inDays: 2 },
        },
      },
      {
        label: `Text Reese back tonight.`,
        outcome: {
          log: "You send back a single question mark and get a paragraph. Some things don't change. The boxes can wait; you look up the fire road on the map before bed.",
          tone: "n",
          setFlags: { arrived_town: true, thread_doug: true },
          scheduleEvent: { eventId: "ux_marie_warning", inDays: 2 },
        },
      },
    ],
  },

  // -- Nora reaches out (thread establishment stub) --------------------------------------
  ux_nora_intro: {
    id: "ux_nora_intro",
    once: "nora_intro_seen",
    title: "Nora Hears You've Been Out There",
    body:
`Nora calls before you've told her anything, because the family wire works faster than you do. "You went out to White's Hall," she says, not a question, and there's something in her voice that isn't teasing. "Okay. Listen. Don't tell me what you saw yet — I don't want to contaminate it."

She talks for ten minutes, fast, the way she gets. She's been pulling records for months — she does this, your cousin, she pulls threads — and the thread she's on now is a research center, a real one, out past the county line, decades dead. "It's connected," she says. "To the woods, to the — I'll show you. Not on the phone." A breath. "I'm glad you're back. I'm glad it's you. Nobody else out here can hear this without deciding I'm crazy first."`,
    choices: [
      {
        label: `"Show me when you're ready."`,
        outcome: {
          log: "She says soon. She means it the way Nora means things — at full speed, at her own angle, sooner than you expect.",
          tone: "n",
          setFlags: { thread_nora: true, nora_center_known: true },
        },
      },
      {
        label: `"Nora — how long have you been on this?"`,
        outcome: {
          log: "The pause tells you more than the answer. 'A while,' she says. 'Longer than I've told anybody.' You file that away, next to the speed in her voice.",
          tone: "n",
          setFlags: { thread_nora: true, nora_center_known: true, noticed_nora_fray: true },
        },
      },
    ],
  },

  // -- the shard's first night home (the ratified exposure charge, as a percept) -----------
  ux_shard_settles: {
    id: "ux_shard_settles",
    once: "shard_settled",
    title: "The Piece You Took",
    body:
`Unpacking the cave gear, you find it again — the shard, wrapped in the spare sock where you stowed it, the marks on it small and exact under the kitchen light.

You took a piece of that place. It sits on your table like it knows it. You turn it over twice and put it in the drawer, and the apartment is very quiet, and you have the passing, unexamined thought that taking it was a louder thing to do than it felt like at the time.`,
    choices: [
      {
        label: `Put it in the drawer and go to bed.`,
        outcome: {
          stats: { exposure: 2 },
          setFlags: { shard_kept_close: true },
        },
      },
    ],
  },
};
