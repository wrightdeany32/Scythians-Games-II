// ============================================================================
// engine.ts — all engine logic. Small on purpose. It knows how to:
//   evaluate conditions · collect modifiers · resolve outcomes & dice rolls ·
//   draw events · advance a day · create / save / load a game · generate NPCs
//   and simulate faction clashes (Elo) for emergent power drift.
// It contains NO content. Everything it operates on comes from the ContentDB.
//
// THE FOUR INVARIANTS (ratified 2026-07-03 / 2026-07-06). One negative space:
// no stored MEANING, no shown STRUCTURE, no stored POSITION, no confirmed META.
// Iterate freely inside these walls; never build through them.
//
// 1 · NO-TRUTH-STATE — the engine holds NO meaning-state: no reveal flag, no
//     truth accumulator, no canonical-explanation field, ever. Endings select
//     off accumulated flags and coordinates, never off a stored "answer."
//     There is nowhere in GameState to put "what it was really all along," and
//     there must never be. This is the architectural half of the anti-noun
//     pillar: the machine literally cannot say "so actually it's X" unless a
//     card says it. Do not add a `truth` enum for ending-selection; use
//     flags/counts. Cheap to keep, expensive to recover.
// 2 · NO-CATALOG — surfaces show no structure. What the player KNOWS (places
//     been, people met, qualitative statuses) may render; what REMAINS never
//     does: no deck names, no completion meters, no "3 of 12," no unlock
//     toasts. A content inventory is a truth-state for structure. The engine's
//     side of the wall: expose no API that enumerates unseen content for a
//     renderer to count.
// 3 · NO-STORED-DISPOSITION — the engine stores the EVENTS (the thin resolved-
//     coordinate log) and DERIVES the player's place in the diamond on demand;
//     it never persists a disposition coordinate. A hand reaching to add
//     `player.disposition` is the same reach as adding a `truth` enum — it
//     hits the same wall. (Grip and tier are the two legitimate mechanical
//     stats that double as coordinates; nothing else is.)
// 4 · NO-META-REVEAL — the meta-layer is all seed, never payoff. No card ever
//     confirms it, and no engine mechanism may either: the cross-run store
//     carries existence + place (faction drift, artifact stubs), never
//     meaning. The card that "pays off" the meta-story must never exist.
// ============================================================================

import {
  randFloat, randInt, d20, pick, chance, seedToState,
} from "./rng";
import type {
  ContentDB, GameState, Stats, StatKey, Modifier, Outcome, ResolvedRoll,
  Condition, GameEvent, LocationAction, Npc, BodyArchetype, Tier, Faction,
  CrossRunStore, CoordLogEntry, DiamondCoord, DeckDef, GripBand,
} from "./types";
import { dispositionCentroid, lensCentroid } from "./centroid";

// ---- engine tuning seam ------------------------------------------------------
// Content overrides these; the engine falls back to the exact values it used to
// hardcode, so an absent (or partial) tuning block leaves behavior unchanged.
export const DEFAULT_OPENING_LOG = "A new game begins."; // neutral; content sets its own via db.openingLog
export const GRIP_MAX = 10;                              // grip clamps to 0..GRIP_MAX (a plain grounding meter)

export function exposureTuning(db: ContentDB): { max: number; coolPerDay: number; threshold: number; consequenceEvent: string } {
  const e = db.tuning?.exposure;
  return {
    max: e?.max ?? 12,
    coolPerDay: e?.coolPerDay ?? 1,
    threshold: e?.threshold ?? 6,
    consequenceEvent: e?.consequenceEvent ?? "ev_exposure_discharge",
  };
}

// One deep-clone helper for the load-bearing copies (content → live state,
// live state → cross-run store). JSON-based on purpose: everything cloned is
// plain JSON data by design, so the semantics match serialize/deserialize
// exactly — and there is one place to change if that ever needs to move.
function deepClone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

