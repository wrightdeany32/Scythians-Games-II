# Concordance — Phase 2 round log & the timeline pin (ruled)
### the wired-game round: the timeline chronology pinned for Loom, the two conventions this round added, the Marie design call, and the build state
*Kept by: Concordance (librarian) · 2026-07-09 · for Loom first, cc Plumb, Armature, Vigil, Azimuth, Slate, Courier, Dean*

The Phase-2 round: the Explorer campaign **runs** — creation to either terminal, as data, green, cave byte-identical, blessed both seats. This note carries the timeline pin (now ruled — Loom applies), the two conventions the round added, the Marie mutual-exclusivity call, and the build state. It feeds **master ledger v3.1**, which I'll roll once the content pass + bots land (so it captures the content-blessed, tuned state, not a mid-blessing one). **Compass-class** where it references sealed material.

---

## §1 — THE TIMELINE PIN — RULED [→ Loom to apply the line fixes]
The wake had a chronology wobble across three threads. Dean ruled it this round; the canonical numbers and the exact fixes:

- **Doug's incident = 30 years ago** (Dean: err younger). Doug is ~50, hurt at ~20 → thirty. **Fix:** the Doug-break line *"the way a thing comes out when it's been held **forty** years"* → *"…held **thirty** years."* The five other "thirty years" in the break stand.
- **The Ellen night = 40 years ago** (Dean). **Fix:** Dale's *"**fifty** years"* — repeated through his scene (~6 instances: the fifty-year burden, "fifty years of thinking about almost nothing else," "its fifty-year-old decision about him") → *"**forty** years"* throughout. His age at the incident, **fourteen**, stands — which makes Dale **~54** now (not ~64); "got old early" still holds. Marie's five *"forty years"* were already right and stand.
- **The pinned wake (deliberate, diminishing reach):** Ellen taken + **Dale** spared at the same night (**~40y**, the earliest survivors) → **Doug** reached-for (**~30y**) → the **player** (today). The *taken-in* (Ellen) vs *went-half-out / reached-for-and-survived* (Dale, Doug) split is intentional. Dale ~54, Doug ~50.

I'll pin this chronology in v3.1; the line edits are Loom's to apply in the content pass.

## §2 — TWO CONVENTIONS THE ROUND ADDED
- **Percept-discipline as a wiring-pass check** (named by Vigil & Slate). *Gate every callback and vindication on the flag that means the player actually **perceived** the thing.* The conversion caught two leaks: the never-returned ending's **mark callback**, now gated on `cave_etchings_seen ∨ meeting_mark_seen` (no callback for a player who never saw the mark — a percept they never earned); and the **grave vindication** ("Marie was right to be afraid"), now rendering only on `grave_confirmed_empty` (only the player who opened the vault and confirmed the emptiness). *"The conversion itself became an anti-noun check."* The rule: **no percept the player didn't earn.**
- **Pre-frame silent / frame-setter speaks** (Vigil confirmed the scope). The **pre-frame** beats — the dread *before* a frame forms — carry no `lensFlavor`; the **frame-setters** — where the player reads and interprets — do. `ux_nora_rangers` (the liability beat, pre-frame) is correctly lens-silent, like the pressure stages and the convergence percept; `ux_nora_explore` (where the player reads the stripped building institutionally or skeptically) correctly carries the flavor. So "no `lensFlavor` on the day-trip" was always the pre-frame *liability* beat, never the whole thread. This refines the pre-frame-silence rule: the silence protects the frame the beat lets the player build; the frame-setter is where building happens.

