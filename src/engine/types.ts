// ============================================================================
// types.ts — the shared vocabulary of the engine.
// Conditions and effects are DECLARATIVE DATA (not functions), so all content
// is plain data and GameState serializes to JSON with no special handling.
// ============================================================================

export type StatKey = "money" | "energy" | "tradecraft" | "standing" | "exposure" | "grip";

export interface Stats {
  money: number;
  energy: number;
  energyMax: number;
  tradecraft: number;  // physical/craft competence (was skill)
  standing: number;    // social capital (was reputation)
  exposure: number;    // liability meter — sticky; cools + threshold-fires via tuning (was heat)
  grip: number;        // grounding meter, 0..GRIP_MAX; content moves it, no engine auto-logic
}

export type Tier = "outer" | "fringe" | "deep" | "inner" | "core";  // radial depth rings (rim -> center)
export type Relationship = "ally" | "rival" | "neutral";

// The grip bands (Batch-3 Contract 2): one boundary system, matching the
// illegible option's existing grip <= 3 line. Companion-keyed calls read the
// companion's meter with the same bands.
export type GripBand = "grounded" | "worn" | "frayed";   // 7–10 · 4–6 · 0–3

// ---- the coordinate system (WO-1c; ledger §5) ----------------------------------
// The diamond's two EMERGENT axes. The X axis (grounded↔attuned) is deliberately
// NOT here — and it carries TWO quantities, neither of which may ever enter this
// type: grip (worn-down POSITION, a mechanical stat) and `attune` (chosen
// VOLITION, the option-3 ruling — see CoordLogEntry). Cards carry (Y, Z) only,
// so no X quantity can reach the draw's Weight step by type — the grip
// death-spiral cannot be baked at the chokepoint (Azimuth clarification 1; grip
// acts at presentation: bands, gates, dice-tilt).
// Convention: both components run [-1, 1]; content authors the values.
export interface DiamondCoord {
  sanction: number;   // Y — sanctioned (-1) ↔ fringe (+1)
  vertical: number;   // Z — enable/raise up (+1) ↔ contain/put down (-1)
}

// The PHYSICAL map coordinate. A separate type on purpose: map ≠ diamond, two
// independent systems — the centroid and the draw's proximity never read this.
export interface MapPos { x: number; y: number }

// One entry in the thin, append-only resolved-coordinate log: a coordinate and
// an ordinal, nothing else (the rich trace stays in the Session, off the save).
// `index` is the value of the resolution clock (GameState.resolveCount) when
// the card resolved, so recency decays with PLAY distance — neutral cards push
// old coordinates into the past. Untagged fields are simply absent: a card with
// only a lensFlavor appends no diamond component, and vice versa.
export interface CoordLogEntry {
  index: number;
  diamondCoord?: DiamondCoord;
  lensFlavor?: string;   // one tag from the small closed vocabulary (content canon; Concordance + Loom own the list)
  // The X-VOLITION signal (Vigil's option-3 ruling, record-now-read-later):
  // −1 grounded … +1 attuned, authored on introspective leans. RECORDED here,
  // never derived into anything the play loop can see: no posture reader ships
  // until an authored ending knocks. Deliberately a separate scalar — NEVER a
  // component of DiamondCoord, so Weight/proximity/the dice cannot read it by
  // type. ITS ONLY TWO LEGAL READERS (Azimuth's fence, ledger-governed) are
  // telemetry and the narrow-door ending-selector; a third requires a ruling.
  attune?: number;
}

// ---- declarative conditions (gate events, choices, actions) ----
export type Condition =
  | { kind: "stat"; stat: StatKey; op: ">=" | "<=" | ">" | "<" | "=="; value: number }
  | { kind: "flag"; flag: string; equals?: boolean | number | string }
  | { kind: "noflag"; flag: string }
  | { kind: "trait"; trait: string }
  | { kind: "tier"; tier: Tier }
  | { kind: "all"; of: Condition[] }
  | { kind: "any"; of: Condition[] }
  | { kind: "not"; of: Condition }
  | { kind: "count"; of: Condition[]; op: ">=" | "<=" | ">" | "<" | "=="; value: number } // how many of `of` currently hold, compared to value
  | { kind: "counter"; flag: string; op: ">=" | "<=" | ">" | "<" | "=="; value: number }; // numeric flag comparison (unset reads 0) — the theory_* ladders

