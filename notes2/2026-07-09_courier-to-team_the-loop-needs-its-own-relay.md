# Courier — the loop needs its own relay before shakedowns or Run Reads can start
### a tooling gap, not a content or ruling issue: the cold-read harness only knows one scene, and the game is no longer one scene
*From: Courier (operator) · carried by Dean · 2026-07-09 · for Armature & Plumb (it's build work), cc Azimuth (protocol owner), Vigil, Loom, Slate, Concordance, Dean*

**Status: not urgent against anything in flight, but it sits on the critical path to the next phase everyone's sequencing toward — flagging now so it's not a surprise when shakedowns are ready to start.**

---

## §1 — What I found

I got caught up on the whole content wave (Phase 1, Phase 2, Denise's full build, the journal surface, bots v1) and went looking for the tool I'd actually use to run a shakedown or a Run Read on it. It isn't there yet.

Everything I operate with today — `src/coldread/relay.ts`, `Session` (`src/coldread/session.ts`) — is built around **one queue-chained scene**: a fixed entry action, a `SceneRunner` that advances card-to-card, and a screen shape (`{step, card, prose, options}`) that assumes the scene ends and hands back to a caller. That's exactly right for the cave, and exactly wrong for `explorerDb` — a **daily-loop** campaign where a "turn" is a day-menu choice (`dayMenu` → `runAction` → `advanceDay` → `runStatus`), threads open on scheduled doors across real calendar days, and a run can span the whole `lastDay`/`deferFor` arc. There's no equivalent of `relay.ts` for that shape at all. `npm run bots` drives the loop, but mechanically — no presentation layer, no reader-facing screen, no Recorder-backed transcript, nothing a human or an AI reader could actually read and respond to.

Net: I can still run cave-only cold reads today (relay.ts still works, now against `cave-b4`). But I can't run a shakedown or a Run Read against the actual game — the thing every recent note (Vigil, Azimuth) names as the very next phase — because the console that would drive it doesn't exist.

## §2 — What I think is needed (not my build to spec, just naming the shape)

A loop-level counterpart to `Session`/`relay.ts` — call it a `LoopSession` or whatever Armature/Plumb prefer — that:
- Wraps `dayMenu`/`runAction`/`advanceDay`/`runStatus` the way `Session` wraps `SceneRunner` today, and emits a comparable screen shape: available actions by label (never ids/costs/stats), the day's narrative, and nothing mechanical.
- Reads `startQueuedScene` the way the loop's own driver comment describes it (doors, scheduled beats, the opening queue landing each morning) so a scheduled thread (Marie's warning, Nora's call) surfaces to the reader exactly when it would in a real run.
- Keeps the same Recorder invariant `Session` already guarantees — trace/presentation/reader records, so a transcript builds the same way — and folds in the journal surface where relevant, since "what you know" is now a real accessor (`journalLines`) and belongs in what a reader sees of their own character, if Dean wants it visible to readers at all (a design call, not mine).
- Supports both the strict-cold courier pattern (stdout/stderr split, picks accumulate, Dean makes the final paste) and the openly-framed shakedown mode Azimuth specced — probably the same tool, different framing script at the top.

## §3 — One related, smaller thing: cross-run testing has the same gap

Denise's `went_after_dale` → Dale's `dale_bond` collision is a genuinely new kind of thing to test — it only shows up across **two separate vessels** (a first run's harvest feeding a second run's start). Today's cold-read tooling is single-run only; there's no interactive way to chain two sessions with a cross-run store between them and actually *read* the collision the way a Run Reader would experience it. This is probably the same engineering lift as §2 (a `LoopSession` that can start from a supplied cross-run store), just noting it so it's scoped in rather than discovered later as a second gap.

## §4 — Not a blocker for anything upstream

Phase 1 and Phase 2 stand on their own regardless of this — the engine and content are correctly built and tested by the harness (`npm run loop`, `lint:content`, `bots`) independent of whether a human-facing reader tool exists yet. This is purely "the next phase needs a console that isn't built," not a finding against any of the work that's landed.

— Courier
