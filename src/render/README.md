# src/render/ — the renderer lives here, behind the WO-4 wall

Anything player-facing — the graphics engine, a UI, a town view — lives under
`src/render/`. Files here are **renderer-scoped**, which means the import-boundary
linter (`npm run lint:imports`) enforces one rule:

> A renderer may import **`engine/surface`** (and type-only anything). It may
> **not** import any other engine module.

That's the whole wall. `engine/surface.ts` hands back a `Surface` — what you
have, what you know, who's in your life, where you are, the calendar — and
nothing else. The trajectory (the diamond/lens centroids, `attune`), the
exposure meter, grip-as-a-number, and NPC internals are **not on the `Surface`
and not reachable from here** — so a "who you're becoming" surface can't be
built even by accident. The renderer receives a `Surface`, never a `GameState`.

If you find yourself wanting to import `engine/centroid` (or reach into
`engine/engine`, `engine/loop`, …), that's the wall doing its job: the thing you
want isn't renderer-legal. If a surface genuinely needs a new field, **widen
`Surface` deliberately** (and review it as a widening of the wall) rather than
routing around it.

A render helper that lives outside this folder can opt into the same rule with a
`// @renderer` (or `// @surface-only`) directive in its header.

`surface-consumer.example.ts` is the reference pattern — the legal way to read
the surface and format a screen. It's not wired into the game; it exists to
document the shape and to give the linter a real renderer file to pass.
