// ============================================================================
// smoke/loopworld.ts — a DISPOSABLE, THEME-NEUTRAL loop-world ContentDB used
// only by the daily-loop harness (npm run loop). Like smoke/content.ts it is
// NOT game content — deliberately generic placeholders that exercise every
// WO-1/WO-2 codepath: creation-as-turn-zero played cards carrying coordinates,
// surface-routed actions, a chained scene entered from the day, flag-gated
// follow-ups, a met-door, a scheduled beat, a rest/recovery beat (grip must
// stay recoverable — the don't-bake-the-spiral discipline), research as an
// ordinary coordinated action, a deck registry with location- and
// thread-mounted decks, factions for the drift, and designed terminal flags.
//
// Pure declarative data — no functions, no Math.* (the content wall).
// Coordinate/flavor values are arbitrary smoke numbers, not tuning guidance.
// ============================================================================

import type { ContentDB } from "../engine/types";

export const loopDb: ContentDB = {
  openingLog: "A neutral morning.",

  // Creation is turn-zero: these cards run through the SceneRunner before the
  // first day menu, and the origin card the player picks carries the coordinate
  // and lens flavor that seed both centroids.
  openingQueue: ["lw_create"],

  tuning: {
    terminal: { onGripZero: true, flags: ["lw_taken"] },
    // All Weight-step switches deliberately ABSENT => off (the shipped default).
  },

  decks: [
    // Mounted by physical location: live whenever you're in region_one.
    { id: "deck:street", towns: ["region_one"], mapPos: { x: 2, y: 3 } },
    // Mounted by active thread: live only after the scene opened the thread.
    { id: "deck:undercurrent", mountFlag: "lw_scene_done", diamondCoord: { sanction: 0.8, vertical: -0.5 } },
  ],

  doors: [
    // A met-door: once the scene has been seen, a visitor comes calling on the
    // next day advance.
    { eventId: "lw_visitor", when: { kind: "flag", flag: "lw_scene_done" } },
  ],

  actions: [
    {
      id: "lw_work",
      name: "Put in a shift",
      sub: "Plain paid work.",
      cost: 1,
      outcome: { log: "You put in the hours.", tone: "n", stats: { money: 2 } },
    },
    {
      id: "lw_call",
      name: "Call your contact",
      sub: "Keep the connection warm.",
      surface: "phone",
      contact: "npc_contact",
      cost: 1,
      outcome: { log: "You catch up on the phone.", tone: "g", stats: { standing: 1 } },
    },
    {
      id: "lw_rest",
      name: "Take the evening off",
      sub: "A boring, necessary night in.",
      surface: "home",
      cost: 1,
      outcome: { log: "Nothing happens, on purpose. It helps.", tone: "g", stats: { grip: 1 } },
    },
    {
      id: "lw_research",
      name: "Dig through old files",
      sub: "Chase the explanation that suits you.",
      surface: "home",
      cost: 1,
      // Research is an ordinary card-resolution carrying a coordinate + flavor —
      // deliberate digging moves the centroids by the same mechanism as play.
      diamondCoord: { sanction: 0.4, vertical: -0.2 },
      lensFlavor: "lens_two",
      outcome: { log: "You read until the lines blur.", tone: "n", stats: { tradecraft: 1 } },
    },
    {
      id: "lw_venture",
      name: "Check out the old site",
      sub: "Somebody said something about the place.",
      surface: "map",
      place: "region_one",
      cost: 2,
      requires: { kind: "noflag", flag: "lw_scene_done" },   // one trip; retires after
      outcome: { log: "You head out to the site.", tone: "n", queueEvent: "lw_scene_1" },
    },
    {
      id: "lw_followup",
      name: "Ask around about the site",
      sub: "The day menu reflects what happened.",
      surface: "map",
      place: "region_one",
      cost: 1,
      requires: { kind: "flag", flag: "lw_scene_done" },     // flag-gated: appears only after the scene
      outcome: { log: "You ask around.", tone: "n", stats: { standing: 1 } },
    },
  ],

  events: {
    // --- creation (turn-zero, played cards) ---------------------------------
    lw_create: {
      id: "lw_create",
      once: "lw_creation_done",
      title: "Who You Are",
      body: "A neutral creation card. Your pick decides your origin.",
      choices: [
        { label: "The careful start", outcome: { log: "You start careful.", tone: "n", setFlags: { origin: "careful" }, queueEvent: "lw_origin_careful" } },
        { label: "The curious start", outcome: { log: "You start curious.", tone: "n", setFlags: { origin: "curious" }, queueEvent: "lw_origin_curious" } },
      ],
    },
    lw_origin_careful: {
      id: "lw_origin_careful",
      diamondCoord: { sanction: -0.5, vertical: 0.3 },
      lensFlavor: "lens_one",
      title: "The Careful Origin",
      body: "The origin card carries the coordinate that seeds your centroids.",
      choices: [{ label: "Go on", outcome: { log: "So it begins.", tone: "n" } }],
    },
    lw_origin_curious: {
      id: "lw_origin_curious",
      diamondCoord: { sanction: 0.5, vertical: -0.3 },
      lensFlavor: "lens_two",
      title: "The Curious Origin",
      body: "The origin card carries the coordinate that seeds your centroids.",
      choices: [{ label: "Go on", outcome: { log: "So it begins.", tone: "n" } }],
    },

    // --- the chained scene entered from the day menu -------------------------
    lw_scene_1: {
      id: "lw_scene_1",
      diamondCoord: { sanction: 0.6, vertical: -0.4 },
      title: "The Old Site",
      body: "The place is not quite as described. A neutral wrongness.",
      choices: [
        { label: "Look closer", outcome: { log: "You look closer than you meant to.", tone: "b", stats: { grip: -1 }, queueEvent: "lw_scene_2" } },
        { label: "Leave it alone", outcome: { log: "You leave it alone. A sensible day.", tone: "g", setFlags: { lw_scene_done: true, lw_scene_bailed: true } } },
      ],
    },
    lw_scene_2: {
      id: "lw_scene_2",
      diamondCoord: { sanction: 0.8, vertical: -0.5 },
      title: "Deeper In",
      body: "Something here will want a second visit.",
      choices: [
        {
          label: "Head home",
          outcome: {
            log: "You head home with more questions than you brought.",
            tone: "n",
            setFlags: { lw_scene_done: true },
            scheduleEvent: { eventId: "lw_promise", inDays: 2 },   // a timed beat: fires two mornings later
          },
        },
      ],
    },

    // --- the met-door's event -------------------------------------------------
    lw_visitor: {
      id: "lw_visitor",
      once: "lw_visitor_seen",
      title: "A Knock, The Next Morning",
      body: "Word travels. Someone wants to hear about the site.",
      choices: [{ label: "Tell them a little", outcome: { log: "You keep the strange parts to yourself.", tone: "n", stats: { standing: 1 } } }],
    },

    // --- the scheduled beat ----------------------------------------------------
    lw_promise: {
      id: "lw_promise",
      title: "As Promised",
      body: "The thing you set in motion arrives on schedule.",
      choices: [{ label: "See it through", outcome: { log: "It arrives right on time.", tone: "n" } }],
    },

    // --- the street deck (location-mounted; re-drawable for anti-repeat) --------
    lw_street_1: {
      id: "lw_street_1",
      tags: ["deck:street"],
      title: "Street Scene One",
      body: "A neutral street card.",
      choices: [{ label: "Fine", outcome: { log: "Street one.", tone: "n" } }],
    },
    lw_street_2: {
      id: "lw_street_2",
      tags: ["deck:street"],
      title: "Street Scene Two",
      body: "Another neutral street card.",
      choices: [{ label: "Fine", outcome: { log: "Street two.", tone: "n" } }],
    },

    // --- the undercurrent deck (thread-mounted; coordinated near the scene) -----
    lw_undercurrent_1: {
      id: "lw_undercurrent_1",
      tags: ["deck:undercurrent"],
      diamondCoord: { sanction: 0.7, vertical: -0.5 },
      title: "An Undercurrent",
      body: "A coordinated card that proximity should favor once you've drifted its way.",
      choices: [{ label: "Notice it", outcome: { log: "You notice it.", tone: "n" } }],
    },
  },

  towns: {
    region_one: {
      id: "region_one",
      name: "Region One",
      tiersOffered: ["outer"],
      amenities: [],
      reachable: true,
      fixtures: ["npc_contact"],
    },
  },

  factions: {
    faction_dawn: { id: "faction_dawn", name: "Dawn", homeTownId: "region_one", tier: "outer", rating: 60 },
    faction_dusk: { id: "faction_dusk", name: "Dusk", homeTownId: "region_one", tier: "outer", rating: 55 },
  },

  traits: {},
  items: {},

  npcs: {
    npc_contact: {
      id: "npc_contact",
      name: "A Contact",
      role: "fixer",
      ability: 60,
      brings: {},
      rollBrings: [],
      traits: [],
      loyalty: 70,
      isFixture: true,
      relationship: "neutral",
    },
  },

  names: { first: ["Alex"], last: ["Vance"] },
};
