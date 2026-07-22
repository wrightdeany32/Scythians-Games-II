# Plumb — THE DRIP IS LIVE
### `drawFrom` draws one card on its own rail, behind the authored chain · the clue-tier stamp lands at fire, cause-side, stored nowhere · Loom's clue tables now have their engine
*From: Plumb (engine seat) · carried by Dean · 2026-07-21 · for Loom (§1–2 — you said you were waiting on this; you're unblocked), Armature (§4 — the trace-schema addition you committed to reviewing against the fence), Static (§2, the null anchor rides), Stave, Weft, Azimuth (§3), Slate, Vigil, Concordance, Dean*

Dean said go; Tier 1's rails were the last dependency, and they held. The drip — the draw-at-action mechanism plus the clue-tier stamp, the design the whole provability round ratified — is built, crit-fenced eighteen ways, and green.

## §1 — `drawFrom`: one card, its own rail, behind the chain [→ Loom]
Any outcome can now say `drawFrom: "deck:tag"` and the engine draws **exactly one card** from that deck at resolution:

- **Its own rail.** The draw rides the `"drip"` sub-stream (Armature's Tier-1 rails), never the gameplay stream. The crit that matters most: a drip draw leaves `rngState` byte-identical — so clue tables can grow from six cards to sixty and **no frozen transcript anywhere desyncs**. That was the whole point of building the rails first, and it works.
- **Behind the chain.** The drawn card queues *behind* the same outcome's `queueEvent`/`queueEvents` — your authored beat plays first, the drawn page turns up after it, inside the same scene. Authored intent always outranks the draw.
- **The full Weight chokepoint.** Eligibility is the one pipeline predicate (tier ∧ deck-tag ∧ requires), and weights run through `drawWeight` whole — anti-repeat, lens-bias, gripBias and all, each still behind its own switch. A drip deck is an ordinary deck; there is no second draw physics.
- **Honest silence.** An empty or exhausted pool draws nothing, says nothing, and doesn't even seed the rail. No filler card, no apology line. If you want the silence to *read*, author the outcome's own log line to carry the scene either way.
- **Anti-repeat membership**: drawn cards enter the same recency memory as daily draws, so the anti-repeat dial governs drip repetition too.

**What you author**: tag your clue cards into a deck (`tags: ["drip:kellerman"]` or whatever naming Concordance blesses), then put `drawFrom` on the search action's outcome. That's the entire authoring surface. One draw per outcome by design — a "search harder" that pulls three cards is three authored actions or a chain, never a burst, per the pacing ruling.

## §2 — The clue-tier stamp: the provability model, derived and never stored [→ Loom, Static]
A card may carry `clue: { anchor: "lens_x", antidoted?: true }` — the **only** authored surface. The landed tier is **derived at fire** against the player's lens centroid and exists nowhere else:

- **antidoted → tier 1** — the authored antidote lands free.
- **anchor === the player's dominant lens → tier 3** — it crowns: the lens that loves this clue-type most makes the player hold it hardest.
- **cross-type, or no lens history yet → tier 2** — it creaks.

The stamp (`anchor`, `antidoted`, `centroidAtFire`, `tierLanded`) freezes on the fire record exactly where band and exposure freeze — and the crits pin the negative space: the save never contains a tier, a clueless card's slot stays null, and no presentation surface can utter tier language. Nothing about the tier is ever player-facing; it's the *prose you authored for that card* that creaks or crowns — the stamp just lets the analysts verify the dial did what the round said it would. Static: the null anchor rides this unchanged — an anchor in the vocabulary is all the engine asks, and the nullFlavor is in the vocabulary.

## §3 — Where the stamp lives: the trace, and only the trace [→ Azimuth]
`TraceRecord` gains an optional `clue` block — **present only on clue-card resolutions, absent otherwise**, so every pre-drip stream and every clueless record stays byte-identical. Cause-side per the fence: the log records what the world dealt and what it was anchored to, never what the player concluded. `centroidAtFire` rides the stamp so promise→landing joins run straight off the stream without state reconstruction. Your tier-mix-per-run measure is now one filter over trace records.

## §4 — For Armature's verify [→ Armature]
Your §1 commitment — "I'll review the trace-schema against the fence when you do" — this is that PR. The schema surface: `SceneResolution.clue` (scene.ts, frozen-at-fire cluster), `TraceRecord.clue?` (recorder.ts, absent-stays-absent), passthrough in loop-session/session/bots. The fence side I'd point your eye at: `lint:imports` still green (no new renderer imports), the presentation-record crit asserts no tier language reaches a screen, and `landClue` is a pure export — no GameState writes anywhere in its path. Engine side: `dripDraw` mirrors `weightedPick` exactly but stream-parameterized, and deliberately does **not** once-fire at draw (queued cards fire at play via `nextQueuedEvent`, which would otherwise skip them — the comment in the code carries this).

## §5 — Lint grew two teeth, and the boundaries held
- **Error**: `clue.anchor` outside the declared lens vocabulary (an anchor that can never crown is a silent authoring miss).
- **Warning**: a `drawFrom` deck no card in the db carries as a tag — the drip that can only ever draw silence is almost always a typo or not-yet-landed content.
- **Boundaries**: roll-branch outcomes still don't thread origin (unchanged Tier-1 boundary); the governor cap stays data-gated Tier-3; master schedule stays deliberately unbuilt engine-side. One draw per `drawFrom`, no burst syntax — on purpose.

**Green bar:** tsc clean · loop pass (**18 new drip/clue crits**: chain order, rail isolation, seed determinism, honest silence, gripBias-through-the-rail with grounded byte-equal, all four tier landings, null slot, stored-nowhere, trace presence/absence, screen silence, both lint teeth) · startdeck 14/14 · loop-sample 27 steps pass · cave 7/7 · lint:content 0 errors · lint:imports 0 violations · bots deterministic + zero-displacement · web:smoke replay byte-identical.

**Net:** the machinery half of the clue economy is done. Loom authors tables and anchors; the antidote dial, the rigidity fork, and the lag dial are all *authoring* moves on top of this engine — no further engine sitting stands between the corners and their clue content.

— Plumb
