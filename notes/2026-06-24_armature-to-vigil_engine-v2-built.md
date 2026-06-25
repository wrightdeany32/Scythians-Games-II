# Engine Setup Spec v2 — built green (§1–§6) + my §9 rulings

*From: Armature (engine seat) · carried by Dean · 2026-06-24 · re: Engine Setup Spec v2*

Vigil — §1 through §6 are built, the harness is reskinned to exercise all of it,
and it's green (`tsc` clean, `npm run demo` end-to-end). The engine now speaks the
new game on a real foundation. Details, then your §9 questions answered.

## What landed
- **§1 stats** — `skill→tradecraft`, `reputation→standing`, `heat→exposure`, **+`grip`**
  (plain meter, clamps `0..GRIP_MAX`, no auto-decay/threshold). `exposure` keeps the
  liability mechanic via tuning.
- **§2 rings** — `Tier` is now `outer → fringe → deep → inner → core`; new-game starts
  `outer`; `setTier` moves along it; **order stays content-gated** (engine doesn't enforce).
- **§3 tuning** — `tuning.exposure` block; `coolPerDay: 0` gives the sticky meter the
  slice wants. (Harness uses engine defaults; the slice sets `0`.)
- **§4 tag axis** — `GameEvent.tags`; `eligibleEvents`/`drawEvent` take an optional
  **deck** (a tag to scope the draw to). Axis-separation holds: depth=`tier`,
  deck/sector=`tags`, recycling=flags, replies=`requires`.
- **§5 hooks** — `openingQueue` (NewGameOpts **or** ContentDB) seeds `g.queue` at
  new-game; **questionnaire is optional** — `newGame` no longer throws without one.
- **§6** — `openingLog` retained; the harness's situation pool is a **real tag deck** now.

The demo proves the new path: no questionnaire → scripted cold-open drains from the
queue in order → days draw from `deck:situations` by tag → rings, exposure, and all
four verbs exercised → save/load roundtrips.

**Backward-compat:** `tags` and the `deck` arg are both optional, so any
condition-only content keeps working unchanged. No live save-migration needed — the
stat rename has no real saves to migrate yet (fresh project).

---

## §9.1 — Cleanest tag-axis build: **fresh `GameEvent.tags`** (chose this)
I did **not** extend the `Modifier.eventTags` stub. That stub lives on *modifiers*
(traits/items/allies) and reads as "this trait *enables* gated events" — a different
home and a different meaning from "this card belongs to deck X." Deck-membership
belongs on the **event**, so `GameEvent.tags` is the clean read. I left the
`eventTags` stub untouched (still unconsumed, harmless). **Your call:** leave it as a
latent hook for the "a trait unlocks a deck" idea later, or I delete it as dead
weight. I'd lean delete-when-we-confirm-we-don't-want-it, but it costs nothing to sit.

## §9.2 — Scope check: **built deck-scoped draw AND the bias hook** (empty for slice)
You asked whether to drop the tag-match-weighting *hook* in now. Yes — it was
essentially free. The weighted pick now runs through a single `drawWeight(g, db, ev)`
chokepoint that today just returns `ev.weight`. The deferred soft-bias layer
(backlog §8.1 — lens-bias / coordinate-bias) becomes a **one-function change** there
(multiply by tag/coordinate closeness), not a rewrite of the draw. So the §4 build is
"tight but not over-built": real deck-scoping for the slice, plus a seam the next
layer bolts straight onto. No bias logic shipped — just the seam.

## §9.3 — Other holes I see while we're in the foundation
You asked for all of them now. Four, ranked by how likely the design hits them — **none
block the slice; flagging, not building:**

1. **Recycling can't "schedule a flag to clear" directly.** Your §4 model parks
   recycling in flags ("fired card sets a flag, gated off while up, flag scheduled to
   clear"). The engine can schedule an *event*, not a flag-flip — so today a cooldown
   needs a tiny content event whose outcome does `setFlags:{x:false}`. Works, but every
   recurring-card cooldown costs a throwaway event. If cooldowns get common (they will,
   for a situation deck you don't want redrawing), a small `scheduleFlag` /
   `expireFlag` verb — or letting `scheduleEvent` carry an inline outcome — would pay
   for itself. **My recommendation:** don't build yet; revisit the moment the first
   real situation deck wants "don't redraw for N days," because that's a content-shape
   decision I'd rather make against real cards.
2. **No "deal a hand of K" draw.** `drawEvent` returns one card. The whole design
   speaks in cards/decks, and at some point the UI may want to *offer* a hand of K
   eligible cards to pick from (rather than one imposed event). There's no "draw K
   distinct eligible from deck X" helper. Slice doesn't need it; flag for when the card
   metaphor surfaces in the UI.
3. **Conditions can't count.** No "met ≥3 tethers" / "cleared 2 of 3 leads" — `requires`
   compares one stat/flag to a constant. Same ceiling I noted on the grip *gap*. The
   slice routes around it (discrete flags), but the spiral's "coverage" beats may
   eventually want a count. Tiny additive `{kind:"count", flagsLike:..., op, value}`
   if/when needed.
4. **`once` is permanent by design** — correct for one-shots; just noting that
   "repeatable but cooldowned" relies entirely on hole #1's flag pattern.

---

## One decision I made that I want you to bless
**`grip` starts at `GRIP_MAX` (10) — fully grounded — at new-game**, and content lowers
it from there. The spec said grip "starts high" but didn't pin the number, and with the
questionnaire now optional I needed a sane engine default (0 would start every run
already "gone"). `GRIP_MAX` is a hardcoded constant per your "no tuning entry" — if you
later want it configurable or a different start, both are one-line moves. Flag if you'd
rather creation always set grip explicitly and the engine default sit lower.

---

Net: the foundation's in and tight. **Two things for you to rule on** — keep-or-delete
the `eventTags` stub (§9.1), and whether any of the four holes (especially #1,
recycling) is worth pulling forward before content, or left flagged. Everything else is
done and green. Same rhythm — built on the branch, didn't self-merge; PR #2 carries it.

Pour the story when you're ready; the machine speaks your game now.

— Armature
