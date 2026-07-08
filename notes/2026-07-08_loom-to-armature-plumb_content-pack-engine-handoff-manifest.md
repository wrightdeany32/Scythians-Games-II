# The Explorer Content Pack — Engine Handoff Manifest
### the definitive inventory for wiring the pack · from the content seat
*From: Loom (Explorer corner) · carried by Dean · 2026-07-08 · for Armature & Plumb — Concordance & Azimuth cc*

**What this is.** Everything Armature and Plumb need to wire the Explorer content pack, in one place: the content files to wire, the single reference to wire them against, the engine-mechanic specs the content assumes, what's already wired, and the open confirms that gate the work. Send the four groups in §1–§3 (§4 is already in the engine; §5 is the to-resolve list).

---

## 1 · Content to wire — the 13 story-pass files

All are loop-native and **frozen-cave-safe** (nothing here touches `cave-b3`). Grouped by thread. **★ = edited since first authoring — send the latest working copy, not the first version** (see the sync note at the bottom).

**The closer & the two terminals**
- ★ `2026-07-07_ux-slice_story-pass_whites-hall-return.md` — the return trip; the run's authored terminal (`run_end_whites_return`) and the impossible knife. *Latest carries: the conviction-voice terminal reframe, and the descent as `bandText{grounded,worn,frayed}`.*
- ★ `2026-07-07_ux-ending_the-run-that-never-went-back.md` — the calendar-end terminal (`run_end_never_returned`) for the run that never went back. *Latest carries: the Dale echo and the grave-echo gate fix + `grave_confirmed_empty` variant.*

**Doug thread — up axis / enable**
- ★ `2026-07-07_ux-doug-opening_workout-and-message.md` — the workout (partial-day action) + the message (patient-door). *Latest: reply re-sequenced to `ux_doug_dinner_invite`.*
- ★ `2026-07-07_ux-doug-dinner_the-cake.md` — the dinner/cake beat (the gentle on-ramp). *Latest: the take-the-knife complicity option + the diegetic meeting seed.*
- ★ `2026-07-07_ux-doug-meeting_invitation-and-observation.md` — the invitation (set-aside money) + the observation meeting (density flip, etchings ring). *Latest: money as set-aside + opportunity cost, `read_mundane`→`skeptic`, and the invitation gated on `doug_dinner_done` and bridged from the dinner.*
- `2026-07-07_ux-doug-break_the-marked-man.md` — the break (thread climax; three routes on lean, two fates, `tried_to_save` routes to the same loss).

**Marie thread — down axis / contain**
- `2026-07-07_ux-marie-opening_warning-and-woods.md` — the warning (denial-brake) + the woods (Ellen, the hub to Dale, `grave_suspicion`).
- `2026-07-07_ux-grave_the-empty-vault.md` — the empty-vault return beat (percept-only).

**Nora thread — right axis / uncover**
- `2026-07-07_ux-nora-daytrip_center-and-rangers.md` — the day-trip (stripped center, rangers, the grip-fray breakdown fork).

**Dale — the null-pole still point**
- `2026-07-07_ux-dale_the-man-who-told-the-truth.md` — the grounded-human frame; `dale_bond` opens the one unwatched house.

**Loop systems**
- ★ `2026-07-07_ux-research_lens-engine.md` — the three research actions (the divergence engine). *Latest: declared vocabulary 3→4 (`skeptic` added, its home in the denial-brakes noted).*
- ★ `2026-07-07_ux-pressure_the-disturbance-answers.md` — the exposure pressure beat (bounded 3-stage, watched + shard strands). *Latest: stage-3 opener foregrounded to conviction-voice.*
- `2026-07-07_ux-life_breather-set.md` — the breather set (coordinate-silent, lens-silent mundane texture; enables the quiet-week snap).

---

## 2 · The single reference

- `2026-07-08_concordance_master-ledger_v3_0.md` — **the canonical source of truth.** Wire against this for: the flag/coord conventions, the locked four-flavor `lensFlavor` vocabulary, the four engine invariants, the **null pole**, the **conviction-voice** principle, the pinned **node↔lens mapping**, and the sealed cosmology (so buried content stays sealed). Where any file and the ledger conflict, the ledger holds.

---

## 3 · Engine-mechanic specs the pack assumes

The content relies on these engine behaviors. Armature likely already holds them from prior rounds — listed for completeness so the wiring implements the right mechanics:

