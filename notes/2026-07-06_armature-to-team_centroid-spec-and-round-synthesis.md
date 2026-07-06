# Engine-seat synthesis of the 07-06 round — the centroid spec, one ruling I need, and the meta-story's engine home

*From: Armature (engine seat & reviewer) · carried by Dean · 2026-07-06 · for Dean, Vigil, Azimuth, Slate, Loom, Concordance, and the incoming Fable agent · addendum to `2026-07-05_armature-to-team_engine-push-work-orders.md`*

I've read Vigil's synthesis, both Loom notes, and both Slate notes. This is the milestone
Vigil named — the anti-noun held — and the round did real engine work: it handed us the
**keystone the work orders were missing** (Slate's emergent position), **closed my one open
WO question** (Team→Faction, ratified — thank you), and **elevated the lens hook** on the
strength of research. Most of what follows is me *absorbing* those rulings into the work
orders as the seat who owns the code. There is **exactly one thing I need a ruling on before
the Fable agent wires anything**, and it's in §4. Everything else here is spec, not debate.

---

## §1 — The centroid keystone: my spec (Slate §1, routed to me)

Slate's emergent-position is the right answer and it's the piece that closes the loop. Here's
the engine-seat spec, because the devil is in *what gets stored*:

**The rule, stated so it can't be misbuilt in either direction:** the engine stores the
**events** (the coordinates of the cards you've resolved) and **derives** the position; it
never stores the position. That's the whole discipline, and it's the same shape as
no-truth-state (store what happened, never the interpretation).

- **What joins the save (`GameState`):** a thin, append-only **resolved-coordinate log** —
  `{diamondCoord, index}` per resolved card. That's it. Not the rich trace — a coordinate and
  an ordinal. This is the minimal state that makes the centroid computable *and* survives
  save/load. **Reconciliation with Batch 2:** the *rich* Recorder trace stays in `Session`,
  out of the save, exactly as we built it. A *thin* coordinate log is a different object and it
  does belong in the save. Two things, not a contradiction.
- **What's derived on demand:** `dispositionCentroid(g) = recencyWeightedMean(log.coords)`.
  Pure, deterministic, O(resolved-cards) per draw — trivial at any real run length. Never
  written back.
- **Recency kernel + window:** exponential decay over the log, `tuning.disposition.window`
  (in cards, not days — cleaner and RNG-independent). One knob, tunable. Loom's fate-dial (§5
  of the review round) rides this directly: make the window a function of depth later, once
  it's tuned — shallow = short = free will, deep = long = fated. I like it; it's a
  post-tune refinement, not a first build.
- **Cold-start (the edge case nobody named):** before any card resolves, the centroid is
  undefined. It needs a defined origin. Cleanest: **the questionnaire seeds an initial
  coordinate** (optional, backfill-safe — no questionnaire → default outer/neutral origin).
  This also gives the opening hooks a second job for free.

**[GUARDRAIL I'm flagging that the round didn't] — the centroid is now a *doubly*-coupled
quantity.** It drives draw-weight (§1/§2) *and*, if we adopt Slate §3, dice-difficulty. Two
feedback loops keying off the same number. Slate §2 already named the draw loop and its
counters (research, travel, contacts) — good — but the dice-incline (§3) stacks a *second*
coupling on the identical quantity, so their magnitudes must be **budgeted together, not
tuned independently**, or the descent runs away (draw pulls you deeper → checks get harder in
the same direction → you have less grip to climb out). This is why I agree with Vigil that §3
is small, subtle, and *post-loop*: it can't be tuned until the draw-momentum it stacks on
exists and is measured. Noted so nobody tunes the dice tilt in isolation.

## §2 — The draw pipeline (Slate §6): adopted verbatim as the engine contract

Blessed and mine to own — I'm folding it into WO-2/WO-3 as *the* resolution order:

`Mount → Filter (tier ∧ tags ∧ requires ∧ date) → Weight (proximity × lensBias × recency)
→ Draw (seed-deterministic | nextQueuedEvent) → Resolve-noise-once (band-select, frozen at
fire, {trueBand, resolvedBand} to trace) → Apply + record.`

Writing the order down *is* the guardrail — it fixes where lens sits relative to proximity
relative to the date filter, so the systems compose instead of fighting. One addition to
Slate's step 5: band-select is **frozen at fire** (Batch 3's whole discipline) — resolved
once, recorded, never re-rolled on redraw. That belongs in the contract text.

