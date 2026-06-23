// ============================================================================
// engine.ts — all engine logic. Small on purpose. It knows how to:
//   evaluate conditions · collect modifiers · resolve outcomes & dice rolls ·
//   draw events · advance a day · create / save / load a game · generate NPCs
//   and simulate games (Elo) for emergent dynasties.
// It contains NO content. Everything it operates on comes from the ContentDB.
// ============================================================================

import {
  randFloat, randInt, d20, pick, chance, seedToState,
} from "./rng";
import type {
  ContentDB, GameState, Stats, StatKey, Modifier, Outcome, ResolvedRoll,
  Condition, GameEvent, LocationAction, Npc, BodyArchetype, Tier,
} from "./types";

// ---- engine tuning seam ------------------------------------------------------
// Content overrides these; the engine falls back to the exact values it used to
// hardcode, so an absent (or partial) tuning block leaves behavior unchanged.
export const DEFAULT_OPENING_LOG = "A new game begins."; // neutral; content sets its own via db.openingLog

export function heatTuning(db: ContentDB): { max: number; coolPerDay: number; threshold: number; consequenceEvent: string } {
  const h = db.tuning?.heat;
  return {
    max: h?.max ?? 12,
    coolPerDay: h?.coolPerDay ?? 1,
    threshold: h?.threshold ?? 6,
    consequenceEvent: h?.consequenceEvent ?? "ev_heat",
  };
}

// ---- stat clamping -----------------------------------------------------------
export function clampStats(s: Stats, heatMax = 12): void {
  s.money = Math.max(0, Math.round(s.money));
  s.skill = Math.max(0, s.skill);
  s.reputation = Math.max(0, s.reputation);
  s.heat = Math.min(heatMax, Math.max(0, s.heat));
  s.energy = Math.min(s.energyMax, Math.max(0, s.energy));
}

// ---- conditions --------------------------------------------------------------
export function evalCondition(c: Condition, g: GameState): boolean {
  switch (c.kind) {
    case "stat": {
      const v = g.player.stats[c.stat];
      if (c.op === ">=") return v >= c.value;
      if (c.op === "<=") return v <= c.value;
      if (c.op === ">") return v > c.value;
      if (c.op === "<") return v < c.value;
      return v === c.value;
    }
    case "flag":
      return c.equals === undefined ? !!g.flags[c.flag] : g.flags[c.flag] === c.equals;
    case "noflag":
      return !g.flags[c.flag];
    case "trait":
      return g.player.traits.includes(c.trait);
    case "tier":
      return g.tier === c.tier;
    case "all":
      return c.of.every((x) => evalCondition(x, g));
    case "any":
      return c.of.some((x) => evalCondition(x, g));
    case "not":
      return !evalCondition(c.of, g);
  }
}

// ---- the ONE modifier system (traits + items + assigned allies) --------------
function npcToModifier(npc: Npc): Modifier {
  return { id: "ally:" + npc.id, source: "ally", label: npc.name, stats: npc.brings, rollMods: npc.rollBrings };
}

export function activeModifiers(g: GameState, db: ContentDB): Modifier[] {
  const mods: Modifier[] = [];
  for (const id of g.player.traits) if (db.traits[id]) mods.push(db.traits[id]);
  for (const id of g.player.items) if (db.items[id]) mods.push(db.items[id]);
  for (const id of g.player.circle) {
    const npc = g.npcs[id];
    if (npc) mods.push(npcToModifier(npc));
  }
  return mods;
}

// "effective" stat = base + persistent modifier bonuses (used for rolls/display).
// Spendable resources (money/energy) are read/written on the BASE stats.
export function effectiveStat(g: GameState, db: ContentDB, key: StatKey): number {
  let v = g.player.stats[key];
  for (const m of activeModifiers(g, db)) if (m.stats && m.stats[key] != null) v += m.stats[key]!;
  return v;
}

export function rollModFor(g: GameState, db: ContentDB, tag: string): number {
  let sum = 0;
  for (const m of activeModifiers(g, db)) {
    if (!m.rollMods) continue;
    for (const rm of m.rollMods) if (rm.tag === tag || rm.tag === "*") sum += rm.amount;
  }
  return sum;
}

