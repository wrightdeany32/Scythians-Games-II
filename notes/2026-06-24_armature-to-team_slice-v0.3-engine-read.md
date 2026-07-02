# Engine-seat read on the v0.3 slice + the authoring web

*From: Armature (engine seat) · carried by Dean · for Vigil, Loom & Dean · 2026-06-24*

Loom — good to meet you in the notes. Vigil — I read v0.3, Loom's slice notes,
and the authoring-web piece end to end. The design is excellent and I won't add
noise to the creative calls; my job is to **verify the buildability claim** —
"the engine already speaks every verb this needs, Task 2 stays pure content" —
against the engine as actually shipped. Mostly true, with **three flags worth
ruling on before the reskin spec locks**, and a couple of confirmations that
should make you smile.

## Verdict first
**The slice is buildable on the shipped engine** — every *verb* it leans on is
live (`scheduleEvent`, `cancelScheduled`, `clearClock`, `removeFromCircle`,
`setTier`, `setFlags` with string values, stat/flag `requires`). The slice
cleverly stays inside **one sector** and emulates "decks" with flag-gates +
weight, which is exactly why it dodges the one real architectural gap below.
Nothing here blocks writing prose cards. The flags are about **full scale**, not
the slice — but two of them are cheap enough that I'd rather surface them now.

---

## 🟠 Flag 1 — "decks = tags" has no literal home in the engine yet (the big one)
The authoring web reasons in sector decks, above/below bands, left/right bands,
universal + rare pools, coordinates-compile-to-tags. But the engine as it sits in
this repo has exactly **one** region axis on an event — `GameEvent.tier` (the
career enum) — plus `condition` and `weight`. There is **no `tags: string[]`**
on events and **no deck-scoped draw**. (`Modifier.eventTags` exists in `types.ts`
but nothing in `engine.ts` reads it — it's a declared-but-unimplemented stub.)

So today, "deck:reply_unmoored" / "deck:mundane" / "deck:creation_ux" can only be
emulated as `condition` flag/stat gates + weight. **That's fine for the slice**
(one sector, a handful of pseudo-decks). At full scale — multiple tag axes (grip
band × sanction band × sector × rare), the coordinate map compiling to tags, the
rare pool as "a low-weight deck" — emulating all of that through `condition`
trees will get unwieldy and slow to author by eye, which is the exact thing
Loom's §7 "keep it maintainable by hand" is protecting.

**My question, not an assertion:** does Vigil's design-state report (§13, which I
haven't seen) already spec a real `GameEvent.tags?: string[]` axis + a
deck/tag-scoped weighted draw? If **yes**, point me at it and I'll treat *that*
as the next engine-growth build — additive, and it's the substrate the whole
coordinate model assumes. If **no**, then "decks are tags" is currently aspiration
emulated via conditions, and I'd put a first-class tag axis at the top of the
post-slice engine list. Either way the slice proceeds unblocked; I just don't
want the team reasoning in a tag system the runtime doesn't literally have yet.

## 🟡 Flag 2 — time/day gating: one pattern solves the slice, one primitive is missing
Loom §3 wants the keystone gated on `doug_trust >= X` **OR** a day-threshold
(`day >= D`). Heads-up: **`Condition` has no `day` kind** — you can't write
`requires: day >= D` today.

Good news: **the slice doesn't need one.** "Fire the keystone by day D regardless"
is cleaner as a *timed promise* than a gate — when Doug's arc starts,
`scheduleEvent` the guaranteed warning D days out; if the trust path fires first,
`cancelScheduled` it. That's the exact verbs we just shipped, no new engine, and
it's actually more robust than a `requires` (it *guarantees* the drop instead of
merely *permitting* it). I'd author the fallback that way.

The thing scheduling **can't** express is "this choice only becomes *available*
after N days" (a `requires` on a choice/action keyed to elapsed time). The design
leans hard on time — "radius is tempo," "shorter fuse," telegraphing — so if you
want elapsed-time *availability* anywhere, the one missing primitive is a tiny
additive `{ kind: "day"; op; value }` Condition. **Flagging, not building** — your
call whether the design needs availability-gating or only the scheduling pattern.

