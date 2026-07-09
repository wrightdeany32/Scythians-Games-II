# Plumb — Phase 2 build report: the Explorer pack is wired
### attune landed as ratified · terminal precedence & the exposure snapshot · the flag-web linter · fourteen files converted, driven end-to-end, green bar with cave-b3 byte-identical
*From: Plumb (engine seat) · 2026-07-08 · for Armature (review), Dean, Loom, Vigil, Azimuth, Slate, Concordance cc*

**One line:** the Explorer campaign now runs — creation to either terminal — as data in `src/content/explorer/`, on four small engine additives, with a 133-check harness driving a scripted two-week run through every thread, and the frozen cave byte-identical inside it.

## The engine additives (three commits, all inside the walls)

**1 · `attune` (option 3, record-now-read-later) — exactly as pre-agreed.** `CoordLogEntry.attune?` / `Choice.attune?` / card- and action-level, −1 grounded … +1 attuned, recorded by the one `coordEntry` builder with the same branch-over-card per-field precedence as coord/flavor. Never a `DiamondCoord` component (Weight/dice can't read it by type); **no derived reader exists** — centroid.ts carries a deliberate-absence note; the two-reader fence (telemetry + the narrow-door ending-selector, any third requiring a ruling) is stated at the type, the recorder, and the centroid module. Linter enforces range on all four sources. Questionnaire answers can seed it at index-0 like the other two fields.

**2 · Terminal precedence (grip-zero-wins) + the exposure snapshot.** When a designed terminal already holds at the day boundary, `endDay` queues *nothing* — no consequence, no doors, no stages, and no calendar ending stacked on a terminal; the substrate still turns the day. (`terminalTuning` moved to engine.ts; loop.ts re-exports.) And every `SceneResolution`/`TraceRecord` now carries the **exposure meter frozen at card-fire** (like band) — Azimuth's `exposure_at_crossing` is first-class on every stage-fire record with no reconstruction. Additive within stream schema v1; the transcript renderer prints nothing new, so the frozen cold reads are untouched (verified byte-identical).

**3 · The flag-web linter pass.** Boolean reads (conditions everywhere, doors, endings, mountFlags, harvestFlags) cross-referenced against writes (outcomes, once-flags, questionnaire). A gate on a flag nothing writes warns per-flag — a typo'd gate can never open; writes nothing reads warn as ONE aggregate line per db (journal percepts and telemetry flags are legitimately unread locally). Counter reads stay with the ghost-counter check; terminal flags with the dead-terminal check — one finding per accident. It caught a real one during conversion: the meeting file gates the mark insert on `cave_saw_etchings`, which nothing sets — wired to the cave's actual `cave_etchings_seen`.

## The conversion (`src/content/explorer/`, twelve modules + index)

All fourteen sources, prose intact, disciplines held: percept-never-cause, no position gates anywhere (grip and flags only), neutral-valence labels, the sealed layer surfacing in nothing, every `> DESIGN` block stripped, no `*…*` in any log. The per-file **line-edit log** (separate note, same date) lists every silent mechanical fix and flags all 29 places my hand touched meaning — Loom's to bless or revert line by line, headline items: three engine-authored stubs (arrival / Nora's intro / the shard's first night), the proposed exposure economy, the grave close restructure, the two research tuning caps.

Wiring shapes worth naming for review:
- **The conditional-insert pattern carries the pack**: Doug's three plea routes on the meeting lean; the meeting's mark insert on the cave flag; the return's illegible insert on the ratified hard grip-≤3 gate (its choices queue nothing — the fork is already behind it in the queue).
- **bodyVariants/bandText replace, bodyExtras compose** — the charge gate (took_shard) is variants; the shard strands, dale_bond easing, and ending echoes are extras; the descent registers are bandText (each carries the shared bottom paragraph, since bandText replaces).
- **Conditional stat swings as complementary-`requires` choice twins** (same label, one visible): research's grip costs/steadies, the shard-evening breather.
- **The never-returned ending is two cards** so its echoes sit inside the prose (extras append at body-end).
- **The convergence percept is a met-door** (my call per Loom's either-way note): the door check IS "surfaces in the ordinary flow when both flags hold."
- **Tuning:** sticky exposure (coolPerDay 0), stages 3/6/9 of 12; lens vocabulary locked at the four with `skeptic` the null pole; terminals `[run_end_whites_return, run_end_never_returned]`; `lastDay` 14 (shakedown placeholder); crossRun harvest `[denied_knife, held_truth]`; tradecraft cap 6; grip-restore cap 7 / physics-steady cap 8 (Armature's numbers, all).

## Verified by driving

The harness (npm run loop, now 133 checks) scripts a full run: opening stub → workout/message → Marie engaged → cave flags → the doors (Nora, shard) → the day-trip (rangers, gentle path) → the woods walk interleaved with pressure stage 1 → convergence → research → the vault → stage 2 + the nudge → the dinner (the knife) → the ask (money set aside) → the observation meeting (mark insert fires) → the return (attuned entry recorded, illegible shut at high grip, grounded descent, `held_truth` + `reese_strained`) → the authored terminal → terminal-precedence morning → cross-run harvest (`held_truth` in, `denied_knife` correctly absent). A second game drives the calendar out quiet and gets the never-returned ending with **this run's** echoes present and absent ones dropped, closing on the attune fork. Plus: convergence proven coordinate/lens-silent (the log doesn't move), the sticky meter's arithmetic, the workout beat's once-flag, the grave action retiring.

Green bar: `npm run loop` 133/133 · `playtest:cave` green · `lint:content` 4 dbs, **0 errors** (the explorer's only warning is the expected one aggregate unread-flags line — journal/telemetry material) · `coldread:sample` **byte-identical cave-b3** · `tsc` clean.

## Three things that want eyes

1. **The morning-pileup seam (Armature — a ruling, not a patch).** Multiple beats queued on one morning interleave: the first card's chain appends *behind* the rest of the queue, so a pressure stage can fire mid-conversation inside Marie's walk. Mechanically sound; narratively wrong-shaped. The clean fix is scene-chain front-insertion at resolve time, but that touches resolution order everywhere (cave included) — I didn't build it unilaterally. Options when you're ready: (a) front-insert chains, gated behind a tuning switch; (b) endDay queues short beats (stages/doors) before the scheduled sweep; (c) live with it until a Run Read says it hurts.
2. **The exposure economy is proposed, not ratified** — sources and thresholds in the edit log's block; every number is a one-line retune. The bots will tell us if the gradient paces right (Azimuth's stage-fire snapshot makes that measurable from day one).
3. **`lastDay` 14 vs. the Doug thread's tail**: a player who starts Doug's chain late can have the break scheduled past the calendar's end (the harness's main run does — meeting day 13, break day 16, terminal day 14). Ratified answer is Loom + Armature set the real length against thread-exhaustion measurements; flagging that 14 demonstrably truncates one authored climax.

**Next per the ratified sequence:** wire → **bots** → shakedowns → Run Reads. The bot A/B driver (Azimuth's requirements: quiet-to-thread ratio, exposure pacing, seed-matched factor isolation) is my next build once this lands. Branch → draft PR → Armature blesses → Dean merges, as ever.

— Plumb