// ---- the Circle (assigned allies) -------------------------------------------
// player.circle holds up to CIRCLE_MAX npc ids. Each assigned npc's `brings`
// already flow through activeModifiers() above, so slotting an ally uses the
// SAME unified modifier system as traits and items (Pillar 3) — no new path.
export const CIRCLE_MAX = 3;

// Drop a person into the world (g.npcs) so they can be met / recruited later.
export function introduceNpc(g: GameState, npc: Npc): void {
  if (!g.npcs[npc.id]) g.npcs[npc.id] = npc;
}

// Slot a met npc into the Circle. False if they aren't known or the slots are full.
export function assignToCircle(g: GameState, npcId: string, role?: string): boolean {
  const npc = g.npcs[npcId];
  if (!npc) return false;
  if (g.player.circle.includes(npcId)) return true;
  if (g.player.circle.length >= CIRCLE_MAX) return false;
  if (role) npc.role = role;
  npc.relationship = "ally";
  g.player.circle.push(npcId);
  return true;
}

export function removeFromCircle(g: GameState, npcId: string): void {
  g.player.circle = g.player.circle.filter((id) => id !== npcId);
}

// ---- the resolver ------------------------------------------------------------
// Applies all non-roll effects immediately. If the outcome has a roll, returns
// the resolved roll for the caller to surface (show dice), then continue.
export function applyOutcome(g: GameState, db: ContentDB, o: Outcome): { roll?: ResolvedRoll } {
  if (o.stats) {
    for (const k in o.stats) (g.player.stats as any)[k] += (o.stats as any)[k];
    clampStats(g.player.stats, heatTuning(db).max);
  }
  if (o.grantTraits) for (const t of o.grantTraits) if (!g.player.traits.includes(t)) g.player.traits.push(t);
  if (o.removeTraits) g.player.traits = g.player.traits.filter((t) => !o.removeTraits!.includes(t));
  if (o.setFlags) Object.assign(g.flags, o.setFlags);
  if (o.setRelationship && g.npcs[o.setRelationship.npcId]) {
    g.npcs[o.setRelationship.npcId].relationship = o.setRelationship.value;
  }
  if (o.introduceNpc && db.npcs && db.npcs[o.introduceNpc]) {
    introduceNpc(g, JSON.parse(JSON.stringify(db.npcs[o.introduceNpc])) as Npc);
  }
  if (o.addToCircle) {
    if (!g.npcs[o.addToCircle] && db.npcs && db.npcs[o.addToCircle]) {
      introduceNpc(g, JSON.parse(JSON.stringify(db.npcs[o.addToCircle])) as Npc);
    }
    assignToCircle(g, o.addToCircle);
  }
  if (o.grantItems) for (const it of o.grantItems) if (!g.player.items.includes(it)) g.player.items.push(it);
  if (o.removeItems) g.player.items = g.player.items.filter((it) => !o.removeItems!.includes(it));
  if (o.scheduleEvent) (g.scheduled ||= []).push({ onDay: g.day + o.scheduleEvent.inDays, eventId: o.scheduleEvent.eventId });
  if (o.advanceClock) {
    const a = o.advanceClock;
    g.clocks ||= {};
    const c = g.clocks[a.id] ?? (g.clocks[a.id] = { label: a.label ?? a.id, value: 0, max: a.max ?? 1, onFull: a.onFull });
    c.value += a.by;
    if (c.value >= c.max) {
      if (c.onFull) g.queue.push(c.onFull);   // queue the payoff event
      delete g.clocks[a.id];                  // ...and clear the filled clock
    }
  }
  if (o.queueEvent) g.queue.push(o.queueEvent);
  if (o.log) g.log.unshift({ text: o.log, tone: o.tone ?? "n" });

  if (o.roll) {
    const mod =
      (o.roll.base ?? 0) +
      (o.roll.statMod ? Math.floor(effectiveStat(g, db, o.roll.statMod) / 2) : 0) +
      rollModFor(g, db, o.roll.tag);
    const die = d20(g);
    const total = die + mod;
    return {
      roll: {
        tag: o.roll.tag, die, mod, total, target: o.roll.target,
        success: total >= o.roll.target, win: o.roll.win, lose: o.roll.lose,
      },
    };
  }
  return {};
}

