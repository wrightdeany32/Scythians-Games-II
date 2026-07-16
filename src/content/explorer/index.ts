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
//     never lifts. Stages at 3 / 5 / 6 of max 12 (the deep-run-climax ladder,
//     Loom's intent + the bots' data). No single-threshold consequence (the
//     stages ARE the consequence; the default event id resolves to nothing).
//   · lens: the locked four-flavor vocabulary, skeptic as the null pole.
//   · terminals: grip zero + the two authored run-enders.
//   · crossRun: denied_knife / held_truth persist (existence, never meaning).
// ============================================================================

import type { ContentDB, Npc } from "../../engine/types";
import { caveEvents, caveEntryAction, caveItems } from "../cave";
import { openingEvents, openingDoors, openingQueue } from "./opening";
import { explorerCreationCommon } from "./creation";
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
import { deniseDoors, deniseActions, deniseEvents } from "./denise";

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
  // The start-deck (spec v3.3 §7; engine: src/engine/creation.ts). BACKFILL-SAFE:
  // the legacy `openingQueue` above still drives every harness that doesn't pass
  // a `startId`, so nothing here changes existing runs — the deck is OPT-IN
  // (LoopSession opts.startDeck / newGame startId) and FLIPS ON as its own
  // named milestone after BR-4 (Azimuth's comparability ruling). The common
  // phase is Loom's finalized v2 creation ride (see ./creation.ts); when the
  // corner writers' starts land, they become deck cards with qualifiers and
  // the deal picks among them.
  creationCommon: explorerCreationCommon,
  starts: [
    {
      id: "start_explorer_reunion",
      townId: "town_edge",
      tier: "outer",
      openingQueue: ["ux_explorer_opening"],   // the reunion — the same cold-open the legacy path uses
      coord: { sanction: 0.6, vertical: 0 },   // register metadata (the Explorer corner); read by NOTHING at runtime
      // No qualifiers → always eligible → the deck's fallback. No seedFlags: the
      // opening card sets origin_fresh_start / origin_last_door from the player's
      // OWN choice, not the deal.
    },
  ],
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
    ...deniseEvents,
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
    ...deniseActions,
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
  doors: [...openingDoors, ...convergenceDoors, ...deniseDoors],
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
      // The 3/5/6 ladder (Loom's intent + the bots' data): the three main
      // disturbing acts — the copy (+2), the rangers (+2), the vault (+2) —
      // carry the committed-deep player to exactly 6, so the apex (and the
      // dale_bond grace that lives there) lands for that population without
      // a research dig casting the deciding vote. Trajectories confirmed the
      // three-act player tops 6 (7 only via an extra deep dig).
      stages: [
        { at: 3, eventId: "ux_pressure_stage1" },
        { at: 5, eventId: "ux_pressure_stage2" },
        { at: 6, eventId: "ux_pressure_stage3" },
      ],
    },
    terminal: {
      onGripZero: true,
      flags: ["run_end_whites_return", "run_end_never_returned", "run_end_pursuit"],   // the pursuit's authored terminal (went_after_dale is its HARVEST flag, not the terminal)
    },
    lens: {
      vocabulary: ["spiritual", "physics", "institutional", "skeptic"],
      nullFlavor: "skeptic",
    },
    calendar: {
      lastDay: 14,                    // shakedown placeholder; real number measured with Armature
      deferForScheduled: ["ux_doug_break", "ux_pursue_authorities", "ux_pursue_drastic"],   // defer-terminal: no climax dies to the guillotine (the break; a mid-flight pursuit)
    },
    crossRun: { harvestFlags: ["denied_knife", "held_truth", "dale_suspected", "went_after_dale"] },   // the cross-run jewel's carriers (Denise)
    // THE RETUNE (2026-07-11 — Azimuth's window ruling closes the loop the bots
    // opened): the four Weight/fire switches ship ON at measured, ruled doses.
    // The pack has no random-draw decks yet, so nothing in the wired game
    // shifts today (harness outputs byte-identical, verified) — the first
    // deck-borne content inherits tuned behavior instead of OFF defaults.
    // Loopworld stays OFF (the A/B rig's baseline substrate); the cave stays
    // frozen on its byte-identity gate.
    diamondProximity: { enabled: true, strength: 0.3 },   // ruled window 15–30% relative, target ~22–25%; dose-response sweep: 0.30 → +22%
    lensBias: { enabled: true, strength: 0.3 },           // contract window 10–20%; measured +18%, twice (A/B + sweep self-check)
    antiRepeat: { enabled: true },                        // defaults (factor 0.5, memory 5); measured 26% → 21.7% immediate-repeat
    bandNoise: { enabled: true },                         // default p 0.2; measured 19.3% adjacent-only leak, off-is-off verified
  },
  names: { first: ["Alex", "Sam", "Jo"], last: ["Vance", "Fields", "Marsh"] },
};
