// ============================================================================
// engine/journal.ts — the journal surface (the Run-Read prerequisite; shape
// blessed by Loom: what-you-know, flag-derived, stored nowhere).
//
// ONE function: derive the player's journal from the content-authored mapping
// (db.journal) and the run's flags, on read, every time. Nothing is written
// back — there is no journal state anywhere in GameState, so the surface can
// never drift from the flags that justify it (invariant #2's mechanism,
// applied to memory support).
//
// THE GUARDS (the presentation-layer rules, held by shape):
//   · Percepts only — the mapping's lines say what the player has SEEN and
//     HEARD, never what they concluded (Loom's authoring rule; the linter
//     enforces the intent-note leak, the author enforces the register).
//   · No catalog — the return value is the lines that exist for THIS run,
//     full stop. No counts, no totals, no placeholder slots, no "there's
//     more": a line the player hasn't earned does not exist, and the shape
//     of what remains is never exposed (renderers cannot count the unseen —
//     the mapping itself never reaches them through this accessor).
//   · Import-allowlist discipline (WO-4, Armature's contract): THIS accessor
//     is renderer-legal. The mapping (db.journal) is not — a renderer that
//     imports the db to enumerate unearned lines is the breach; review holds
//     that wall.
//
// The fairness purpose (Azimuth's ask): a reader eight days into a run can
// consult what their character knows without replaying their own memory —
// and what a reader CONSULTED is presentation-record data for the protocol.
// ============================================================================

import type { ContentDB, GameState } from "./types";
import { evalCondition } from "./engine";

// The player's journal, derived on read: every mapping line whose condition
// holds right now, in authored order. Empty array when content ships no
// mapping (the surface simply doesn't exist for that pack).
export function journalLines(g: GameState, db: ContentDB): string[] {
  return (db.journal ?? []).filter((e) => evalCondition(e.when, g)).map((e) => e.line);
}
