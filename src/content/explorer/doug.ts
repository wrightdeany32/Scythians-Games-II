// ============================================================================
// content/explorer/doug.ts — the Doug thread (Loom's story passes, wired):
// the workout & the message → the dinner (the cake) → the invitation & the
// observation meeting → the break (the marked man comes apart).
//
// The up-axis thread: the cult's warm, human face. Doug is sincere from the
// first beat to the last; recruitment and warning stay indistinguishable.
// Percept, never cause — the wrongness at the meeting is perceived
// coordination, never explained; Doug's account of his own marking is his,
// unconfirmed. The sealed layer surfaces in NOTHING here.
//
// Wiring shape: a repeatable loop action (the workout; first visit queues the
// tonal beat via its once-flag), scheduled met-doors (the message, the
// invitation, the break), phone actions for the player-initiative steps
// (reply, commit), and queue-chained scenes. Conditional-insert routing at
// the break (three plea routes on the meeting lean, complementary conditions).
//
// Coordinate conventions used here (magnitudes mine — Loom fixed sign + "small"):
//   attune small ±0.25 · dinner enable-leans +0.2/+0.3 · meeting close ±0.4 ·
//   break fork +0.7 (embrace, "hard") / −0.6 (refuse)
// ============================================================================

import type { GameEvent, LocationAction } from "../../engine/types";

export const dougActions: LocationAction[] = [
  // -- the run (repeatable; the tonal beat fires first visit via its once-flag)
  {
    id: "ux_act_doug_workout",
    tiredText: "Not today. Your legs are done, and you know it.",
    name: "Run with Doug",
    sub: "The six a.m. ritual — the fire road out past the reservoir.",
    cost: 2,
    requires: { kind: "flag", flag: "thread_doug" },
    outcome: {
      log: "Doug picks you up at six because Doug has always picked you up at six, since you were nineteen and he was the family friend who'd decided, without asking, that you weren't going to be a kid who sat inside. You run the fire road out past the reservoir. He sets the pace a little too hard, the way he always has, and you hate it and you keep up and that's the whole ritual.",
      tone: "g",
      stats: { tradecraft: 1 },
      statsMax: { tradecraft: 6 },   // the believer's-floor cap (Armature's number)
      setFlags: { thread_doug_active: true },
      queueEvent: "ux_doug_workout_first",
    },
  },
  // -- the phone-as-hand: answering Doug's message is the player's move
  {
    id: "ux_act_doug_reply",
    tiredText: "Not today. You haven't got the face for people right now.",
    name: "Call Doug back",
    sub: "The message is still sitting in your phone. No rush, he said.",
    cost: 1,
    surface: "phone",
    contact: "doug",
    requires: {
      kind: "all",
      of: [{ kind: "flag", flag: "doug_message_seen" }, { kind: "noflag", flag: "doug_reached_back" }],
    },
    outcome: {
      log: "You call him back. He picks up on the second ring, like the phone was in his hand.",
      tone: "n",
      setFlags: { doug_reached_back: true },
      queueEvent: "ux_doug_dinner_invite",
    },
  },
  // -- the dinner stays open for a deferred or wary player
  {
    id: "ux_act_doug_dinner_yes",
    tiredText: "Not today. You haven't got the face for people right now.",
    name: "Tell Doug you'll come to dinner",
    sub: "Standing invitation, he said. They host most weeks.",
    cost: 1,
    surface: "phone",
    contact: "doug",
    requires: {
      kind: "all",
      of: [
        { kind: "any", of: [{ kind: "flag", flag: "doug_dinner_deferred" }, { kind: "flag", flag: "doug_dinner_wary" }] },
        { kind: "noflag", flag: "doug_dinner_accepted" },
      ],
    },
    outcome: {
      log: "You tell him you're in. He doesn't make anything of the wait, which is somehow warmer than if he had.",
      tone: "n",
      setFlags: { doug_dinner_accepted: true },
      scheduleEvent: { eventId: "ux_doug_dinner_arrive", inDays: 1 },
    },
  },
  // -- the deferred ask stays open (the invitation's door never closes)
  {
    id: "ux_act_doug_commit",
    tiredText: "Not today. You haven't got the face for people right now.",
    name: "Call Doug — tell him you're in",
    sub: "The gathering. The pieces. The ask that stands.",
    cost: 1,
    surface: "phone",
    contact: "doug",
    requires: {
      kind: "all",
      of: [
        { kind: "any", of: [{ kind: "flag", flag: "doug_deferred" }, { kind: "flag", flag: "doug_declined_meeting" }] },
        { kind: "noflag", flag: "doug_committed" },
      ],
    },
    outcome: {
      log: "You tell him you'll come see. You set the money aside for the pieces that evening — it was earmarked for something of your own, and now it's his. An investment is a kind of belief you pay for before you have it.",
      tone: "n",
      setFlags: { doug_committed: true, money_set_aside_doug: true },
      scheduleEvent: { eventId: "ux_doug_meeting_arrive", inDays: 2 },
    },
  },
];

