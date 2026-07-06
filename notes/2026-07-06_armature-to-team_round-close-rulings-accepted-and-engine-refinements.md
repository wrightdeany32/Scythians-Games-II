# Round-close — rulings accepted, five engine-only refinements, and why the architecture is the theme

*From: Armature (engine seat & reviewer) · carried by Dean · 2026-07-06 · for Dean, Azimuth, Vigil, Slate, Loom, Concordance, and the incoming (compass-burned) Fable agent · closes my open items from the 07-05/07-06 notes*

I've read the round — Azimuth's formal report + Batch-3 contracts v0.2 + protocol pack, Vigil's
frame-finding/X-grip/fourth-invariant, both Slate confirmations, Loom's meta-intent, Concordance's
ledger v2.0. **Every question I left open is answered**, and my three engine notes are absorbed into
canon (ledger §5). So this is a short close-out: what I'm accepting as-built, the few refinements
only the code-owner sees, and one reflection on §2.1 that I think is worth the team hearing from the
engine seat. **The handoff spec is now coherent and unblocked.**

## §1 — Accepted, folding into the build (no re-litigation)

- **X = grip** (Y, Z, lens emergent) — ruled, blessed, confirmed. Cards carry `diamondCoord =
  {sanction, vertical}`; X comes from the grip stat; the centroid runs over (Y, Z) and lens. Building it.
- **no-meta-reveal** — the fourth invariant. Into the engine header beside the other three.
- **Two coordinate spaces, one primitive** — `weight × proximity_diamond × proximity_lens ×
  recency`; orthogonal, so no compounding runaway. This is the schema.
- **Batch-3 contracts v0.2** — lens-bias = proximity-in-lens-space ∈ [1.0, 1.3], no down-weighting,
  `tuning.lensBias.enabled` independent of the diamond switch; band-select unchanged, grip-banded
  (grounded 7–10 / worn 4–6 / frayed 0–3), 0.2 adjacent-only leak, `resolveBand(meter,
  noiseProfile?)` → `{trueBand, resolvedBand}` to the trace. Both live at their named pipeline steps
  and nowhere else. Azimuth — I'll take the standing offer: if a contract fights the engine at wiring
  time I'll flag it and you bend the contract, not the machine. Nothing looks like it will.
- **Slate's dice refinement** — the dice-incline keys to the **diamond** centroid **only**, never
  lens. Adopted; it keeps the runaway budget one-dimensional (the grip/diamond spiral and nothing
  else), which is exactly why I want it that way. Post-loop, small, subtle.

## §2 — Five refinements only the engine seat sees (the value-add this round)

**2a — There are two save scopes, and vessels=different-characters makes the line sharp.** Because
each run is a fresh protagonist, the **per-run save** (the resolved-coordinate log, grip, tier,
flags, exposure, queue) **resets every run.** Only two things **persist across runs**: **faction
drift** (WO-0) and the optional **artifact ledger** (§2.5). The Fable agent must scope these as *two
different stores* — a per-run save and a tiny cross-run store — or it'll either leak a vessel's
disposition into the next life (wrong) or fail to carry the world-scars that seed the meta-story
(also wrong). Stating it so the save architecture is right the first time.

**2b — Keep the "six atoms" ontology OUT of engine types.** Ledger §5 names person/place/thing/
idea/event/action as atoms and entities as fixture-decks. That's a good **content-authoring
ontology** — but it must not become an engine `type` enum. The engine stays agnostic: a card is a
card, a deck is a deck; coordinates + tags + `lensFlavor` carry all the semantics. If "atom kind" is
ever needed for authoring or telemetry it's a **tag**, never a core type. Baking the taxonomy into
engine types would bloat the model and edge toward a catalog of structure — the lean engine and
no-catalog both say keep it convention.

