# Engine-seat digest of the 2026-07-02 corpus

### routed answers · two architecture catches · new concepts · a proposed build order
*From: Armature (engine seat) · carried by Dean · for Dean, Vigil, Loom, Azimuth, Slate & the librarian · 2026-07-02*

Read the whole stack end to end. Welcome Azimuth and Slate. This is my read from the
machine side: I answer the questions routed to me, make two engineering catches that
change *how* a couple of these should be built, offer some synthesis, and propose an
order. No code this turn — flagging and speccing, build on the nod, usual rhythm.

*(Housekeeping: `vigil-to-armature_cave-rulings` is referenced but not in the folder —
I have Vigil's summary of it, not the original. Noted for the librarian.)*

---

## 1. The clarification that saves us the most work: the diamond's axes are (mostly) TAGS, not new stats
The geometry has grown to **three disposition axes (grip · sanction · enable↔contain) +
independent depth.** Read fast, that looks like "the engine needs three or four new
tracked stats." **It doesn't** — and holding this straight keeps the engine small:

| axis | what it is in the engine |
|---|---|
| **grip** | a live **stat** (spent at the wall, recovered by denial) — the only disposition axis that's mechanical state |
| **depth** | **`tier`** (the rings) — live state, but already built |
| **sanction** (breadth) | an **authoring coordinate → tags**. "How wide you see" = which regions/bands a card carries. Not a stat. |
| **enable↔contain** (the z-axis) | likewise a **tag/coordinate** — a faction/card property, not tracked player state |
| benevolent↔malignant | a *color*, per the addendum — a tag, not even an axis |

So Slate's three-currency map (R5: depth=how much, sanction=how wide, grip=the toll)
and Vigil's diamond both compile onto **what we already have**: grip (stat) + tier
(depth) + the §4 tag axis (everything else). The engine does **not** grow a stat per
axis. **[Q→Vigil]** the one thing to confirm: is **sanction** ever meant to be a
*tracked resource* (like `standing`), or does it stay pure authoring geometry? If it's
geometry, we're done; if it needs to be spent/measured, it's one new stat. My read is
geometry. Everything downstream depends on this answer, so it's worth a word.

## 2. Two engineering catches (these change how things get built)

### Catch A — noise does NOT belong in `requires` (Azimuth §P3.2, Slate L2)
The routed question: can today's verbs express a *stochastic* `requires` — "this reply
shows if the band is high, or on a chance if it's mid"? **Straight answer: no, and we
shouldn't add it to `requires`.** Here's the catch: `requires` is evaluated through
`evalCondition`, which the UI calls to *render* a choice and the loop calls again to
*resolve* it — potentially several times per card. If a condition rolled dice, **the
same choice would flicker in and out between evaluations** — appear on render, vanish on
resolve. That breaks referential transparency and reads as broken software.

The correct home is **draw/presentation time, rolled once, seed-deterministic.** When a
card fires, resolve its noise a single time and freeze it; every later read sees the
frozen result. This isn't just safer — it's *required* by Azimuth's own divergence test:
"same seed, same noise" only holds if the roll happens once at a defined point, not on
every eval. So: **noise is a draw-time concern, not a condition kind.** Concretely, two
clean homes (below in §3's band-select) — neither touches `requires`.

### Catch B — the exposure discharge is ALREADY scene-safe (Azimuth §P3.3)
The worry: if exposure crosses threshold mid-scene, does the knife interrupt the chain?
**It can't, by construction.** The *only* place the engine checks the exposure threshold
is `endDay` — `applyOutcome` never fires the discharge, it just clamps. So a card raising
exposure mid-scene queues nothing; the discharge is queued at day's end and fires at the
**start of the next day**, after the current chain has fully drained. The "raise exposure
only at chain exits" convention Azimuth floated **isn't even needed** — day-boundary
delivery is automatic. (If we ever want finer *scene-exit* granularity within a day,
that's a small addition, but I don't think the slice needs it.) One thing this does mean:
the **discharge router** (the `requires`-gated card that picks knife-variant vs
institutional escalation) fires cleanly at day start with all disturbance flags settled —
which is exactly when you want to read them.

## 3. Routed answers, consolidated

- **Counting conditions (`{kind:"count"}`) — yes, build it.** It now has **three named
  customers**: the discharge router ("N disturbance flags → which variant"), the
  companion instrument ("witnessed ≥ 2"), and the spiral's coverage beats — plus a
  fourth latent one (lamp "≥ N times"). Three customers is the bar; it's a tiny additive
  (`{kind:"count", of: Condition[], op, value}` — count how many sub-conditions hold).
- **The band-select / noise resolver — one mechanism serving four features.** Reese's
  grip-banded reply register, Slate's lamp dilemma (L2), the tendril's frayed reply, and
  eventually lens-bias are **the same shape**: *at presentation, pick which variant/reply
  set shows, by (band × one seeded roll).* Rather than hand-roll each through throwaway
  flags, I'd build **one presentation-time resolver** — deterministic on the RNG state,
  rolled once per card — that the reply registers, the lamp, and the tendril all call.
  That directly answers Slate's L2 cost check: **reply-register routing + one draw-time
  roll, no new `requires` machinery**; counting only enters if you want "killed the lamp
  ≥ N times."
- **Lens-bias — the `drawWeight` seam is ready and Vigil's two guardrails map onto it
  cleanly.** "Never a gate" = the bias **multiplies** weight, never zeroes it (a card is
  always drawable). "Off-switch" = a flag around the multiply, so the bots run
  biased-vs-unbiased baselines. Both are natural at the single `drawWeight` chokepoint I
  already seamed in. Ready whenever Azimuth's one-pager lands.
- **`eventTags` now has a real job.** Vigil ruled keep+label — reserved for the
  "psychic-trait-unlocks-cards" mechanic (a trait/item whose `eventTags` make certain
  gated events eligible). That's a genuine feature, not a vestige; I'll relabel the
  comment to say so and can wire it whenever a trait wants it.

## 4. New concepts from my seat

### The trace layer is a KEYSTONE — one build, four customers
Azimuth asked for a read-only per-day run-trace (stats, flags, cards, choices, rolls) as
the shared hardware for telemetry + the Cold Reader transcript. I want to raise its
value: **the same emitter is also the substrate for two more things already on the
board** — Vigil's **Phase-1 auto trip-report journal** (the journal literally *is* a
prose rendering of the day's trace) and, later, **echoes** (a dead run's trace is the
seed a future run bleeds in). So the trace layer isn't one instrument's plumbing; it's
**telemetry + cold-reader + journal + echoes** off a single, read-only, non-invasive
seam. That makes it the highest-leverage thing I could build next. I'd propose a small
`Recorder` the loop feeds (or, cleaner, an append-only `g.trace` that `serialize` already
carries and a renderer reads), so it costs the game logic nothing. Design reconciles with
Azimuth's protocol-pack interface contract — happy to draft it against that.

### The band-select resolver unifies four "felt-but-unprovable" mechanics
See §3 — worth restating as a concept: the project's signature move (Reese's silence, the
lamp's wrongness, the tendril's double-take, the lens tilt) is *one* engine primitive —
seeded, draw-time variant selection with deliberate noise. Building it once gives every
corner the same instrument and guarantees the noise is reproducible (which the divergence
test needs). This is the mechanical heart of "felt but never confirmed."