// ---- stat clamping -----------------------------------------------------------
export function clampStats(s: Stats, exposureMax = 12): void {
  s.money = Math.max(0, Math.round(s.money));
  s.tradecraft = Math.max(0, s.tradecraft);
  s.standing = Math.max(0, s.standing);
  s.exposure = Math.min(exposureMax, Math.max(0, s.exposure));
  s.grip = Math.min(GRIP_MAX, Math.max(0, s.grip)); // plain meter; content moves it, engine only clamps
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
    case "count": {
      const n = c.of.reduce((k, x) => k + (evalCondition(x, g) ? 1 : 0), 0);
      if (c.op === ">=") return n >= c.value;
      if (c.op === "<=") return n <= c.value;
      if (c.op === ">") return n > c.value;
      if (c.op === "<") return n < c.value;
      return n === c.value;
    }
    case "counter": {
      const raw = g.flags[c.flag];
      const n = typeof raw === "number" ? raw : 0;   // unset (or non-numeric) reads 0
      if (c.op === ">=") return n >= c.value;
      if (c.op === "<=") return n <= c.value;
      if (c.op === ">") return n > c.value;
      if (c.op === "<") return n < c.value;
      return n === c.value;
    }
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

// ---- the tier ladder ---------------------------------------------------------
// Move the player to a tier. A plain set (not just a bump) so content can express
// promotion AND demotion/getting-busted with no further engine change. Re-clamps
// afterward so any tier-coupled bounds stay honored.
export function setTier(g: GameState, db: ContentDB, tier: Tier): void {
  g.tier = tier;
  clampStats(g.player.stats, exposureTuning(db).max);
}

// ---- the resolver ------------------------------------------------------------
// Applies all non-roll effects immediately. If the outcome has a roll, returns
// the resolved roll for the caller to surface (show dice), then continue.
export function applyOutcome(g: GameState, db: ContentDB, o: Outcome): { roll?: ResolvedRoll } {
  if (o.stats) {
    for (const k in o.stats) {
      const key = k as StatKey;
      const delta = o.stats[key]!;
      const before = g.player.stats[key];
      let after = before + delta;
      // soft ceiling: this outcome's POSITIVE delta never lifts the stat above
      // its named cap (and never lowers a stat already above it)
      const cap = o.statsMax?.[key];
      if (cap != null && delta > 0 && after > cap) after = Math.max(before, cap);
      (g.player.stats as any)[key] = after;
    }
    clampStats(g.player.stats, exposureTuning(db).max);
  }
  if (o.grantTraits) for (const t of o.grantTraits) if (!g.player.traits.includes(t)) g.player.traits.push(t);
  if (o.removeTraits) g.player.traits = g.player.traits.filter((t) => !o.removeTraits!.includes(t));
  if (o.setFlags) Object.assign(g.flags, o.setFlags);
  if (o.addFlags) {
    for (const k in o.addFlags) {
      const raw = g.flags[k];
      g.flags[k] = (typeof raw === "number" ? raw : 0) + o.addFlags[k];
    }
  }
  if (o.setRelationship && g.npcs[o.setRelationship.npcId]) {
    g.npcs[o.setRelationship.npcId].relationship = o.setRelationship.value;
  }
  if (o.setTier) setTier(g, db, o.setTier);
  if (o.introduceNpc && db.npcs && db.npcs[o.introduceNpc]) {
    introduceNpc(g, deepClone(db.npcs[o.introduceNpc]));
  }
  if (o.addToCircle) {
    if (!g.npcs[o.addToCircle] && db.npcs && db.npcs[o.addToCircle]) {
      introduceNpc(g, deepClone(db.npcs[o.addToCircle]));
    }
    assignToCircle(g, o.addToCircle);
  }
  if (o.removeFromCircle) removeFromCircle(g, o.removeFromCircle);
  if (o.grantItems) for (const it of o.grantItems) if (!g.player.items.includes(it)) g.player.items.push(it);
  if (o.removeItems) g.player.items = g.player.items.filter((it) => !o.removeItems!.includes(it));
  if (o.scheduleEvent) (g.scheduled ||= []).push({ onDay: g.day + o.scheduleEvent.inDays, eventId: o.scheduleEvent.eventId });
  if (o.cancelScheduled && g.scheduled) g.scheduled = g.scheduled.filter((s) => s.eventId !== o.cancelScheduled);
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
  if (o.clearClock && g.clocks) delete g.clocks[o.clearClock];   // abandon a clock without firing onFull
  // Scene-chain continuations go to the FRONT of the queue (Armature's Phase-2
  // ruling on the morning-pileup seam): a chained card continues the CURRENT
  // scene before any other queued beat, so a scene plays contiguously even
  // when several beats stacked up at the day boundary. Internal order is
  // preserved — queueEvent first, then queueEvents in authored order (the
  // conditional-insert pattern still self-selects via nextQueuedEvent's skip).
  // Byte-safe for linear single-chain scenes by construction (front == back on
  // an otherwise-empty queue); the frozen cave transcript is the regression
  // gate. Clock payoffs (onFull, above) and endDay's morning queueing stay
  // back-of-queue — those are NEW beats, not continuations of this one.
  if (o.queueEvent || o.queueEvents) {
    g.queue.unshift(...(o.queueEvent ? [o.queueEvent] : []), ...(o.queueEvents ?? []));
  }
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
  recordResolution(g, a);   // research actions are ordinary card-resolutions — same log, no special case
  return applyOutcome(g, db, a.outcome);
  // Caller checks a.isClear after resolving (and continuing any roll) to detect a clear.
}

// ---- events ------------------------------------------------------------------
function tierMatch(t: Tier | Tier[] | undefined, cur: Tier): boolean {
  if (!t) return true;
  return Array.isArray(t) ? t.includes(cur) : t === cur;
}

// The ONE eligibility predicate — the pipeline's Filter step: depth (tier) ∧
// deck (tags) ∧ requires, the axis-separation model. `decks` scopes to a tag
// set (undefined = unscoped). WO-5's date term lands HERE and nowhere else,
// so every draw path inherits it at once.
function isEligible(g: GameState, ev: GameEvent, decks?: Set<string>): boolean {
  return (
    (!ev.once || !g.flags[ev.once]) &&
    tierMatch(ev.tier, g.tier) &&
    (!decks || (!!ev.tags && ev.tags.some((t) => decks.has(t)))) &&
    (!ev.condition || evalCondition(ev.condition, g))
  );
}

// Eligible events, optionally SCOPED to a deck (a tag the event must carry).
export function eligibleEvents(g: GameState, db: ContentDB, deck?: string): GameEvent[] {
  const decks = deck ? new Set([deck]) : undefined;
  return Object.values(db.events).filter((ev) => isEligible(g, ev, decks));
}

function fireEvent(g: GameState, ev: GameEvent): void {
  if (ev.once) g.flags[ev.once] = true;
}

// ---- the draw pipeline (WO-2) --------------------------------------------------
// THE one resolution order (ratified contract; both Batch-3 contracts live at
// their named steps and nowhere else):
//
//   Mount    mountedDecks — by physical location (towns) and active threads
//            (mountFlag). Calendar/schedule mounting arrives with {kind:"day"}
//            (WO-5), when a real card asks.
//   Filter   eligibility — tier ∧ tags ∧ requires (∧ date, with WO-5).
//   Weight   drawWeight — weight × proximity_diamond × proximity_lens ×
//            recency/anti-repeat. EVERY factor independently switchable and
//            OFF by default, so seed-matched bot A/Bs isolate each factor's
//            drift before anything ships on.
//   Draw     weightedPick, seed-deterministic — or nextQueuedEvent for a
//            chained scene.
//   Resolve-noise-once   band-select at card-fire (resolveBand), FROZEN on the
//            fired-card record, {trueBand, resolvedBand} → trace. Wired in the
//            SceneRunner's advance — the one card-fire path scenes present on.
//   Apply + record   applyOutcome + recordResolution (+ the Session's trace).

export function diamondProximityTuning(db: ContentDB): { enabled: boolean; strength: number; range: number } {
  const t = db.tuning?.diamondProximity;
  return { enabled: t?.enabled ?? false, strength: t?.strength ?? 0.5, range: t?.range ?? 1.5 };
}

export function lensBiasTuning(db: ContentDB): { enabled: boolean; strength: number } {
  const t = db.tuning?.lensBias;
  return { enabled: t?.enabled ?? false, strength: t?.strength ?? 0.3 };
}

export function antiRepeatTuning(db: ContentDB): { enabled: boolean; factor: number; memory: number } {
  const t = db.tuning?.antiRepeat;
  return { enabled: t?.enabled ?? false, factor: t?.factor ?? 0.5, memory: t?.memory ?? 5 };
}

// The centroids are invariant across a single draw, so they are derived ONCE
// per draw here and handed into the weight step (Armature's review note on
// PR #6) — and only derived at all when their switch is on. A null field means
// "factor off" to drawWeight.
interface WeightContext {
  diamond: DiamondCoord | null;
  lens: Record<string, number> | null;
}

function weightContext(g: GameState, db: ContentDB): WeightContext {
  return {
    diamond: diamondProximityTuning(db).enabled ? dispositionCentroid(g, db) : null,
    lens: lensBiasTuning(db).enabled ? lensCentroid(g, db) : null,
  };
}

// proximity_diamond: closeness between the card's (Y, Z) and the DERIVED
// disposition centroid, mapped to a boost in [1, 1 + strength] that fades
// linearly to nothing at `range`. Never a gate (floor 1 by construction), and
// an uncoordinated card is neutral/ubiquitous (flat 1). Grip/X cannot reach
// this computation — cards carry no X, and the centroid is (Y, Z) only — so
// the grip death-spiral cannot be baked at this chokepoint.
function proximityDiamond(db: ContentDB, c: DiamondCoord, ev: GameEvent): number {
  if (!ev.diamondCoord) return 1;
  const t = diamondProximityTuning(db);
  const dy = ev.diamondCoord.sanction - c.sanction;
  const dz = ev.diamondCoord.vertical - c.vertical;
  const near = Math.max(0, 1 - Math.sqrt(dy * dy + dz * dz) / t.range);
  return 1 + t.strength * near;
}

// proximity_lens — Contract 1 (Batch-3 v0.2): the lens-centroid's affinity
// mass on the candidate's lensFlavor, mapped LINEARLY into [1, 1 + strength]
// (defaults ⇒ [1.0, 1.3]). Floor 1.0 — never a gate, no down-weighting: every
// eligible card stays drawable at every lens; untagged cards take 1.0 flat.
// CONTINUOUS, never a categorical top-affinity match (binary would be jumpy
// and visible within a day, breaking the tuning target: perceptible across a
// run, unprovable within one). Reaches only deck-scoped RANDOM draws by
// construction — this multiplies inside drawWeight, which only weightedPick
// calls, which only the random draw tail reaches; queue-chained cards, the
// openingQueue, and `requires` never touch a weight.
function proximityLens(db: ContentDB, lens: Record<string, number>, ev: GameEvent): number {
  if (!ev.lensFlavor) return 1;
  return 1 + lensBiasTuning(db).strength * (lens[ev.lensFlavor] ?? 0);
}

// recency/anti-repeat: a card that just won a random draw weighs less for the
// next few random draws. Queue-chained cards never enter this memory — a
// scripted scene is not a repeat.
function antiRepeatFactor(g: GameState, db: ContentDB, ev: GameEvent): number {
  return (g.recentDraws ?? []).includes(ev.id) ? antiRepeatTuning(db).factor : 1;
}

function noteDraw(g: GameState, db: ContentDB, id: string): void {
  const mem = antiRepeatTuning(db).memory;
  const r = (g.recentDraws ??= []);
  r.push(id);
  if (r.length > mem) r.splice(0, r.length - mem);
}

// The Weight step — kept as the single chokepoint (a ratified seam), so every
// weighting layer is a one-function change, not a rewrite. With every switch
// off (the shipped default) this is exactly `ev.weight ?? 1`: behavior
// identical to the pre-pipeline engine.
function drawWeight(g: GameState, db: ContentDB, ev: GameEvent, ctx: WeightContext): number {
  let w = ev.weight ?? 1;
  if (ctx.diamond) w *= proximityDiamond(db, ctx.diamond, ev);
  if (ctx.lens) w *= proximityLens(db, ctx.lens, ev);
  if (antiRepeatTuning(db).enabled) w *= antiRepeatFactor(g, db, ev);
  return w;
}

// Weighted pick over a pool using drawWeight — each candidate weighed exactly
// once, against centroids derived once. Returns undefined for an empty pool,
// and for a fully ZERO-weighted one: an exhausted pool (e.g. anti-repeat
// factor 0 with everything recent) draws nothing rather than force-repeating
// its tail card. No RNG is consumed for an undrawable pool.
function weightedPick(g: GameState, db: ContentDB, pool: GameEvent[]): GameEvent | undefined {
  if (!pool.length) return undefined;
  const ctx = weightContext(g, db);
  const weights = pool.map((e) => drawWeight(g, db, e, ctx));
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0) return undefined;
  let r = randFloat(g) * total;
  for (let i = 0; i < pool.length; i++) { r -= weights[i]; if (r < 0) return pool[i]; }
  return pool[pool.length - 1];   // float-edge fallback (r landed exactly on total)
}