// ---- declarative effects ----
export interface Outcome {
  log?: string;
  tone?: "g" | "b" | "n";
  stats?: Partial<Record<StatKey, number>>;     // DELTAS applied to base stats
  grantTraits?: string[];
  removeTraits?: string[];
  setFlags?: Record<string, boolean | number | string>;
  addFlags?: Record<string, number>;            // numeric flag INCREMENT (creates at 0; applied after setFlags) — counters for {kind:"counter"} gates
  setRelationship?: { npcId: string; value: Relationship };
  setTier?: Tier;                               // move the player along the tier ladder (promotion — or demotion/getting-busted)
  introduceNpc?: string;                        // db.npcs id — you've met this person (into g.npcs)
  addToCircle?: string;                         // npc id — slot them straight into the Circle
  removeFromCircle?: string;                    // npc id — drop an ally from the Circle (burned informant, contact walks)
  grantItems?: string[];                        // item ids to give the player (gear, a bus card, a car)
  removeItems?: string[];                       // item ids to take away
  scheduleEvent?: { eventId: string; inDays: number };  // promise an event on a FUTURE day, not the next draw
  cancelScheduled?: string;                     // event id — drop a pending scheduled beat ("the meeting falls through")
  advanceClock?: { id: string; by: number; label?: string; max?: number; onFull?: string }; // tick a progress clock; created on first touch, queues onFull (an event id) when it fills
  clearClock?: string;                          // clock id — abandon a clock WITHOUT firing its onFull ("a lead goes cold")
  queueEvent?: string;                          // chain: fire this event next
  queueEvents?: string[];                       // chain SEVERAL, in order (after queueEvent if both). With per-event
                                                // `condition`s and nextQueuedEvent's skip, this is the conditional-insert
                                                // pattern: queue [insert, continuation] and the insert self-selects.
  statsMax?: Partial<Record<StatKey, number>>;  // soft ceilings for THIS outcome's positive deltas: a raise never lifts the
                                                // stat above the named cap (and never lowers one already above it). The
                                                // repeatable-raiser discipline (workout tradecraft, breather grip).
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
  eventTags?: string[];                            // RESERVED (not yet consumed by the engine): the psychic-trait-unlocks-cards mechanic — a trait/item whose tags make certain gated events eligible
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

// A faction: an interest bloc in the living world (was Team, from the fork's
// basketball heritage — the seeded Elo machinery is kept, reskinned as FACTION-
// POWER drift). `rating` is the faction's current power; clashes move it (see
// simulateClash), so influence rises and falls emergently across a run — and,
// via the cross-run store, across vessels: a later run arrives in a world an
// earlier one shaped. That silent seeding is the drift's second job.
export interface Faction { id: string; name: string; homeTownId: string; tier: Tier; rating: number; }

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
  // -- action-surface metadata (WO-1b): where the day menu routes this action.
  // Pure routing hints — the engine never branches on them; surfaces (map /
  // phone / home) group actions by them so no bespoke per-surface system exists.
  surface?: string;      // e.g. "map" | "phone" | "home"; omit = the default surface ("here")
  place?: string;        // town/location id the action belongs to on a map surface
  contact?: string;      // npc id the action belongs to on a phone surface
  // -- coordinates (WO-1c): research actions are ordinary card-resolutions —
  // resolving a coordinated action appends to the same log as a card. No special case.
  diamondCoord?: DiamondCoord;
  lensFlavor?: string;
  attune?: number;       // X-volition, −1…+1 (see CoordLogEntry) — recorded, never read by the draw
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
  tier?: Tier | Tier[];  // DEPTH axis: which ring(s) this is eligible in; omit = any ring
  tags?: string[];       // DECK/SECTOR axis: deck membership; the draw can be SCOPED to a tag (a "deck"). A card may carry several (edge cards)
  once?: string;         // a flag set when this fires (one-time events)
  condition?: Condition;
  weight?: number;       // relative weight for the random draw (default 1; <1 = rarer)
  diamondCoord?: DiamondCoord; // (Y, Z) — where resolving this card pulls the player's derived position. Omit = neutral/ubiquitous.
  lensFlavor?: string;   // the card's dominant interpretive register (tag sparingly — register, not topic)
  attune?: number;       // X-volition, −1…+1 (see CoordLogEntry) — recorded, never read by the draw
  // -- band-select (Batch-3 Contract 2): AUTHORED variants of the body, selected
  // by the resolved grip band at card-fire and frozen on the fired-card record.
  // Selection only — bands never generate text and never gate a choice. A band
  // with no authored variant falls back to `body`. Carrying bandText is how a
  // card opts in; `noiseProfile` overrides the leak probability for this card
  // (e.g. Reese 0.15, environmental 0.25 — proposals, tuned later).
  bandText?: Partial<Record<GripBand, string>>;
  noiseProfile?: number;
  // -- conditional card text, evaluated ONCE at fire and frozen (deterministic;
  // no RNG). bodyVariants: the FIRST matching variant replaces `body` (the
  // charge-gate pattern — took_shard vs not). bodyExtras: EVERY matching extra
  // appends, in authored order (the thread-echo pattern — one ending card that
  // renders this player's run). A card carrying bandText uses that for its base
  // instead of bodyVariants (one base mechanism per card; extras stack on both).
  bodyVariants?: { when: Condition; text: string }[];
  bodyExtras?: { when: Condition; text: string }[];
  title: string;
  body: string;
  choices: Choice[];
}
export interface Choice {
  label: string;
  requires?: Condition;       // gates the choice; false = unavailable (choiceAvailable returns false)
  showWhenLocked?: boolean;   // UI HINT ONLY (engine ignores this): when `requires` fails, render greyed-but-VISIBLE
                              // instead of hidden — the deliberate "seed" case (e.g. the illegible option). Default: hide.
  // -- branch-level coordinates (the content wave's wiring gate): the CHOSEN
  // branch's field feeds the coordinate log, per-field, falling back to the
  // card's (a branch may carry a flavor while inheriting the card's coord).
  // Introspective beats and framed reads live here. `attune` follows the same
  // branch-over-card, per-field rule (the option-3 X-volition scalar).
  diamondCoord?: DiamondCoord;
  lensFlavor?: string;
  attune?: number;
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
      // Cold-start seeding (WO-1c): creation is turn-zero. An answer carrying a
      // coordinate/flavor writes an index-0 log entry, so the opening hooks seed
      // the diamond origin and the creation-lens choice seeds the lens origin.
      // (Creation played as CARDS needs none of this — coordinated cards resolved
      // through the SceneRunner seed the log by the ordinary path.)
      diamondCoord?: DiamondCoord;
      lensFlavor?: string;
      attune?: number;             // X-volition seed, same index-0 path as the other two fields
    }[];
  }[];
}

