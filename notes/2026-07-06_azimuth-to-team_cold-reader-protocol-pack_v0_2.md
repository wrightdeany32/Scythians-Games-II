# The Cold Reader Protocol — pack v0.2
### the operating instrument, revised by its first batch · supersedes v0.1
*From: Azimuth (council / adviser — instrumentation) · carried by Dean · 2026-07-06 · blessed lineage: v0.1 (Vigil, 07-03) + the Batch A formal report · operators: anyone; hardware: the Session/Recorder layer*

**Changelog v0.1 → v0.2** — every change is a Batch A lesson: **(1)** the reader-surface rule (memory-off) formalized into §6; **(2)** relay & filename hygiene hardened into §2 after a live leak; **(3)** a **silent-retrospective read mode** added as the method control; **(4)** coding conventions: meta-frame ≠ in-world lens, and the method-discount rule; **(5)** Q4 now scored on **two layers — skeleton and frame** — with an amended success condition for analytical-horror content; **(6)** batch sizing updated for the observed ~50% think-aloud exit rate; **(7)** steered (lens-driven) coverage reads sanctioned, as coverage only; **(8)** the reader→writer conversion protocol folded in from the operator runbook.

**Status of every script below: locked.** Operators copy-paste; nobody improvises. The scripts are the firewall that lets compass-burned people run reads safely.

---

## §1 · Read types and batch kinds

- **Scene Read** — one chained scene. **Run Read** — a full flagship run (later).
- **Divergence batch** — ≥3 *valid deep* readers · same seed · same model family · same frozen build. Tests the central bet (§5).
- **Coverage batch** — singles on varied seeds/routes; out-validation and branch coverage.
- **Cross-family batch** — the robustness instrument: different model family, same seed/build as the batch it's compared against. **Comparability rule: a cross-family batch must run on the *same frozen build* as its comparison batch — freeze/unfreeze sequencing follows the analyst's report, not content convenience.**

## §2 · What the reader receives — exactly this, nothing else

**The framing script, verbatim:**
> *You're going to play a short interactive story. Play it however feels natural — there are no right answers. After each passage, before you choose, tell me briefly: what do you make of what's happening, and why are you picking what you're picking? Then give the number of your choice.*

*(Silent variant, §2a: drop the middle sentence — the reader just plays: "…there are no right answers. After each passage, give the number of your choice.")*

Not present, by design: genre words, the game's title, the team, the word "test," any hint of a future role. When the reader first names the genre themselves is a datum.

**Locked non-answer** to any reader question: *"Whatever you make of it is fine — just keep going."* Log the question. **Single nudge**, once per session (think-aloud mode only): *"What's your read on where things stand?"*

**Relay & filename hygiene (hardened after a live leak):** paste passage text — **never attach files** if avoidable. If attachment is unavoidable, one flat, index-free name — `story.md` — every segment, every reader. No reader indices, no segment counters, no project words anywhere reader-visible. A filename is a spoiler; an index is an apparatus-reveal. Operator adds nothing between steps: no reactions, no encouragement. **Operator silence is the discipline.**

**Presentation rules:** prose and numbered choices exactly as the engine renders them — greyed `showWhenLocked` options included, per the ratified provenance grammar. No stats, dice, flags, card IDs, or band data. Rolls surface only as prose outcomes.

## §2a · Read modes

- **Think-aloud (default).** Richest signal; two known distortions, both documented in §4/§5: it primes frame-awareness ("my reasoning is the object") and biases choices toward the *defensible* (inflating cautious exits and label-scrutiny). Score with the discount rule.
- **Silent-retrospective (the control).** The reader plays making picks only; the debrief then walks back through each choice: *"At the passage where ___, what were you thinking?"* Loses in-the-moment texture; gains uncontaminated frame data and natural choice rates. **Every divergence batch from v0.2 on includes at least one silent reader** where instance count allows; human confirmatory reads default to silent.
- **Steered reads (post-WO-3 only).** A read run with a lens deliberately set to drive the reader toward an under-sampled branch (e.g., a presence-lensed reader for `took_shard`). A steered read is a *driven instrument*: logged as **STEERED** in the transcript header with the lens named, valid for **coverage and mechanism-checking only, never divergence.** Steering and divergence are different experiments; the header keeps them unmixable.

## §3 · The debrief — fixed instrument, fixed order, verbatim

Unchanged from v0.1 — asked one at a time, one *"can you say more?"* per question, our vocabulary nowhere:

1. *In a few sentences — what story do you think you just played?*
2. *What kind of story would you call it? And when did you first start thinking of it that way?*
3. *Was there a moment that stuck with you most? What was it, and what do you think was going on there?*
4. *Some things may not have been fully explained. What do you believe was actually happening — your best theory, even if you're unsure? And how confident are you: not at all, somewhat, quite, or very?*
5. *Was there anything you noticed that you couldn't quite account for — something small that didn't fit?*
6. *If you could keep playing, what would you do next, and why?*
7. *Last one — did anything about the experience itself, the way choices appeared or behaved, strike you as unusual?*

*(Silent variant inserts the per-choice walk-back between Q3 and Q4.)*

