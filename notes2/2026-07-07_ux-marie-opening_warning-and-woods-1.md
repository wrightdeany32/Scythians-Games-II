# Story Pass — Marie, the Opening: the Warning and the Woods
### loop content · the down-axis thread begins · prose-first, for Armature/Plumb to wire
*From: Loom (Explorer corner) · carried by Dean · 2026-07-07*

**What this is.** The Marie thread's first episode — a met-door warning, the denial-brake fork it hangs on, and the woods conversation where she tells the story of Ellen. Fires from the loop; doesn't touch the frozen cave. Opens the *down* axis (contain, bury, keep away) and sets Marie up as a **hub** — she points the player at Dale and leaves Ellen's name for Nora to catch later. The empty grave itself is **deferred** to a return beat; this episode closes on the *feeling* and the suspicion.

**Disciplines.** Percept, never cause. Gates are flags/stats/tiers, never position. Neutral-valence labels. And the sealed cosmology — that Ellen became Tricia, the reprogramming, the couple who made the leader — surfaces in **nothing**. The player meets a frightened woman, a taken child, and a grave she's afraid of. That's all that's here.

**The denial-brake, made structural.** Marie's warning is the grounded exit. Dismissing her fear — *every place has a bad story* — is the safe, shallow move, and it's *the denial talking*: it steadies the player (**+grip**) and cools the lead. Taking her seriously is what pulls toward the woods. And the offer to walk out there with her to *ease her mind* — the kind, rational thing — is the exact vehicle that carries them both to the wound. Reason is what walks you down, and it never feels like it.

---

## `ux_marie_warning` — the call

Fires as a **met-door**, +1–2 days after the Reese opening (`scheduleEvent`, gated on `arrived_town`). Marie is your aunt; she has your number and a reputation.

Aunt Marie calls on a Tuesday evening, and you can tell in the first three words that she's worked herself up to it.

She asks how you're settling in. She asks if you've been getting out, seeing the area. And then, in the too-casual voice of someone approaching a thing sideways, she says: "You haven't been out to those caves, have you. Out past the reservoir. White's Hall."

You don't answer fast enough.

"I wish you wouldn't," she says. "I know how you are, I know it's your whole — I know. But bad things happen to people out there, honey. They always have. I don't like it and I can't tell you why and I wish you'd just stay away from that whole part of the woods."

- **"Every place has a bad story, Marie. You go anywhere long enough, something bad happened there."** → **grip +1**; sets `marie_dismissed`, `lead_marie_cooled`. *(narration: "It's true, and you say it kindly, and you can hear it land like a door closing on her side. She says you're probably right. She doesn't believe you're right, but she lets it go, and something in you settles at having said the sensible thing out loud.")* → resolve.
- **"What kind of bad things?"** → sets `marie_engaged`. *(narration: "There's a silence on the line where she decides how much to say. 'People get lost,' she says finally. 'People get hurt. And there was — a long time ago, there was worse. I don't like to talk about it on the phone.'")* → queue `ux_marie_offer`.
- *(introspective)* **"…you sound really scared, Marie."** → sets `marie_engaged`, narration only, no stat, `diamondCoord` leans *attuned* (small). *(narration: "'I am,' she says, simply, like it costs her nothing to admit and everything to feel. 'I've been scared of that place for forty years. I don't expect you to understand it.'")* → queue `ux_marie_offer`.

> DESIGN: The dismiss option is the denial-brake in its purest form — kind, correct, and steadying, and it *closes the thread* (recovery-via-denial: grip back, lead gone). It's not a wrong choice; it's the choice that keeps you safe and shallow, and the narration lets the player feel the settling. The other two open the down-axis. `marie_dismissed` leaves Marie a warm contact who simply doesn't lead anywhere — she can still be called, she just won't raise it again unless the player does.

---

## `ux_marie_offer` — you offer to go with her

"Let me ask you something," you say. "Would it help if I went out there? With you. In the daylight. Just so you can see it's a — it's a hole in the ground and some trees. Nothing's out there, Marie. Let me show you."

The silence this time is longer.

"You'd do that," she says. Not quite a question. "You'd come with me."

