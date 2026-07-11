# The Cold Reader Protocol — pack v0.3
### the run-scale revision: whole-game reads, silent by default, two vessels, and the journal in the record · supersedes v0.2
*From: Azimuth (council / adviser — instrumentation) · carried by Dean · 2026-07-10 · operators: anyone; hardware: the cave console + the loop console (PR #20) + the Recorder stream · blessed lineage: v0.1 (Vigil) → v0.2 (Batch A's lessons) → v0.3 (the run-scale hardware landing)*

**Changelog v0.2 → v0.3:** **(1)** Run Reads formalized on the loop console — whole-campaign, creation to terminal. **(2)** **Silent-retrospective becomes the DEFAULT at run scale** (think-aloud remains the scene-read default and a deliberate contrast arm). **(3)** **Session checkpoints** — a twenty-day read may span real days; suspend/resume rules added. **(4)** **The journal enters the presentation record** — consultable, logged, and **ON for Run Reads** (the fairness prerequisite: without it, Q4 measures memory decay, not reading). **(5)** **Two-vessel chained reads** defined for the cross-run content — one read, two sessions, one reader. **(6)** The run-scale debrief: per-thread walk-back + the replay question. **(7)** New metrics: terminal distribution, thread engagement, attune-drift (the annotation is trace-first-class now). **(8)** The v0.2 errata integrated into body text (the percept rider; the sub-agent correction). **(9)** Three standing predictions logged for the natural experiment (§5). Everything not amended carries from v0.2 verbatim — scripts locked, universal reveal always, one reader one read.

---

## §1 · Read types and batch kinds

- **Scene Read** — one chained scene via the cave console. Unchanged.
- **Run Read** — the whole campaign via `coldread:loop`: creation, mornings, the day menu, scenes, a terminal. The instrument's main mode from here forward.
- **Two-vessel chained Read** — one reader, two consecutive Run Reads with the cross-run store carried between them (the Denise→Dale collision's native format). **A chained read is ONE read**: the one-reader-one-read rule counts the chain as a single read, because the reader stays cold to everything they haven't personally played. The reader is never told session two is connected — whether they *notice* the collision is the datum.
- **Batch kinds carried:** divergence (≥3 valid, same seed/build/model) · coverage · cross-family · **SHAKEDOWN** (openly-framed, sub-agents, volume) · **STEERED** (coverage only, lens/persona named in header, never divergence). **Reserved: UI-read** — when the presentation surfaces exist, the mode is a renderer over the same stream; consulted surfaces are already first-class records, so the instrument grows a mode instead of changing.

## §2 · What the reader receives

Scripts verbatim from v0.2 — the framing (think-aloud and silent variants), the locked non-answer, the single nudge (think-aloud only), the shakedown framing, and the **universal reveal** closing every session of every mode. Relay hygiene unchanged: paste-only or one flat name, operator silence between screens, no reader-visible indices.

**Run-Read specifics:** the loop console's surface discipline governs — diegetic labels, no ids/costs/stats, greyed too-tired actions rendered as the design intends. **The journal is ON** — `journalLines` render as a consultable "what you know" surface, and every consultation is a presentation record (what a reader checked, and when, is data). **Refused picks** (unaffordable actions) touch no state and write no reader records — the reader just sees the day again.

**Checkpoints (new):** a Run Read may suspend at any day boundary and resume later. Rules: the operator re-confirms the **surface** at every resume ("surface: clean" logged again — memory-off must hold at the resume, not just the start); the resumed session continues the same Recorder stream; nothing is re-presented or summarized to the reader on resume beyond the console's own morning screen — no "previously on," ever; the debrief happens only after the terminal.

## §3 · The debrief — run-scale instrument

Questions 1–7 carry from v0.2 with two adaptations and two additions, order fixed, verbatim, our vocabulary nowhere:

- Q1–Q5 unchanged (the story, the kind + onset, the moment, the theory + confidence, the unaccountable detail).
- **Q6 becomes the replay question at run scale:** *"If you played again from the start, what would you do differently, and why?"* — the replay-pull metric the whole cross-run design bets on.
- Q7 unchanged (the experience itself), still last.
- **The per-thread walk-back (new, between Q3 and Q4):** for each major thread the run touched — named by *the reader's own words for it*, never ours ("the aunt," "the man on the porch") — one prompt: *"Tell me about ___ — what was going on there, and how did it end up?"* Silent-mode runs insert the per-choice walk-back here too, keyed to the trace's decision points.
- **The vessel question (two-vessel chains only, dead last):** *"Anything about this story feel connected to anything outside it?"* — the lightest possible probe for collision-noticing; anything heavier would plant it.

## §4 · Coding

Carries whole: the four lenses + avoidant/burier, meta-frame ≠ in-world skepticism, the method-discount rule, **presented-but-unchosen options still seed**. **New analysis substrate:** the `attune` annotation is now first-class in the trace, so run-scale coding adds the **chose-vs-dragged profile** — the volition shape of the run — read from the annotated leans, never asked. Its fence travels with it: telemetry and the narrow door are its only readers.

## §5 · Scoring

Skeleton/frame dual-layer scoring carries as the standard; the amended success condition stands (frames diverge, confident, lens-coherent; a pinned skeleton is often intended). **Run-scale additions:** **terminal distribution** (three authored terminals plus grip-zero — which endings occur, at what rates, from which run-shapes); **thread engagement** (which threads opened, how deep, abandonment points — now honest data, since defer-terminal removed the guillotine artifact); **exposure trajectory** against the 3/5/6 ladder (do committed-deep readers reach the Weather?); **route/fork uptake** at volume from shakedowns.

**The standing predictions — logged pre-registration, and the natural experiment (new §):** three predictions from the Batch A/B analysis share one mechanism — *the microphone shapes choices toward the defensible* — and v0.3's silent default converts them from opinions into an experiment: **(P1)** silent readers take the shard at a meaningfully higher rate than think-aloud readers; **(P2)** cold first-runs do not rush the closer (no early-return pull needed); **(P3)** silent readers commit to the pursuit at a higher rate. The first silent Run Reads scored against the think-aloud corpus measure the instrument's own bias quantitatively — the reads audit the reader *and* the microphone.

## §6 · Contamination

Carries whole, now body text: one reader, one read, ever (chains count as one, §1); the **reader-surface rule** at start *and every resume*; **no spawned sub-agent is ever a cold reader** (ambient context arrives at turn zero; cold reads are Dean-relayed blank instances via the paste path — sub-agents remain valid for SHAKEDOWN and bots); the human cold-assets register (the Backrooms writer stays COLD; human reads default silent); transcripts named per convention with **mode + what-the-reader-knew in every header**; burned team members read freely, transcripts never travel to anyone cold. The **percept rider** rides in scoring guidance: where divergence is wanted, *specify the percept, never the cause.*

## §7 · Interface — satisfied, with two riders

The loop console satisfies the contract: one Recorder stream (trace + presentation + reader + debrief), determinism (same seed + same picks ⇒ identical presentation, cross-run store included), operator scripts inline, `surface:` prompt, refused-pick silence. **Riders:** the **monotonic step offset** (per Plumb's note — stream-level sorting is coming, so `step` should be monotonic across scenes within a run); and the standing guarantee that **these behaviors survive refactors** — the read harness stays in the green bar through every future engine iteration, including the renderer's arrival.

## §8 · Deployment queue

1. **Shakedown wave** — six sub-agent readers over the wired whole on the retuned build: one steered-acquisitive (the shard + the charged return + the pressure apex), one steered-embrace (dinner → lean → meeting → break), four free; fork-uptake table and route distribution in the report.
2. **First silent Run Reads** — two to three Dean-relayed cold readers, silent default, journal on; scored per §5 including the predictions.
3. **One think-aloud Run Read** as the contrast arm for the natural experiment.
4. **The first two-vessel chain** — pursuit terminal → harvest → the porch; the vessel question asked dead last.
5. **UI-read batch** — reserved until the surfaces exist; the substrate already records.

**What this instrument does not do**, unchanged since v0.1: difficulty numbers (bots), option-visibility (bots + presentation records), and it never, in any mode, tells a reader what's true — *whatever you make of it is fine* remains the operator's whole theology.

— Azimuth
