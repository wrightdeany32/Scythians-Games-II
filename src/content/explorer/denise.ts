// ============================================================================
// content/explorer/denise.ts — Denise: the One Who Was Sure (Loom's story
// pass + the 2026-07-09 branch pass, wired to full prose): Dale's mirror.
// Dale's thread arms the innocent-Dale reading; Denise's arms guilty-Dale —
// through a person as sympathetic and as unreliable as Dale is reliable. The
// felt-but-unprovable, doubled: did Dale do it (never said), and is her
// certainty knowledge or fear (never said).
//
// The disciplines, held per the round's rulings:
//   · The dignity guardrail — her blindness authored as tenderly as her
//     conviction; she is never the game's tool to smear its kindest man.
//   · Double all the way — every pursuit percept reads two ways; the game
//     never adjudicates Dale (the dig's parentheticals are body prose, the
//     two readings in one breath).
//   · The threshold cut-off — the pursuit's terminal (`run_end_pursuit`)
//     ends at the open car door, conviction-voice, the act never shown.
//   · No-meta-reveal — the cross-run collision surfaces as nameless feeling
//     (a harvest-gated bodyExtra on the Dale-porch host in dale.ts), never
//     confirmed.
//
// Wiring shape: the pursuit is a chain of CHOSEN escalations — one lead
// action on `dale_suspected`; each beat ends on commit-or-stop; commits queue
// the next beat, stops resolve to the loop and drop the lead. `went_after_dale`
// and `dale_suspected` ride tuning.crossRun.harvestFlags; the pursuit events
// ride deferForScheduled so the calendar can't guillotine a mid-flight turn.
// ============================================================================

import type { Door, GameEvent, LocationAction } from "../../engine/types";

export const deniseDoors: Door[] = [
  // The pointer surfaces once the player is pulling on the Ellen thread; its
  // once-flag IS pointed_to_denise, so the door self-retires.
  { eventId: "ux_denise_pointer", when: { kind: "flag", flag: "marie_episode_done" } },
];

export const deniseActions: LocationAction[] = [
  {
    id: "ux_act_denise_visit",
    name: "Go see Denise",
    sub: "The other one who was there. North side of the county. She'll talk.",
    cost: 1,
    requires: {
      kind: "all",
      of: [{ kind: "flag", flag: "pointed_to_denise" }, { kind: "noflag", flag: "denise_met" }],
    },
    outcome: {
      log: "You drive out to the north side, to the tidy house of the woman who has spent forty years being sure.",
      tone: "n",
      queueEvent: "ux_denise_visit",
    },
  },
  // The pursuit lead — the antagonist-turn's one entry, chosen. The stops
  // inside the chain set pursuit_dropped, which retires this for good.
  {
    id: "ux_act_pursue_dig",
    name: "Look into Dale yourself",
    sub: "If it fits, there's evidence. Somebody just has to finally look.",
    cost: 1,
    requires: {
      kind: "all",
      of: [
        { kind: "flag", flag: "dale_suspected" },
        { kind: "noflag", flag: "case_built" },
        { kind: "noflag", flag: "pursuit_dropped" },
      ],
    },
    outcome: {
      log: "You start looking, the way a person looks when they've already decided what they'll find.",
      tone: "n",
      queueEvent: "ux_pursue_dig",
    },
  },
];

