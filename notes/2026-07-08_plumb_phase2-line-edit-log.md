# Plumb — Phase 2 line-edit log: the conversion pass, file by file
### Dean's mandate applied: mechanical/clarity fixes landed silently and are listed; anything that could shift meaning is FLAGGED — nothing ambiguous was changed quietly
*From: Plumb (engine seat) · 2026-07-08 · for Loom (first), Dean, Armature cc*

**How to read this.** Every source file got a second pass over every line as it converted to `src/content/explorer/`. Two buckets per file: **SILENT** = mechanical or wiring-shaped edits I judged safe (typos, linter rules, bracket stage-directions becoming action labels, wire-note deviations the card's own text supports) — listed so nothing is invisible; **FLAGGED** = anything where my hand touched meaning, tone, or ambiguity calibration — these want your eyes, and every one is reversible with a one-line change. Global conventions first, then per file.

## Global (applies everywhere)
- **Logs de-italicized** (linter rule: no `*…*` in any player log — the intent-note fence). Body prose keeps all authored italics. E.g. "it *is* unbelievable" → "it is unbelievable" in the dinner lean-in narration.
- **Bracketed stage-direction options became action sentences** ("[knock]" → "Knock."; "[the knife comes around; take it…]" → "The knife comes around. Take it, and cut your own piece."; "…" → "Say nothing. You don't have words.").
- **Closing cards got exit choices** (the engine needs a pick to resolve; your closes end in prose). All authored exit labels are listed per file below — they're the most common thing I authored.
- **Magnitudes** (yours to leave to me, so on the record): attune small = **±0.25** everywhere; dinner enable-leans **+0.2** (leaned_in) / **+0.3** (took_knife, "the heavier"); meeting close **±0.4**; break fork **+0.7** (embrace, "hard") / **−0.6** (refuse). Y stays 0 on all of these (you annotated Z only).
- **Narration-only introspectives with no authored narration** stay silent (no log) rather than gaining invented text — except where a scene would end on nothing (flagged per file).
- **`attune` swept exactly as your copies annotate**; the Y/Z enable-leans kept `diamondCoord`. `read_mundane` → `skeptic` per your own wire note. `mausoleum_known` dropped entirely per your note; the two anomaly gates read as you specified.

## Exposure economy (FLAGGED as a block — Armature + Loom tuning surface)
The pack names the gradient's sources loosely ("took_shard +2, the cave pushes, later disturbances") but the frozen cave carries no exposure. The wire proposes, all explicit in content and all one-line retunes:
- **`ux_shard_settles` (engine-authored micro-beat, opening.ts)** — the ratified took_shard **+2**, rendered as a percept (the shard's first night home) instead of silent math. Four sentences in your register; replace freely.
- **Rangers beat +2** (`ux_nora_rangers` — the description that fits you IS the liability event).
- **Vault opening +2** (`ux_grave_visit` "Open it." — disturbing a sealed grave).
- **Research: property digs +1 each; symbol digs +1 only at depth (theory ≥ 2 — asking around town about the mark); physics digs 0** (library science is safe).
- **Meter set STICKY** (coolPerDay 0), stages at **3 / 6 / 9** of max 12 — the watching accumulates and never lifts, matching the stage-3 plateau's weather.

## Per file

### ux-doug-opening (workout & message) → doug.ts
SILENT: workout opening restructured across the action-log/card-body seam (the log carries pickup + ritual; the card opens at "He's good company"); dinner/meeting arrivals land via `scheduleEvent` (+1/+2 days) per each card's own "on the appointed night/evening" header (the inline "queue" annotations read as loose); arrive cards charge energy −1 ("costs an evening"); message-nudge scheduled +4 gated `NOT doug_reached_back`; tradecraft raise capped statsMax 6 (Armature's number).
FLAGGED:
1. **The `doug_off` tint on the message** — your design note promises a flag-selected tint but supplies no prose. Engine-authored bodyExtra: *"You think about the fire road, and dark times coming, and how he didn't take it back. It's probably nothing. You notice you're telling yourself that."*
2. **Workout log rephrase** drops "the family friend who'd decided" → "when he decided" — the 'family friend' descriptor now appears nowhere in the beat.
3. Later workouts show only the ritual log line (no lighter banter variants — they'd need a card per visit; happy to add if you write them).

### ux-doug-dinner (the cake) → doug.ts
SILENT: `player_single` garnish CUT per the ratified round decision; dinner-deferred/wary reopened via a phone action (`ux_act_doug_dinner_yes`, "standing invitation").
FLAGGED: none — the cake converted clean.

### ux-doug-meeting (invitation & observation) → doug.ts
SILENT: `read_mundane` → `skeptic` (your wire note); mark-insert gate wired to the cave's actual flag `cave_etchings_seen` (file said `cave_saw_etchings`, which nothing sets); mark insert given `once`; invitation deliberately carries NO once-flag (the introspective branch re-presents the card; a once-flag would make the engine skip the re-queue); deferred/declined commit reopened via `ux_act_doug_commit` (the door that stays open); refused's "standing −1 with Doug" applied to the global meter per the ratified per-NPC-flags ruling.
FLAGGED:
4. **Defer label slot**: "[my own thing]" filled statically as "something of my own" (labels can't be conditional); your defer narration still names "the trip, the gear, whatever's yours."
5. **Meeting-close open branch**: your stage note "(the honest non-answer; the door stays open both ways)" became narration: *"The honest non-answer. He takes it — a little deflated, not hurt. The door stays open both ways."* — 'deflated, not hurt' is my read of Doug.

### ux-doug-break (the marked man) → doug.ts
SILENT: three plea routes wired as the conditional-insert pattern (queue all three; the meeting lean self-selects); reclaimed's tried-to-save variant carries the shared "within the week" paragraph in both texts (bodyVariants replace, not compose).
FLAGGED:
6. **Connective choice on the meet card** (the file goes monologue → routed plea; a pick is needed): *"I'm here, Doug. Say what you need to say."*
7. Epilogue exit labels: "Go home in the grey almost-morning." (linger) / "Carry it." (reclaimed).

### ux-marie-opening (warning & woods) → marie.ts
SILENT: woods outing charges energy −1 on its choices ("costs energy as a short outing"); woods scheduled +2 off the offer ("this weekend"); warning gated `arrived_town` and scheduled by the opening beat (+2), your confirmed shape.
FLAGGED:
8. "God. Marie. I'm sorry." had only "(sits with it.)" — became the minimal log *"You sit with it, and she lets you."*; the asked_boy branch (no narration authored) stays silent.
9. Close exit label: "Head back toward town."

### ux-nora-daytrip (center & rangers) → nora.ts
SILENT: wired as a committed full-day action (cost 3, like the cave) on `thread_nora ∧ nora_center_known`; close card's pact/left-behind variants carry the shared "Either way" paragraph in both texts; explore's introspective ("We should go.") stays silent per the file.
FLAGGED:
10. **Rangers +2 exposure** (see the economy block).
11. Close exit label: "Head home."

### ux-dale (the man who told the truth) → dale.ts
SILENT: entry action (`ux_act_dale_visit`, cost 1) on `pointed_to_dale`, retires on `dale_met`; the dale_bond narration's mismatched quote/paren in your source fixed.
FLAGGED:
12. Close exit label: "Drive back toward town." Entry-action log authored (the gas-station drive-out line — built from your own visit prose).

### ux-grave (the empty vault) → grave.ts
SILENT: entry action gated `grave_suspicion ∧ NOT grave_confirmed_empty` (the ratified re-enterable gate); the three reads also set `grave_confirmed_empty`; left-closed attune forks queue the close.
FLAGGED:
13. **The close card was written for the opened path** ("You leave the Fields vault the way you found it… Marie was right to be afraid") but serves both exits. Restructured: a neutral leaving line as the base; the vindication paragraph now renders **only** on `grave_confirmed_empty` — the left-closed player confirmed nothing and shouldn't read "Marie was right." Your original first line ("the way you found it, more or less") went with it. If you'd rather the left-closed path get its own distinct close, say so and I'll split the card.
14. **Vault opening +2 exposure** (economy block). Close exit label: "Drive back in the ordinary evening."

### ux-research (the lens engine) → research.ts
SILENT: staged digs are bodyVariants on the `theory_*` counters (deep text at ≥ 2); the conditional grip swings are complementary-`requires` twins of the "keep digging" choice (exactly one visible; same label); the self-undercut lines kept verbatim, per your load-bearing note.
FLAGGED:
15. **Grip-swing thresholds resolved as pre-dig counts**: spiritual costs grip from the **3rd dig on** (pre-dig ≥ 2 — "going this deep"); physics steadies from the **2nd dig on** (pre-dig ≥ 1). Your annotations ("−1 if ≥3", "+1 if ≥2") were ambiguous between pre- and post-advance; this reading matches "at depth."
16. **Physics steady capped statsMax grip 8** — an uncapped repeatable +1 was a grip fountain; 8 keeps the explanation steadying without carrying you to untouched. Armature's number to retune.
17. Close-the-laptop narrations for physics/property (you authored only the symbol's): *"You close the tab. The mechanism will still be there tomorrow."* / *"You close the folder. The paper isn't going anywhere. That's rather the point."*
18. Entry-action logs authored for all three digs (one line each, from your own openings).

### ux-pressure (the disturbance answers) → pressure.ts
SILENT: wired as `tuning.exposure.stages` (lowest unfired, one per morning, plateau free); shard strands and the dale_bond easing are bodyExtras exactly as your wire note says; stage choices set the `pressure_stage` counter; the engine's Phase-2b exposure snapshot puts `exposure_at_crossing` on every stage-fire record first-class (Azimuth's ask, done in the engine, nothing needed in content).
FLAGGED: none in the prose — the thresholds (3/6/9) and stickiness are the economy block's.

### ux-life (the breather set) → breathers.ts
SILENT: wired as plain actions — prose rides the log, no cards ("ordinary life doesn't fork"); the evening-in took_shard variant is a complementary-`requires` twin (the menu shows one), shard evening restores nothing per your note.
FLAGGED:
19. **Grip restores set to +1, capped statsMax 7** (ordinary life walks you back to barely-grounded, never untouched) — work/dinner/call/morning/evening/walk restore, errands neutral. Armature's numbers.
20. Work costs 2 energy (a shift is most of a day); everything else 1.

### ux-slice (whites-hall return) → whitesreturn.ts
SILENT: entry action on `cave_done ∧ (took_shard ∨ etchings ∨ Nora's link ∨ the voice)`, cost 3; the illegible insert queued `[illegible, fork]` with the grip ≤ 3 condition (the ratified hard gate — its choices queue nothing, the fork is already behind it); the three descent registers as bandText with the shared bottom paragraph in each (bandText replaces, not composes); conviction-voice cut-off kept verbatim.
FLAGGED:
21. **The carseat card's four replies** — your note says "the four replies from the deep card apply here too"; two labels needed adapting to the truck: *"You're right. I must have had it on me the whole time."* and *"It was a locked truck, Reese. We were underground."*
22. **The speechless reply** ("…", grip −1) got a minimal log so a stat move is never invisible: *"The sight is more than you can hold, and you don't try. The dark takes your silence and keeps it."* (daylight variant on the carseat).
23. `held_truth` also sets **`reese_strained`** (the ratified per-NPC flag; your "something in how he looks at you changes" narration is its content). Stage notes on the accept/hold replies became their logs (mechanical conversion, listed for completeness).

### ux-ending (the run that never went back) → ending.ts
SILENT: echoes wired exactly to your fixed gates (grave never-seen on `grave_suspicion ∧ NOT grave_beat_done`; the confirmed-empty variant; Dale on `warned_unheeded ∨ bond`; the money bookend; left-closed gets no echo).
FLAGGED:
24. **Split into two cards** (`…never_returned` → `…never_close`) so the thread-echoes (bodyExtras append at the end of a body) can sit *inside* the prose where you placed them. Bridge choice: "Let the season turn."
25. **The mark coda gated** on `cave_etchings_seen ∨ meeting_mark_seen` — you wrote it unconditional, but a run that never saw the mark would get an unearned callback. Proposing the gate; one-line revert if you want it universal.

### ux-convergence (the same question) → convergence.ts
SILENT: wired as a **met-door** (the mechanism call you left to me): the door's day-boundary check is exactly "the engine surfaces it in the ordinary flow the first time both flags hold," with no insert bookkeeping at either thread's beats. Coordinate- and lens-silent as designed; harness-verified the log doesn't move.
FLAGGED:
26. Exit choice: "Finish your coffee." (your own deflation line as the pick — it felt right; rename freely).

## The three stubs (all engine-authored, all yours to replace)
27. **`ux_explorer_opening`** — arrival-in-town creation stub: boxes, the hills, the family roster, Reese's pin. Sets `arrived_town` + `thread_doug`, schedules Marie (+2). Two flavor choices, deliberately coordinate-silent (the creation deck seeds origins when it lands).
28. **`ux_nora_intro`** — Nora's establishing call after the first cave trip (door on `cave_done`): sets `thread_nora`, `nora_center_known`; the second choice plants `noticed_nora_fray` early for the attentive player.
29. **`ux_shard_settles`** — the shard's first night (economy block).

## One seam for Armature (not content): morning pileup interleaving
When several beats queue on one morning (a scheduled walk + a pressure stage), the first card's chain appends BEHIND the rest of the queue — so stage 1 can land mid-conversation between Marie's woods cards. Mechanically sound (the harness drives it), narratively wrong-shaped. Possible fix is scene-chain front-insertion in the queue, but that touches resolution order everywhere (cave included), so it's a ruling, not a patch — flagged in the build report.

Everything above is one small diff away from your preference. Point at any number and it changes.

— Plumb
