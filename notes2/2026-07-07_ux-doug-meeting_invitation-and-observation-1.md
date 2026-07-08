# Story Pass — Doug, the Meeting: the Invitation and the Observation
### loop content · the two-sided faction beat · the Z-axis · prose-first, for Armature/Plumb to wire
*From: Loom (Explorer corner) · carried by Dean · 2026-07-07*

**What this is.** The Doug thread's middle — the invitation (with the money commitment hook) and the observation meeting: the Eyes-Wide-Shut-coded gathering that is the cult's outer shell. This is the pack's **two-sided faction beat** and the first real exercise of the **Z-axis** (enable ↔ contain): from inside, via Doug, the same material is *family, protection, belonging*; the container's-eye version (an outsider exposing it) is a future thread from the identical scene. Neither side resolves whether anything supernatural is real — the believer holds a lens, the container takes a position on what to *do* — which is why the beat can be two-sided without collapsing the anti-noun. Doug's break (the thread's climax) is the next pass.

**Disciplines.** Percept, never cause — the wrongness at the meeting is *perceived* (coordination a hair too smooth), never explained. Gates are flags/stats/tiers, never position. Neutral-valence labels. And the sealed layer — the depleted leader's faint pull, the new one practicing his control, the density-as-steering — surfaces in **nothing**. What the player gets is a room of people who move together a little too well, and the unshakable sense that *they* are the one who doesn't. Whether that's influence or just how tight in-groups feel from outside is never answered.

---

## `ux_doug_invitation` — the ask

Fires a while after `doug_dinner_done` (`scheduleEvent`) — the deeper step, once the player has met some of the family at the dinner. A short in-person scene.

You meet Doug for coffee because he asked to do this in person, and in person he's nervous in a way you've never seen — not scared, *careful*, choosing words.

"You liked them," he says. "At the dinner. I could tell — and they liked you." He turns his cup. "So I'm going to tell you the rest of it, because you've felt the shape of it now even if nobody put a word to it. It's not just dinners, those people. It's a family. Has been a long time. People who understand that the world takes and takes, and the only thing that's ever held anybody up is other people deciding not to let them fall." A breath. "And there's a real gathering. Not a dinner — the heart of it. I want you to come see. Just once. Just to see."

There's a catch and you wait for it and it comes gently.

"There's a — a way of doing it. You come on your own. And there's some things you'd wear. Nothing crazy. It's tradition, it matters to people, and I'll be honest with you, it's not free — you'd have to get the pieces yourself. I know that's a lot to ask. I wouldn't ask if it didn't mean something."

- **"Okay, Doug. I'll come see."** → sets `doug_committed`, `money_set_aside_doug`. *(narration: "You say yes to Doug, not to the thing, and you can see how much it means to him that you did. You set the money aside for the pieces that evening — and setting it aside is the cost: it was earmarked for something of your own, and now it's his. An investment is a kind of belief you pay for before you have it.")* → queues `ux_doug_meeting_arrive`.
- **"That's real money, Doug. I've been putting it toward [my own thing]. Let me sit with it."** → sets `doug_deferred`. *(narration: "You weigh the pieces against what you'd been saving for — the trip, the gear, whatever's yours — and the weighing is its own answer, for tonight. He says take your time; the offer stands. But you both heard you count the cost, and so did you.")* → resolve (the ask stays open; the player can commit later).
- **"I don't think it's for me, man. But I'm glad you've got it."** → sets `doug_declined_meeting`. *(narration: "He nods. He's not hurt, or he doesn't show it. 'Offer stands,' he says. 'Always will.' And he means it, and the door stays open behind you as you go.")* → resolve.
- *(introspective — requires `doug_off`)* **"…why does this feel like a recruitment, Doug?"** → sets `doug_named_it`, narration only, no stat, `diamondCoord` leans *grounded* (small). *(narration: "He goes quiet. 'Because it is,' he says, and the honesty is worse than a denial would have been. 'That's what family is, when it's real. Somebody reaches for you. I'm reaching for you.' He holds your eye. 'You can say no. People forget that part. You can always say no.' Which is exactly the kind of thing that's true whether it's true or not.")* → queues `ux_doug_invitation` follow (the ask stands; the player still chooses to commit or decline).

> DESIGN: The money cost is the commitment hook made mechanical — leaning in is a *paid* act, so the player's investment is real and felt (sunk cost is the oldest recruitment tool there is). The invitation reads exactly as real cult recruitment does: a trusted friend, a warm vague belonging, an escalating ask, and the "you can always say no" that is technically true and does none of the reassuring it pretends to. `doug_named_it` lets the sharp player call it and changes nothing — because naming a recruitment doesn't make it stop being a warm offer from someone you love, which is the trap.

