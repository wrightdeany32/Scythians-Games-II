// ============================================================================
// coldread/loop-sample.ts — the scripted acceptance driver for the LOOP console
// (the cave's sample.ts, at campaign scale). Drives explorerDb from day 1 to a
// designed terminal with a fixed, deterministic policy, checks the loop-read
// hardware against the same criteria the cave read holds, and drops one sample
// transcript in coldreads/ for the team to eyeball before a reader is spent.
// Run: npm run coldread:loop-sample
// ============================================================================

import { writeFileSync, mkdirSync } from "node:fs";
import { explorerDb, EXPLORER_CONTENT_ID } from "../content/explorer";
import { LoopSession } from "./loop-session";
import type { LoopSessionOpts, LoopScreen } from "./loop-session";
import { renderTranscript, transcriptFilename } from "./transcript";
import { DEBRIEF_QUESTIONS } from "./scripts";
import type { PresentationRecord, StreamRecord } from "./recorder";
import { newCrossRunStore } from "../engine/engine";

const BUILD_TAG = "explorer-loop-v1";
const SEED = 70499;
const READER = "sample-scripted";
const TERMINALS = new Set(["run_end_whites_return", "run_end_never_returned", "run_end_pursuit", "grip"]);

const baseOpts = (mode: "read" | "bot"): LoopSessionOpts => ({
  contentId: EXPLORER_CONTENT_ID, seed: SEED, buildTag: BUILD_TAG,
  tier: "outer", townId: "town_edge", mode,
});

// The scripted policy: in a scene take the first available option; on the day
// menu head for a terminal — the return if it's offered (the run's closer),
// else the cave (which unlocks the return), else call it a day. Deterministic
// by construction; a pure function of the presented screen.
function firstAvailable(s: LoopScreen): number {
  const o = s.options.find((opt) => opt.available);
  return o ? o.index : 0;
}
function chooseDay(s: LoopScreen): number {
  const want = (prefix: string) => s.options.findIndex((o) => o.available && o.label.startsWith(prefix));
  const ret = want("Go back to White's Hall");
  if (ret >= 0) return ret;
  const cave = want("Go caving with Reese");
  if (cave >= 0) return cave;
  return s.options.length - 1;   // "Call it a day."
}

// Drive to the terminal, recording each pick so a second run can replay the
// exact indices (the determinism check — same seed + same picks).
function drive(session: LoopSession, withNotes: boolean): number[] {
  const picks: number[] = [];
  let guard = 0;
  while (!session.done && guard++ < 500) {
    const s = session.current;
    const idx = s.kind === "scene" ? firstAvailable(s) : chooseDay(s);
    picks.push(idx);
    const r = session.pick(idx, withNotes ? `[reader think-aloud for ${s.card}]` : "");
    if (!r.ok) break;   // the policy shouldn't hit a refusal; bail rather than spin
  }
  return picks;
}
function replay(session: LoopSession, picks: number[]): void {
  for (const idx of picks) { if (session.done) break; session.pick(idx, ""); }
}

const presentations = (recs: StreamRecord[]): PresentationRecord[] =>
  recs.filter((r): r is PresentationRecord => r.type === "presentation");

// ---- run the checks --------------------------------------------------------
const results: [string, boolean, string][] = [];
const check = (name: string, ok: boolean, detail = "") => results.push([name, ok, detail]);

// Read-mode run (the shareable transcript source) + debrief.
const run1 = new LoopSession(explorerDb, baseOpts("read"));
const picks = drive(run1, true);
run1.appendDebrief(
  DEBRIEF_QUESTIONS.map((q) => ({ q, a: "[sample placeholder answer]" })),
  "scripted loop sample — not a real reader",
);
const stream1 = run1.recorder.stream();
const pres1 = presentations(stream1.records);

