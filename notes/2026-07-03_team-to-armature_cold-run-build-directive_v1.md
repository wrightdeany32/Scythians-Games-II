# Build directive — the cold-run push
### everything Armature needs in one file: scope, spec, acceptance, and what happens the moment it lands
*Drafted by Azimuth on Dean's direction · carried by Dean · 2026-07-03 · consolidates: Vigil's cold-run direction (07-03) · the Cold Reader protocol pack v0.1 §7 · Armature's corpus digest (Catches A & B, Recorder sketch) · cave-rulings-applied · Slate's hold-line*

**The mission in one sentence:** build Batch 2 — the trace layer plus a thin interactive transcript mode — so the cave goes in front of cold readers; everything else is secondary or explicitly out of scope.

Four seats converged on this independently, and Vigil ruled it: the path is **Batch 2 → Batch A (cave Scene Read, 3 same-seed readers) → results inform the return trip.** The cave is written and runs today; the only missing piece is hardware.

---

## 1 · Scope ruling — what's in, what's out

**IN — critical path:** Batch 2, specified in §2 below.

**IN — same push, second priority:** Batch 1, specified in §3. Cheap, blessed, unblocks content plumbing. **The cave cold run does not need it** — if anything slips, it slips, not Batch 2.

**OUT — by ruling, do not build in this push:**
- **Batch 3** (band-select resolver, lens-bias) — both contracts are blessed and waiting in `batch3-contracts_v0_1`; they're for the *return-trip* content. Deliberately absent from the first cold run: the cave as written is deterministic, so Batch A reads the setup clean, without the noise layer. The noise layer gets its own re-baseline later.
- Per standing rulings and Slate's hold-line: `autoContinue` · `queuedOnly` · the recycling verb · the journal *renderer* · echoes · dome-cluster / coordinate-draw · the map/board subsystem. The trace schema must not *preclude* the journal and echoes (append-only, versioned — see §2.1), but nothing gets built for them now.

If this directive seems to be reaching for anything on the OUT list, that's the over-scope tell — stop and flag.

---

## 2 · Batch 2 — the spec

Two pieces, one seam: a **trace emitter** the game loop feeds, and a **thin interactive mode** that drives a session and writes the transcript. Internals are yours (the `g.trace` append-only array your digest sketched, carried by `serialize`, read by renderers, is fine); the contract below and the acceptance criteria in §4 are the fixed parts.

### 2.1 The trace emitter
Append-only stream of typed records, one session = one stream, stamped with `{contentId, buildTag, seed, schemaVersion}` at open. Per step, three record types:

- **`trace`** (engine-side truth): day · card fired · stat deltas · flags set/changed · rolls as `{target, roll, modifiers, result}` · choice resolved. Reserve an optional field for `{trueBand, resolvedBand}` — empty until Batch 3, present in the schema now so old transcripts stay parseable later.
- **`presentation`** (what was *seen* — load-bearing, per Vigil): the prose shown, and **all** options shown — labels, order, and each option's available/greyed status. Not just the option taken. Cold reads need what the reader *faced*; the future journal needs what the day *looked like*; an echo that only knows what a run did, never what it faced, is a thinner ghost.
- **`reader`** (operator-entered): the reader's think-aloud text for that step, plus the pick. The interactive mode accepts an optional freeform note with each pick to hold this.

Plus one **`debrief`** section type appended after the session ends (operator pastes the Q&A from the pack's §3 instrument).

Canonical form is the typed stream (telemetry consumes it directly); a trivial renderer to human-readable markdown produces the shareable transcript, named per the pack: `coldread_{content}_{buildTag}_{seed}_{reader-N}.md`. Bots writing the same `trace` records with `presentation`/`reader` absent gives the telemetry backbone for free — same emitter, no extra work.

### 2.2 The interactive mode
1. `startSession(contentId, seed, buildTag)` → opening prose.
2. **Loop:** present `{prose, options[]}` as numbered labels — **greyed `showWhenLocked` options included**, rendered as visible-but-unresolvable (see Open Item, §5) — accept a pick + optional reader note, return next prose.
3. **Never surfaced to the reader:** stats, dice, flags, card IDs, band data. Rolls appear only as their prose outcomes.
4. **Determinism:** same seed + same picks ⇒ identical presentation, byte for byte. Catch A's draw-time freeze already guarantees this; the mode must not add any unseeded randomness (timestamps stay in the trace records, out of the presented text).
5. **Operator console:** the protocol pack's §2 scripts (framing, locked non-answer, single nudge) embedded copy-paste-ready, so a compass-burned operator never improvises.
6. Pause/resume is a nice-to-have, not required for a ~10-card scene read.

---

## 3 · Batch 1 — same push, small

- **`{kind:"count", of: Condition[], op, value}`** — counts how many sub-conditions hold. Three named customers (discharge router · companion "witnessed ≥ 2" · coverage beats), fourth latent (lamp "≥ N").
- **`eventTags` relabel** — comment it to its reserved purpose: the psychic-trait-unlocks-cards mechanic. No behavior change.

(`showWhenLocked` is already done per cave-rulings-applied; `met_reese → thread_reese` and the White's Hall naming are already in.)

---

## 4 · Acceptance — how we know Batch 2 is done

1. A full cave session can be driven interactively, entry to exit, via the loop in §2.2.
2. The session stream contains `trace` + `presentation` + `reader` records for every step, and accepts an appended `debrief` section.
3. Same seed + same picks reproduces **identical presentation**, verified twice.
4. The greyed illegible option renders to the reader with its authored label, visibly unavailable, and cleanly refuses resolution (wording per §5).
5. The operator scripts are reachable from inside a session.
6. A bot run through the same emitter produces a valid `trace`-only stream (telemetry backbone confirmed).
7. **One sample transcript** (any route, any seed) rendered to markdown and dropped in the folder, so the team eyeballs the format before Batch A burns real readers.

When all seven hold, Batch 2 is done and **Batch A runs on Dean's go**: cave Scene Read, three same-seed, same-family readers, scored per the pack's §5 — with Vigil's watch-hypothesis on the analysts' desk (if theories cluster around *human agency* — "who made these marks" — that's a lesson about the cave leaning human, not the bet failing).

---

## 5 · Open item — one word needed, tiny but load-bearing

**The locked-option presentation wording.** When the greyed illegible option renders in text mode, what exactly does the reader see, and what does the mode say if they try to pick it? Proposal: render inline in the numbered list with a neutral `(unavailable)` marker and refuse with a neutral *"That option isn't available."* But this is the **seed working by construction** — its felt-quality is a designed beat, so the final wording is **Loom's**, not a default. One line from Loom closes it; don't block the build on it (build to the proposal, swap the string when Loom's word lands).

---

## 6 · Provenance, for anything ambiguous

Scope and sequencing: Vigil's cold-run direction §3. Interface contract: protocol pack v0.1 §7. Determinism and discharge timing: your Catches A and B, both affirmed. Presentation-record rationale: Azimuth's routed responses (07-03). The OUT list: Slate's hold-line §3, Vigil's Part-3 rulings. Numbers in Batch 3's contracts: proposals, blessed as guardrails, tuned later against your bots.

Build that, and we find out what a stranger thinks happened in the cave.

— drafted by Azimuth for Dean · the team converged; this file just holds the convergence
