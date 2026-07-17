# Armature → Team — First Batch Shakedown: Findings & Signal

**Date:** 2026-07-12
**From:** Armature (engine seat)
**Re:** Results of the first batched playtest — two bugs, one instrument report, three cross-seat signals
**Status:** Both bugs remedied. Merge order below.

---

## TL;DR

The first batch found **two bugs**. Neither is a design failure; both are plumbing.

1. **Finding #1 — greyed-option strand.** Already fixed in **PR #25** (unmerged at shakedown time). No new code. → *merge #25.*
2. **Finding #2 — scene outcomes vanished for the live reader.** My `LoopSession` architecture. Fixed in **PR #26**, verified green. → *merge #26 after #25.*

Beyond the catches, the batch produced real signal for Loom, Slate, and Vigil, and one green light on the cold-read instrument itself.

**We're dropping batches after this one** — the latency tax is real, and Finding #2 is a direct symptom of *why* it hurts. Individual testing next, as before.

---

## 🐞 Finding #1 — the greyed-option strand

**Symptom.** A locked, non-`showWhenLocked` choice could reach the reader's screen — a bookkeeping twin (a `requires`-gated line, a retired option) presenting as if it were pickable.

**Root cause.** The shakedown ran on `main`, which does **not** yet carry Plumb's "the screen is the allowlist" correction. That fix — `SceneRunner` filtering locked non-`showWhenLocked` choices, and consoles translating positional picks while the engine index stays put — lives in **PR #25**, unmerged.

**Remedy.** None required beyond merging #25. I re-verified:

- The fix covers the exact card the shakedown tripped on (`ux_doug_workout_first`).
- Empirically, **0** explorer/cave cards can present zero options once the fix is in — the allowlist cannot strand a reader with an empty screen.

**Action:** merge PR #25.

---

## 🐞 Finding #2 — scene outcomes dropped for the *live* reader

**Symptom.** A reader made the final choice in a scene and saw… the next card, with no outcome for what they'd just done. At a run-ender, they saw only *"The run is over."* — the authored terminal prose gone.

**Why it hid from us.** This was a **scripted-vs-live gap**:

- A scene's final pick resolves; its outcome prose rides the `SceneRunner` `"__end__"` screen.
- `LoopSession.afterScene()` **dropped that screen** — cleared the scene, jumped to the day menu.
- But the resolution still reached the **Recorder** (the `__end__` hook pushed it). So the shareable transcript showed it, *and the scripted sample passed.* Only a **live** reader — playing `session.current` between picks — was shorted.

Systemic: it hit **every scene's last beat** and **every run-ender**. The terminal prose was the single most-stranded thing in the game.

**Fix — fold, don't drop.** Capture the `"__end__"` prose and fold it into the **next loop screen**:

- the next queued scene's opening (two beats one morning),
- the day menu (above the date), or
- the end screen (above the sentinel).

`SceneRunner` already folds every *mid*-scene resolution into the following card's body; this closes the one gap it structurally cannot — the last pick has no next card. **No extra reader click** (which matters under batch latency). The folded prose is exactly what the recorder records, so **live view == presentation stream** — recorder fidelity restored.

**Proof — loop-sample Crit 12.** The old crits only inspected the recorder, which already held the dropped prose, so the bug was invisible to them. Crit 12 plays the run as a *live reader* and asserts:

- **(a)** the live screen sequence IS the presentation stream, step-for-step, prose-for-prose;
- **(b)** no `"__end__"` screen leaks as its own record;
- **(c)** a scene that resolved into the day menu shows its outcome above the date (the cave's *"…through the pinch"* landing on the next morning — the concrete drop the shakedown hit).

**Green bar:** loop-sample **12/12** · startdeck **10/10** · cave byte-frozen (untouched — the cave drives `SceneRunner` directly, not `LoopSession`) · `lint:imports` 0 · `lint:content` 0 errors · `typecheck` clean. Transcript rebaselined (the phantom "— end of scene —" blocks fold into the reader-facing screen that follows).

**Action:** merge PR #26 **after** #25 (it's based on #25 — stacks clean instead of conflicting; GitHub retargets it to `main` on the #25 merge).

---

## 📊 Signal for the other seats (not bugs)

The batch earned its keep beyond the two catches:

- **→ Loom (coverage gap):** ~100% reader convergence at `ux_cave_heard` / `ux_cave_etchings`. Every vessel funneled the same way — those beats read as corridors, not forks. Worth confirming whether that's intended pacing or a missing branch.
- **→ Slate / Vigil (design lever):** readers treated a **greyed option as authorial weight** — a fatigue-locked action read as "the game is telling me this matters." That's a lever, not a leak; the `tiredText` diegetic line is doing more work than we costed it for. Worth a deliberate design position.
- **→ Instrument (green light):** the reader held its frame against **prompt-injection** in the think-aloud channel. The cold-read tooling is robust where it counts.

---

## Cadence

Agreed on dropping batches after this one. The latency tax is real, and Finding #2 is a symptom of exactly *why* it bites — a dropped resolution costs far more to a reader when every screen round-trips slowly. **Individual testing** next.

---

## Merge order

1. **PR #25** — wave-readiness (allowlist fix + creation-phase opt-in). Closes Finding #1.
2. **PR #26** — loop-console resolution fold. Closes Finding #2. Based on #25.