---

## `ux_doug_meeting_arrive` — the house

Fires once `doug_committed`, on the appointed evening. Costs energy (an evening out).

The address is a house you didn't know existed, set back off a road you've driven a hundred times — big, old, moneyed in the quiet way that doesn't need to announce it. There are other cars. Nice ones. You wear the pieces you bought and you feel like you're in costume until you get inside and everyone is in the same costume and then you feel like the one thing worse, which is *underdressed in it.*

Doug meets you at the door and his relief at seeing you is enormous and genuine. "You came," he says, and grips your shoulder, and for a second it's just Doug, your Doug, glad you're here.

Then he walks you in.

- **"Stay close to Doug."** → sets `meeting_with_doug`; → queue `ux_doug_meeting_observe`.
- **"Drift. Watch the room."** → sets `meeting_watching`; → queue `ux_doug_meeting_observe`.

---

## `ux_doug_meeting_observe` — the room that moves together

It's a party, and it isn't. Forty-odd people, drinks, low talk, the warm hum of a room full of people who know each other. Older, most of them. Comfortable. Kind, even — you get introduced, hands are shaken, someone asks about your drive with real interest. Nothing happens. There is no altar, no chanting, no robed figure. It is the least sinister room you have ever stood in.

And you cannot relax in it, and it takes you a while to understand why, and when you understand it your skin goes cold:

*They move together.*

Not dramatically. Not all at once. But a toast goes up across the room and the glasses rise a half-beat before the man finishes proposing it, like the room already knew the shape of the sentence. Two people at the window finish a thought in the same three words and laugh, and it's the laugh of an old joke except you'd swear you watched them meet for the first time. And once — you'd doubt it if you weren't looking right at it — the whole room turns, easily, unconsciously, toward the far door a moment *before* it opens and someone comes in.

Each one is nothing. People finish each other's sentences. Rooms have a mood. You're keyed up and you're seeing patterns, which is exactly the thing you now know your brain does in the dark.

But you're standing in the middle of it, and every one of them moves with an ease you don't have, a rhythm you can't find, and the longer you stand there the more certain you are of one small terrible thing: *in a room where everyone belongs to the beat, the person who stands out is the one who doesn't.* And that's you. You're the visible one. You're the note that's off.

- **"This is a cult. I'm standing in a cult."** → sets `read_cult`, `lensFlavor: spiritual`. *(narration: "You feel it lock into place, and the certainty is almost a relief — a name for the wrongness. And under the certainty, the small clear voice: you can't prove one thing you just saw. People finish sentences. Rooms turn toward doors. You'd need it to be more than that, and it wasn't, quite. It never is, quite.")* → queue `ux_doug_meeting_close`.
- **"It's a room full of rich people who've known each other forever. That's all this is."** → sets `read_mundane`, `lensFlavor: institutional`. *(narration: "You talk yourself down, and it works, because it's *reasonable* — this is exactly what old money looks like from outside, a closed circle that reads as sinister to anyone not in it. You believe it. Mostly. There's a half-beat you keep coming back to, a toast that went up too early, and you set it down, and it doesn't quite stay down.")* → queue `ux_doug_meeting_close`.
- *(introspective)* **"…I am the only real person in this room."** → sets `read_outsider`, narration only, no stat, `diamondCoord` leans *attuned* (small). *(narration: "The thought arrives whole and you can't unthink it — that everyone here is moving to something you can't hear, and you're the one raw nerve in a room of people at perfect ease, and you don't know if that makes you the sane one or the only one not yet let in on it. You don't know which is worse. You keep your face still and you drink your drink.")* → queue `ux_doug_meeting_close`.

> DESIGN: The scene's whole engine is the **density flip** — not "spot the controlled person," but "feel yourself be the only one out of step." That's fresh and it's unfalsifiable exactly as wanted: the eerie unanimity reads as influence to one player and as ordinary in-group tightness to another, and the game confirms neither. The three "weird things" are coordination a hair too smooth — each explainable, the accumulation the wrongness — and, crucially, the player's own clear voice undercuts every read (you can't prove sentence-finishing means anything). The three reads split by lens (spiritual / institutional / the outsider's vertigo), so *which frame the player brings out of this room* is theirs, and it feeds the lens centroid.

---

## `ux_doug_meeting_mark` — the thing you've seen before *(conditional insert, fires during observe if `cave_saw_etchings`)*

You're half-listening to a man explain something warm and vague about tradition when your eye catches on his ring.

