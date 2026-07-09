// ============================================================================
// coldread/loop-relay.ts — the RELAY generator for a courier-run LOOP cold read
// (the campaign counterpart to relay.ts). Given the frozen seed and the reader's
// picks so far (1-based, as the reader gave them), it replays the LoopSession to
// that point and prints the exact reader-facing screen to stdout — day menu or
// scene — with the framing script on the first screen. Operator metadata goes to
// STDERR so stdout stays pure reader-facing (the strict-cold courier split).
//
//   npx tsx src/coldread/loop-relay.ts <seed> [pick1 pick2 ...]
//
// A day screen's options are the day's actions by their diegetic names plus
// "call it a day"; a scene screen is the same shape relay.ts prints. No ids,
// costs, energy, stats, or card names ever reach stdout.
// ============================================================================

import { explorerDb, EXPLORER_CONTENT_ID } from "../content/explorer";
import { LoopSession } from "./loop-session";
import { FRAMING_SCRIPT } from "./scripts";

const BUILD_TAG = "explorer-loop-v1";

const args = process.argv.slice(2);
const seed = Number(args[0]);
if (!Number.isFinite(seed)) { process.stderr.write("usage: loop-relay <seed> [picks...]\n"); process.exit(1); }
const picks = args.slice(1).map(Number);   // 1-based reader choices

const s = new LoopSession(explorerDb, {
  contentId: EXPLORER_CONTENT_ID, seed, buildTag: BUILD_TAG,
  tier: "outer", townId: "town_edge", mode: "read",
});

for (let i = 0; i < picks.length; i++) {
  if (s.done) { process.stderr.write(`!! extra pick ${picks[i]} but the run is already over\n`); break; }
  const res = s.pick(picks[i] - 1, "");
  if (!res.ok) { process.stderr.write(`!! pick #${picks[i]} rejected on ${s.current.card}: ${res.reason} (greyed options can't be taken)\n`); process.exit(1); }
}

// ---- reader-facing screen -> stdout (paste this, nothing else) --------------
const out: string[] = [];
if (picks.length === 0) { out.push(FRAMING_SCRIPT, "", "---", ""); }   // first screen carries the framing script
out.push(s.current.prose);
if (s.current.options.length) {
  out.push("");
  for (const o of s.current.options) out.push(`${o.index + 1}. ${o.label}${o.available ? "" : "  (unavailable)"}`);
}
process.stdout.write(out.join("\n") + "\n");

// ---- operator metadata -> stderr (never shown to the reader) ----------------
process.stderr.write(
  `\n[operator] seed=${seed} · kind=${s.current.kind} · card=${s.current.card} · day=${s.current.day} · step=${s.current.step} · done=${s.done}` +
  (s.done ? ` · RUN OVER (${s.current.terminal}) → run the debrief (pack §3)\n` : "\n"));