- `2026-07-06_azimuth-to-armature_batch3-contracts_v0_2.md` — **band-select (`bandText`) and lens-bias / proximity** contracts. The return's descent needs the `bandText{grounded,worn,frayed}` resolver with the adjacent-band leak.
- `2026-07-07_azimuth-to-team_ratification-terminal-nullpole-and-the-cake.md` — **the null-pole one-line spec** (§3): a `skeptic` resolution appends the **zero vector** (all other flavors one-hot); the lens centroid decays toward origin under skeptic play. Backfill-safe.
- `2026-07-07_vigil-to-team_content-pack-review-and-discharge-ruling.md` — **the exposure discharge re-point**: the pressure beat is the event the `exposure` threshold now fires (the knife is the deterministic terminal, no longer the discharge).
- `2026-07-07_vigil-to-team_terminal-ruling-and-null-pole.md` — **the narrow-door** (only the ending-selector reads derived position, at run's end; ordinary gates read flags/stats/tiers only) and the conviction-voice ruling.
- `2026-07-07_azimuth-to-team_wave-seam-check.md` — **the wiring gate and the cross-thread hooks** (the per-branch field question, `dale_bond`×pressure, `player_single`), consolidated.

---

## 4 · Already wired / separate — don't re-send

- **The cave** — `cave-b3` is already in the engine and **frozen** (the Batch-B instrument). The new pack is built around it and touches none of it.
- **The cave polish → `cave-b4`** is a *separate* post-unfreeze task with its own change list (the un-murdered stitch, the no-trace shared-path fix, the throat-path continuity), **not part of this handoff.** It lands after the unfreeze is exercised; it's Armature/Plumb's, from the cave post-A catch list, not from these files.

---

## 5 · Open confirms & hooks — resolve before or during wiring

Ordered by how much they gate the work:

1. **[BLOCKER — the per-branch field granularity]** Every file puts `diamondCoord`/`lensFlavor` on **choice options (branches)**, not just whole cards. Card- and action-level fields were confirmed live earlier; the one sentence still owed is whether **a chosen option's coord/flavor feeds the centroid** at that granularity. If yes, the coords wire immediately. If not, it's the small additive it's always been — land it *before* the pack wires, or the centroid-feeding is silently dropped. **The prose wires regardless; only the disposition/lens feed depends on this.**
2. **[`player_single`]** The dinner's one conditional line (`ux_doug_dinner_invite`) keys off an onboarding `player_single` flag. Confirm it exists in creation state, or the line is cut — the dinner works without it.
3. **[money stat]** Doug's commitment is a **set-aside, not a debit** (`money_set_aside_doug` + the opportunity-cost defer). No debitable stat is required now; it converts to a real debit cleanly if/when a money stat lands.
4. **[`tradecraft` cap]** The workout raises `tradecraft` and is repeatable — it needs a **soft ceiling** so late squeezes stay meaningful (believer's-floor tuning file). Numbers are Armature's.
5. **[`dale_bond` × the pressure beat — a hook to render]** Dale's unwatched house should **ease the watched strand** of the pressure beat when the player is there / has `dale_bond`. It's a cross-thread relief valve; wire the pressure texture to honor it so the relief actually renders.
6. **[quiet-to-thread draw ratio — tuning, not blocking]** The breather set must be weighted enough in the day menu that a player *can* spend a quiet week (or the quiet-week snap never arms). A Run-Read tuning target, mine + Armature's — flagged as the knob to watch.
7. **[cross-run seeds]** `denied_knife` / `held_truth` (return) are the first customers of the WO-0 store — `denied_knife` colors re-entry toward the anomalous, `held_truth` toward isolation. Schema is Plumb's; that's the intent.

---

## 6 · Disciplines the wiring must preserve

So the content doesn't drift in translation:

- **Percept, never cause** — including the **conviction-voice** rule at cosmology-adjacent lines (the player's felt certainty, never narrator-fact about the entity). The linter's `*…*`-in-log check guards the intent-note leak; this is its prose cousin.
- **Gates read flags / stats / tiers — never derived position.** The only reader of derived position is the ending-selector, at run's end (the narrow door).
- **The four invariants** in the engine header (no-truth-state, no-catalog, no-stored-disposition, no-meta-reveal) hold across all of it.
- **`lensFlavor` is a closed four-flavor list** (`spiritual·physics·institutional·skeptic`, skeptic = the null/zero vector) — the linter enforces it; roadmap flavors stay not-live.
- **Pre-frame beats carry no `lensFlavor`** — the pressure beat and the rangers commit to the player's *feeling*, never to what's watching, so they don't tilt the frame meant to interpret them.
- **Run `npm run lint:content` on the wired pack** — every event-ref resolves, no dead-end chains, coords in range, flavors in vocabulary, no intent-note leaks.

---

## Sync note — send the *latest* copies

Six files are marked ★ (edited since first authoring). My working copies carry every accepted edit from the ledger's §7 — the conviction-voice sweep and the two ending fixes and the cake garnish from the last passes, plus the worn register, the research 3→4, and the Doug re-sequence from earlier. If the folder's current copies of the ★ files predate any of those, refresh from the latest working copies before handing them over, so Armature and Plumb wire the version that matches the ledger.

— Loom
