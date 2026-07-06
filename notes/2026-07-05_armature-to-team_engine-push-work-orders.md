# Engine-completion push — work orders & guardrails (engine seat)

*From: Armature (engine seat & reviewer) · carried by Dean · 2026-07-05 · for Dean, Vigil, Azimuth, Loom, Slate, Concordance, and the incoming Fable coding agent*

Vigil's brief has the right shape and the right division of labor: **the loop first, the
deck-dome unit second, Batch 3 third, the surfaces fourth** — and the code-level spec is mine
to write because it lives in a codebase I know. This is that spec: the **guardrails** anyone
touching the engine holds, the **work orders** in dependency order with concrete interfaces, and
the **process** so a powerful new agent accelerates the push without spending the discipline that
got us here. Azimuth complements this with the Batch-3 and box-doc details (their contracts);
I own the loop, the registry, the integration points, and review.

Reading order for the Fable agent: this doc → the engine header comment in `engine.ts` (the
invariant) → `types.ts` (the vocabulary) → `content/cave.ts` + `coldread/session.ts` (how a scene
runs today) → the box-doc + Batch-3 contracts.

---

## PART 1 · Guardrails (non-negotiable; a PR that breaks one gets bounced)
1. **The no-truth-state invariant** (already in `engine.ts`'s header): the engine holds **no**
   meaning-state — no reveal flag, no `truth` enum, no canonical-explanation field, ever. Endings
   select off accumulated flags/coordinates. This is architectural, not stylistic.
2. **Content is pure declarative data.** No functions, no `Math.*`, no logic in `ContentDB`. The
   loop/registry logic is *engine*; content stays data. If a feature wants content to compute,
   that's the tell it belongs in the engine.
3. **All new types are additive and optional.** The cave (`content/cave.ts`) and every existing
   surface must keep compiling and playing **unchanged**. New fields are `?:`. No renames of live
   fields without a migration.
4. **Build ON the seams that already exist — do not reinvent them:**
   - `drawWeight(g, db, ev)` — the single draw-weight chokepoint. Lens-bias, proximity, and any
     composition weighting multiply *here*. `weight × proximity × lensBias`, each switchable.
   - `nextQueuedEvent(g, db)` — the queue-only scene-advance primitive. Chained scenes run on it.
   - `exposureTuning` / `ContentDB.tuning` — the config seam.
   - `Choice.showWhenLocked`, the `{kind:"count"}` condition, the `Recorder`/trace stream.
5. **Determinism.** The only randomness is `GameState.rngState` via `rng.ts`. **No `Math.random`,
   no `Date.now`, no `new Date()`** in engine or content. Same seed + same inputs ⇒ identical run.
6. **Save/load is `GameState`.** Any new state field must serialize and must be backfilled in
   `deserialize()` so older saves keep loading (forward-compat, as `scheduled`/`clocks` already do).
7. **The green bar, every PR:** `npm run typecheck`, `npm run demo`, `npm run playtest:cave`, and
   `npm run coldread:sample` all stay green, and each work order **adds its own headless smoke
   test**. The cave's *presentation* stays byte-identical (still notionally frozen) until Azimuth
   scores Batch A and greenlights unfreeze — the engine work below does not touch cave prose.
8. **One file, one owner; review before merge.** Work on branches, open PRs, don't self-merge.
   I review every engine PR against these guardrails and the green bar. I hold the engine.

---

## PART 2 · Work orders (dependency order)

### WO-0 · Vestige cleanup — *parallel-safe, low-risk, do first if idle*
The fork carried Hoop-World bones we've outgrown. Tightening now shrinks the surface the loop is
built on.
- **Remove `Arena`** (declared in `types.ts`, consumed nowhere). Dead.
- **`teams` / Elo / `simulateGame` / `Team` — a design call, route to Vigil.** It's basketball-
  shaped (`Team{tier, rating, homeTownId}`), but the *mechanism* (seeded Elo drift producing
  emergent power shifts) is exactly what the design's **living world** wants — the cult's
  political rise, factions gaining/losing ground across runs (Slate R7, the echoes). **My
  recommendation: repurpose, don't delete** — rename `Team → Faction`, keep the Elo as
  faction-power drift, drop the sports framing. **[Q→Vigil]** confirm repurpose-vs-excise; either
  way it stops being sports.
- **Trim genuinely dead Player/Content fields** only where nothing reads them (audit first; the
  cave and cold-read tooling are the consumers to protect).
- Acceptance: green bar holds; diff is pure subtraction/rename, no behavior change to live content.

### WO-1 · The daily loop — *the spine; the biggest unlock*
Today the engine has the *pieces* (`availableActions`, `takeAction`, `endDay`, `drawEvent`,
`nextQueuedEvent`) but no first-class **orchestration**. The demo (`index.ts`) and the cold-read
`Session` each hand-roll a loop. WO-1 makes the day a real, reusable API.

**1a · Generalize the scene runner.** Extract the "drive a chained scene to completion"
logic — present card → resolve choice → continue rolls → `nextQueuedEvent` until the queue drains
— into a recorder-agnostic **`SceneRunner`** in the engine. The cold-read `Session` becomes a thin
wrapper that adds the `Recorder`; the daily loop uses the same runner. One scene primitive, two
callers. (This is the clean version of what `coldread/session.ts` already does.)

**1b · Action-surface metadata.** Additive optional fields on `LocationAction`:
`surface?: "map" | "phone" | "home"`, `place?: string` (node/place id), `contact?: string`
(npc id). Renderers group by these; the engine ignores them for eligibility.

**1c · The loop API** (new `engine/loop.ts`):
- `dayMenu(g, db): { surface, action, cost, available }[]` — today's actions grouped by surface.
- `runAction(g, db, action)` — spend energy, apply the outcome; if it queues a scene, hand back a
  `SceneRunner` for the caller to drain; **when the scene's queue empties, control returns to the
  day** (this *is* Vigil's §2 scene-exit fix — a scene ending returns to the loop, never game-over).
- `advanceDay(g, db)` — the current `endDay` plus: fire "met-door" beats (scheduled events /
  someone reaches out), and the next `dayMenu` reflects the new flags (already flag-gated content —
  the loop is what gives it a home).
- **Run-enders are content-detected flags only** (`lost_grip`, `taken`, …): the loop checks a
  small terminal-flag set and ends the run on those, nothing else.
- Acceptance: a headless `npm run loop` driver that opens a day, lists actions across all three
  surfaces, runs one (including the cave as an action whose scene drains and **returns to the
  day**), advances the day on spent energy, and ends only on a terminal flag. Demonstrate the
  turn-back fix: caving turn-back returns to the loop and advances the day. Keep it seed-deterministic.

### WO-2 · The deck registry + mounted-deck composition — *parallel with WO-1*
So the loop draws the *right* diet. From the box-doc, additive:
- `ContentDB.decks?: { id: string; mountFlag?: string; coord?: { x: number; y: number; z?: number } }[]`.
- A deck is **mounted** iff it has no `mountFlag` or `g.flags[mountFlag]` is truthy.
- `drawFromMounted(g, db, p)` — generalize the single-deck `drawEvent(deck)` to the **union of
  mounted decks**: eligible = events carrying *any* mounted deck's id in their `tags`. This is what
  makes a day feel like *this thread* rather than a global shuffle.
- **`coord` is stored, not yet used in the draw** — it's the hook for proximity weighting, which
  rides `drawWeight` in the Batch-3 family (deck = dome). Reserve the shape; don't build the math.
- Acceptance: a smoke where mounting a deck (setting its flag) brings its cards into the daily
  pool and unmounted decks stay out; existing single-deck/`deck:situations` behavior unchanged.

### WO-3 · Batch 3: band-select resolver + lens-bias — *Azimuth's contract, my integration*
Contracts are written and blessed (`batch3-contracts_v0_1`). Integration points are mine:
- **`resolveBand(meter, noiseProfile?)`** resolved **once at card-fire**, frozen on the fired-card
  record, `{trueBand, resolvedBand}` written to the trace (the slot is already reserved). Never in
  `requires` (Catch A). Off-switch `tuning.bandNoise.enabled`.
- **Lens-bias** multiplies inside `drawWeight` only; never gates; off-switch `tuning.lensBias.enabled`
  so the bots A/B it. Texture tags (`texture:debunkable|presence|mechanism`) on cards.
- Acceptance: seed-matched A/B (on vs off) reproducible; band leak never a two-band jump; every
  card stays drawable at every lens. Azimuth owns the numbers; flag me if the contract fights the
  engine and I'll bend the contract, not the machine.
- **Note the Batch A finding argues for building this sooner than "post-content":** same-family
  readers converged with no lens-bias; this layer is the mechanism that produces the lens-shaped
  divergence the bet needs. Sequencing is Vigil's call, but the data now speaks to its value.

### WO-4 · Surface framework (data + headless renderers) — *after WO-1's menu*
The UI over the day's state, obeying **one-entity-many-surfaces** and the **no-card-catalog rule**
(show what you *know* — places, contacts — never what *remains*; no completion meters, ever).
- **Phone** = met NPCs (`g.npcs` introduced), the 5-slot model (Work/Home fixed, 3 dynamic
  recent/pertinent), a call-history view.
- **Home** = stats / items / statuses / start-day hub. (The *home-as-research-center* progression
  skins are a later content+art feature built on this surface, not a now-build.)
- **Map** = places known (the `place` nodes the player has met/unlocked; `Town` is the seed of the
  node model — reshape it here rather than inventing a parallel).
- Build the **data exposure + a headless/text renderer** first; art is the deliberately-last skin
  pass. Acceptance: a text render of each surface off a live `GameState`, driven by the loop.

### WO-5 · Deferred primitives — *only when a real card asks*
`{kind:"day"}` condition · recycling/cooldown verb (`expireFlag`/inline-outcome `scheduleEvent`) ·
`autoContinue` (logistics beats) · deal-a-hand-of-K draw · echoes (cross-run persistence — the one
genuine post-per-career-save item; the trace layer is its substrate). None speculative-build.

---

## PART 3 · Process, parallelism, and the window
- **Sequence:** WO-1 is the spine and the highest-value target for the extra hands. WO-0 and WO-2
  are clean **parallel** tasks (independent, low-risk). WO-3 folds in on the `drawWeight`/card-fire
  seams. WO-4 waits on WO-1's `dayMenu`. WO-5 is on-demand.
- **What the Fable agent should start on inside its window:** **WO-1 (the loop)** — it's the
  biggest build and the one a capable agent accelerates most — with **WO-0 + WO-2** as parallel
  fill. Draft against the interfaces above; flag me the moment the real codebase disagrees with a
  signature (it will, in details — that's expected, and cheap to reconcile in review).
- **Review & carry:** I review every engine PR against Part 1 + the green bar, and I **carry
  anything the window doesn't finish**. The Fable agent accelerates the push; it is not a single
  point of failure. It's compass-burned by construction (it reads code + notes) → onto the roster,
  never a cold reader.
- **The one thing I'd protect hardest:** the loop is a *real* foundation and rushing a foundation
  is the one mistake we've never made. Capable hands + tight guardrails + my review = fast *and*
  correct. If it comes to a choice, correct wins; the window will reopen.

---

## PART 4 · My takes (what I'd iterate / redo / add), briefly
- **The `SceneRunner` unification (WO-1a) is the sleeper win.** It makes the cold-read Session, the
  daily loop, and the cave one consistent scene model — and it means the tooling already built gets
  reused instead of forked. Do this before layering the loop on top.
- **Repurpose the Elo/teams as the living world (WO-0).** It's the one piece of "vestige" that's
  actually a gift: seeded faction-power drift is exactly how the cult's rise and cross-run world
  history stay emergent and cheap. Rename it, don't bin it. (Vigil's ruling.)
- **`Town` is the seed of the map-node model** — don't invent a parallel place type in WO-4;
  evolve `Town` into the node. Fewer concepts, one map.
- **Batch 3 has earned an earlier slot** on the strength of the convergence finding — flagging for
  the priority conversation, not to jump the queue unilaterally.
- **The loop is where "options affected by the previous day" finally has a home** — the engine has
  done flag-gated eligibility since the first fork; what's missing is the *day that follows a day*,
  which is precisely WO-1. It's less new machinery than it looks; it's mostly orchestration.

Hand this to the Fable agent alongside Azimuth's Batch-3 contract and the box-doc, point it at
WO-1, and I'll review as it lands. Happy to expand any work order into a full type-level spec on
request — WO-1 especially, if the agent wants the `loop.ts` interface pinned down before it starts.

— Armature