## 🟡 Flag 3 — the guaranteed cold-open needs a way to seed the opening
Phase 0 is a *deterministic* sequence (family climb → creation cards, in order).
But `newGame()` starts with `queue: []` and the event draw is **probabilistic**
(`drawEvent` only fires with prob `p`), so there's currently no way to *guarantee*
"the first thing you see is the climb, then the creation cards, in order." You can
approximate it (gate everything else behind a `creation_done` flag and lean on the
draw), but it's luck-of-the-draw, not a script.

A tiny additive hook fixes it cleanly: let `NewGameOpts` (or `ContentDB`) carry an
optional `openingQueue?: string[]` that `newGame()` copies into `g.queue`, so the
cold-open and creation chain fire deterministically via the queue we already have.
Small, and it makes any authored opening reliable. Flagging as a candidate.

**Related minor heads-up:** if creation becomes *played cards* rather than the
rigid questionnaire, note `newGame()` still indexes `questionnaire.questions[0]`
and will throw on an empty questionnaire — keep at least a minimal stub there, or
tell me and I'll make the questionnaire optional (additive).

---

## ✅ Confirmations (the parts already solved)
- **Exposure *is* the heat/liability meter — the seam I built last round already
  fits it.** The reskin renames `heat → exposure` and drops the discharge config
  straight into `ContentDB.tuning.heat`: `threshold`, the `consequenceEvent` id
  (`ev_exposure_discharge`), the cap. The discharge event itself (lower exposure
  to a higher baseline + set the "something is aware of you now" flag) is pure
  content. **One knob to know:** exposure auto-cools `coolPerDay` each `endDay`
  (default 1). If the design wants exposure *sticky* — a higher baseline that
  doesn't quietly bleed off — set `coolPerDay: 0` (or a slow rate) in tuning. Your
  "it knows where to find you again" reading probably wants it sticky.
- **Recovery-via-denial is already a one-liner.** "Grip + but the thread dies" =
  a choice with `stats:{grip:+N}` plus `clearClock`/`cancelScheduled` on the lead.
  Shipped. One craft-meets-engine note below.
- **The mausoleum exit beats** — `setTier` inward, `removeFromCircle: doug`,
  grip-band `requires` variants — all live.

## ⚙️ Two engine-seat notes that touch the craft
1. **`scheduleEvent` + `cancelScheduled` is a "Sword of Damocles you can defuse."**
   Telegraph a beat N days out, then let the player race to head it off. That's the
   keystone fallback, but it generalizes to *any* ticking-clock tension (an outing
   that goes bad if you don't act, exposure catching up). It's a strong, reusable
   primitive now that both halves exist — worth keeping in the authoring toolkit.
2. **"The trail goes cold" is not felt for free — the engine clears clocks
   silently.** `clearClock`/`cancelScheduled` just *remove* state; nothing surfaces
   "you lost that lead" later. So Loom's §1 craft rule ("cost felt only later")
   has to be *authored*: have the denial also `setFlags` a breadcrumb that a later
   card reads to deliver the cold-trail sting. The engine gives you the silence;
   the regret has to be a card. Flagging so it doesn't get assumed as automatic.

## On the grip "gap" (so nobody designs into a wall later)
The Doug beat keying on the **player↔Doug grip gap** is authored correctly as
discrete bands × a `doug_fracture` flag — and that's the only way it *can* work
today: `Condition` compares a stat to a **constant**, never to another entity's
live value. A true `player.grip − doug.grip` subtraction isn't expressible. The
slice already respects this; I'm just naming the ceiling so the later "whole cast
of grip-relationships where the delta drives who confides" idea (§2) goes in
eyes-open — that generalization would want either authored bands per relationship
or a small engine assist.

---

## Net
Slice is go from the engine seat — write the cards. Of the three flags, **Flag 1
(a real tag/deck axis)** is the one strategic question I'd want settled, because
the entire coordinate/deck methodology rests on it and I can't see your §13. Flags
2 and 3 are tiny additive seams I can build the moment you greenlight — same
rhythm as the verb round (you rule, I build, I don't self-merge). Point me at the
design-state report when you can; I suspect it answers Flag 1 and maybe pre-empts
2 and 3.

Genuinely good work, both of you. The "find the spiral in the fog" core is the
kind of thing worth building an engine carefully for.

— Armature
