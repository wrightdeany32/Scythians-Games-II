# Story Pass — Doug, the Break: the Marked Man Comes Apart
### loop content · the up-axis thread climax · prose-first, for Armature/Plumb to wire
*From: Loom (Explorer corner) · carried by Dean · 2026-07-07*

**What this is.** The Doug thread's climax and emotional payoff — the beat where the warm recruiting face breaks open and you see the trapped, tired, marked man underneath. It bends three ways on how the player left the meeting (`doug_meeting_embraced` / `doug_meeting_refused` / `doug_meeting_open`), and it ends on Doug's fate: **embrace** him and he lingers as a dark fellow-traveler; **refuse** — try to pull him free — and he's reclaimed, because the thing that marked him doesn't let the marked go. Either way, tragedy; either way, no clean save. This is the anti-noun of *agency*: the player cannot rescue Doug, and the game never lets them believe they could have.

**The two hard disciplines this beat must hold.**

1. **Doug reveals his *experience*, never the cosmology.** He's a marked survivor, not the leader — he doesn't *know* the buried truth (the couple, the depleted leader, the institutional origin, the density-as-steering), so he can't reveal it. What he can give is his own account: he was reached-for as a young man, something touched him and didn't finish, and he's been inside the "family" ever since, and it is both the only thing that held him up and the cage he can't leave. The sealed cosmology surfaces in **nothing** — Doug gestures at his wound, not the machine behind it.

2. **Doug's account stays unfalsifiable.** *Reached-for. Something touched me.* It's sincere, it's felt, and the game never confirms whether it's literal — it could be a supernatural mark, it could be the story a traumatized man built around whatever actually happened to him at twenty. Percept, never cause, at the level of a human being's own history. The player believes Doug or doesn't; the game stays silent.

**Upstream:** fires after `doug_meeting_done`, scheduled a while later (`scheduleEvent`) so the thread breathes. The lean flag routes the middle of the scene.

---

## `ux_doug_break` — the call at the wrong hour

The phone goes at 2 a.m., and it's Doug, and Doug has never once called you at 2 a.m.

His voice is wrong. Not drunk — *scraped.* "Hey. Hey, I'm sorry, I know what time it is." A breath that isn't steady. "I can't — I need to see you. Tonight. I know that's crazy. I wouldn't ask." Another breath. "I can't do this anymore, and you're the only person I can say that to."

- **"Where are you? I'm coming."** → sets `doug_break_answered`; queue `ux_doug_break_meet`.
- **"Doug, it's 2 a.m. Are you safe right now? Talk to me first."** → sets `doug_break_answered`, `doug_break_grounded`. *(narration: "'I'm safe,' he says, and almost laughs, and it's an awful sound. 'That's the whole problem. I'm real safe. Just come.' He gives you a place. You go.")* → queue `ux_doug_break_meet`.

---

## `ux_doug_break_meet` — what's under the warmth

He's in his truck in an empty lot by the reservoir, the same water you've run past with him a hundred mornings, and when you get in he looks a decade older than he did at the meeting. He can't quite hold your eye.

"I'm going to tell you something," he says, "and you're going to think I've lost my mind, and maybe I have. But I'm tired. I'm so tired of being the one who's fine."

And it comes out of him in pieces, the way a thing comes out when it's been held thirty years:

"When I was young — younger than you — something happened to me out here. In these woods. I don't have words that don't sound insane. Something *reached* for me. Something touched me and didn't — didn't finish. And I've never been right since, and I've never been alone since either, because the people who found me after, the *family*, they understood. They were the only ones who understood. They took me in and they held me up and they gave me a reason and they have *never once let me fall.*" His jaw works. "And they will never, ever let me go. And I didn't understand that those were the same sentence until it was thirty years too late."

He finally looks at you.

"I brought you toward them. God help me, I did that, because I love you and I couldn't stand the thought of you out here alone with — with whatever this is. And now I'm sitting here at two in the morning trying to figure out if I was saving you or feeding you to it, and I *can't tell*, and that's what I can't do anymore."

> DESIGN: This is the whole tragedy in one seat — the marked man, the family as rescue-and-cage in the same breath, and the thing that makes Doug tragic instead of villainous: he genuinely cannot tell whether reaching for the player was love or predation, because *for him there was never a difference.* Everything he says is his account, unconfirmed — *something reached, something touched* — and the game never adjudicates it. The cosmology stays sealed; Doug knows only his own wound. The branch below routes on the meeting lean.

