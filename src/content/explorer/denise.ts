// ============================================================================
// content/explorer/denise.ts — Denise: the One Who Was Sure (Loom's story
// pass, FIRST BUILD): Dale's mirror. Dale's thread arms the innocent-Dale
// reading; Denise's arms guilty-Dale — through a person as sympathetic and as
// unreliable as Dale is reliable. The felt-but-unprovable, doubled: did Dale
// do it (never said), and is her certainty knowledge or fear (never said).
//
// Non-exclusive with Dale by design (after the Marie split) — the drama is
// what the player does with two irreconcilable men.
//
// BUILD STATE per Loom ("the encounter in full, the two branches structured"):
// the pointer and the visit carry Loom's prose verbatim; the five downstream
// cards (close, crack, and the three pursuit beats) are ENGINE-SEAT
// PLACEHOLDERS built from Loom's own outline language — marked [PLACEHOLDER]
// below and in the edit log, to be replaced by Loom's branch pass. The
// disciplines are fixed regardless: the dignity guardrail (her blindness
// authored as lovingly as her conviction), percepts scrupulously two-faced,
// and the THRESHOLD CUT-OFF — the pursuit's terminal ends with the player at
// the end of Dale's road, conviction-voice, the act never shown.
//
// Cross-run: dale_suspected and went_after_dale join harvestFlags (index.ts).
// The dale_suspected × dale_bond collision ending waits for Loom's spec —
// deliberately NOT wired here (endings are authored, never placeholder).
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
  // -- the pursuit sub-thread (opens on dale_suspected; three beats, in order)
  {
    id: "ux_act_pursue_dig",
    name: "Look into Dale yourself",
    sub: "If it fits, there's evidence. Somebody just has to finally look.",
    cost: 1,
    requires: {
      kind: "all",
      of: [{ kind: "flag", flag: "dale_suspected" }, { kind: "noflag", flag: "case_built" }],
    },
    outcome: {
      log: "You start pulling at the town's oldest thread with both hands.",
      tone: "n",
      queueEvent: "ux_pursue_dig",
    },
  },
  {
    id: "ux_act_pursue_authorities",
    name: "Take it to the sheriff's office",
    sub: "You have a case now. Someone official should hear it.",
    cost: 1,
    requires: {
      kind: "all",
      of: [{ kind: "flag", flag: "case_built" }, { kind: "noflag", flag: "authorities_shrugged" }],
    },
    outcome: {
      log: "You put the folder together the way Nora would, and you drive it into town.",
      tone: "n",
      queueEvent: "ux_pursue_authorities",
    },
  },
  {
    id: "ux_act_pursue_drastic",
    name: "Drive out to Dale's road",
    sub: "Nobody else is ever going to do anything. That's the whole of it.",
    cost: 2,
    requires: {
      kind: "all",
      of: [{ kind: "flag", flag: "authorities_shrugged" }, { kind: "noflag", flag: "went_after_dale" }],
    },
    outcome: {
      log: "You drive out past the church, past where the houses thin, in the dark this time.",
      tone: "b",
      queueEvent: "ux_pursue_drastic",
    },
  },
];

