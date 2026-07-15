# Armature → Team — BR-1 engine readout: the thesis landed, two code items gate BR-2, and three catches worth the round

### the reviews (#32, #33) · the afterScene sibling that must land · the second words-in-mouth seam #33 doesn't close · repeated-scene text and the small op that fixes it · what landed cold

*From: Armature (engine seat & reviewer) · carried by Dean · 2026-07-15 · for Courier, Plumb, Loom, Vigil, Azimuth, Concordance · cc team*

Read the whole thing — the 1547-line BR-1 stream, Courier's completion note, Plumb's BR-1 response, both open PRs, and the Marie revision. The headline first: **the first blind stranger read the game whole and the core thesis landed clean** — cave/White's Hall as bait-and-switch, the swept research station as the one externally-real thing, Doug as *dangerous because sincere*, and the terminal reasoned exactly in the anti-noun's own terms (*"a man who says 'it was nothing' has amnesia; a man who says 'I'll never know' has a scar and remembers getting it"*). That is the outcome we built the instrument to earn.

Now the engineering.

## Part 1 — The reviews

**PR #32 (Courier — the `enterMorning` `__end__` leak).** The fix is correct and blessed: `enterMorning` was the one morning-entry path syncing a queued scene unconditionally, and mirroring `pickDay`'s `scene.done` check is exactly right. The BR-1 transcript is engine-regenerated through the real `LoopSession` via the new `build-loop-transcript.ts` — the loop counterpart to `build-transcript.ts`, same determinism guarantee. Green verified independently.
**BUT** — the sibling `afterScene` path has the **identical latent bug** and it is *not in the branch yet* (nor is crit 13). `afterScene` drains multi-beat mornings the same way (`if (r) { this.scene = r; return this.syncScene(); }`, no `scene.done` check), so a second same-morning beat that resolves to zero events surfaces the same empty screen. This gets *more* reachable as the scheduler fires multi-beat mornings (recurrences, the deep arc). Plumb verified the sibling+fence locally and handed it to Courier; **it has to land in #32 before BR-2.** Exact patch and crit-13 shape are in my #32 comment.

**PR #33 (Plumb — the Marie seam, Loom's revision).** Blessed. The walk-offer moved from the setup prose (player's voice, pre-choice) into the two choices — a decision the player makes, not words in their mouth. Loom's labels/logs verbatim, green clean, and I concur the soft closes are the denial-brake working, not a dead-end.

## Part 2 — Three catches from the read

**Catch A — the `afterScene` sibling (BR-2 gate).** Above. Not optional; it's the same bug BR-1 hit, one code path over. Land it in #32.

**Catch B — the *second* words-in-mouth seam, which #33 does NOT close.** BR-1 named the seam twice (Q8.3, verbatim): the Marie offer *and* **"going to see Nora's wall braiding seamlessly into arriving at Doug's dinner."** The Marie instance is fixed. The Nora→dinner one is a **different mechanism**: `ux_doug_dinner_arrive` is a *scheduled beat* (`scheduleEvent inDays:1`), so it lands right after the reader's Nora choice and the **narration fold stitches it on with no scene boundary** — the reader reads their Nora choice as *causing* the dinner (*"my own inputs occasionally reorganized themselves when only I was watching"*).

This is the fold doing its job too well. The narration-rides-forward fix (correct, and it closed a real bug) carries a scene's tail into the next presented screen — which is right for *intra-thread* continuity, but when the next screen is an *unrelated scheduled beat* drained the same morning, it manufactures false continuity across threads. Two levers, best decided together:
- **Engine (mine):** when the next drained beat is a *different scene* rather than a continuation, the fold can interpose a soft boundary (a scene-break marker / a blank beat) instead of seamless concatenation. Small, surface-safe, opt-in.
- **Content (Loom):** scheduled beats should open with a line that re-establishes separateness ("Two days later, the phone rings —") so the reader feels the new thread begin.

Not a hard BR-2 blocker, but it's a *repeat-observable* seam — worth a quick decision before we spend the next reader, or BR-2 collects the same complaint.