---

## The plea and the fork — routes on lean

### `ux_doug_break_embrace_route` — [if `doug_meeting_embraced`]

Because you leaned toward him at the meeting, Doug's plea is not a warning. It's a hand held out.

"You felt it too. At the meeting. I saw it — you felt the thing that holds those people together, and part of you wanted in, and I'm not going to pretend I didn't want that for you. Because here's the truth nobody says: it's *better* inside. Whatever's out there in those woods, whatever reached for me — inside, you're not alone with it. We survive it *together.* That's the only way anyone survives it at all." He grips your arm. "Come with me. All the way in. Don't do what I did and spend thirty years half-out and terrified. Be all the way in, with me, and we'll be okay."

- **"Okay, Doug. All the way in. Together."** *(you take his hand; you step onto his road)* → sets `doug_embraced`, advances hard to the enable-pole. → queue `ux_doug_break_linger`.
- **"I felt it, Doug. And it scared me. I can't follow you in — and I don't think being in is surviving. I think it's the cage telling you it's a home."** *(you refuse the hand)* → sets `doug_refused`, advances to the contain-pole. → queue `ux_doug_break_reclaimed`.

### `ux_doug_break_refuse_route` — [if `doug_meeting_refused`]

Because you pulled back at the meeting, Doug's plea is a warning he's giving against his own interest.

"You saw it for what it is. At the meeting — you saw, and you got out, and I was almost *angry* at you for it, and I've spent every day since wishing I'd had your — whatever it is. Your spine." He shakes his head. "Don't come back toward this. Don't let me pull you in, no matter how gentle I make it sound, no matter how much I dress it up as family. Get *out.* Be the one who got out." His voice cracks. "And — God, I shouldn't even ask this — but is there a way out for me? Is there? Because I don't think there is, and I need someone who isn't lying to me to tell me the truth."

- **"There's a way out, Doug. We'll find it. I'm not leaving you in this. Let me help you."** *(you refuse to abandon him)* → sets `doug_refused`, `tried_to_save_doug`, advances to the contain-pole. → queue `ux_doug_break_reclaimed`.
- **"…I don't know, Doug. I don't think I can pull you out. But I'm here, and I'm not going to lie to you, and I'm not going in after you."** *(you tell him the truth and hold the line)* → sets `doug_held_line`, advances to the contain-pole. → queue `ux_doug_break_reclaimed`.

### `ux_doug_break_open_route` — [if `doug_meeting_open`]

Because you gave nothing away at the meeting, Doug doesn't know which way you'll fall, and neither do you, and he lays both roads in front of you because he's too tired to choose for you.

"I don't know what you want. You played it so close at the meeting I couldn't read you, and honestly it's the first time in years anyone's surprised me." A long breath. "So I'll just say it plain, both halves. There's a way in — with me, into the family, and it's warm and it's real and you'd never be alone with this again. And there's a way out — the door you're still standing in, that I gave up thirty years ago. I can't tell you which one saves you. I've been wrong about that my whole life. But I'm done deciding it *for* people. So you decide."

- **"In. With you. I don't want to be alone with this either."** → sets `doug_embraced`, advances to the enable-pole. → queue `ux_doug_break_linger`.
- **"Out. And I want you to come out with me, Doug, if there's any way at all."** → sets `doug_refused`, `tried_to_save_doug`, advances to the contain-pole. → queue `ux_doug_break_reclaimed`.

> DESIGN: The three routes converge on two fates, but the *plea* is different in each — held-out hand (embrace-lean), warning-against-self (refuse-lean), both-roads-laid-down (open) — so the meeting choice pays off as the shape of Doug's final appeal, not just a flag check. And the fork's meaning is stable across routes: embrace → linger; refuse (in any form, including trying to save him) → reclaimed. Note the cruelty built into the anti-noun of agency: `tried_to_save_doug` routes to the *same* reclamation as a flat refusal — trying to pull him free doesn't save him, and the game won't let the player believe it might have.

---

## `ux_doug_break_linger` — [embrace] he stays, and it costs you

He exhales like a man setting down something he's carried for thirty years. "Okay," he says. "Okay. Together." And he holds onto you in the dark truck and for a moment it's just Doug, your Doug, not alone anymore.

