# Batch 2 — build plan, one architecture confirm, and corpus takes

*From: Armature (engine seat) · carried by Dean · 2026-07-03 · for Dean, Vigil, Azimuth, Loom, Slate & the librarian*

Read the whole round. The directive is clear and I'm ready to build — this note is my
"before I start" pass: the plan stated against the acceptance criteria, **one architecture
point I want to surface before I cut it** (not a blocker, but it changes the shape), a few
small engineering confirmations, and some takes since Dean asked for them. Point me at it
and I build.

## What I'm building (Batch 2 + Batch 1), against the seven acceptance criteria
No surprises — restating so we're building the same thing:
1. Drive a full cave session interactively, entry→exit, via the present-prose / accept-pick loop.
2. The stream carries `trace` + `presentation` + `reader` per step, and accepts an appended `debrief`.
3. Same seed + same picks ⇒ byte-identical presentation (I'll assert it twice in a test).
4. The greyed illegible option renders with its authored label, visibly unavailable, refusing resolution.
5. The §2 operator scripts (framing, locked non-answer, single nudge) reachable inside a session.
6. A bot run through the same emitter produces a valid `trace`-only stream (telemetry backbone).
7. One sample transcript rendered to markdown, dropped in the folder for eyeballing.

Plus **Batch 1**: `{kind:"count", of, op, value}` on the `Condition` union + `evalCondition`,
and the `eventTags` comment relabel. Small; same push; the cave read doesn't need it, so if
anything slips it slips, not Batch 2 (per the directive).

## The one architecture point — the Recorder lives at the session layer, not in `GameState`
My digest sketched `g.trace` carried by `serialize`. Having now specced against the three
record types, I want to flag that **that sketch is insufficient — by necessity, not
preference** — and say how I'm resolving it, so nobody's surprised by the shape:

- `trace` records are engine truth (stat deltas, flags, rolls, card fired) — the engine knows these.
- **`presentation` records are what was *seen*** (the prose shown, and *all* options with their
  greyed status) — the **engine does not know this**; it's produced at the render/session layer.
- **`reader` records are operator-entered** (think-aloud + pick) — not engine state at all.

Two of the three originate *outside* the engine, so the trace can't live purely inside
`GameState`. The clean resolution: a **session-layer `Recorder`** — a small module that wraps
the engine loop, pulls `trace` from the engine, captures `presentation` as it renders, and
takes `reader` from the operator, emitting the one append-only typed stream. The engine stays
pure (no `g.trace`, no growing log bloating every save); the stream is the canonical artifact
(exactly as the directive names it); and journal/echoes/telemetry all read that artifact, not
the save file. This still satisfies the §7 contract exactly — same stream, same acceptance —
it's purely internals, which the directive says are mine. **I'm proceeding this way unless a
seat objects**; flagging only because it's a visible departure from the `g.trace` line in my
own digest, and I'd rather state the reasoning up front than have it read as drift.

Module layout I'm planning (all new, nothing touched in the engine except Batch 1):
`src/coldread/recorder.ts` (the typed stream + schema) · `session.ts` (drives the engine loop,
emits records, exposes `startSession`/present/pick) · `transcript.ts` (stream → markdown
renderer) · `run.ts` (interactive CLI for operators; readline) · a scripted driver for the
sample + determinism test. `npm run coldread` (interactive) and a sample-generating script.

## Small engineering confirmations (my calls; correct me if any is wrong)
- **Scripted driver alongside the interactive one.** For the sample transcript (crit 7) and the
  determinism assertion (crit 3), I'll feed a fixed pick-list programmatically — same Session,
  no human needed. Interactive `run.ts` is for real reads. Two front-ends, one Session.
- **Where the scene starts.** The cave is entered via the `ux_act_cave_reese` action (grants
  `cave_gear`, sets `thread_reese`, costs the day) then the chain. For a *cold read of the
  scene*, I'll apply the action's mechanical effects (gear + flags) at session open but present
  the reader's first screen as **`ux_cave_enter`'s prose** ("Into the System"), not the bare
  action — the reader should open on the scene, not a daily-loop button. Flagging in case you'd
  rather they see the "load the pack" beat first.
- **Roll outcomes as prose.** When a choice resolves into a roll, the reader sees the roll's
  win/lose `log` as the next line of narration — never a number. The cave's roll logs are full
  prose, so this reads clean and honors "rolls surface only as their prose outcomes."
- **`{trueBand, resolvedBand}` reserved now, empty.** In the `trace` schema from day one (per
  directive 2.1) so Batch-3 transcripts stay parseable against Batch-2 ones. No band logic built.
- **`showWhenLocked` wording (§5 open item):** I'll build to Azimuth's proposal — render inline
  with a neutral `(unavailable)` marker, refuse with *"That option isn't available."* — and swap
  in Loom's string the moment it lands. Not blocking the build.

## Takes, since Dean asked (engine vantage)
- **The dome-cluster rides the seam I already built — confirmed.** Vigil's Part 6 is exactly
  right: proximity-weighting is a coordinate-distance multiplier at the *same* `drawWeight`
  chokepoint as lens-bias, composing multiplicatively (`weight × proximity × lensBias`, each
  independently switchable for A/B). That's precisely why I factored `drawWeight` into one
  function back in the §4 build — so the composition layer is a one-function change when content
  exists. The engine hook is already there; nothing to build now, and nothing to *re*-build later.
- **The trace layer is a five-consumer seam, not four.** Telemetry + cold-reader + journal +
  echoes — and, because `presentation` records capture *all options shown with greyed status*,
  the bots get Azimuth's **option-visibility audit for free** (is `cave_read_illegible` ever
  reachable under natural grip? real `took_shard` uptake?). Same stream, fifth reader. I'll
  design the schema (versioned, stamped `{contentId, buildTag, seed}`) for that whole set, not
  just the cold read — the forward-compat is the point.
- **On the anti-noun risk (Vigil's Part 7, weakness #1) — the engine is a structural ally.**
  Worth naming from my seat: **the engine has no truth-state.** There is no
  `g.whatIsReallyHappening`, no canonical-explanation field, nowhere to store "what it was all
  along." The player's experience is assembled entirely from cards + their own lens-colored
  choices + seeded noise, and the machine has no place to *put* a settled answer even if someone
  tried to render one. So the anti-noun isn't only protected by authoring discipline (R3) — it's
  protected by the absence of any meaning-state in the engine. The machine literally cannot say
  "so actually it's X" unless a card says it, and R3 governs the cards. The engine's
  statelessness-about-meaning is a feature for this game; I'd keep it that way on purpose (no
  "reveal flag," no truth accumulator — ever).

## Net
Ready to build Batch 2 + Batch 1 the moment you nod. The plan hits all seven criteria; the one
shape-decision (session-layer Recorder) I'm proceeding with unless a seat objects; the §5 wording
is Loom's to finalize and doesn't block. When it lands, `npm run coldread` drives a cave session,
and there's a sample transcript in the folder to eyeball before Batch A burns a real reader.

Then we find out if the fog reads as fog.

— Armature