// ---- engine tuning (optional; the engine falls back to these exact defaults) ----
// A SEAM, not a retune: numbers the engine used to hardcode, lifted into content
// so a reskin can drop in new values, a new liability-meter feel, and a new
// consequence-event id WITHOUT editing engine code. Omit any field to keep the
// engine's current default; omit the whole block for behavior identical to before.
export interface EngineTuning {
  exposure?: {
    max?: number;              // clamp ceiling for the exposure meter (default 12)
    coolPerDay?: number;       // amount exposure drops each endDay (default 1; set 0 for a STICKY meter)
    threshold?: number;        // at/above this, the consequence event is queued (default 6)
    consequenceEvent?: string; // event id queued when threshold is met (default "ev_exposure_discharge")
    stages?: { at: number; eventId: string }[]; // STAGED escalation (the pressure beat): each fires once, in
                               // authored order, one per day boundary at most. Give stage events a `once`
                               // flag — that is what "fires once" reads (the linter warns otherwise).
                               // Stage 3's plateau is free: a fired stage never refires.
  };
  disposition?: {
    window?: number;           // recency window for both centroids, in CARD-RESOLUTIONS, not days
                               // (RNG-independent; default in engine/centroid.ts; the fate-dial rides this later)
  };
  terminal?: {
    onGripZero?: boolean;      // grip 0 ends the run ("lost grip"; default true). Content keeps it RECOVERABLE
                               // before that line: grip-raising outcomes and rest beats are content's discipline.
    flags?: string[];          // designed terminal flags ("taken", ...); TRUTHY ends the run (default []).
                               // Same semantics as {kind:"flag"} without `equals` — keep terminal flags boolean.
  };
  // -- the Weight step's switchable factors (WO-2). EVERY factor ships OFF, so
  // seed-matched bot A/Bs can isolate each one's drift before anything ships on
  // (ratified guardrail). All numbers are tuning PLACEHOLDERS until measured.
  diamondProximity?: {
    enabled?: boolean;         // default false — off means drawWeight is exactly ev.weight
    strength?: number;         // multiplier at zero distance is (1 + strength); default 0.5
    range?: number;            // distance at which the boost fades to nothing; default 1.5
  };
  antiRepeat?: {
    enabled?: boolean;         // default false
    factor?: number;           // weight multiplier for recently-drawn cards; default 0.5. Factor 0 with
                               // memory >= pool size makes an exhausted deck draw NOTHING until the
                               // memory rotates — honest silence, never a forced repeat.
    memory?: number;           // how many recent random draws count as "recent"; default 5
  };
  lensBias?: {
    enabled?: boolean;         // Contract 1's switch — independent of diamondProximity, ships OFF;
                               // tuned against research content as it lands
    strength?: number;         // boost at full affinity: multiplier = 1 + strength × mass; default 0.3 ⇒ [1.0, 1.3]
  };
  bandNoise?: {
    enabled?: boolean;         // Contract 2's NOISE switch, ships OFF. Off ⇒ resolvedBand === trueBand:
                               // banded cards still select their authored variant deterministically;
                               // the switch controls the unfalsifiable leak, so bot A/Bs isolate its drift.
    p?: number;                // adjacent-leak probability; default 0.2; per-card noiseProfile overrides
  };
  lens?: {
    vocabulary?: string[];     // the closed lensFlavor list, DECLARED by content (the engine stays agnostic;
                               // the linter enforces membership). The pack's lock: spiritual·physics·institutional·skeptic.
    nullFlavor?: string;       // the NULL POLE (Batch-3 v0.2.1): a resolution carrying this flavor appends the
                               // ZERO vector — the lens centroid decays toward origin under null-leaning play,
                               // multipliers settle to ~1.0, and null-flavored cards can never bubble-boost.
  };
  calendar?: {
    lastDay?: number;          // the run's calendar end: past this day, the ending-selector fires (db.endings)
    deferForScheduled?: string[];       // DEFER-TERMINAL (unanimous round ruling: no authored thread-climax dies to
                               // the calendar guillotine): while any listed event id is still PENDING (in
                               // g.scheduled or g.queue), the ending-selector holds; it fires the first
                               // morning none is in flight. Content declares its climaxes (the Doug break,
                               // later pursuit beats) — a deliberately narrow list, so an ordinary nudge
                               // can never stall the run's end.
  };
  crossRun?: {
    harvestFlags?: string[];   // run flags harvestCrossRun copies into the store's seeds — CONTENT declares what
                               // persists across vessels (denied_knife, held_truth, ...); the engine never decides.
  };
}

