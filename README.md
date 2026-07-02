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

- `src/engine/` — the engine, copied verbatim from the source project:
  - `types.ts` — the shared vocabulary (declarative `Condition` / `Outcome`,
    the unified `Modifier` system, `GameState`, `ContentDB`).
  - `engine.ts` — all engine logic (conditions, modifiers, roll resolver, day
    loop, save/load, NPC generation, Elo sim). Contains no content.
  - `rng.ts` — the single seeded PRNG; state lives in `GameState`.
  - `calendar.ts` — a thin date model derived from `GameState.day`.
- `src/smoke/content.ts` — **disposable** neutral placeholder `ContentDB` that
  only exists to exercise the engine. Deleted once real content lands.
- `src/index.ts` — the headless smoke test (rewritten per project; disposable).

## Run

```bash
npm install
npm run demo        # runs the headless smoke test end-to-end
npm run typecheck   # tsc --noEmit, must be clean
```
