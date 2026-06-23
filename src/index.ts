// ============================================================================
// index.ts — a HEADLESS SMOKE TEST for the forked engine. It proves the engine
// runs end-to-end against the neutral placeholder content in src/smoke: creates
// a character, plays days greedily, resolves dice events, assigns an ally to the
// Circle, then previews procedural NPCs, an Elo season sim, and a save/load
// roundtrip. Run: npm install && npm run demo
//
// This mirrors Hoop World's original headless demo but is theme-agnostic. It
// (and src/smoke) gets rewritten once real content exists (Task 2).
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

const g = newGame(
  { seed: 70499, name: "You", age: 25, body: { height: 0.5, build: 0.5 }, answers: [0, 0], townId: "region_one", tier: "street" },
  db,
);

line(`\n=== Scythians Games II — engine smoke test ===`);
line(`${g.player.archetype}, age ${g.player.age}`);
line(`start: ${JSON.stringify(g.player.stats)}`);

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

    line(`\n${dateOf(g.day).label} | ${a.name}  (energy ${g.player.stats.energy}, rep ${g.player.stats.reputation})`);
    const res = takeAction(g, db, a);
    if (res.roll) {
      showRoll(res.roll, "   ");
      continueRoll(g, db, res.roll);
      if (a.isClear) { line("   *** HUB CLEARED ***"); done = true; break; }
    }
    showLog(g, 1, "   ");

    const ev = drawEvent(g, db, 0.5);
    if (ev) {
      line(`   > EVENT: ${ev.title}`);
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

line(`\n-- procedural NPCs --`);
for (let i = 0; i < 3; i++) {
  const n = generateNpc(g, db, "peer");
  line(`   ${n.name}  (ability ${n.ability}, loyalty ${n.loyalty})`);
}

line(`\n-- season sim: Alpha (70) vs Beta (55), 20 games --`);
let a = 0, b = 0;
for (let i = 0; i < 20; i++) (simulateGame(g, db, "team_alpha", "team_beta") === "team_alpha" ? a++ : b++);
line(`   record: Alpha ${a} - ${b} Beta   (ratings now ${g.teams.team_alpha.rating.toFixed(0)} / ${g.teams.team_beta.rating.toFixed(0)})`);

// -- new Outcome verbs (the engine-growth set Task 2 assumes) --
// Fired declaratively through applyOutcome, exactly as content will.
line(`\n-- outcome verbs --`);

applyOutcome(g, db, { setTier: "highschool" });
line(`   setTier         -> ${g.tier === "highschool" ? "OK" : "FAIL"} (now "${g.tier}")`);

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

const saved = serialize(g);
const g2 = deserialize(saved);
line(`\nsave/load roundtrip OK: ${g2.day === g.day && g2.player.stats.reputation === g.player.stats.reputation}  (${saved.length} bytes)`);
line();
