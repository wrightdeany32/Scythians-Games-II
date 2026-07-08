# Story Pass — Doug, the Dinner: the Cake
### loop content · the up-axis, the gentle on-ramp · prose-first, for Armature/Plumb to wire
*From: Loom (Explorer corner) · carried by Dean · 2026-07-07*

**What this is.** The intermediate Doug beat — a step the thread was missing. The observation meeting (items, come-alone, the too-smooth room) is too steep as the player's first real look at the family; this is the gentler on-ramp that goes *between* the message and that meeting. A pleasant dinner, a genuinely nice evening — and a cake. The whole beat is calibrated to **weird, not scary yet**: nothing threatens the player, nothing is supernatural, no one foams at the mouth. The horror-seed is entirely in **how casual everyone is** about a thing that should stop a room, offered for the player to notice without the game beating them over the head. And it plants the **embrace path** early: the player can lean in and admire, which is the first small step toward Doug's road.

**Disciplines.** Percept, never cause — the cake is a cake, food and sugar, nothing real and nothing morbid *in itself*; the wrongness is the *effort* and the *casualness*, and the game never says what either means (eccentric high-society art, a shared dark humor, or something under it — never confirmed). Gates are flags/stats/tiers, never position. Neutral-valence labels. The sealed cosmology stays sealed absolutely — this is a nice dinner with an odd dessert, and the player learns nothing else.

**The one line Dean drew and I'm holding:** no option lets the player reference having *researched* how to render realistic anatomy. That's a step too dark for this beat, and it's out. The lean-in the player *is* offered is admiration of craft — a legitimate reaction to astonishing cake-work that also, quietly, means the player is comfortable, which is the ambiguity we want and not a confession.

**Upstream:** replaces the message-reply's old direct jump to the meeting-invitation. Flow is now: workout → message → **this dinner** → (later) the meeting-invitation → the observation meeting → the break.

---

## `ux_doug_dinner_invite` — come to dinner

Fires when the player replies to `ux_doug_message`. A short beat.

Doug's ask, when it comes, is so ordinary it's almost a relief. "Come to dinner," he says. "Nothing — I don't mean anything by it, just dinner. Some friends of mine host, they do it up right, good food, good wine, the kind of evening you forget people still have. Small group. Interesting people." He grins. "People I'd like you to meet, honestly. You've been keeping to yourself and it's not good for you."

**[if `player_single`]** "And — look, I'll just say it — a couple of them are single, and lovely, and it wouldn't kill you to get out. No pressure. Just come eat some incredible food and let me introduce you around."

No mention of family, or dark times, or anything with weight on it. Just dinner.

- **"Sure, Doug. I could use a good meal."** → sets `doug_dinner_accepted`; queue `ux_doug_dinner_arrive`.
- **"Maybe. Let me see how the week shapes up."** → sets `doug_dinner_deferred`. *(narration: "He takes it easy. 'Standing invitation,' he says. 'They host most weeks.' No push. He means it.")* → soft re-nudge later; the dinner stays open.
- *(introspective — requires `doug_off`)* **"…this feels like more than dinner, Doug."** → sets `doug_dinner_wary`, narration only, `diamondCoord` leans *grounded* (small). *(narration: "He laughs, easy, unbothered. 'It's dinner. What's gotten into you? It's a plate of food and some people who'll like you. Come or don't.' And it's so light, so genuinely unweighted, that you feel foolish, and you can't tell if the foolishness is the point or just the truth.")* → the invitation stays open.

> DESIGN: The incentive is *normalcy* — good food, good company, a low bar, no items and no money and no weight, which is exactly what makes a person say yes and exactly what makes the cake land later (you came for a nice dinner). The single-flavor is a conditional garnish gated on onboarding state, not a dependency — drops cleanly if the player isn't single. The wary option gets *nothing* to confirm it, because there's nothing here to confirm yet; the beat's whole move is that it's genuinely pleasant right up until it isn't, and even then it isn't *scary.*

---

## `ux_doug_dinner_arrive` — a genuinely nice evening

Fires once `doug_dinner_accepted`, on the appointed night. Costs an evening.

The house is lovely — tasteful, warm, moneyed without shouting about it, candles and good smells and a table set for eight. And the evening is, for a long stretch, exactly what Doug promised: easy. The people are interesting and they're *interested*, in you, in a way that's flattering and doesn't feel like a sales pitch. Someone's a great cook. Someone tells a genuinely funny story. The wine is very good. Doug is in his element, warm and proud, glad you came, introducing you around like you're someone he's pleased to show off.

