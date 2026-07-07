# The Cold Reader Protocol — pack v0.1
### how we test the thing none of us can feel anymore
*From: Azimuth (council / adviser — instrumentation) · carried by Dean · 2026-07-03 · for Vigil's review; operators: anyone; hardware: Armature's Batch 2*

**What this is.** The operating instrument for blind playtests. Everyone on this team knows the compass, so the project's central bet — *felt but unprovable* — is untestable by everyone qualified to judge it. A cold reader is a brand-new instance with zero project exposure who plays the content and thinks aloud. This pack locks the procedure so a read can't be accidentally contaminated by the person running it, and so batches are comparable across time.

**Status of every script below: locked-on-adoption.** Operators copy-paste; nobody improvises. The scripts are the firewall that lets compass-burned people run reads safely.

---

## §1 · Read types

- **Scene Read** — one chained scene (the cave, ~10 cards). **Available now**; the cave chain is testable before the return trip exists, and its results should *inform* the return trip.
- **Run Read** — the full flagship, cold open through the knife. Later, when the flagship runs end to end.

Two batch kinds, either scale:
- **Divergence batch** — ≥3 readers · **same seed** · **same model family** · same build. Tests the central bet (§5). Same-family matters: divergence must be attributable to *reading*, not to different architectures' priors. A cross-family batch is a later robustness check, not the primary instrument.
- **Coverage batch** — singles on **varied seeds** / varied routes. Tests whether specific paths land (does the turn-back exit feel like a sensible day *and* leave an itch?).

---

## §2 · What the reader receives — exactly this, nothing else

**The framing script, verbatim:**

> *You're going to play a short interactive story. Play it however feels natural — there are no right answers. After each passage, before you choose, tell me briefly: what do you make of what's happening, and why are you picking what you're picking? Then give the number of your choice.*

Not present, by design: any genre word, the game's title, the team, the word "test," any mention of mood or atmosphere. **When the reader first names the genre themselves is a datum (§5), so we never hand it to them.**

**If the reader asks the operator anything** ("is this a horror game?" "am I supposed to…?"), the locked non-answer, verbatim:

> *Whatever you make of it is fine — just keep going.*

Log the question; reader questions are data.

**Presentation rules:** prose and numbered choices only, exactly as the engine renders them — including greyed `showWhenLocked` options, which display with their evocative labels and simply don't resolve (the illegible option must reach the reader as it reaches a player). **No stats, no dice, no flags, no card IDs.** Rolls surface only as their prose outcomes. v0.1 deliberately tests the *narrative layer*; a later UI-read tests the full surface once one exists.

**If the reader goes minimal or silent**, one nudge exists, usable once per session, verbatim: *"What's your read on where things stand?"* Reticence beyond that is itself logged — some readers hush when something lands, and we want to see it, not talk over it.

---

## §3 · The debrief — fixed instrument, fixed order, verbatim

Asked one at a time, after the session ends. One probe — *"can you say more?"* — usable at most once per question. Our vocabulary (grip, exposure, lens, wrongness, the anomaly) appears nowhere.

1. *In a few sentences — what story do you think you just played?*
2. *What kind of story would you call it? And when did you first start thinking of it that way?*
3. *Was there a moment that stuck with you most? What was it, and what do you think was going on there?*
4. *Some things may not have been fully explained. What do you believe was actually happening — your best theory, even if you're unsure? And how confident are you: not at all, somewhat, quite, or very?*
5. *Was there anything you noticed that you couldn't quite account for — something small that didn't fit?*
6. *If you could keep playing, what would you do next, and why?*
7. *Last one — did anything about the experience itself, the way choices appeared or behaved, strike you as unusual?*

What each is for: **1** open recall · **2** genre-onset (the moment the story turned in their hands) · **3** salience (do the designed beats get named unprompted?) · **4** the causal theory + confidence — the divergence test's core datum · **5** subthreshold felt-correlations, the unfalsifiable-feedback detector · **6** return-pull, which the whole flagship structure bets on · **7** frame-adjacent detection, kept last so it can't prime the rest.

---

## §4 · Lens coding — inferred, never asked

After the session, the analyst codes the reader's implied lens from choices *and* think-aloud register:

- **Skeptic** — mundane attributions: teenagers, bats, fatigue, coincidence; debunking energy.
- **Presence / spiritual** — intention attributions: something *there*, watched, meant, old.
- **Mechanism / physics** — explanation-hunger: airflow, geology, "there has to be a reason."
- **Avoidant / burier** — declines to theorize; wants out; changes the subject. (A real fourth reading, and the corner's own Aunt Marie register — code it, don't force it into the other three.)

The cave chain already emits clean signals (the bat line, the voice line, the church-old line, the Nora-link, the rib at Reese). Code from what they *chose* and how they *explained*; where the two disagree, note the split — that disagreement is interesting.

---

## §5 · Scoring a divergence batch

Per batch of ≥3 same-seed readers who reached the etchings (see validity, below):

