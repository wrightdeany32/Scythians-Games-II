// ============================================================================
// app/websession.smoke.ts — headless acceptance for the browser driver.
//   npm run web:smoke
// Plays the explorer campaign start-to-terminal with a naive first-available
// policy, asserting the screen contract on every step; then replays the
// accumulated save record and asserts the final screen is byte-identical
// (the replay-save contract). Exits non-zero on any failure.
// ============================================================================

import { explorerDb } from "../content/explorer";
import { WebSession } from "./websession";
import type { WebSave } from "./websession";

const SEED = 91001;   // BR-1's seed — a known-good full arc
const MAX_PICKS = 500;

function fail(msg: string): never {
  console.error(`FAIL  ${msg}`);
  process.exit(1);
}

const s = new WebSession(explorerDb, { seed: SEED, tier: "outer", townId: "town_edge" });

let picksMade = 0;
let dayScreens = 0;
let sceneScreens = 0;

while (!s.done) {
  if (picksMade >= MAX_PICKS) fail(`no terminal after ${MAX_PICKS} picks`);
  const scr = s.current;
  if (!scr.prose.trim()) fail(`empty prose on ${scr.kind}/${scr.card} at pick ${picksMade}`);
  if (scr.card === "__end__") fail(`the __end__ sentinel leaked to a presented screen at pick ${picksMade}`);
  if (scr.kind === "day") {
    dayScreens++;
    if (scr.endIndex === undefined || !scr.dayActions) fail(`day screen missing endIndex/dayActions at pick ${picksMade}`);
    const surface = s.surface();
    if (!surface) fail(`no surface on a day screen at pick ${picksMade}`);
    if (surface.have.energy < 0) fail(`negative energy surfaced at pick ${picksMade}`);
    // Policy: first available action, else call it a day.
    const act = scr.dayActions.find((a) => a.available);
    const idx = act ? act.index : scr.endIndex;
    const res = s.pick(idx);
    if (!res.ok) fail(`day pick ${idx} refused: ${res.reason} at pick ${picksMade}`);
  } else {
    sceneScreens++;
    const opt = scr.options.find((o) => o.available);
    if (!opt) fail(`no available option on ${scr.kind}/${scr.card} at pick ${picksMade}`);
    const res = s.pick(opt.index);
    if (!res.ok) fail(`${scr.kind} pick ${opt.index} refused: ${res.reason} at pick ${picksMade}`);
  }
  picksMade++;
}

const finalProse = s.current.prose;
const terminal = s.current.terminal;
const save: WebSave = s.save();
if (save.picks.length !== picksMade) fail(`save records ${save.picks.length} picks, made ${picksMade}`);

// A greyed pick must refuse without advancing (the refusal contract).
const refusal = s.pick(0);
if (refusal.ok) fail("a pick was accepted on the end screen");

// Replay the record; the terminal screen must be byte-identical.
const r = WebSession.restore(explorerDb, { tier: "outer", townId: "town_edge" }, save);
if (!r) fail("restore refused a record it just wrote");
if (!r.done) fail("replayed session is not at the terminal");
if (r.current.prose !== finalProse) fail("replayed terminal prose diverged from the live run");
if (r.current.terminal !== terminal) fail("replayed terminal flag diverged");

console.log(
  `OK  websession smoke: ${picksMade} picks · ${dayScreens} day screens · ${sceneScreens} scene screens · ` +
  `terminal "${terminal}" on day ${s.current.day} · replay byte-identical`,
);