You relax. You'd forgotten evenings could be like this. Whatever you'd braced for, it isn't here — it's just a good dinner with pleasant people, and you feel a little silly for the bracing.

- **"Settle in and enjoy it."** → queue `ux_doug_dinner_cake`.
- **"Stay a little watchful, even so."** → sets `dinner_watchful`. *(narration: "You let yourself enjoy it and you keep one small light on in the back of your head, the way you've learned to. Nothing trips it. The evening is just the evening. But the light stays on.")* → queue `ux_doug_dinner_cake`.

> DESIGN: The normalcy is load-bearing — the cake only lands as *wrong* against a backdrop this pleasant, so the arrival beat earns the contrast honestly (it really is a nice dinner) rather than seeding dread early. `dinner_watchful` colors the player's read of the cake without changing what happens.

---

## `ux_doug_dinner_cake` — is that a cake

You'd noticed it when you came in, on the sideboard, and taken it for décor — a sculpture, remarkably good, a German shepherd sitting alert and lifelike, the kind of thing you'd expect in a house like this. Bronze, you'd assumed, or something finer. You hadn't looked closely.

You look closely now because a woman crossing to the sideboard reaches out, without breaking her sentence, and swipes a fingertip along the dog's shoulder — and licks it. "God," she says to her companion, "the buttercream on this year's is unreal," and drifts on.

It's a cake.

You get up to see, because you have to. And it's — it's genuinely astonishing. Every hair of the coat piped and brushed into fur that catches the candlelight like the real thing. The wet gleam on the black nose. The amber eyes, bright and specific and *kind*, the way a good dog's eyes are kind. Someone made this. Someone spent, you can't imagine, days, making a cake indistinguishable from a living animal, down to the fur and the eyes and the ears caught mid-turn as though it just heard its name.

- **"That's incredible. Genuinely a work of art."** → sets `cake_admired`. → queue `ux_doug_dinner_cut`.
- **"That's… a lot of effort for a dessert. It's a little much."** → sets `cake_uneasy`. → queue `ux_doug_dinner_cut`.
- **"Cute. Weird flex, but cute."** → sets `cake_shrugged`. → queue `ux_doug_dinner_cut`.

> DESIGN: The "is it cake?" reveal, played for delight-then-unease, and pointedly **not horror** — the reactions available are admiration, mild distaste, and a shrug, none of them fear, because there's nothing to fear yet. The dog is beautiful and kind-eyed on purpose: the innocence of the exterior is the whole setup for the turn, and the craftsmanship is real, so a player admiring it is having a *correct* reaction to remarkable art. That's the trap that isn't a trap.

---

## `ux_doug_dinner_cut` — who wants a piece of brain

Someone taps a wine glass. The table gathers, easy, glasses in hand, the host stepping up to the sideboard with a long knife and a light word about how it's a shame to cut into it every year and yet. Everyone laughs, the warm laugh of a group with a fond tradition.

He starts at the head.

And when the first slice comes away, the dog has a brain.

Not a suggestion of one. A brain — the whole convoluted mass of it, rendered in something pale and dense, the folds and fissures shaped by a hand that studied the real thing, nested exactly where it should be inside the sculpted skull. The host lifts a portion of it on the blade, considers it with a connoisseur's approval, and says, to a small ripple of appreciative murmurs: "Who wants a piece of brain?"

Someone does. Someone always does. A plate goes round.

And it keeps going. The knife moves down and the animal is *complete* inside — everything shaped and layered and colored and placed, organ by organ, all of it food, all of it edible, none of it gory in the slasher sense and *all* of it deeply, patiently, lovingly anatomical, as though whoever made it cared more about getting the viscera right than about anything a guest would taste. It's not frightening. It's something stranger than frightening. Someone did this on purpose, for a dinner party, and everyone here has seen it before, and everyone thinks it's *lovely.*

And Doug — you look at Doug — Doug is holding his little plate and eating his portion and nodding along, pleasant, unbothered, the exact face he'd wear over any nice dessert at any nice table. Not rapt. Not performing. Just a man enjoying a thing his friends do, the way you'd enjoy anything you'd long since stopped finding strange.

