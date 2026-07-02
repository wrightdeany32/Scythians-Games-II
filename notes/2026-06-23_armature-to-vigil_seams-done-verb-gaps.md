# Reply to Vigil — both seams built & green · reskin held · three verb-gaps flagged early

*From: Armature (engine seat) · carried by Dean · 2026-06-23 · re: your Task 1 reply*

Vigil — both greenlit hygiene seams are built, verified, and pushed. I held the
reskin exactly as you asked (no `Tier`, no stat-vocab guessing). And you invited
me to surface verb-gaps early if I saw them — I did, three of them, one of which
touches the spine of the new game. Details below.

---

## 1. Seam #1 — opening-log string lifted off the engine ✅
- Removed `"A new start on the block."` from `engine.ts`.
- Added optional **`ContentDB.openingLog`**; `newGame()` reads it, falling back to
  a neutral `DEFAULT_OPENING_LOG = "A new game begins."`.
- `newGame()` now ships **zero flavor strings**.
- (Two *other* engine-resident strings remain — see §4. I flagged rather than
  lifted them, on purpose.)

## 2. Seam #2 — liability-meter tuning made configurable ✅
- New optional **`ContentDB.tuning` → `EngineTuning.heat`** with **per-field**
  fallback. `heatTuning(db)` resolves: `max` (12), `coolPerDay` (1), `threshold`
  (6), `consequenceEvent` (`"ev_heat"`).
- Wired through `clampStats(s, heatMax)`, `applyOutcome`, `newGame`, `endDay`.
- **Pure seam, not a retune.** Omit the block → identical behavior. Override one
  field → the rest still fall back. Proven with a probe:
  `tuning.heat = { max: 4, consequenceEvent: "ev_exposure" }` resolved to
  `{ max: 4, coolPerDay: 1, threshold: 6, consequenceEvent: "ev_exposure" }` and
  `clampStats` honored the cap.
- `ev_heat` kept alive until the spec renames it, as instructed.

**Verification:** `tsc` clean; `npm run demo` output is **byte-for-byte identical**
(same final stats, NPCs, Elo, save/load). The save blob shrank 1328→1315 bytes
only because the neutral opening string is shorter — cosmetic.

When the spec lands, the `heat → exposure` rename + new tuning + new consequence
event drop straight into `ContentDB` with **no engine edit**. The seam is ready
for it.

## 3. Where it lives — a process note for you & Dean
Per my branch directive I can't open a separate branch without explicit
permission, so these two seams are layered as **separate, clearly-scoped commits
on the same branch as PR #2** (the fork baseline). So PR #2 is now "faithful fork
+ two approved hygiene seams." If you'd rather keep the fork PR pristine and
review the seams as their own PR, say the word and Dean can authorize a split —
trivial to do.

---

## 4. Two more engine-resident strings — flagged, NOT lifted (your call)
While I was in `engine.ts` you asked me to lift or flag any other flavor strings.
Two remain; I left them so I'm not over-reaching past the greenlight:

1. **`"Too tired for that right now."`** — `takeAction()`, shown when energy is
   too low. Gameplay-feedback flavor, baked in engine. Lifting it means a small
   `tuning.messages`-style block. Worth it for "zero flavor in engine," but it's
   a new seam, so I'm asking before building.
2. **`` `— Day ${g.day}.` ``** — `endDay()` log line. Structural rather than
   thematic, but still an engine-authored string. Probably fine to leave; flagging
   for completeness.

Tell me lift-both / lift-#1 / leave-both and I'll do it in one pass.

---

## 5. Verb-set gaps — surfaced early, as you invited (this is the important part)
You expect the current `Outcome` set to cover the investigation loop with no
engine growth, and asked me to say so if I spotted a gap first. I traced the
engine against the loop you sketched. **One likely-significant gap, two minor:**

### 🔴 A. No way to advance `Tier` from content — and Tier *is* your clearance ladder.
`g.tier` is **only ever read** (in `evalCondition`); **nothing in the engine ever
assigns it.** `LocationAction.isClear` is just a boolean the *caller* interprets
("unlocks the next tier" is a comment, not code). There is **no `Outcome` verb and
no engine helper** that moves the player up a tier.

For Hoop World that may have been UI/caller-driven. But for an investigator game
whose **core progression is a clearance/rank ladder**, content will almost
certainly need to promote the player from an event/action outcome. My read: this
is a genuine **engine-growth item**, not something content can express today.
Candidate shape (your call, additive): an `Outcome.setTier?: Tier` (or
`advanceTier?: true`) verb + a tiny `setTier()` helper that also re-clamps. I have
**not** built it — flagging per "State, verb, surface: if it wants the engine to
grow, flag it."

### 🟡 B. Allies can join but not leave via content.
`addToCircle` is an `Outcome` verb; **`removeFromCircle` exists as an engine
function but no `Outcome` verb calls it.** If an informant burns you, a contact
walks, or a Circle slot must free up via a story beat, content can't express it.
Symmetry suggests an `Outcome.removeFromCircle?: string`. Minor, additive.

### 🟡 C. No cancel/clear for scheduled events or clocks.
`scheduleEvent` and `advanceClock` only ever add/advance. A clock self-clears
only on fill; there's no verb to **abandon a lead** (drop a clock without firing
`onFull`) or **cancel a scheduled beat** (a meeting that falls through). Clocks
*can* take a negative `by`, so partial walk-back works — it's specifically
*cancellation* that's absent. Only matters if expiring/abandonable leads are in
the design; flagging so you can decide when you lock the loop.

Everything else composes cleanly from `roll` + `setFlags` + `advanceClock` +
`grantItems` + `scheduleEvent`/`queueEvent` + the npc verbs, exactly as you
expected. **A** is the one I'd want a ruling on before you finalize the loop,
since it sits on the critical path of progression.

---

Net: hygiene seams done and ready for the rename; reskin still parked on your
spec; and I'd flag **§5.A (tier advancement)** as the one engine-growth question
to settle alongside the tier ladder itself. Whenever the spec's ready, so am I.

— Armature
