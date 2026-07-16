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
import type { ContentDB } from "../engine/types";
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
    const idx = s.kind === "day" ? chooseDay(s) : firstAvailable(s);   // scene AND creation screens: first available
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

// ---- Crits 9–10: the two-vessel collision, read end-to-end through the tool ---
// Vessel A drives the Denise pursuit to its threshold terminal; the harvest
// feeds vessel B, which earns Dale's bond and sits on the porch — where the
// collision surfaces on a READER-FACING screen: nameless shame, never a word
// of the prior run. Label-routed (never indices), so the route reads like a
// reader's intent and survives menu reordering.
function driveRouted(session: LoopSession, scenePrefs: string[], dayPrefs: string[], stopAtCard?: string): LoopScreen | undefined {
  let guard = 0;
  while (!session.done && guard++ < 500) {
    const s = session.current;
    if (stopAtCard && s.card === stopAtCard) return s;
    let idx: number;
    if (s.kind === "scene") {
      const pref = s.options.find((o) => o.available && scenePrefs.some((p) => o.label.startsWith(p)));
      idx = pref ? pref.index : firstAvailable(s);
    } else {
      const pref = s.options.find((o) => o.available && dayPrefs.some((p) => o.label.startsWith(p)));
      idx = pref ? pref.index : s.options.length - 1;   // else: call it a day
    }
    if (!session.pick(idx, "").ok) break;
  }
  return undefined;
}

const vesselA = new LoopSession(explorerDb, baseOpts("read"));
driveRouted(vesselA,
  [`"What kind of bad things?"`, `"Then it's on me."`],
  ["Go see Denise", "Look into Dale yourself"]);
check("9 · vessel A: the pursuit reaches its threshold terminal through the reader tool",
  vesselA.done && vesselA.current.terminal === "run_end_pursuit",
  `terminal=${vesselA.current.terminal} · day=${vesselA.current.day}`);

const harvest = vesselA.harvestInto(newCrossRunStore());
const vesselB = new LoopSession(explorerDb, { ...baseOpts("read"), crossRun: harvest });
const porch = driveRouted(vesselB,
  [`"What kind of bad things?"`, `"…you're the first person`],
  ["Go find Dale", "Drive out to Dale's porch"],
  "ux_dale_porch");
check("10 · vessel B: the collision surfaces on the porch, reader-facing and nameless",
  !!porch && porch.prose.includes("unbearably ashamed of something you have never done") &&
  // Leak guard on the meta-reveal PHRASES, not the bare word — a benign
  // "another" in future porch base prose must not false-fail (review nit).
  !porch.prose.includes("another life") && !porch.prose.includes("another run") &&
  vesselB.flag("went_after_dale") === true,
  porch ? `porch reached day ${porch.day}` : "porch never reached");

// ---- Crit 11: the start-deck creation phase, through the console -------------
// Opt-in only (Azimuth's cutover ruling: legacy stays the read program's
// baseline until Loom's questions land) — this proves the machinery: creation
// screens surface first, the deal is invisible, the monotonic step line runs
// unbroken from the first question to the terminal, and the dealt run drives
// to a designed end exactly like a legacy run.
const deckRun = new LoopSession(explorerDb, { ...baseOpts("read"), startDeck: true });
const sawCreation = deckRun.current.kind === "creation" && deckRun.current.day === 0;
drive(deckRun, false);
const deckPres = presentations(deckRun.recorder.stream().records);
const creationScreens = deckPres.filter((p) => p.card.startsWith("__creation_"));
const dealLeak = deckPres.find((p) =>
  p.prose.includes("start_") || p.options.some((o) => o.label.includes("start_")));
const monotonic = deckPres.every((p, i) => i === 0 || p.step > deckPres[i - 1].step);
check("11 · start-deck: creation surfaces first, deal invisible, one step line, and the dealt run IS the legacy run",
  sawCreation && creationScreens.length > 0 && !dealLeak && monotonic &&
  deckRun.done && TERMINALS.has(deckRun.current.terminal ?? "") &&
  // The creation-scoped deal stream, visible at console level: same seed +
  // same policy ⇒ the dealt run and the legacy run land the same terminal on
  // the same day (the reunion is the deck's one start; gameplay RNG untouched).
  deckRun.current.terminal === run1.current.terminal && deckRun.current.day === run1.current.day,
  `creation screens=${creationScreens.length} · terminal=${deckRun.current.terminal} · day=${deckRun.current.day} (matches legacy)`);

