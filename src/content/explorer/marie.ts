// ============================================================================
// content/explorer/marie.ts — the Marie thread's first episode (Loom's story
// pass, wired): the warning call → the offer → the woods → Ellen's name and
// the boy → the grave she won't visit → the trailhead.
//
// The down-axis thread: contain, bury, keep away. Marie is a HUB — she points
// the player at Dale (`pointed_to_dale`) and leaves Ellen's name for Nora's
// research to catch (`knows_ellen`). The empty grave itself is deferred to the
// grave beat (grave.ts); this episode closes on the feeling and the suspicion.
//
// The denial-brake, structural: dismissing her fear is kind, correct, and
// steadying (+grip) — and it closes the thread (recovery-via-denial). The
// offer to ease her mind is the rational, generous act that walks them both
// to the wound.
//
// Wiring shape: the warning is scheduled by the Explorer opening beat
// (opening.ts, +2 days); the woods outing is scheduled off the offer; the rest
// queue-chains. The sealed layer surfaces in NOTHING.
// ============================================================================

import type { GameEvent } from "../../engine/types";

export const marieEvents: Record<string, GameEvent> = {
  // -- the call ------------------------------------------------------------------
  ux_marie_warning: {
    id: "ux_marie_warning",
    once: "marie_warning_seen",
    condition: { kind: "flag", flag: "arrived_town" },
    title: "The Warning",
    body:
`Aunt Marie calls on a Tuesday evening, and you can tell in the first three words that she's worked herself up to it.

She asks how you're settling in. She asks if you've been getting out, seeing the area. And then, in the too-casual voice of someone approaching a thing sideways, she says: "You haven't been out to those caves, have you. Out past the reservoir. White's Hall."

You don't answer fast enough.

"I wish you wouldn't," she says. "I know how you are, I know it's your whole — I know. But bad things happen to people out there, honey. They always have. I don't like it and I can't tell you why and I wish you'd just stay away from that whole part of the woods."`,
    choices: [
      {
        label: `"Every place has a bad story, Marie. You go anywhere long enough, something bad happened there."`,
        outcome: {
          log: "It's true, and you say it kindly, and you can hear it land like a door closing on her side. She says you're probably right. She doesn't believe you're right, but she lets it go, and something in you settles at having said the sensible thing out loud.",
          tone: "g",
          stats: { grip: 1 },
          setFlags: { marie_dismissed: true, lead_marie_cooled: true },
        },
      },
      {
        label: `"What kind of bad things?"`,
        outcome: {
          log: "There's a silence on the line where she decides how much to say. 'People get lost,' she says finally. 'People get hurt. And there was — a long time ago, there was worse. I don't like to talk about it on the phone.'",
          tone: "n",
          setFlags: { marie_engaged: true },
          queueEvent: "ux_marie_offer",
        },
      },
      {
        label: `"…you sound really scared, Marie."`,
        attune: 0.25,
        outcome: {
          log: "'I am,' she says, simply, like it costs her nothing to admit and everything to feel. 'I've been scared of that place for forty years. I don't expect you to understand it.'",
          tone: "n",
          setFlags: { marie_engaged: true },
          queueEvent: "ux_marie_offer",
        },
      },
    ],
  },

  // -- you offer to go with her -----------------------------------------------------
  ux_marie_offer: {
    id: "ux_marie_offer",
    title: "The Offer",
    body:
`"Let me ask you something," you say. "Would it help if I went out there? With you. In the daylight. Just so you can see it's a — it's a hole in the ground and some trees. Nothing's out there, Marie. Let me show you."

The silence this time is longer.

"You'd do that," she says. Not quite a question. "You'd come with me."`,
    choices: [
      {
        label: `"Of course. This weekend. We'll walk out, you'll see it's nothing, and you'll sleep better."`,
        outcome: {
          log: "She agrees the way people agree to things they're afraid of — because someone kind is offering, and being alone with a fear is worse than facing it with company. You've just made a plan. It feels like a favor.",
          tone: "n",
          setFlags: { marie_woods_planned: true },
          scheduleEvent: { eventId: "ux_marie_woods", inDays: 2 },
        },
      },
      {
        label: `"…actually, if it scares you that much, maybe don't. Maybe just steer clear and we'll leave it."`,
        outcome: {
          log: "She's quiet, then grateful, then off the phone. You've done the gentle thing. The plan dissolves before it existed, and you'll wonder, later, with no way to know, whether that was the kindness it felt like.",
          tone: "n",
          setFlags: { marie_left_it: true },
        },
      },
    ],
  },

  // -- the walk ------------------------------------------------------------------------
  ux_marie_woods: {
    id: "ux_marie_woods",
    once: "marie_woods_done",
    title: "The Walk",
    body:
`You meet her at the trailhead on a grey Saturday. She's dressed like she's going to church, which is its own kind of sad, and she holds your arm on the uneven ground, and you walk the path toward the caves and she doesn't want to and she does it because you're there.

You keep it light. You point out a woodpecker. She almost smiles.

And then, at a bend where the trees close over and the reservoir goes out of sight, she stops, and looks at the ground, and tells you.

"There was a girl," she says. "When I was young. We used to sneak out here at night, a whole gang of us, meet up with the older kids. It was stupid. It was the most alive I ever felt." She's not looking at the woods; she's looking at a night forty years gone. "One night some of the boys said they'd seen something out here. In the trees. And we all laughed, but we came back, because that's what you do when you're that age, you go back to the thing that scared you."

"And one night a girl went off into the dark with one of the boys. And the boy came back."

She looks at you.

"And the girl didn't."`,
    choices: [
      {
        label: `"God. Marie. I'm sorry."`,
        outcome: {
          log: "You sit with it, and she lets you.",
          tone: "n",
          stats: { energy: -1 },
          setFlags: { marie_grief: true },
          queueEvent: "ux_marie_ellen",
        },
      },
      {
        label: `"…what did the boy say happened?"`,
        outcome: {
          stats: { energy: -1 },
          setFlags: { asked_boy: true },
          queueEvent: "ux_marie_ellen",
        },
      },
      {
        label: `"I think I might believe you."`,
        requires: { kind: "any", of: [{ kind: "flag", flag: "cave_done" }, { kind: "flag", flag: "doug_off" }, { kind: "flag", flag: "grave_suspicion" }] },
        attune: 0.25,
        outcome: {
          log: "You don't say what it is you believe, because you couldn't name it. She hears it anyway. Her hand tightens on your arm, and for the first time she looks less alone and more afraid, because now there are two of you.",
          tone: "n",
          stats: { energy: -1 },
          setFlags: { marie_believed: true },
          queueEvent: "ux_marie_ellen",
        },
      },
    ],
  },

  // -- the name, and the boy ---------------------------------------------------------------
  ux_marie_ellen: {
    id: "ux_marie_ellen",
    title: "The Name, and the Boy",
    body:
`"The boy said something took her." Marie says it flat, the way you say a thing you've turned over ten thousand times. "Said it came out of the trees and took her and there was nothing he could do. Nobody believed him. Half the town decided he did it himself — that he hurt her, and made up the rest. He grew up here. He's still here. People still cross the street."

"His name's Dale. And I'll tell you something nobody else will: I've talked to that man. He's a decent man. I don't know what happened out here, and I don't know if I believe every word, but I've sat across from Dale and I don't believe he hurt anybody." She shakes her head. "I don't know what I believe. I just know it wasn't nothing."`,
    choices: [
      {
        label: `"What was the girl's name?"`,
        outcome: {
          log: "'Ellen,' she says, and it comes out immediate, no reaching for it. 'Ellen Fields. I've carried that name forty years. You don't forget the ones that just — stop.'",
          tone: "n",
          setFlags: { knows_ellen: true },
          queueEvent: "ux_marie_grave",
        },
      },
      {
        label: `"Have you ever talked to him about what he saw?"`,
        outcome: {
          log: "'Once. A long time ago. He told me the same thing he told everyone, and he told it like a man telling the truth, and then he told me I should go and not come back for my own sake, that being seen with him doesn't do anybody any favors.' She almost smiles. 'Maybe you should talk to him yourself. If you're going to keep pulling at this. He'd tell you straighter than I can.'",
          tone: "n",
          setFlags: { pointed_to_dale: true },
          queueEvent: "ux_marie_grave",
        },
      },
      {
        label: `"Has anyone else ever gone missing out here? Has anyone — changed?"`,
        outcome: {
          log: "She looks at you sharply, like you've said something closer to the bone than you know. 'Why would you ask me that,' she says — not angry, almost hopeful, the question of someone who has waited a long time for anyone to ask it. 'Have you seen something? Has someone —' and you realize you don't have an answer, and the two of you stand there with the question open between you, and neither of you closes it.",
          tone: "n",
          setFlags: { asked_pattern: true, pattern_open: true },
          queueEvent: "ux_marie_grave",
        },
      },
    ],
  },

  // -- the grave she won't visit ---------------------------------------------------------------
  ux_marie_grave: {
    id: "ux_marie_grave",
    title: "The Grave She Won't Visit",
    body:
`You ask the thing you have to ask. "What happened to Ellen? Did they — was there a funeral? Where is she?"

Marie is quiet for a while. The woods drip.

"They buried her," she says. "Or they buried — there was a service. A little grave. She's out at the old cemetery, past the church, on the edge of these same woods." She wraps her coat tighter. "I've never been. In forty years I've never once gone to that grave, and I couldn't tell you why except that every time I think about standing in front of it I get a feeling like — like I shouldn't. Like there's nothing there to stand in front of." She catches herself. "That's an awful thing to say. She's a child in a grave and I'm too much of a coward to bring her flowers."`,
    choices: [
      {
        label: `"You don't think she's there."`,
        outcome: {
          log: "She looks at you like you've pulled a splinter she's had for forty years. 'I didn't say that,' she says. And then, quieter: 'No. God help me. I don't. I don't know what I think, but I've never once been able to make myself believe that little girl is in that box. Now you've got me saying it out loud and I feel sick.'",
          tone: "b",
          setFlags: { grave_suspicion: true },
          queueEvent: "ux_marie_close",
        },
      },
      {
        label: `"It's okay, Marie. Grief doesn't have to make sense."`,
        outcome: {
          log: "She takes the kindness and leans on it, and you walk her back to the trailhead, and she thanks you for coming, and she says she feels a little better for having someone know. She has not, you notice, said she'll ever come back out here.",
          tone: "n",
          setFlags: { marie_comforted: true },
          queueEvent: "ux_marie_close",
        },
      },
    ],
  },

  // -- the trailhead -------------------------------------------------------------------------------
  ux_marie_close: {
    id: "ux_marie_close",
    title: "The Trailhead",
    body:
`You walk her back. The truck's where she left it. She holds your arm the whole way and lets go at the treeline like crossing back out of somewhere.

"Thank you," she says. "I mean it. Whatever's out here — and I know how that sounds — you be careful with it. Don't go pulling on things just because you can." She looks at the woods one more time. "That's how it gets you. It doesn't chase. It waits for you to keep coming back."

Then she gets in her car and drives back toward town and her ordinary evening, and leaves you at the edge of the trees with a girl's name, a man to maybe go find, and a grave neither of you will look at.`,
    choices: [
      {
        label: `Head back toward town.`,
        outcome: { setFlags: { marie_episode_done: true } },
      },
    ],
  },
};
