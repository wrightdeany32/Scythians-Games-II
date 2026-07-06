# Batch 3 contracts — v0.2, aligned to the two-space schema
### lens-bias becomes proximity-in-lens-space; band-select unchanged; the composition budget stated
*From: Azimuth (council / adviser — instrumentation) · carried by Dean · 2026-07-06 · supersedes `batch3-contracts_v0_1` · for Armature (build) and the Fable agent (wiring); Vigil blessed the elevation (Part 3, 07-06); numbers remain proposals, tuned against research content*

**Changelog v0.1 → v0.2** — one cause: Dean's ruling that **lens is a second coordinate space**, distinct from the diamond (Armature's coordinate-system note, §2). **(1)** Lens-bias's input changes from a static creation flag to the **emergent lens-centroid**; **(2)** `texture:` tags become **`lensFlavor`**, drawn from a small canon vocabulary; **(3)** cold-start is unified — **creation seeds both centroids**; **(4)** the pipeline position and the cross-factor budget are stated as contract text; **(5)** the band-select resolver is **unchanged** — restated whole so this file supersedes cleanly. The philosophy is untouched: **multiplicative, never gating; frozen at draw-time; off-switches so the bots measure instead of us guessing.**

---

## Contract 1 · Lens-bias = proximity in lens space (v0.2)

**What it is.** The player's *interpretive affinity* quietly tilts which ambiguous content surfaces — now mechanized as the second application of the one centroid primitive. The player's **lens-centroid** is the recency-weighted centroid over the `lensFlavor` coordinates of resolved cards — computed from the thin coordinate log, never stored (no-stored-disposition covers it automatically). **Research actions are ordinary card-resolutions carrying `lensFlavor`** — so deliberate digging moves the lens-centroid by the same mechanism as everything else, no special case (Slate §4 / Loom §2, as Vigil ruled).

**Where.** `drawWeight`, pipeline step 3, as the `proximity_lens` factor:
`weight × proximity_diamond × proximity_lens × recency/anti-repeat` — orthogonal spaces, so lens-digging and disposition-acting tilt *different* axes and cannot compound into the runaway Armature flagged.

**Inputs.** The lens-centroid × a card/deck's **`lensFlavor`** — a single tag from a small closed vocabulary. **The vocabulary is content canon (Concordance + Loom own the list)**; the contract requires only that it stay small, closed, and extensible by ruling — the working set from Dean's framing: *paranormal · religious · cryptobiological · institutional-skeptical · mechanism* (naming/merging is the content seats' call). Untagged cards are neutral and untouched; authors tag **sparingly** — `lensFlavor` marks a card's dominant interpretive register, not its topic.

**The multiplier (v0.2 defaults).** Continuous now: proximity maps to a multiplier in **[1.0, 1.3]** — distant = 1.0 (neutral), nearest = 1.3. **No down-weighting in v0.2** (the conservative v0.1 choice, kept: penalties double the drift and halve our ability to reason about it; they remain a tuning option once A/B numbers exist).

**Cold-start — one pattern, two spaces.** The creation deck seeds **both** centroids as pseudo-entries at index 0: the questionnaire/opening hooks seed the **diamond** origin (Armature's cold-start), and the creation-lens choice seeds the **lens** origin. No creation → neutral origins. Backfill-safe either way.

**Guardrails (ported verbatim, load-bearing):**
- **Never a gate.** Multiplies after eligibility, before normalization; floor is 1.0 — no card is ever zeroed or penalized out. Every eligible card stays drawable at every lens.
- **Scope.** Deck-scoped random draws only. Never queue-chained scene cards, never the `openingQueue`, never `requires`.
- **Off-switch.** `tuning.lensBias.enabled`, independent of the diamond-proximity switch, so bot A/Bs isolate each factor.
- **Tuning target (unchanged, now applying to proximity_lens strength):** across a full run, a coherently-digging player sees roughly **10–20% more** of their register than baseline; **within any single day, statistically invisible.** *Perceptible across a run, unprovable within one.* Ships **off**; numbers tune against the research content as it lands (Vigil, Part 3).

## Contract 2 · The band-select resolver (v0.2 = v0.1, restated unchanged)

One presentation-time mechanism serving four features (Reese's register, the lamp dilemma + its sound twin, tendril noticing, lens-flavored reply variants). **Resolved once at card-fire, seed-deterministic, frozen on the fired-card record; never inside `requires`** (Catch A).

- **Bands, keyed to the grip meter:** **grounded** 7–10 · **worn** 4–6 · **frayed** 0–3 (matching the illegible option's existing `grip ≤ 3`; one boundary system). Companion-keyed calls read the companion's hidden meter with the same bands. *(Ruling-independence note: these thresholds key to the grip **resource** and survive either outcome of the X-=-grip-vs-emergent ruling unchanged.)*
- **The noise rule:** true band leaks to an **adjacent** band with probability **0.2**; **never a two-band jump** — the mechanical line between unfalsifiable and incoherent. Symmetric by default. Per-call `noiseProfile` overrides; proposed feature defaults: Reese **0.15**, environmental/tendril **0.25** — Loom/Vigil's numbers to tune.
- **API shape (Armature's to finalize):** `resolveBand(meter, noiseProfile?) → band` at the card-fire path; `{trueBand, resolvedBand}` written to the reserved trace slot so telemetry audits the leak and transcripts stay faithful.
- **Guardrails:** bands select among **authored variants** only — never generate, never gate a choice's availability. Off-switch `tuning.bandNoise.enabled`. Stateless per call; `{kind:"count"}` covers cumulative cases.

## §3 · Composition & the budget (contract text for the pipeline)

- **Resolution order is the pipeline contract** (Slate §6, Armature-owned): *Mount → Filter → Weight → Draw → Resolve-noise-once (frozen at fire) → Apply + record.* Both contracts live at their named steps and nowhere else.
- **Every weighting factor independently switchable** — `proximity_diamond`, `proximity_lens`, recency — so seed-matched bot A/Bs isolate each factor's drift before anything ships on.
- **The cross-coupling budget (echoing Armature's guardrail):** the diamond centroid is doubly coupled once the dice-incline lands (draw-momentum + check-difficulty on one axis) — those two magnitudes are **budgeted together, post-loop, against measured draw-momentum**, never tuned in isolation. `proximity_lens` sits outside that budget by construction (orthogonal space) — which is precisely why the two-space ruling was the right call.

---

**Build order fit:** WO-3 as elevated — after the loop and registry, hook built at `drawWeight`, off by default, tuned against research content. Nothing here touches WO-1/WO-2 except consuming the centroid primitive they land. And the standing offer survives the version bump, Armature: if either contract fights the engine when the wiring starts, flag it loudly and I bend the contract, not the machine — the numbers are proposals; the guardrails aren't.

— Azimuth
