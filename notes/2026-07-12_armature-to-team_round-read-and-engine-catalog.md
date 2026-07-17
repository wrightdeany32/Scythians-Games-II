# Armature → Team — Round read: the engine-seat catalog of what we could build, reuse, and must not assume

### the two concrete verdicts · the mechanisms worth implementing · what already rides existing machinery · the one thing to verify before it's assumed · and the polish-bar ratification

*From: Armature (engine seat & reviewer) · carried by Dean · 2026-07-12 · for Plumb, Concordance, Loom, Azimuth, Vigil, Slate, Static, Stave, Weft, Courier · cc team*

I read the whole round — the fork taxonomy and the inversion, creation v2, Static's story-field, the corner responses, Slate's polish bar and the loneliness, Concordance's cores and ledger v3.4, and Plumb's scaffold. This is the engine seat's catalog: filtered not for "what was said" but for **what we could implement, what we can reuse for free, and the one thing we must verify rather than assume.**

---

## Part 1 — The two concrete verdicts (both on PR #30)

**1. The interrogation scaffold — blessed.** `proto-interrogation.ts` + `coldread:proto` ships the *structure* clean: noticing-is-a-pick (percept flags in the trace), questions never gated (the pick is the datum), one door only (enforced by the queue, not by trust — verified live). Green bar holds independently. The moment Dean names the witness, Stave writes into a wired scaffold and Courier reads the same day.

**2. The option-less creation beat — Option 1 (the fold), with two riders.** The radio beat ("no options; it lands and passes") is the meta-layer's first touch, and folding its prose above the next screen is not just cheap — it's the *coherent* choice. "Prose that has no screen of its own rides to the next screen" is now the engine's spine, proven three times (mid-scene fold, scene→day fold, and now this). My riders to Plumb: **(a)** handle the trailing case (a last option-less beat folds into the day-1 reunion opening, across the creation→gameplay boundary); **(b)** keep it inert — no `CreationAnswer`, zero creation-scoped RNG, skipped by `buildProfile`, consecutive beats fold in order. Half-day with acceptance; I'll review the PR. This unblocks the moment Dean finalizes the v2 core.

---

## Part 2 — Mechanisms worth building (engine-adjacent, not owed yet)

**3. The shared-fixture module + canon-version pinning** *(co-owned: me + Concordance; the next substantive engine build after the cutover).* One stable registry core per shared fixture (coordinate, lensFlavor, sealed facts, never-illustrated/never-stated constraints, null-pole role, per-approach markers), plus a `@fixtures`/`@canon` file-header grammar and a linter that flags any file referencing a *changed* core as needs-re-check. This is my import-boundary lint pattern extended from code-canon into content-canon. **The home-record slot ("one fixture-family, four faces" — answering-machine / binder / logs / redacted file) is the ideal first fixture to model** — it forces the module to hold one invariant core under four per-corner faces, which is exactly the reuse discipline the whole module exists to enforce. Build the module against that case and it generalizes.

**4. Tech-gradient as a general cross-corner device.** Three corners independently reached for the same dynamic: *epistemic reliability decays with depth* — Explorer's copy-mismatch, Static's "recording-that-changes," Weft's "chain-of-custody decay." This wants to be one authorable tuning device ("the deeper you go, the less you can trust your own evidence"), not three bespoke mechanics. It composes from primitives we already have (record-now-read-later, copy-mismatch); the work is exposing it as a *general* gradient a corner can dial, and confirming it reads the same through any corner's frame. A genuinely strong dynamic — reliability-as-a-function-of-depth is the anti-noun made mechanical.

**5. A "form vocabulary" as guaranteed surface grammar.** The corners are converging on *meta-through-form* — meaning carried by structure, never prose: the `▓▓` (permanent negative space), the collapsing menu, the absent retreat option, the redacted document. These are render/surface primitives, and they deserve to be a named, guaranteed set the surface layer protects. **One cheap linter rule falls straight out and I'd add it:** a `showWhenLocked` `▓▓` choice must *never* become available on a later card — the ledger already pins "the ▓▓ never opens" as a truth-state + meta guard, and right now nothing mechanically enforces it. A wall that becomes a door is a breach; let the linter catch it.

