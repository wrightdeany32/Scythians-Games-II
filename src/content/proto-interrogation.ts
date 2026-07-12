// ============================================================================
// content/proto-interrogation.ts — THE INTERROGATION PROTOTYPE (Stave's §3,
// Vigil's de-risk steer, Azimuth's pre-designed read). A standalone mini-db,
// NOT part of any campaign: one witness, a short info-planting preamble, then
// the sit-down — three neutral-valence questions, each opening a different
// door in the same person, the others closing behind the one you pick.
//
// EVERY PROSE STRING BELOW IS A MARKED PLACEHOLDER — Stave authors the real
// witness the day Dean gives the steer; the structure is what this file
// ships. The structural pattern under test:
//
//  · NOTICING IS A PICK (Azimuth §2): each preamble card offers a neutral
//    attend/pass choice; attending sets a percept flag (pi_saw_*). The trace
//    then shows what the reader demonstrably saw BEFORE the question choice,
//    so the noticed→asked correlation reads straight off the record.
//  · THE QUESTIONS ARE NEVER GATED on the percept flags — the correlation
//    must be behavioral, not forced. All three doors stand open; which one a
//    reader walks through is the datum.
//  · EACH QUESTION CARRIES A NAMED SPECIFIC (the fork taxonomy: specificity
//    is the gravity that pulls even a cautious reader into committing).
//  · ONE DOOR ONLY: the pick queues its answer card; the scene ends there.
//    No re-entry action exists — the other two answers are structurally
//    unreachable this run (the anti-noun applied to dialogue).
//
// Run: npm run coldread:proto <seed> [picks...]   (the courier relay)
// ============================================================================

import type { ContentDB, GameEvent, LocationAction } from "../engine/types";

export const PROTO_CONTENT_ID = "proto-interrogation";

const events: Record<string, GameEvent> = {
  // ---- the preamble: three plantable details, noticing = a pick -------------
  pi_arrive: {
    id: "pi_arrive",
    title: "[placeholder]",
    body: `[STAVE — placeholder: arrival. The player comes to the place where the witness's world is visible before the witness is — an office, a porch, a counter. One plantable detail sits in view: THE DATES (something whose timeline doesn't add up, worn a half-inch too plainly).]`,
    choices: [
      {
        label: `[STAVE — attend: look longer at the dated thing.]`,
        outcome: { setFlags: { pi_saw_dates: true }, log: "[placeholder: what the closer look yields — a percept, never a conclusion.]", tone: "n", queueEvent: "pi_approach" },
      },
      {
        label: `[STAVE — pass: move on.]`,
        outcome: { log: "[placeholder: the detail slides by.]", tone: "n", queueEvent: "pi_approach" },
      },
    ],
  },
  pi_approach: {
    id: "pi_approach",
    title: "[placeholder]",
    body: `[STAVE — placeholder: the approach. Second plantable detail: THE MONEY (something paid for that shouldn't have been affordable, or unpaid that should have been).]`,
    choices: [
      {
        label: `[STAVE — attend: clock the money thing.]`,
        outcome: { setFlags: { pi_saw_money: true }, log: "[placeholder.]", tone: "n", queueEvent: "pi_smalltalk" },
      },
      {
        label: `[STAVE — pass.]`,
        outcome: { log: "[placeholder.]", tone: "n", queueEvent: "pi_smalltalk" },
      },
    ],
  },
  pi_smalltalk: {
    id: "pi_smalltalk",
    title: "[placeholder]",
    body: `[STAVE — placeholder: the witness talks before being asked anything. Third plantable detail: THE NAME (a person mentioned once, in passing, wrongly casually).]`,
    choices: [
      {
        label: `[STAVE — attend: hold onto the name.]`,
        outcome: { setFlags: { pi_saw_name: true }, log: "[placeholder.]", tone: "n", queueEvent: "pi_sitdown" },
      },
      {
        label: `[STAVE — pass.]`,
        outcome: { log: "[placeholder.]", tone: "n", queueEvent: "pi_sitdown" },
      },
    ],
  },

  // ---- the sit-down: three doors, one walkable --------------------------------
  pi_sitdown: {
    id: "pi_sitdown",
    title: "[placeholder]",
    body: `[STAVE — placeholder: the sit-down. The witness across from you, and the moment where the player chooses WHICH question — three neutral-valence labels, each carrying a NAMED SPECIFIC from the preamble, none marked as right.]`,
    choices: [
      {
        label: `[STAVE — the DATES question: neutral valence, names the specific.]`,
        outcome: { setFlags: { pi_asked: "dates" }, log: "[placeholder: the question, asked.]", tone: "n", queueEvent: "pi_answer_dates" },
      },
      {
        label: `[STAVE — the MONEY question.]`,
        outcome: { setFlags: { pi_asked: "money" }, log: "[placeholder.]", tone: "n", queueEvent: "pi_answer_money" },
      },
      {
        label: `[STAVE — the NAME question.]`,
        outcome: { setFlags: { pi_asked: "name" }, log: "[placeholder.]", tone: "n", queueEvent: "pi_answer_name" },
      },
    ],
  },

  // ---- the three answers: true, partial, non-converging ----------------------
  pi_answer_dates: {
    id: "pi_answer_dates",
    title: "[placeholder]",
    body: `[STAVE — placeholder: the TIMELINE answer — true, partial, percept-grade (what the witness says, in their voice, never narrator-confirmed). Points somewhere real that the other two answers never touch.]`,
    choices: [
      { label: `[STAVE — close-out: thank them and go.]`, outcome: { setFlags: { pi_done: true }, log: "[placeholder: what rides home with you.]", tone: "n" } },
    ],
  },
  pi_answer_money: {
    id: "pi_answer_money",
    title: "[placeholder]",
    body: `[STAVE — placeholder: the NETWORK answer — same discipline, different direction.]`,
    choices: [
      { label: `[STAVE — close-out.]`, outcome: { setFlags: { pi_done: true }, log: "[placeholder.]", tone: "n" } },
    ],
  },
  pi_answer_name: {
    id: "pi_answer_name",
    title: "[placeholder]",
    body: `[STAVE — placeholder: the GRIEF answer — same discipline, third direction. The three somewhere-reals don't converge.]`,
    choices: [
      { label: `[STAVE — close-out.]`, outcome: { setFlags: { pi_done: true }, log: "[placeholder.]", tone: "n" } },
    ],
  },
};

// The entry action, cave-pattern: its outcome queues the first preamble card.
const entryAction: LocationAction = {
  id: "pi_act_visit",
  name: "[STAVE — the visit, diegetically named.]",
  sub: "[STAVE — the one-line framing of why you're going.]",
  cost: 1,
  outcome: { log: "[placeholder: setting out.]", tone: "n", queueEvent: "pi_arrive" },
};

export const protoDb: ContentDB = {
  openingLog: "[STAVE — placeholder opening line.]",
  events,
  actions: [entryAction],
  towns: {
    proto_town: { id: "proto_town", name: "[placeholder]", tiersOffered: ["outer"], amenities: [], reachable: true, fixtures: [] },
  },
  factions: {},
  traits: {},
  items: {},
  npcs: {},
  names: { first: ["P"], last: ["Placeholder"] },
};
