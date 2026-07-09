// ============================================================================
// content/explorer/whitesreturn.ts — the Return to White's Hall (Loom's story
// pass, wired): the scene the whole cave arc points at, and the run's cut-off.
// A queue-chained scene entered from the daily loop — NEW content; nothing
// here touches the frozen cave baseline.
//
// The charge gate: everything keys off `took_shard` — since the 2026-07-09
// reframe, "the player RECORDED the symbol" (the copy, not a pocketed stone);
// the charged erased-beat is the COPY-MISMATCH (the fourth ripple), and the
// bodyVariants carry the milder not-copied register. Choreography (Azimuth,
// Loom): the player's own evidence fails at the erased beat FIRST, then the
// illegible mark resolves — "my proof is wrong" before "I can read what I
// couldn't." Grip gates two things and only two — the illegible-mark insert
// fires at grip <= 3 (the ratified hard gate), and the deep descent's FLAVOR
// is band-select (bandText, three registers, adjacent leak per Contract 2).
// No diamondCoord gate anywhere; introspective leans carry attune only.
// (cave-b4's stay-and-copy retext lands the cave-side half of the reframe in
// the same PR, per Armature's lands-together sequencing rule.)
//
// Every branch queues a terminal. The terminal is the authored flag
// `run_end_whites_return` — not a lost-grip death. Conviction-voice holds at
// the cut-off: unprovable certainty, never narrator-fact about the entity.
// ============================================================================

import type { GameEvent, LocationAction } from "../../engine/types";

export const returnActions: LocationAction[] = [
  {
    id: "ux_act_return_whites",
    name: "Go back to White's Hall",
    sub: "Neither of you has said out loud that you can't stop thinking about it.",
    cost: 3,   // a full day, like the first trip
    requires: {
      kind: "all",
      of: [
        { kind: "flag", flag: "cave_done" },
        {
          kind: "any",
          of: [
            { kind: "flag", flag: "took_shard" },
            { kind: "flag", flag: "cave_etchings_seen" },
            { kind: "flag", flag: "etchings_link_nora" },
            { kind: "flag", flag: "cave_heard_voice" },
          ],
        },
        { kind: "noflag", flag: "run_end_whites_return" },
      ],
    },
    outcome: {
      log: "You call Reese. He says no, and then he says when, which is how Reese says yes.",
      tone: "n",
      setFlags: { return_started: true },
      queueEvent: "ux_return_enter",
    },
  },
];

