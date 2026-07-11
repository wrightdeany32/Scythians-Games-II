# Story Pass — The Return to White's Hall
### the flagship's closer · prose-first, for Armature/Plumb to wire and Vigil to rule
*From: Loom (Explorer corner) · carried by Dean · 2026-07-07*

**What this is.** The return trip — the scene the whole cave arc has been pointed at, and the run's cut-off. A queue-chained scene like the cave, entered from the daily loop (not part of the frozen `cave-b3`; new content). Prose is player-facing. Anything in a `> DESIGN` block is author-facing and must **never** reach a card — echoes are written as clean prose, per the sweep lesson.

**The three disciplines, held absolutely here.** (1) **Percept, never cause** — every uncanny thing is described as *perceived*; the narration never adjudicates what made it. (2) **Gates are flags/stats/tiers, never position** — grip is a stat, so grip-gating is fine; disposition is never read. (3) **Neutral-valence labels** — the choice says what you *do*; the stakes live in the narration.

**The charge gate.** Everything keys off `took_shard`. Took the shard on the first trip → the personal, full-intensity version (the copy you made, no longer matching; the knife). Left it → a milder, displaced version (still a closer — everyone gets one — but the anomaly reaches for you with less of a grip). Both paths are written below; the shard-charged is primary, the milder variant marked at each gated beat.

---

## Entry — the loop action