// ---- band-select — Contract 2 (Batch-3 v0.2), the Resolve-noise-once step ------
// ONE presentation-time mechanism: a meter maps to its band (grounded 7–10 /
// worn 4–6 / frayed 0–3 — one boundary system with the grip<=3 illegible line),
// and with the noise switch on, the true band LEAKS to an ADJACENT band with
// probability p — never a two-band jump: that is the mechanical line between
// unfalsifiable and incoherent. Symmetric from the middle. Bands select among
// AUTHORED variants only (GameEvent.bandText), never generate text, never gate
// a choice, and are resolved ONCE at card-fire and frozen on the fired-card
// record — never re-rolled, never inside `requires`.
// With tuning.bandNoise.enabled off (the shipped default), resolvedBand ===
// trueBand and no RNG is consumed: banded cards still select their variant
// deterministically; the switch isolates the LEAK so bots can measure its
// drift. Meter-agnostic on purpose — companion-keyed calls pass the
// companion's meter with the same bands.
export function bandOf(meter: number): GripBand {
  return meter >= 7 ? "grounded" : meter >= 4 ? "worn" : "frayed";
}

export function bandNoiseTuning(db: ContentDB): { enabled: boolean; p: number } {
  const t = db.tuning?.bandNoise;
  return { enabled: t?.enabled ?? false, p: t?.p ?? 0.2 };
}

