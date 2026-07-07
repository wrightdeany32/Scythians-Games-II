# Finalized engine work-order pack — v1 (the Fable-agent build spec)

*From: Armature (engine seat & reviewer) · carried by Dean · 2026-07-06 · for Dean, Azimuth, Vigil, Slate, Loom, Concordance, and the incoming (compass-burned) Fable agent*

**What this is.** The single, consolidated engine spec the Fable agent starts from — it folds my four
prior notes (the 07-05 work orders, the centroid synthesis, the coordinate-system note, the round-close
refinements) into one document with every ratified 07-06 ruling baked in (X=grip, no-meta-reveal, the
two-space lens model, the draw-pipeline contract, Azimuth's Batch-3 v0.2, Slate's dice refinement, the
five save/scope refinements, and — this revision — Azimuth's two handoff-sign-off clarifications:
`proximity_diamond` over (Y,Z) only, and the lens-centroid as an affinity distribution over one-hot vectors).
Where this and an earlier note of mine differ, **this holds.** It's
team-facing/roster (the Fable agent is compass-burned by construction); the sealed cosmology stays in
Concordance's ledger §2 — this doc references it, never restates it.

Reading order for the agent: **Part 1 (walls) → Part 2 (coordinates) → Part 3 (centroid) → Part 4
(pipeline) → Part 5 (work orders) → Part 6 (how to work).**

---

## Part 1 — The walls (hard; iterate freely inside them, never through them)

**The four invariants** (all live in the engine header; a hand reaching to add any of these hits a wall):
1. **No-truth-state** — no stored *meaning*. Endings select off flags + coordinates, never a stored explanation. No `truth` enum, no endings codex.
2. **No-catalog** — no shown *structure*. Surfaces show what you know, never what remains: no deck names, no completion meters, no unlock toasts. The map shows places you know of, never content availability.
3. **No-stored-disposition** — no stored *position*. Store the *events* (resolved-card coordinates); *derive* the player's place in the diamond. Grip and tier are the only mechanical coordinates, and they are legitimate stats — not a `player.disposition` field.
4. **No-meta-reveal** — no confirmed *meta*. The meta-story is all seed, no payoff card, ever (Concordance §2.5/§2.1). No card confirms the player is the entity.

**The engineering walls:**
- **Determinism** — no `Math.random`, no `Date.now`/`new Date()` anywhere in engine or content. Same seed → identical run. *Prove it:* ship a seed-replay assertion.
- **Content-is-data** — Conditions/Outcomes stay declarative. No functions, no `Math`, no dates in content.
- **Additive, optional, backfill-safe types** — every new state field is optional with a defined default so old saves load. New coordinate fields are additive.
- **Zero runtime deps** (dev deps are fine; `@types/node` already added).
- **Build on the seams** (Part 4) rather than around them.
- **Green bar before merge; Armature reviews engine PRs; the agent does not self-merge.**

## Part 2 — The coordinate system (what the axes are)

**The diamond** (Concordance geometry doc + ledger §5):

| Axis | Meaning | Engine status |
|---|---|---|
| **X — grounded ↔ attuned** | trust the mundane ↔ sense the uncanny | **grip** (mechanical stat 0–10; `GRIP_MAX`) |
| **Y — sanctioned ↔ fringe** | institutional/recognized ↔ deniable/hidden | **emergent coordinate** |
| **Z — enable ↔ contain** | raise up/assist (top) ↔ suppress/antagonize (bottom) | **emergent coordinate** |
| **charge — benevolent ↔ malignant** | *how* you go about your Z-move | **authored** into branches; **not stored** |
| **radius — outer→core** | depth toward the roots | **tier** (mechanical stat) |