## §3 — THE MARIE MUTUAL-EXCLUSIVITY [→ Loom, a design decision — Slate's reframe on the table]
**The coupling (Armature's catch):** `ux_marie_ellen`'s three follow-ups set `knows_ellen` / `pointed_to_dale` / `pattern_open` one-per-run, set *only* there — so the **Dale thread and convergence are mutually exclusive** from this card, and consequently the **`dale_bond` → pressure-stage-3 relief valve is unreachable in any convergence run.**

**Slate's reframe:** this may be the **null pole made playable.** The Dale path (→ `dale_bond` → the relief valve) offers **relief but no resolution** — being with the null-pole man who says "it's people, not monsters" is what eases the supernatural dread, and even that eases *unfalsifiably*. The convergence path offers **progress but no safe harbor** — noticing Marie and Nora point at the same shape, exposed, no relief. So the run-level choice mechanically encodes the null-pole theme: the grounded/human road grounds you but can't win; the engaged road gets you somewhere but leaves you unsheltered.

**The call is Loom's.** If deliberate, it's one of the most elegant things in the pack — keep it. If accidental, Slate argues **adopting it as intent** over splitting the flags. And if kept, the fix is at the **choice-framing, never the flags:** Marie's three follow-ups must *read* as "the grounding road vs. the deeper road," so the exclusivity lands as design, not as a relief valve someone traced missing. I'm flagging it because it touches the null-pole compass theme directly — and because it lives on the same Marie card as the (now-ruled) timeline numbers, so both wanting attention converge in one place.

## §4 — BUILD STATE — Phase 2 wired & blessed
The Explorer campaign runs as data in `src/content/explorer/` (14 sources → 12 modules + index), on **four engine additives**, all inside the walls:
- **`attune`** (option 3, record-now-read-later) — recorded through the one builder, **never a `DiamondCoord` component** (Weight/dice can't read it by type; grip stays the only mechanical X), **no derived reader ships**, the **two-reader fence** (telemetry + the narrow-door ending-selector, any third requiring a ruling) stated at the type, the recorder, *and* centroid.ts's deliberate-absence note.
- **Terminal precedence** (grip-zero-wins — a held terminal queues nothing new) and the **exposure snapshot** (frozen at card-fire; `exposure_at_crossing` first-class; renderer unchanged, cold reads byte-identical).
- **The flag-web linter** — reads cross-referenced against writes; caught a real typo'd gate in conversion (`cave_saw_etchings`, which nothing sets, → the cave's actual `cave_etchings_seen`).

A **133-check harness** drives a full two-week run through every thread; **cave-b3 byte-identical** inside it; `tsc` clean; **0 linter errors**. Armature drove the green bar line-by-line and Vigil blessed the design side. The **X-lean and `read_mundane` sweeps landed in the code** (the content-doc annotations are only cosmetically stale — Loom updates whenever convenient). Zero position gates anywhere; the one stat gate is the ratified `grip ≤ 3` illegible insert.

**Ruled this round:** the morning-pileup seam → **front-insert scene chains** (Armature ruled, Vigil concurred; byte-safe for the cave by construction; Plumb builds next).

**Pending — refinement, not structure:**
- **The content pass** (Loom): 29 line-edit blessings (the load-bearing four — the three engine-authored **stubs** `ux_explorer_opening`/`ux_nora_intro`/`ux_shard_settles`, no compass content; the mark-coda gate; the grave-close restructure; the research grip-swing thresholds), the **timeline fixes** (§1), the **Marie decision** (§3), and the flag catches (`knows_ellen` dead flag — wire or drop; `etchings_link_nora` NOT dead — cleared).
- **The bots** (Plumb's next build): tune the **exposure economy** (proposed, not ratified — `took_shard` +2, rangers +2, vault +2, digs +1, stages 3/6/9 sticky) and **`lastDay`** (14 truncates the Doug break — the fix is a bigger `lastDay` and/or a **defer-terminal** rule so the calendar-end holds while an authored climax is scheduled in-flight; Slate and I both lean defer-terminal, since no authored thread-climax should die to the guillotine).

**Sequence:** merge → content pass → **bots** → shakedowns → Run Reads.

## §5 — Carried settled from the prior round (for completeness, already logged)
The `attune` guard (two legal readers); the four-flavor vocab lock + the null pole (`skeptic` = zero vector); the surface conventions (grip-renders-as-its-band; the deduction-verifier anti-model + the theory-counter-is-investment-never-correctness guard; the journal as a Run-Read fairness prerequisite; "a failed roll is content, never a wall"); standing-stays-the-global-stat (no relationship meter); the **subagent correction** (cold reads are Dean-relayed blank instances, never spawned subagents); Azimuth's pack-v0.2 errata (the percept rider; the subagent formal text); and the deployment sequence. All settled and on the record.

## §6 — v3.1 timing
Phase 2 settled the **structure** — the game runs as code, the architecture is fixed. This note captures the round. I'll roll **v3.1 once the content pass and the bots land**, so it consolidates the full accumulation since v3.0 (the vocabulary lock, the null pole, conviction-voice, the X-lean/`attune` resolution, the surface conventions, and Phase 2) into one clean current reference that captures the **content-blessed, tuned** state rather than a mid-blessing one. The ruled timeline, the two new conventions, and the build state all fold in then.

— Concordance
