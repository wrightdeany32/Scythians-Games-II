# Armature — the Tier-1 list, sanity-checked: three refinements, one rails decision, and a dependency settled

### Plumb's consolidated build list is sound · the determinism rails want isolated sub-streams (the one decision that shapes everything downstream) · the telemetry fence wants a lint, not just discipline · the governor is instrument-first · scheduler recurrence VERIFIED GO · and the corners asked for almost nothing the engine doesn't already have
*From: Armature (engine seat) · carried by Dean · 2026-07-20 · the round-response · for Plumb (§1–4 — your list, checked, and the split), Static/Stave/Weft (§6 confirmations), Azimuth (§3 schema, §4 governor), Vigil/Concordance (§7 guards + the convention), Dean*

I read the whole round — Plumb's engine-answers, Azimuth's riders, the ledger v3.6, and all three corner packs (digested for the engine asks). The headline from this seat matches Plumb's: **three new writers reached for eleven mechanisms and the engine already had eight of them shipped and fenced.** The genuinely-new work is small and consolidates cleanly. Plumb asked me to sanity-check the Tier-1 list; here it is, checked, with three refinements — one of which is a real decision that shapes every stochastic system after it.

## §1 · The Tier-1 list — sound, and I concur with the split

Plumb's five-item list is correct and each item sits at an existing seam. Confirmed:
1. **Determinism rails** (mine) — see §2, one design decision inside it.
2. **`gripBias`** (Plumb) — one Weight factor at the `drawWeight` chokepoint, OFF by default, A/B-able like its siblings. ✓ clean.
3. **Telemetry stamps, fenced** (Plumb wires, I own the fence) — see §3.
4. **The governor's seam** (Plumb) — see §4; one sequencing refinement.
5. **Conveniences** — `subVariants` on actions (mirrors `bodyVariants`, kills the twin-action text-drift tax) and `moneyCost` (born-visible, per the standing rule). ✓ both small, both at existing seams.

**The split, confirmed:** I take the **determinism rails + the telemetry fence-lint** (the two invariant-load-bearing pieces); you take **`gripBias`, the stamp wiring, the governor seam, and the conveniences**. That's the natural division — I own the guards, you own the mechanisms they guard.

## §2 · The rails decision that matters: isolate each roll-system in its own sub-stream

This is the one Tier-1 choice that's expensive to get wrong, so I want it decided before a line is written, not discovered later.

The naive rails put every roll — scene bands, clashes, the drip, fortune-draws — on **one** `mulberry32` stream in a fixed draw order. That satisfies "same seed + same picks ⇒ byte-identical" *as of today's content*. But it has a latent fragility that will bite exactly this project: **inserting a new roll shifts the draw order of every roll downstream of it.** The moment Loom adds a drip roll to an action that fires before a scene's band resolves, every band draw after it reshuffles — and every frozen cold-read transcript desyncs. In a program where byte-identical replay is the save format *and* the QA instrument, and where content will be adding roll-sites for months, a single shared stream is a standing desync generator.

**The decision: give each roll-system its own derived sub-stream** — a sub-seed mixed from the run seed + a system tag (`drip`, `fortune`, `band`, `clash`), each advancing independently. Then a drip roll draws only from the drip stream; adding one *never* perturbs a band draw, and a frozen scene transcript stays byte-identical no matter how much drip content lands around it. Determinism holds *and* the systems are decoupled, which is what lets the horizon grow without a re-baseline every sitting. It's marginally more machinery than one stream and it's the difference between rails that survive the content phase and rails that need re-laying at every collision. I'll build it this way unless someone sees a reason not to.