export const deniseEvents: Record<string, GameEvent> = {
  // -- the other one who was there (pointer; Loom's prose) ---------------------------
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

  // -- her kitchen, her certainty (Loom's prose) ----------------------------------------
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

  // -- [PLACEHOLDER — Loom's branch pass replaces this body] the leaving ------------------
  ux_denise_close: {
    id: "ux_denise_close",
    title: "The Tidy House",
    body:
`You leave her at her kitchen table with everything in its place, and drive back with the story she gave you riding in the car like a passenger. It holds together the whole way home. That's the thing about it. It holds together, and it fits, and you can't find the join — and you know one man at the end of a dead-end road whose account holds together exactly as well, and there is no version of this county where both of them are telling you the whole of it.`,
    choices: [
      {
        label: `Drive home with it.`,
        outcome: { setFlags: { denise_met: true } },
      },
    ],
  },

  // -- [PLACEHOLDER — Loom's branch pass replaces this body] what's under the certainty ----
  // The fear-admission, per Loom's outline: she doesn't know, she was fourteen,
  // everyone needed it to be someone — and if it wasn't Dale, then the thing
  // that took her best friend was never caught and is out there still. Does
  // NOT exonerate Dale; reveals only that her certainty was never knowledge.
  ux_denise_crack: {
    id: "ux_denise_crack",
    title: "What's Under the Certainty",
    body:
`It comes apart quietly, which is the only way a forty-year-old thing comes apart.

She doesn't know. She never knew. She was fourteen, and her best friend was gone, and the whole town needed it to be someone — and Dale was the someone, and she led the charge, and she has led it every day since. And pushed on the one verb she never says, she finally says the other thing, the thing under all of it, so quiet you almost miss it: that if it was Dale, then it was over. A bad man, a solved thing. And if it wasn't Dale — she stops there. She has never once finished that sentence out loud, and she doesn't finish it now, and the unfinished half of it sits in the kitchen with you, out there, uncaught, still, the whole time she has been living her small careful life twenty minutes from those trees.`,
    choices: [
      {
        label: `"It's all right, Denise. You were fourteen. Everybody needed it to be somebody."`,
        outcome: {
          log: "You let her off it, the kind thing, and she takes it the way a tired person takes a chair. Nothing is resolved. Dale is exactly as guilty and exactly as innocent as he was an hour ago. But a forty-year weight shifted in front of you, and you were the one she set it down for.",
          tone: "n",
          setFlags: { denise_broke: true, denise_met: true },
        },
      },
      {
        label: `Say nothing. Let the unfinished sentence sit.`,
        outcome: {
          log: "You hold her in it, and it's cruel, and it's the truth, and the kitchen stays quiet until she stands and starts washing a cup that was already clean. You see yourself out. Nothing is resolved — not Dale, not her, not the sentence she'll go back to never finishing.",
          tone: "b",
          setFlags: { denise_broke: true, denise_met: true },
        },
      },
    ],
  },

  // -- [PLACEHOLDER — Loom's branch pass replaces this body] the dig ------------------------
  // Every item two-faced by discipline: isolation or a man left alone; last to
  // see her or simple fact; strange stories or a hounded man's shadow.
  ux_pursue_dig: {
    id: "ux_pursue_dig",
    title: "The Case You Came to Assemble",
    body:
`What you find is circumstantial, and it is damning if you want it to be, and you notice that you want it to be.

He lives alone at the end of a dead-end road — isolation, or a man a town left alone. He was the last to see her — guilt, or the plain fact of who walked into the woods that night. And there are decades of small strange stories, the kind that accrete around any man a town has decided about — a strange man, or a hounded one, and every single item reads both ways, and you stack them anyway, because a case is a thing you build out of the direction you were already facing.`,
    choices: [
      {
        label: `Write it all down.`,
        outcome: {
          log: "By the end of the week you have a folder. It would convince anyone who already agreed with it.",
          tone: "n",
          setFlags: { case_built: true },
        },
      },
    ],
  },

  // -- [PLACEHOLDER — Loom's branch pass replaces this body] the shrug -----------------------
  ux_pursue_authorities: {
    id: "ux_pursue_authorities",
    title: "Bring Me Something Real",
    body:
`The deputy is polite, and young enough that the name Ellen Fields means nothing to him until an older man at the back desk goes still.

They hear you out. That's the worst part — they hear you all the way out, and nothing you have survives the hearing: forty years gone, no body, no witness but a story about the dark, nothing a court would touch, a folder of things that read two ways. "Bring me something real," the older one says, not unkindly, which is somehow worse. And you stand in the parking lot afterward holding a case that convinces no one but you, in a county where the system has already told you, twice — forty years apart — that nothing is going to be done.`,
    choices: [
      {
        label: `Take the folder home.`,
        outcome: {
          log: "Nobody is going to do anything. You drive home knowing it the way you know the weather, and the knowing doesn't sit still.",
          tone: "b",
          setFlags: { authorities_shrugged: true },
        },
      },
    ],
  },

  // -- [PLACEHOLDER — Loom's branch pass replaces this body] the threshold --------------------
  // THE CUT-OFF IS THE DISCIPLINE (ruled three times over — craft, anti-noun,
  // responsibility): the run ends with the player at the end of Dale's road,
  // conviction-voice, the act never shown. Whatever Loom's prose becomes, the
  // camera stops here.
  ux_pursue_drastic: {
    id: "ux_pursue_drastic",
    once: "pursue_drastic_seen",
    title: "The End of His Road",
    body:
`The porch light is on. It's always on. You know that now — you know his hours, his truck, the nights he sits out; that's what the watching was for, and you tell yourself the watching was for Ellen.

The run ends here.

Not with what happens next — with you, parked in the dark at the end of a dead-end road, outside the house of a man who has spent forty years being come for, being at last the thing that came. You are certain. You have never been more certain of anything, and no one on this earth agrees with you but a woman with her hands held down on a kitchen table, and there is no way left to know — none, ever — whether you are the only person who ever did anything, or the worst thing that ever happened to an innocent man. You get out of the truck.

That's where it stops.`,
    choices: [
      {
        label: `Get out of the truck.`,
        outcome: { setFlags: { went_after_dale: true } },
      },
    ],
  },
};