// ---- the deck registry (WO-2) --------------------------------------------------
// A deck is a named pool of cards. Membership stays where it always was — an
// event CARRIES the deck's id in its tags (a card in several decks is an edge
// card) — so the registry adds mounting rules and deck-level coordinates
// without moving a single card. The two coordinate fields are deliberately
// distinct systems: diamondCoord feeds proximity/centroids; mapPos is physical
// and is NEVER read by either (map ≠ diamond).
export interface DeckDef {
  id: string;                   // the tag events carry (e.g. "deck:situations") — the id IS the tag
  mountFlag?: string;           // mounted while this flag is TRUTHY — same semantics as {kind:"flag"}
                                // without `equals`. Use boolean thread flags; a 0/"" value reads unmounted.
  towns?: string[];             // mounted only in these towns (physical location); omit = anywhere
  diamondCoord?: DiamondCoord;  // deck-level (Y, Z) — authored, or Slate's rollup (deckCentroid over members)
  lensFlavor?: string;          // deck-level interpretive register
  mapPos?: MapPos;              // physical position for map surfaces — never enters draw math
}

// A met-door (WO-1d): a beat that fires when the world-state says so, checked
// once per day advance. If the condition holds (and the event's once-flag
// hasn't fired), the event is queued and greets the player next morning as a
// scene. Give door events a `once` unless re-firing every qualifying morning
// is the intent.
// `afterDays` (Phase 2.3, Loom's Nora-timing call): a door that PROMISES
// instead of greeting — the first qualifying morning schedules the event
// `afterDays` days out rather than queueing it, so a beat can breathe (the
// call that comes two days after the cave, not the morning after). A pending
// promise suppresses re-scheduling on later mornings.
export interface Door { eventId: string; when: Condition; afterDays?: number }

