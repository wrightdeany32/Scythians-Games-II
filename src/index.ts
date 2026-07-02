// ============================================================================
// index.ts — a HEADLESS SMOKE TEST for the forked engine. It proves the engine
// runs end-to-end against the neutral placeholder content in src/smoke: starts a
// game with NO questionnaire, drains a scripted opening QUEUE (deterministic
// cold-open + played creation cards), plays days greedily drawing from a real
// situation DECK by tag, resolves dice events, assigns an ally to the Circle,
// then exercises the Outcome verbs and previews procedural NPCs, an Elo season
// sim, and a save/load roundtrip. Run: npm install && npm run demo
//
// This is theme-agnostic and gets rewritten once real content exists (Task 2).
// ============================================================================

import { db } from "./smoke/content";
import {
  newGame, availableActions, takeAction, continueRoll, drawEvent, resolveChoice,
  choiceAvailable, endDay, serialize, deserialize, generateNpc, simulateGame,
  assignToCircle, applyOutcome,
} from "./engine/engine";
import type { GameState, ResolvedRoll } from "./engine/types";
import { dateOf } from "./engine/calendar";

const line = (s = "") => console.log(s);
const showLog = (g: GameState, n: number, pad: string) => g.log.slice(0, n).forEach((l) => line(pad + l.text));

// No `answers` -> exercises the now-optional questionnaire. The opening queue
// (db.openingQueue) seeds the scripted cold-open deterministically.
const g = newGame(
  { seed: 70499, name: "You", age: 25, body: { height: 0.5, build: 0.5 }, townId: "region_one", tier: "outer" },
  db,
);

line(`\n=== Scythians Games II — engine smoke test ===`);
line(`${g.player.archetype}, age ${g.player.age}, ring "${g.tier}"`);
line(`start: ${JSON.stringify(g.player.stats)}`);

// Drain the scripted opening queue first (proves openingQueue + played creation).
line(`\n-- scripted cold-open (from openingQueue) --`);
while (g.queue.length) {
  const ev = drawEvent(g, db, 1);
  if (!ev) break;
  let idx = ev.choices.findIndex((c) => choiceAvailable(g, c));
  if (idx < 0) idx = 0;
  line(`   > ${ev.title} — "${ev.choices[idx].label}"`);
  const r = resolveChoice(g, db, ev, idx);
  if (r.roll) continueRoll(g, db, r.roll);
}

// Exercise the unified modifier system: slot the seeded fixture into the Circle.
if (assignToCircle(g, "npc_contact", "fixer")) line(`circle: recruited ${g.npcs.npc_contact.name}`);

function showRoll(r: ResolvedRoll, pad: string) {
  line(`${pad}d20 ${r.die} ${r.mod >= 0 ? "+" : "-"} ${Math.abs(r.mod)} = ${r.total} vs ${r.target} -> ${r.success ? "SUCCESS" : "MISS"}`);
}

let done = false;
for (let day = 0; day < 20 && !done; day++) {
  while (g.player.stats.energy > 0) {
    const acts = availableActions(g, db);
    const a = acts.find((x) => x.isClear) || acts[0];
    if (!a) break;

    line(`\n${dateOf(g.day).label} | ${a.name}  (energy ${g.player.stats.energy}, standing ${g.player.stats.standing})`);
    const res = takeAction(g, db, a);
    if (res.roll) {
      showRoll(res.roll, "   ");
      continueRoll(g, db, res.roll);
      if (a.isClear) { line("   *** HUB CLEARED ***"); done = true; break; }
    }
    showLog(g, 1, "   ");

    // Draw from the situation DECK by tag (proves deck-scoped weighted draw).
    const ev = drawEvent(g, db, 0.6, "deck:situations");
    if (ev) {
      line(`   > EVENT [deck:situations]: ${ev.title}`);
      let idx = ev.choices.findIndex((c) => choiceAvailable(g, c));
      if (idx < 0) idx = 0;
      line(`     chose: "${ev.choices[idx].label}"`);
      const er = resolveChoice(g, db, ev, idx);
      if (er.roll) { showRoll(er.roll, "     "); continueRoll(g, db, er.roll); }
      showLog(g, 1, "     ");
    }
  }
  if (!done) endDay(g, db);
}

line(`\nfinal stats: ${JSON.stringify(g.player.stats)}`);

// -- Outcome verbs (the engine-growth set; setTier now moves along the rings) --
line(`\n-- outcome verbs --`);

applyOutcome(g, db, { setTier: "fringe" });
line(`   setTier         -> ${g.tier === "fringe" ? "OK" : "FAIL"} (ring "${g.tier}")`);

const hadAlly = g.player.circle.includes("npc_contact");
applyOutcome(g, db, { removeFromCircle: "npc_contact" });
line(`   removeFromCircle-> ${hadAlly && !g.player.circle.includes("npc_contact") ? "OK" : "FAIL"}`);

applyOutcome(g, db, { advanceClock: { id: "coldcase", by: 1, label: "Cold Case", max: 5, onFull: "ev_payoff" } });
const qBefore = g.queue.length;
applyOutcome(g, db, { clearClock: "coldcase" });
line(`   clearClock      -> ${!g.clocks?.["coldcase"] && g.queue.length === qBefore ? "OK" : "FAIL"} (no onFull fired)`);

applyOutcome(g, db, { scheduleEvent: { eventId: "ev_payoff", inDays: 3 } });
applyOutcome(g, db, { cancelScheduled: "ev_payoff" });
line(`   cancelScheduled -> ${!(g.scheduled ?? []).some((s) => s.eventId === "ev_payoff") ? "OK" : "FAIL"}`);

line(`\n-- procedural NPCs --`);
for (let i = 0; i < 3; i++) {
  const n = generateNpc(g, db, "peer");
  line(`   ${n.name}  (ability ${n.ability}, loyalty ${n.loyalty})`);
}

line(`\n-- season sim: Alpha (70) vs Beta (55), 20 games --`);
let a = 0, b = 0;
for (let i = 0; i < 20; i++) (simulateGame(g, db, "team_alpha", "team_beta") === "team_alpha" ? a++ : b++);
line(`   record: Alpha ${a} - ${b} Beta   (ratings now ${g.teams.team_alpha.rating.toFixed(0)} / ${g.teams.team_beta.rating.toFixed(0)})`);

const saved = serialize(g);
const g2 = deserialize(saved);
line(`\nsave/load roundtrip OK: ${g2.day === g.day && g2.player.stats.standing === g.player.stats.standing}  (${saved.length} bytes)`);
line();
