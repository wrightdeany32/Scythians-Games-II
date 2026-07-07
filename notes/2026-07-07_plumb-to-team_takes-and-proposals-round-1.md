# Plumb — takes and proposals, round 1: what the build taught me, what I'd add, and what I'd take away
### the engine seat's first design note: three felt dynamics that fall out of the math, three cheap instruments I'm offering to build, four questions to settle before they gate anyone, and a short subtraction list
*From: Plumb (engine coding agent) · carried by Dean · 2026-07-07 · for Dean, Vigil, Armature, Azimuth, Loom, Slate, Concordance*

**Where this comes from.** WO-0 through WO-3 are merged and green. This note is not a build report — those exist — it's what having my hands inside the machine for a full push taught me about the *design*, plus concrete offers and honest pushback. Everything here is input, not assertion; Vigil arbitrates, Dean decides, and the spec wins until ruled otherwise.

---

## §1 — Three properties the math already has, worth designing WITH

These aren't proposals. They're behaviors that *fall out* of the ratified mechanics as built, and the content seats should know they're holding them.

**1.1 · Uniform aging never moves the centroid — so a quiet week is genuinely quiet.** The recency kernel is exponential over the resolution clock, which has a clean consequence: when a player resolves only neutral cards (errands, rest, mundane days), every logged coordinate ages by the same amount, all weights scale by the same factor, and the derived position *does not move at all*. Mundane play doesn't drift you anywhere — it can't. The player's position holds perfectly still through ordinary life. That is exactly the right feel for this game, and nobody had to author it.

**1.2 · …which means the first strange thing after a quiet stretch pulls HARD ("the quiet-week snap").** The flip side: after a long neutral stretch, the old coordinates are heavily decayed, so the *next* coordinated card lands with enormous relative weight — the centroid can jump most of the way to it in one resolution. Read thematically: the longer nothing has happened to you, the harder the next uncanny thing hits. I think this is a *feature* — it's dread mechanics: the quiet week is load-bearing — but it's also the sharpest edge in the tuning space (one card can nearly teleport a position that took twenty cards to build). I'm naming it so it gets watched deliberately in the first tuning pass instead of discovered by a confused analyst. If it ever needs softening, the fix is a per-step displacement cap in the derivation — one function, no schema change, no stored state. **→ Loom/Slate to hold; Azimuth to watch in the bot runs.**

**1.3 · The fate-dial is already one function swap away.** Because the window is a single knob read in one place, Loom's shallow-free-will/deep-fated dial is literally `window(g)` replacing `window` — no restructuring, whenever it earns its tuning slot. The groundwork is done by construction; nobody should budget work for it.

## §2 — Three instruments I'm offering to build (cheap, in-lane, and they serve the discipline we already ratified)

The next phase's real risk isn't missing features — it's flipping switches by feel. All three of these serve *measure-don't-guess*, and none grows the game-facing engine an inch. Say go on any subset.

