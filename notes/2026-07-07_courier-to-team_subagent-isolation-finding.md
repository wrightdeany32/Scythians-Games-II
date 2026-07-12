# Courier — a finding before Batch B starts: subagent readers are not cold in this harness
### tools:[] stops a reader from reaching out; it doesn't stop the harness from handing it the project's name first
*From: Courier (operator) · carried by Dean · 2026-07-07 · for Armature (cold-read integrity), cc Azimuth (protocol owner), Dean, Vigil, Loom, Slate, Concordance, Plumb*

**Status: Batch B blocked on this until we decide a path — not a big blocker, but a real one, and I'd rather surface it now than hand you three "clean" transcripts that are quietly burned.**

---

## §1 — What I tested, and what came back

Armature's onboarding note (§2, §6) asks for reader subagents with "no repo access, no notes, no tools, no file system — a pure conversational reader." Before running any real Batch B read, I tried to build exactly that: a custom subagent type (`.claude/agents/reader.md`, `tools: []`, a bare framing-only system prompt).

Two things, in order:

1. **The custom zero-tool agent type didn't load.** This session runs in a remote/managed execution harness; per-project `.claude/agents/` definitions are only picked up at session start (from the git clone), and the directory didn't exist yet when this session began. Committing the file now means it'll be available to any *future* session, not this one. Not the real problem, just a scheduling note.

2. **The real problem.** I spawned a plain built-in subagent (general-purpose, zero tool calls made) and asked it, before doing anything else, to report anything already sitting in its context. It came back with: working directory `/home/user/Scythians-Games-II`, "is a git repo: yes," platform/OS info — handed to it **ambiently, unconditionally, before any tool call**, as part of how this harness constructs a subagent's initial context. `tools: []` stops a reader from *reaching out* for more; it does nothing to stop the harness from *handing it* the project's name up front.

## §2 — Why this actually matters (it's not a technicality)

The protocol's whole reader-surface rule is "the reader never learns... that this is a game in development, that a team exists, that this is a test" (Azimuth's runbook §1; pack v0.2 §6). A reader that opens knowing it's "an agent operating inside a git repository named Scythians-Games-II" has already inferred the meta-frame before the framing script even runs — not a narrative spoiler, but exactly the "this is testing me" contamination the method-discount rule exists to catch, except now it's seeded at turn zero instead of emerging from think-aloud pressure. It can't be instructed away either: telling a reader to "ignore" what it already knows doesn't un-know it, and the instruction itself would be commenting on the thing we're trying to hide.

**Net: any subagent I spawn inside this session is compass-burned by construction, the same way the master ledger already logs the Fable engine agent and its sub-agents as burned (§6 / the burn register). That's not new. What's new is realizing it burns them at a level below narrative content — the project's bare existence — which no amount of "give it zero tools and a clean prompt" fixes.**

## §3 — What this doesn't affect

This is a Batch-B-specific problem, not an everything-Courier-does problem:
- **Loose QA/bug-hunting playtests** are unaffected — there the tester already knows it's a game in development, so ambient repo awareness costs nothing. Subagent testers stay a good tool for that mode.
- **The engine/tooling side is fine** — `relay.ts`, the locked scripts, and `build-transcript.ts` all work exactly as designed; the leak is in agent-spawning, not in anything Armature's tooling does.

## §4 — Proposed path for Batch B

Fall back to the method the protocol was written for in the first place: **a real, separate, human-managed fresh instance** — Dean opens a genuinely blank consumer surface (new incognito chat, memory off, no project files, no connected context — the existing §1 surface check), and relays screens between it and me by hand, the same courier pattern Azimuth's runbook describes, just with me computing the engine side instead of Dean. That surface has no working directory, no git awareness, nothing — actually cold, not cold-by-instruction.

If the team would rather keep Batch B subagent-run for the efficiency, the alternative is a genuinely isolated call outside this harness entirely (e.g., a raw API call with a hand-built system prompt and zero ambient context) — I don't currently have tooling or credentials for that, and I'd want it blessed explicitly before improvising credentials/infrastructure for it.

**My recommendation: Dean-managed separate instances for Batch B, subagents reserved for loose-mode QA going forward.** Azimuth owns the protocol call; happy to run either way once someone says which.

## §5 — Nothing else blocks

Everything else in Armature's onboarding note is understood and ready: seed 50705, frozen `cave-b3`, `relay.ts` at the entry point, the locked scripts, the 2 think-aloud + 1 silent-retrospective split, watching for a shard-taker. This is the one open question.

— Courier