// Apply the win/lose branch after a roll is shown. (win/lose carry no nested roll.)
export function continueRoll(g: GameState, db: ContentDB, r: ResolvedRoll): void {
  applyOutcome(g, db, r.success ? r.win : r.lose);
}

// ---- location actions --------------------------------------------------------
export function availableActions(g: GameState, db: ContentDB): LocationAction[] {
  return db.actions.filter(
    (a) =>
      (!a.tiers || a.tiers.includes(g.tier)) &&
      (!a.towns || a.towns.includes(g.townId)) &&
      (!a.requires || evalCondition(a.requires, g)),
  );
}

export function takeAction(g: GameState, db: ContentDB, a: LocationAction): { roll?: ResolvedRoll } {
  if (g.player.stats.energy < a.cost) {
    g.log.unshift({ text: "Too tired for that right now.", tone: "n" });
    return {};
  }
  g.player.stats.energy = Math.max(0, g.player.stats.energy - a.cost);
  return applyOutcome(g, db, a.outcome);
  // Caller checks a.isClear after resolving (and continuing any roll) to detect a clear.
}

// ---- events ------------------------------------------------------------------
function tierMatch(t: Tier | Tier[] | undefined, cur: Tier): boolean {
  if (!t) return true;
  return Array.isArray(t) ? t.includes(cur) : t === cur;
}

export function eligibleEvents(g: GameState, db: ContentDB): GameEvent[] {
  return Object.values(db.events).filter(
    (ev) =>
      (!ev.once || !g.flags[ev.once]) &&
      tierMatch(ev.tier, g.tier) &&
      (!ev.condition || evalCondition(ev.condition, g)),
  );
}

function fireEvent(g: GameState, ev: GameEvent): void {
  if (ev.once) g.flags[ev.once] = true;
}

// Queued (chained) events fire first; otherwise a random eligible event with prob p.
export function drawEvent(g: GameState, db: ContentDB, p: number): GameEvent | undefined {
  while (g.queue.length) {
    const id = g.queue.shift()!;
    const ev = db.events[id];
    if (ev && (!ev.once || !g.flags[ev.once]) && (!ev.condition || evalCondition(ev.condition, g))) {
      fireEvent(g, ev);
      return ev;
    }
  }
  if (!chance(g, p)) return undefined;
  const pool = eligibleEvents(g, db);
  if (!pool.length) return undefined;
  // weighted pick: GameEvent.weight (default 1) lets big story cards be rarer than texture
  const totalWeight = pool.reduce((sum, e) => sum + (e.weight ?? 1), 0);
  let r = randFloat(g) * totalWeight;
  let ev = pool[pool.length - 1];
  for (const cand of pool) { r -= cand.weight ?? 1; if (r < 0) { ev = cand; break; } }
  fireEvent(g, ev);
  return ev;
}

export function choiceAvailable(g: GameState, c: { requires?: Condition }): boolean {
  return !c.requires || evalCondition(c.requires, g);
}

export function resolveChoice(g: GameState, db: ContentDB, ev: GameEvent, idx: number): { roll?: ResolvedRoll } {
  return applyOutcome(g, db, ev.choices[idx].outcome);
}

// ---- the day loop ------------------------------------------------------------
export function endDay(g: GameState, db: ContentDB): void {
  const heat = heatTuning(db);
  g.day += 1;
  g.player.stats.energy = g.player.stats.energyMax;
  g.player.stats.heat = Math.max(0, g.player.stats.heat - heat.coolPerDay); // liability cools over time
  g.log.unshift({ text: `— Day ${g.day}.`, tone: "n" });
  if (g.player.stats.heat >= heat.threshold && db.events[heat.consequenceEvent]) g.queue.push(heat.consequenceEvent); // scheduled consequence
  // after the date advances, sweep any timed-event promises now due onto the queue
  if (g.scheduled && g.scheduled.length) {
    for (const s of g.scheduled) if (s.onDay <= g.day) g.queue.push(s.eventId);
    g.scheduled = g.scheduled.filter((s) => s.onDay > g.day);
  }
}

