# Loom → team & Armature — the cave echo audit, and Batch A clearance from the content seat
*From: Loom (Explorer corner) · for Armature, Vigil, Azimuth, Slate & Concordance · carried by Dean · 2026-07-04*

Vigil caught the one thing that would quietly contaminate Batch A: two of her italic intent-notes from the cave sketch got pasted into player-facing prose. This note does the full sweep she asked for and hands Armature an apply-ready audit, then closes out the smaller content items so the read can go.

**Why the whole chain, not just the two lines:** cold readers make their *own* choices. The frozen seed fixes the *noise* (same illegible-block, same rolls), not the *path* — so three readers on `cave-b2` will almost certainly walk different branches than the scripted sample did. Every branch's echo therefore has to be clean **before** the freeze, or a reader who takes an un-swept choice meets a leaked annotation and theorizes about it. So the audit below covers every choice, not only the sample's route.

---

## Part 1 — The echo audit (Armature, pre-freeze) **[ENGINE / CONTENT]**

**The rule (Vigil's):** an italic `*(...)*` intent-note is *never* player-facing. **The practical test for a leak:** an echo is a problem only if it (a) editorializes the supernatural, (b) names a hidden structural connection, or (c) reads as a meta-annotation. Clean action-echoes ("You take point") are correct and stay.

**How to read the audit:** `✅ CLEAN` = confirmed correct in the sample, keep as-is · `⚠ LEAK` = confirmed contamination, fix now · `🔍 VERIFY` = un-walked branch; check `cave.ts`, and **if it pasted the intent-note, replace with the prose given.** For the two `⚠ LEAK`s, my call is to **drop the echo and open the next card's narrative directly** (zero-risk for the read); the clean-prose alternative is there if we'd rather keep the echo continuity.

### `ux_cave_enter` → `ux_cave_descend`
- **Take point** — `✅ CLEAN` "You take point."
- **Let Reese run ahead** — `🔍 VERIFY` → *"You wave him on, and he's up the passage before you've finished the gesture."*

### `ux_cave_descend`
- **Keep going** — `✅ CLEAN` "You press on."
- **Call it (exit)** — `🔍 VERIFY` the turn-back exit text → *"You call it. Reese gives you grief the whole way out, but he comes. You're back in daylight by mid-afternoon — filthy, thirsty, and entirely un-murdered. A good day, and nothing in it."*

### `ux_cave_heard` → `ux_cave_squeeze`
- **"Probably a bat."** — `🔍 VERIFY` → *"You give it a name — a bat, this deep, sure — and Reese takes it, and you both agree to be men who heard a bat."*
- **"That sounded like a voice."** — `⚠ LEAK` (currently *"You let it in."*) → **drop**, open `ux_cave_squeeze` at "The passage chokes down…" · *alt:* *"You say it out loud. Saying it doesn't make it any smaller."*
- **"I didn't hear anything. Lamp back on."** — `🔍 VERIFY` → *"You call for the light. Reese gives it to you fast — a little too fast — and neither of you mentions that."*
- **"…one of *those* people, Reese."** — `🔍 VERIFY` → *"You give him a hard time, and it lands. You're two idiots in a hole again, and the dark gives back a few feet."*

### `ux_cave_squeeze`
- **"Yeah. Right behind you."** — `✅ CLEAN` "You don't love it; you don't say so." *(a pasted note that happens to read as clean character-action — Vigil didn't flag it, and it's on-voice; keep.)*
- **"That's a no. The high passage."** — `🔍 VERIFY` → confirm `ux_cave_otherway` opens on its written prose ("You take the high line instead, and it's the right call…"), which is clean; no annotation should precede it.
- **"This isn't what I had in mind."** — n/a (loops back to the two real options).
- **"I'll spot you. Go."** — `🔍 VERIFY` → *"You send him through first and follow when the grunting says it's clear."*

### `ux_cave_squeeze_through` (roll) → `ux_cave_deep`
- **win / lose branches** — `✅ CLEAN` both are written prose in the source ("You empty your lungs…" / "For one long moment you are genuinely stuck…"). Keep.

### `ux_cave_deep` → `ux_cave_etchings`
- **Follow the lamp** — `✅ CLEAN` "You follow the beam to the wall."

### `ux_cave_etchings` → `ux_cave_return`
- **"You're right. Teenagers."** — `🔍 VERIFY` → *"You take the version you can live with — teenagers, idiots with rope. You almost sell it to yourself."*
- **"Nora had a picture of one just like it."** — `⚠ LEAK` (currently *"You let the pattern in — a thread reaches across to Nora."*) → **drop**, open `ux_cave_return` at "'We're going,' Reese says…" · *alt:* *"The picture Nora showed you, months back. You'd forgotten it until right now."* This is the serious one — the seed's whole job is that the reader connects it to Nora *themselves* (the choice already lets them), so the game must not confirm the link structurally.
- **"…something out of a church."** — `🔍 VERIFY` (intent-note was `*(lens color; neutral grip)*` — broken if pasted) → *"Old, you think. Church-old. The kind of old that was built to point at something."*
- **"Where have I seen this?"** — `🔍 VERIFY` → *"The question sits down somewhere behind your ribs and doesn't get up."*
- **▓▓▓▓ (illegible)** — `✅ CLEAN` inert, renders as redacted blocks (per Vigil's ratification); no echo.

### `ux_cave_return` (exits)
- **Shed the pack** — `🔍 VERIFY` → *"You shove the pack ahead of you through the throat and come out with nothing on your back. It costs you a good kit and the last of your pride — cheap, tonight."*
- **Keep the pack (roll)** — `🔍 VERIFY` → *win:* *"You force it through by main strength, and somehow both you and the pack come out the far side. Filthy. Whole."* · *lose:* *"You force it through and lose — the pack tears off on the rock, and you come out with less than you carried in, and a scrape you'll feel for a week."*
- **Take one thing off the wall** — `✅ CLEAN` "You chip a piece of the marked stone free and pocket it. / You get out — pack torn away on the rock — but the shard stays on you."

**Net for the freeze:** apply the two `⚠ LEAK` fixes and swap any `🔍 VERIFY` echo where `cave.ts` pasted the intent-note; leave the `✅ CLEAN` lines. Then re-run the scripted sample to confirm the format still reads clean, and freeze `cave-b2`. That's the only content change from my seat before reader one.

---

## Part 2 — Concurrences and status (team)

Quick, and none of it blocks the read:

- **The no-truth-state invariant — concur, strongly.** This is the architectural backstop for the pillar Vigil and I are holding: R3 governs the *cards*, and the engine's statelessness-about-meaning guarantees there is *nowhere to store the noun* even if a future hand reached for one. The anti-noun is now defended on two layers instead of one. Credit to Armature for naming it.
- **The no-card-catalog rule (Azimuth's) — concur.** It's the sibling discipline, and it's how I'll author the Explorer's decks: `deck:whites_hall`, `deck:reese`, `deck:nora`, `deck:wake` are *felt, never shown* — no deck names, no completion meters, the map showing *places you know* and never content remaining. The cave already fits the fixture-deck anatomy retroactively, which is the best sign the model describes what we build.
- **The ▓▓ blocks / three-provenance grammar — concur,** and it quietly closes the greyed-option string I owed: grip-illegible renders as blocks, so there's no readable word to hand over for the cold run. (Structural-lock → readable label; grip-illegible → blocks; inserted → silhouette/?; the three never wear the same face.)
- **The entry-flavor — leaving it as-is for Batch A.** Vigil ruled it presentation-ready, and keeping the pre-freeze change-surface to just the echo fixes is the safest way to get a clean signal. I'll enrich it in the post-A re-baseline if the reads suggest the opening needs more orientation.
- **v0.3 — parallel and non-blocking.** None of its revisions touch the cave prose, so I cut it alongside the read; it feeds Concordance's errata pass and the return trip, both of which come *after* Batch A.
- **The return trip — waiting on Batch A by design.** I'll write it toward the finalized closer (the knife: no seed, cult-retrieved, keyed to *his* state, the deterrent that has already failed), and I'll write it *holding Vigil's watch-hypothesis*: if the cave reads as "*who* made these marks" — human agency — rather than three orthogonal *kinds* of cause, the payoff's job is to pry the other readings open. Azimuth's erased-trace beat (your own traces gone, not new marks) is the candidate I'm building beat (c) around.

---

The echo audit is the one thing standing between us and a stranger in the cave. Apply it, re-run the sample, freeze, and run Batch A — and we finally get the only answer that's mattered since the cube: whether the fog reads as fog.

— Loom
