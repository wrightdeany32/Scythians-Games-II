// ============================================================================
// coldread/build-transcript.ts — assemble a canonical cold-read transcript from
// a completed relay session. Reads a JSON spec (the seed, the reader's picks with
// their verbatim think-aloud, the debrief Q&A, the surface confirmation), drives
// the frozen cave-b3 Session with those picks+notes, appends the debrief, and
// writes coldreads/coldread_cave_<build>_<seed>_<reader>.md.
//
//   npx tsx src/coldread/build-transcript.ts <spec.json>
//
// Spec shape:
//   { seed, readerLabel, surface, note?, steps:[{pick,note}...],
//     debrief:[{q,a}...], operatorNotes? }
// `pick` is 1-based (as the reader gave it). Using the Session guarantees the
// transcript's presentation matches the frozen build exactly.
// ============================================================================

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { caveDb, CAVE_CONTENT_ID } from "../content/cave.db";
import { Session } from "./session";
import { renderTranscript, transcriptFilename } from "./transcript";

const BUILD_TAG = "cave-b3";

interface Spec {
  seed: number;
  readerLabel: string;
  surface: string;
  note?: string;                 // optional header note (e.g. "out-validation / turn-back")
  steps: { pick: number; note: string }[];
  debrief: { q: string; a: string }[];
  operatorNotes?: string;
}

const specPath = process.argv[2];
if (!specPath) { process.stderr.write("usage: build-transcript <spec.json>\n"); process.exit(1); }
const spec: Spec = JSON.parse(readFileSync(specPath, "utf8"));

const s = new Session(caveDb, {
  contentId: CAVE_CONTENT_ID, seed: spec.seed, buildTag: BUILD_TAG,
  entryActionId: "ux_act_cave_reese", tier: "outer", townId: "region", mode: "read",
});

for (const step of spec.steps) {
  if (s.done) { process.stderr.write(`!! pick ${step.pick} after scene ended\n`); break; }
  const r = s.pick(step.pick - 1, step.note);
  if (!r.ok) { process.stderr.write(`!! pick #${step.pick} rejected on ${s.current.card}: ${r.reason}\n`); process.exit(1); }
}

const opNotes = `surface: ${spec.surface}${spec.note ? ` · ${spec.note}` : ""}${spec.operatorNotes ? ` · ${spec.operatorNotes}` : ""}`;
s.appendDebrief(spec.debrief, opNotes);

const md = renderTranscript(s.recorder.stream());
const fname = transcriptFilename(CAVE_CONTENT_ID, BUILD_TAG, spec.seed, spec.readerLabel);
mkdirSync("coldreads", { recursive: true });
writeFileSync(`coldreads/${fname}`, md);
process.stdout.write(`transcript written: coldreads/${fname} (scene ${s.done ? "completed" : "INCOMPLETE"}, ${spec.steps.length} picks)\n`);
