// ============================================================================
// types.ts — the shared vocabulary of the engine.
// Conditions and effects are DECLARATIVE DATA (not functions), so all content
// is plain data and GameState serializes to JSON with no special handling.
// ============================================================================

export type StatKey = "money" | "energy" | "skill" | "reputation" | "heat";
// Phase additions later: "fame" | "longevity" | "breaks" (legible luck)

export interface Stats {
  money: number;
  energy: number;
  energyMax: number;
  skill: number;       // overarching; sub-skills (shooting/defense/...) added later
  reputation: number;
  heat: number;        // a liability — kept LOW
}

export type Tier = "street" | "highschool" | "juco" | "college" | "semipro" | "pro";
export type Relationship = "ally" | "rival" | "neutral";

// ---- declarative conditions (gate events, choices, actions) ----
export type Condition =
  | { kind: "stat"; stat: StatKey; op: ">=" | "<=" | ">" | "<" | "=="; value: number }
  | { kind: "flag"; flag: string; equals?: boolean | number | string }
  | { kind: "noflag"; flag: string }
  | { kind: "trait"; trait: string }
  | { kind: "tier"; tier: Tier }
  | { kind: "all"; of: Condition[] }
  | { kind: "any"; of: Condition[] }
  | { kind: "not"; of: Condition };

// ---- declarative effects ----
export interface Outcome {
  log?: string;
  tone?: "g" | "b" | "n";
  stats?: Partial<Record<StatKey, number>>;     // DELTAS applied to base stats
  grantTraits?: string[];
  removeTraits?: string[];
  setFlags?: Record<string, boolean | number | string>;
  setRelationship?: { npcId: string; value: Relationship };
  introduceNpc?: string;                        // db.npcs id — you've met this person (into g.npcs)
  addToCircle?: string;                         // npc id — slot them straight into the Circle
  grantItems?: string[];                        // item ids to give the player (gear, a bus card, a car)
  removeItems?: string[];                       // item ids to take away
  scheduleEvent?: { eventId: string; inDays: number };  // promise an event on a FUTURE day, not the next draw
  advanceClock?: { id: string; by: number; label?: string; max?: number; onFull?: string }; // tick a progress clock; created on first touch, queues onFull (an event id) when it fills
  queueEvent?: string;                          // chain: fire this event next
  roll?: RollSpec;
}

export interface RollSpec {
  tag: string;            // names the roll (matches trait/item rollMods; flavor)
  base?: number;          // flat modifier
  statMod?: StatKey;      // adds floor(effectiveStat / 2)
  target: number;         // total >= target succeeds
  win: Outcome;           // win/lose must NOT contain a nested roll
  lose: Outcome;
}

// One modifier object covers traits, items, AND assigned ally roles (Pillar 3).
export interface Modifier {
  id: string;
  source: "trait" | "item" | "ally";
  label: string;
  stats?: Partial<Record<StatKey, number>>;       // persistent additive bonuses
  rollMods?: { tag: string; amount: number }[];   // bonus to rolls; tag "*" = all
  eventTags?: string[];                            // advanced: enable gated events
}
export interface Trait extends Modifier { source: "trait"; }
export interface Item extends Modifier { source: "item"; slot?: string; }

export interface BodyArchetype { height: number; build: number; } // 0..1 scales

export interface Player {
  name: string;
  age: number;                 // 18..40, always an adult
  archetype: string;
  body: BodyArchetype;
  portrait: { face: string; skin: string; hair: string };
  stats: Stats;
  traits: string[];            // trait ids
  items: string[];             // item ids
  circle: string[];            // npc ids assigned to roles (their "brings" -> modifiers)
}

export interface Npc {
  id: string;
  name: string;
  role?: string;
  ability: number;                              // axis 1: own competence
  brings?: Partial<Record<StatKey, number>>;    // axis 2: what they grant YOU
  rollBrings?: { tag: string; amount: number }[];
  traits: string[];
  loyalty: number;
  isFixture: boolean;                           // authored vs procedural
  relationship: Relationship;
}

export interface Team { id: string; name: string; homeTownId: string; tier: Tier; rating: number; }

export interface LocationAction {
  id: string;
  name: string;
  sub: string;
  tiers?: Tier[];        // available in these tiers (omit = all)
  towns?: string[];      // restrict to these towns (omit = all)
  cost: number;          // energy
  requires?: Condition;
  isClear?: boolean;     // resolving this clears the hub / unlocks the next tier
  outcome: Outcome;
}

export interface Arena {
  id: string;
  name: string;
  kind: "main" | "sub";
  tier: Tier;
  clear?: { type: "rep_threshold"; value: number };
}

export interface Town {
  id: string;
  name: string;
  tiersOffered: Tier[];
  amenities: string[];   // a standout amenity can make a lower town enticing
  reachable: boolean;    // false = greyed-out on the map (illusion of scale)
  fixtures: string[];    // authored npc ids
}

export interface GameEvent {
  id: string;
  tier?: Tier | Tier[];  // which deck(s); omit = any tier
  once?: string;         // a flag set when this fires (one-time events)
  condition?: Condition;
  weight?: number;       // relative weight for the random draw (default 1; <1 = rarer)
  title: string;
  body: string;
  choices: Choice[];
}
export interface Choice {
  label: string;
  requires?: Condition;  // disables/hides the choice if false
  outcome: Outcome;
}

export interface Questionnaire {
  questions: {
    q: string;
    answers: {
      label: string;
      archetype?: string;          // first question sets this
      base?: Partial<Stats>;       // first question sets base stats
      patch?: Partial<Stats>;      // later questions tweak
      flag?: string;
    }[];
  }[];
}

export interface ContentDB {
  questionnaire: Questionnaire;
  events: Record<string, GameEvent>;
  actions: LocationAction[];
  towns: Record<string, Town>;
  teams: Record<string, Team>;
  traits: Record<string, Trait>;
  items: Record<string, Item>;
  npcs?: Record<string, Npc>;            // optional authored NPC fixtures — the Circle seed
  names: { first: string[]; last: string[]; teamA: string[]; teamB: string[] };
}

// The entire save file is this object. Content (db) is NOT part of it.
export interface GameState {
  seed: number;        // immutable; for deterministic world-history generation (Phase 4)
  rngState: number;    // live gameplay RNG state (advances; persists across save/load)
  day: number;
  tier: Tier;
  townId: string;
  player: Player;
  npcs: Record<string, Npc>;
  teams: Record<string, Team>;
  flags: Record<string, boolean | number | string>;  // the cross-arc memory store
  queue: string[];     // chained event ids waiting to fire
  scheduled?: ScheduledEvent[];                       // timed-event promises due on a future day (default [])
  clocks?: Record<string, Clock>;                     // progress clocks by id (default {})
  log: { text: string; tone: "g" | "b" | "n" }[];
}

// A progress clock: fills as choices advance it; when value >= max its onFull
// event id is queued and the clock is cleared. A NEW primitive alongside heat
// (heat stays exactly as it is — not refactored into a clock).
export interface Clock { label: string; value: number; max: number; onFull?: string }

// A promise of an event on a future absolute day; endDay sweeps due ones to the queue.
export interface ScheduledEvent { onDay: number; eventId: string }

export interface ResolvedRoll {
  tag: string; die: number; mod: number; total: number; target: number; success: boolean;
  win: Outcome; lose: Outcome;
}
