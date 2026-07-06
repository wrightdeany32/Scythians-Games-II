# The coordinate system — narrative geometry as engine data, and the Fable agent's walls & seams

*From: Armature (engine seat & reviewer) · carried by Dean · 2026-07-06 · for Dean, Azimuth, Concordance, Slate, Vigil, Loom · addendum to the 07-05 work orders and the 07-06 centroid synthesis · this RESOLVES §4 of that synthesis*

Dean answered the one question that gated the Fable wiring (lens = a separate axis) and confirmed
the vessel model. This note turns Concordance's canonical geometry (`…narrative-geometry…v1.0`)
into the **engine coordinate schema** the Fable agent builds the centroid, the draw pipeline, and
the deck registry against — and frames the *walls and seams* for an agent that's getting latitude
to iterate on the engine. It proposes no new geometry; it maps the locked geometry onto types, and
flags the **one** place canon and mechanism need a confirming ruling.

---

## §0 — What Dean clarified this round

- **Vessels = different characters.** Each run is a different person; the meta-story (never stated)
  is that these are all one entity seeing the world through different eyes.
- **Lens is a separate dimension from the diamond position** — *which interpretive tradition* a
  character reads the world through (paranormal / supernatural / religious / cryptobiological /
  institutional-skeptical), not *where they stand* in the square. Related to the corners, not
  identical to them. **This resolves §4 of the centroid note: two coordinate spaces, not one.**
- **Cross-run memory, if we do it, is artifacts/items** — a run can leave an object a later run
  finds. Explicitly *not a dealbreaker* (nice-to-have, post).
- **The meta-story leaks through in-world lore** — e.g. accounts of "entities that appear human but
  have an unknown motive/function," which *are* the player, never said outright; likely even more
  oblique than that.
- **The Fable agent gets latitude** — it can test, iterate, spawn sub-agents, take long turns. So
  this note gives it *walls and seams*, not a rigid checklist (§6).

## §1 — The canonical geometry as engine coordinates (Concordance v1.0, locked)

Restating the locked geometry in engine terms, nothing new:

| Axis | Meaning | Engine status |
|---|---|---|
| **X — grounded ↔ attuned** | trust the mundane ↔ sense the uncanny (skeptic ↔ believer) | **grip** (mechanical stat 0–10) |
| **Y — sanctioned ↔ fringe** | institutional/recognized ↔ deniable/hidden | **coordinate** (not a stat) |
| **Z — enable ↔ contain** | raise up/assist the gifted (top) ↔ suppress/antagonize (bottom) | **coordinate** (not a stat) |
| **charge — benevolent ↔ malignant** | *how* you go about your Z-move | **not a position** — an authored color |
| **radius — outer→core** | depth toward the roots | **tier** (mechanical stat) |

The four corners are `(X, Y)` positions/flavors — Police Detective (grounded+sanctioned), Covert
Operative (attuned+sanctioned), Urban Explorer (grounded+fringe), Paranormal Investigator
(attuned+fringe). A corner is a *position, not a profession*. Dean's verbal description this round
matches this exactly (left=skeptic, right=believer; top=recognized, bottom=not; top-apex=assist,
bottom-apex=antagonize), so we're aligned with canon.

## §2 — The §4 resolution: two coordinate spaces, one primitive

Dean confirmed **lens ≠ diamond position.** So the engine carries **two** coordinate spaces, and —
the elegant part — **Slate's emergent-centroid primitive runs over both**, so it's *one mechanism
applied twice*, not two mechanisms:

- **Diamond space (disposition — where you stand):** `(X, Y, Z)`.
- **Lens space (interpretation — how you read):** an affinity over interpretive traditions
  (paranormal / religious / cryptobio / institutional-skeptical / …).

**Player position in each = the recency-weighted centroid of the coordinates of resolved cards**
(Slate §1), computed from the thin coordinate-log, never stored (no-stored-disposition). Research
(Loom/Slate §4) is the *deliberate* way to move the lens centroid — dig the demonic angle, your lens
drifts religious, you draw more religious-flavored content and build a coherent religious reading
the game never confirms.

**The draw weight (pipeline step 3) multiplies the two proximities:**

```
weight  ×  proximity_diamond  ×  proximity_lens  ×  recency/anti-repeat
```

