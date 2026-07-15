// ============================================================================
// coldread/build-loop-transcript.ts — the loop counterpart to build-transcript.ts
// (which only knows the single-scene cave Session). Assembles a canonical
// transcript for a completed LoopSession run from a JSON spec (the seed, the
// reader's picks with optional verbatim notes, the debrief Q&A, the surface
// confirmation), replays the frozen explorer-loop build with those picks,
// appends the debrief, and writes coldreads/coldread_<contentId>_<build>_<seed>_<reader>.md.
//
//   npx tsx src/coldread/build-loop-transcript.ts <spec.json>
//
// Spec shape:
//   { seed, readerLabel, surface, note?, steps:[{pick,note?}...],
//     debrief:[{q,a}...], operatorNotes? }
// `pick` is 1-based, a POSITION in the screen the reader actually saw (not the
// engine index — hidden-locked options are absent, so they can diverge; this
// mirrors loop-relay.ts's position->index translation so a courier-logged pick
// sequence replays byte-identical to the live relay).
// ============================================================================

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { explorerDb, EXPLORER_CONTENT_ID } from "../content/explorer";
import { LoopSession } from "./loop-session";
import { renderTranscript, transcriptFilename } from "./transcript";

const BUILD_TAG = "explorer-loop-v1";

interface Spec {
  seed: number;
  readerLabel: string;
  surface: string;
  note?: string;
  steps: { pick: number; note?: string }[];
  debrief: { q: string; a: string }[];
  operatorNotes?: string;
}

const specPath = process.argv[2];
if (!specPath) { process.stderr.write("usage: build-loop-transcript <spec.json>\n"); process.exit(1); }
const spec: Spec = JSON.parse(readFileSync(specPath, "utf8"));

const s = new LoopSession(explorerDb, {
  contentId: EXPLORER_CONTENT_ID, seed: spec.seed, buildTag: BUILD_TAG,
  tier: "outer", townId: "town_edge", mode: "read", showJournal: true,
});

for (const step of spec.steps) {
  if (s.done) { process.stderr.write(`!! pick ${step.pick} after the run ended\n`); break; }
  const opt = s.current.options[step.pick - 1];
  if (!opt) { process.stderr.write(`!! pick #${step.pick} rejected on ${s.current.card}: no such option\n`); process.exit(1); }
  const r = s.pick(opt.index, step.note ?? "");
  if (!r.ok) { process.stderr.write(`!! pick #${step.pick} rejected on ${s.current.card}: ${r.reason}\n`); process.exit(1); }
}

const opNotes = `surface: ${spec.surface}${spec.note ? ` · ${spec.note}` : ""}${spec.operatorNotes ? ` · ${spec.operatorNotes}` : ""}`;
s.appendDebrief(spec.debrief, opNotes);

const md = renderTranscript(s.recorder.stream());
const fname = transcriptFilename(EXPLORER_CONTENT_ID, BUILD_TAG, spec.seed, spec.readerLabel);
mkdirSync("coldreads", { recursive: true });
writeFileSync(`coldreads/${fname}`, md);
process.stdout.write(`transcript written: coldreads/${fname} (run ${s.done ? "completed" : "INCOMPLETE"}, ${spec.steps.length} picks)\n`);
