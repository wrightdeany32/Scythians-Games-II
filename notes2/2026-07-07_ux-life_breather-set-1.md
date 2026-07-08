# Story Pass — The Breather Set: Ordinary Life
### loop content · coordinate-silent texture · prose-first, for Armature/Plumb to wire
*From: Loom (Explorer corner) · carried by Dean · 2026-07-07 · accepted from Azimuth's catch*

**What this is.** The mundane texture the horror is a deviation *from* — a set of ordinary-life loop actions that carry **no `diamondCoord` and no `lensFlavor`** and in which **nothing happens.** Azimuth's catch is load-bearing: if every draw is thread-content, no week can be quiet, and the **quiet-week snap** (uniform mundane days never move the centroid, so a scare after them pulls *hard*) has no quiet to snap out of. The precondition for the game's best pacing tool is that ordinary life actually exists in the loop. This is also Slate's life-support idea realized: the loop is a *life*, not a horror-delivery machine, and the eruption lands because there's a life for it to erupt into.

**Disciplines.** Coordinate-silent (no diamond move, ever — that's what makes a week *quiet*, mechanically). Lens-silent (no flavor — these don't tilt frame). And genuinely uneventful: no anomaly, no thread hook, no wink. The one thing they may do is *steady* you a little — ordinary life restores a little grip — because that's true, and because grip needs somewhere to recover that isn't only the denial-brake.

**One knob, flagged for Armature:** the **quiet-to-thread draw ratio** and the **grip-recovery rate/cap** on these are tuning targets we won't nail until a Run Read. I've written enough texture to make quiet weeks possible and marked which cards steady you; the exact recovery number and the cap (so it can't be farmed) are Armature's, in the believer's-floor tuning file. These are the *content*; the balance is the *tuning*.

---

## The set

All are loop actions off the day menu, each an ordinary way to spend energy. Repeatable. No position gate, no flavor, no thread flags. Grip effect noted per card (most neutral; a few gently restorative, capped by tuning).

### `ux_life_work` — the shift

You have a job, because everyone has a job, and today you do it. The hours go the way hours go — some tedious, some fine, a small annoyance, a small satisfaction, a coworker's story about their weekend that you half-listen to. You are, for eight hours, a person with ordinary problems: a deadline, a printer, someone who took your lunch from the fridge. It is the most normal you feel all week, and you don't notice until you're driving home that your shoulders came down from around your ears somewhere in the afternoon.

*Grip: small restore (capped). No coordinate, no flavor.*

### `ux_life_dinner` — something on the stove

You cook. Nothing ambitious — the thing you know how to make without thinking, the knife-work automatic, the pan loud, the kitchen warm and smelling like a place people live. You eat it at the counter or in front of something, and it's good, or it's fine, and it's yours, and there is nothing in it but dinner.

*Grip: small restore (capped). No coordinate, no flavor.*

### `ux_life_call` — someone who has nothing to do with any of it

You call someone from the ordinary part of your life — a friend from before, a sibling, a parent, someone whose world has never once touched the woods. You talk about nothing that matters: their kid, a show, a complaint about a mutual acquaintance, a plan that may or may not happen. You don't mention any of it. For twenty minutes you are just a person they know, in the middle of a normal life, and hanging up you feel the specific steadiness of having been, briefly, only that.

*Grip: small restore (capped). No coordinate, no flavor.*

### `ux_life_errands` — the ordinary list

Groceries. The hardware store for the thing that's been broken. The post office. You run the list, and the list gets shorter, and there is a low animal satisfaction in the shortening. The store is fluorescent and boring and full of people buying paper towels. Nobody there has ever seen anything they couldn't explain. You buy your paper towels and go home.

*Grip: neutral. No coordinate, no flavor.*

### `ux_life_morning` — a good one

You wake before the alarm, and the light's good, and there's coffee, and for once nothing is pulling at you. You take the morning slow. Maybe you sit outside. Maybe you just sit. It's the kind of ordinary hour that a life is actually made of, the kind you don't remember later because nothing happened in it, and it is quietly, completely fine.

*Grip: small restore (capped). No coordinate, no flavor.*

### `ux_life_evening_in` — nothing on

An evening with nothing in it. Something on the screen you're not really watching, or a book, or the specific pleasure of an early night. The apartment is quiet in the good way. You are tired in the good way. Nothing knocks. Nothing hums. You go to bed at a reasonable hour and you sleep, and the sleep is ordinary and full, and you don't dream of anywhere at all.

*Grip: small restore (capped). No coordinate, no flavor.* **[if `took_shard`]** *— suppressed: replace the last line with "and you sleep, mostly, and if you dream you don't remember it, and you take the not-remembering as a mercy," and set grip to neutral. Even the quiet is a little less quiet with the shard in the drawer.*

### `ux_life_walk` — just a walk

You go for a walk with no destination and nobody's pace but your own — around the block, along the river, wherever's near and easy. Not the woods. Just streets, and other people's windows going gold, and a dog that wants to say hello. Your body's glad of it. Your head goes quiet the way it only does when you're moving and nothing's wrong. You come back a little more yourself.

*Grip: small restore (capped). No coordinate, no flavor.*

---

## Notes for the wire (Armature / Plumb)

- **Loop-native, frozen-cave-safe, coordinate- and lens-silent.** Day-menu actions, all repeatable, reading/writing no thread flags. **No `diamondCoord`, no `lensFlavor` on any of them** — this is definitional: coordinate-silence is what lets a week of these be *quiet* (the centroid doesn't move), which is the mechanical precondition for the quiet-week snap.
- **Grip recovery is the one live effect** — most cards small-restore, a couple neutral. **The recovery amount and its cap are Armature's tuning** (believer's-floor file) — the cap matters so ordinary life can't be farmed into invulnerability. I've marked intent per card; the numbers are yours.
- **`ux_life_evening_in` has a `took_shard` variant** — the only concession to the shard strand: even the quiet is a shade less quiet once you've taken the piece. Additive; drops cleanly if `took_shard` is unset.
- **Quiet-to-thread draw ratio is the open tuning target** (mine + yours, at Run Read) — there need to be enough of these, weighted enough, that a player *can* spend a quiet week. If thread-content dominates the menu, no week is quiet and the snap never arms. Flagging as the knob to watch.
- **Linter-clean** — echoes are prose; no `*…*` in any `log`; all refs resolve. (These are near-choiceless by design — ordinary life doesn't fork; it just passes.)

— Loom