- **"Of course. This weekend. We'll walk out, you'll see it's nothing, and you'll sleep better."** → sets `marie_woods_planned`; **schedules** `ux_marie_woods` for the next open day. *(narration: "She agrees the way people agree to things they're afraid of — because someone kind is offering, and being alone with a fear is worse than facing it with company. You've just made a plan. It feels like a favor.")*
- **"…actually, if it scares you that much, maybe don't. Maybe just steer clear and we'll leave it."** → sets `marie_left_it`. *(narration: "She's quiet, then grateful, then off the phone. You've done the gentle thing. The plan dissolves before it existed, and you'll wonder, later, with no way to know, whether that was the kindness it felt like.")* → resolve.

> DESIGN: The offer is the vehicle — the *rational, generous* act that walks them both to the wound. The alternative (talk her out of going) is also kind, and closes the thread more softly than the dismiss did. Both are decent. Only one goes to the woods, and it's the one that feels most like help.

---

## `ux_marie_woods` — the walk

Fires on the scheduled day. A partial scene; costs energy as a short outing.

You meet her at the trailhead on a grey Saturday. She's dressed like she's going to church, which is its own kind of sad, and she holds your arm on the uneven ground, and you walk the path toward the caves and she doesn't want to and she does it because you're there.

You keep it light. You point out a woodpecker. She almost smiles.

And then, at a bend where the trees close over and the reservoir goes out of sight, she stops, and looks at the ground, and tells you.

"There was a girl," she says. "When I was young. We used to sneak out here at night, a whole gang of us, meet up with the older kids. It was stupid. It was the most alive I ever felt." She's not looking at the woods; she's looking at a night forty years gone. "One night some of the boys said they'd seen something out here. In the trees. And we all laughed, but we came back, because that's what you do when you're that age, you go back to the thing that scared you."

"And one night a girl went off into the dark with one of the boys. And the boy came back."

She looks at you.

"And the girl didn't."

- **"God. Marie. I'm sorry."** → sets `marie_grief`. *(sits with it.)* → queue `ux_marie_ellen`.
- **"…what did the boy say happened?"** → sets `asked_boy`. → queue `ux_marie_ellen`.
- *(introspective — requires `cave_done OR doug_off OR grave_suspicion`)* **"I think I might believe you."** → sets `marie_believed`, narration only, no stat, `diamondCoord` leans *attuned* (small). *(narration: "You don't say what it is you believe, because you couldn't name it. She hears it anyway. Her hand tightens on your arm, and for the first time she looks less alone and more afraid, because now there are two of you.")* → queue `ux_marie_ellen`.

---

## `ux_marie_ellen` — the name, and the boy

"The boy said something took her." Marie says it flat, the way you say a thing you've turned over ten thousand times. "Said it came out of the trees and took her and there was nothing he could do. Nobody believed him. Half the town decided he did it himself — that he hurt her, and made up the rest. He grew up here. He's still here. People still cross the street."

"His name's Dale. And I'll tell you something nobody else will: I've talked to that man. He's a decent man. I don't know what happened out here, and I don't know if I believe every word, but I've sat across from Dale and I don't believe he hurt anybody." She shakes her head. "I don't know what I believe. I just know it wasn't nothing."

- **"What was the girl's name?"** → sets `knows_ellen`. *(narration: "'Ellen,' she says, and it comes out immediate, no reaching for it. 'Ellen Fields. I've carried that name forty years. You don't forget the ones that just — stop.'")* → queue `ux_marie_grave`.
- **"Have you ever talked to him about what he saw?"** → *(narration: "'Once. A long time ago. He told me the same thing he told everyone, and he told it like a man telling the truth, and then he told me I should go and not come back for my own sake, that being seen with him doesn't do anybody any favors.' She almost smiles. 'Maybe you should talk to him yourself. If you're going to keep pulling at this. He'd tell you straighter than I can.'")* → sets `pointed_to_dale`; → queue `ux_marie_grave`.
- **"Has anyone else ever gone missing out here? Has anyone — changed?"** → sets `asked_pattern`. *(narration: "She looks at you sharply, like you've said something closer to the bone than you know. 'Why would you ask me that,' she says — not angry, almost hopeful, the question of someone who has waited a long time for anyone to ask it. 'Have you seen something? Has someone —' and you realize you don't have an answer, and the two of you stand there with the question open between you, and neither of you closes it.")* → sets `pattern_open`; → queue `ux_marie_grave`.

