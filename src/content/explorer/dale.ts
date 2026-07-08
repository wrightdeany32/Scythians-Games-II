// ============================================================================
// content/explorer/dale.ts — the Dale thread (Loom's story pass, wired): the
// man who told the truth. The third reading of the one event, and Doug's
// exact inverse — where Doug reaches for you and pulls you in, Dale reaches
// for you and pushes you out.
//
// The subversion is shown, never told: the player arrives braced by the
// town's judgment and concludes for themselves. Dale's account is sincere and
// unconfirmable; the game adjudicates none of it. The sealed layer surfaces
// in NOTHING — the read_org branch brushes the edge and Dale flinches back.
//
// Wiring shape: a player-initiated short outing once `pointed_to_dale`, then
// one queue-chained conversation. Dale closes as the corner's still point —
// no crisis, no fate to spend; `dale_bond` opens the one unwatched house
// (pressure.ts renders the easing).
// ============================================================================

import type { GameEvent, LocationAction } from "../../engine/types";

export const daleActions: LocationAction[] = [
  {
    id: "ux_act_dale_visit",
    name: "Go find Dale",
    sub: "The last house on a dead-end road. Marie said to talk to him yourself.",
    cost: 1,
    requires: {
      kind: "all",
      of: [{ kind: "flag", flag: "pointed_to_dale" }, { kind: "noflag", flag: "dale_met" }],
    },
    outcome: {
      log: "You drive out past the church, past where the houses thin, to the road the woman at the gas station didn't want to give you directions to.",
      tone: "n",
      queueEvent: "ux_dale_visit",
    },
  },
];