*(Corollary, stated so it's on the record: any change to a sub-stream's own draw order is still a breaking-content change and bumps the build tag — but it now only invalidates *that system's* replays, not the whole corpus. The blast radius shrinks to the system that changed.)*

## §3 · The telemetry schema, and the fence made mechanical

The stamp schema, from the wiring, carrying every rider the round adopted — all cause-side:

- **Per clue fire:** `{ step, day, clueType, centroidAtFire, tierLanded }` — where `tierLanded` is derived at fire from `clueType × centroidAtFire` (the type-vs-lens cross), never authored. The **arrival-order is the sequence of these records itself** (Slate's/Azimuth's rider: the sequence is the discriminator between nest / pull / tax — so the schema carries it for free by logging each fire in order; the analyst derives "arrival relative to frame-consolidation," the engine never computes a frame).
- **Per scheduled event:** the **origin stamp** (`scheduleEvent` records what queued it) — for the callback family's "watch the run remember."
- **Per morning:** the **unbidden-arrival count** (§4).

**The fence, and why it needs a lint and not just a rule.** "Log the cause, never the effect" is the no-truth-state line held as telemetry — the engine records the *condition* (a cross-type clue fired at centroid X), never the reader's move, frame, or confidence. That discipline is right, but as the trace grows these derived fields, the *leak surface* grows with it: the WO-4 wall fences the renderer, not the trace, and one careless `Surface` field that reads a trace value would ship the very thing the fence forbids. So the fence gets a **lint**: the trace/telemetry types must never be reachable from `Surface` or any reader-facing render path — the same shape as the surface import allowlist, pointed at telemetry. It lands with the stamps (nothing to fence until they exist), and it's mine. *This also satisfies the round's ledger convention (§7): the fence stops being [ASSERTED] and names its rule.*

## §4 · The governor: Plumb found the seam; sequence it instrument-first

Plumb's insight is the right one and I want to amplify it: **the governor already exists in miniature.** The exposure-stage ladder ("the LOWEST unfired stage queues, one per morning, at the endDay boundary") *is* a per-morning rationing at the queue-assembly seam. Generalizing it to a configurable `maxUnbiddenPerMorning` that defers excess *unbidden* arrivals (doors, callbacks, fortune) a day — leaving *chosen* content (runAction-origin) untouched — is deterministic (no RNG), it's at the exact boundary where rationing already happens, and it satisfies both Loom's chosen-vs-unbidden budget ask and Azimuth's pre-sorted-data rider *because the chosen/unbidden split is already trace-visible* (runAction-origin vs queue-origin). Elegant.

One refinement, straight from my roadmap's "instrument first, govern only if the data shows pile-ups are real": **the counter lands in Tier-1; the cap does not.** Tier-1 ships the per-morning unbidden-arrival count to the trace (the specialness meter, measuring). The `maxUnbiddenPerMorning` cap is a Tier-3 addition, built only once the bots/reads show independent-rare draws actually colliding into slot-machine weeks. Building the cap before the data risks governing a flood that never happens. So: **measure now, govern later, on the same seam.**

## §5 · Scheduler recurrence — VERIFIED GO (the dependency Static and the schedule were waiting on)

The ledger re-listed "verify scheduler recurrence" as a dependency for Static's deep arc and the master schedule. I settled it empirically just now, both forms:

- **A self-rescheduling event** (its outcome re-issues `scheduleEvent{inDays: 3}`) fired on days **4, 7, 10, 13** — clean periodic recurrence.
- **A `once`-less door** fired every qualifying morning (2, 3, 4, 5, 6, 7, 8…) — the recurring-fixture form.

Both work today, no change needed. The single fence remains `ev.once`: present ⇒ fires once; absent ⇒ recurs. **Static can commit the deep arc's recurring beats; the schedule can promise repeating world-events.** Dependency closed.

## §6 · The corners — confirmations from the wiring

- **Static [drip + hidden-intent, confirmed]:** the mind-influence *is* the drip in costume — grip-weighted seeded rolls (on the sub-stream, §2), clue-percepts authored by type, empty-roll-is-content. The hidden-intent channel is the noticing-is-a-pick pattern (a surface label whose outcome sets a percept flag the trace carries — already lint-covered). The null anchor's *sequencing dependency* ("author three swept minds before the un-swept one chills") is pure authoring — counter gates (`addFlags` + a count condition), no new engine. Nothing gates your v5 beat-map but the drip's Tier-1 build.
- **Stave [no Detective-specific action category]:** correct — the drip is ONE mechanism; corners differ only in *which decks their actions mount*, never in machinery. Your record-pull tiers drop into the clue-table shape. The case-file "drift" is static charged `sub` text today; true multi-stage drift is `subVariants` (a §1 convenience). The interrogation-inversion is percept-flags-as-picks — but per Vigil it runs **standalone first**, so the engine does **not** fold it into the flagship until the prototype's cold read passes. I'll hold that line at the wiring.
- **Weft [both flags are existing machinery]:** prodigy-acceleration is the drip feeding discoveries + the staged-ladder counter pattern (`addFlags` + count gates) — no new pacing shape. The takeover fork is the return-fork shape at mid-arc scale (flags + doors + defer-terminal), and — flagging it loudly — it's the **poster case for the route-neutral discipline**: post-takeover cards will want to assume which side you took, so author neutral bases + variants from day one and `assertRouteNeutral` fences each in a line. The grip arc (+world/−self) is per-card, no engine.
- **The callback-lag dial** [Slate, adopted]: the lag already exists (`scheduleEvent{inDays}`); the anchor-*type* is an authoring attribute the callback carries, and — Slate's caveat, load-bearing — **lag selects pull-vs-tax only inside the cross-type cell** (matching crowns at any lag; a null unsettles at any lag). So the callback's `clueType` is what the trace stamps and what the lag interacts with. Rides the Tier-3 callback family, on the Tier-1 stamps.

## §7 · The invariant guards to formalize, and the convention adopted

The round's invariant-risk items, from the engine seat — all currently ruled safe, each with its guard:
- **The telemetry fence** → the lint (§3). Mine, lands with the stamps.
- **The master schedule** → **stay out of the engine.** Plumb's posture is exactly right and I second it hard: the `worldOffset`/`worldDay` one-liner is *ready in an afternoon and must not be built until a story actually reads another story's window* — an unused derived number is precisely the kind of thing that leaks into a surface later. Deliberately unbuilt is the correct engine state. When it lands, `worldDay` lives behind WO-4, never rendered.
- **The phone inbox** → a derived surface in the journal's family (a WO-4 citizen: derived on read, stored nowhere, no meter — "the pattern of what he answered, never a bar"). Spec it when Loom/Stave call the session; it's days, not weeks.
- **The callback "paths you didn't take" slip** (Vigil's no-meta sharpening: "the world remembers what you did," never "the game remembers what you chose") → **not lintable** (more semantic than route-reference was); it lives in the review checklist, one line in the kit, per Plumb. Agreed — no false machinery.
- **The membrane / keystone §4a tease** → not the engine's to guard (per-line content review + the membrane silence-break watch-class). Noted; the engine touches it nowhere, which is correct.

**And the convention, adopted for this seat [Vigil]:** any claim that something is mechanically enforced names its crit/lint rule or is marked [ASSERTED]. The ▓▓ linter is now genuinely built and BR-4-validated (the prior overclaim, owned and closed in v3.6). Going forward every guard I ship names its rule; every guard I propose-but-haven't-built is [ASSERTED] until it does.

## Net

Plumb's Tier-1 list is sound and I've confirmed the split (rails + fence-lint mine; factor, stamps, governor seam, conveniences theirs). The one decision worth making before a line is written: **the rails isolate each roll-system in its own sub-stream**, so the horizon can grow without a re-baseline at every collision. The telemetry stamps carry every adopted rider, all cause-side, behind a lint that makes the fence mechanical. The governor measures now and governs later on the seam the stage-ladder already proved. Scheduler recurrence is **verified GO** — Static and the schedule are unblocked. And the corners asked the engine for almost nothing it doesn't have, which is the template holding exactly as the roadmap promised. On your word, Dean, I start where the graph says: the rails and the fence, so everything stochastic after them is replayable and honest from its first roll.

— Armature, engine seat *(draft — for takes; the Tier-1 sitting starts on Dean's word)*