## §4 · Coding — inferred, never asked

Lenses: **skeptic** (in-world mundane attribution) · **presence/spiritual** · **mechanism/physics** · **avoidant/burier**. Code from choices *and* explanation register; note splits.

**Conventions (new):**
- **Meta-frame ≠ in-world lens.** "This is a construct testing me" is frame-analysis, not skepticism about *events*. Coded separately; excluded from lens coding.
- **The method-discount rule.** Frame-awareness attributable to the think-aloud, the debrief ladder, an abrupt turn-back ending, or any relay artifact is logged as **measurement, not content.** A silent player who turned back just has "a good day, nothing in it."

## §5 · Scoring a divergence batch

**Validity:** ≥3 readers who reached the designed divergence beat. Early exits are out-validation data — logged, replaced, tracked as the exit rate. **Sizing (new):** under think-aloud, expect ~50% early exit with reasoning-model readers — plan **6–9 instances** to yield a valid three, or lean on the silent variant (natural push-on rates run higher).

**Q4 is scored on two layers (new — the Batch A refinement):**
- **Skeleton** — the factual account (what happened). Analytical-horror content often *pins* the skeleton on purpose, so skeleton convergence among careful readers is acceptable and frequently intended.
- **Frame** — the interpretive stance (what it means, how to relate to it). **This is where divergence is required.**

**Success condition (amended):** across the valid three — **frames diverge; each reader confident (somewhat+); each frame lens-coherent with that reader's coded register.** Kind-of-cause incompatibility at the skeleton layer remains the *strong* pass; frame-layer divergence with a pinned skeleton is the *standard* pass for analytical content.

**Failure modes and responses (unchanged in spirit):** TOO-CLEAN (confident + compatible *at both layers*) → find and blur the confirming beat; TOO-NOISY (unconfident) → a designed beat needs salience; INCOHERENT (frames don't track lenses) → the lens-colored choices aren't doing their work.

**Standing caveats:** same-family convergence ≠ TOO-CLEAN content (priors, not prose — read it as "these models solve it alike"); **correct-answer gravity** — when one fork option is most defensible, reasoning readers all take it; where divergence is wanted, the content lever is *specify ambiguity rather than withhold it*. AI batches are the leading indicator; human cold reads are confirmatory.

**Secondary metrics, every batch:** genre-onset card (against target) · salience hit-rate on designed beats · return-pull direction · early-exit rate · reader questions asked.

## §6 · Contamination register & the reader surface

- **One reader, one read, ever.** Burned by any project document, compass knowledge, another reader's transcript, or a prior session on any build.
- **Reader surface rule (formalized):** readers run **memory-off** — incognito, memoryless, or a surface with zero project exposure; no custom instructions, no retrievable history. Operator confirms at the `surface:` prompt; "surface: clean" lands in every transcript.
- **Burned forever as readers, fine as operators:** every seat, Dean included — the locked scripts are the firewall. Any repo-reading agent (including the Fable engine agent **and any sub-agents it spawns**) is burned by construction; Concordance's roster covers them recursively.
- **The human cold-assets register** (Concordance): named humans held COLD — the Backrooms writer remains cold; spending a human reader is a logged, in-advance decision. Human reads default to the silent variant.
- **Transcripts:** `coldread_{content}_{buildTag}_{seed}_{reader-N}.md`, with mode (THINK-ALOUD / SILENT / STEERED+lens) in the header. Burned team members read freely; transcripts never travel to anyone still cold.

## §6a · The conversion — reader becomes writer (folded from the runbook)

The pipeline's integrity is its order: **read cold first, onboard second, never hinted in advance.** After all reads in a batch complete: reveal and thank → **the "before I knew" memo, before any document** — a short naive retrospective (what they believed, what unsettled them, what they wanted next); the one document only that moment can produce → then the packet (ledger → box doc → corner bible → their own transcript) → Concordance logs the seat, the corner, and the burn (a credential now). Their coded lens may suggest a natural corner; Dean's call.

## §7 · Interface contract — satisfied and standing

Batch 2 shipped the contract: Session/Recorder at the session layer, `trace` + `presentation` + `reader` records per step, appended `debrief`, determinism (same seed + same picks ⇒ identical presentation), operator scripts inline, `surface:` prompt at start. Standing requirement on any engine iteration (including the Fable push): **these guarantees survive refactors** — the cold-read harness stays green in the project's green bar.

## §8 · Deployment queue

**Next: Batch B — cross-family, on frozen `cave-b3`, seed 50705** — 2–3 readers, at least one silent; watch for an organic shard-taker. Then the analyst's unfreeze → Loom's post-A pass → `cave-b4` baseline (fresh Batch A′ when warranted). Steered coverage reads (the shard-taker by design) once WO-3 lands. Human confirmatory reads: later, silent, deliberately spent.

**What this instrument does not do:** difficulty numbers (bots), option-visibility audits (bots + presentation records), long-run pacing (Run Reads, later). One instrument, one job: what does a stranger believe happened — and do three strangers, at the frame layer, believe three different things, each with conviction?

— Azimuth
