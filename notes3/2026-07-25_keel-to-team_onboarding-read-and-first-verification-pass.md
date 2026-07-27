# Keel — the onboarding read, and a first verification pass
### the green bar re-run from cold · v3.6's enforcement claims audited against the code (clean) · three verified seams in the drip's queueing · one cross-seat gap that will bite the moment content uses it · and what I'd take
*From: Keel (engine seat, new — name set by Dean) · 2026-07-25 · for Dean first, Armature + Plumb (§2, §3 — your surfaces), Vitrine (§3 — the web shell's two touches), Concordance (§0 burn, §4.1), Vigil (§4), Loom (§2 — one authoring hazard), the team*

Dean brought me in on the coding side. I've read the corpus — narrative geometry v1.0, master ledger v3.6, the engine and coldread source, the four blind-run readouts and the debriefs, the Tier-1/drip build notes, and the corner packs' engine asks. I'm building to ratified rulings and reopening nothing.

The project doesn't need another seat's impressions of itself; it has Vigil for synthesis, Concordance for canon, and two engine seats already carrying the build. What it looked short of, from outside, is a seat that **independently verifies claims rather than relaying them** — the thing three overclaims in one week (v3.5's ▓▓ linter, the same-terminal parenthetical, the test-branch claim) each cost a different seat to catch. So this note is a verification pass, not a survey: everything below I ran or reproduced, and where I found nothing wrong I say so plainly.

## §0 — Log the burn
I have read §1's fourth invariant and all of §2, including §2.5a. **Concordance: log this chair compass-burned.** I'm a repo-reading agent, so the burn was structural the moment I opened the ledger — noting it explicitly because §6's register tracks it per-seat and the tier matters for who can ever be pointed at a cold read.

**And a flag on the way past, because the calendar has moved:** §7 still lists the eighth chair as *"onboarding imminent"* with the outside-view memo as **the most time-sensitive item in the project**, and the last note in the folder is 07-21. Five days. That measurement is non-renewable and it decays to zero on first contact with any project document — including, per Concordance's §1, the onboarding message itself. If it hasn't been commissioned, it's the one thing in this project that gets strictly worse by waiting, and nothing else on the horizon is in that category.

## §1 — The green bar, re-run cold, and the ledger's enforcement claims audited
**Every harness passes on a fresh clone + install.** Not relayed from the build notes — run:

| Harness | Result |
|---|---|
| `typecheck` | clean |
| `demo` | end-to-end, save/load roundtrip OK (1562 bytes) |
| `loop` | ALL LOOP CRITERIA PASS (incl. the governor's unbidden count, quiet=0 busy=2) |
| `startdeck` | 14/14 |
| `playtest:cave` | 7/7, both routes |
| `coldread:sample` | ALL SEVEN CRITERIA PASS, 9 steps |
| `web:smoke` | 81 picks · 39 day screens · 42 scene screens · terminal `run_end_never_returned` day 15 · **replay byte-identical** |
| `lint:content` | 5 dbs, 0 errors, 15 warnings (all the benign flag-web/unreachable class) |
| `lint:imports` | self-test passed, 0 violations — incl. *surface reading a sub-stream → blocked* and *surface exposing the clue tier → blocked* |

**Then the discipline convention applied to the ledger itself** (Vigil's §4 rule: a claim of mechanical enforcement names its enforcer or is [ASSERTED]). I picked the claims most load-bearing on the invariants and went to the code. **All of them hold — I found no surviving overclaim in v3.6:**

- **"The surface import allowlist … the `Surface` type omits trajectory/exposure/grip-number"** — true at the type. `engine/surface.ts` carries `grip: GripBand` and no exposure field at all; there is no accessor on the module that would return a centroid. Two layers, both real.
- **"the never-opens-▓▓ linter is now built"** — true, `tools/lint.ts:370–400`. It errors on a ▓▓ choice that isn't `showWhenLocked`, on an ungated one, and — the part that actually enforces *permanence* — on one gated by a flag any outcome writes. That last rule is what makes "never a door that opens" mechanical rather than aspirational.
- **"the telemetry fence … a lint, not just discipline"** — true, and it self-tests both directions (a surface reading `rngState`/a sub-stream/the clue tier is blocked; a non-surface file reading them is unconstrained).
- **"health folds into energy"** — true by absence: no `health` in `Stats`. The ruling is enforced by there being nowhere to put it.
- **"Zero position gates; the one stat gate is `grip ≤ 3`"** — true across shipped content. The only grip gates are the cave's ▓▓ (`grip ≤ 3`, `showWhenLocked`) and White's-Hall-return's mirror of the same line. No content anywhere gates on a derived coordinate.
- **"breathers cap 7"** / **"`SQUEEZE_TARGET` 10"** / **"energy 3/day"** — all three literal in content (`statsMax: { grip: 7 }`, `cave.ts:19`, `energyMax: 3`).

That's the audit I'd want run on me, so I ran it on the record first. The convention is working: the class of error that produced three catches in one week has stopped producing them.

## §2 — Three verified seams in the drip's queueing [→ Plumb, Armature; one is Loom's to know]
The drip is 24 hours old and unexercised by content, which makes now exactly the right time to look at it. I probed the queueing edge cases the crits don't cover. **Three reproduce.** All three are latent — no shipped content triggers any of them, because no content authors `drawFrom` yet. All three become live the moment Loom lands the first clue table.

Reproduction (four probes, `applyOutcome` only, no harness changes):

```
P1 unmounted-deck drip drew:                        ["d1"]        ← MOUNT RULES IGNORED
P2 queue after drip (authored 'b' was pending):     ["d1","b"]    ← DRIP PREEMPTED THE AUTHORED BEAT
P3 queue after drip (d1 already pending):           ["d1","d1"]   ← DUPLICATE QUEUED
P4 chain + drip (control):                          ["x","y","d1"] ← correct
```

**2.1 · `dripDraw` skips the pipeline's Mount step.** `dripDraw` builds `new Set([deck])` and filters on `isEligible` — it never consults `mountedDecks`, so a drip deck carrying `mountFlag` or `towns` draws anyway, in the wrong town, with the thread flag unset. The engine comment and the drip note both say *"a drip deck is an ordinary deck; there is no second draw physics"* — but Mount is a step in the ratified order (Mount → Filter → Weight → Draw), and this path has four of five.

I don't think honouring mount is obviously right — `drawFrom` is an *explicitly named* draw off an already-gated action, and per-card `condition` covers thread gating properly. So my recommendation is the cheap half: **keep the behavior, correct the claim, and add a lint warning** when a `DeckDef` used only as a `drawFrom` target carries `mountFlag`/`towns` (an author who writes one is expressing an intent the engine will silently ignore). If Armature would rather Mount be universal, that's a one-line change to `dripDraw` — but then the drip inherits town-scoping, which I suspect nobody wants.

**2.2 · With no authored chain, the drip cuts in front of a pending authored beat.** This is the one I'd fix. `applyOutcome` splices the drawn card at `chainLen` — the length of *this outcome's* chain, which was `unshift`ed to the front. When the outcome authors no chain, `chainLen` is 0 and the drip lands at index 0: **ahead of anything already queued.** Author a scene as `queueEvents: [A, B]`, put `drawFrom` on a choice inside A, and the drawn clue plays *between* A and B — interleaved into the middle of an authored two-beat sequence, which is precisely what the front-insert ruling exists to prevent.

The fix is smaller than the bug: **`g.queue.push(drawn.id)`** instead of the splice. It is byte-identical whenever the queue holds nothing beyond the chain (the common case, and every existing crit — P4 still gives `x,y,d1`), and in the uncovered case it delivers the stated contract in its strongest form: *authored intent always outranks the draw*, the whole authored remainder plays, the drawn page turns up after it, still inside the same scene. One crit to go with it: *a drip draw never displaces a beat that was already pending.*

**2.3 · The drip can queue a card that's already queued.** Nothing excludes `g.queue` members from the pool, so a pending card can be drawn again and fire twice back-to-back. `nextQueuedEvent`'s once-check absorbs this **only for cards carrying `once`** — a `once`-less clue card double-fires. Two candidate fixes, and I'd take the first: exclude already-queued ids from the drip pool (one predicate, and it's what an author expects), or lint that every card in a `drawFrom` deck carries `once`. [→ Loom: until one of those lands, **give every clue card a `once` flag** — that closes it from the authoring side today.]

None of the three touches determinism, the rails, or the fence: the sub-stream isolation holds (verified separately — a drip draw leaves `rngState` byte-identical, exactly as the note claims), the clue stamp is stored nowhere, and no surface can reach any of it.

## §3 — The web shell and the cold-read console have diverged [→ Vitrine, Plumb]
The finding I'd rank above §2, because it's live rather than latent and it points at the instrument.

Plumb flagged on 07-20 that the web shell reads `a.sub` directly and doesn't know `moneyCost`. **It's still true**, and it's now the only consumer in that state:

- `src/coldread/loop-session.ts:413` → `actionSub(g, a)` ✅
- `src/smoke/loop.playtest.ts` (the crits) → `actionSub` ✅
- **`src/app/websession.ts:305` → `a.sub` ❌**, and no `moneyCost`/`brokeText` anywhere in the web path.

Nothing breaks today because no content uses either field. But the cutover made the browser **the shipping face of the game**, and Stave's case-file drift is an authoring sitting away from being the first `subVariants` in the repo. The consequence isn't cosmetic: a drift the cold reader sees and the browser doesn't means **the transcript stops describing the build a player plays** — the read program is the release QA instrument, and an instrument that measures a different artifact than the one shipping is the expensive kind of wrong. Same for a priced action: the engine gates it correctly, and the browser player is greyed out with no price and no felt reason, which is the exact unfair-mystery failure the energy ruling was written about.

Two touches, both small, and they should land *before* the first drifting or priced action, not after: route the web `dayLabel` through `actionSub`, and give the HUD the price chip + `brokeText`. Happy to build it if Vitrine would rather stay on the anchor round — it's engine-adjacent, not art.

## §4 — Two observations from a genuinely cold read
**4.1 · The corpus is at the scale where the ledger is doing all the work.** 291 notes across three folders; `notes3/` is 50 and rising at the rate that filled the first two. I got oriented in one sitting, and the honest reason is that v3.6 is an exceptionally good synthesis document — I could read one file and then verify against code rather than archaeology. Worth saying because it's the argument for keeping the ledger's cadence exactly where it is: it is currently the difference between onboarding a seat in a sitting and in a week. (No proposal attached. If a lightweight per-folder index ever seems worth it, that's Concordance's register, not mine to design.)

**4.2 · The engine's negative space is its best-documented feature, and that's why it holds.** Reading `centroid.ts`'s *"deliberately absent: an attune reader"* and `surface.ts`'s *"there is deliberately NO function here that returns the trajectory"* — the invariants survive because the code says out loud what it refuses to have, at the place a future hand would reach. That's not a style note; it's why an outside seat can't accidentally breach an invariant in an afternoon. It's worth protecting as a convention: **an engine change that removes a "deliberately absent" comment is a ruling, not a refactor.**

## §5 — What I'd take, and what I need from Dean
Armature owns the guards, Plumb owns the mechanisms. The seam I'd fill without colliding with either: **verification and adversarial review** — independently re-running claims before they enter the ledger, probing the edges of what just shipped (this note is the first instance), and owning the crit coverage for the seams nobody's content has reached yet. Verify-don't-relay as a chair rather than a culture note.

Concretely, on your word and in this order:
1. **§3's two web touches** — the live divergence, and the cheapest thing on this list.
2. **§2.2's one-line queue fix + its crit** — before Loom's first clue table, not after.
3. **§2.1 and §2.3** — Armature/Plumb's call on which side each is fixed from; I'll build whichever they route to me.

Three things I need:
- ~~A seat name.~~ **Settled: Keel** — what keeps a hull from sliding sideways. (Dean's call; "Assay" collided with an agent on another of his projects.)
- **Do §2's fixes go through Armature and Plumb first, or straight to a branch?** I've deliberately changed no engine code — the two engine seats own these surfaces and this project's culture is that fixes follow a ruling, not precede one. Say the word and it's a branch.
- **Anything you'd rather I look at instead.** I've read the horizon; if the useful thing is the shared-fixture module's engine side, the phone inbox, or the interrogation scaffold's standalone read, point me and I'll drop the above.

## Net
The green bar is real — I re-ran all eight harnesses cold and audited v3.6's enforcement claims against the code, and found no surviving overclaim; the discipline convention is doing its job. The day-old drip has three verified queueing seams, all latent, all cheap now and all live the moment the first clue table lands — one of which (a drip card cutting in front of a pending authored beat) is a one-line fix I'd make before Loom starts authoring. The web shell has drifted from the cold-read console on two fields, which matters less as a bug than as an instrument that has started measuring a different build than the one that ships. And the eighth chair's memo is five days older than the note that called it the most time-sensitive item in the project.

Thank you for the seat, Dean. The thing that struck me hardest reading in is that nine strangers have met this game and it has never needed anyone to vouch for it — I'd like the engine's claims to be held to the same standard, and that's the chair I'm offering to sit in.

— Keel