export function resolveBand(
  g: GameState, db: ContentDB, meter: number, noiseProfile?: number,
): { trueBand: GripBand; resolvedBand: GripBand } {
  const trueBand = bandOf(meter);
  const t = bandNoiseTuning(db);
  if (!t.enabled) return { trueBand, resolvedBand: trueBand };
  let resolvedBand = trueBand;
  if (chance(g, noiseProfile ?? t.p)) {
    resolvedBand = trueBand === "worn" ? (chance(g, 0.5) ? "grounded" : "frayed") : "worn";
  }
  return { trueBand, resolvedBand };
}

// Pull the next QUEUED (chained) event only — no random fallback. This is the
// primitive a chained scene advances on: when the queue is empty the scene is
// over. (drawEvent's random fallback would otherwise pull untagged scene cards
// out of context, since the no-tag convention only guards DECK-scoped draws.)
export function nextQueuedEvent(g: GameState, db: ContentDB): GameEvent | undefined {
  while (g.queue.length) {
    const id = g.queue.shift()!;
    const ev = db.events[id];
    if (ev && (!ev.once || !g.flags[ev.once]) && (!ev.condition || evalCondition(ev.condition, g))) {
      fireEvent(g, ev);
      return ev;
    }
  }
  return undefined;
}

// The ONE draw tail — the pipeline's Draw step, shared by every random draw
// path so the ritual (queue-first, the p-gate, the seed-deterministic pick,
// once-flag fire, anti-repeat memory) can never fork. WO-3's Resolve-noise-once
// (band-select, frozen at fire) lands on this path and nowhere else. The pool
// is built lazily, AFTER the p-gate, so all paths consume RNG identically.
function drawFromPool(g: GameState, db: ContentDB, p: number, pool: () => GameEvent[]): GameEvent | undefined {
  const queued = nextQueuedEvent(g, db);
  if (queued) return queued;
  if (!chance(g, p)) return undefined;
  const ev = weightedPick(g, db, pool());
  if (!ev) return undefined;
  fireEvent(g, ev);
  noteDraw(g, db, ev.id);   // random winners enter the anti-repeat memory; queued cards never do
  return ev;
}

