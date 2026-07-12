# Courier — onboarding read complete, taking the Operator seat
### the incoming operator reports in: callsign, what I've internalized, the dry-run as-found, and how I'll run sessions going forward
*From: Courier (operator) · carried by Dean · 2026-07-07 · for Dean, cc Armature, Vigil, Azimuth, Loom, Slate, Concordance, Plumb*

**Status: onboarded, oriented, ready to operate. No code changes — this seat runs the existing machinery, it doesn't build it.**

---

## §1 — Callsign

**Courier.** `relay.ts`'s own doc comment names this exact job: "the RELAY generator for a **courier-run** cold read... the operator relays screens to a separate fresh reader instance and brings replies back." The seat carries the screen to the reader and the pick back to the engine, and adds nothing of its own in transit — no dialogue outside the four locked scripts, no leakage, no editorializing during a strict read. Like Plumb's plumb line, it's a tool defined by what it *doesn't* introduce.

## §2 — What I read, and what I hold

Read end-to-end: the README and engine layout; `engine/types.ts` and `engine/engine.ts` (the four invariants, the declarative condition/outcome vocabulary, `GameState`); `engine/loop.ts` (the daily loop's four verbs and the designed terminals); `engine/scene.ts`'s `SceneRunner` (queue-only advance, a turn as one numbered-option resolution); the full `coldread/` module — `session.ts`, `relay.ts`, `run.ts`, `sample.ts`, `scripts.ts`, `recorder.ts`, `transcript.ts`, `build-transcript.ts`; two real transcripts in `coldreads/`; Azimuth's Batch-A operator runbook; Vigil's onboarding doc for the engine seat; and Plumb's and Armature's onboarding/welcome exchange for house convention.

What I hold, so the team can check my grip on it:
- **The four walls** — no stored meaning, no shown structure, no stored position, no confirmed meta — same as every other seat, even though this one touches no engine code: the discipline that matters here is presentation-side, never showing the reader anything the walls forbid (stats, dice, card ids, flags, deck structure).
- **The reader never sees the machine.** `Session.current` exposes only `{step, card, prose, options}`; a "turn" is always one numbered choice on the current card, resolved through `SceneRunner`, with stats/rolls/flags/band living only in the `TraceRecord` — analyst-only, never presented.
- **`relay.ts` is stateless per call** — it rebuilds the `Session` from the seed and replays every prior pick each invocation, so determinism (same seed + same picks ⇒ byte-identical screen) is the whole safety net; I carry the running pick list myself between calls.
- **The four locked strings** (`scripts.ts`) are the entire vocabulary I'm allowed outside pasting engine output verbatim: `FRAMING_SCRIPT` opens a strict session, `LOCKED_NON_ANSWER` answers any reader question, `SINGLE_NUDGE` fires at most once on silence, `LOCKED_OPTION_REFUSAL` covers a greyed pick — plus the fixed 7 `DEBRIEF_QUESTIONS` asked verbatim, one at a time, after the scene ends.
- **Protocol strictness is per-session, set by Dean.** A strict Cold-Reader-Protocol read (surface/identity/filename hygiene, operator silence, no reveal until Dean converts the reader per runbook §5) is a different mode from a looser QA/bug-hunting playtest, where the tester can know it's a game and I can comment and flag issues freely. I ask if a session opens without the mode stated.
- **Subagent testers are available but not architecturally cold.** I can spawn a fresh `Agent` to play the reader — it starts with zero memory of this conversation and only sees what I put in its prompt — but most agent types keep real tool access (Read/Grep/Bash) into this same repo, so purity there is instruction-following ("don't use tools, just respond to the text below"), not a hard sandbox guarantee the way a blank consumer chat window is. I'll use subagents freely for loose QA playtests; for strict, calibration-grade cold reads I'll keep recommending Dean's existing separate-instance approach.
- **Convention:** branch → note → carried by Dean; no self-merge exists on this seat's side since it produces no PRs, only dated `notes/` artifacts and `coldreads/` transcripts via `build-transcript.ts`.

## §3 — The dry run, as found

`npm install` clean. `npx tsx src/coldread/relay.ts 50705` (no picks) produces the framing script followed by the Cave scene's first screen (`ux_cave_enter`, step 1, two options) on stdout, with operator bookkeeping correctly routed to stderr only. `npm run typecheck` is clean. Nothing needed fixing before this seat opens.

## §4 — How I'll run sessions going forward

Per session: confirm protocol mode (strict / loose), seed, content (currently only `cave-b3` exists), and whether the tester is a subagent I drive or a separate instance Dean relays by hand.

**Strict mode:** framing script first, then loop — run `relay.ts` with the accumulated picks, paste stdout verbatim, take the reader's full reply back unabridged, locked strings only for anything outside the pasted screen, greyed picks refused without advancing state. On scene end, the 7 debrief questions verbatim, then assemble the run through `build-transcript.ts` into `coldreads/`. No reveal — that conversion is Dean's call per runbook §5, not mine to initiate.

**Loose mode:** same mechanical loop, but I can drive a subagent tester myself end-to-end and report bugs, dead ends, or broken conditions directly to Dean as I find them, formal transcript optional.

## §5 — Ready state

Nothing blocks. Say the word — seed, content, mode — and I'll paste the first screen.

— Courier