export const dougEvents: Record<string, GameEvent> = {
  // -- the workout's tonal beat (first visit only, via the once-flag) ------------
  ux_doug_workout_first: {
    id: "ux_doug_workout_first",
    once: "doug_workout_beat_done",
    title: "Walking It Out",
    body:
`He's good company. That's the thing about Doug you forget until you're with him — he's *easy*, dry, quick, fifty-odd and built like a man who's never once let it go. Half a mile in you're both breathing and not talking and it's the best you've felt in a week.

It's near the end, walking it out, hands on your head, that he says it.

"You know I've got your back. Right? Whatever's going on with you." He's looking down the road, not at you. "There's — I don't know. There's dark times coming. For everybody. And people who care about each other, they've got to stick together through that. That's all that gets anybody through anything."`,
    choices: [
      {
        label: `"Yeah. Course, Doug."`,
        outcome: {
          log: "You mean it. He nods like it mattered that you said it.",
          tone: "g",
          setFlags: { doug_warmth: true },
          scheduleEvent: { eventId: "ux_doug_message", inDays: 2 },
        },
      },
      {
        label: `"…what's going on, man? Are you okay?"`,
        outcome: {
          log: "He laughs, and waves it off, and says he's fine, he's just getting old and philosophical. He changes the subject to your knee. But he said it, and now it's said.",
          tone: "n",
          setFlags: { doug_hint: true },
          scheduleEvent: { eventId: "ux_doug_message", inDays: 2 },
        },
      },
      {
        label: `"That's a little dark for a Tuesday."`,
        outcome: {
          log: "He grins, and lets you have it, and calls you an asshole with real affection. And you notice he doesn't take it back.",
          tone: "n",
          setFlags: { doug_hint: true },
          scheduleEvent: { eventId: "ux_doug_message", inDays: 2 },
        },
      },
      // The unfalsifiable-feedback plant: only offered once the player has a
      // frame for wrongness. Sets doug_off; confirms nothing.
      {
        label: `This isn't like Doug.`,
        requires: { kind: "any", of: [{ kind: "flag", flag: "cave_heard_voice" }, { kind: "flag", flag: "grave_suspicion" }] },
        attune: 0.25,
        outcome: {
          log: "You've known this man your whole life. He is the most down-to-earth person in it — the one who explains, who steadies, who calls the ghost story a ghost story. And he just talked about dark times coming like a man who's seen the forecast. You don't say any of this out loud. You just clock it, and it sits wrong, and you can't say why.",
          tone: "n",
          setFlags: { doug_off: true },
          scheduleEvent: { eventId: "ux_doug_message", inDays: 2 },
        },
      },
    ],
  },

  // -- the text ------------------------------------------------------------------
  ux_doug_message: {
    id: "ux_doug_message",
    once: "doug_message_seen",
    title: "The Message",
    body:
`The text comes in while you're doing something else, the way texts do.

**Doug:** *hey — when you get a chance, no rush, I've got something I want to run by you. Nothing bad. Would rather do it in person. Whenever you're around.*

You read it twice. *Nothing bad* is the kind of thing people say when they've thought about whether the thing is bad.

It sits in your phone. You can answer it whenever.`,
    bodyExtras: [
      // The doug_off tint — the wrongness under "nothing bad." Engine-authored
      // placeholder in Loom's register (flagged in the edit log for approval).
      {
        when: { kind: "flag", flag: "doug_off" },
        text: `You think about the fire road, and dark times coming, and how he didn't take it back. It's probably nothing. You notice you're telling yourself that.`,
      },
    ],
    choices: [
      {
        label: `Put the phone back in your pocket.`,
        outcome: {
          scheduleEvent: { eventId: "ux_doug_nudge", inDays: 4 },   // the soft nudge, if silence holds
        },
      },
    ],
  },

  // -- the soft nudge (skips itself if the player already reached back) ------------
  ux_doug_nudge: {
    id: "ux_doug_nudge",
    once: "doug_nudge_seen",
    condition: { kind: "noflag", flag: "doug_reached_back" },
    title: "Still Around",
    body:
`A few days on, another text, lighter than the first:

**Doug:** *still around whenever. no rush.*

That's all. He doesn't push. The door just stays open.`,
    choices: [{ label: `Pocket the phone.`, outcome: {} }],
  },

  // -- the dinner invite (fires off the reply) -------------------------------------
  ux_doug_dinner_invite: {
    id: "ux_doug_dinner_invite",
    title: "Come to Dinner",
    body:
`Doug's ask, when it comes, is so ordinary it's almost a relief. "Come to dinner," he says. "Nothing — I don't mean anything by it, just dinner. Some friends of mine host, they do it up right, good food, good wine, the kind of evening you forget people still have. Small group. Interesting people." He grins. "People I'd like you to meet, honestly. You've been keeping to yourself and it's not good for you."

No mention of family, or dark times, or anything with weight on it. Just dinner.`,
    choices: [
      {
        label: `"Sure, Doug. I could use a good meal."`,
        outcome: {
          log: "You say yes to a plate of food, which is the easiest yes there is.",
          tone: "g",
          setFlags: { doug_dinner_accepted: true },
          scheduleEvent: { eventId: "ux_doug_dinner_arrive", inDays: 1 },
        },
      },
      {
        label: `"Maybe. Let me see how the week shapes up."`,
        outcome: {
          log: "He takes it easy. 'Standing invitation,' he says. 'They host most weeks.' No push. He means it.",
          tone: "n",
          setFlags: { doug_dinner_deferred: true },
        },
      },
      {
        label: `"…this feels like more than dinner, Doug."`,
        requires: { kind: "flag", flag: "doug_off" },
        attune: -0.25,
        outcome: {
          log: "He laughs, easy, unbothered. 'It's dinner. What's gotten into you? It's a plate of food and some people who'll like you. Come or don't.' And it's so light, so genuinely unweighted, that you feel foolish, and you can't tell if the foolishness is the point or just the truth.",
          tone: "n",
          setFlags: { doug_dinner_wary: true },
        },
      },
    ],
  },

  // -- a genuinely nice evening ----------------------------------------------------
  ux_doug_dinner_arrive: {
    id: "ux_doug_dinner_arrive",
    once: "doug_dinner_arrived",
    title: "A Genuinely Nice Evening",
    body:
`The house is lovely — tasteful, warm, moneyed without shouting about it, candles and good smells and a table set for eight. And the evening is, for a long stretch, exactly what Doug promised: easy. The people are interesting and they're *interested*, in you, in a way that's flattering and doesn't feel like a sales pitch. Someone's a great cook. Someone tells a genuinely funny story. The wine is very good. Doug is in his element, warm and proud, glad you came, introducing you around like you're someone he's pleased to show off.

You relax. You'd forgotten evenings could be like this. Whatever you'd braced for, it isn't here — it's just a good dinner with pleasant people, and you feel a little silly for the bracing.`,
    choices: [
      {
        label: `Settle in and enjoy it.`,
        outcome: { stats: { energy: -1 }, queueEvent: "ux_doug_dinner_cake" },
      },
      {
        label: `Stay a little watchful, even so.`,
        outcome: {
          log: "You let yourself enjoy it and you keep one small light on in the back of your head, the way you've learned to. Nothing trips it. The evening is just the evening. But the light stays on.",
          tone: "n",
          stats: { energy: -1 },
          setFlags: { dinner_watchful: true },
          queueEvent: "ux_doug_dinner_cake",
        },
      },
    ],
  },

  // -- is that a cake ---------------------------------------------------------------
  ux_doug_dinner_cake: {
    id: "ux_doug_dinner_cake",
    title: "Is That a Cake",
    body:
`You'd noticed it when you came in, on the sideboard, and taken it for décor — a sculpture, remarkably good, a German shepherd sitting alert and lifelike, the kind of thing you'd expect in a house like this. Bronze, you'd assumed, or something finer. You hadn't looked closely.

You look closely now because a woman crossing to the sideboard reaches out, without breaking her sentence, and swipes a fingertip along the dog's shoulder — and licks it. "God," she says to her companion, "the buttercream on this year's is unreal," and drifts on.

It's a cake.

You get up to see, because you have to. And it's — it's genuinely astonishing. Every hair of the coat piped and brushed into fur that catches the candlelight like the real thing. The wet gleam on the black nose. The amber eyes, bright and specific and *kind*, the way a good dog's eyes are kind. Someone made this. Someone spent, you can't imagine, days, making a cake indistinguishable from a living animal, down to the fur and the eyes and the ears caught mid-turn as though it just heard its name.`,
    choices: [
      {
        label: `"That's incredible. Genuinely a work of art."`,
        outcome: { setFlags: { cake_admired: true }, queueEvent: "ux_doug_dinner_cut" },
      },
      {
        label: `"That's… a lot of effort for a dessert. It's a little much."`,
        outcome: { setFlags: { cake_uneasy: true }, queueEvent: "ux_doug_dinner_cut" },
      },
      {
        label: `"Cute. Weird flex, but cute."`,
        outcome: { setFlags: { cake_shrugged: true }, queueEvent: "ux_doug_dinner_cut" },
      },
    ],
  },

  // -- who wants a piece of brain -----------------------------------------------------
  ux_doug_dinner_cut: {
    id: "ux_doug_dinner_cut",
    title: "Who Wants a Piece of Brain",
    body:
`Someone taps a wine glass. The table gathers, easy, glasses in hand, the host stepping up to the sideboard with a long knife and a light word about how it's a shame to cut into it every year and yet. Everyone laughs, the warm laugh of a group with a fond tradition.

He starts at the head.

And when the first slice comes away, the dog has a brain.

Not a suggestion of one. A brain — the whole convoluted mass of it, rendered in something pale and dense, the folds and fissures shaped by a hand that studied the real thing, nested exactly where it should be inside the sculpted skull. The host lifts a portion of it on the blade, considers it with a connoisseur's approval, and says, to a small ripple of appreciative murmurs: "Who wants a piece of brain?"

Someone does. Someone always does. A plate goes round.

And it keeps going. The knife moves down and the animal is *complete* inside — everything shaped and layered and colored and placed, organ by organ, all of it food, all of it edible, none of it gory in the slasher sense and *all* of it deeply, patiently, lovingly anatomical, as though whoever made it cared more about getting the viscera right than about anything a guest would taste. It's not frightening. It's something stranger than frightening. Someone did this on purpose, for a dinner party, and everyone here has seen it before, and everyone thinks it's *lovely.*

And Doug — you look at Doug — Doug is holding his little plate and eating his portion and nodding along, pleasant, unbothered, the exact face he'd wear over any nice dessert at any nice table. Not rapt. Not performing. Just a man enjoying a thing his friends do, the way you'd enjoy anything you'd long since stopped finding strange.`,
    choices: [
      {
        label: `Take it in, and say nothing.`,
        outcome: {
          log: "You keep your face still and you clock all of it — the effort, the fondness, the utter ordinariness of it to them, Doug's casual plate. You don't have a word for what's wrong, because nothing here is technically wrong. It's cake. But something has quietly rearranged itself in the room, and only you seem to feel the furniture move.",
          tone: "n",
          setFlags: { dinner_noticed: true },
          queueEvent: "ux_doug_dinner_close",
        },
      },
      {
        label: `"This is a little dark, isn't it? For a dinner party."`,
        outcome: {
          log: "You say it with a smile, testing, and the woman beside you smiles back, warm, and says 'Oh, it's an acquired taste, I know — you get used to it, it's really just very good cake,' and pats your arm, and returns to her plate, and the smoothness of the deflection is somehow more than the cake was. Nobody's offended. Nobody's defensive. It's just — an acquired taste.",
          tone: "n",
          setFlags: { dinner_flagged: true },
          queueEvent: "ux_doug_dinner_close",
        },
      },
      {
        label: `"Honestly? The craftsmanship is unbelievable. Look at the detail on this."`,
        diamondCoord: { sanction: 0, vertical: 0.2 },   // the embrace path's first footstep
        outcome: {
          log: "And you mean it — it is unbelievable, and saying so out loud feels good, feels like being let in on something, and the woman beside you lights up and starts telling you who made it and how long it takes and you find you want to know. It's just appreciating craft. That's all it is. You notice, distantly, that it's also the easiest you've felt all night, and you don't examine why.",
          tone: "n",
          setFlags: { dinner_leaned_in: true },
          queueEvent: "ux_doug_dinner_close",
        },
      },
      {
        label: `The knife comes around. Take it, and cut your own piece.`,
        diamondCoord: { sanction: 0, vertical: 0.3 },   // complicity made mechanical — the heavier footstep
        outcome: {
          log: "The knife goes around the table, the way it does at these things, and when it comes to you, you take it, and you cut yourself a piece, and you eat it. It's very good. That's the whole of what happened — you took a slice of cake at a dinner party — and no one remarks on it, least of all you.",
          tone: "n",
          setFlags: { dinner_took_knife: true },
          queueEvent: "ux_doug_dinner_close",
        },
      },
    ],
  },

  // -- Doug walks you out ---------------------------------------------------------------
  ux_doug_dinner_close: {
    id: "ux_doug_dinner_close",
    title: "Doug Walks You Out",
    body:
`The evening winds down the way good evenings do, and the cake becomes, over the next hour, just a mostly-eaten thing on a platter that no one remarks on anymore, the way you stop seeing a centerpiece. There's coffee. There's more easy talk. It's nice again, and the niceness folds back over the strangeness until you could almost believe you imagined the size of it.

Doug walks you to your car, warm, an arm briefly across your shoulders. "See? Good people. I told you." He's so pleased. "Come again — they'd have you back in a heartbeat, they liked you, I could tell." And then, lighter, almost an afterthought, the first faint weight of the whole easy evening: "Some of us get together a little more properly, now and then. The real thing. If you ever get curious about it, you tell me — no rush, no pressure." He squeezes your shoulder, and doesn't push it, and waves you off down the drive, and drives home himself to his own ordinary bed, a man who had a nice dinner with his friends.`,
    choices: [
      {
        label: `Drive home.`,
        outcome: {
          setFlags: { doug_dinner_done: true },
          scheduleEvent: { eventId: "ux_doug_invitation", inDays: 3 },
        },
      },
    ],
  },

  // -- the ask ---------------------------------------------------------------------------
  // NO once-flag by design: the introspective branch re-presents the card, and
  // nextQueuedEvent would skip a once-flagged re-queue.
  ux_doug_invitation: {
    id: "ux_doug_invitation",
    title: "The Ask",
    body:
`You meet Doug for coffee because he asked to do this in person, and in person he's nervous in a way you've never seen — not scared, *careful*, choosing words.

"You liked them," he says. "At the dinner. I could tell — and they liked you." He turns his cup. "So I'm going to tell you the rest of it, because you've felt the shape of it now even if nobody put a word to it. It's not just dinners, those people. It's a family. Has been a long time. People who understand that the world takes and takes, and the only thing that's ever held anybody up is other people deciding not to let them fall." A breath. "And there's a real gathering. Not a dinner — the heart of it. I want you to come see. Just once. Just to see."

There's a catch and you wait for it and it comes gently.

"There's a — a way of doing it. You come on your own. And there's some things you'd wear. Nothing crazy. It's tradition, it matters to people, and I'll be honest with you, it's not free — you'd have to get the pieces yourself. I know that's a lot to ask. I wouldn't ask if it didn't mean something."`,
    choices: [
      {
        label: `"Okay, Doug. I'll come see."`,
        outcome: {
          log: "You say yes to Doug, not to the thing, and you can see how much it means to him that you did. You set the money aside for the pieces that evening — and setting it aside is the cost: it was earmarked for something of your own, and now it's his. An investment is a kind of belief you pay for before you have it.",
          tone: "n",
          setFlags: { doug_committed: true, money_set_aside_doug: true },
          scheduleEvent: { eventId: "ux_doug_meeting_arrive", inDays: 2 },
        },
      },
      {
        label: `"That's real money, Doug. I've been putting it toward something of my own. Let me sit with it."`,
        outcome: {
          log: "You weigh the pieces against what you'd been saving for — the trip, the gear, whatever's yours — and the weighing is its own answer, for tonight. He says take your time; the offer stands. But you both heard you count the cost, and so did you.",
          tone: "n",
          setFlags: { doug_deferred: true },
        },
      },
      {
        label: `"I don't think it's for me, man. But I'm glad you've got it."`,
        outcome: {
          log: "He nods. He's not hurt, or he doesn't show it. 'Offer stands,' he says. 'Always will.' And he means it, and the door stays open behind you as you go.",
          tone: "n",
          setFlags: { doug_declined_meeting: true },
        },
      },
      {
        label: `"…why does this feel like a recruitment, Doug?"`,
        requires: { kind: "all", of: [{ kind: "flag", flag: "doug_off" }, { kind: "noflag", flag: "doug_named_it" }] },
        attune: -0.25,
        outcome: {
          log: "He goes quiet. 'Because it is,' he says, and the honesty is worse than a denial would have been. 'That's what family is, when it's real. Somebody reaches for you. I'm reaching for you.' He holds your eye. 'You can say no. People forget that part. You can always say no.' Which is exactly the kind of thing that's true whether it's true or not.",
          tone: "n",
          setFlags: { doug_named_it: true },
          queueEvent: "ux_doug_invitation",   // the ask stands; the player still chooses
        },
      },
    ],
  },

  // -- the house -----------------------------------------------------------------------
  ux_doug_meeting_arrive: {
    id: "ux_doug_meeting_arrive",
    once: "doug_meeting_arrived",
    title: "The House",
    body:
`The address is a house you didn't know existed, set back off a road you've driven a hundred times — big, old, moneyed in the quiet way that doesn't need to announce it. There are other cars. Nice ones. You wear the pieces you bought and you feel like you're in costume until you get inside and everyone is in the same costume and then you feel like the one thing worse, which is *underdressed in it.*

Doug meets you at the door and his relief at seeing you is enormous and genuine. "You came," he says, and grips your shoulder, and for a second it's just Doug, your Doug, glad you're here.

Then he walks you in.`,
    choices: [
      {
        label: `Stay close to Doug.`,
        outcome: { stats: { energy: -1 }, setFlags: { meeting_with_doug: true }, queueEvent: "ux_doug_meeting_observe" },
      },
      {
        label: `Drift. Watch the room.`,
        outcome: { stats: { energy: -1 }, setFlags: { meeting_watching: true }, queueEvent: "ux_doug_meeting_observe" },
      },
    ],
  },

  // -- the room that moves together --------------------------------------------------------
  ux_doug_meeting_observe: {
    id: "ux_doug_meeting_observe",
    title: "The Room That Moves Together",
    body:
`It's a party, and it isn't. Forty-odd people, drinks, low talk, the warm hum of a room full of people who know each other. Older, most of them. Comfortable. Kind, even — you get introduced, hands are shaken, someone asks about your drive with real interest. Nothing happens. There is no altar, no chanting, no robed figure. It is the least sinister room you have ever stood in.

And you cannot relax in it, and it takes you a while to understand why, and when you understand it your skin goes cold:

*They move together.*

Not dramatically. Not all at once. But a toast goes up across the room and the glasses rise a half-beat before the man finishes proposing it, like the room already knew the shape of the sentence. Two people at the window finish a thought in the same three words and laugh, and it's the laugh of an old joke except you'd swear you watched them meet for the first time. And once — you'd doubt it if you weren't looking right at it — the whole room turns, easily, unconsciously, toward the far door a moment *before* it opens and someone comes in.

Each one is nothing. People finish each other's sentences. Rooms have a mood. You're keyed up and you're seeing patterns, which is exactly the thing you now know your brain does in the dark.

But you're standing in the middle of it, and every one of them moves with an ease you don't have, a rhythm you can't find, and the longer you stand there the more certain you are of one small terrible thing: *in a room where everyone belongs to the beat, the person who stands out is the one who doesn't.* And that's you. You're the visible one. You're the note that's off.`,
    choices: [
      {
        label: `"This is a cult. I'm standing in a cult."`,
        lensFlavor: "spiritual",
        outcome: {
          log: "You feel it lock into place, and the certainty is almost a relief — a name for the wrongness. And under the certainty, the small clear voice: you can't prove one thing you just saw. People finish sentences. Rooms turn toward doors. You'd need it to be more than that, and it wasn't, quite. It never is, quite.",
          tone: "n",
          setFlags: { read_cult: true },
          queueEvents: ["ux_doug_meeting_mark", "ux_doug_meeting_close"],
        },
      },
      {
        // lensFlavor swept read_mundane → skeptic per the file's own wire note
        label: `"It's a room full of rich people who've known each other forever. That's all this is."`,
        lensFlavor: "skeptic",
        outcome: {
          log: "You talk yourself down, and it works, because it's reasonable — this is exactly what old money looks like from outside, a closed circle that reads as sinister to anyone not in it. You believe it. Mostly. There's a half-beat you keep coming back to, a toast that went up too early, and you set it down, and it doesn't quite stay down.",
          tone: "n",
          setFlags: { read_mundane: true },
          queueEvents: ["ux_doug_meeting_mark", "ux_doug_meeting_close"],
        },
      },
      {
        label: `…I am the only real person in this room.`,
        attune: 0.25,
        outcome: {
          log: "The thought arrives whole and you can't unthink it — that everyone here is moving to something you can't hear, and you're the one raw nerve in a room of people at perfect ease, and you don't know if that makes you the sane one or the only one not yet let in on it. You don't know which is worse. You keep your face still and you drink your drink.",
          tone: "n",
          setFlags: { read_outsider: true },
          queueEvents: ["ux_doug_meeting_mark", "ux_doug_meeting_close"],
        },
      },
    ],
  },

  // -- the thing you've seen before (conditional insert; gates on the cave's flag) ----------
  ux_doug_meeting_mark: {
    id: "ux_doug_meeting_mark",
    once: "meeting_mark_fired",
    condition: { kind: "flag", flag: "cave_etchings_seen" },
    title: "The Thing You've Seen Before",
    body:
`You're half-listening to a man explain something warm and vague about tradition when your eye catches on his ring.

It's on the signet. Small, worn, easy to miss. You've seen it before. You've seen it scratched into cave rock by lamplight, low and left on a wall that later closed over like it had never been touched. The same mark. On a rich man's finger, in a warm bright room, twenty miles and a world away from the dark you first saw it in.

He notices you looking. He smiles, the way you smile at someone admiring a thing you're fond of, and says it's been in the family a long time, and moves on.`,
    choices: [
      {
        label: `Say nothing. Remember the ring.`,
        outcome: {
          log: "You file it. A symbol on a wall and a symbol on a ring, and the space between them that your mind is already trying to close. You don't let it close. Not here. But you'll never quite un-see the two of them sitting side by side.",
          tone: "n",
          setFlags: { meeting_mark_seen: true },
        },
      },
    ],
  },

  // -- the drive home, and Doug's face -------------------------------------------------------
  ux_doug_meeting_close: {
    id: "ux_doug_meeting_close",
    title: "The Drive Home, and Doug's Face",
    body:
`Doug finds you near the end. "So," he says, and there's a whole life in the word — hope, and fear of your answer, and love. "What'd you think?"`,
    choices: [
      {
        label: `"I don't know what I saw, Doug. But I'm glad I came for you."`,
        outcome: {
          log: "The honest non-answer. He takes it — a little deflated, not hurt. The door stays open both ways.",
          tone: "n",
          setFlags: { doug_meeting_open: true, doug_meeting_done: true },
          scheduleEvent: { eventId: "ux_doug_break", inDays: 3 },
        },
      },
      {
        label: `"These are good people. I get it now."`,
        diamondCoord: { sanction: 0, vertical: 0.4 },
        outcome: {
          log: "His whole body eases. You've given him the thing he wanted, which was not your soul — it was to not be alone in this. You watch what it means to him, and you can't tell, and will never be able to tell, whether you just comforted your oldest friend or took the first step onto his road.",
          tone: "n",
          setFlags: { doug_meeting_embraced: true, doug_meeting_done: true },
          scheduleEvent: { eventId: "ux_doug_break", inDays: 3 },
        },
      },
      {
        label: `"I think you should get out of this, Doug. Whatever it is."`,
        diamondCoord: { sanction: 0, vertical: -0.4 },
        outcome: {
          log: "The ease goes out of him. Not anger — grief. 'You don't understand it yet,' he says, and it's gentle, and it's the saddest thing he's said all night. 'I hope you never have to.' And you realize, driving home, that you can't tell if he was recruiting you or warning you, and that maybe, for Doug, there was never any difference between the two.",
          tone: "b",
          stats: { standing: -1 },
          setFlags: { doug_meeting_refused: true, doug_meeting_done: true },
          scheduleEvent: { eventId: "ux_doug_break", inDays: 3 },
        },
      },
    ],
  },

  // -- the call at the wrong hour ---------------------------------------------------------------
  ux_doug_break: {
    id: "ux_doug_break",
    once: "doug_break_fired",
    title: "The Call at the Wrong Hour",
    body:
`The phone goes at 2 a.m., and it's Doug, and Doug has never once called you at 2 a.m.

His voice is wrong. Not drunk — *scraped.* "Hey. Hey, I'm sorry, I know what time it is." A breath that isn't steady. "I can't — I need to see you. Tonight. I know that's crazy. I wouldn't ask." Another breath. "I can't do this anymore, and you're the only person I can say that to."`,
    choices: [
      {
        label: `"Where are you? I'm coming."`,
        outcome: { setFlags: { doug_break_answered: true }, queueEvent: "ux_doug_break_meet" },
      },
      {
        label: `"Doug, it's 2 a.m. Are you safe right now? Talk to me first."`,
        outcome: {
          log: "'I'm safe,' he says, and almost laughs, and it's an awful sound. 'That's the whole problem. I'm real safe. Just come.' He gives you a place. You go.",
          tone: "n",
          setFlags: { doug_break_answered: true, doug_break_grounded: true },
          queueEvent: "ux_doug_break_meet",
        },
      },
    ],
  },

  // -- what's under the warmth --------------------------------------------------------------------
  ux_doug_break_meet: {
    id: "ux_doug_break_meet",
    title: "What's Under the Warmth",
    body:
`He's in his truck in an empty lot by the reservoir, the same water you've run past with him a hundred mornings, and when you get in he looks a decade older than he did at the meeting. He can't quite hold your eye.

"I'm going to tell you something," he says, "and you're going to think I've lost my mind, and maybe I have. But I'm tired. I'm so tired of being the one who's fine."

And it comes out of him in pieces, the way a thing comes out when it's been held thirty years:

"When I was young — younger than you — something happened to me out here. In these woods. I don't have words that don't sound insane. Something *reached* for me. Something touched me and didn't — didn't finish. And I've never been right since, and I've never been alone since either, because the people who found me after, the *family*, they understood. They were the only ones who understood. They took me in and they held me up and they gave me a reason and they have *never once let me fall.*" His jaw works. "And they will never, ever let me go. And I didn't understand that those were the same sentence until it was thirty years too late."

He finally looks at you.

"I brought you toward them. God help me, I did that, because I love you and I couldn't stand the thought of you out here alone with — with whatever this is. And now I'm sitting here at two in the morning trying to figure out if I was saving you or feeding you to it, and I *can't tell*, and that's what I can't do anymore."`,
    choices: [
      {
        // Engine-authored connective line (flagged in the edit log): the plea
        // routes on the meeting lean via the conditional-insert pattern.
        label: `"I'm here, Doug. Say what you need to say."`,
        outcome: {
          queueEvents: ["ux_doug_break_embrace_route", "ux_doug_break_refuse_route", "ux_doug_break_open_route"],
        },
      },
    ],
  },

  // -- the plea, embrace-lean: a hand held out ------------------------------------------------------
  ux_doug_break_embrace_route: {
    id: "ux_doug_break_embrace_route",
    condition: { kind: "flag", flag: "doug_meeting_embraced" },
    title: "A Hand Held Out",
    body:
`Because you leaned toward him at the meeting, Doug's plea is not a warning. It's a hand held out.

"You felt it too. At the meeting. I saw it — you felt the thing that holds those people together, and part of you wanted in, and I'm not going to pretend I didn't want that for you. Because here's the truth nobody says: it's *better* inside. Whatever's out there in those woods, whatever reached for me — inside, you're not alone with it. We survive it *together.* That's the only way anyone survives it at all." He grips your arm. "Come with me. All the way in. Don't do what I did and spend thirty years half-out and terrified. Be all the way in, with me, and we'll be okay."`,
    choices: [
      {
        label: `"Okay, Doug. All the way in. Together."`,
        diamondCoord: { sanction: 0, vertical: 0.7 },
        outcome: { setFlags: { doug_embraced: true }, queueEvent: "ux_doug_break_linger" },
      },
      {
        label: `"I felt it, Doug. And it scared me. I can't follow you in — and I don't think being in is surviving. I think it's the cage telling you it's a home."`,
        diamondCoord: { sanction: 0, vertical: -0.6 },
        outcome: { setFlags: { doug_refused: true }, queueEvent: "ux_doug_break_reclaimed" },
      },
    ],
  },

  // -- the plea, refuse-lean: a warning against his own interest -------------------------------------
  ux_doug_break_refuse_route: {
    id: "ux_doug_break_refuse_route",
    condition: { kind: "flag", flag: "doug_meeting_refused" },
    title: "A Warning Against Himself",
    body:
`Because you pulled back at the meeting, Doug's plea is a warning he's giving against his own interest.

"You saw it for what it is. At the meeting — you saw, and you got out, and I was almost *angry* at you for it, and I've spent every day since wishing I'd had your — whatever it is. Your spine." He shakes his head. "Don't come back toward this. Don't let me pull you in, no matter how gentle I make it sound, no matter how much I dress it up as family. Get *out.* Be the one who got out." His voice cracks. "And — God, I shouldn't even ask this — but is there a way out for me? Is there? Because I don't think there is, and I need someone who isn't lying to me to tell me the truth."`,
    choices: [
      {
        label: `"There's a way out, Doug. We'll find it. I'm not leaving you in this. Let me help you."`,
        diamondCoord: { sanction: 0, vertical: -0.6 },
        outcome: { setFlags: { doug_refused: true, tried_to_save_doug: true }, queueEvent: "ux_doug_break_reclaimed" },
      },
      {
        label: `"…I don't know, Doug. I don't think I can pull you out. But I'm here, and I'm not going to lie to you, and I'm not going in after you."`,
        diamondCoord: { sanction: 0, vertical: -0.6 },
        outcome: { setFlags: { doug_refused: true, doug_held_line: true }, queueEvent: "ux_doug_break_reclaimed" },
      },
    ],
  },

  // -- the plea, open: both roads laid down -----------------------------------------------------------
  ux_doug_break_open_route: {
    id: "ux_doug_break_open_route",
    condition: { kind: "flag", flag: "doug_meeting_open" },
    title: "Both Roads",
    body:
`Because you gave nothing away at the meeting, Doug doesn't know which way you'll fall, and neither do you, and he lays both roads in front of you because he's too tired to choose for you.

"I don't know what you want. You played it so close at the meeting I couldn't read you, and honestly it's the first time in years anyone's surprised me." A long breath. "So I'll just say it plain, both halves. There's a way in — with me, into the family, and it's warm and it's real and you'd never be alone with this again. And there's a way out — the door you're still standing in, that I gave up thirty years ago. I can't tell you which one saves you. I've been wrong about that my whole life. But I'm done deciding it *for* people. So you decide."`,
    choices: [
      {
        label: `"In. With you. I don't want to be alone with this either."`,
        diamondCoord: { sanction: 0, vertical: 0.7 },
        outcome: { setFlags: { doug_embraced: true }, queueEvent: "ux_doug_break_linger" },
      },
      {
        label: `"Out. And I want you to come out with me, Doug, if there's any way at all."`,
        diamondCoord: { sanction: 0, vertical: -0.6 },
        outcome: { setFlags: { doug_refused: true, tried_to_save_doug: true }, queueEvent: "ux_doug_break_reclaimed" },
      },
    ],
  },

  // -- [embrace] he stays, and it costs you --------------------------------------------------------------
  ux_doug_break_linger: {
    id: "ux_doug_break_linger",
    title: "Not Alone Anymore",
    body:
`He exhales like a man setting down something he's carried for thirty years. "Okay," he says. "Okay. Together." And he holds onto you in the dark truck and for a moment it's just Doug, your Doug, not alone anymore.

And in the weeks after, Doug is *there* — steady, warm, present, the same fifty-something who's had your back since you were nineteen. Nothing overtly changes. He still picks you up at six. And you can't name the day you noticed that you'd started moving a little more like the room at the meeting moved, that the two of you finish each other's sentences now, that something in you has gone quiet and easy and certain in a way it never was before. You have a fellow-traveler. You are no longer entirely alone with this.

You'll never be sure what that cost, or that it was a cost at all. That's the part you can't get back — not the changing, but the not-knowing whether you changed.`,
    choices: [
      {
        label: `Go home in the grey almost-morning.`,
        outcome: { setFlags: { doug_break_done: true, doug_lingering: true } },
      },
    ],
  },

  // -- [refuse] you lose him either way --------------------------------------------------------------------
  ux_doug_break_reclaimed: {
    id: "ux_doug_break_reclaimed",
    title: "The Mail Piles Up",
    // The tried-to-save variant replaces the base (the crueler one, by design);
    // both continue into the same disappearance.
    body:
`He nods, slow, at the truth of it. "Yeah," he says. "Yeah. I didn't think so either. I just needed to hear it from someone who wasn't selling me something." He drops you home in the grey almost-morning, quiet, done. "Take care of yourself. Be the one who got out."

That's the last real conversation you have with Doug.

Because within the week Doug is *gone* — not dramatically, not a scene, just a house with the mail piling up and a phone that rings out and family who say, vaguely, untroubled, that he decided to go stay with people out of state, that it's good he's got the family looking after him, that he always seemed a little lost and it's nice he found his place. Everyone is very calm about it. Everyone has a reasonable thing to say. And you stand in it with the cold certain grief of a man who reached for the door — who was *reaching for it beside you* — and got pulled back through instead, and you will never be able to prove that's what happened, and you will never for one second believe it wasn't.`,
    bodyVariants: [
      {
        when: { kind: "flag", flag: "tried_to_save_doug" },
        text:
`"You'd try," he says, and something in his face breaks open — not hope, worse than hope, *gratitude*, that someone would try. "You'd actually try." He grips your hand. "Okay. Okay. Let me — let me get some things. Give me a few days. Don't call me, I'll call you." And he drops you home in the grey almost-morning, and he's lighter than you've seen him, because someone said *I won't leave you in this* and meant it.

You never hear from him again.

Because within the week Doug is *gone* — not dramatically, not a scene, just a house with the mail piling up and a phone that rings out and family who say, vaguely, untroubled, that he decided to go stay with people out of state, that it's good he's got the family looking after him, that he always seemed a little lost and it's nice he found his place. Everyone is very calm about it. Everyone has a reasonable thing to say. And you stand in it with the cold certain grief of a man who reached for the door — who was *reaching for it beside you* — and got pulled back through instead, and you will never be able to prove that's what happened, and you will never for one second believe it wasn't.`,
      },
    ],
    choices: [
      {
        label: `Carry it.`,
        outcome: { setFlags: { doug_break_done: true, doug_gone: true } },
      },
    ],
  },
};