export const returnEvents: Record<string, GameEvent> = {
  // -- the mouth, again -------------------------------------------------------------
  ux_return_enter: {
    id: "ux_return_enter",
    title: "The Mouth, Again",
    body:
`The gravel lot is the same gravel lot. Same lean of the same trees, same cold coming up out of the dark like the hill is breathing on you. Reese kills the engine and doesn't get out.

"I want it on the record," he says, "that this was your idea."

It was. You don't say so; he knows.

The mouth of White's Hall is where you left it, a black seam in the rock the size of a coffin stood on end. You've been here once. You know the way down. That's the part that should make this easier, and doesn't.`,
    choices: [
      {
        label: `"Let's just get it done."`,
        outcome: { setFlags: { return_committed: true }, queueEvent: "ux_return_descend" },
      },
      {
        label: `"…I don't know why I wanted to come back."`,
        attune: 0.25,
        outcome: {
          log: "You say it to the windshield. Reese doesn't answer, which is answer enough.",
          tone: "n",
          queueEvent: "ux_return_descend",
        },
      },
      {
        label: `"It's a hole in the ground. That's all it is."`,
        attune: -0.25,
        outcome: {
          log: "You say it like a man locking a door. It helps about as much as that ever does.",
          tone: "n",
          queueEvent: "ux_return_descend",
        },
      },
    ],
  },

  // -- the familiar way, wrong -----------------------------------------------------------
  ux_return_descend: {
    id: "ux_return_descend",
    title: "The Familiar Way, Wrong",
    body:
`The squeeze you fought through the first time takes you first try. You tell yourself you've done it once, your body remembers the shape of it. That's probably true.

The passage runs the way it ran before — the same low ceiling, the same place it opens out. Reese's lamp finds the walls and the walls are where they were. Nothing has moved. Nothing is different.

You just can't shake the feeling that you're being shown the way, rather than finding it.`,
    choices: [
      {
        label: `"Keep going."`,
        outcome: { queueEvent: "ux_return_erased" },
      },
      {
        label: `"Slow down. Look at everything."`,
        outcome: {
          log: "You go slow. It doesn't make you feel more in control; it just gives the dark more time to be looked at.",
          tone: "n",
          setFlags: { return_careful: true },
          queueEvent: "ux_return_erased",
        },
      },
    ],
  },

  // -- your own record won't hold (the fourth ripple: the copy-mismatch replaces
  // the healed scar that record-don't-pocket made impossible; Reese's ratified
  // silence lands here, better motivated — he watched you make the copy) -----------
  ux_return_erased: {
    id: "ux_return_erased",
    title: "Your Own Record Won't Hold",
    // Base body = the shard-charged version (primary); the variant carries the
    // milder displaced register for the run that left the copy unmade.
    body:
`You come to the chamber. The wide one, where the marks are.

You go to the wall where you copied it — you remember the spot, low and left, the sideways numerals and the ellipse that wouldn't close. You take the page out of your pack, the soft-folded page you've looked at a hundred nights, the marks you could draw with your eyes shut by now. You hold it up against the wall to check it against the thing itself.

It doesn't match.

Not by much. But the ellipse on the wall *closes*, and the one on your page doesn't. There's a mark on the wall your page doesn't have — one stroke, off to the side, small and deliberate. And the sideways numerals lean the other way. You copied this. You crouched here in the cold with the light in your teeth and you copied it *line for line* — you would put your life on line for line — and you are holding your copy up against the wall and they are not the same thing, and there is no way on this earth to know which of them changed: the wall, or the page, or your hand that night, or every night since that you took it out and looked at it and told yourself you had it by heart.

"Reese." You hear your own voice do something you don't like. "This is wrong. Look at it. I *copied* this — you were right there."

And Reese was right there. He crouched next to you with his lamp while you drew it, close enough to complain about the cold the whole time. He can't tell you that you misremembered the spot. He watched you get it right. He looks at the wall, and at the page shaking in your hand, and at the gap between them that has no name, and he opens his mouth.

Nothing comes out.`,
    bodyVariants: [
      {
        when: { kind: "noflag", flag: "took_shard" },
        text:
`You come to the chamber. The wide one, where the marks are.

You go to look for your bootprints from the last time, in the silt near the wall. There aren't any. Not scuffed, not swept — *absent*, the silt lying smooth and undisturbed, as though no one has ever crossed this floor. You know you crossed it. You were here.

Reese says the water must move through, must settle the floor flat between visits. It's the kind of thing that's probably true. He says it a little too quickly, and doesn't say anything after it.`,
      },
    ],
    choices: [
      {
        label: `"We should go."`,
        outcome: {
          log: "You say it, and neither of you moves toward the way out.",
          tone: "n",
          queueEvents: ["ux_return_illegible", "ux_return_fork"],
        },
      },
      {
        label: `"There's more of it deeper. I want to see."`,
        outcome: {
          setFlags: { return_pushing: true },
          queueEvents: ["ux_return_illegible", "ux_return_fork"],
        },
      },
    ],
  },

  // -- the thing you couldn't read (conditional insert: the ratified hard grip gate) -----------
  ux_return_illegible: {
    id: "ux_return_illegible",
    condition: { kind: "stat", stat: "grip", op: "<=", value: 3 },
    title: "The Thing You Couldn't Read",
    body:
`On the far wall is the mark you couldn't look at, the first time — the one your eye kept sliding off of, the one that came up as nothing you could hold in your head.

You can hold it now.

It doesn't resolve into a letter, or a picture, or a word. It resolves into a *direction* — the way it wants to be read, the way the lines lie down and point, and following them with your eyes is like the moment your foot finds the next stair in the dark without your telling it to. You understand the shape the way you understand which way is down.

You don't understand anything else about it. You just know, now, which way it always pointed.`,
    choices: [
      // The fork is already next in the queue — these choices queue nothing.
      {
        label: `Look away.`,
        outcome: { setFlags: { return_readmark: true } },
      },
      {
        label: `"…how did I ever miss this?"`,
        attune: 0.25,
        outcome: { setFlags: { return_readmark: true } },
      },
    ],
  },

  // -- deeper, or out ------------------------------------------------------------------------------
  ux_return_fork: {
    id: "ux_return_fork",
    title: "Deeper, or Out",
    body:
`The way you came is behind you. The chamber narrows, at the back, into a throat you didn't go down the first time — you turned around here, before, and told yourself you'd seen enough.

You could turn around again.`,
    choices: [
      {
        label: `"Go down."`,
        outcome: { setFlags: { return_went_deep: true }, queueEvent: "ux_return_deep" },
      },
      {
        label: `"That's enough. Out."`,
        outcome: { setFlags: { return_turned_back: true }, queueEvent: "ux_return_carseat" },
      },
    ],
  },

  // -- down the throat (band-select: the descent register) -------------------------------------------
  ux_return_deep: {
    id: "ux_return_deep",
    title: "Down the Throat",
    // Fallback body = the grounded register (never reached while all three
    // bands are authored; kept as the convention's safety net).
    body:
`You go down, and the throat fights you the way rock fights meat, and you come out the bottom scraped and breathing hard and *certain*, in the animal part of you, that you should not be here. You come anyway. Reese comes because you came.

The passage bottoms out in a space too regular to be a cave and too rough to be a room. Your lamp doesn't reach the far side.

Something is on the floor, at the edge of the light. Small. Pale. Waiting to be looked at.`,
    bandText: {
      grounded:
`You go down, and the throat fights you the way rock fights meat, and you come out the bottom scraped and breathing hard and *certain*, in the animal part of you, that you should not be here. You come anyway. Reese comes because you came.

The passage bottoms out in a space too regular to be a cave and too rough to be a room. Your lamp doesn't reach the far side.

Something is on the floor, at the edge of the light. Small. Pale. Waiting to be looked at.`,
      worn:
`You go down, and the throat is just *work* — hard and close and mean — and you're already so tired that you neither fight it nor feel it let you through; you just endure it, one scrape at a time, the way you've endured everything these last weeks. You come out the bottom emptied. Reese comes out behind you, quiet, and neither of you says a word about how hard it wasn't and how easy it also wasn't. You're past that kind of talk.

The passage bottoms out in a space too regular to be a cave and too rough to be a room. Your lamp doesn't reach the far side.

Something is on the floor, at the edge of the light. Small. Pale. Waiting to be looked at.`,
      frayed:
`You go down, and the way is easy in a way it has no business being — the throat that should fight you lets you through, and you have the ugly thought that it's letting you through because you finally stopped bracing against it. You don't examine the thought. You follow the mark you can read now, and it takes you down, and Reese follows because the alternative is being alone up there.

The passage bottoms out in a space too regular to be a cave and too rough to be a room. Your lamp doesn't reach the far side.

Something is on the floor, at the edge of the light. Small. Pale. Waiting to be looked at.`,
    },
    choices: [
      {
        label: `Go to it.`,
        outcome: { queueEvent: "ux_return_knife_deep" },
      },
    ],
  },

  // -- the knife ------------------------------------------------------------------------------------------
  ux_return_knife_deep: {
    id: "ux_return_knife_deep",
    title: "The Knife",
    body:
`It's a pocketknife.

Bone handle gone the color of old teeth, the brass pin at the pivot, the little chip out of the bolster where it got dropped on concrete once, forty years ago, by a man who's been dead for six.

Your grandfather's knife.

You haven't thought about this knife in years. You'd stopped looking for it so long ago you'd stopped *remembering* you ever had. It went missing when you were a kid, and you cried about it, and then you were nine and it was a year later and you never thought about it again.

It's here. On the floor of a cave you have been inside exactly twice. Yours. His.

Reese is looking at it too. You watch him need it to be a thing that has an explanation, watch him build one in real time, because the other option is standing in the dark with what's actually in front of him.

"You must've…" he starts. "You had it on you. Last time. It fell out of your pack, and —"`,
    bodyVariants: [
      {
        when: { kind: "noflag", flag: "took_shard" },
        text:
`It's a pocketknife, and it takes you a long, cold second to place it, and when you place it your stomach drops: it's *like* your grandfather's. The same make, the same bone handle. Not the chip in the bolster — you'd swear his had a chip — but close enough that you can't breathe for a moment, close enough that Reese's "so it's a knife, somebody lost a knife down here" lands and *almost* holds. Almost.`,
      },
    ],
    choices: [
      {
        label: `"I haven't thought about this knife in years."`,
        outcome: {
          log: "You sit with it, and the doubt lodges where you can't reach it.",
          tone: "n",
          queueEvent: "ux_return_end",
        },
      },
      {
        label: `Say nothing. You don't have words.`,
        outcome: {
          log: "The sight is more than you can hold, and you don't try. The dark takes your silence and keeps it.",
          tone: "b",
          stats: { grip: -1 },
          queueEvent: "ux_return_end",
        },
      },
      {
        label: `"You're right. It fell out of my pack."`,
        outcome: {
          log: "You take the reading he's holding out, and it steadies you, and something closes.",
          tone: "n",
          stats: { grip: 1 },
          setFlags: { denied_knife: true, lead_whites_cooled: true },
          queueEvent: "ux_return_end",
        },
      },
      {
        label: `"We weren't in this part of the cave, Reese. Neither of us has ever been down here."`,
        outcome: {
          log: "You say the thing he can't answer. He stops trying, and something in how he looks at you changes.",
          tone: "b",
          stats: { standing: -1 },
          setFlags: { held_truth: true, reese_strained: true },
          queueEvent: "ux_return_end",
        },
      },
    ],
  },

  // -- you did the sane thing --------------------------------------------------------------------------------
  ux_return_carseat: {
    id: "ux_return_carseat",
    title: "The Passenger Seat",
    body:
`You turn around. You go up the throat and back through the squeeze and out into the grey afternoon, and the relief of the daylight is so total it's almost funny, and Reese *does* laugh, the ugly one, the it's-over one, and you laugh with him and it's real.

You get in the truck. You reach to put your keys in, and your hand stops.

There's something on the passenger seat. Small. Pale.

Your grandfather's knife. Bone handle, the chip in the bolster, the whole of it, sitting on the cloth seat of a locked truck in an empty lot at the edge of the woods, forty years and six years of dead man's absence and it is *here*, and you never went deep enough to find anything, and it found you anyway.

Reese sees your face before he sees the knife. When he sees the knife he goes very still, and then he starts talking, fast, about how you must have set it there, must have had it, and you let him, because the two of you have to drive home and one of you has to be able to.`,
    bodyVariants: [
      {
        when: { kind: "noflag", flag: "took_shard" },
        text:
`You turn around. You go up the throat and back through the squeeze and out into the grey afternoon, and the relief of the daylight is so total it's almost funny, and Reese *does* laugh, the ugly one, the it's-over one, and you laugh with him and it's real.

You get in the truck. You reach to put your keys in, and your hand stops.

There's something on the passenger seat. Small. Pale.

A knife. Bone-handled, old, so like the one you lost as a child that the daylight seems to dim a little. On the seat of a locked truck. You did everything right. You turned around. You left.

Reese sees your face before he sees the knife. When he sees the knife he goes very still, and then he starts talking, fast, about how you must have set it there, must have had it, and you let him, because the two of you have to drive home and one of you has to be able to.`,
      },
    ],
    choices: [
      {
        label: `"I haven't thought about this knife in years."`,
        outcome: {
          log: "You sit with it, and the doubt lodges where you can't reach it.",
          tone: "n",
          queueEvent: "ux_return_end",
        },
      },
      {
        label: `Say nothing. You don't have words.`,
        outcome: {
          log: "The sight is more than you can hold, and you don't try. The daylight doesn't help the way daylight should.",
          tone: "b",
          stats: { grip: -1 },
          queueEvent: "ux_return_end",
        },
      },
      {
        label: `"You're right. I must have had it on me the whole time."`,
        outcome: {
          log: "You take the reading he's holding out, and it steadies you, and something closes.",
          tone: "n",
          stats: { grip: 1 },
          setFlags: { denied_knife: true, lead_whites_cooled: true },
          queueEvent: "ux_return_end",
        },
      },
      {
        label: `"It was a locked truck, Reese. We were underground."`,
        outcome: {
          log: "You say the thing he can't answer. He stops trying, and something in how he looks at you changes.",
          tone: "b",
          stats: { standing: -1 },
          setFlags: { held_truth: true, reese_strained: true },
          queueEvent: "ux_return_end",
        },
      },
    ],
  },

  // -- the cut-off ----------------------------------------------------------------------------------------------
  ux_return_end: {
    id: "ux_return_end",
    once: "return_end_seen",
    title: "The Cut-Off",
    body:
`The run ends here.

Not with an answer — with a knife you can hold, in a place it cannot be, and a friend beside you insisting on the one story that lets him keep driving. You will never be able to prove how it got here. And you will never, as long as you live, be able to argue away the certainty that something reached across your whole life to place a dead man's knife in your hand — that it meant to, that it knows you came anyway and didn't turn back. Certainty and proof were never the same thing. You walk out of that dark holding only the first, and it is the heaviest thing you will ever carry, and you carry it into whatever's left of your ordinary life, and you never once set it down.`,
    choices: [
      {
        label: `Carry it out.`,
        outcome: { setFlags: { run_end_whites_return: true } },
      },
    ],
  },
};