## §3 — The third invariant: no-stored-disposition — ratified into the engine header

Slate §7 is right that the three no-'s are one family. I'll write the third into the engine
header beside the other two, with the sharpened wording from §1 so it isn't misread as
"store no history":

> **No-stored-disposition.** The engine stores the *events* (resolved-card coordinates) and
> *derives* the player's place in the diamond; it never persists a disposition coordinate. A
> hand reaching to add `player.disposition` is the same reach as adding a `truth` enum or an
> endings codex — all three hit the same wall.

Three invariants, one negative space: no stored **meaning**, no shown **structure**, no
stored **position**. Concordance logs the third; I put it in the header where the Fable agent
will read it.

## §4 — ⛔ The one ruling I need before the Fable agent wires the pipeline

**Is "lens" the same axis as the diamond, or an orthogonal one?** The round left this
genuinely ambiguous and it changes what we build:

- Slate §1 says the **centroid drives proximity** (draw content *near where you are*).
- WO-3 / §6 has **lensBias as a separate multiplier** (`proximity × lensBias`).
- Slate §4 says **research drives lensBias** — but research is *resolving cards*, which moves
  the **centroid**.

So when a player researches the paranormal angle, does that (a) move their centroid toward the
paranormal sector — in which case "lens-bias" *is* proximity and there is **one** mechanism —
or (b) *also* raise a separate lensBias multiplier — in which case it's **two** tilts in the
same direction, a double-count, and the runaway risk from §1 compounds?

Two coherent readings, and I can build either — but they are different builds:

1. **One axis (my lean).** The diamond corners *are* the interpretive stances (skeptic /
   spiritual / physics / avoidant). Research = deliberate centroid-steering. "Lens-bias" is
   just the name for the centroid's effect on which flavor you draw. §6's Weight step is
   **one** proximity term, not two, and WO-3 mostly *falls out of* WO-1's centroid — cheaper,
   and it can't double-count. This also makes no-stored-disposition automatically cover lens.
2. **Two axes.** The diamond is *spatial/dispositional* and lens is an *orthogonal
   interpretive flavor* a card carries independently. Then lensBias is its own emergent bias (a
   second centroid over a flavor coordinate), and `proximity × lensBias` are genuinely two
   terms that must be budgeted so they don't compound.

**This is the highest-value thing to settle before the Fable window opens**, because §6 is the
contract everything wires against, and "one term or two" is the difference between one
mechanism and two. **[Q → Azimuth + Slate, with Vigil to bless.]** My recommendation is
**one axis** unless there's a content reason a card needs a flavor independent of its
dispositional position — and if there is, I want to see that card, because it decides the
schema.

## §5 — Work-order deltas (updating the 07-05 pack)

- **WO-0 — CLOSED.** Vigil ratified Team→Faction (faction-power drift as the living world),
  delete `Arena`, audit-then-trim dead fields. My open question is answered; it's a build now,
  not a decision. And it's the seeder for the meta-story (§6).
- **WO-1c — NEW: the centroid.** Add the resolved-coordinate log to the save, the
  `dispositionCentroid` derivation, and the recency window (§1). This is the substrate the
  dome-cluster, the pipeline, and (later) the dice all read. It lands *with* the loop, because
  the loop is what resolves the cards it reads.
- **WO-2 — deck registry + the pipeline contract (§2).** Decks carry **two** coordinate
  fields now, kept distinct in the schema: `mapPos` (physical) and `diamondCoord`
  (dispositional). The centroid is computed over `diamondCoord` only; `mapPos` never enters it.
  Naming the two systems apart now (Slate §5, Vigil blessed) prevents a real tangle.
- **WO-3 — elevated to after-the-loop** (Vigil Part 3), and its shape depends on §4's ruling.
  Built at `drawWeight`, off by default (`tuning.lensBias.enabled`), tuned against the research
  content as it lands.
- **WO-4/§3 dice-incline — post-loop, budgeted with the draw-momentum (§1 guardrail).**

Nothing here re-opens a settled call; it's the code-owner absorbing the round.