export const daleEvents: Record<string, GameEvent> = {
  // -- the house at the edge -------------------------------------------------------
  ux_dale_visit: {
    id: "ux_dale_visit",
    title: "The House at the Edge",
    body:
`People warned you, without your asking. The woman at the gas station, when you asked directions to the road Dale lives on, went careful and quiet the way people do around a name they've decided about. *You don't want to go out there.* She didn't say why. She didn't have to; the town decided about Dale a long time ago, and the decision is a thing you can feel in the air like weather.

His place is the last house on a dead-end road, close to the treeline. It's not what you expected — no ruin, no menace. A small house, kept up, a garden gone to autumn, a truck that runs. The house of a careful man who has been alone a long time. You sit in your car for a second, aware of every story you've been told, and then you get out and knock, because Marie said *go talk to him yourself*, and Marie is the only one who ever seemed to mean anything kind about him.`,
    choices: [
      {
        label: `Knock.`,
        outcome: { queueEvent: "ux_dale_meet" },
      },
      {
        label: `Everyone's afraid of this man. Keep your guard up.`,
        attune: -0.25,
        outcome: { setFlags: { dale_wary: true }, queueEvent: "ux_dale_meet" },
      },
    ],
  },

  // -- braced for the worst, from both sides -----------------------------------------
  ux_dale_meet: {
    id: "ux_dale_meet",
    title: "Braced From Both Sides",
    body:
`The man who answers is old in the way of someone who got old early — sixties, maybe less, weathered past his years. And the first thing you see, before anything else, is that *he's* afraid of *you.*

He stands in the half-open door with his weight back, braced, reading your face for what you've come to be — another gawker, another accuser, another kid dared to knock on the killer's door. It's the posture of a man who has answered this door to cruelty so many times that cruelty is what he expects, and something in your chest turns over at the sight of it, because it is not the posture of a monster. It's the posture of prey.

"I'm not here to bother you," you say. "Marie sent me. She said you were decent, and that I should talk to you myself instead of listening to — " you gesture vaguely at the whole town behind you.

Something moves in his face at *Marie*. The brace comes down, an inch. "Marie," he says, like a warmth he'd forgotten he had access to. He looks at you a moment longer, deciding. Then he steps back from the door. "You'd better come in, then. Before somebody sees your car out here and adds you to their list."`,
    choices: [
      {
        label: `"Thank you." Go in.`,
        outcome: { setFlags: { dale_trusted: true }, queueEvent: "ux_dale_account" },
      },
      {
        label: `"…does that happen? People keeping a list of who visits you?"`,
        outcome: {
          log: "'People keep every kind of list out here,' he says, not bitter, just tired, holding the door. 'You'll learn that, if you keep pulling on whatever brought you to my door. Come in.'",
          tone: "n",
          setFlags: { dale_trusted: true },
          queueEvent: "ux_dale_account",
        },
      },
    ],
  },

  // -- what he's told a thousand times --------------------------------------------------
  ux_dale_account: {
    id: "ux_dale_account",
    title: "What He's Told a Thousand Times",
    body:
`Inside is clean and spare and lonely. He makes coffee without asking, because having someone to make coffee for is not a thing that happens to him often, and you understand that letting him is a kindness.

And then, because you asked, or because it's been so long since anyone let him, he tells it. The old story, worn smooth as a river stone by a thousand tellings to people who'd already decided he was lying.

"We were kids. Out in those woods at night, like kids did. Ellen and me were — we were sweet on each other, is all. Nothing to it. We went off from the others for a few minutes, the way you do." His hands are still around his cup. "And something came out of the dark and took her. I've never had better words than that in fifty years and I've tried them all. It was fast, and it was quiet, and it was *wrong*, and she was there and then she wasn't, and I was screaming and there was nothing — there was nothing I could do, I was fourteen and there was *nothing I could do.*"

He looks at you, and there's no performance in it, just an old grief worn into the bone.

"And I ran back and I told them, and they looked at me the way you'd look at a boy who did something to a girl and made up a story. And they've looked at me that way every day since. Fifty years. My own life, spent being the thing that took her, in everybody's eyes but mine and — " a breath " — and Marie's, apparently. God bless Marie."`,
    choices: [
      {
        label: `"I believe you, Dale."`,
        outcome: {
          log: "He doesn't cry. He just closes his eyes for a second, and when he opens them something has eased that you suspect hasn't eased in a very long time. 'You don't know what that's worth,' he says. 'Being believed. You don't know.'",
          tone: "g",
          setFlags: { dale_believed: true },
          queueEvent: "ux_dale_read",
        },
      },
      {
        label: `"…how do you live with people thinking that, for fifty years?"`,
        outcome: {
          log: "'You don't live with it,' he says. 'You live under it. There's a difference, and I hope you never learn it.' He turns his cup. 'You get small. You keep to your house. You stop going where people are, so they don't have to decide what to do with their faces when they see you. And you get old alone at the end of a dead-end road. That's how.'",
          tone: "n",
          setFlags: { dale_underit: true },
          queueEvent: "ux_dale_read",
        },
      },
      {
        label: `Or he's a very good liar who's had fifty years to practice.`,
        requires: { kind: "flag", flag: "dale_wary" },
        attune: -0.25,
        outcome: {
          log: "You hold the thought, because you came in with your guard up and a guard doesn't drop just because a sad old man makes good coffee. Maybe this is exactly the face a guilty man wears best. You can't prove it either way, sitting in his kitchen. You can't prove anything. You just watch him, and you keep the thought, and you notice it gets harder to hold the longer you sit there.",
          tone: "n",
          setFlags: { dale_doubted: true },
          queueEvent: "ux_dale_read",
        },
      },
    ],
  },

  // -- no ghosts ---------------------------------------------------------------------------
  ux_dale_read: {
    id: "ux_dale_read",
    title: "No Ghosts",
    body:
`You ask him the question you came out here carrying: what does he think it *was.*

And Dale — the man the town made into its ghost story — gives you the most grounded answer you've heard from anyone.

"I'll tell you what it wasn't," he says. "It wasn't a ghost. It wasn't a monster. I know what people say about these woods, the old stories, the — I've heard all of it, and I'll tell you, fifty years of thinking about almost nothing else: there's no devil out there." He leans forward. "There's *people* out there. That's the truth nobody wants, because a monster you can't do anything about, a monster's just weather. But people — people took that girl, people who know these woods and know how to not be seen and know how to make a whole town look at a fourteen-year-old boy instead of at them. *People.* And people are worse than any ghost, because people *choose* it."

He sits back. "Whatever brought you out here — whatever you've seen or think you've seen — don't let anybody sell you a monster. A monster's a story that lets the guilty walk. It's people. It's always been people."`,
    choices: [
      {
        label: `"You're right. It's people. I've felt that."`,
        lensFlavor: "skeptic",
        outcome: {
          log: "It lands, because it's the reading that takes the danger seriously without needing anything supernatural — the most rational fear there is, and the most useful, because you can watch for people in a way you can't watch for a ghost. You believe him. And some quiet part of you notes that 'it's people' can't be proven any more than a monster can, that it's a frame like any other — but it's a good frame, and a brave one, and you take it.",
          tone: "n",
          setFlags: { read_human: true },
          queueEvent: "ux_dale_warning",
        },
      },
      {
        label: `"Maybe. But I've seen things out here I can't fit into 'people,' Dale."`,
        lensFlavor: "spiritual",
        outcome: {
          log: "He looks at you with something like pity, or fear for you. 'Then you've been out here too long already,' he says softly. 'That's how it starts. The woods give you something you can't explain, and you reach for the monster because the monster's easier than the truth. Don't. Please. I've watched it take people surer than you.' You hear him. You don't quite let go of what you saw.",
          tone: "n",
          setFlags: { read_kept_open: true },
          queueEvent: "ux_dale_warning",
        },
      },
      {
        label: `"People. Organized people. You're describing something with a structure, Dale — that's bigger than a few locals."`,
        lensFlavor: "institutional",
        outcome: {
          log: "He goes quiet, and wary, in a new way. 'I didn't say that,' he says. 'I said people. You start saying organized, you start saying structure, and you're talking about something that has managed to run this town for fifty years without one person able to name it, and that is exactly the kind of talk that gets a person — ' he stops. 'That gets a person made into me. Or worse.' He doesn't finish. He's said more than he meant to.",
          tone: "n",
          setFlags: { read_org: true, dale_org_flinch: true },
          queueEvent: "ux_dale_warning",
        },
      },
    ],
  },

  // -- the kindest thing he does ---------------------------------------------------------------
  ux_dale_warning: {
    id: "ux_dale_warning",
    title: "The Kindest Thing He Does",
    body:
`He walks you to the door when it's time, and at the door he stops you, one hand not quite on your arm.

"Listen to me. I don't get to say this to people — I don't get *people* — so let me say it right." He's choosing the words like they cost him. "Go home. Whatever's out here, whatever you're chasing, whatever's chasing you — go home and don't come back to it. Not because there's nothing here. Because there's *something* here, and it's real, and it took the only person I ever — " he stops, starts again. "It ruined my whole life and I didn't even do anything but *see* it. You've done more than see it. I can tell. It's already got its hand on you a little, the way you talk."

"Don't end up an old man at the end of a road, is what I'm telling you. There's still time for you to just... leave. Have a life. Let it alone. Please."`,
    choices: [
      {
        label: `"I don't know if I can leave it alone, Dale."`,
        outcome: {
          log: "He nods slowly, and it's not surprise, it's grief — the grief of a man watching something he's seen before. 'No,' he says. 'No, I didn't think you could. Nobody who gets this far can. I just needed to be the one person who told you that you could. In case it helps you later to know somebody said it.' He lets you go. 'Be careful. Be so careful.'",
          tone: "n",
          setFlags: { dale_warned_unheeded: true },
          queueEvent: "ux_dale_close",
        },
      },
      {
        label: `"…you're the first person out here who's tried to protect me instead of use me."`,
        outcome: {
          log: "Something breaks open in his face — the specific wound of a kind man who has had fifty years to be kind and no one to be kind to. 'Somebody should've protected that girl,' he says, rough. 'I couldn't. I was fourteen. So I'll settle for telling one fool kid to go home. You're the first one who ever let me.' He clears his throat, embarrassed by it. 'Go on. And you come back here if you need somewhere nobody's watching — I'm about the only house in this county that isn't.'",
          tone: "g",
          setFlags: { dale_bond: true },
          queueEvent: "ux_dale_close",
        },
      },
    ],
  },

  // -- the sane, sad, grounded man ---------------------------------------------------------------
  ux_dale_close: {
    id: "ux_dale_close",
    title: "The Still Point",
    body:
`You leave Dale's house at the end of its dead-end road, and the town is out there past the trees with its fifty-year-old decision about him, and you carry out of that kitchen a thing the town threw away: the sanest read of the whole business, from the person least equipped by reputation to give it. *People, not ghosts. People are worse. Go home.*

He doesn't come apart like the others. He doesn't get taken back or lost in the dark. He's the still point — the one who saw the worst of it and survived it into a small, careful, lonely peace, and who spent his one conversation with you trying to give you the exit he never had. You'll think about Dale. Whatever you end up believing happened in those woods, the shape of him — kind, grounded, disbelieved, right or wrong but never cruel — will sit under all of it as the thing the monster-story costs: a real man, made into a ghost so the truth could stay buried.`,
    choices: [
      {
        label: `Drive back toward town.`,
        outcome: { setFlags: { dale_met: true } },
      },
    ],
  },
};