export const deniseEvents: Record<string, GameEvent> = {
  // -- the other one who was there (pointer) ------------------------------------------
  ux_denise_pointer: {
    id: "ux_denise_pointer",
    once: "pointed_to_denise",
    title: "The Other One Who Was There",
    body:
`You hear about her the way you hear everything out here — sideways, from someone who isn't quite gossiping. There was another one, back then. A girl, Ellen's age, thick as thieves with her before it happened — and the one who, after, would not stop saying it was Dale. Not a rumor she passed along; the *source* of it, near enough. Denise. She's still in the county, out on the north side. Keeps to herself now, mostly, but she'll talk about that summer to anyone who asks — some people you can't shut up about the worst thing that ever happened to them, because the talking is the only thing holding the shape of it together.`,
    choices: [
      {
        label: `File the name away.`,
        outcome: {},
      },
    ],
  },

  // -- her kitchen, her certainty ---------------------------------------------------------
  ux_denise_visit: {
    id: "ux_denise_visit",
    title: "Her Kitchen, Her Certainty",
    body:
`Denise's house is tidy in the aggressive way of a person who has decided that if she keeps everything in its place, things will stay in their place.

She doesn't make you work for it. You barely get the reason for your visit out before she's talking, like she's been waiting for you, like she's been waiting for forty years for one more person to come and let her say it again.

"I knew Ellen better than anyone. Better than her own mother, at the end — that age, you tell your friends what you don't tell your mother." Her hands are folded on the table and they don't move. "And I knew Dale. Everybody knew Dale, and everybody knew there was something *off* in that boy — quiet, always watching, always where he wasn't supposed to be. He used to follow us. Ellen thought it was sweet. I didn't." She holds your eye. "And then one night she goes into those woods with him, just the two of them, and she never comes out, and he comes out screaming a story about something in the dark that not one soul could make sense of. You tell me. You're a reasonable person. You tell me what happened that night."

It is, you notice, airtight. It is exactly the story the whole town settled into, and it fits, and a jury of anybody's peers would have looked at a quiet strange boy and a dead girl and a tale about a monster and known just what to think. She lays it out clean and certain and it lands, and for a moment you are sure, the way she is sure.

And then — maybe — you notice her hands. Folded, white at the knuckle, dead still on the table the entire time, like she's holding them down. And you notice that she has told you what Dale *is* and what the town *thought* and what any reasonable person *would* conclude, and that in all of it she has not once said the thing you'd expect a certain person to lead with, which is *I saw him do it,* or *I know,* plain, the way Dale says *I know what I saw.* She says it fits. She says it makes sense. She never once says she knows.`,
    choices: [
      {
        label: `"You're right. It fits. It's the only thing that fits."`,
        lensFlavor: "skeptic",
        outcome: {
          log: "And saying it out loud, you feel the click of it, the awful relief of a thing explained — a bad man, a solved thing, a world that makes sense. She nods, slow, like you've confirmed something for her too, and neither of you says that what you've really done is agree to stop looking.",
          tone: "n",
          setFlags: { dale_suspected: true },
          queueEvent: "ux_denise_close",
        },
      },
      {
        label: `"You keep saying it fits. You haven't said you know."`,
        lensFlavor: "skeptic",
        outcome: {
          log: "Her hands come apart on the table, just slightly, and something crosses her face that is not anger — it's the look of a person who has stepped somewhere they've spent forty years not stepping. 'Don't,' she says, quiet. 'Don't do that. I know what I know.' But she has said the wrong verb and you both heard it, and the kitchen is very quiet.",
          tone: "n",
          setFlags: { denise_doubted: true },
          queueEvent: "ux_denise_crack",
        },
      },
      {
        label: `"I don't know what happened. I don't think you do either."`,
        outcome: {
          log: "She looks at you a long moment. 'No,' she says, finally — not agreeing, refusing. 'No, I'm not going to do that with you.' And she stands, and thanks you for coming in a voice that means it's time to go, and you leave her with her clean kitchen and her folded hands and the shape she has held so long it's the only shape she has left.",
          tone: "n",
          queueEvent: "ux_denise_close",
        },
      },
    ],
  },

  // -- letting yourself out --------------------------------------------------------------
  ux_denise_close: {
    id: "ux_denise_close",
    title: "Letting Yourself Out",
    body:
`You let yourself out. The house is very quiet and very clean, every surface holding its place against a world that took her friend and never gave a reason, and at the table Denise sits exactly where she sat, hands folded, having said the thing she comes to the edge of this county to keep saying. Whatever you walked in believing, you walk out carrying it heavier. Behind you, through the window, she hasn't moved.`,
    bodyExtras: [
      {
        when: { kind: "flag", flag: "dale_suspected" },
        text:
`The case is already assembling itself as you drive — the isolation, the last-to-see, the years of small wrong stories, sliding into an order that has a shape. You could look into it. You could actually look into it, and the fact that you're already deciding how tells you something about yourself you don't examine.`,
      },
    ],
    choices: [
      {
        label: `Drive home with it.`,
        outcome: { setFlags: { denise_met: true } },
      },
    ],
  },

  // -- what the certainty was holding down --------------------------------------------------
  ux_denise_crack: {
    id: "ux_denise_crack",
    title: "What the Certainty Was Holding Down",
    body:
`Her hands come apart on the table, and she looks at them like they belong to someone else.

"I was fourteen." She says it to the middle distance, quiet. "You want to know what I saw. I'll tell you what I saw. I saw a girl I loved not come home. I saw a whole town of scared grown-ups looking for a reason, and I saw them land on the strange quiet boy who was the last one with her. And I gave them the reason. I told them the things he did — the following, the watching — and some of it was true and some of it was a scared child making a monster out of a boy who was probably just as scared as I was." She stops. Starts again. "I have known that for forty years. And I have never once said it out loud until right now, to a stranger, in my kitchen."

She isn't crying. It's worse than crying. It's the flat voice of a weight set down that's been carried so long the arms don't know what to do empty.

"You want to know why I never took it back." She finally lifts her eyes to you. "Because if it was Dale, then it's *over*. A bad man did a bad thing, and the bad man has a name, and you can lock your door against a man. But if it wasn't Dale —" and here her voice does the one thing it hasn't done the whole time, which is shake — "if it wasn't Dale, then the thing that reached into a summer evening and took Ellen out of the world was never a man at all. And it was never caught. And it is *still out there*, and it has been out there every single night of the small ordinary life I built twenty minutes down the road from those trees. Dale being guilty is the only thing that has ever let me sleep. So I keep him guilty. God help me. I keep him guilty, because the alternative is that I was never safe, and neither is anyone, and I could not live inside that and get up in the morning."

The kitchen is quiet enough now to hear the clock.`,
    choices: [
      {
        label: `"You were a child. You were terrified. No one could have blamed you."`,
        outcome: {
          log: "She takes the mercy, and something in her face loosens that has not loosened in forty years — a held breath going out of her all at once. You understand you've given her the only absolution she was ever going to get. It changes nothing about Ellen. It changes nothing about Dale. It was still worth giving.",
          tone: "g",
          setFlags: { denise_broke: true, denise_met: true },
        },
      },
      {
        label: `"Then you have to take it back. You have to tell someone the truth."`,
        outcome: {
          log: "She flinches like you struck her. 'Take it back. To who — to Dale, who's spent sixty years alone because of me? To Ellen?' She can't finish that one. 'You think there's a version where I'm brave and it fixes something. There isn't. There's an old woman who was a frightened girl, and a man who paid for it, and a thing in the woods that never cared either way.' She's right. You know she's right. You have made an old woman say the truest thing she owns, and it has helped no one at all.",
          tone: "b",
          setFlags: { denise_broke: true, denise_met: true },
        },
      },
    ],
  },

  // -- the case that cuts both ways ------------------------------------------------------------
  ux_pursue_dig: {
    id: "ux_pursue_dig",
    title: "The Case That Cuts Both Ways",
    body:
`You start looking, the way a person looks when they've already decided what they'll find. And you find it. That's the thing — you find it *everywhere.*

Dale lives alone at the end of a road that goes nowhere else, a house you have to *mean* to drive to. *(A man with something to hide, tucked where no one wanders past. Or a man a town drove to its farthest edge and left there.)* He was the last to see Ellen alive; it's right there in the old paper everyone's read. *(The last to see her because he did it. Or the last to see her because he was simply there, and has carried being-there for forty years.)* And the stories, once you go looking, are a deep well — a strange kid, a watcher, a boy who knew those woods too well, a man who talks to no one, who once, someone's cousin swears, said something *off* at a gas station in '94. *(A pattern of wrongness reaching back to childhood. Or a lifetime of a hounded man behaving exactly like a hounded man behaves.)*

Every single thing you turn up is a knife that cuts both ways — and you notice, you can't help noticing, that you only ever pick it up by the edge that points at him. You have built a case. It would convince anyone who already believed. It is made, top to bottom, of things that are also completely innocent.`,
    choices: [
      {
        label: `"It's enough. I know what I'm looking at."`,
        outcome: {
          log: "You close the folder you've started keeping — you've started keeping a folder — and you don't let yourself finish the thought about what kind of person keeps one.",
          tone: "b",
          setFlags: { case_built: true },
          queueEvent: "ux_pursue_authorities",
        },
      },
      {
        label: `"…none of this is anything. He's just a lonely old man."`,
        outcome: {
          log: "You see it, all at once, for what it is — a scared girl's story wearing a grown man's evidence — and you close the folder and don't open it again. You don't drive out to Dale's, either. You've done enough to him for one lifetime, and you weren't even alive for most of it.",
          tone: "g",
          setFlags: { denise_doubted: true, pursuit_dropped: true },
        },
      },
    ],
  },

  // -- the system's kind refusal -----------------------------------------------------------------
  ux_pursue_authorities: {
    id: "ux_pursue_authorities",
    title: "The System's Kind Refusal",
    body:
`You take it to someone with a badge, because that's the *right* way — the sane way, the way that isn't one man alone deciding another man's guilt.

They're kind about it, which is nearly the worst part. They listen. They take the folder. They even seem to care a little. And then they explain the world as it actually is: forty years gone, no body, no scene, no evidence that isn't a rumor carrying a rumor's weight, a witness who was a child and is now an old woman and who — they check — never actually claimed to *see* anything. There is nothing here. There was never going to be anything here. "You get me something real," they say, not unkindly, handing the folder back, "come see me." They will not be going to see Dale.

And you stand in the lot with your folder and feel the exact vertigo the whole apparatus has just handed you: it will not act — and it has just told you, without meaning to, that if anything is ever going to happen to Dale, *you* are the only one who will make it happen.`,
    choices: [
      {
        label: `"They're right. Let it go."`,
        outcome: {
          log: "You put the folder in the trunk and drive home and let the engine of it wind down. It's the sane choice and the right one, and some nights you'll wonder — but you let it go, and Dale grows old at the end of his road unbothered by you, which is close to the most anyone's given him in forty years.",
          tone: "g",
          setFlags: { pursuit_dropped: true },
        },
      },
      {
        label: `"Then it's on me."`,
        outcome: {
          log: "You take the folder back out of the trunk. You don't have a plan. You have a certainty, a dead-end road, and the terrible clarity of a person who has decided a thing must happen and that no one else will make it.",
          tone: "b",
          setFlags: { authorities_shrugged: true },
          queueEvent: "ux_pursue_drastic",
        },
      },
    ],
  },

  // -- the end of the road (terminal: the threshold cut-off) ----------------------------------------
  ux_pursue_drastic: {
    id: "ux_pursue_drastic",
    once: "pursue_drastic_seen",
    title: "The End of His Road",
    body:
`You drive to the end of the road.

You've been to Dale's house in your head so many times that the real one is smaller, plainer — a porch light, a truck older than yours, a window with a lamp behind it because a man is home, alone, on an ordinary evening, the way he has been every evening for forty years. You sit at the mouth of his drive with the folder on the seat and your hands on the wheel and the thing you've decided sitting in you like a swallowed stone.

You think about Ellen, who you never met, who is the reason and has somehow stopped being the reason — this isn't about Ellen anymore and you know it and you make yourself not know it. You think about Denise's folded hands. You think about how *sure* you are. You have never been this sure of anything in your life, and some cold small voice far at the back of you says *that is not the same as being right*, and for one long moment your hand is on the key turned halfway back and the engine ticking down.

The porch light is on. The lamp is on. A man is inside, alone, who is either the thing that reached into the dark and took a child out of the world, or the loneliest innocent in this county — and you cannot tell which, and you have decided anyway.`,
    choices: [
      // The threshold cut-off (unanimous ruling): the pick IS the last line;
      // the scene — and the run — ends before certainty becomes deed.
      {
        label: `Open the car door.`,
        outcome: { setFlags: { run_end_pursuit: true, went_after_dale: true } },
      },
    ],
  },
};