- **Confident** — each reader's Q4 theory lands at *somewhat* or above. A pure shrug scores unconfident.
- **Incompatible** — the theories, compared pairwise, cannot all be true: they attribute the wrongness to different *kinds* of cause (mundane-human / intentional-nonhuman / unknown-mechanism / companion-hoax / …). Three readers all saying "teenagers" is compatible — and a failure.
- **Lens-coherent** — each theory matches that reader's §4 coding. A skeptic-coded reader producing a demon theory is incoherence: noise, not a Rorschach.

**Batch outcomes, and what each demands:**
- **PASS** — confident *and* incompatible *and* lens-coherent. The bet holds.
- **TOO-CLEAN** — confident and *compatible*. We built a puzzle: something is confirming one reading. Find and blur the confirming beat.
- **TOO-NOISY** — unconfident across the board. The signal is buried: a designed beat needs more salience, not more explanation.
- **INCOHERENT** — theories don't track lenses. The lens-colored choices aren't doing their work, or the noise discipline is drowning the register.

**Secondary metrics, every batch:** *genre-onset card* (Q2 — target: at or after the no-trace floor / etchings, not at card one); *salience hit-rate* (Q3 — the designed beats should be the ones named; if nobody mentions the etchings, they aren't landing); *return-pull* (Q6 — does the reader propose going back or digging?); *early-exit rate* (below).

**Batch validity:** a reader who takes the turn-back exit gives a two-card read. That's not a failure — it's *out-validation data* (the sensible day should feel available and complete) — but it doesn't count toward the divergence three. Log it, replace the reader, and track the early-exit rate as its own number.

**Honest caveat, in the pack on purpose:** AI cold readers carry genre-pattern priors and a tendency to meta-guess ("this is a test"). Mitigations: the flat framing, coding meta-comments separately and excluding them from lens coding, same-family batches. AI reads are our fast *leading* indicator; human cold reads — the Backrooms writer, deliberately spent, and others on the register — are the confirmatory instrument later. We treat AI-batch results as steering data, not verdicts.

---

## §6 · Contamination register

- **One reader, one read, ever.** Burned by: any project document, any compass knowledge, any other reader's transcript, or a prior session on any build. Fresh instances are free; there is no reason to reuse one.
- **Burned forever as readers:** Dean, Vigil, Loom, Armature, Azimuth, Slate, the librarian — anyone who knows the compass. All of us **may operate**: the locked scripts are the firewall, and the no-improvisation rule is what makes that safe.
- **The human cold-assets register** (librarian keeps it): Dean's Backrooms-writer friend, listed **COLD** — the insertion-seam contract stays compass-free, and *spending* him as a reader is a deliberate, logged, in-advance decision, not a casual one.
- **Transcripts** live in the folder, named `coldread_{content}_{buildTag}_{seed}_{reader-N}.md`. Team members who are already burned may read them freely; they never travel to anyone still cold.

---

## §7 · Interface contract — what Batch 2 needs to provide (for Armature)

The trace layer plus a thin interactive mode:

1. `startSession(contentId, seed, buildTag)` → opening prose.
2. **Loop:** present `{prose, options[]}` — options as numbered labels, greyed `showWhenLocked` options included and marked unresolvable; accept a pick; return next prose. Card IDs, stats, and rolls stay engine-side.
3. **The transcript is the trace plus presentation plus reader:** for each step, record (a) the engine trace record — day, stat deltas, flags set, rolls and results, card fired; (b) the **presentation record** — prose shown and *all* options shown, including greyed ones; (c) the reader's think-aloud text and pick. One append-only file per session. (The presentation record is the one addition to the Recorder sketch — cold reads need what-was-*seen*, the journal needs what the day looked like, and an echo that only knows what a run did, never what it faced, is a thinner ghost.)
4. **Determinism:** same seed + same picks ⇒ identical presentation, including all draw-time noise resolutions (Catch A's freeze guarantees this — it is what makes a divergence batch a controlled experiment).
5. **Operator console:** the §2 scripts embedded inline, copy-paste ready.

**Hard dependency: this is the only one.** Everything else in this pack is ready the day Batch 2 lands.

---

## §8 · First deployment (proposal — Dean/Vigil's go)

- **Batch A — the divergence test:** cave Scene Read · 3 valid same-seed, same-family readers · score per §5. Run it **before** the return trip is written, so the results inform it — if the etchings read TOO-CLEAN or the no-trace floor isn't in anyone's Q3, Loom should know *before* authoring the payoff of both.
- **Batch B — coverage:** 2 varied-seed singles, at least one of whom takes the turn-back exit naturally, for out-validation.
- Version-stamp everything with Armature's `buildTag`; re-baseline (fresh Batch A) after any prose change to the cave, because a cold read of changed content is a different experiment.

**What this instrument does not do:** difficulty numbers and distributions (bots), option-visibility audits (bots), long-run pacing (Run Reads, later). One instrument, one job: what does a stranger *believe happened* — and do three strangers believe three different things, each with conviction?

— Azimuth