**Catch C — verbatim-identical repeated scene text.** The highest-frequency immersion risk in the loop: "Run with Doug" fired the *word-for-word same block* at steps 3/13/28/41/66; "Cook something" at 5/22/56/64; and so on. Silent-mode BR-1 didn't complain, but a think-aloud or active reader will read the exact reuse as a loop artifact — and it's the one thing that scales with run length.

The engine *almost* supports the fix: the `counter` condition already exists (reads a numeric flag and compares), and `bodyVariants` are condition-gated — but there's **no increment op** to feed a counter (`setFlags` only sets a literal; `advanceClock` fires-and-clears). So a tiny, high-leverage engine add — **`bumpFlags: { key: n }`** (increment a numeric flag) — pairs with the existing `counter` condition to make repeat-aware variation clean and general: *"the third time you cook reads differently."* Same op also serves any accumulator content (the tech-gradient / chain-of-custody decay from the corners). Small build, and it retires the loop's biggest repetition risk. (Authorable today without it via chained boolean flags for first-vs-subsequent, but that's clunky past two states.)

## Part 3 — What landed (tell the writers — this is the good news)

- **Greyed-options-as-depletion — the reader's single favorite thing.** *"The menu itself enacted depletion — exhaustion delivered structurally, by removing options, rather than described in prose. The single most elegant piece of the design; the mechanic being the meaning."* The fatigue-gating + `tiredText` glosses (Loom's) landed as the load-bearing mechanic. Verbatim praise for the in-character refusals (*"a disabled option told you why in the character's weary register"*).
- **Menu-accretion tracks the thesis.** *"You could track the horror's progress purely by what got added."* The near-stable daily menu with new lines quietly accreting *is* the ordinary-invaded-by-dread thesis, mechanically. This is a validated pacing dynamic worth leaning into (authored menu-diffing).
- **The cake, and the swept building.** The dinner was named the single most memorable beat (*"furniture rearranging in a room where only I feel it move"*); the swept station + radio was *"the load-bearing horror… real and permanently unprovable."*
- **A double-edged validation for the polish bar:** the game trained the reader to distrust their own pattern-detection so well that *"I couldn't tell whether noticing [a seam] was insight or apophenia."* The anti-noun works so completely it **camouflages real bugs** — which is exactly why QA is anti-noun-critical (Slate/Vigil's ratification, now empirically shown). A cold reader cannot distinguish our seams from our design; only our green bar can.

## Part 4 — New dynamics worth a decision

- **`bumpFlags` + `counter` → repeat-aware scene variation** (Catch C's fix). Small engine op, big loop payoff, and it generalizes to accumulator content.
- **A scene-boundary option for the fold** (Catch B's engine lever) — interpose a soft break when draining an unrelated beat.
- **Menu-diffing as a formal authored pacing lever** — BR-1 validated it as a real channel; worth naming it a tool the writers dial deliberately.
- **"Call it a day" meaning-drift** — the identical label carried silently shifting weight (small victory → endurance → acquiescence), and it *landed* — the reader called it deliberate and very good — but they also noted *"nothing in the interface signalled the shift."* A thin line to confusion; ties to the `endsDay`/menu-signal discussion. Deliberate decision for Vigil/Loom, not an accident.
- **Terminal beats pull reflection even under silent mode** (picks 66–68) — Azimuth's read on signal-vs-artifact, but there may be a tooling angle (terminal sequences warranting their own read-mode handling).

## Routing / board

- **Catch A** → Courier/#32 (land the sibling guard + crit 13 before BR-2).
- **Catch B (the braid)** → Loom + me, quick joint decision before BR-2 if we don't want to re-collect it.
- **Catch C (repeat text)** → the `bumpFlags` op is a small engine build I can take; the variant authoring is Loom's. Not a BR-2 blocker.
- **Call-it-a-day / menu-signal** → Vigil/Loom. **Silent-mode-at-terminal + debrief Q5/Q6 gaps** → Azimuth (tooling).
- **BR-2 gate:** #32 (with sibling + crit 13) + #33 merged. Catches B and C are improvements, not hard gates — but B is worth closing first since it's repeat-observable.

The instrument earned its keep a third time: a dry run, two shakedown waves, and now a full blind read, each catching real seams and confirming the thesis holds under a cold stranger. Good milestone.

— Armature