// Crit 1 — a full campaign drives day 1 -> a designed terminal.
check("1 · loop drives day 1 → a designed terminal",
  run1.done && TERMINALS.has(run1.current.terminal ?? ""), `terminal=${run1.current.terminal} · day=${run1.current.day} · picks=${picks.length}`);

// Crit 2 — the stream carries trace + presentation + reader, plus a debrief.
const types = new Set(stream1.records.map((r) => r.type));
check("2 · stream carries trace + presentation + reader + debrief",
  types.has("trace") && types.has("presentation") && types.has("reader") && types.has("debrief"));

// Crit 3 — determinism: same seed + same picks ⇒ byte-identical presentation.
const run2 = new LoopSession(explorerDb, baseOpts("read"));
replay(run2, picks);
const p1 = JSON.stringify(pres1);
const p2 = JSON.stringify(presentations(run2.recorder.stream().records));
check("3 · same seed + picks ⇒ byte-identical presentation (verified twice)", p1 === p2);

// Crit 4 — the DAY menu is reader-facing: at least one day screen, and no
// presentation (day OR scene) leaks a card id / mechanical token to the reader.
const dayScreens = pres1.filter((p) => p.card === "__day__");
const leak = pres1.find((p) =>
  /ux_[a-z]/.test(p.prose) || p.options.some((o) => /ux_[a-z]/.test(o.label) || /\benergy\b|\bcost\b/i.test(o.label)));
check("4 · day menu renders reader-facing (labels only; no id/cost/energy leak)",
  dayScreens.length > 0 && dayScreens.every((p) => p.options.length > 0) && !leak,
  `${dayScreens.length} day screens`);

// Crit 5 — a scheduled/queued scene surfaced in a morning (the opening + cave),
// proving startQueuedScene is wired, not just the day menu.
const sceneCards = new Set(pres1.filter((p) => !["__day__", "__run_over__"].includes(p.card)).map((p) => p.card));
check("5 · morning-queued scenes surface (startQueuedScene wired)",
  sceneCards.size > 0, `${sceneCards.size} distinct scene cards`);

// Crit 6 — bot mode yields a valid trace-only stream (the telemetry backbone).
const bot = new LoopSession(explorerDb, baseOpts("bot"));
drive(bot, false);
const botRecs = bot.recorder.stream().records;
check("6 · bot run yields a valid trace-only stream",
  botRecs.length > 0 && botRecs.every((r) => r.type === "trace"));

// Crit 7 — §3: a cross-run store injects into a new vessel — the collision's
// substrate. (Full two-vessel read rides harvestInto once a route to the
// pursuit terminal is scripted; this proves the pass-through the tool relies on.)
const store = newCrossRunStore();
store.seeds = { went_after_dale: true };
const v2 = new LoopSession(explorerDb, { ...baseOpts("read"), crossRun: store });
check("7 · cross-run harvest injects into a new vessel (Denise→Dale collision substrate)",
  v2.flag("went_after_dale") === true);

// Crit 8 — one sample transcript rendered to markdown, dropped in the folder.
const md = renderTranscript(stream1);
const fname = transcriptFilename(EXPLORER_CONTENT_ID, BUILD_TAG, SEED, READER);
mkdirSync("coldreads", { recursive: true });
writeFileSync(`coldreads/${fname}`, md);
check("8 · sample transcript rendered to coldreads/", md.includes("# Cold read") && md.includes("Debrief"), `coldreads/${fname}`);

// ---- report ----------------------------------------------------------------
const line = (s = "") => console.log(s);
line(`\n=== Loop cold-read hardware — acceptance ===\n`);
let allOk = true;
for (const [name, ok, detail] of results) { if (!ok) allOk = false; line(`  ${ok ? "OK  " : "FAIL"} ${name}${detail ? `  (${detail})` : ""}`); }
line(`\n${allOk ? "ALL CRITERIA PASS" : "SOME CRITERIA FAILED"} — presentation steps: ${pres1.length}\n`);
if (!allOk) process.exit(1);