// Queued (chained) events fire first; otherwise a random eligible event with prob p,
// optionally drawn from a single deck (tag). `deck` omitted = draw from all decks.
export function drawEvent(g: GameState, db: ContentDB, p: number, deck?: string): GameEvent | undefined {
  return drawFromPool(g, db, p, () => eligibleEvents(g, db, deck));
}

// ---- the deck registry (WO-2) ---------------------------------------------------
// Mount: which decks are live right now — physical location (towns) ∧ active
// threads (mountFlag). No registry (db.decks absent/empty) mounts nothing;
// content that predates the registry keeps using deck-scoped drawEvent
// unchanged.
export function mountedDecks(g: GameState, db: ContentDB): DeckDef[] {
  return (db.decks ?? []).filter(
    (d) => (!d.mountFlag || !!g.flags[d.mountFlag]) && (!d.towns || d.towns.includes(g.townId)),
  );
}

// The daily draw: the shared draw tail over the UNION of every mounted deck's
// eligible cards. A card in several mounted decks enters the pool once — deck
// membership is a tag, not a copy.
export function drawFromMounted(g: GameState, db: ContentDB, p: number): GameEvent | undefined {
  return drawFromPool(g, db, p, () => {
    const ids = new Set(mountedDecks(g, db).map((d) => d.id));
    return ids.size ? Object.values(db.events).filter((ev) => isEligible(g, ev, ids)) : [];
  });
}

export function choiceAvailable(g: GameState, c: { requires?: Condition }): boolean {
  return !c.requires || evalCondition(c.requires, g);
}

