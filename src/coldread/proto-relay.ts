// ============================================================================
// coldread/proto-relay.ts — the courier relay for the INTERROGATION PROTOTYPE
// (Stave's one-beat de-risk read; the cave relay's exact pattern, pointed at
// the proto mini-db). Same rules: stdout is pure reader-facing, operator
// metadata on stderr, reader numbers are POSITIONS translated at the door.
//
//   npx tsx src/coldread/proto-relay.ts <seed> [pick1 pick2 ...]
// ============================================================================

import { protoDb, PROTO_CONTENT_ID } from "../content/proto-interrogation";
import { Session } from "./session";
import { FRAMING_SCRIPT } from "./scripts";

const BUILD_TAG = "proto-interrogation-v0";

const args = process.argv.slice(2);
const seed = Number(args[0]);
if (!Number.isFinite(seed)) { process.stderr.write("usage: proto-relay <seed> [picks...]\n"); process.exit(1); }
const picks = args.slice(1).map(Number);   // 1-based reader choices

const s = new Session(protoDb, {
  contentId: PROTO_CONTENT_ID, seed, buildTag: BUILD_TAG,
  entryActionId: "pi_act_visit", tier: "outer", townId: "proto_town", mode: "read",
});

for (let i = 0; i < picks.length; i++) {
  if (s.done) { process.stderr.write(`!! extra pick ${picks[i]} but the scene already ended\n`); break; }
  const opt = s.current.options[picks[i] - 1];
  if (!opt) { process.stderr.write(`!! pick #${picks[i]} rejected on ${s.current.card}: no such option\n`); process.exit(1); }
  const res = s.pick(opt.index, "");
  if (!res.ok) { process.stderr.write(`!! pick #${picks[i]} rejected on ${s.current.card}: ${res.reason}\n`); process.exit(1); }
}

// ---- reader-facing screen -> stdout (paste this, nothing else) --------------
const out: string[] = [];
if (picks.length === 0) { out.push(FRAMING_SCRIPT, "", "---", ""); }
out.push(s.current.prose);
if (s.current.options.length) {
  out.push("");
  s.current.options.forEach((o, pos) => out.push(`${pos + 1}. ${o.label}${o.available ? "" : "  (unavailable)"}`));
}
process.stdout.write(out.join("\n") + "\n");

// ---- operator metadata -> stderr (never shown to the reader) ----------------
process.stderr.write(`\n[operator] seed=${seed} · card=${s.current.card} · step=${s.current.step} · done=${s.done}` +
  (s.done ? " · SCENE COMPLETE → run the debrief (pack §3 + the locked completeness question)\n" : "\n"));
