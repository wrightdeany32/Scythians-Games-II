// ============================================================================
// smoke/content.ts — a DISPOSABLE, THEME-NEUTRAL ContentDB used only to prove
// the forked engine runs end-to-end. This is NOT the new game's content and is
// NOT a reskin: the names are deliberately generic placeholders ("Region One",
// "Task A"). Its only job is to exercise every engine codepath — the new stat
// vocabulary, radial-ring tiers, a scripted opening QUEUE with no questionnaire,
// real DECK-TAGGED situation cards drawn by deck, a d20 roll, traits/items/
// allies, a progress clock, the exposure threshold consequence, Elo, and
// save/load — so `npm run demo` and `tsc` go green on the bare engine.
//
// Real content is authored from scratch against Vigil's spec (Task 2), at which
// point this file is deleted. Keep it pure declarative data (no functions, no
// Math.*) — same discipline the real content will follow.
// ============================================================================

import type { ContentDB } from "../engine/types";

export const db: ContentDB = {
  // Content owns the opening line (lifted off the engine). Neutral on purpose.
  openingLog: "A new start.",

  // Scripted cold-open: these fire in order at new-game, before the daily loop.
  // Proves the openingQueue seam AND that creation can be played CARDS — there is
  // no questionnaire below, and newGame must not require one.
  openingQueue: ["ev_cold_open", "ev_create_origin"],

  // No questionnaire: creation is the played cards above. (Field is optional now.)

  // exposure tuning is omitted -> engine defaults (max 12, cool 1/day, threshold
  // 6, consequence "ev_exposure_discharge"). The real slice sets coolPerDay 0 for
  // a sticky meter; the neutral harness just needs the threshold path live.

  actions: [
    {
      id: "task_a",
      name: "Task A",
      sub: "A routine effort",
      cost: 1,
      outcome: { log: "Did Task A.", tone: "g", stats: { tradecraft: 1 } },
    },
    {
      id: "proving_ground",
      name: "Proving Ground",
      sub: "Make your case",
      cost: 1,
      // Gated like a real hub-clear: only unlocks once you've built enough
      // standing, so the day loop runs deck draws / clocks first.
      requires: { kind: "stat", stat: "standing", op: ">=", value: 4 },
      isClear: true,
      outcome: {
        roll: {
          tag: "prove",
          statMod: "tradecraft",
          target: 8,
          win: { log: "Cleared the proving ground.", tone: "g", stats: { standing: 2 } },
          lose: { log: "Came up short.", tone: "b", stats: { exposure: 1 } },
        },
      },
    },
  ],

  events: {
    // --- the scripted opening (queued; decks/tiers are bypassed for queued cards) ---
    ev_cold_open: {
      id: "ev_cold_open",
      once: "seen_cold_open",
      title: "Setting Out",
      body: "A neutral cold-open card.",
      choices: [{ label: "Begin", outcome: { log: "You set out.", tone: "n", setFlags: { creation_started: true } } }],
    },
    ev_create_origin: {
      id: "ev_create_origin",
      once: "creation_done",
      title: "Who You Are",
      body: "Creation as a played card (no questionnaire).",
      choices: [
        { label: "Path A", outcome: { log: "Path A chosen.", tone: "g", setFlags: { origin: "a" }, stats: { standing: 2, tradecraft: 1 } } },
        { label: "Path B", outcome: { log: "Path B chosen.", tone: "g", setFlags: { origin: "b" }, stats: { money: 3 } } },
      ],
    },

    // --- the situation deck (real tag, drawn by deck) ---
    ev_knock: {
      id: "ev_knock",
      tags: ["deck:situations"],
      once: "seen_knock",
      title: "A Knock at the Door",
      body: "Someone needs a favor.",
      choices: [
        { label: "Help them", outcome: { log: "You helped.", tone: "g", stats: { standing: 1 }, grantTraits: ["helpful"] } },
        { label: "Turn them away", outcome: { log: "You declined.", tone: "n", stats: { exposure: 1 } } },
        // A grip-gated reply: invisible while grounded, the only read once grip frays.
        { label: "[unmoored] It isn't a person at all", requires: { kind: "stat", stat: "grip", op: "<=", value: 3 }, outcome: { log: "You stopped trusting the door.", tone: "b", stats: { grip: -1 } } },
      ],
    },
    ev_lead: {
      id: "ev_lead",
      tags: ["deck:situations"],
      title: "A Loose Thread",
      body: "There's more here if you keep pulling.",
      choices: [
        { label: "Pull the thread", outcome: { log: "You pulled the thread.", tone: "n", advanceClock: { id: "thread", by: 1, label: "The Thread", max: 2, onFull: "ev_payoff" } } },
      ],
    },
    ev_prowl: {
      id: "ev_prowl",
      tags: ["deck:situations"],
      title: "Push Your Luck",
      body: "You could go somewhere you shouldn't.",
      choices: [
        { label: "Push in", outcome: { log: "You pushed in.", tone: "n", stats: { exposure: 2, tradecraft: 1 } } },
        { label: "Stay clean", outcome: { log: "You held back.", tone: "n", stats: { standing: 1 } } },
      ],
    },
    // Payoff is NOT in the situation deck — it only arrives via the clock queue,
    // which proves deck-scoped draw (it's never pulled directly from situations).
    ev_payoff: {
      id: "ev_payoff",
      title: "It Comes Together",
      body: "The thread leads somewhere.",
      choices: [{ label: "Follow it", outcome: { log: "It paid off.", tone: "g", stats: { standing: 2 } } }],
    },
    // Referenced by endDay()/tuning when exposure crosses the threshold. Flavored
    // as the unknown noticing you (the slice keeps this; here it's neutral).
    ev_exposure_discharge: {
      id: "ev_exposure_discharge",
      title: "Something Noticed",
      body: "Your exposure has drawn attention.",
      choices: [{ label: "Go quiet", outcome: { log: "You went quiet.", tone: "b", stats: { exposure: -3 }, setFlags: { aware_of_you: true } } }],
    },
  },

  towns: {
    region_one: {
      id: "region_one",
      name: "Region One",
      tiersOffered: ["outer"],
      amenities: ["placeholder_amenity"],
      reachable: true,
      fixtures: ["npc_contact"],
    },
  },

  factions: {
    faction_alpha: { id: "faction_alpha", name: "Alpha", homeTownId: "region_one", tier: "outer", rating: 70 },
    faction_beta: { id: "faction_beta", name: "Beta", homeTownId: "region_one", tier: "outer", rating: 55 },
  },

  traits: {
    helpful: { id: "helpful", source: "trait", label: "Helpful", stats: { standing: 1 } },
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
      brings: { standing: 1 },
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
  },
};