export function resolveChoice(g: GameState, db: ContentDB, ev: GameEvent, idx: number): { roll?: ResolvedRoll } {
  recordResolution(g, ev, ev.choices[idx]);   // once per resolved card, at BRANCH granularity (the wiring gate)
  return applyOutcome(g, db, ev.choices[idx].outcome);
}

// ---- the resolved-coordinate log (WO-1c; invariant #3's mechanism) -------------
// ONE entry builder for every coordinate-carrying source (a card, an action, a
// questionnaire answer), so the creation paths and the play path can never
// drift in entry shape. Returns undefined for a neutral source.
// `attune` (the option-3 X-volition scalar) rides the same builder: recorded
// here, derived by NOTHING in the play loop — see CoordLogEntry's fence.
type CoordSource = { diamondCoord?: DiamondCoord; lensFlavor?: string; attune?: number };

function coordEntry(index: number, src: CoordSource): CoordLogEntry | undefined {
  if (!src.diamondCoord && !src.lensFlavor && src.attune == null) return undefined;
  const entry: CoordLogEntry = { index };
  if (src.diamondCoord) entry.diamondCoord = { sanction: src.diamondCoord.sanction, vertical: src.diamondCoord.vertical };
  if (src.lensFlavor) entry.lensFlavor = src.lensFlavor;
  if (src.attune != null) entry.attune = src.attune;
  return entry;
}

// Every card/action resolution ticks the ordinal clock; a coordinated source
// also appends its thin entry — a coordinate and an ordinal, nothing else. The
// position itself is never stored here or anywhere: engine/centroid.ts derives
// it on demand from these events. Branch granularity: the CHOSEN branch's
// field wins, per-field, falling back to the card's (a branch may carry a
// flavor while inheriting the card's coordinate; `attune` follows the same rule).
function recordResolution(g: GameState, src: CoordSource, branch?: CoordSource): void {
  g.resolveCount = (g.resolveCount ?? 0) + 1;
  const entry = coordEntry(g.resolveCount, {
    diamondCoord: branch?.diamondCoord ?? src.diamondCoord,
    lensFlavor: branch?.lensFlavor ?? src.lensFlavor,
    attune: branch?.attune ?? src.attune,
  });
  if (entry) (g.coordLog ??= []).push(entry);
}

// ---- the terminal check --------------------------------------------------------
// The designed terminals' tuning, shared by loop.ts's runStatus and endDay's
// precedence guard below (defined HERE so the guard needs no engine→loop import).
export function terminalTuning(db: ContentDB): { onGripZero: boolean; flags: string[] } {
  const t = db.tuning?.terminal;
  return { onGripZero: t?.onGripZero ?? true, flags: t?.flags ?? [] };
}

// Does a designed terminal already hold? The boolean core of runStatus.
export function terminalHolds(g: GameState, db: ContentDB): boolean {
  const t = terminalTuning(db);
  if (t.onGripZero && g.player.stats.grip <= 0) return true;
  return t.flags.some((f) => !!g.flags[f]);
}