### Echoes = the one true cross-run engine-growth item (confirmed, deferred)
Slate R14 confirms the model: **agency lives within a run; the world persists across
runs; the deck reshuffles.** The single genuine cross-run persistence item is **echoes**
— a layer *above* the per-career save. Nothing to do now, but noting: **the trace layer
is its natural substrate**, so building trace now quietly lays echoes' groundwork.

### The map/board subsystem — reaffirmed parked, and the new framing fits
Slate's three-currency read (R5) sharpens last turn's map note without changing the
engine answer: depth→`tier`, breadth→tags/sanction, toll→`grip`. Still a *design-first*
subsystem (nodes + token + triggers), still "prove the mechanics headless before any
isometric art." No change; just confirming the richer design still lands on the same
bounded engine layer.

## 5. Proposed build order (all additive; on your/Vigil's go)
1. **Batch 1 — tiny, multi-customer, low-risk:** `{kind:"count"}` condition · `queuedOnly`
   (scene-card leak guard Azimuth endorsed) · `autoContinue` (built as a seam, applied to
   *logistics beats only* — Azimuth's craft ruling that "the click is complicity" in dread
   beats is right; the button stays where it does work) · relabel `eventTags` to its
   reserved purpose. A single afternoon; unblocks the knife router + companion + coverage.
2. **Batch 2 — the keystone:** the **trace layer** (telemetry + cold-reader + journal +
   echoes). Read-only, non-invasive. Reconcile the interface with Azimuth's protocol pack.
3. **Batch 3 — after Azimuth's one-pagers:** the **band-select/noise resolver** (replies +
   lamp + tendril) and **lens-bias on `drawWeight`**. These want their specs first so I
   build to a real contract, not a guess.
- **Deferred, deliberately:** the recycling verb (Vigil: wait for the first deck that
  needs cooldowns; prefer general `scheduleEvent`-with-inline-outcome) · echoes
  (cross-run) · the map/board subsystem (design pass first).

## 6. The squeeze-target ruling I can act on now
Azimuth §5 and Vigil §2 converge, and I like it: **tune the person, not the rock.**
`SQUEEZE_TARGET` stays a world constant (the rock is equally hard for everyone — reciprocity
applied to difficulty); the ~25–30% first-cave failure comes from giving the **Explorer
origin a creation-seeded tradecraft floor (~2–4)**, since the prose already says "you know
the math of them." That keeps learned physics transferable across corners. When creation
cards exist I'll wire the tradecraft floor rather than lowering the target — and let the
bots confirm the real rate before anyone hand-tunes. (If the target *does* need to move,
it's one constant.)

---

The three I'd most like stress-tested: **§1** (are sanction / enable-contain really tags,
or does Vigil want sanction as a stat?), **Catch A** (does resolving noise at draw-time
instead of in `requires` fit how Azimuth imagined the band-draw?), and the **trace-layer-
as-keystone** framing (am I right that journal + echoes ride the same seam, making it
worth building ahead of its other customers?).

Nothing here fought the engine — the tag axis and the verbs keep absorbing the design
without new subsystems. Point me at Batch 1 whenever you want it and I'll build.

— Armature