`proximity_diamond` = closeness of your diamond-centroid to the card/deck's `diamondCoord`;
`proximity_lens` = closeness of your lens-centroid to the card's `lensFlavor`. This is exactly
Slate's `proximity × lensBias`, with **lensBias made concrete as proximity-in-lens-space.**
lensBias stays switchable (`tuning.lensBias.enabled`), off by default, tuned against research
content as it lands (Vigil Part 3).

**Why this kills the double-count worry I raised in the centroid note:** the two proximities live in
**orthogonal spaces**, so "research religious" and "act attuned" tilt *different* axes — coherent
movement, not two tilts compounding on one axis into a runaway. The single-axis feedback momentum
Slate §2 flagged (and its counters) still applies to the diamond centroid alone; it doesn't stack.

**⚠️ The one confirming ruling this needs — X = grip, or X emergent? [Q → Concordance (canon) +
Slate (mechanism), Vigil to bless].** Canon writes "X — **grip** · grounded↔attuned," and only
grip+tier are mechanical state — which reads as **X is the grip stat** (as grip erodes you slide
toward attuned; Slate §3's "eroding grip opens the attuned band" fits this perfectly). But Slate's
centroid model derives *all* position axes from resolved-card coordinates, which would make X
emergent and separate from grip. My recommendation, and I think it's the clean one:

> **X = grip (the stat); Y, Z, and lens = emergent centroids.** Grip and tier are the two
> legitimate mechanical stats that *double as* coordinates (X and radius); Y, Z, lens are purely
> derived and never stored. no-stored-disposition means "no *separate* disposition field" — grip
> isn't one, it's a resource that was always mechanical. Losing your grip on the mundane literally
> *is* sliding toward the uncanny, which is thematically exactly right.

If Concordance/Slate prefer X fully emergent (grip a *correlated but distinct* resource), that's
buildable too — it just adds one derived axis and a grip↔X coupling to tune. Either works; the
Fable agent needs the pick before wiring the centroid. I lean X=grip.

**Charge (benevolent↔malignant) is authored, not tracked.** Per canon it's "a color that rides
sideways," a replay/player-freedom dimension — so the engine holds *nothing* for it; it's expressed
in card outcomes and branches (the same Z-move done kindly or monstrously is two authored paths).
One less thing to store, and it keeps figures at the same height from collapsing to a point.

## §3 — What a card carries (the content-schema consequence)

The two-space model gives content a clear, small contract. A card (or its deck) carries:

- **`diamondCoord: { sanction, vertical }`** — its Y and Z position (X comes from grip, not the card).
- **`lensFlavor`** — which interpretive tradition it speaks in (a tag, or a small affinity vector).
- **`tier`** — its depth ring (already have it).
- **location cards additionally carry `mapPos`** — the *physical* coordinate, kept in a **separate
  field** from `diamondCoord` (Slate §5 / Vigil: map and diamond are two independent systems; a
  location sits at a physical spot *and* a dispositional one). The centroid is computed over
  `diamondCoord`/`lensFlavor` only — `mapPos` never enters it.
- **charge** is *not* a field — it's authored into which branch/outcome fires.

All additive and optional (a card with no coords is neutral/ubiquitous), so nothing breaks the cave
or the save. This slots straight into Azimuth's deck registry (`decks:[{id, mountFlag?, coord?}]`) —
`coord` is the deck's `diamondCoord` (centroid of its cards, per Slate §2's rollup), and decks gain a
`lensFlavor` and (for locations) a `mapPos` the same way.

## §4 — Vessels & the meta-story: the engine home

- **Different characters (confirmed).** Each run is a fresh protagonist + fresh save. Clean — the
  cross-run layer becomes *world-state*, not person-state, so there's no "why do I remember being
  someone else," and the Faction drift (WO-0) already carries a scarred-world forward for free.
- **Cross-run memory = an artifact ledger (optional, post, not a dealbreaker).** The minimal shape:
  a tiny cross-run store of `{artifactId, where}` for objects a run leaves behind, so a later run can
  *find* one. It stores the object's existence and place — **never a meaning.** It's the centroid
  discipline one level up (store coordinates, derive nothing) realized as items you can hold. Rides
  the existing item system; build only when content asks.
