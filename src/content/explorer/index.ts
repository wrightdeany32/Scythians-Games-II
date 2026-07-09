// ============================================================================
// content/explorer/index.ts — assembles the Explorer campaign into a complete
// runnable ContentDB: the frozen cave slice (imported as data, byte-untouched)
// plus the content wave's eight threads (Loom's 14-file pack, wired).
//
// The world: one town at the edge of the woods; five fixtures (Reese, Doug,
// Marie, Nora, Dale); White's Hall out past the reservoir. One run is ~two
// weeks of calendar (lastDay 14, a shakedown placeholder — the real number is
// set with Armature against the bots' thread-exhaustion measurement).
//
// Tuning decisions carried here (all flagged in the build report):
//   · exposure: STICKY (coolPerDay 0) — disturbance accumulates; the watching
//     never lifts. Stages at 3 / 6 / 9 of max 12. No single-threshold
//     consequence (the stages ARE the consequence; the default event id
//     resolves to nothing by design).
//   · lens: the locked four-flavor vocabulary, skeptic as the null pole.
//   · terminals: grip zero + the two authored run-enders.
//   · crossRun: denied_knife / held_truth persist (existence, never meaning).
// ============================================================================

import type { ContentDB, Npc } from "../../engine/types";
import { caveEvents, caveEntryAction, caveItems } from "../cave";
import { openingEvents, openingDoors, openingQueue } from "./opening";
import { dougActions, dougEvents } from "./doug";
import { marieEvents } from "./marie";
import { noraActions, noraEvents } from "./nora";
import { daleActions, daleEvents } from "./dale";
import { graveActions, graveEvents } from "./grave";
import { researchActions, researchEvents } from "./research";
import { pressureEvents } from "./pressure";
import { breatherActions } from "./breathers";
import { returnActions, returnEvents } from "./whitesreturn";
import { endingEvents } from "./ending";
import { convergenceDoors, convergenceEvents } from "./convergence";

export const EXPLORER_CONTENT_ID = "explorer";

const npcs: Record<string, Npc> = {
  reese: { id: "reese", name: "Reese", role: "caving partner", ability: 55, traits: [], loyalty: 70, isFixture: true, relationship: "ally" },
  doug: { id: "doug", name: "Doug", role: "the friend who picks you up at six", ability: 50, traits: [], loyalty: 80, isFixture: true, relationship: "ally" },
  marie: { id: "marie", name: "Aunt Marie", role: "family", ability: 40, traits: [], loyalty: 75, isFixture: true, relationship: "ally" },
  nora: { id: "nora", name: "Nora", role: "the cousin who pulls threads", ability: 60, traits: [], loyalty: 65, isFixture: true, relationship: "ally" },
  dale: { id: "dale", name: "Dale", role: "the man who told the truth", ability: 45, traits: [], loyalty: 50, isFixture: true, relationship: "neutral" },
};

export const explorerDb: ContentDB = {
  openingLog: "The town sits where the map starts lying — the last place with a name before the woods take over.",
  openingQueue,
  events: {
    ...caveEvents,        // the frozen slice, byte-untouched — plays inside this run
    ...openingEvents,
    ...dougEvents,
    ...marieEvents,
    ...noraEvents,
    ...daleEvents,
    ...graveEvents,
    ...researchEvents,
    ...pressureEvents,
    ...returnEvents,
    ...endingEvents,
    ...convergenceEvents,
  },
  actions: [
    caveEntryAction,      // the first trip (retires on cave_done)
    ...dougActions,
    ...noraActions,
    ...daleActions,
    ...graveActions,
    ...researchActions,
    ...breatherActions,
    ...returnActions,
  ],
  towns: {
    town_edge: {
      id: "town_edge",
      name: "The Town",
      tiersOffered: ["outer"],
      amenities: [],
      reachable: true,
      fixtures: ["reese", "doug", "marie", "nora", "dale"],
    },
  },
  factions: {},
  traits: {},
  items: caveItems,
  npcs,
  doors: [...openingDoors, ...convergenceDoors],
  endings: [
    // The narrow door, flags-only: past the calendar, the run that never went
    // back gets its authored terminal. (Belt-and-suspenders `when`: terminal
    // precedence already ends a returned run before the selector can look.)
    { eventId: "ux_ending_never_returned", when: { kind: "noflag", flag: "run_end_whites_return" } },
  ],
  tuning: {
    exposure: {
      max: 12,
      coolPerDay: 0,   // sticky: disturbance accumulates; the weather never lifts
      stages: [
        { at: 3, eventId: "ux_pressure_stage1" },
        { at: 6, eventId: "ux_pressure_stage2" },
        { at: 9, eventId: "ux_pressure_stage3" },
      ],
    },
    terminal: {
      onGripZero: true,
      flags: ["run_end_whites_return", "run_end_never_returned"],
    },
    lens: {
      vocabulary: ["spiritual", "physics", "institutional", "skeptic"],
      nullFlavor: "skeptic",
    },
    calendar: {
      lastDay: 14,                    // shakedown placeholder; real number measured with Armature
      deferForScheduled: ["ux_doug_break"],    // defer-terminal (unanimous): the break never dies to the guillotine
    },
    crossRun: { harvestFlags: ["denied_knife", "held_truth"] },
  },
  names: { first: ["Alex", "Sam", "Jo"], last: ["Vance", "Fields", "Marsh"] },
};