// ---- new game / save / load --------------------------------------------------
export interface NewGameOpts {
  seed: number;
  name: string;
  age: number;
  body: BodyArchetype;
  answers: number[]; // chosen answer index per questionnaire question
  townId: string;
  tier: Tier;
}

export function newGame(opts: NewGameOpts, db: ContentDB): GameState {
  const q = db.questionnaire;
  const a0 = q.questions[0].answers[opts.answers[0]];
  const stats: Stats = { money: 0, energy: 0, energyMax: 3, skill: 0, reputation: 0, heat: 0, ...(a0.base || {}) };
  const archetype = a0.archetype || "Player";
  const flags: Record<string, boolean | number | string> = {};
  if (a0.flag) flags[a0.flag] = true;

  for (let i = 1; i < q.questions.length; i++) {
    const ai = q.questions[i].answers[opts.answers[i]];
    if (ai.patch) for (const k in ai.patch) (stats as any)[k] += (ai.patch as any)[k];
    if (ai.flag) flags[ai.flag] = true;
  }
  stats.energy = stats.energyMax;
  clampStats(stats, heatTuning(db).max);

  return {
    seed: opts.seed,
    rngState: seedToState(opts.seed),
    day: 1,
    tier: opts.tier,
    townId: opts.townId,
    player: {
      name: opts.name, age: opts.age, archetype, body: opts.body,
      portrait: { face: "f1", skin: "s1", hair: "h1" },
      stats, traits: [], items: [], circle: [],
    },
    npcs: db.npcs ? (JSON.parse(JSON.stringify(db.npcs)) as Record<string, Npc>) : {}, // spawn authored fixtures
    scheduled: [],
    clocks: {},
    teams: JSON.parse(JSON.stringify(db.teams)), // live copy; ratings can drift via Elo
    flags,
    queue: [],
    log: [{ text: db.openingLog ?? DEFAULT_OPENING_LOG, tone: "n" }],
  };
}

export function serialize(g: GameState): string {
  return JSON.stringify(g);
}
export function deserialize(s: string): GameState {
  const g = JSON.parse(s) as GameState;
  g.scheduled ??= [];   // backfill time-substrate fields so pre-Milestone-4 saves keep loading
  g.clocks ??= {};
  return g;
}

// ---- procedural generation (Phase 4 preview) ---------------------------------
export function generateName(g: GameState, db: ContentDB): string {
  return pick(g, db.names.first) + " " + pick(g, db.names.last);
}

// Ratings cluster around the middle with the occasional star (rough bell shape).
export function rollRating(g: GameState): number {
  return Math.round((randInt(g, 30, 80) + randInt(g, 30, 80) + randInt(g, 40, 70)) / 3);
}

export function generateNpc(g: GameState, db: ContentDB, role?: string): Npc {
  return {
    id: "npc_" + Math.floor(randFloat(g) * 1e9).toString(36),
    name: generateName(g, db),
    role,
    ability: rollRating(g),
    brings: {},
    rollBrings: [],
    traits: [],
    loyalty: randInt(g, 30, 80),
    isFixture: false,
    relationship: "neutral",
  };
}

// Elo expectation + update. Run many of these across a season and dynasties,
// upsets, and rises/falls emerge on their own (Pillar 7).
export function expectedScore(rA: number, rB: number): number {
  return 1 / (1 + Math.pow(10, (rB - rA) / 15));
}

export function simulateGame(g: GameState, db: ContentDB, aId: string, bId: string, k = 4): string {
  const A = g.teams[aId];
  const B = g.teams[bId];
  const eA = expectedScore(A.rating, B.rating);
  const aWins = chance(g, eA);
  A.rating += k * ((aWins ? 1 : 0) - eA);
  B.rating += k * ((aWins ? 0 : 1) - (1 - eA));
  return aWins ? aId : bId;
}