It's on the signet. Small, worn, easy to miss. You've seen it before. You've seen it scratched into cave rock by lamplight, low and left on a wall that later closed over like it had never been touched. The same mark. On a rich man's finger, in a warm bright room, twenty miles and a world away from the dark you first saw it in.

He notices you looking. He smiles, the way you smile at someone admiring a thing you're fond of, and says it's been in the family a long time, and moves on.

- **"Say nothing. Remember the ring."** → sets `meeting_mark_seen`. *(narration: "You file it. A symbol on a wall and a symbol on a ring, and the space between them that your mind is already trying to close. You don't let it close. Not here. But you'll never quite un-see the two of them sitting side by side.")* → return to observe flow.

> DESIGN: The recognition payoff — cave ↔ meeting, made experiential and confirmed by nothing. It fires only if the player did the cave and saw the etchings, so it rewards the player who connected the world themselves, and it lands percept-only: the *same mark*, no word of what it means or whether the two places are one thing. This is "four mouths of one shaft" as a private, un-narrated click. (Tricia-in-the-room is held for a later, deeper beat; the ring is the light-touch version for the flagship.)

---

## `ux_doug_meeting_close` — the drive home, and Doug's face

Doug finds you near the end. "So," he says, and there's a whole life in the word — hope, and fear of your answer, and love. "What'd you think?"

- **"I don't know what I saw, Doug. But I'm glad I came for you."** → sets `doug_meeting_open`. *(the honest non-answer; the door stays open both ways.)*
- **"These are good people. I get it now."** → sets `doug_meeting_embraced`, advances toward the enable-pole. *(narration: "His whole body eases. You've given him the thing he wanted, which was not your soul — it was to not be alone in this. You watch what it means to him, and you can't tell, and will never be able to tell, whether you just comforted your oldest friend or took the first step onto his road.")*
- **"I think you should get out of this, Doug. Whatever it is."** → sets `doug_meeting_refused`, advances toward the container-pole, **standing −1 with Doug**. *(narration: "The ease goes out of him. Not anger — grief. 'You don't understand it yet,' he says, and it's gentle, and it's the saddest thing he's said all night. 'I hope you never have to.' And you realize, driving home, that you can't tell if he was recruiting you or *warning* you, and that maybe, for Doug, there was never any difference between the two.")*

> DESIGN: The three reads set the thread's lean toward the break (`doug_meeting_embraced` → enable / he lingers; `doug_meeting_refused` → contain / he's reclaimed; `doug_meeting_open` → the middle). Doug stays sincere throughout — the believer's-eye of the two-sided content — and the last line seals the anti-noun on his whole character: recruitment and warning, indistinguishable, which is what makes him tragic instead of villainous. Returns to the loop; no terminal.

Exit flags: `doug_meeting_done`, the chosen `doug_meeting_*` lean, `meeting_mark_seen` (if earned), and the `read_*` frame the player left with.

---

## Notes for the wire (Armature / Plumb)

- **Loop-native, frozen-cave-safe.** Reply-triggered scene → scheduled evening → queue-chained observation. Reads `doug_committed`, `doug_off`, `cave_saw_etchings`; writes `doug_meeting_*`, `read_*`, `meeting_mark_seen`; appends `lensFlavor` on the two framed reads.
- **Money is a set-aside, not a debit** (per Dean) — the commit branch sets `money_set_aside_doug`, and the cost is *felt as opportunity cost*: the defer branch names the player's own goal the money was going toward. The `[my own thing]` slot fills from context — `thread_nora_active` → "the trip with Nora"; else "better gear" / a default. Converts to a real debit cleanly if/when a money stat lands.
- **Lens vocab note:** `read_mundane` should carry `lensFlavor: skeptic` (not the `institutional` written above in `ux_doug_meeting_observe` — a pre-lock tag; sweep it to `skeptic`). Locked starting vocabulary is `spiritual` / `physics` / `institutional` / `skeptic`; linter enforces the closed list.
- **The mark insert gates on `cave_saw_etchings`** (a flag) — no position gate; if the player never saw the etchings, the insert doesn't fire and the scene plays without it.
- **`diamondCoord` on the introspective options only**; the two framed reads carry **`lensFlavor`** (spiritual / institutional), not diamondCoord — the frame you leave the room with tilts your lens, which is the point. Needs the branch-level fields, same as the rest of the pack.
- **Every branch resolves or queues; no dead ends.**
- **Linter-clean** — echoes are prose; no `*…*` in any `log`; the one forward ref is the next pass (Doug's break); wire after that lands or stub it.

— Loom
