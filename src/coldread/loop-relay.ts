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
  // Protocol v0.3 §2: the journal is ON for Run Reads — the consultable
  // "what you know" surface is the fairness prerequisite (without it, Q4
  // measures memory decay, not reading). Scene reads (relay.ts) have no day
  // screen, so this is the one console the ruling touches.
  showJournal: true,
});

// Reader numbers are POSITIONS in the presented list (1..k); the screen's
// options carry engine indices (hidden-locked choices are absent, so position
// and index can diverge). Translate at the door, both directions.
for (let i = 0; i < picks.length; i++) {
  if (s.done) { process.stderr.write(`!! extra pick ${picks[i]} but the run is already over\n`); break; }
  const opt = s.current.options[picks[i] - 1];
  if (!opt) { process.stderr.write(`!! pick #${picks[i]} rejected on ${s.current.card}: no such option\n`); process.exit(1); }
  const res = s.pick(opt.index, "");
  if (!res.ok) { process.stderr.write(`!! pick #${picks[i]} rejected on ${s.current.card}: ${res.reason} (greyed options can't be taken)\n`); process.exit(1); }
}

// ---- reader-facing screen -> stdout (paste this, nothing else) --------------
const out: string[] = [];
if (picks.length === 0) { out.push(FRAMING_SCRIPT, "", "---", ""); }   // first screen carries the framing script
out.push(s.current.prose);
if (s.current.options.length) {
  out.push("");
  s.current.options.forEach((o, pos) => out.push(`${pos + 1}. ${o.label}${o.available ? "" : "  (unavailable)"}`));
}
process.stdout.write(out.join("\n") + "\n");

// ---- operator metadata -> stderr (never shown to the reader) ----------------
process.stderr.write(
  `\n[operator] seed=${seed} · kind=${s.current.kind} · card=${s.current.card} · day=${s.current.day} · step=${s.current.step} · done=${s.done}` +
  (s.done ? ` · RUN OVER (${s.current.terminal}) → run the debrief (pack §3)\n` : "\n"));
