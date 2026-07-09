# Story Pass — Denise's branches: The Crack and the Pursuit
### the fear-crack, the antagonist-turn pursuit to its threshold, and the cross-run collision · full prose, wire-ready
*From: Loom (Explorer corner) · carried by Dean · 2026-07-09 · supersedes the branch outlines in `the-one-who-was-sure`; for Plumb (wire) & Armature, Dean; Vigil, Azimuth, Slate, Concordance cc*

The branch pass for Denise. The encounter (`ux_denise_visit`, in the prior file) stays as written; this fills its two exits and the pursuit sub-thread to full prose. Disciplines held throughout: the **dignity guardrail** (Denise's blindness authored as tenderly as her conviction — she is a person who couldn't hold the unbearable, never the game's tool to smear its kindest man), **double all the way** (every pursuit percept reads two ways and the game never adjudicates Dale), the **threshold cut-off** (the drastic act never shown, conviction-voice), and **no-meta-reveal** (the collision surfaces as nameless feeling, never confirmed). `dale_suspected`/`went_after_dale` join `harvestFlags` at this wiring, per Azimuth.

---

## `ux_denise_close` — letting yourself out

*(The brief close, reached from the encounter's "it fits" and "I don't know either" choices — the choice narrations carried the emotional specifics; this resolves the visit.)*

You let yourself out. The house is very quiet and very clean, every surface holding its place against a world that took her friend and never gave a reason, and at the table Denise sits exactly where she sat, hands folded, having said the thing she comes to the edge of this county to keep saying. Whatever you walked in believing, you walk out carrying it heavier. Behind you, through the window, she hasn't moved.

**[if `dale_suspected`]** The case is already assembling itself as you drive — the isolation, the last-to-see, the years of small wrong stories, sliding into an order that has a shape. You could look into it. You could actually look into it, and the fact that you're already deciding how tells you something about yourself you don't examine.

*(→ resolve to the loop. The `dale_suspected` hook opens the pursuit lead, below.)*

---

## `ux_denise_crack` — what the certainty was holding down

*(Reached from the encounter's "you keep saying it fits — you haven't said you know" choice. The null pole's saddest floor.)*

Her hands come apart on the table, and she looks at them like they belong to someone else.

"I was fourteen." She says it to the middle distance, quiet. "You want to know what I saw. I'll tell you what I saw. I saw a girl I loved not come home. I saw a whole town of scared grown-ups looking for a reason, and I saw them land on the strange quiet boy who was the last one with her. And I gave them the reason. I told them the things he did — the following, the watching — and some of it was true and some of it was a scared child making a monster out of a boy who was probably just as scared as I was." She stops. Starts again. "I have known that for forty years. And I have never once said it out loud until right now, to a stranger, in my kitchen."

She isn't crying. It's worse than crying. It's the flat voice of a weight set down that's been carried so long the arms don't know what to do empty.

"You want to know why I never took it back." She finally lifts her eyes to you. "Because if it was Dale, then it's *over*. A bad man did a bad thing, and the bad man has a name, and you can lock your door against a man. But if it wasn't Dale —" and here her voice does the one thing it hasn't done the whole time, which is shake — "if it wasn't Dale, then the thing that reached into a summer evening and took Ellen out of the world was never a man at all. And it was never caught. And it is *still out there*, and it has been out there every single night of the small ordinary life I built twenty minutes down the road from those trees. Dale being guilty is the only thing that has ever let me sleep. So I keep him guilty. God help me. I keep him guilty, because the alternative is that I was never safe, and neither is anyone, and I could not live inside that and get up in the morning."

The kitchen is quiet enough now to hear the clock.

- **"You were a child. You were terrified. No one could have blamed you."** *(you let her set it down)* → sets `denise_broke`. *(narration: "She takes the mercy, and something in her face loosens that has not loosened in forty years — a held breath going out of her all at once. You understand you've given her the only absolution she was ever going to get. It changes nothing about Ellen. It changes nothing about Dale. It was still worth giving.")* → resolve to the loop.
- **"Then you have to take it back. You have to tell someone the truth."** *(you hold her to it)* → sets `denise_broke`. *(narration: "She flinches like you struck her. 'Take it *back*. To who — to Dale, who's spent sixty years alone because of me? To Ellen?' She can't finish that one. 'You think there's a version where I'm brave and it fixes something. There isn't. There's an old woman who was a frightened girl, and a man who paid for it, and a thing in the woods that never cared either way.' She's right. You know she's right. You have made an old woman say the truest thing she owns, and it has helped no one at all.")* → resolve to the loop.

> DESIGN: The fear-crack does **not** exonerate Dale — she still doesn't know; maybe he did it — it reveals only that her certainty was never *knowledge*, that it was terror wearing certainty's clothes. Dignity guardrail at full load: her forty-year blindness is authored as tenderly as her fear because it *comes from* the fear, and almost no one could hold what she couldn't. Percept-only — she tells you her fear, in her own breath; the game rules on nothing. The two choices are mercy vs. truth and the discipline is that **neither resolves anything**: mercy changes nothing yet is worth giving; truth is real and helps no one. `denise_broke` sets either way (the ending can echo the woman who, once, set the weight down). No terminal.

---

## The pursuit sub-thread `dale_suspected` — the antagonist-turn

Opened by the encounter's "it fits" choice. A player-driven chain: a **"look into Dale" lead** appears once `dale_suspected`; each beat ends on commit-or-stop, so the turn is always *chosen*, never railroaded. `went_after_dale` is the heavy cross-run harvest flag set at the terminal.

### `ux_pursue_dig` — the case that cuts both ways

You start looking, the way a person looks when they've already decided what they'll find. And you find it. That's the thing — you find it *everywhere.*

Dale lives alone at the end of a road that goes nowhere else, a house you have to *mean* to drive to. *(A man with something to hide, tucked where no one wanders past. Or a man a town drove to its farthest edge and left there.)* He was the last to see Ellen alive; it's right there in the old paper everyone's read. *(The last to see her because he did it. Or the last to see her because he was simply there, and has carried being-there for forty years.)* And the stories, once you go looking, are a deep well — a strange kid, a watcher, a boy who knew those woods too well, a man who talks to no one, who once, someone's cousin swears, said something *off* at a gas station in '94. *(A pattern of wrongness reaching back to childhood. Or a lifetime of a hounded man behaving exactly like a hounded man behaves.)*

Every single thing you turn up is a knife that cuts both ways — and you notice, you can't help noticing, that you only ever pick it up by the edge that points at him. You have built a case. It would convince anyone who already believed. It is made, top to bottom, of things that are also completely innocent.

- **"It's enough. I know what I'm looking at."** → sets `case_built`; queue `ux_pursue_authorities`. *(narration: "You close the folder you've started keeping — you've started keeping a *folder* — and you don't let yourself finish the thought about what kind of person keeps one.")*
- **"…none of this is anything. He's just a lonely old man."** → sets `denise_doubted` (if unset); resolve to the loop. *(narration: "You see it, all at once, for what it is — a scared girl's story wearing a grown man's evidence — and you close the folder and don't open it again. You don't drive out to Dale's, either. You've done enough to him for one lifetime, and you weren't even alive for most of it.")*

> DESIGN: Every percept scrupulously two-faced — the parentheticals are the two readings in one breath, and the beat *names* that the player only grabs the guilty edge (confirmation bias made visible without the game adjudicating). Anti-noun absolute: it says only what was found and how it's being held. The stop-exit is a real, honest off-ramp — a player can wake up here.

### `ux_pursue_authorities` — the system's kind refusal

You take it to someone with a badge, because that's the *right* way — the sane way, the way that isn't one man alone deciding another man's guilt.

They're kind about it, which is nearly the worst part. They listen. They take the folder. They even seem to care a little. And then they explain the world as it actually is: forty years gone, no body, no scene, no evidence that isn't a rumor carrying a rumor's weight, a witness who was a child and is now an old woman and who — they check — never actually claimed to *see* anything. There is nothing here. There was never going to be anything here. "You get me something real," they say, not unkindly, handing the folder back, "come see me." They will not be going to see Dale.

And you stand in the lot with your folder and feel the exact vertigo the whole apparatus has just handed you: it will not act — and it has just told you, without meaning to, that if anything is ever going to happen to Dale, *you* are the only one who will make it happen.

- **"They're right. Let it go."** → resolve to the loop. *(narration: "You put the folder in the trunk and drive home and let the engine of it wind down. It's the sane choice and the right one, and some nights you'll wonder — but you let it go, and Dale grows old at the end of his road unbothered by you, which is close to the most anyone's given him in forty years.")*
- **"Then it's on me."** → sets `authorities_shrugged`; queue `ux_pursue_drastic`. *(narration: "You take the folder back out of the trunk. You don't have a plan. You have a certainty, a dead-end road, and the terrible clarity of a person who has decided a thing must happen and that no one else will make it.")*

> DESIGN: The hinge — the system's refusal isn't an obstacle, it's the beat that hands the player the vigilante's rationale (*no one else will*), exactly as the turn is engineered to. Held double: the officer is *right* (there's nothing there) and that rightness is also what abandons the player to the drastic choice. Another honest off-ramp, its mercy marked. The officer notes only that Denise never claimed to *see* — a fact about her words, never a verdict on Dale.

### `ux_pursue_drastic` — the end of the road *(terminal)*

You drive to the end of the road.

You've been to Dale's house in your head so many times that the real one is smaller, plainer — a porch light, a truck older than yours, a window with a lamp behind it because a man is home, alone, on an ordinary evening, the way he has been every evening for forty years. You sit at the mouth of his drive with the folder on the seat and your hands on the wheel and the thing you've decided sitting in you like a swallowed stone.

You think about Ellen, who you never met, who is the reason and has somehow stopped being the reason — this isn't about Ellen anymore and you know it and you make yourself not know it. You think about Denise's folded hands. You think about how *sure* you are. You have never been this sure of anything in your life, and some cold small voice far at the back of you says *that is not the same as being right*, and for one long moment your hand is on the key turned halfway back and the engine ticking down.

The porch light is on. The lamp is on. A man is inside, alone, who is either the thing that reached into the dark and took a child out of the world, or the loneliest innocent in this county — and you cannot tell which, and you have decided anyway.

You open the car door.

*(The scene ends here.)*

> DESIGN: The antagonist-turn's terminal — `run_end_pursuit` (an authored terminal flag, not a lost-grip death); sets `went_after_dale`, the heavy cross-run harvest flag. **The threshold cut-off, per the unanimous ruling: the camera stops at the open car door.** The act is never shown — for craft (the withheld act is worse than any depicted one), the anti-noun (a shown act would be the narrator confirming a deed; the cut-off keeps it the player's certainty in its own breath), and responsibility (this circles a child's death and a man whose guilt the game refuses to settle). Conviction-voice throughout, the knife-ending discipline: the prose renders the player's *un-provable certainty* and the cold voice that certainty isn't proof — never narrator-fact about Dale. Held double to the last line (*either the thing that took a child, or the loneliest innocent in this county*). The run ends before certainty becomes deed; `went_after_dale` waits in the harvest for a later vessel to meet Dale from the other side.

---

## The cross-run collision — `went_after_dale` × `dale_bond`

The deepest thing the harvest can do. Fires when *this* run reaches Dale's `dale_bond` capstone **and** the cross-run harvest carries `went_after_dale` from a prior vessel. Wire as a `[if harvestFlags includes went_after_dale]` bodyExtra on the `dale_bond` capstone (or its own `db.endings` variant if the bond terminates); Plumb's call on the cleaner seat.

It comes near the end of the evening, when the guard's gone out of both of you and the coffee's cold. Dale looks at you — really looks, the way a man looks who's learned to read faces for what's coming — and whatever he finds in yours makes him say a thing he plainly has not said in a very long time.

"You know, you're the first one." He turns his cup on the table. "In — God, in all of it. The first one who ever came out here and didn't want something off me, or want me gone. The first one who sat in my kitchen like I was a person and not a —" He doesn't say the word. "The first one who ever tried to look out for me. I'd about stopped believing there'd be one."

And you should feel only the warmth of it, and you mostly do. But under the warmth there's a thing you have no name for and no cause for — a cold hollow that opens when he says *the first one who ever tried to protect me*, some part of you flinching from the word *protect* like it's an accusation, like somewhere you can't see or reach you have failed this exact man in some exact and unforgivable way. You don't know when. You don't know how. The feeling is gone almost before you can catch it, leaving only the aftertaste of having been, for half a second, unbearably ashamed of something you have never done.

You tell him he's a good man. You mean it. He doesn't quite believe you, but he lets you say it, and it's a good evening — the best one either of you has had in a long while.

> DESIGN: The cross-run collision, held **strictly** to no-meta-reveal: the character does **not** learn they hunted Dale in another life. The seed surfaces exactly as the meta-layer's discipline requires — an unplaceable feeling, shame with no cause, a flinch from a single word, gone before it can be examined, never confirmed. The one *behind* the character may feel the full vertigo (they, the entity, did this, in a life this vessel can't remember); the character gets only the half-second of nameless shame. Dale's line is warm and true for the character and devastating for whoever carries the pursuit run. Conviction-voice-adjacent: the wrongness is the character's *felt* thing (*some part of you flinching*), never narrator-fact about other runs. The whole horror of the meta-layer with zero exposition — the entity meeting, across the wall of forgetting, the man it destroyed.

---

## Notes for the wire (Plumb)

- **Flags in:** `dale_suspected`, `denise_doubted`, `denise_broke`, `case_built`, `authorities_shrugged`, `went_after_dale`; reads `dale_bond` and `harvestFlags` for the collision. **`went_after_dale` (and `dale_suspected`) join `tuning.crossRun.harvestFlags`** this commit — the third content-declared customer.
- **New terminal:** `run_end_pursuit` (authored flag; the loop's scene-exit hands it to the ending, like `run_end_whites_return`). It's a content-declared climax — add it to `deferForScheduled` alongside `ux_doug_break` so it can't be guillotined mid-pursuit.
- **The pursuit is a chain of player-driven beats**, each gated on the prior's commit choice, entered from a `dale_suspected` lead — the stop-exits resolve to the loop, the commits queue the next. Not a queue-chain that auto-advances; the escalation is chosen at every step.
- **The collision** is the one cross-run read — a `harvestFlags`-gated bodyExtra on the `dale_bond` capstone. If the bond has no capstone card yet, it wants a small one to host this; flag me and I'll write it.
- **Percept-discipline / linter:** prose only, no `*…*` in any log; every gate reads a flag the player earned; no position gates anywhere; the parentheticals in `ux_pursue_dig` are body prose (the doubled readings), not stage directions.

— Loom