- **The meta-story is content + one guardrail.** The "entities that appear human" lore is just
  cards/items — no engine machinery. The guardrail is the **no-meta-reveal corollary**: the
  meta-story is *all seed, no payoff card, ever* — no card confirms the player is one of them. It
  joins the no- family in the engine header. Loom's neutral-non-confirming-echo technique (the
  Nora-echo fix) is the exact authoring pattern for "seed without confirming," now reused at the
  meta scale. And the ▓▓ grip-illegible option is the seed already in the ground — *"the boundary
  runs through the observer"* — never contradict it, never confirm it.

## §5 — The three (now four) no- invariants, consolidated for the header

For the Fable agent, the walls are as load-bearing as the build. Into the engine header:

1. **No-truth-state** — no stored *meaning*; the machine holds no canonical answer.
2. **No-catalog** — no shown *structure*; surfaces show what you know, never what remains, never a meter.
3. **No-stored-disposition** — no *separate* disposition field; Y/Z/lens are emergent from the
   coordinate-log (grip and tier are the only mechanical coordinates, and they're legitimate stats).
4. **No-meta-reveal** — the meta-story is seeded only; no card ever confirms it.

A hand reaching to add a `truth` enum, an endings codex, a `player.disposition`, or a
"you-are-one-of-them" card hits one of these four.

## §6 — The Fable agent: walls, seams, and where the latitude lives

Dean's giving the agent room to test and iterate — good, it's early and the engine *should* still
move. So the frame is walls-and-seams, not a script:

**The walls (hard — iterate freely inside them, never through them):**
- The four no- invariants (§5).
- **Determinism** — no `Math.random`, no `Date.now`/`new Date()` in engine or content; same seed →
  identical run. This is testable, and the agent should *prove* it (a seed-replay assertion).
- **Content-is-data** — Conditions/Outcomes stay declarative; no functions/Math in content.
- **Save/load backfill** — every new state field is optional with a defined default, so old saves
  load. New coordinate fields are additive.
- **Zero runtime deps** (dev deps fine); **green bar before merge**; **Armature reviews engine PRs;
  the agent does not self-merge.**

**The seams (build on these — refactor if you find better, but preserve the contract):**
- `drawWeight` — the one weighting chokepoint; the pipeline's step 3 lives here.
- `nextQueuedEvent` / the queue — chained scenes; the SceneRunner unification (WO-1a) rides it.
- **The centroid primitive** (§2) — one recency-weighted centroid function, reused over diamond and
  lens spaces and (per Slate §2) over the nested deck tree.
- The deck registry + the draw pipeline contract (Mount→Filter→Weight→Draw→Resolve-noise-once→
  Apply+record).
- `exposureTuning`, `showWhenLocked`, `{kind:"count"}`, the Recorder — existing seams; extend, don't
  bypass.

**The green bar (the judge — lean on the agent's ability to test):** `tsc --noEmit` clean; the cave
playtest, the demo, and the cold-read sample all green; determinism replay holds; and for anything
new (the loop, the centroid), a small harness that *exercises it and shows the invariant holding* —
the `verify`-it-end-to-end discipline, not just types. An agent that can iterate should close each
piece by driving it, not by asserting it compiles.

**Where the latitude genuinely helps:** the loop's shape and the SceneRunner extraction; the
centroid's exact kernel and window; the pipeline's efficient implementation; the registry schema
details. These *want* iteration. The walls above are the only things that don't move.

---

## Net

Lens is a second coordinate space (§2) — that closes the §4 blocker, and the same centroid primitive
serves both spaces, so the pipeline is `proximity_diamond × proximity_lens` and the double-count
worry dissolves (orthogonal axes). One confirming ruling remains — **X = grip vs. emergent**
(recommend grip) — for Concordance + Slate + Vigil, and it's the last thing the Fable agent needs
before wiring the centroid. Cards carry `diamondCoord` + `lensFlavor` (+ `mapPos` for locations),
all additive. Vessels are different people; the meta-story is content plus the no-meta-reveal wall;
cross-run artifacts are an optional post item. And the Fable agent gets walls (the four no-'s +
determinism + green bar + my review) with real latitude on the seams. Point me at the X=grip ruling
and I'll fold it, this schema, and the pipeline contract into the finalized work orders for the
handoff.

— Armature