**2.1 · The content linter (`npm run lint:content`).** A harness that walks any ContentDB and flags, mechanically: event-id references that don't resolve (queueEvent, onFull, scheduleEvent, openingQueue, doors, exposure's consequenceEvent); deck tags carried by no registered deck and decks whose id matches no card; coordinates outside [−1, 1]; `lensFlavor`s outside the canon vocabulary (passed in as a list — the engine stays agnostic, the *linter* enforces Concordance + Loom's closed list); chained-scene cards where some branch dead-ends without either queueing or exiting; band variants whose keys aren't real bands. Every one of those is an authoring accident that currently surfaces only when a playthrough — or worse, a cold reader — trips over it. Loom is about to author the return trip, loop scenes, and research decks *fast*; this is the net under that work, and it's a day of engine-adjacent work at most. **This is the one I'd greenlight first.**

**2.2 · The bot A/B driver.** A headless policy-bot that plays N days through the real loop (dayMenu → runAction/scene → advanceDay) emitting the standard trace, run as *seed-matched pairs* with exactly one switch flipped. This is the instrument the whole switch architecture was designed for — every factor ships off *specifically so* this tool can isolate each one's drift — and the substrate is already there: the loop runs headless, the SceneRunner takes hooks, `mode:"bot"` traces exist. Without it, the first tuning pass will be vibes; with it, Azimuth gets draw-momentum numbers, register-coverage deltas (the 10–20% target is *testable*), and the double-coupling budget gets measured instead of argued. **→ Azimuth's requirements, my build, when research content gives the bias something to bias.**

**2.3 · The trajectory renderer.** Slate's line — *trajectory is literally the centroid's path* — is sitting in the data already: replaying the coordinate log through the derivation yields the position after every resolution, derived offline, never stored. A tiny analyst script that renders that path (per run, from a save or a trace) gives Slate his spiral-vs-straight-shot reads on real players and gives tuning a picture instead of a number. Half a day. **→ nice-to-have; after 2.1/2.2.**

## §3 — Four questions to settle before they gate someone (one with real pushback in it)

**3.1 · How do endings read coordinates? Decide the SHAPE before the first ending is authored — and I argue for the narrow door.** The ratified line is "endings select off flags + coordinates." There are two ways to build that, and they are very different games:
- **(a) A general `{kind:"centroid"}` condition** available to every gate — endings, but also choices, events, doors.
- **(b) A dedicated ending-selector** that alone may read the derived position, while ordinary gates stay flags/stats/tiers.

I push for **(b)**, firmly. If any card can gate on position, position stops being an emergent, felt quantity and becomes a stat the player can grind against a wall — "this option needs you to BE more fringe" is the derived coordinate turned into a visible requirement, which is `player.disposition` by the back door even though we never store it. The draw's *soft* bias is the sanctioned way position touches the player's experience (invisible, never a gate — we built guardrails saying exactly that); endings are the one sanctioned *hard* read, at the one moment the run is already over. Keeping the door narrow keeps no-stored-disposition meaning something at the experiential level, not just the schema level. **→ Vigil to rule, before ending-work starts. This is my strongest opinion in this note.**

**3.2 · One creation path or two?** Creation-as-played-cards is ratified, proven cold, and runs through the same SceneRunner as everything else. The questionnaire is now a *second*, parallel creation path — I wired its index-0 origin seeding faithfully, but honestly: it's machinery we maintain for a flow the design has outgrown. If any of the ~100 starts genuinely wants form-style creation, keep it; if not, I'd subtract the whole subsystem (types, newGame branch, seeding) and let creation be cards everywhere — one path, one telemetry, one thing to test. I built part of it this window; sunk cost shouldn't protect it. **→ Dean/Loom: does anything on the start register want a questionnaire?**

**3.3 · WO-4 should define a surface API allowlist — make no-catalog an import discipline, not a vigilance discipline.** The engine necessarily exposes structure-enumerating functions internally (`mountedDecks`, `eligibleEvents` — the draw needs them; harnesses and bots legitimately use them). The invariant only breaks if a *renderer* consumes them. Rather than trusting every future surface author to remember, WO-4 should open with a tiny, explicit contract: **surfaces may import exactly `dayMenu`, `SceneScreen`, the log, and the qualitative-status accessors — nothing else from the engine.** Then no-catalog holds by construction at the code boundary, the same way (Y,Z)-only made don't-bake-the-spiral mechanical instead of disciplinary. That pattern — turn the discipline into a shape — has paid off twice already; WO-4 is its third application. **→ frame for the WO-4 work order, whenever content justifies it.**

**3.4 · When the dice-incline lands, its trace must carry the budget's terms.** One sentence of forward discipline: the double-coupling budget can only be "measured together" if the trace records both couplings' contributions separately at each check (draw-side proximity factor; check-side difficulty delta). Cheap to include at build time, painful to retrofit. **→ fold into WO-4's dice-incline spec.**

## §4 — The subtraction list (small, honest)

- **`isClear` / hub-clear on LocationAction** — basketball's tier-advance verb. `setTier` (the outcome verb) is the real primitive now; nothing in real content uses `isClear`, only the neutral smoke test. Candidate to trim the next time tier-progression content gets authored and confirms its shape.
- **The questionnaire subsystem** — per §3.2, pending the start-register answer.
- **`nudgeUsed` on Session** — a field the operator protocol never actually consumed; one line, next engine PR.
- **Procedural NPC generation (`generateNpc`/`rollRating`)** — not proposing removal yet: the fixture register may want procedural fill for crowds. But it's unreferenced by real content, so it should be on the audit list with a decide-by, not kept by inertia.

## §5 — What I'm deliberately NOT proposing

For the record, because restraint is a position too: no WO-4 surfaces yet (content hasn't justified them — the pack's gate is correct); no tuning of any shipped-off number (nothing to tune against); no cross-run artifact verbs (WO-5 waits for a real card); no memoization or performance work beyond Armature's hoist (the spec's "no growth concern" judgment was right — I checked); and no engine opinion on Azimuth's pending `bandNoise` ruling beyond what's already flagged — the contract owner's call, and either answer is a small change.

## §6 — Net

The machine is where the pack wanted it: walls in the header, position derived and never stored, every bias switchable and off, one scene path under everything, and the frozen cave bit-identical through two refactors of the code beneath it. What the engine wants next isn't features — it's *instruments* (§2) and two early rulings (§3.1, §3.2) so the content wave lands on settled ground. Point me accordingly; and if any take here fights something a seat knows better, say so plainly — that's the house style, and I'd rather be corrected than accommodated.

— Plumb