// ---- the day loop ------------------------------------------------------------
// Everything that fires "when the day turns" lives HERE, at one depth, so every
// day-advance driver gets identical mornings: the exposure consequence, the
// scheduled sweep, and the met-doors (WO-1d) all queue through this one path.
export function endDay(g: GameState, db: ContentDB): void {
  const exp = exposureTuning(db);
  g.day += 1;
  g.player.stats.energy = g.player.stats.energyMax;
  g.player.stats.exposure = Math.max(0, g.player.stats.exposure - exp.coolPerDay); // liability cools (coolPerDay 0 = sticky)
  g.log.unshift({ text: `— Day ${g.day}.`, tone: "n" });
  // TERMINAL PRECEDENCE (ratified round decision: grip-zero-wins). When a
  // designed terminal already holds at the day boundary, the morning queues
  // NOTHING new — no exposure consequence, no scheduled sweep, no doors, no
  // stages, and above all no calendar ending stacked on top of the terminal.
  // The run is over the moment control returns to the day (loop.ts's terminal
  // contract); the substrate above still runs so the boundary stays uniform.
  if (terminalHolds(g, db)) return;
  // the exposure consequence — at most ONE pending copy (matching the door
  // guard below; N stacked identical discharge scenes was never a design)
  if (g.player.stats.exposure >= exp.threshold && db.events[exp.consequenceEvent] && !g.queue.includes(exp.consequenceEvent)) {
    g.queue.push(exp.consequenceEvent);
  }
  // after the date advances, sweep any timed-event promises now due onto the queue
  if (g.scheduled && g.scheduled.length) {
    for (const s of g.scheduled) if (s.onDay <= g.day) g.queue.push(s.eventId);
    g.scheduled = g.scheduled.filter((s) => s.onDay > g.day);
  }
  // met-doors: beats that fire when the NEW morning's state says so
  for (const door of db.doors ?? []) {
    const ev = db.events[door.eventId];
    if (!ev) continue;
    if (ev.once && g.flags[ev.once]) continue;           // already fired
    if (g.queue.includes(door.eventId)) continue;         // already waiting
    if (evalCondition(door.when, g)) g.queue.push(door.eventId);
  }
  // staged exposure (the pressure gradient): the LOWEST unfired stage whose
  // threshold is met queues — one stage per day boundary at most, so a big
  // exposure jump escalates across consecutive mornings rather than stacking.
  // "Fires once" reads the stage event's `once` flag (the linter warns when
  // a stage event lacks one). The plateau is free: fired stages never refire.
  for (const s of db.tuning?.exposure?.stages ?? []) {
    const ev = db.events[s.eventId];
    if (!ev) continue;
    if (ev.once && g.flags[ev.once]) continue;
    if (g.queue.includes(s.eventId)) continue;
    if (g.player.stats.exposure >= s.at) { g.queue.push(s.eventId); break; }
  }
  // the calendar end + the ending-selector (THE NARROW DOOR — see types.ts):
  // past the last day, the FIRST ending whose condition holds greets the
  // morning as a scene; its exit flag is the terminal. Flags-only in v1.
  const lastDay = db.tuning?.calendar?.lastDay;
  if (lastDay != null && g.day > lastDay) {
    for (const e of db.endings ?? []) {
      const ev = db.events[e.eventId];
      if (!ev) continue;
      if (ev.once && g.flags[ev.once]) continue;
      if (g.queue.includes(e.eventId)) continue;
      if (!e.when || evalCondition(e.when, g)) { g.queue.push(e.eventId); break; }
    }
  }
}

// ---- new game / save / load --------------------------------------------------
export interface NewGameOpts {
  seed: number;
  name: string;
  age: number;
  body: BodyArchetype;
  answers?: number[];      // chosen answer index per questionnaire question (omit if creation is played cards)
  townId: string;
  tier: Tier;
  openingQueue?: string[]; // overrides db.openingQueue for this game (scripted cold-open, in order)
  crossRun?: CrossRunStore; // the persistent second save scope: a new vessel arrives in the world the last one left
}

function seedFactions(db: ContentDB, crossRun?: CrossRunStore): Record<string, Faction> {
  const factions = deepClone(db.factions);
  const scars = crossRun?.factions ?? {};
  for (const id in scars) if (factions[id]) factions[id].rating = scars[id].rating;
  return factions;
}

export function newGame(opts: NewGameOpts, db: ContentDB): GameState {
  // grip starts fully grounded (GRIP_MAX); content/creation lowers it from there.
  const stats: Stats = { money: 0, energy: 0, energyMax: 3, tradecraft: 0, standing: 0, exposure: 0, grip: GRIP_MAX };
  const flags: Record<string, boolean | number | string> = {};
  const coordLog: CoordLogEntry[] = [];
  let archetype = "Player";

  // Cross-run seeds arrive FIRST, so creation state may read (or overwrite) them.
  if (opts.crossRun?.seeds) Object.assign(flags, opts.crossRun.seeds);

  // Cold-start = creation is turn-zero: a questionnaire answer carrying a
  // coordinate/flavor seeds the centroids as index-0 log entries (the opening
  // hooks seed the diamond origin; the creation-lens choice seeds the lens
  // origin). No questionnaire → no entries → neutral origins. Creation played
  // as CARDS seeds the log by the ordinary resolveChoice path instead.
  const seedOrigin = (ans: { diamondCoord?: DiamondCoord; lensFlavor?: string }): void => {
    const entry = coordEntry(0, ans);   // the one entry builder — creation and play can't drift in shape
    if (entry) coordLog.push(entry);
  };

  // Questionnaire is OPTIONAL now (creation can be played cards). Apply it only if present.
  const q = db.questionnaire;
  const answers = opts.answers ?? [];
  if (q && q.questions.length) {
    const a0 = q.questions[0].answers[answers[0] ?? 0];
    if (a0) {
      if (a0.base) Object.assign(stats, a0.base);
      if (a0.archetype) archetype = a0.archetype;
      if (a0.flag) flags[a0.flag] = true;
      seedOrigin(a0);
    }
    for (let i = 1; i < q.questions.length; i++) {
      const ai = q.questions[i].answers[answers[i] ?? 0];
      if (!ai) continue;
      if (ai.patch) for (const k in ai.patch) (stats as any)[k] += (ai.patch as any)[k];
      if (ai.flag) flags[ai.flag] = true;
      seedOrigin(ai);
    }
  }
  stats.energy = stats.energyMax;
  clampStats(stats, exposureTuning(db).max);

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
    npcs: db.npcs ? deepClone(db.npcs) : {}, // spawn authored fixtures
    scheduled: [],
    clocks: {},
    resolveCount: 0,
    coordLog,
    recentDraws: [],   // initialized here AND backfilled in deserialize, so save/load never invents a key mid-run
    // Live copy; power drifts via simulateClash. The world's SHAPE is always
    // content's (db.factions); a handed-in cross-run store contributes only its
    // SCARS — drifted power for factions content still knows. A faction added to
    // content since the store was harvested starts at its authored power; one
    // content dropped does not resurrect from an old store.
    factions: seedFactions(db, opts.crossRun),
    flags,
    queue: [...(opts.openingQueue ?? db.openingQueue ?? [])], // seed the scripted cold-open, in order
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
  g.resolveCount ??= 0; // backfill the coordinate-log fields (WO-1c) so pre-centroid saves keep loading
  g.coordLog ??= [];
  g.recentDraws ??= []; // backfill the anti-repeat memory (WO-2)
  // Backfill the Team → Faction rename (WO-0) so pre-rename saves keep loading.
  const legacy = g as GameState & { teams?: Record<string, Faction> };
  g.factions ??= legacy.teams ?? {};
  delete legacy.teams;
  return g;
}