// ---- Crit 12: the LIVE reader sees every resolution (the wave's bug 2) -------
// Armature's stronger form of this criterion, ported from the parallel fix
// (PR #26): the old crits inspected the RECORDER, which is exactly where the
// bug was invisible (the recorder held __end__ screens the live view dropped).
// This one plays the run the way a live reader does — reading session.current
// between picks — and asserts (a) RECORDER FIDELITY: the ordered live screens
// the reader faced ARE the presentation stream, step for step, prose for
// prose; (b) no __end__ screen leaks as its own record; (c) at least one
// scene resolved into a day menu whose outcome shows above the date (the
// cave's "…through the pinch" landing on the next morning — the concrete
// drop the wave hit).
type LiveShot = { step: number; card: string; prose: string; kind: LoopScreen["kind"]; dateLabel?: string };
function driveLive(session: LoopSession): LiveShot[] {
  const live: LiveShot[] = [];
  let guard = 0;
  while (!session.done && guard++ < 500) {
    const s = session.current;
    live.push({ step: s.step, card: s.card, prose: s.prose, kind: s.kind, dateLabel: s.dateLabel });
    const idx = s.kind === "day" ? chooseDay(s) : firstAvailable(s);
    if (!session.pick(idx, "").ok) break;
  }
  const e = session.current;   // the terminal screen the reader ends on
  live.push({ step: e.step, card: e.card, prose: e.prose, kind: e.kind, dateLabel: e.dateLabel });
  return live;
}
const liveRun = new LoopSession(explorerDb, baseOpts("read"));
const live = driveLive(liveRun);
const livePres = presentations(liveRun.recorder.stream().records);
const fidelity =
  live.length === livePres.length &&
  live.every((v, i) => v.step === livePres[i].step && v.card === livePres[i].card && v.prose === livePres[i].prose);
const noEndLeak = livePres.every((p) => p.card !== "__end__");
const foldedDayScreens = live.filter((v) => v.kind === "day" && v.dateLabel && v.prose !== v.dateLabel).length;
check("12 · live reader sees every resolution (recorder == live view; outcomes fold onto the next screen)",
  fidelity && noEndLeak && foldedDayScreens > 0,
  `live=${live.length} pres=${livePres.length} · folded day screens=${foldedDayScreens}`);

// ---- Crit 13: the empty-screen regression guard (BR-1's day-boundary bug) ---
// A morning-queued scene whose events all fail their fire conditions resolves
// IMMEDIATELY: SceneRunner.begin -> advance finds nothing mountable -> the
// internal "__end__" sentinel (empty prose, no options). enterMorning/afterScene
// must DRAIN that to the day menu, never surface the sentinel to the reader.
// Courier caught the raw empty screen live at a day-6→7 boundary during BR-1;
// PR #32 guarded both drain paths. This forces the trigger deterministically on
// a synthetic db so the surface regression can't silently return (a cold reader
// can't tell an empty screen from intended uncanny — the polish bar's whole point).
const phantomOnly: ContentDB = {
  openingLog: "x",
  openingQueue: ["p_phantom"],   // the ONLY morning beat, gated permanently false
  events: {
    p_phantom: {
      id: "p_phantom", title: "t", body: "never shown",
      condition: { kind: "flag", flag: "never_set" },   // fails every time → skipped → immediately-done scene
      choices: [{ label: "x", outcome: {} }],
    },
  },
  actions: [],
  towns: { t: { id: "t", name: "T", tiersOffered: ["outer"], amenities: [], reachable: true, fixtures: [] } },
  factions: {}, traits: {}, items: {}, npcs: {}, names: { first: ["P"], last: ["Q"] },
};
const s13 = new LoopSession(phantomOnly, baseOpts("read"));
// (a) the live first screen must be the day menu, never the empty __end__ sentinel
const firstScreenClean = s13.current.card !== "__end__" && s13.current.kind === "day"
  && s13.current.prose.trim().length > 0 && s13.current.options.length > 0;
// (b) the recorder must not hold an __end__ presentation for that drained scene
const noSentinelRecorded = presentations(s13.recorder.stream().records).every((p) => p.card !== "__end__");
check("13 · empty-screen regression: an immediately-done queued scene drains to the day menu, never the __end__ sentinel",
  firstScreenClean && noSentinelRecorded,
  `first screen: kind=${s13.current.kind} card=${s13.current.card} opts=${s13.current.options.length}`);

// ---- report ----------------------------------------------------------------
const line = (s = "") => console.log(s);
line(`\n=== Loop cold-read hardware — acceptance ===\n`);
let allOk = true;
for (const [name, ok, detail] of results) { if (!ok) allOk = false; line(`  ${ok ? "OK  " : "FAIL"} ${name}${detail ? `  (${detail})` : ""}`); }
line(`\n${allOk ? "ALL CRITERIA PASS" : "SOME CRITERIA FAILED"} — presentation steps: ${pres1.length}\n`);
if (!allOk) process.exit(1);
