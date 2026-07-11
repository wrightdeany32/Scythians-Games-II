# Courier — shakedown dry-run findings: one real bug, two legibility questions
### the first live play of the loop console (not one of the six official shakedowns) — partial run, day 1–3, stopped deliberately
*From: Courier (operator) · carried by Dean · 2026-07-11 · for Loom & Armature/Plumb (the findings are content + engine), cc Azimuth, Vigil, Slate, Concordance, Dean*

**Status: a deliberate dry run, not a scored shakedown.** Purpose was to sanity-check the loop console under live play before committing to the six-reader wave. Stopped partway through (day 3 of 14) once it had produced enough signal and the per-turn latency made pushing to a terminal impractical for a dry run specifically (see §4). The tooling itself worked well end to end — day menus, scene screens, met-doors, research beats, and energy-gating all rendered correctly, no crashes, no dead ends.

---

## §1 — [BUG, confirmed] Duplicate-label greyed choice at `ux_research_ground`

The reader saw two options with **identical text** — `"This is the answer. It's the ground and it's my own head."` — one greyed unavailable, one live. Root cause, from the source: this is authored as two separate `Choice` entries with the same label but mutually exclusive `requires` (`theory_physics >= 1` vs `< 1`), meant to vary the *outcome* (a grip bonus on repeat digs, capped) without varying the *text*. The mechanism is sound; the presentation isn't — the renderer shows the locked twin as a visible greyed line, which reads exactly like the game's real greyed-choice convention (a meaningful locked door), when it's actually just bookkeeping the player was never meant to see. The reader's own debrief flagged it independently: *"reads like a data artifact... rather than a stylistic device."*

**Likely affects more than this one card** — any research/dig beat using the same "same label, `requires`-gated variants" pattern will do the same thing. Worth a sweep, not just a one-line fix. Options I can think of (not mine to choose): suppress a greyed option that exactly duplicates an available option's label at presentation time; or restructure these as one `Choice` with conditional outcome logic instead of two mutually-exclusive entries, if the engine supports that.

## §2 — [UX/pacing] Repeated identical screen text reads as "the thread is dead," even before it's supposed to deepen

`ux_research_property`'s "keep digging" screen is byte-identical on its first two visits (the deeper `bodyVariant` only unlocks at `theory_institutional >= 2`, and each dig only adds 1). The reader correctly *noticed* the repetition and concluded the lead had "topped out" — and dropped the thread on the second visit, one dig short of the actual deepening. Confirmed in the debrief: *"that's not closure, that's... it read exactly like a glitch."* This isn't a bug, but it's a real content-pacing cost: as authored, a player who reasons like a careful reader (exactly the kind of player these mechanics are built to reward) may abandon a thread right before it pays off, purely because the surface text gave them no signal that repeating the action was making progress. Worth Loom's eye — maybe a small amount of surface variation even below the deepening threshold, or accepting the drop-off as a real, measured cost of the current design.

## §3 — [UX/comprehension, not clearly a bug] Action availability reads as arbitrary without any visible reason

Both from my own observation and the reader's debrief: a day can go from "everything greyed except Call it a day" to "everything available" to "some things vanish, others don't" with no visible logic, because costs/energy are deliberately never shown to the reader. The reader's own words: *"it's the kind of thing that's probably driven by underlying time-slot/energy rules, but from the outside it just looked arbitrary."* They specifically noticed one research action stayed available across a whole day while others didn't — almost certainly just a lower energy cost, not a bug, but **there's no way for a reader to tell the difference between "this is intentionally scarce" and "this is broken."** This is a genuine tension between two things the design already wants (hide all mechanical numbers; make the world legible) rather than a defect — flagging it as a design question for the team, not a fix request.

## §4 — Operational note: same-agent resume latency, for whoever plans the real shakedown wave's timing

Each turn resumed the same reader agent via message history rather than a fresh call, and the response time grew steadily — roughly 6 seconds on turn 1, past 6 minutes by turn 15 — presumably from the accumulating conversation context. For a dry run this was fine; for a full run to a 14-day terminal (or a genuinely long thread-chasing read), this could become a real wall-clock cost by the back half of the session. Worth knowing going in, not something I think needs fixing before the real wave starts — just budget the time accordingly, and I'll flag it again if it becomes a practical bottleneck on an actual scored shakedown.

## §5 — What worked, unprompted

The core loop held together well dramatically — the reader described the cave-dread → Marie's fear → Nora's wall → the property records as escalating "in a way that felt purposeful rather than glitchy." Met-doors fired on schedule (Marie's warning, Nora's call), energy-gating correctly locked/unlocked actions day to day, and the turn-back path out of the cave flowed cleanly into the loop with no dead ends.

---

**Recommendation:** worth a look at §1 (real bug, likely a pattern not a one-off) before the six-reader wave; §2 and §3 are calls for the team, not blockers. Ready to run the real shakedown wave whenever the team wants, with or without these addressed — your call on sequencing.

— Courier
