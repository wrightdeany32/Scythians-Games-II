// ============================================================================
// coldread/run.ts — the interactive operator console. A compass-burned operator
// runs a blind read here: it prints the locked scripts, drives one cave Session,
// presents prose + numbered options (greyed ones shown and refused), captures the
// reader's think-aloud and picks, runs the debrief, and writes the transcript to
// coldreads/. Everything goes through Session (the invariant). Run: npm run coldread
//
// Usage: npm run coldread -- [seed] [reader-label]
// I/O uses a line-queue over readline so it works with both a live TTY and piped
// input (for scripted smoke-runs), without the readline/promises EOF race.
// ============================================================================

import { writeFileSync, mkdirSync } from "node:fs";
import * as readline from "node:readline";
import { caveDb, CAVE_CONTENT_ID } from "../content/cave.db";
import { Session } from "./session";
import { renderTranscript, transcriptFilename } from "./transcript";
import {
  FRAMING_SCRIPT, LOCKED_NON_ANSWER, SINGLE_NUDGE,
  LOCKED_OPTION_REFUSAL, DEBRIEF_QUESTIONS,
} from "./scripts";

const BUILD_TAG = "cave-b2";

// A line reader that queues input lines as they arrive (TTY or pipe) and serves
// them to ask() on demand. After EOF, ask() resolves to "" rather than hanging.
class LineReader {
  private queue: string[] = [];
  private waiters: ((line: string) => void)[] = [];
  private closed = false;
  private rl: readline.Interface;
  constructor() {
    this.rl = readline.createInterface({ input: process.stdin });
    this.rl.on("line", (l) => {
      const w = this.waiters.shift();
      if (w) w(l); else this.queue.push(l);
    });
    this.rl.on("close", () => {
      this.closed = true;
      while (this.waiters.length) this.waiters.shift()!("");
    });
  }
  ask(prompt: string): Promise<string> {
    process.stdout.write(prompt);
    if (this.queue.length) return Promise.resolve(this.queue.shift()!);
    if (this.closed) return Promise.resolve("");
    return new Promise((res) => this.waiters.push(res));
  }
  close() { this.rl.close(); }
}

async function main() {
  const args = process.argv.slice(2);
  const seed = Number(args[0]) || 70499;
  const readerLabel = (args[1] || "reader-1").replace(/[^a-zA-Z0-9-]/g, "-");

  const io = new LineReader();
  const say = (s = "") => process.stdout.write(s + "\n");
  const rule = () => say("\n" + "─".repeat(64) + "\n");

  // ---- operator briefing (copy-paste scripts; never improvise) -------------
  rule();
  say("COLD READER SESSION — operator console");
  say(`content: ${CAVE_CONTENT_ID} · build ${BUILD_TAG} · seed ${seed} · reader ${readerLabel}`);
  rule();
  say("READ THIS TO THE READER, VERBATIM (framing script):\n");
  say(`    ${FRAMING_SCRIPT}\n`);
  say("If the reader asks you anything, answer ONLY with the locked non-answer:");
  say(`    "${LOCKED_NON_ANSWER}"`);
  say("If the reader goes silent, you may use the single nudge ONCE:");
  say(`    "${SINGLE_NUDGE}"`);
  say("\nFor each screen: type the reader's think-aloud, then the choice number.");
  rule();

  const session = new Session(caveDb, {
    contentId: CAVE_CONTENT_ID, seed, buildTag: BUILD_TAG,
    entryActionId: "ux_act_cave_reese", tier: "outer", townId: "region", mode: "read",
  });

  while (!session.done) {
    const scr = session.current;
    say(`\n${scr.prose}\n`);
    for (const o of scr.options) say(`  ${o.index + 1}. ${o.label}${o.available ? "" : "  (unavailable)"}`);

    const note = (await io.ask("\n  reader> ")).trim();
    let picked = false;
    while (!picked) {
      const raw = (await io.ask("  choice #> ")).trim();
      const res = session.pick(Number(raw) - 1, note);
      if (res.ok) picked = true;
      else if (res.reason === "unavailable") say(`  ${LOCKED_OPTION_REFUSAL}`);
      else say(`  (enter a valid choice number)`);
    }
  }

  // ---- closing + debrief ---------------------------------------------------
  say(`\n${session.current.prose}\n`);
  rule();
  say("SESSION ENDED. Debrief — ask each, verbatim, one at a time.\n");
  const qa: { q: string; a: string }[] = [];
  for (const q of DEBRIEF_QUESTIONS) {
    say(`  Q: ${q}`);
    qa.push({ q, a: (await io.ask("  A> ")).trim() });
  }
  const operatorNotes = (await io.ask("\n  operator notes (reader questions, silences, etc.)> ")).trim();
  session.appendDebrief(qa, operatorNotes);
  io.close();

  // ---- write transcript ----------------------------------------------------
  const md = renderTranscript(session.recorder.stream());
  const fname = transcriptFilename(CAVE_CONTENT_ID, BUILD_TAG, seed, readerLabel);
  mkdirSync("coldreads", { recursive: true });
  writeFileSync(`coldreads/${fname}`, md);
  say(`\nTranscript written: coldreads/${fname}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