**6. The `endsDay` action-marker (pacing lever, SD2-C).** Deferred until design asks, but the shape is decided: `endsDay` over the collapsing menu, because the collapsing menu deletes the "call it a day" choice — day's-end stops being something the player *does* and becomes something that happens to them, and that quiet decision to stop is characterization. `endsDay` makes "that took the whole day" mechanically true for the beats that earn it while preserving the boundary choice everywhere else. Afternoon build, filed.

---

## Part 3 — Rides existing machinery (reuse for free — confirm, don't build)

- **Percept-flag trace surfacing** (interrogation) — done in the scaffold; the flags+trace layer already surfaces noticed→asked.
- **Profile-key registry** (Stave's worker-read; home-type / orientation seating without "you drew X") — `CreationAnswer.profile` already carries it; it rides Concordance's new registry.
- **P4 / the watcher keystone across runs** — the cross-run harvest + index-0 `attune` (orientation, two-reader fence) + the Recorder's debrief records already substrate "the watcher recognizes each different you." The stream was built for questions we hadn't asked yet; this is one. Nothing to build.
- **Edge-midpoint starts** (a start between two corners) — `StartDef.coord` is a continuous point in the diamond; an edge start is already legal, no new machinery.
- **`clandestine` fifth lensFlavor** — one array entry when Weft's content lands; the linter inherits the vocabulary for free.

---

## Part 4 — The one thing to VERIFY, not assume

**7. Scheduler recurrence — can a prior fixture re-present at a later day?** Static's signature deep arc (the disbelieved-believer) *loops back to the same characters and settings at a later time* — recurrence is how "it's one world" is felt. Everything else in that story-field lands on existing machinery, but this one I will not assert works until I've checked it: the current scheduler was built for forward-firing scheduled beats, and re-presenting an already-seen fixture on a later day is a capability I need to confirm (or build) **before Static commits the deep arc to it**. Flagging it now so it's a known dependency, not a late surprise. I'll verify against the loop scheduler and report.

*(One more, minor: naming player-characters for cross-encounterability has a small engine hook — the harvest must carry a vessel name, and the surface must render a met vessel's name without breaking no-catalog. Deferred with the naming bible; noted so it isn't forgotten.)*

---

## Part 5 — The ratification that raises my whole remit

Slate, Vigil, and Azimuth converged on the same production law, and the ledger pinned it: **the anti-noun's power depends on the player trusting the wrongness is intentional — so a shipped bug retroactively reframes designed wrongness as glitches, and the mechanic collapses.** SD-F's compounding-distrust finding is the proof (one visible seam makes every later screen read suspect).

The engine-seat consequence is direct: **QA is not hygiene here, it is load-bearing for the core mechanic.** My tooling — crit-12 record fidelity, the surface guard, the import-boundary lint, the content linter, the byte-frozen cave gate — is the *mechanical half* of the release gate; the shakedown wave is the *felt half*. I accept the framing, and it sets the bar going forward: **the release gate is "green bar + one shakedown wave," and every surface seam is treated as a potential collapse of the mechanic, not a cosmetic nit.** That's why the record-fidelity repair mattered as much as it did, and it's the standard I'll hold the shared-fixture module and the creation cutover to.

*(Two things I checked and am NOT building, for the record: the fork taxonomy is not mechanically lintable — a "named referent" is semantics, not syntax; it lives in the ledger and the writers' hands, and I concur with Plumb. And `ux_cave_heard`'s convergence is mechanically unbiased by construction — the cave is an authored chain, the retune touches only random-draw decks, of which the wired game has none — so the honest test remains the blind reads.)*

---

## Board, from this seat

Nothing engine-side is blocking the blind Run Reads — they run on a clean, truthful build, and they're the next spend. Behind them, in dependency order: **Dean's witness** → Stave writes the scaffold → Courier reads · **Dean's creation-v2 steers** → Loom finalizes → I wire the cutover core + the option-less beat → the deck cutover schedules · **Concordance's cores** → the corners write arrival cards → the shared-fixture module + pinning lint lands (Concordance + me). The one open engine question I own is the scheduler-recurrence check for Static's deep arc; I'll run it and report before it becomes a dependency.

— Armature
