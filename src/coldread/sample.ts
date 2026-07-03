// ============================================================================
// coldread/sample.ts — the scripted driver. Drives the cave Session with a fixed
// pick-list (no human), checks the seven acceptance criteria from the build
// directive, and drops one sample transcript in coldreads/ for the team to
// eyeball before Batch A burns a real reader. Run: npm run coldread:sample
// ============================================================================

import { writeFileSync, mkdirSync } from "node:fs";
import { caveDb, CAVE_CONTENT_ID } from "../content/cave.db";
import { Session } from "./session";
import type { SessionOpts } from "./session";
import { renderTranscript, transcriptFilename } from "./transcript";
import { DEBRIEF_QUESTIONS, FRAMING_SCRIPT, LOCKED_NON_ANSWER, SINGLE_NUDGE } from "./scripts";
import type { PresentationRecord, StreamRecord } from "./recorder";

const BUILD_TAG = "cave-b2";
const SEED = 70499;

// A fixed route by card id (single-option cards default to 0). This deep route
// hits a tradecraft roll, reaches the etchings (where the greyed illegible option
// shows), links Nora, and takes the shard on the way out.
const ROUTE: Record<string, number> = {
  ux_cave_enter: 0,        // take point
  ux_cave_descend: 0,      // keep going
  ux_cave_heard: 1,        // "that was a voice"
  ux_cave_squeeze: 0,      // right behind you -> the throat
  ux_cave_etchings: 1,     // the Nora link
  ux_cave_return: 2,       // take the shard, then the squeeze
};

const baseOpts = (mode: "read" | "bot"): SessionOpts => ({
  contentId: CAVE_CONTENT_ID, seed: SEED, buildTag: BUILD_TAG,
  entryActionId: "ux_act_cave_reese", tier: "outer", townId: "region", mode,
});

// Drive a session to the end. `probeGreyed` (crit 4) attempts the illegible
// option at the etchings and records whether it was refused.
function drive(mode: "read" | "bot", withReaderNotes: boolean) {
  const s = new Session(caveDb, baseOpts(mode));
  let greyedRefused: boolean | null = null;
  let etchingsHadGreyedVisible = false;
  let guard = 0;
  while (!s.done && guard++ < 100) {
    const card = s.current.card;
    if (card === "ux_cave_etchings") {
      const illegible = s.current.options.find((o) => o.showWhenLocked);
      if (illegible) {
        etchingsHadGreyedVisible = !illegible.available; // shown but not resolvable
        greyedRefused = s.pick(illegible.index).ok === false; // must refuse without advancing
      }
    }
    const idx = ROUTE[card] ?? 0;
    const note = withReaderNotes ? `[reader think-aloud for ${card}]` : "";
    const r = s.pick(idx, note);
    if (!r.ok) throw new Error(`unexpected refusal on ${card} idx ${idx}: ${r.reason}`);
  }
  return { s, greyedRefused, etchingsHadGreyedVisible };
}

const presentations = (recs: StreamRecord[]): PresentationRecord[] =>
  recs.filter((r): r is PresentationRecord => r.type === "presentation");

// ---- run the checks --------------------------------------------------------
const results: [string, boolean, string][] = [];
const check = (name: string, ok: boolean, detail = "") => results.push([name, ok, detail]);

// Read-mode run (the shareable transcript source) + debrief.
const run1 = drive("read", true);
run1.s.appendDebrief(
  DEBRIEF_QUESTIONS.map((q) => ({ q, a: "[sample placeholder answer]" })),
  "scripted sample — not a real reader",
);
const stream1 = run1.s.recorder.stream();

// Crit 1 — full session entry -> exit.
check("1 · full cave session drives entry→exit", run1.s.done && presentations(stream1.records).some((p) => p.card === "__end__"));

// Crit 2 — trace + presentation + reader per step, plus a debrief.
const types = new Set(stream1.records.map((r) => r.type));
check("2 · stream carries trace + presentation + reader + debrief",
  types.has("trace") && types.has("presentation") && types.has("reader") && types.has("debrief"));

// Crit 3 — determinism: same seed + same picks => identical presentation.
const run2 = drive("read", true);
const p1 = JSON.stringify(presentations(run1.s.recorder.stream().records));
const p2 = JSON.stringify(presentations(run2.s.recorder.stream().records));
check("3 · same seed + picks ⇒ byte-identical presentation (verified twice)", p1 === p2);

// Crit 4 — greyed illegible option renders visible-but-unavailable and refuses resolution.
check("4 · illegible option shows greyed and refuses resolution",
  run1.etchingsHadGreyedVisible === true && run1.greyedRefused === true);

// Crit 5 — operator scripts reachable from the session layer.
check("5 · operator scripts embedded & reachable",
  !!FRAMING_SCRIPT && !!LOCKED_NON_ANSWER && !!SINGLE_NUDGE && DEBRIEF_QUESTIONS.length === 7);

// Crit 6 — bot run through the same emitter => valid trace-only stream.
const bot = drive("bot", false);
const botRecs = bot.s.recorder.stream().records;
check("6 · bot run yields a valid trace-only stream (telemetry backbone)",
  botRecs.length > 0 && botRecs.every((r) => r.type === "trace"));

// Crit 7 — one sample transcript rendered to markdown, dropped in the folder.
const md = renderTranscript(stream1);
const fname = transcriptFilename(CAVE_CONTENT_ID, BUILD_TAG, SEED, "sample-scripted");
mkdirSync("coldreads", { recursive: true });
writeFileSync(`coldreads/${fname}`, md);
check("7 · sample transcript rendered to coldreads/", md.includes("# Cold read") && md.includes("Debrief"), `coldreads/${fname}`);

// ---- report ----------------------------------------------------------------
const line = (s = "") => console.log(s);
line(`\n=== Batch 2 acceptance — cave cold-read hardware ===\n`);
let allOk = true;
for (const [name, ok, detail] of results) { if (!ok) allOk = false; line(`  ${ok ? "OK  " : "FAIL"} ${name}${detail ? `  (${detail})` : ""}`); }
line(`\n${allOk ? "ALL SEVEN CRITERIA PASS" : "SOME CRITERIA FAILED"} — steps: ${presentations(stream1.records).length}\n`);
if (!allOk) process.exit(1);
