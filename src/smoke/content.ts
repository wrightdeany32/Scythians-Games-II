// ============================================================================
// smoke/content.ts — a DISPOSABLE, THEME-NEUTRAL ContentDB used only to prove
// the forked engine runs end-to-end. This is NOT the new game's content and is
// NOT a reskin: the names are deliberately generic placeholders ("Region One",
// "Task A"). Its only job is to exercise every engine codepath — questionnaire,
// actions, events, a d20 roll, traits/items/allies, a progress clock, Elo, and
// save/load — so `npm run demo` and `tsc` go green on the bare engine.
//
// Real content is authored from scratch against Vigil's design spec (Task 2),
// at which point this file is deleted. Keep it pure declarative data (no
// functions, no Math.*) — same discipline the real content will follow.
// ============================================================================

import type { ContentDB } from "../engine/types";

export const db: ContentDB = {
  questionnaire: {
    questions: [
      {
        q: "Placeholder origin question (sets archetype + base stats)?",
        answers: [
          { label: "Path A", archetype: "Placeholder A", base: { skill: 2, reputation: 1 }, flag: "origin_a" },
          { label: "Path B", archetype: "Placeholder B", base: { skill: 1, money: 3 } },
        ],
      },
      {
        q: "Placeholder follow-up question (patches stats)?",
        answers: [
          { label: "Tweak A", patch: { reputation: 1 } },
          { label: "Tweak B", patch: { money: 2 }, flag: "tweak_b" },
        ],
      },
    ],
  },

  // A couple of generic actions. The "proving_ground" action carries a d20 roll
  // and is flagged isClear so the demo can detect a hub-clear, exactly like a
  // real game would.
  actions: [
    {
      id: "task_a",
      name: "Task A",
      sub: "A routine effort",
      cost: 1,
      outcome: { log: "Did Task A.", tone: "g", stats: { skill: 1 } },
    },
    {
      id: "proving_ground",
      name: "Proving Ground",
      sub: "Make your case",
      cost: 1,
      // Gated like a real hub-clear: only unlocks once you've built enough
      // reputation, so the day loop runs events/clocks first.
      requires: { kind: "stat", stat: "reputation", op: ">=", value: 4 },
      isClear: true,
      outcome: {
        roll: {
          tag: "prove",
          statMod: "skill",
          target: 8,
          win: { log: "Cleared the proving ground.", tone: "g", stats: { reputation: 2 } },
          lose: { log: "Came up short.", tone: "b", stats: { heat: 1 } },
        },
      },
    },
  ],

  events: {
    // A simple branching event with a gated choice.
    ev_intro: {
      id: "ev_intro",
      once: "seen_intro",
      title: "A Knock at the Door",
      body: "Someone needs a favor.",
      choices: [
        { label: "Help them", outcome: { log: "You helped.", tone: "g", stats: { reputation: 1 }, grantTraits: ["helpful"] } },
        { label: "Turn them away", outcome: { log: "You declined.", tone: "n", stats: { heat: 1 } } },
        { label: "Call in a contact (needs reputation)", requires: { kind: "stat", stat: "reputation", op: ">=", value: 3 }, outcome: { log: "Your contact handled it.", tone: "g" } },
      ],
    },
    // An event that advances a progress clock; when full it queues ev_payoff.
    ev_lead: {
      id: "ev_lead",
      title: "A Loose Thread",
      body: "There's more here if you keep pulling.",
      choices: [
        { label: "Pull the thread", outcome: { log: "You pulled the thread.", tone: "n", advanceClock: { id: "thread", by: 1, label: "The Thread", max: 2, onFull: "ev_payoff" } } },
      ],
    },
    ev_payoff: {
      id: "ev_payoff",
      title: "It Comes Together",
      body: "The thread leads somewhere.",
      choices: [{ label: "Follow it", outcome: { log: "It paid off.", tone: "g", stats: { reputation: 2 } } }],
    },
    // Referenced by endDay() when heat gets high — keep it so that path is live.
    ev_heat: {
      id: "ev_heat",
      title: "Unwanted Attention",
      body: "Your heat has drawn notice.",
      choices: [{ label: "Lay low", outcome: { log: "You laid low.", tone: "n", stats: { heat: -2 } } }],
    },
  },

  towns: {
    region_one: {
      id: "region_one",
      name: "Region One",
      tiersOffered: ["street"],
      amenities: ["placeholder_amenity"],
      reachable: true,
      fixtures: ["npc_contact"],
    },
  },

  teams: {
    team_alpha: { id: "team_alpha", name: "Alpha", homeTownId: "region_one", tier: "street", rating: 70 },
    team_beta: { id: "team_beta", name: "Beta", homeTownId: "region_one", tier: "street", rating: 55 },
  },

  traits: {
    helpful: { id: "helpful", source: "trait", label: "Helpful", stats: { reputation: 1 } },
  },

  items: {
    notebook: { id: "notebook", source: "item", label: "Notebook", slot: "tool", rollMods: [{ tag: "prove", amount: 1 }] },
  },

  npcs: {
    npc_contact: {
      id: "npc_contact",
      name: "A Contact",
      role: "fixer",
      ability: 60,
      brings: { reputation: 1 },
      rollBrings: [{ tag: "prove", amount: 1 }],
      traits: [],
      loyalty: 70,
      isFixture: true,
      relationship: "neutral",
    },
  },

  names: {
    first: ["Alex", "Sam", "Jordan", "Riley", "Casey"],
    last: ["Vance", "Cole", "Reyes", "Okafor", "Lindqvist"],
    teamA: ["North", "Iron", "Harbor"],
    teamB: ["Guild", "Union", "Watch"],
  },
};