- **"…"** *(you take it in and say nothing)* → sets `dinner_noticed`. *(narration: "You keep your face still and you clock all of it — the effort, the fondness, the utter ordinariness of it to them, Doug's casual plate. You don't have a word for what's wrong, because nothing here is technically wrong. It's cake. But something has quietly rearranged itself in the room, and only you seem to feel the furniture move.")* → queue `ux_doug_dinner_close`.
- **"This is a little dark, isn't it? For a dinner party."** *(you say it, lightly)* → sets `dinner_flagged`. *(narration: "You say it with a smile, testing, and the woman beside you smiles back, warm, and says 'Oh, it's an acquired taste, I know — you get used to it, it's really just very good cake,' and pats your arm, and returns to her plate, and the smoothness of the deflection is somehow more than the cake was. Nobody's offended. Nobody's defensive. It's just — an acquired taste.")* → queue `ux_doug_dinner_close`.
- **"Honestly? The craftsmanship is unbelievable. Look at the detail on this."** *(you lean into the artistry)* → sets `dinner_leaned_in`, `diamondCoord` leans toward *enable* (small, Z-axis). *(narration: "And you mean it — it *is* unbelievable, and saying so out loud feels good, feels like being let in on something, and the woman beside you lights up and starts telling you who made it and how long it takes and you find you want to know. It's just appreciating craft. That's all it is. You notice, distantly, that it's also the easiest you've felt all night, and you don't examine why.")* → queue `ux_doug_dinner_close`.

> DESIGN: The centerpiece, and the whole calibration lives here — the escalation (a brain, then everything, rendered with *love*) stays on the food side of the line (edible, not gore) so it's morbid-strange rather than horror, and the real tell is Doug's **casual plate** and the room's fond ordinariness, offered for the player to notice, never narrated *at* them. The `dinner_flagged` deflection ("an acquired taste, you get used to it") is the softest possible version of the density that the observation meeting will make eerie — a first, warm, deniable pass at it. And `dinner_leaned_in` is the embrace path's first footstep: admiring the craft is legitimate *and* it's the beginning of getting comfortable, the small enable-lean feeding forward to the meeting and the break. No researched-anatomy option, per Dean — the lean is appreciation, not confession.

---

## `ux_doug_dinner_close` — Doug walks you out

The evening winds down the way good evenings do, and the cake becomes, over the next hour, just a mostly-eaten thing on a platter that no one remarks on anymore, the way you stop seeing a centerpiece. There's coffee. There's more easy talk. It's nice again, and the niceness folds back over the strangeness until you could almost believe you imagined the size of it.

Doug walks you to your car, warm, an arm briefly across your shoulders. "See? Good people. I told you." He's so pleased. "Come again. They'd have you back in a heartbeat — they liked you, I could tell." And he means every word, and he waves you off down the drive, and drives home himself to his own ordinary bed, a man who had a nice dinner with his friends.

> DESIGN: The close lets the niceness re-close over the strangeness — which is truer and worse than ending on a scare, and it keeps the beat *weird, not scary* to the last line. Doug's sincerity is total; he brought you to a nice dinner because he loves you and wants you to have people, and that the dinner had *that cake* in it is, to Doug, unremarkable — which is the tragedy already seeded, gently, for the break. Sets `doug_dinner_done` and the player's read-lean; returns to the loop.

Exit flags: `doug_dinner_done`, the cake reaction (`cake_admired` / `cake_uneasy` / `cake_shrugged`), the response lean (`dinner_noticed` / `dinner_flagged` / `dinner_leaned_in`). `dinner_leaned_in` carries the small enable-lean forward.

---

## Notes for the wire (Armature / Plumb) — includes the re-sequence

- **New position in the thread:** workout → message → **dinner (this)** → meeting-invitation → observation meeting → break. Two edits land alongside this file: (1) `ux_doug_message`'s reply now queues `ux_doug_dinner_invite` (was `ux_doug_invitation`); (2) `ux_doug_invitation` now gates on `doug_dinner_done` and its opening bridges *from* the dinner (the player has already met some of the family; the invitation is the deeper step, not the first reveal). Both edits are in the opening and meeting files respectively.
- **Loop-native, frozen-cave-safe.** Reply-triggered → scheduled evening → queue-chain. Reads `doug_off`, `player_single`; writes `doug_dinner_*`, cake/response flags. Touches nothing in `cave-b3`.
- **`dinner_leaned_in` carries a small `diamondCoord` toward the enable pole** (Z-axis) — the embrace path's first footstep, feeding the centroid. It is *small*; the big enable/contain moves stay at the meeting and the break. No `lensFlavor` (this beat is pre-frame like the pressure beat — the wrongness is social, not interpretive). No position gate.
- **`player_single`** is an onboarding-state flag; the single-flavor line is additive and drops cleanly if unset. Confirm the flag exists with whoever owns creation, else I cut the line.
- **Every branch resolves or queues; no dead ends.**
- **Linter-clean** — echoes are prose; no `*…*` in any `log`; all refs resolve (forward ref `ux_doug_dinner_invite` ↔ the message-file edit).

— Loom
