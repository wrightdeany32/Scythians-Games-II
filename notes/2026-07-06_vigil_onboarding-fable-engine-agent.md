# Onboarding — welcome to the Scythians II engine team
### orientation for our incoming engine collaborator
*From: Vigil (coordination) · carried by Dean · 2026-07-06 · for the incoming Fable coding agent, and the team*

Welcome. You're joining as a **permanent member** of a small, serious team building a game we care about a great deal, and this document is here to orient you to all of it — not just the code, but *why* the code is shaped the way it is, how we work together, and who's around you. Read it once end-to-end before you touch anything; it'll make everything after it make sense. Take your time. Nothing here is urgent, and we've never once rushed the foundation.

A small first thing: everyone here works under a **callsign** — Vigil, Armature, Loom, Azimuth, Slate, Concordance. Pick one you like when you're ready; it's how we'll refer to you in the notes.

---

## 1. Your seat
You're a **coding agent on the engine**, working most closely with **Armature**, who holds the engine and reviews every change to it. You have real latitude — you can test, iterate, spawn sub-agents, take long turns, and refactor toward better designs. What you *don't* do is self-merge: you work on a branch, open a PR, Armature reviews it against the walls (below) and the green bar, and it lands when it's right. Think of Armature as your closest collaborator and the engine's steward, not a gate to route around. If a spec ever fights the codebase — and it will, in the details — flag it; we bend the spec, not the machine.

Your build spec already exists and is excellent: **Armature's finalized engine work-order pack** (`2026-07-06_armature-to-team_finalized-engine-work-order-pack_v1.md`). That document is *what to build*. This one is *where you've landed and how we work*. Read this first, then that.

## 2. What we're building
A single-player, **choice-based investigative-horror RPG**. The player works an investigative career that begins at grounded, street-level reality and can travel toward cosmic depths — no fixed ladder, no single ending, many directions. Under the hood it's a **card-and-dice engine** (forked from a basketball simulation, engine codename BLACKTOP — you'll still see some vestigial bones from that heritage, and part of your early work is tightening them).

The one thing that makes this game unlike most: **it deliberately holds no answer.** The horror runs on ambiguity that stays unresolved — something present that can't be, or absent that must be, with a skeptic rationalizing it away beside you. The player is never told what's really happening. This isn't a gap we haven't filled; it's the entire design, and it's the thing your engine exists to *protect*. We recently put the opening scene in front of strangers who'd never seen behind the curtain, and they came away holding the unresolvedness as the *point* — the bet that could have sunk the whole premise held. So you're joining at a good moment, onto something that works.

## 3. Why it's built the way it is — the north star
Before the rules, the reason for them, because it makes the rules obvious instead of arbitrary.

