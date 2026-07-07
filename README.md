# Scythians Games II — engine

A theme-agnostic RPG/card/dice life-sim engine, forked clean from the
"Hoop World" project. This repo is **engine + a neutral smoke test only** — no
game content yet. Content (the actual game) is authored from scratch against a
design spec.

- **Pure TypeScript, zero runtime dependencies.** Dev deps are only `tsx` and
  `typescript`.
- **The engine is plumbing; content is pure declarative data** — no functions,
  no `Math.*` in content. Writing content never edits engine code.

## Layout

- `src/engine/` — the engine (the four invariants live in `engine.ts`'s header):
  - `types.ts` — the shared vocabulary (declarative `Condition` / `Outcome`,
    the unified `Modifier` system, `GameState`, `ContentDB`, the coordinate
    types, the cross-run store).
  - `engine.ts` — core engine logic (conditions, modifiers, roll resolver,
    events + the draw pipeline and deck registry, save/load, the coordinate
    log, NPC generation, faction-power drift). Contains no content.
  - `scene.ts` — the `SceneRunner`: the one scene model every consumer drives
    (cold reads, the daily loop, creation-as-turn-zero). Recorder-agnostic;
    telemetry hangs off its hooks.
  - `centroid.ts` — the emergent-position keystone: one weighted-centroid
    primitive serving `dispositionCentroid` (diamond), `lensCentroid` (lens
    affinity distribution), and `deckCentroid` (the deck-tree rollup).
  - `loop.ts` — the daily loop: `dayMenu` / `runAction` / `advanceDay` /
    `runStatus`, met-doors, and the designed terminal states.
  - `rng.ts` — the single seeded PRNG; state lives in `GameState`.
  - `calendar.ts` — a thin date model derived from `GameState.day`.
- `src/coldread/` — the cold-reader hardware: `Session` (a thin Recorder
  wrapper over the SceneRunner), the typed record stream, the operator
  console/relay, and the transcript renderer. Transcripts land in `coldreads/`.
- `src/content/` — real game content: the Cave scene (`cave.ts`), its
  standalone db (`cave.db.ts`), and its playtest.
- `src/smoke/` — **disposable** neutral placeholder content + harnesses
  (`content.ts` for the engine demo, `loopworld.ts` + `loop.playtest.ts` for
  the daily-loop acceptance). Deleted as real content replaces them.
- `src/index.ts` — the headless smoke test (rewritten per project; disposable).

## Run

```bash
npm install
npm run demo             # the headless engine smoke test, end-to-end
npm run loop             # the daily-loop / centroid / registry acceptance harness
npm run playtest:cave    # the Cave scene's scripted assertions (both routes)
npm run coldread:sample  # the cold-read acceptance criteria + sample transcript
npm run typecheck        # tsc --noEmit, must be clean
```
