# Task 1 report — the faithful fork is landed and green

*From: Armature (systems/engine seat) · carried by Dean · 2026-06-23*

Hello Vigil. Callsign **Armature** for now (Plumb was taken). Engine seat
reporting. The fork is done, verified, and parked as a **draft PR for your
review** — I did not merge my own work.

---

## 1. Confirmation: it's green

- **Repo:** `wrightdeany32/Scythians-Games-II`, branch
  `claude/review-game-engine-repo-a7x38n`, **draft PR #2**.
- `npm run typecheck` (`tsc --noEmit`) — **clean.**
- `npm run demo` — **runs end-to-end** against the neutral smoke content:
  questionnaire → actions → a gated d20 hub-clear → a progress clock filling and
  queuing its payoff → unified trait/item/ally modifiers → procedural NPCs →
  Elo season sim → save/load roundtrip.
- **No engine logic touched, nothing reskinned.** Faithful copy only, as briefed.

The prep was clean: the engine is verbatim, the package is renamed
`scythians-games-ii`, and the placeholder content is quarantined in a clearly
labeled, disposable `src/smoke/content.ts` (generic "Region One" / "Task A" —
no Hoop World theme leaked through). One new-since-your-old-scaffold file:
`src/engine/calendar.ts`, deriving week/weekday from `g.day`.

---

## 2. The live `types.ts` surface (what you asked to see)

This is the **real current** shape, which is ahead of the older scaffold you
read. The full file is in the PR; here's the part you flagged.

### `StatKey`
```
"money" | "energy" | "skill" | "reputation" | "heat"
```
Comment in-file notes future phase additions: `"fame" | "longevity" | "breaks"`
("legible luck"). `Stats` also carries `energyMax` (separate from the `energy`
StatKey resource).

### `Tier`
```
"street" | "highschool" | "juco" | "college" | "semipro" | "pro"
```
> ⚠️ This enum is still **basketball-career-shaped**. It's a content/reskin
> concern for your spec, not something I'd touch in Task 1. See §5.

### `Outcome` verbs (all optional; declarative data, no functions/Math)
| verb | effect |
|---|---|
| `log`, `tone` | narrative line + `"g"`/`"b"`/`"n"` color |
| `stats` | **deltas** applied to base stats |
| `grantTraits` / `removeTraits` | trait ids on the player |
| `setFlags` | the cross-arc memory store (`bool`/`number`/`string`) |
| `setRelationship` | set an npc's `ally`/`rival`/`neutral` |
| `introduceNpc` | drop a `db.npcs` fixture into the world (you've "met" them) |
| `addToCircle` | introduce (if needed) + slot straight into the Circle |
| `grantItems` / `removeItems` | item ids |
| `scheduleEvent` | promise an event on a **future absolute day** (`inDays`) |
| `advanceClock` | tick a progress clock; auto-created on first touch; queues `onFull` when it fills |
| `queueEvent` | chain — fire this event next |
| `roll` | a `RollSpec` (see below) |

### `RollSpec`
```
tag (names the roll; matches trait/item rollMods)
base?      flat modifier
statMod?   adds floor(effectiveStat / 2)
target     total >= target succeeds
win / lose Outcomes (these must NOT contain a nested roll)
```
Roll math: `d20 + base + floor(effectiveStat(statMod)/2) + rollModFor(tag)`.

### The unified `Modifier` (Pillar 3 — traits = items = allies)
One object shape covers all three sources (`"trait" | "item" | "ally"`):
persistent `stats` bonuses + `rollMods` (`tag: "*"` = all rolls) + optional
`eventTags`. Allies flow through the *same* path via `npc.brings` /
`npc.rollBrings`. There is no separate ally code path.

---

## 3. New primitives since your old scaffold (worth knowing before you spec)

- **Progress clocks** — `Clock { label, value, max, onFull }`, stored in
  `GameState.clocks`. Driven entirely by the `advanceClock` outcome verb. Fills →
  queues `onFull` → clears itself. Heat was deliberately **not** refactored into
  a clock (it stays its own thing).
- **Scheduled events** — `ScheduledEvent { onDay, eventId }` in
  `GameState.scheduled`; `endDay()` sweeps due ones onto the queue.
- **Weighted event draws** — `GameEvent.weight` (default 1; `<1` = rarer), so big
  story cards can be made rarer than ambient texture.
- **Calendar** — `dateOf(day)` → `{ week, weekday, label }`, single source of
  truth off `g.day`.
- **Save migration** — `deserialize()` backfills `scheduled`/`clocks`, so
  pre-clock saves still load. Worth knowing the engine already does forward-compat.

---

## 4. The one thing I checked so you don't have to (NOT a bug)

The demo's Elo line can read `ratings now 70 / 55` after a **19–1** season, which
looks like ratings aren't drifting. I verified — it's correct: raw values were
`70.25 / 54.75`, and `toFixed(0)` rounds them. Alpha is a heavy favorite
(expected score 0.909), so each win adds only ~+0.36 while the one upset loss
subtracts ~−3.6, nearly cancelling. A 20–0 run drifts the full `74 / 51`. The
Elo (divisor 15, k=4) works as designed. No engine wish here.

---

## 5. Engine wishes / observations (flagged, NOT built — your call for the spec)

These are the only things I'd put in front of you before you write the reskin.
None block anything; all are "decide in the spec, then I implement."

1. **A theme-flavored string is baked into the engine.** `newGame()` seeds the
   opening log with the literal `"A new start on the block."` (engine.ts). That's
   a small basketball-flavor leak in supposedly theme-agnostic plumbing. Wish:
   make the opening log a content/`ContentDB` field (or pass it into
   `NewGameOpts`) so the engine ships zero flavor.

2. **`heat` mechanics are hardcoded in the engine, not content-configurable.**
   `clampStats` caps heat at **12**; `endDay()` cools it by **1/day** and, at
   threshold **>= 6**, queues the literal event id **`"ev_heat"`**. If the new
   game keeps a "liability meter" but renames it or wants different
   tuning/thresholds, those magic numbers and that hardcoded event id live in
   engine code. Wish: lift the cap / cool-rate / threshold / consequence-event-id
   into config (a small `ContentDB.tuning` block, say). Until then, the reskin
   must keep an event literally named `ev_heat` alive.

3. **`Tier` is basketball-career-shaped** (`highschool | juco | college |
   semipro | pro`). For the investigator/anomaly-division game this is the most
   obvious reskin surface — presumably a rank/clearance ladder. It's a plain
   union type, so it's a clean additive edit, but I want your spec to name the
   tiers rather than me guessing.

4. **Minor, no action needed:** `CIRCLE_MAX = 3` and the `energyMax` default of
   `3` are constants. Fine as-is; noting them so they're not a surprise when you
   tune pacing.

---

## 6. What I'd like back from you (to write Task 2 against)

1. **The tier ladder** for the new theme — the renamed `Tier` members, in order.
2. **The stat vocabulary** — keep `money/energy/skill/reputation/heat` as-is and
   reskin only their *labels*, or actually re-cut the `StatKey` union? (And is
   `heat` staying as the liability meter under a new name?)
3. **The "verbs" you expect content to need.** If the spec wants the engine to do
   anything the current `Outcome` set can't express — say so and I'll flag it as
   an engine-growth item rather than smuggling logic into content.
4. Your ruling on wishes **#1 and #2** above — happy to do those as tiny,
   additive, engine-clean changes whenever you greenlight, but not before.

Reskin spec whenever you're ready. The machine's in its new home and warm.

— Armature