> DESIGN: Dale is spoken-of here, never met — the town's judgment lands before the player forms their own, and Marie's "he's a decent man / go talk to him yourself" is the seed of the Dale beat (his kindness will subvert the town's read later). Ellen's name is surfaced *by Marie* (she remembers because it stuck), and it's the thread Nora's research will independently catch — the two frames reaching toward each other through the player. `asked_pattern` is the unfalsifiable seam: the player asks about change/disappearance, has no answer, and the question stays open — Marie's folk-avoidant frame brushing the cult's density without either of them knowing.

---

## `ux_marie_grave` — the grave she won't visit

You ask the thing you have to ask. "What happened to Ellen? Did they — was there a funeral? Where is she?"

Marie is quiet for a while. The woods drip.

"They buried her," she says. "Or they buried — there was a service. A little grave. She's out at the old cemetery, past the church, on the edge of these same woods." She wraps her coat tighter. "I've never been. In forty years I've never once gone to that grave, and I couldn't tell you why except that every time I think about standing in front of it I get a feeling like — like I shouldn't. Like there's nothing there to stand in front of." She catches herself. "That's an awful thing to say. She's a child in a grave and I'm too much of a coward to bring her flowers."

- **"You don't think she's there."** *(you say what she can't)* → sets `grave_suspicion`. *(narration: "She looks at you like you've pulled a splinter she's had for forty years. 'I didn't say that,' she says. And then, quieter: 'No. God help me. I don't. I don't know what I think, but I've never once been able to make myself believe that little girl is in that box. Now you've got me saying it out loud and I feel sick.'")* → queue `ux_marie_close`.
- **"It's okay, Marie. Grief doesn't have to make sense."** *(you let her off it)* → sets `marie_comforted`. *(narration: "She takes the kindness and leans on it, and you walk her back to the trailhead, and she thanks you for coming, and she says she feels a little better for having someone know. She has not, you notice, said she'll ever come back out here.")* → queue `ux_marie_close`.

> DESIGN: The grave is where percept-not-cause matters most, so this episode only lets Marie *suspect* — her lens, unconfirmed. The actual opened vault is a return beat, written later, and when it lands it's percept-only (the space where a small coffin should be, never a word of what it means). `grave_suspicion` is the flag that later beat reads. Closing on the suspicion, not the reveal, keeps the biggest image for last.

---

## `ux_marie_close` — the trailhead

You walk her back. The truck's where she left it. She holds your arm the whole way and lets go at the treeline like crossing back out of somewhere.

"Thank you," she says. "I mean it. Whatever's out here — and I know how that sounds — you be careful with it. Don't go pulling on things just because you can." She looks at the woods one more time. "That's how it gets you. It doesn't chase. It waits for you to keep coming back."

Then she gets in her car and drives back toward town and her ordinary evening, and leaves you at the edge of the trees with a girl's name, a man to maybe go find, and a grave neither of you will look at.

> DESIGN: Marie closes as a hub, not a resolution — she hands off to Dale (`pointed_to_dale`) and leaves Ellen Fields (`knows_ellen`) for Nora's research to catch, and her parting line is the game's thesis in her own folk register: *it waits for you to keep coming back*, which is the return trip's whole logic spoken by someone who has no idea she's describing it. No terminal — control returns to the loop. The threads left live: Dale, the grave, the pattern, Ellen's name.

Exit flags: `marie_episode_done`, plus whichever of `grave_suspicion` / `pointed_to_dale` / `knows_ellen` / `pattern_open` the player earned.

---

## Notes for the wire (Armature / Plumb)

- **Loop-native, frozen-cave-safe.** Met-door (`scheduleEvent`, gated `arrived_town`) → a scheduled outing → a queue-chained conversation. Reads `arrived_town`, `cave_done`, `doug_off`, `grave_suspicion`; writes `marie_*`, `knows_ellen`, `grave_suspicion`, `pointed_to_dale`, `pattern_open`.
- **The denial-brake is a real grip lever** — `ux_marie_warning`'s dismiss option grants **grip +1** and sets `lead_marie_cooled`. Grip is a stat; legal. This is recovery-via-denial's first showcase.
- **No position gates anywhere.** The three introspective/attuned options carry small `diamondCoord`s only (needs the branch-level field, same as the others).
- **Every branch resolves or queues; no dead ends.** Dismiss and comfort paths close cleanly to the loop; the engaged path chains through to `ux_marie_close`.
- **Linter-clean** — echoes are prose; no `*…*` in any `log`; all refs resolve within this pass.

— Loom
