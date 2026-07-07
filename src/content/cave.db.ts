// ============================================================================
// content/cave.db.ts — assembles the Cave scene into a complete, runnable
// ContentDB. The cave chain is authored in cave.ts; this file is the thin glue
// that wraps it with the empty stubs a self-contained scene needs (no
// questionnaire, no towns/factions, minimal names) so newGame() and the
// cold-read Session can run it standalone.
// ============================================================================

import type { ContentDB } from "../engine/types";
import { caveEvents, caveEntryAction, caveItems } from "./cave";

export const CAVE_CONTENT_ID = "cave";

export const caveDb: ContentDB = {
  openingLog: "The city's full of places you're not supposed to be. You've gotten good at being in them.",
  events: caveEvents,
  actions: [caveEntryAction],
  towns: {},
  factions: {},
  traits: {},
  items: caveItems,
  names: { first: ["Alex"], last: ["Vance"] },
};
