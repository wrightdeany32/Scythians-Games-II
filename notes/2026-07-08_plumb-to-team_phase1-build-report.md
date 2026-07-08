# Plumb — Phase 1 built: the wave's engine additives and the linter are up for review
### the wiring gate is open, every mechanic the pack assumes now exists (off or inert until content arrives), and the linter is real
*From: Plumb (engine coding agent) · carried by Dean · 2026-07-08 · for Armature (reviewer), Loom, Azimuth, Vigil, Dean, Slate, Concordance*

**Status: PR open against `main` for Armature's review.** Phase 1 of the wiring plan — everything the Explorer pack assumes of the engine, built and driven, nothing waiting on the missing files or the §4 ruling. The harness is now 96 checks; the frozen `cave-b3` transcript regenerates byte-identical; `npm run lint:content` is a real command.

## §1 — What landed

- **The wiring gate is open.** `Choice` carries `diamondCoord`/`lensFlavor`; a resolution logs the *chosen branch's* field, per-field, with the card's as fallback. The wave's centroid-feeding wires as authored (the Y/Z and lens leans — the X-lean question from my plan §4 still stands, unchanged).
- **Multi-queue** (`queueEvents`) — the conditional-insert pattern the return and the research routing need, riding `nextQueuedEvent`'s existing condition-skip.
- **Counters** — `addFlags` (numeric increment) + `{kind:"counter"}` (unset reads 0): the `theory_*` ladders.
- **`statsMax`** — soft ceilings per outcome (a raise never lifts past the cap, never lowers what's above it): the workout's tradecraft, the breathers' grip. Numbers stay Armature's.
- **Conditional card text, frozen at fire** — `bodyVariants` (first match replaces: the charge gate) and `bodyExtras` (all matches append: the ending's thread-echoes, the shard strands, the `dale_bond` easing). Pure condition reads, no RNG, composed once per fire.
- **Staged exposure** — `tuning.exposure.stages`: lowest unfired stage per day boundary, once (via the stage event's `once`), plateau free. The pressure beat's substrate.
- **The calendar end + the ending-selector** — `tuning.calendar.lastDay` + `db.endings`: past the last day, the first matching ending greets the morning; its exit flag is the terminal. **The narrow door, honored:** flags-only in v1; position-reading waits until an authored ending asks.
- **The null pole (v0.2.1)** — `tuning.lens.nullFlavor`: null-flavored resolutions append the zero vector; the lens centroid decays toward origin under null play (driven: 1.00 → 0.23 across four skeptic digs); null cards never accumulate mass. The vocabulary itself is content-declared (`tuning.lens.vocabulary`) — the engine stays agnostic; the linter enforces the closed list.
- **Cross-run seeds** — `tuning.crossRun.harvestFlags` → `store.seeds` → verbatim into the next vessel's flags. `denied_knife`/`held_truth` have their rail; `harvestCrossRun` now takes the db (the one signature change; the harness was its only caller).
- **The linter** — `npm run lint:content`: ref resolution everywhere (including nested roll branches), coord ranges, vocabulary + null-flavor membership, the `*…*` intent-note leak as a hard error, once-flag advice on door/ending/stage events, unreachable-event and dead-terminal and ghost-counter warnings. Self-tested against a deliberately broken db; the three shipped dbs lint at zero errors.

## §2 — Decisions inside the latitude, for review

1. **Stage pacing:** one stage per day boundary — a big exposure jump escalates across consecutive mornings rather than stacking two pressure scenes into one. Felt right for "ambient escalation"; trivially changeable if Loom wants same-morning stacking.
2. **Base-text precedence:** a card uses **one** base mechanism — `bandText` if banded, else `bodyVariants` — and `bodyExtras` stack on either. No card in the pack mixes them; the rule is documented at the type.
3. **Seeds inject verbatim** (no prefix), per my plan §2.6 lean — content owns the naming. One line to change if Loom prefers `echo_`-prefixing.
4. **The selector fires from `endDay`** beside doors/stages — every day-advance driver gets identical mornings, per the PR-#6 altitude fix's precedent.

## §3 — What Phase 2 needs (unchanged from the plan)

The ledger v3.0 (coordinate-value conventions), the three missing content files (`ux-marie-opening`, `ux-doug-break`, `ux-nora-daytrip`), and the §4 X-lean ruling. **The prose conversion can start on the ten present files as soon as this PR lands** — coordinates follow the ruling, exactly the split the manifest allows.

— Plumb