And in the weeks after, Doug is *there* — steady, warm, present, the same fifty-something who's had your back since you were nineteen. Nothing overtly changes. He still picks you up at six. And you can't name the day you noticed that you'd started moving a little more like the room at the meeting moved, that the two of you finish each other's sentences now, that something in you has gone quiet and easy and certain in a way it never was before. You have a fellow-traveler. You are no longer entirely alone with this.

You'll never be sure what that cost, or that it was a cost at all. That's the part you can't get back — not the changing, but the not-knowing whether you changed.

> DESIGN: Embrace keeps Doug near and pays the price on the player, percept-only — the player *moves like the meeting-room* now, and whether that's belonging or capture is exactly the thing they can't resolve. No stat hammer, no "you are now controlled" flag; the horror is the un-knowing. Advances the enable-pole hard (it feeds the disposition centroid at run's end). Doug survives, present and dark, into whatever comes. Returns to the loop.

## `ux_doug_break_reclaimed` — [refuse] you let him go, or try to save him, and lose him either way

**[if `tried_to_save_doug`]** "You'd try," he says, and something in his face breaks open — not hope, worse than hope, *gratitude*, that someone would try. "You'd actually try." He grips your hand. "Okay. Okay. Let me — let me get some things. Give me a few days. Don't call me, I'll call you." And he drops you home in the grey almost-morning, and he's lighter than you've seen him, because someone said *I won't leave you in this* and meant it.

You never hear from him again.

**[if `doug_held_line` or flat `doug_refused`]** He nods, slow, at the truth of it. "Yeah," he says. "Yeah. I didn't think so either. I just needed to hear it from someone who wasn't selling me something." He drops you home in the grey almost-morning, quiet, done. "Take care of yourself. Be the one who got out."

That's the last real conversation you have with Doug.

**[both continue:]** Because within the week Doug is *gone* — not dramatically, not a scene, just a house with the mail piling up and a phone that rings out and family who say, vaguely, untroubled, that he decided to go stay with people out of state, that it's good he's got the family looking after him, that he always seemed a little lost and it's nice he found his place. Everyone is very calm about it. Everyone has a reasonable thing to say. And you stand in it with the cold certain grief of a man who reached for the door — who was *reaching for it beside you* — and got pulled back through instead, and you will never be able to prove that's what happened, and you will never for one second believe it wasn't.

> DESIGN: The reclamation, held strictly percept-only — Doug *vanishes*, and every surface explanation is mundane and calm and available (he went to stay with people; he was always a little lost), and the player's certainty that he was taken is inference the game never confirms. The trying-to-save variant is the crueler one and it's the point: *I won't leave you in this* is exactly what dooms him, and the gratitude on his face is the knife. Advances the contain-pole. No terminal — the loss returns the player to the loop carrying it. The marked don't get released; the game just never says so out loud.

Exit flags: `doug_break_done`, whichever of `doug_embraced` / `doug_refused`, `doug_lingering` **or** `doug_gone`, and `tried_to_save_doug` if set (colors the grief).

---

## Notes for the wire (Armature / Plumb)

- **Loop-native, frozen-cave-safe.** Scheduled crisis (`scheduleEvent` after `doug_meeting_done`) → queue-chained scene that branches on the meeting lean. Reads `doug_meeting_embraced` / `_refused` / `_open`; writes `doug_break_*`, the enable/contain advance, the fate flags. Touches nothing in `cave-b3`.
- **Three routes, two fates** — the lean flag selects the plea route (`_embrace_route` / `_refuse_route` / `_open_route`); the player's fork within it sets `doug_embraced` → `ux_doug_break_linger` or `doug_refused` → `ux_doug_break_reclaimed`. `tried_to_save_doug` routes to reclamation like any refusal (by design) and only changes the reclamation's *narration*.
- **The disposition advances are the enable/contain poles** — these are the biggest single moves the Doug thread makes on the diamond, and they land at the emotional climax, which is correct. They feed the run-end centroid; they are **not** read by any gate here. No position gate anywhere in this scene.
- **No grip cost on the player in the linger path** — the "you move like the meeting-room now" change is *narrated*, not a grip hit, exactly as Nora's fraying was hers and not the player's. The horror is the un-knowing, and a stat number would collapse it into a fact.
- **Both fates continue to the loop; no dead ends; no terminal** — Doug's break is a thread climax, not the run's end (that's the return trip). `doug_lingering` and `doug_gone` both color the rest of the run.
- **Linter-clean** — echoes are prose; no `*…*` in any `log`; all refs resolve within this pass.

— Loom