export interface ContentDB {
  questionnaire?: Questionnaire;         // OPTIONAL — creation can be played cards instead; newGame must not require it
  events: Record<string, GameEvent>;
  actions: LocationAction[];
  towns: Record<string, Town>;
  factions: Record<string, Faction>;     // the living world's interest blocs (was `teams`)
  traits: Record<string, Trait>;
  items: Record<string, Item>;
  npcs?: Record<string, Npc>;            // optional authored NPC fixtures — the Circle seed
  decks?: DeckDef[];                     // the deck registry (WO-2); the daily draw composes from mounted decks
  doors?: Door[];                        // met-doors, checked on every day advance (WO-1d)
  // The ending-selector — THE NARROW DOOR: the one place that may ever read the
  // player's derived position, at the moment the run is already over. v1 is
  // flags-only (this pack's endings need no position read); the position-reading
  // extension lands only when an authored ending asks. Ordinary gates NEVER
  // read position — that ruling holds everywhere else in the engine.
  // Past tuning.calendar.lastDay, the FIRST ending whose `when` holds is queued
  // as the morning's scene; its exit flag is the terminal. Give ending events a
  // `once` flag.
  endings?: { eventId: string; when?: Condition }[];
  openingLog?: string;                   // first line in the new-game log; engine falls back if absent
  openingQueue?: string[];               // event ids seeded into g.queue at new-game (scripted cold-open, in order)
  // The JOURNAL mapping (the Run-Read prerequisite, shape blessed by Loom):
  // an ordered, content-authored list of flag-gated lines — WHAT THE PLAYER
  // KNOWS, percepts only, never a line for what they concluded. The surface is
  // DERIVED ON READ (engine/journal.ts) and stored nowhere; renderers receive
  // lines only. The no-catalog wall, enforced by shape: no counts, no
  // completion, no "there's more" — a line either renders or does not exist.
  journal?: { when: Condition; line: string }[];
  tuning?: EngineTuning;                 // optional engine-tuning seam; defaults reproduce current behavior
  names: { first: string[]; last: string[] };  // NPC name pools (teamA/teamB trimmed with the basketball vestiges — nothing consumed them)
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
  factions: Record<string, Faction>;   // live copy; power drifts via simulateClash (loads legacy `teams` saves)
  flags: Record<string, boolean | number | string>;  // the cross-arc memory store
  queue: string[];     // chained event ids waiting to fire
  scheduled?: ScheduledEvent[];                       // timed-event promises due on a future day (default [])
  clocks?: Record<string, Clock>;                     // progress clocks by id (default {})
  // The events, never the position (invariant #3): a resolution clock and the
  // thin coordinate log it stamps. dispositionCentroid/lensCentroid DERIVE the
  // player's place from these on demand; no disposition is ever written back.
  resolveCount?: number;                              // total card/action resolutions this run (default 0)
  coordLog?: CoordLogEntry[];                         // append-only; only coordinated resolutions append (default [])
  recentDraws?: string[];                             // last few RANDOM-draw winners (anti-repeat memory; default [])
  log: { text: string; tone: "g" | "b" | "n" }[];
}

// A progress clock: fills as choices advance it; when value >= max its onFull
// event id is queued and the clock is cleared. A primitive alongside exposure
// (the exposure meter is not refactored into a clock).
export interface Clock { label: string; value: number; max: number; onFull?: string }

// A promise of an event on a future absolute day; endDay sweeps due ones to the queue.
export interface ScheduledEvent { onDay: number; eventId: string }

export interface ResolvedRoll {
  tag: string; die: number; mod: number; total: number; target: number; success: boolean;
  win: Outcome; lose: Outcome;
}

// ---- the cross-run store (WO-0 scaffold) --------------------------------------
// The SECOND save scope. The per-run save (GameState) resets with each new vessel;
// this store persists across vessels and is deliberately TINY — it is the
// meta-story's only mechanical carrier, and it stays a SEPARATE artifact:
// GameState never embeds it, and it never embeds a GameState.
// It records what EXISTS and WHERE — never what anything means. No-truth-state
// and no-meta-reveal apply at the meta level too: a later vessel arrives in a
// world an earlier one shaped, and the machine never says so.
export interface ArtifactRecord {
  itemId: string;   // which object an earlier run left behind
  townId: string;   // where it waits. Existence + place — deliberately NO meaning/description field.
}
export interface CrossRunStore {
  version: number;                      // store schema version (for forward migration)
  factions?: Record<string, Faction>;   // faction power as the last vessel left it (the world's scars)
  artifacts?: ArtifactRecord[];         // stub — the find/place verbs land with WO-5, when a real card asks
  seeds?: Record<string, boolean | number | string>; // exit flags content declared (tuning.crossRun.harvestFlags),
                                        // injected verbatim into the next run's flags — existence, never meaning
}