// ---- the cross-run store (WO-0 scaffold) --------------------------------------
// The persistent second save scope (see types.ts). Kept as its own tiny artifact:
// serialize/deserialize are separate from the per-run save on purpose, so the two
// scopes can never accidentally merge. harvestCrossRun is called when a run ends
// (or at any checkpoint the caller likes): it copies the world-state the vessel
// leaves behind — faction power, nothing else yet. Artifact find/place verbs land
// with WO-5, when a real card asks for them.
export const CROSS_RUN_VERSION = 1;

export function newCrossRunStore(): CrossRunStore {
  return { version: CROSS_RUN_VERSION };
}

export function harvestCrossRun(g: GameState, db: ContentDB, store: CrossRunStore): CrossRunStore {
  store.factions = deepClone(g.factions);
  // Seeds: only the flags CONTENT declared persist (denied_knife, held_truth, …)
  // — copied verbatim if set. Existence, never meaning; the next run's content
  // decides what an old scar colors.
  const harvest = db.tuning?.crossRun?.harvestFlags ?? [];
  if (harvest.length) {
    const seeds: Record<string, boolean | number | string> = { ...(store.seeds ?? {}) };
    for (const f of harvest) if (g.flags[f] !== undefined) seeds[f] = g.flags[f];
    if (Object.keys(seeds).length) store.seeds = seeds;
  }
  return store;
}

export function serializeCrossRun(store: CrossRunStore): string {
  return JSON.stringify(store);
}
export function deserializeCrossRun(s: string): CrossRunStore {
  const store = JSON.parse(s) as CrossRunStore;
  store.version ??= CROSS_RUN_VERSION;
  return store;
}

// ---- procedural generation (Phase 4 preview) ---------------------------------
export function generateName(g: GameState, db: ContentDB): string {
  return pick(g, db.names.first) + " " + pick(g, db.names.last);
}

// Ability scores cluster around the middle with the occasional standout (rough bell shape).
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

// Elo expectation + update, reskinned from the fork's season sim (WO-0, ratified):
// a "clash" is any offscreen contest between factions — turf, funding, attention.
// Run many across a run's days and rises/falls emerge on their own; the drift is
// the cheap living world, and via the cross-run store it is also the meta-story's
// silent seeder (a later vessel arrives in a world an earlier one shaped).
export function expectedScore(rA: number, rB: number): number {
  return 1 / (1 + Math.pow(10, (rB - rA) / 15));
}

export function simulateClash(g: GameState, _db: ContentDB, aId: string, bId: string, k = 4): string {
  const A = g.factions[aId];
  const B = g.factions[bId];
  const eA = expectedScore(A.rating, B.rating);
  const aWins = chance(g, eA);
  A.rating += k * ((aWins ? 1 : 0) - eA);
  B.rating += k * ((aWins ? 0 : 1) - (1 - eA));
  return aWins ? aId : bId;
}
