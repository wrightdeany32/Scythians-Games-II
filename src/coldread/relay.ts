// ============================================================================
// coldread/relay.ts — the RELAY generator for a courier-run cold read (Batch A
// as Dean runs it: the operator relays screens to a separate fresh reader
// instance and brings replies back). Given the frozen seed and the reader's
// picks so far (1-based, as the reader gave them), it prints the exact
// reader-facing screen to stdout — framing script included on the first screen.
// Operator metadata goes to STDERR so stdout stays pure reader-facing.
//
//   npx tsx src/coldread/relay.ts <seed> [pick1 pick2 ...]
//
// Reads the same frozen cave-b3 Session; changes no presentation.
// ============================================================================

import { caveDb, CAVE_CONTENT_ID } from "../content/cave.db";
import { Session } from "./session";
import { FRAMING_SCRIPT } from "./scripts";

const BUILD_TAG = "cave-b4";

const args = process.argv.slice(2);
const seed = Number(args[0]);
if (!Number.isFinite(seed)) { process.stderr.write("usage: relay <seed> [picks...]\n"); process.exit(1); }
const picks = args.slice(1).map(Number); // 1-based reader choices

const s = new Session(caveDb, {
  contentId: CAVE_CONTENT_ID, seed, buildTag: BUILD_TAG,
  entryActionId: "ux_act_cave_reese", tier: "outer", townId: "region", mode: "read",
});

// Reader numbers are POSITIONS in the presented list (1..k); the screen's
// options carry engine indices (hidden-locked choices are absent, so position
// and index can diverge). Translate at the door, both directions.
for (let i = 0; i < picks.length; i++) {
  if (s.done) { process.stderr.write(`!! extra pick ${picks[i]} but the scene already ended\n`); break; }
  const opt = s.current.options[picks[i] - 1];
  if (!opt) { process.stderr.write(`!! pick #${picks[i]} rejected on ${s.current.card}: no such option\n`); process.exit(1); }
  const res = s.pick(opt.index, "");
  if (!res.ok) { process.stderr.write(`!! pick #${picks[i]} rejected on ${s.current.card}: ${res.reason} (greyed options can't be taken)\n`); process.exit(1); }
}

// ---- reader-facing screen -> stdout (paste this, nothing else) --------------
const out: string[] = [];
if (picks.length === 0) { out.push(FRAMING_SCRIPT, "", "---", ""); }  // first screen carries the framing script
out.push(s.current.prose);
if (s.current.options.length) {
  out.push("");
  s.current.options.forEach((o, pos) => out.push(`${pos + 1}. ${o.label}${o.available ? "" : "  (unavailable)"}`));
}
process.stdout.write(out.join("\n") + "\n");

// ---- operator metadata -> stderr (never shown to the reader) ----------------
process.stderr.write(`\n[operator] seed=${seed} · card=${s.current.card} · step=${s.current.step} · done=${s.done}` +
  (s.done ? " · SCENE COMPLETE → run the debrief (pack §3)\n" : "\n"));