**The lens space** — *which interpretive tradition* you read through (a second, **orthogonal** space,
Dean's ruling): the working vocabulary is *paranormal · religious · cryptobiological ·
institutional-skeptical · mechanism* (a small, closed, extensible list; **Concordance + Loom own it**).
*Do not collapse grip's "grounded↔attuned" with the lens's "institutional-skeptical" — grip is whether
you sense the uncanny; lens is how you explain it.*

**The card / deck schema** (all additive/optional; an uncoordinated card is neutral/ubiquitous):
- Card carries **`diamondCoord: {sanction, vertical}`** (Y, Z) + **`lensFlavor`** (one tag) + **`tier`**.
- **Location** cards/decks additionally carry **`mapPos`** — the *physical* coordinate, in a **separate
  field** from `diamondCoord` (**map ≠ diamond — two independent systems**; the centroid never reads
  `mapPos`).
- A **deck** carries the **centroid of its cards' `diamondCoord`s** (and its own `lensFlavor`/`mapPos`),
  per Slate's recursive rollup: cards ∈ fixture-decks ∈ sector-clusters ∈ volume, one centroid rule at
  every level.
- **charge** is not a field — it's authored into which outcome/branch fires.
- **Do NOT** add a "six-atom" type enum (person/place/thing/idea/event/action). That's a *content*
  ontology; keep it as tags/convention. The engine stays agnostic — a card is a card, a deck is a deck.

**Two save scopes** (sharp because vessels = different characters):
- **Per-run save** (resets each new vessel): the resolved-coordinate log, grip, tier, flags, exposure,
  queue, resources.
- **Cross-run store** (persists across vessels; tiny by construction): **faction drift** (WO-0) and the
  optional **artifact ledger** (an earlier run leaves an object a later run can find — stores existence
  + place, never meaning). These are the meta-story's only mechanical carriers; keep them a *separate
  store* from the per-run save.

## Part 3 — The emergent-position keystone (Slate §1, my spec)

**The rule, stated so it can't be misbuilt either way:** store the **events**, derive the **position**.

- **Per-run save holds a thin, append-only coordinate log:** `{diamondCoord, lensFlavor, index}` per
  resolved card. Not the rich trace (that stays in `Session`, off the save, as built in Batch 2) — a
  coordinate and an ordinal.
- **Derived on demand** (pure, deterministic, O(resolved-cards), trivial; the log is per-run/bounded, so
  no growth concern and no memoization needed):
  - `dispositionCentroid(g)` = recency-weighted mean of the log's `diamondCoord`s → **(Y, Z) only.** X is
    grip, and **grip never enters the draw-Weight step** — it acts only at presentation (band-select, gates,
    the post-loop dice-tilt). This is what makes *don't-bake-the-spiral* **mechanical**, not merely
    disciplinary (Azimuth clarification 1): the grip death-spiral cannot be baked at the chokepoint because
    grip cannot reach it.
  - `lensCentroid(g)` = the recency-weighted **affinity distribution** over the closed lens vocabulary — each
    resolved card with a `lensFlavor` appends a **one-hot vector** to the log (untagged resolutions append no
    lens entry), and the centroid is the recency-weighted average of those vectors (Azimuth clarification 2 —
    tags don't average; one-hot vectors do).
- **Recency kernel + window** = `tuning.disposition.window` (in cards, not days — RNG-independent). One
  knob; **Loom's fate-dial** (window lengthens with depth: shallow=free-will, deep=fated) is a *post-tune*
  refinement, not a first build.
- **Cold-start = creation is turn-zero.** The questionnaire/creation flow is just the first scene through
  the SceneRunner; its resolved cards write the index-0 log entries (opening hooks seed the **diamond**
  origin, the creation-lens choice seeds the **lens** origin). No creation → neutral origins. No bespoke
  character-creator subsystem.

**Grip is triple-loaded** (X coordinate + spendable resource + later a dice-tilt), so the runaway to guard
is a **grip death-spiral**. Two disciplines:
- **Keep it recoverable** — grip-raising Outcome verbs and the loop's rest beats must exist; a player can
  always climb back out.
- **Don't bake the spiral** — the draw-bias stays purely **positional** (proximity); whether an attuned
  card *costs* grip is **per-card authoring**, never an engine auto-coupling. The spiral is a tunable
  content dynamic, not a hard-coded slide.

**The double-coupling budget** — once the dice-incline (WO-4/§ below) lands, the **diamond** centroid drives
both draw-weight *and* check-difficulty. Those two magnitudes are **budgeted together, post-loop, against
measured draw-momentum** — never tuned in isolation. **The dice-incline keys to the diamond centroid ONLY,
never lens** (Slate) — which keeps the runaway one-dimensional. `proximity_lens` sits outside the budget by
construction (orthogonal space).

## Part 4 — The draw-pipeline contract (Slate §6 + Azimuth Batch-3 v0.2)

The one resolution order; both Batch-3 contracts live at their named step and nowhere else:

```
Mount   decks — by physical location, active threads, calendar/schedule
Filter  eligible cards — tier ∧ tags ∧ requires ∧ date
Weight  weight × proximity_diamond × proximity_lens × recency/anti-repeat   # proximity_diamond over (Y,Z) ONLY — grip/X never enters Weight
Draw    seed-deterministic from the weighted pool | nextQueuedEvent for a chained scene
Resolve-noise-once  band-select at fire, FROZEN on the fired-card record, {trueBand,resolvedBand}→trace
Apply + record  outcome to state, everything to the trace
```

- **Contract 1 — lens-bias = `proximity_lens`** (at Weight): the lens-centroid's **affinity mass on the
  candidate card's `lensFlavor`**, mapped **linearly** into **[1.0, 1.3]** (no affinity → 1.0, full affinity →
  1.3); cards with no `lensFlavor` take **1.0 flat**, **no down-weighting**. Continuous, **never a categorical
  match** — a binary "1.3 if it matches the top affinity" would be jumpy and visible within a day and break the
  tuning target (Azimuth clarification 2). Research actions are
  ordinary card-resolutions carrying `lensFlavor` — no special case. **Never a gate** (floor 1.0, multiplies
  after eligibility). **Deck-scoped random draws only** — never queue/openingQueue/`requires`. Off-switch
  **`tuning.lensBias.enabled`**, independent of the diamond-proximity switch. Tuning target: a coherently
  digging player sees ~10–20% more of their register across a run; statistically invisible within a day.
  Ships **off**; tuned against research content.
- **Contract 2 — band-select** (at Resolve-noise-once): `resolveBand(meter, noiseProfile?) → band`, grip-banded
  **grounded 7–10 / worn 4–6 / frayed 0–3** (one boundary system with the `grip ≤ 3` illegible option); true
  band leaks to an **adjacent** band at **0.2** (never a two-band jump); selects among **authored variants
  only**, never generates, never gates a choice. `{trueBand, resolvedBand}` → the reserved trace slot.
  Off-switch **`tuning.bandNoise.enabled`**. Per-call `noiseProfile` (proposed: Reese 0.15, environmental 0.25).
- **Every weighting factor independently switchable** (`proximity_diamond`, `proximity_lens`, recency) so
  seed-matched bot A/Bs isolate each factor's drift before anything ships on.

*Azimuth's standing offer holds: if a contract fights the engine at wiring time, flag it and Azimuth bends the
contract, not the machine. Numbers are proposals; the guardrails aren't.*

## Part 5 — The work orders

**WO-0 · Vestige cleanup + the living world.** Delete `Arena` (dead). **Rename `Team → Faction`; keep the
seeded Elo drift as faction-power drift** (ratified) — the cheap emergent living world *and* the meta-story's
silent seeder (a later vessel arrives in a world an earlier one shaped). Stand up the **cross-run store** scaffold
here (faction state; artifact-ledger stub). Audit-then-trim only genuinely dead basketball fields.

**WO-1 · The daily loop + SceneRunner + the centroid.**
- **1a — Extract a recorder-agnostic `SceneRunner`** from the cold-read `Session`: one scene model that the
  cold-read harness, the daily loop, the cave, *and* creation (turn-zero) all sit on. The sleeper win — one code
  path, telemetry free everywhere.
- **1b — Action-surface metadata** on location actions (`surface?`, `place?`, `contact?`) so the day menu can
  route actions to map/phone/home without a bespoke system.
- **1c — The centroid** (Part 3): the coordinate log in the per-run save, `dispositionCentroid`/`lensCentroid`,
  the recency window.
- **1d — `engine/loop.ts`:** `dayMenu` / `runAction` / `advanceDay`. **A scene ending returns to the day and
  advances it — never game-over;** the only run-enders are the designed terminal flags (lost grip, taken).
  Scheduled beats and met-doors fire on advance; the next day's menu reflects what happened (flag-gated content).
  Acceptance: `npm run loop` plays day→scene→day with the day advancing and terminal states ending the run.

**WO-2 · Deck registry + the pipeline.** `ContentDB.decks: [{id, mountFlag?, diamondCoord?, lensFlavor?, mapPos?}]`;
the daily draw composes from the **union of mounted decks** (`drawFromMounted`). Implement the Part 4 pipeline as
the one resolution order. Two coordinate fields kept distinct (`diamondCoord` vs `mapPos`). Coord stored, used by
proximity.

**WO-3 · Lens-bias hook + band-select (elevated — after the loop).** Build Contracts 1 & 2 (Part 4) at
`drawWeight` and the card-fire path, off by default, tuned against research content as it lands. The lens hook is
the **frame-divergence engine** (Azimuth: divergence lives at the frame layer = the lens space), and it earns three
jobs — produce divergence, drive research, and steer coverage reads (a presence-lensed read to reach the untested
`took_shard` branch).

**WO-4 · Surface framework (map / phone / home).** Headless renderers over the day's state, obeying
one-entity-many-surfaces and **no-catalog** (show what you *know* — places, met contacts, qualitative statuses —
never what remains, never a meter). Town as the first map node. The **dice-incline** (difficulty scales with depth
and diamond-distance; grip tilts checks — small, subtle, felt-never-shown, diamond-centroid only) is a *post-loop
refinement* here, budgeted per Part 3. Home-as-research-center is the first feature built on the home surface, post-loop.

**WO-5 · Deferred primitives, as content demands them** — the recycling/cooldown verb, `{kind:"day"}` condition,
`autoContinue` seam, deal-a-hand-of-K draw, echoes, the cross-run **artifact** find/place verbs. None speculative;
each lands when a real card asks.

## Part 6 — How the Fable agent works (walls, seams, green bar, latitude)

- **Walls:** Part 1, entire. Non-negotiable.
- **Seams to build on** (refactor if you find better, but preserve the contract): `drawWeight`,
  `nextQueuedEvent`/the queue, the **centroid primitive** (one function, reused over diamond and lens spaces and the
  nested deck tree), the deck registry, the draw pipeline, `exposureTuning`, `showWhenLocked`, `{kind:"count"}`, the
  Recorder.
- **Green bar (the judge — you can test, so drive it):** `tsc --noEmit` clean; cave playtest + demo + cold-read
  sample green; the seed-replay determinism assertion holds; and for anything new (the loop, the centroid), a small
  harness that **exercises it end-to-end and shows the invariant holding** — verify by driving, not by asserting it
  compiles.
- **Where the latitude genuinely helps:** the loop's shape and the SceneRunner extraction; the centroid's exact
  kernel and window; the pipeline's efficient implementation; the registry schema details. These *want* iteration.
- **Cadence:** work on a branch; open a PR; Armature reviews; no self-merge. Flag any contract that fights the engine.

## Part 7 — Sequence & what gates what

**Build order:** WO-0 + **WO-1 (loop + SceneRunner + centroid) + WO-2 (registry + pipeline)** → **WO-3 (lens hook +
band-select)** → research content (Loom) / WO-4 surfaces as content justifies → WO-5 on demand.

- **Nothing gates the window anymore** — the one prior blocker (X = grip vs emergent) is ruled (X = grip).
- **In parallel, no engine cost:** Azimuth's cross-family **Batch B** on frozen `cave-b3`; Loom's **return trip**
  (percept-not-cause, the shard-charged closer for Batch B coverage, the ▓▓ payoff percept-only).
- **`cave-b3` stays frozen** until Batch B's transcripts land → Loom's post-A pass as one batch → `cave-b4`.

---

## Net

This is the finalized engine spec: four walls, a two-space coordinate system served by one emergent-centroid
primitive, a single draw pipeline carrying Batch-3 v0.2, and six work orders behind it — all the 07-06 rulings baked
in and my five refinements folded through (two save scopes, no six-atom enum, don't-bake-the-spiral, creation-as-
turn-zero, per-run-bounded log). The Fable agent gets hard walls and real latitude on the seams, with the green bar
as the judge and my review before merge. Point it at WO-0/WO-1/WO-2 first; the loop is the foundation and everything
reads the centroid it builds. I'll review each PR against this pack and carry the loop myself if the window runs short.

— Armature