`ux_act_return_whites` — a map/lead action, appears once `cave_done`, costs a full day's energy (it's a day-trip). Available when the player has a reason to go back — after any of the threads that keep pulling at the cave (the etchings, the shard, Nora's book). No position gate; a flag/energy gate only.

> DESIGN: The player chooses to go back — that choice is the whole point (they weren't warned off, they *returned*). Reese comes reluctantly; the pretext flexes by what pulled them (a photo Nora wants, a thing left behind, the plain fact that neither of you said out loud that you can't stop thinking about it). Motivation stays the player's; the game supplies dread, not reasons.

---

## `ux_return_enter` — the mouth, again

The gravel lot is the same gravel lot. Same lean of the same trees, same cold coming up out of the dark like the hill is breathing on you. Reese kills the engine and doesn't get out.

"I want it on the record," he says, "that this was your idea."

It was. You don't say so; he knows.

The mouth of White's Hall is where you left it, a black seam in the rock the size of a coffin stood on end. You've been here once. You know the way down. That's the part that should make this easier, and doesn't.

- **"Let's just get it done."** → sets `return_committed`; queue `ux_return_descend`.
- *(introspective)* **"…I don't know why I wanted to come back."** → narration only, no stat; `attune` leans *attuned* (small). *"You say it to the windshield. Reese doesn't answer, which is answer enough."* → queue `ux_return_descend`.
- *(introspective)* **"It's a hole in the ground. That's all it is."** → narration only, no stat; `attune` leans *grounded* (small). *"You say it like a man locking a door. It helps about as much as that ever does."* → queue `ux_return_descend`.

> DESIGN: The two reflective options are Vigil's introspective-coordinate beats — they color the inner life and nudge the diamond by *feeling*, never by a slider, and only these two carry a coordinate because only these split grounded-vs-attuned. Both queue the same card. The label states the action flat; the stakes are in the reply.

---

## `ux_return_descend` — the familiar way, wrong

The squeeze you fought through the first time takes you first try. You tell yourself you've done it once, your body remembers the shape of it. That's probably true.

The passage runs the way it ran before — the same low ceiling, the same place it opens out. Reese's lamp finds the walls and the walls are where they were. Nothing has moved. Nothing is different.

You just can't shake the feeling that you're being shown the way, rather than finding it.

- **"Keep going."** → queue `ux_return_erased`.
- **"Slow down. Look at everything."** → sets `return_careful`; queue `ux_return_erased`. *(narration: "You go slow. It doesn't make you feel more in control; it just gives the dark more time to be looked at.")*

---

## `ux_return_erased` — your own record won't hold

You come to the chamber. The wide one, where the marks are.

**[if `took_shard`]** You go to the wall where you copied it — you remember the spot, low and left, the sideways numerals and the ellipse that wouldn't close. You take the page out of your pack, the soft-folded page you've looked at a hundred nights, the marks you could draw with your eyes shut by now. You hold it up against the wall to check it against the thing itself.

It doesn't match.

Not by much. But the ellipse on the wall *closes*, and the one on your page doesn't. There's a mark on the wall your page doesn't have — one stroke, off to the side, small and deliberate. And the sideways numerals lean the other way. You copied this. You crouched here in the cold with the light in your teeth and you copied it *line for line* — you would put your life on line for line — and you are holding your copy up against the wall and they are not the same thing, and there is no way on this earth to know which of them changed: the wall, or the page, or your hand that night, or every night since that you took it out and looked at it and told yourself you had it by heart.

"Reese." You hear your own voice do something you don't like. "This is wrong. Look at it. I *copied* this — you were right there."

And Reese was right there. He crouched next to you with his lamp while you drew it, close enough to complain about the cold the whole time. He can't tell you that you misremembered the spot. He watched you get it right. He looks at the wall, and at the page shaking in your hand, and at the gap between them that has no name, and he opens his mouth.

Nothing comes out.

> DESIGN: The reframed reassurance-failure beat — the **fourth ripple** of the shard-as-symbol reframe, replacing the old healed-scar that record-don't-pocket made impossible. It's *crueler* than the healed stone by where it aims: the healed scar attacked the world's record of the player; the mismatch attacks **the player's own evidence — the one proof they made** — and it weaponizes the possession arc directly (the thing you can draw with your eyes shut is *wrong*, and you can't say since when). Reese's silence is load-bearing exactly as before and better motivated: he crouched beside you while you copied it (*light in your teeth*), so his skepticism has nothing to offer — he can't say *you misremember*, because he watched you get it right. Fires **once**, only here, only with `took_shard`. Percept-only: the copy and the wall disagree; the game never says which changed, or how. The four candidates — wall, page, hand, memory — are named and **none confirmed**, the anti-noun turned on the player's own epistemics. This beat is the first of the chamber's two wrongnesses for a frayed shard-taker; the illegible mark on the far wall (`ux_return_illegible`) is the second — the player's own evidence fails *here*, then the unreadable thing resolves *there*, an escalation from "my proof is wrong" to "I can read what I couldn't." (Choreography per Azimuth: both live at this wall now; this is the order.)

**[if not `took_shard`]** You go to look for your bootprints from the last time, in the silt near the wall. There aren't any. Not scuffed, not swept — *absent*, the silt lying smooth and undisturbed, as though no one has ever crossed this floor. You know you crossed it. You were here.

Reese says the water must move through, must settle the floor flat between visits. It's the kind of thing that's probably true. He says it a little too quickly, and doesn't say anything after it.

> DESIGN: The milder variant — the erased trace is your *presence* (prints), not the scar you *made*. Uncanny, but less personal, and Reese still manages a rationalization (he can explain smoothed silt; he can't explain a copy that no longer matches the wall he watched you make it from). This is the charge gate doing its work at the scene's hinge.

- **"We should go."** → queue `ux_return_fork`. *(narration: "You say it, and neither of you moves toward the way out.")*
- **"There's more of it deeper. I want to see."** → sets `return_pushing`; queue `ux_return_fork`.

---

## `ux_return_illegible` — the thing you couldn't read *(conditional insert, fires before the fork if `grip <= 3`)*

On the far wall is the mark you couldn't look at, the first time — the one your eye kept sliding off of, the one that came up as nothing you could hold in your head.

You can hold it now.

It doesn't resolve into a letter, or a picture, or a word. It resolves into a *direction* — the way it wants to be read, the way the lines lie down and point, and following them with your eyes is like the moment your foot finds the next stair in the dark without your telling it to. You understand the shape the way you understand which way is down.

You don't understand anything else about it. You just know, now, which way it always pointed.

- **"Look away."** → sets `return_readmark`; queue `ux_return_fork`.
- *(introspective)* **"…how did I ever miss this?"** → narration only, no stat; `attune` leans *attuned* (small). → queue `ux_return_fork`.

> DESIGN: The ▓▓ payoff — the return-when-frayed reveal. Gated on **grip (a stat)**, never on position. And held *strictly* percept-only: what resolves is a *perception* (a felt direction, a bodily certainty), never a *meaning*. The player perceives that it points; the game never says to what. If grip is above the threshold, this card doesn't fire and the mark stays illegible — the sight is the reward of having frayed.

---

## `ux_return_fork` — deeper, or out

The way you came is behind you. The chamber narrows, at the back, into a throat you didn't go down the first time — you turned around here, before, and told yourself you'd seen enough.

You could turn around again.

- **"Go down."** → sets `return_went_deep`; queue `ux_return_deep`.
- **"That's enough. Out."** → sets `return_turned_back`; queue `ux_return_carseat`.

> DESIGN: Both branches resolve — the deep branch and the out branch both reach a terminal (no dead ends, per the grip-banded guardrail). The out branch is the crueler variant, and it's the *sane* choice — which is the whole point of it not protecting you.

---

## `ux_return_deep` — down the throat

You go down. What the throat does to you depends on what's left of you.

**`bandText` — the descent register:**

- **`grounded`** (grip 7+): *You go down, and the throat fights you the way rock fights meat, and you come out the bottom scraped and breathing hard and* certain, *in the animal part of you, that you should not be here. You come anyway. Reese comes because you came.*
- **`worn`** (grip 4–6): *You go down, and the throat is just* work — *hard and close and mean — and you're already so tired that you neither fight it nor feel it let you through; you just endure it, one scrape at a time, the way you've endured everything these last weeks. You come out the bottom emptied. Reese comes out behind you, quiet, and neither of you says a word about how hard it wasn't and how easy it also wasn't. You're past that kind of talk.*
- **`frayed`** (grip ≤3): *You go down, and the way is easy in a way it has no business being — the throat that should fight you lets you through, and you have the ugly thought that it's letting you through because you finally stopped bracing against it. You don't examine the thought. You follow the mark you can read now, and it takes you down, and Reese follows because the alternative is being alone up there.*

> DESIGN: Restructured from the old two-way `grip ≤3 / grip >3` fork into three bands, per Azimuth/Vigil — the old `>3` variant was a single voice covering grip 4–10, which left the **worn middle (4–6), the register most players actually live in, voiceless at the descent.** The `worn` register is the new write and it carries the most weight: someone worn thin who hasn't broken, enduring rather than fighting or surrendering. The band resolver's adjacent-leak blurs the 6→frayed and 4→grounded edges, so the boundary isn't a clean reverse-engineerable line — the noise discipline restored at the one deterministic seam it was missing from. Note only `frayed` references *the mark you can read now* — that's the ▓▓ payoff, itself grip-gated to `≤3` in `ux_return_illegible`; the worn and grounded descents never saw it resolve, so they don't mention it. (The illegible insert **stays a hard gate** — the ratified one-boundary system; only the descent *flavor* becomes band-select.)

The passage bottoms out in a space too regular to be a cave and too rough to be a room. Your lamp doesn't reach the far side.

Something is on the floor, at the edge of the light. Small. Pale. Waiting to be looked at.

- **"Go to it."** → queue `ux_return_knife_deep`.

---

## `ux_return_knife_deep` — the knife

It's a pocketknife.

Bone handle gone the color of old teeth, the brass pin at the pivot, the little chip out of the bolster where it got dropped on concrete once, forty years ago, by a man who's been dead for six.

Your grandfather's knife.

You haven't thought about this knife in years. You'd stopped looking for it so long ago you'd stopped *remembering* you ever had. It went missing when you were a kid, and you cried about it, and then you were nine and it was a year later and you never thought about it again.

It's here. On the floor of a cave you have been inside exactly twice. Yours. His.

Reese is looking at it too. You watch him need it to be a thing that has an explanation, watch him build one in real time, because the other option is standing in the dark with what's actually in front of him.

"You must've…" he starts. "You had it on you. Last time. It fell out of your pack, and —"

> DESIGN: The player's recognition lands *first* — the wrongness is felt before the denial is offered — then Reese reaches for the one sane reading available (you dropped it), and reaches *hard*, because he needs it. The four replies below are the run's final grip-and-relationship fork; each sets exit state and then queues the end. No option is "correct." Neutral-valence labels; the weight is in the narration.

- **"I haven't thought about this knife in years."** → *(sits with it; the doubt lodges. No stat change.)* → queue `ux_return_end`.
- **"…"** *(you don't have words)* → **grip −1** *(the sight is more than you can hold)* → queue `ux_return_end`.
- **"You're right. It fell out of my pack."** → **grip +1**, sets `denied_knife` and `lead_whites_cooled` *(you take the reading he's holding out; it steadies you, and something closes)* → queue `ux_return_end`.
- **"We weren't in this part of the cave, Reese. Neither of us has ever been down here."** → sets `held_truth`, **standing −1 with Reese** *(you say the thing he can't answer; he stops trying, and something in how he looks at you changes)* → queue `ux_return_end`.

**[if not `took_shard`]** *(milder variant of the object — same beat, less grip on you)* It's a pocketknife, and it takes you a long, cold second to place it, and when you place it your stomach drops: it's *like* your grandfather's. The same make, the same bone handle. Not the chip in the bolster — you'd swear his had a chip — but close enough that you can't breathe for a moment, close enough that Reese's "so it's a knife, somebody lost a knife down here" lands and *almost* holds. Almost.

> DESIGN: Without the shard, the anomaly reaches for you with a weaker grip — near-miss recognition instead of certainty, and Reese's rationalization *almost* works. Same four replies apply, one register softer. Everyone gets the closer; the shard decided how personal it got.

---

## `ux_return_carseat` — you did the sane thing

You turn around. You go up the throat and back through the squeeze and out into the grey afternoon, and the relief of the daylight is so total it's almost funny, and Reese *does* laugh, the ugly one, the it's-over one, and you laugh with him and it's real.

You get in the truck. You reach to put your keys in, and your hand stops.

There's something on the passenger seat. Small. Pale.

**[if `took_shard`]** Your grandfather's knife. Bone handle, the chip in the bolster, the whole of it, sitting on the cloth seat of a locked truck in an empty lot at the edge of the woods, forty years and six years of dead man's absence and it is *here*, and you never went deep enough to find anything, and it found you anyway.

**[if not `took_shard`]** A knife. Bone-handled, old, so like the one you lost as a child that the daylight seems to dim a little. On the seat of a locked truck. You did everything right. You turned around. You left.

Reese sees your face before he sees the knife. When he sees the knife he goes very still, and then he starts talking, fast, about how you must have set it there, must have had it, and you let him, because the two of you have to drive home and one of you has to be able to.

> DESIGN: The turn-back variant, and the crueler one — the *sane, safe, shallow* choice (leave) does not protect you; the thing reaches into the locked truck, into the ordinary world, into the drive home. The four replies from the deep card apply here too (accept the reading / speechless / hold the truth / no words), then queue `ux_return_end`.

---

## `ux_return_end` — the cut-off

The run ends here.

Not with an answer — with a knife you can hold, in a place it cannot be, and a friend beside you insisting on the one story that lets him keep driving. You will never be able to prove how it got here. And you will never, as long as you live, be able to argue away the certainty that something reached across your whole life to place a dead man's knife in your hand — that it meant to, that it knows you came anyway and didn't turn back. Certainty and proof were never the same thing. You walk out of that dark holding only the first, and it is the heaviest thing you will ever carry, and you carry it into whatever's left of your ordinary life, and you never once set it down.

> DESIGN: The flagship's terminal — an authored terminal flag, `run_end_whites_return`, not a lost-grip death; the loop's scene-exit rules hand the run to its ending. The four threads (Doug, Marie, Nora, Reese) are left live and unresolved — this is a *closer*, not a resolution. **Conviction-voice reframe applied (per Vigil's ruling):** the prose renders the player's *un-provable certainty* (you can't argue away the sense that something reached, that it knows) and never *narrator-fact about the entity* (it reached, it knows). This is the delicate case of percept-never-cause, and it makes the terminal the **last fork, not the first answer** — the materialist reader exits holding "I can't shake the certainty, and certainty isn't proof," the spiritual reader exits holding the same sentence meaning the opposite, and frame divergence survives the final line. The buried weight, sealed and author-facing only: a terrified power spent the most it could still afford to warn you off, and you came anyway. The player is told none of that. They get the vertigo of the knife, the silence after, and the question carried out into their own afternoon.

Exit flags set for the archive / next run's seeding: `run_end_whites_return`, plus whichever of `denied_knife` / `held_truth` the player chose (these color re-entry — denial makes the weird fight its way back; holding the truth means you come back to it more alone).

---

## Notes for the wire (Armature / Plumb)

- **New scene, not part of `cave-b3`.** Nothing here touches the frozen baseline. `took_shard`, `cave_done`, `etchings_link_nora` are read, not written.
- **Grip gates two inserts** (`ux_return_illegible` fires at `grip <= 3`; the deep-descent flavor forks on `grip <= 3`). Grip is a stat — legal to gate. No `diamondCoord` gate anywhere.
- **`attune` on the introspective options** is the small attuned/grounded *volition* lean (Vigil's option-3 ruling): a derived scalar recording which way the player *chose* to face the uncanny, distinct from grip's worn-down *position*. It is **never** a `diamondCoord`, never reaches the centroid or the draw — read only by the narrow-door ending-selector (when an authored ending asks) and telemetry. No stat effect; the prose works regardless of when the field lands.
- **Every branch queues a terminal**; no dead ends.
- **The linter should pass this clean** — echoes are prose, no `*…*` intent-notes in any `log`, all refs resolve.

— Loom