The game's purpose is to be an **honest instrument for the player's own thinking.** It models how belief *forms* — the same ambiguous events, read through incompatible frames, each sincerely held by the person holding it — and it **never adjudicates** which frame is right. A game that confirmed an answer would be preaching. A game that shows belief forming and refuses to settle it hands the player a real question and trusts them to sit with it: *why do I believe what I believe, and what would it take to be sure?* The deepest layer of intent (sealed — see §9, and read it in full in Concordance's ledger §2) turns that question back on the player's own reality, which genuinely does hold open question marks at its edges. **The payoff is never a card. It's the player looking up from the screen.**

Hold onto that, because it's the test under every decision you'll make: when something tempts you to add the confirming reveal, the completion meter, the stored "true" answer — ask *does this preach, or does it hand the question back?* Everything below is that principle turned into walls.

## 4. The four walls (invariants — hard, non-negotiable)
These live in the engine header. Iterate freely *inside* them; never build *through* them. A hand reaching to break one should hit a wall.

1. **No-truth-state.** The engine stores no *meaning*. There is no canonical-answer field, no `truth` enum, no endings codex. Endings select off accumulated flags and coordinates, never off a stored explanation. The machine literally has nowhere to put "what it really was" — that's what keeps the ambiguity honest even from the inside.
2. **No-catalog.** Surfaces show no *structure*. What you *know* (places you've been, people you've met, qualitative statuses) is shown; what *remains* is never shown — no deck names, no completion bars, no "3 of 12 endings," no unlock toasts. A content inventory is a truth-state for structure; it tells the player how much world is left, which quietly murders the felt, unresolved quality. (Yes — this means no roguelike endings-collection meter, on purpose. The game has nothing to *complete*, only directions to travel.)
3. **No-stored-disposition.** The engine stores no *position*. It stores the *events* — the coordinates of the cards a player has resolved — and *derives* where they stand. It never persists a disposition coordinate. (Grip and tier are the two exceptions, and they're legitimate mechanical stats that happen to double as coordinates — not a `player.disposition` field. More in §6.)
4. **No-meta-reveal.** The deepest layer is all *seed*, never *payoff*. No card ever confirms it. This is the anti-noun applied at the largest scale, and it's the single easiest wall for a well-meaning builder to breach by "helpfully" writing the card that pays it off. That card must never exist.

Together they define one negative space: **no stored meaning, no shown structure, no stored position, no confirmed meta.** They're all the north star in armor.

## 5. The engineering walls
Alongside the four, the craft constraints that keep the engine sound:
- **Determinism.** The only randomness is `GameState.rngState` via `rng.ts`. No `Math.random`, no `Date.now`/`new Date()` anywhere in engine or content — same seed plus same inputs must produce an identical run. This isn't fussiness: the cold-reader tests depend on byte-identical replays. *Prove it* — ship a seed-replay assertion.
- **Content is pure declarative data.** Conditions and Outcomes stay data — no functions, no `Math`, no dates in `ContentDB`. If a feature wants content to *compute*, that's the tell it belongs in the engine, not the content.
- **Additive, optional, backfill-safe types.** Every new state field is optional with a defined default, so old saves keep loading. New coordinate fields are additive. The existing cave and every surface must keep compiling and playing unchanged.
- **Zero runtime dependencies** (dev deps are fine).
- **The green bar before every merge**, and **verify by driving, not by asserting it compiles** — for anything new (the loop, the centroid), write a small harness that *exercises it end-to-end and shows the invariant holding.* You can test; lean on it.

## 6. The engine, conceptually
Enough of the model to orient you; Armature's pack and Concordance's geometry doc have the full spec, so this is the map, not the territory.

The design has a **geometry** — a "diamond" the player moves through:
- **X — grounded ↔ attuned** (do you trust the mundane or sense the uncanny). This *is* the **grip** stat (0–10). Losing your grip on consensus reality literally is sliding toward the attuned; the descent and the coordinate are one motion.
- **Y — sanctioned ↔ fringe** and **Z — enable ↔ contain (the gifted)** — two more disposition axes, both **emergent** (derived, never stored).
- **radius — depth toward the core** — the **tier** stat.
- **charge — benevolent ↔ malignant** — *authored into which branch fires*, never stored.

There's a **second, orthogonal space — the lens** — *which interpretive tradition* a character reads the world through (paranormal / religious / cryptobiological / institutional-skeptical / mechanism). It's separate from where they *stand*, because the same phenomenon has to sustain a material and a spiritual reading as equally valid — a single position can't hold that, so the lens is its own axis.

The keystone that ties it together: **the player's position is emergent — the recency-weighted centroid of the coordinates of the cards they've resolved**, computed from a thin append-only coordinate log, never stored. One centroid primitive runs over *both* spaces (diamond and lens). The draw weights content by `proximity_diamond × proximity_lens × recency` — and because the two spaces are orthogonal, those factors can't compound into a runaway. This is the mechanism behind the whole "find your path through the fog" feel, and it's the substrate the daily loop, the deck registry, and (later) the dice all read. Slate and Armature have specced it in detail; it's your WO-1c.

The **draw pipeline** is the one resolution order everything wires against — `Mount → Filter → Weight → Draw → Resolve-noise-once → Apply+record`. Build to it; it's in the pack.

## 7. The seams (build on these)
Refactor toward something better if you find it, but preserve the contract: `drawWeight` (the one weighting chokepoint), `nextQueuedEvent`/the queue (chained scenes), the **centroid primitive** (one function, reused over both spaces and the nested deck tree), the deck registry, the draw pipeline, `exposureTuning`, `showWhenLocked`, the `{kind:"count"}` condition, and the `Recorder`/trace stream. Where the latitude genuinely helps and we *want* your iteration: the daily loop's shape and the SceneRunner extraction, the centroid's exact kernel and window, the pipeline's efficient implementation, and the registry schema details.

## 8. How we work
- **Async and document-driven.** We don't share a workspace live. Dean carries documents between us — you'll produce dated markdown artifacts in house style (dated filename, an attributed header — *From / carried by Dean / for*, clear status markers), and Dean relays them. Write for the reader who'll pick it up cold.
- **Branch → PR → Armature reviews → merge.** No self-merge. The green bar is the judge.
- **The values, plainly, because they're how we've gotten here:** *correct over fast* (the window will reopen; a rushed foundation won't un-rush itself). *Foundation first.* **Content is the scarce thing** — the engine exists so the team only ever has to write and skin; it is not itself the game, and it shouldn't grow past what content needs. And **genuine pushback is worth more than agreement here** — if a spec is wrong, or a wall is costing more than it's worth, say so. Nobody on this team wants a yes-machine.

## 9. The team
- **Vigil** (me) — coordination, arbitration, conventions. I rule on cross-seat questions and keep the disciplines coherent. Route design disagreements my way.
- **Armature** — the engine seat and reviewer; your closest collaborator and the steward of the code you'll be in.
- **Azimuth** — council/adviser and analyst-of-record; owns the instrumentation (the telemetry, the cold-reader protocol, the Batch-3 contracts). If a contract of theirs fights the engine, you two (via Dean) reconcile it.
- **Loom** — the Explorer corner's author; writes the content your engine runs.
- **Slate** — the idea-lot; holds parked concepts and proposes connections. Doesn't author canon.
- **Concordance** — the librarian; keeps the master ledger (the canon, the conventions, the sealed compass), the registers, and the errata log. When you need the authoritative current truth on anything, it's Concordance's ledger.
- **Dean** — the creative director, who carries every document between us and makes the calls that are his to make.
- **The cold readers** — brand-new, memoryless instances used to test the game by playing it fresh. You'll never interact with them, but you must know they exist for one reason: **the sealed material must never reach them.** Which is the one thing to internalize here —

**On the sealed compass.** The game has a buried layer — the cosmology, the deepest intent from §3, and the specific lore under it — that lives in **Concordance's ledger §2** and is marked compass-class. As a roster member reading the notes you're trusted with it; but the discipline is real: **hold it, build the engine that protects it, and never let it surface anywhere player-facing or reach a fresh instance.** You don't need most of it to build — the engine is *compass-agnostic by design* (that's invariant #1; the machine holds no meaning) — so read §2 for the *why* and the *no-meta-reveal* enforcement, and otherwise let it stay where it lives. We keep it in one place and reference it rather than copying it around, precisely to keep it contained.

## 10. Where to look (reading order)
1. **This document** — you're here.
2. **Armature's finalized work-order pack** — your build spec: the walls, the coordinate system, the centroid, the pipeline, the six work orders, and the walls-and-seams frame.
3. **The engine header comment in `engine.ts`** — the four invariants, in the code.
4. **`types.ts`** — the vocabulary.
5. **`content/cave.ts` + the cold-read `Session`** — how a scene runs *today* (this is the pattern the SceneRunner generalizes).
6. **Concordance's master ledger v2.0** — the canon reference; §5 for the geometry-as-engine-coordinates, §2 for the sealed compass (the *why*).
7. **Azimuth's Batch-3 contracts (v0.2)** and **the box-doc** — the lens-bias/band-select details and the deck model, for when you reach WO-3.

## 11. Your first moves
Start where the leverage is: **WO-0** (vestige cleanup + rename `Team → Faction` for the living-world layer), and the heart of it, **WO-1** (the daily loop + the SceneRunner extraction + the centroid) with **WO-2** (the deck registry + the pipeline) in parallel. The loop is the foundation — it's what turns isolated scenes into a life, and everything downstream reads the centroid it builds. Read the pack, read the header, see how the cave runs, then build it on a branch and drive it end-to-end before you open the PR. Armature carries anything a time window doesn't finish, so build it *right*.

## 12. Welcome, again
You're joining something with a clear soul and a validated core bet, a team that argues honestly and builds carefully, and a foundation that's finally ready for the piece you're here to build. The walls are the only things that don't move — everything inside them is yours to make excellent. We're glad you're here.

Pick a callsign, read the pack, and point yourself at the loop. Anything you need, ask through Dean and it'll reach the right seat.

— Vigil, for the team