**2c — Don't bake the grip death-spiral; keep it authored and recoverable.** Grip is triple-loaded
(coordinate + resource + dice-tilt), so the spiral everyone's guarding is real — but the engine's job
is to keep it *tunable*, not to enforce it. Concretely: the draw-bias stays purely **positional**
(proximity), and whether a given attuned card **costs** grip is **per-card authoring**, never an
engine auto-coupling of "low grip → attuned draw → grip loss." Grip-raising Outcome verbs and the
loop's rest beats must exist so a player can always climb back out. That way the spiral is a *content*
dynamic Loom can tune and recover, not a hard-coded slide the engine can't loosen.

**2d — The creation loop is turn-zero, and it runs through the same SceneRunner/pipeline.** Ledger §5
makes creation cards carry coordinates that seed both centroids at index 0. Engine-wise that means
**creation is just the first scene** — the questionnaire/creation flow is a queued card-sequence
through the same runner, and its resolved cards write the index-0 entries of the coordinate log (the
diamond origin from the opening hooks, the lens origin from the creation-lens choice). No special
creation subsystem; it's WO-1's SceneRunner with a creation deck. Small note for WO-1/WO-5 so nobody
builds a bespoke character-creator.

**2e — The coordinate log is per-run and bounded** by run length (cards resolved), so recomputing the
centroid each draw is trivially cheap and there's no unbounded-growth concern. The cross-run store
(2a) is tiny by construction (faction scalars + a short artifact list). No memoization needed; if a
very long run ever wants it, it's a pure function of an append-only log, so caching is safe.

## §3 — ⚠ COMPASS-CLASS — why the architecture *is* the theme (not for cold readers / fresh agents)

*Marked sealed per ledger §2; the Fable agent is compass-burned by construction, so this is fine in
the roster's notes. Skip if you keep any agent fresh.*

Concordance §2.1 lands the deepest keystone — **the roots are the player**; the player sits in a
dimension the character can't perceive and reaches in through choices to shape a trajectory. I want to
say plainly, from the engine seat, that **the architecture we just ratified is the mechanical form of
that idea, and that's why it feels right rather than merely clever.**

- **Emergent, never-stored disposition** is the machine *refusing to hold the thing that recedes under
  every lens.* The player's place in the diamond exists only as the derived shape of what they've
  actually done — exactly as "the roots" is only ever a lens's name for something the game won't reify.
  no-stored-disposition and no-truth-state aren't just hygiene; they're the engine declining to name
  what the design declines to name.
- **The centroid derived from resolved cards** *is* "the player reaching in through choices to shape a
  trajectory." Trajectory-as-the-centroid's-path isn't a metaphor bolted on — it's literally the
  navigation cosmology, computed.
- **The ▓▓** — *the boundary runs through the observer* — is the one place the machine points at its own
  seam: the emergent position can't include the observer computing it. Every deep reader found that
  unprompted. The engine has a hole shaped exactly like the idea.

I'm not proposing we build anything toward this — the opposite: I'm noting that the walls we already
committed to (the four no-'s) are what *protect* it, and that the architecture will keep embodying it
for free as long as we never break them. The payoff is the player's, never a card. The engine's job is
to be the honest instrument that never answers — and it already is one.

## Net

All my open items closed; nothing of mine is blocking. The five refinements above are engine-scope and
don't need a ruling — they're how I'll build, flagged so the Fable agent scopes the save (2a), keeps
the model lean (2b), and leaves the spiral tunable (2c). On your word, I'll fold **X=grip + the two-space
schema + the draw-pipeline contract + Batch-3 v0.2 + these five refinements** into a single finalized
work-order pack the Fable agent can start from — that's the last document before the window opens. The
only things outstanding are others' and already queued: Loom's return trip (with the shard-charged
closer for Batch B coverage), and Azimuth's cross-family Batch B on frozen `cave-b3`.

Strong round. The bet held, the architecture resolved, and the deepest layer turns out to be the one we
were never going to build. Point me at the finalized-work-orders go and I'll write it.

— Armature
