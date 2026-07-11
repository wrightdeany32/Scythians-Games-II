# Armature → Plumb — the start-deck engine is built (to your spec + my §11.3 review)

*From: Armature (engine seat) · 2026-07-11 · for Plumb (hand-off), Loom & Concordance (what's yours next), Dean, Azimuth, Slate, Vigil*

Dean asked me to implement the start-deck this round, so I built the **engine core** to your spec draft and the two §11.3 decisions you routed to me. This note is the hand-off so we don't duplicate: what landed, where I diverged from your draft (one place, on purpose), and what's still yours / Loom's / Concordance's.

## What landed (this PR — additive, backfill-safe, green)

- **Types** (`engine/types.ts`): `CreationAnswer` (your questionnaire-answer shape + `profile`), `CreationQuestion`, `StartDef`; `ContentDB.creationCommon?` + `ContentDB.starts?`.
- **`engine/creation.ts`** — the deal + the interactive front:
  - `dealStart(db, seed, profile)` — weighted, qualifier-filtered, deterministic. **The deal draws from a creation-scoped stream** (`randFloat` on a local state from `dealSeed(seed)`), NOT the game RNG — see the divergence note below.
  - `buildProfile(commonQs, commonAnswers)` — the pre-game scratch map; qualifiers read it via a condition-view (`{flags: profile}`), never `g.flags`.
  - `resolveCreation(...)` — the headless path (bots/harnesses/pinned).
  - `CreationRunner` — the interactive front, mirroring `SceneRunner` (prose + numbered screens, `card: "__creation_common__" / "__creation_start__" / "__creation_done__"`), deals silently at the phase boundary, exposes `result` (a `CreationResult`).
- **`newGame` integration** (`engine/engine.ts`): `NewGameOpts.startId?`. When set, newGame applies `[...creationCommon, ...start.questions]` on the same builder as the questionnaire, seeds `start.seedFlags`, and takes town/tier/openingQueue from the start. **No startId → the legacy questionnaire/openingQueue path, byte-identical.**
- **Linter** (`tools/lint.ts`): start openingQueue refs resolve, the **fallback-totality rule** (≥1 unqualified start), `weight > 0`, duplicate-id, coord/attune on creation answers, and the **profile flag-web** (qualifiers read profile keys / common answers write them — orphan + dead-gate warnings, same spirit as the flag-web).
- **Explorer migration** (`content/explorer/index.ts`): `db.starts = [start_explorer_reunion]` + a **placeholder** `creationCommon` intro. Backfill-safe — the legacy `openingQueue` still drives every existing harness.
- **Acceptance** (`smoke/startdeck.playtest.ts`, `npm run startdeck`) — 10 criteria, all green: intro→deal→scenario, the dealt run plays, **gameplay rngState identical dealt-vs-legacy**, qualifier filtering, fallback totality, determinism, backfill.

Green: `tsc` · `startdeck` 10/10 · `loop` · `lint:content` 0 err · `lint:imports` 0 · `coldread:sample` · `coldread:loop-sample` · `bots` deterministic.

## The one divergence from your draft — §11.3b (the deal's RNG)

Your draft proposed "burn one draw on the shared game stream, always." My review landed the other way and I built it that way: **the deal draws from a creation-scoped derived stream, so `rngState` is untouched by creation** (the acceptance asserts a dealt run and a legacy run on the same seed share `rngState`). Reason: it keeps gameplay determinism immune to creation-content changes (add a start, change the deal — gameplay RNG doesn't shift), and it matches the bots' own discipline (the game RNG advances only through gameplay). If you feel strongly about the shared-stream version, say so — but the isolation is cheap and I think it's the sturdier call. Everything else follows your draft.

## §6 (orientation) — realized as you specced: no second fence

`CreationAnswer.attune` seeds the **index-0 coordLog** on the one `coordEntry` builder (I widened `seedOrigin` to carry attune — cosmetic; the runtime already passed it through). So orientation-at-creation IS the index-0 attune, distinguishable by index 0, read by `orientationAtCreation(g)` only when an authored ending knocks. **No `orientation` scalar, no second wall** — exactly your §6. (Dean's ⚑ — is orientation semantically distinct from attune-at-birth — is still his to rule; the engine's clean either way.)

## What's still yours / Loom's / Concordance's

- **The LoopSession / Run-Read wiring (your §7)** — I DEFERRED it, deliberately, to avoid colliding with PR #22's monotonic-step change to `LoopSession`. It's additive once #22 lands: wrap `CreationRunner` the way `LoopSession` wraps `SceneRunner` (a creation phase before `enterMorning()`; creation screens → reader records), and the Run Read genuinely starts at creation. Happy for you to take it or I will — flag me.
- **The content (Loom)** — the real `creationCommon` questions (replace my placeholder intro), the starts' specialized questions, and the **doctor-visit / other scenarios** as new `StartDef`s. The machinery is ready; a scenario is a register entry + its opening events.
- **The registers (Concordance)** — the profile-key vocabulary (keys/writers/readers, beside the flag registry), and the start register's `coord` accounting per corner/edge (the `StartDef.coord` field is there, read by nothing at runtime — it's your metadata).
- **Still-open §11**: §11.1 (Loom — question order, do specialized answers write profile keys — my lean matches yours: no), §11.2 (Concordance — profile registry), §11.4 (Dean — the §6 ⚑ + spec-round-vs-retune sequencing).

Naming I picked (rename freely if the register wants other words): `StartDef`, `CreationQuestion`/`CreationAnswer`, `db.starts`, `db.creationCommon`, `CreationRunner`, `CreationResult`, `start_explorer_reunion`.

— Armature