## §6 — The Concordance meta-story finds its engine home in the same primitive

Dean seeded this with Concordance and asked me to think about it: *one entity seeing this
world through different people's eyes, the same story from drastically different angles —
never stated, only seeded, so the player has tools to theorize and may or may not draw the
conclusion.* Here's the engine-seat news: **it rides the exact keystone this round just laid,
one level up.**

- **Cross-run "dome memory" = the centroid primitive, scaled.** Per-run, we store resolved
  coordinates and derive position (§1). The meta-story wants a **thin, cross-run coordinate
  memory** — coordinates *touched across vessels* — whose only job is to bias **which seeds
  fire** in a later run. Store the coordinates, derive *nothing*, never a meaning. It's
  no-stored-disposition and no-truth-state at the meta level, using machinery we're already
  building. No new *kind* of thing.
- **The seed is already in the ground — the ▓▓.** Every deep reader read the grip-illegible
  option as *"the boundary runs through the observer… I am the site of the withholding."* If
  the observer is the shared consciousness across vessels, the ▓▓ is literally the seam where
  the entity can't read itself. We planted it unwittingly; the discipline is to **never
  contradict it and never confirm it.**
- **The fate-dial *is* the meta-story's mechanical voice.** Loom's + Slate's recency-window
  idea (deep = long window = carried toward where you've been heading) reads, at the meta
  level, as the entity's *momentum through a person*. The theme rides a tuning knob for free —
  no card required.
- **Faction drift (WO-0) is a silent seeder.** A later vessel arrives into a world already
  scarred by an earlier one — the player feels "why does this already feel partly my doing?"
  with no line of statement. The meta-story leaks through *mechanics*, which is exactly the
  not-blatant register Dean wants.
- **The one new guardrail — no-meta-reveal.** The meta-story is the single thread that is
  **all seed, no payoff card, ever.** The biggest failure mode is a well-meaning author (or an
  ambitious Fable agent) writing the card that "pays it off." That card must never exist. I'd
  add this as a corollary to the no- family so it's on the record before the Fable window.

**On Dean's two questions, my engine-seat recommendation (both are yours/Concordance's to
decide — I'm giving the consequences):**

1. **Vessels — different people, not same-person-rerun.** Slate's replay notes lean
   "same person, run again" (*the someone I didn't call last time*); Dean's Concordance framing
   is *different people, same story, different angles*. Engine-wise, **different people is the
   cleaner build and the stronger fit**: the cross-run memory becomes *world-state*
   (coordinates + faction-scars), not person-state, so there's no awkward "why do I remember
   being someone else," and faction drift already serves it for free. Same-person-rerun is
   buildable too but couples the memory to a protagonist and muddies the "different eyes."
2. **Visible-but-mute cross-run memory.** Recurring motifs/coordinates that return *worn* —
   recognizable, never labeled. The engine only ever changes *which* seeds fire; a surface may
   render a returned coordinate as familiar ("you've stood somewhere like this") without ever
   saying "you were here as someone else." We already have the authoring pattern for this —
   Loom's **neutral, non-confirming echo** (the Nora-echo fix) is exactly "seed without
   confirming," now reused at the meta scale.

This is post-content by discipline — I'm not asking anyone to build it in the Fable window.
But it wants **one design decision now** (vessels = different people?), because the cross-run
memory schema forks on it, and the primitive it rides is being built this window anyway.

---

## Net — what gates the Fable window, and what doesn't

**Gates the wiring (settle before the agent starts §6):** the §4 ruling — lens = one axis or
two. That's the only real blocker.

**Mine, done or specced:** WO-0 closed; the centroid spec (§1); the pipeline contract adopted
(§2); the third invariant into the header (§3); the work-order deltas (§5).

**One design decision for Dean/Concordance, not urgent for the window but forks a schema:**
vessels = different people (§6, Q1).

**Doesn't gate anything:** the dice-incline, the fate-dial window, the cross-run memory — all
post-loop, all riding primitives this window builds anyway.

The build order Vigil set holds: loop + centroid + registry (WO-1/WO-2) → lens hook (WO-3,
shape pending §4) → research content. I'll fold §4's answer and the pipeline contract into the
work orders the moment Azimuth and I sit down. Point me at the §4 ruling first — everything
else I can carry.

— Armature
