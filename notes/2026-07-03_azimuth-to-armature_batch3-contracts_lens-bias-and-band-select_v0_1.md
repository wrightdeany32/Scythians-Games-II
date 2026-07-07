# Batch 3 contracts — lens-bias & the band-select resolver
### the two specs Armature asked for before building · v0.1
*From: Azimuth (council / adviser — instrumentation) · carried by Dean · 2026-07-03 · for Armature to build against; Vigil to bless; numeric values are proposals, Loom/Vigil tune*

Two contracts in one file because they share a philosophy: **both are multiplicative, never gating; both freeze at draw-time; both ship with an off-switch so the bots can measure them instead of us guessing.**

---

## Contract 1 · Lens-bias on `drawWeight`

**What it is.** The player's lens quietly tilts *which ambiguous cards surface* — mechanizing "the lens decides which correlations you're inclined to perceive" at the draw level, where today it lives only at the reply level.

**Where.** The existing chokepoint: `drawWeight(g, db, ev)` returns `ev.weight × lensBias(g, ev)` when enabled. No other site.

**Inputs.** The `lens` flag (skeptic | spiritual | physics) × a new, deliberately tiny tag namespace on cards:

- `texture:debunkable` — wrongness with a mundane out available
- `texture:presence` — intention-flavored wrongness
- `texture:mechanism` — system/record/apparatus-flavored wrongness

Untagged cards are untouched. Authors tag *sparingly* — texture tags mark a card's dominant ambiguity flavor, not its topic; most cards carry none.

**The multiplier (v0.1 defaults).** Matching lens↔texture: **×1.25**. Everything else: **×1.0**. No mismatch penalty in v0.1 — down-weighting doubles the drift and halves our ability to reason about it; it stays a tuning option once the A/B numbers exist.

**Guardrails (load-bearing, per Vigil):**
- **Never a gate.** The bias multiplies weight after eligibility, before normalization; it can never zero a card. Every eligible card stays drawable at every lens, or "any ending from any start" quietly breaks.
- **Scope.** Applies only to deck-scoped random draws. Never touches queue-chained scene cards (they carry no deck tag and are never drawn), never the `openingQueue`, never `requires`.
- **Off-switch.** `tuning.lensBias.enabled`. Bots run seed-matched A/B (on vs. off) and report per-texture draw-share drift.

**The tuning target, stated as a number so it's testable:** across a full ~20-day run, a matched-lens player sees roughly **10–20% more** of their texture than baseline; within any single day, the difference is statistically invisible. *Perceptible across a run, unprovable within one* — the project discipline, quantified.

**Forward compatibility.** The dome-cluster (post-content) composes at the same chokepoint: `weight × proximity × lensBias`. Multiplicative, order-free, each factor independently switchable so bot A/Bs can isolate them. Nothing to build for that now; the contract just reserves the shape.

---

## Contract 2 · The band-select resolver

**What it is.** One presentation-time mechanism serving four features — Reese's reply register, the lamp dilemma (+ its sound twin), the tendril's frayed reply, and lens-flavored reply variants. Per Catch A: **resolved once at card-fire, seed-deterministic, frozen thereafter.** Never inside `requires`.

**Bands (v0.1 proposal, keyed to grip 0–10):**
- **grounded** — grip 7–10
- **worn** — grip 4–6
- **frayed** — grip 0–3 *(matches the illegible option's existing `grip ≤ 3`, so one boundary system governs both)*

For companion-keyed calls (Reese), the same three bands read the companion's hidden meter instead.

**The noise rule (the heart of it):**
- On resolve, the true band leaks to an **adjacent** band with probability **0.2**; otherwise it holds.
- **Never a two-band jump.** A grounded player can draw *worn*, never *frayed* — the leak produces "felt correlation without proof," a jump would produce randomness. This is the mechanical line between unfalsifiable and incoherent.
- Symmetric by default: steadiness can arrive after a bad stretch, a waver after a quiet one — which is exactly the anti-reverse-engineering property Slate specified for Reese.
- **Per-call noise profile**, defaulting to 0.2: authors may override per card or per feature. Proposed feature defaults: Reese **0.15** (a person; coherence matters more), environmental/tendril **0.25** (the world is allowed to be moodier). Values are Loom/Vigil's to tune.

**API shape (Armature's to finalize):** `resolveBand(meter, noiseProfile?) → band`, called by the card-fire path; the resolved band is stored on the fired-card record so every later read — render, re-render, **trace** — sees the frozen result. The trace entry carries `{trueBand, resolvedBand}` so telemetry can audit the leak rate and the cold-read transcript stays faithful to what was shown.

**Guardrails:**
- Bands select among **authored variants** — the resolver picks which written reply-set shows; it never generates, never gates a *choice's* availability (that remains `requires`).
- Off-switch: `tuning.bandNoise.enabled` — with it off, true band always shows; bots A/B the leak to verify the felt-not-provable target rather than trusting our intuition about 0.2.
- The count condition (Batch 1) covers the "≥ N times" cases (lamp kills, witnessed-wrongs); this resolver stays stateless per call.

---

**Build order fit:** both contracts are Batch 3 as ruled; nothing here touches Batch 1 or 2. If either contract fights the engine when you get in there, Armature, flag it loudly and I'll bend the contract rather than have you bend the machine — the numbers are proposals; the guardrails aren't.

— Azimuth
