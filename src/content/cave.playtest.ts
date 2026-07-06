// ============================================================================
// content/cave.playtest.ts — headless playtest of the Cave scene. Proves the
// chained cards fire in order via the queue, choices apply their moves, the
// tradecraft rolls resolve, items grant/leave, and the scene EXITS cleanly.
// Run: npm run playtest:cave
// ============================================================================

import type { ContentDB, GameState } from "../engine/types";
import {
  newGame, availableActions, takeAction, drawEvent, resolveChoice,
  continueRoll, choiceAvailable,
} from "../engine/engine";
import { caveEvents, caveEntryAction, caveItems } from "./cave";

// Minimal ContentDB — just enough to host the cave scene.
const db: ContentDB = {
  events: caveEvents,
  actions: [caveEntryAction],
  towns: {},
  teams: {},
  traits: {},
  items: caveItems,
  names: { first: ["A"], last: ["B"], teamA: ["A"], teamB: ["B"] },
};

const line = (s = "") => console.log(s);

// Walk the scene, choosing by event id where specified, else the first available.
function play(label: string, seed: number, choiceById: Record<string, number>): GameState {
  line(`\n=== ${label} ===`);
  const g = newGame({ seed, name: "You", age: 25, body: { height: 0.5, build: 0.5 }, townId: "region", tier: "outer" }, db);
  line(`start grip ${g.player.stats.grip}, items [${g.player.items}]`);

  const act = availableActions(g, db).find((a) => a.id === "ux_act_cave_reese");
  if (!act) { line("!! entry action unavailable"); return g; }
  takeAction(g, db, act); // costs 3 energy, queues ux_cave_enter

  let steps = 0;
  while (g.queue.length && steps++ < 50) {
    const ev = drawEvent(g, db, 1);
    if (!ev) break;
    let idx = choiceById[ev.id];
    if (idx == null || idx >= ev.choices.length || !choiceAvailable(g, ev.choices[idx])) {
      idx = ev.choices.findIndex((c) => choiceAvailable(g, c));
    }
    if (idx < 0) idx = 0;
    line(`  [${ev.id}] "${ev.choices[idx].label}"`);
    const r = resolveChoice(g, db, ev, idx);
    if (r.roll) {
      line(`     roll: d20 ${r.roll.die} + ${r.roll.mod} = ${r.roll.total} vs ${r.roll.target} -> ${r.roll.success ? "WIN" : "LOSE"}`);
      continueRoll(g, db, r.roll);
    }
    line(`     > ${g.log[0].text}`);
  }

  const setFlags = Object.keys(g.flags).filter((k) => g.flags[k] !== false);
  line(`  end: grip ${g.player.stats.grip}, money ${g.player.stats.money}, items [${g.player.items}]`);
  line(`  flags: ${setFlags.map((k) => `${k}=${g.flags[k]}`).join(", ")}`);
  line(`  queue empty (scene exited): ${g.queue.length === 0}`);
  return g;
}

const check = (name: string, cond: boolean) => line(`  ${cond ? "OK  " : "FAIL"} ${name}`);

// Route 1 — the deep dive: keep going, let the voice in, squeeze through, link
// Nora at the etchings, take the shard on the way out. Exercises both rolls,
// item grant + potential loss, string flags, and the exit.
const deep = play("deep dive (voice / squeeze / nora / take shard)", 20482, {
  ux_cave_enter: 0,          // take point
  ux_cave_descend: 0,        // keep going
  ux_cave_heard: 1,          // "that was a voice" (grip -1)
  ux_cave_squeeze: 0,        // right behind you -> the throat
  ux_cave_deep: 0,           // follow the lamp
  ux_cave_etchings: 1,       // Nora link (grip -1)
  ux_cave_return: 2,         // take the shard, then the squeeze
});
line("\n-- assertions (deep dive) --");
check("scene exited (queue empty)", deep.queue.length === 0);
check("cave_done set", deep.flags.cave_done === true);
check("cave_deep_seen set", deep.flags.cave_deep_seen === true);
check("etchings_link_nora set", deep.flags.etchings_link_nora === true);
check("took_shard set", deep.flags.took_shard === true);
check("marked_shard in inventory", deep.player.items.includes("marked_shard"));
check("thread_reese set (Aunt Marie unlock)", deep.flags.thread_reese === true);
check("grip dropped from 10", deep.player.stats.grip < 10);

// Route 2 — the sensible day: turn back early. Proves the safe out ends the
// scene clean with no deep content and a small grip reward.
const back = play("turn back early (the sensible day)", 771, {
  ux_cave_enter: 0,
  ux_cave_descend: 1,        // call it — turn back
});
line("\n-- assertions (turn back) --");
check("scene exited (queue empty)", back.queue.length === 0);
check("cave_turned_back set", back.flags.cave_turned_back === true);
check("cave_done set", back.flags.cave_done === true);
check("did NOT reach the deep chamber", back.flags.cave_deep_seen !== true);
check("grip rewarded (>= start)", back.player.stats.grip >= 10);
check("entry action retired after trip", availableActions(back, db).every((a) => a.id !== "ux_act_cave_reese"));

line();
