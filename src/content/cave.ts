// ============================================================================
// content/cave.ts — Story Pass 2: "The Cave (with Reese)", by Vigil, converted
// to engine cards. This is REAL slice content (not the smoke harness): a chain
// of linked GameEvents the player experiences as one continuous day.
//
// CONVENTION — chained scene cards: every card here advances by `queueEvent`
// (or a roll branch that does), and NONE carry a `deck:` tag. Because the daily
// loop draws DECK-SCOPED (drawEvent(..., "deck:situations")), untagged cards are
// never pulled at random — they fire ONLY via the queue, in order, in context.
// "Exit the scene" = a choice that simply does NOT queue another card, so the
// queue empties and the daily loop resumes.
//
// Pure declarative data only — no functions, no Math.* (engine discipline).
// ============================================================================

import type { GameEvent, LocationAction, Item } from "../engine/types";

// --- balance knobs the prose left open (FLAGGED to Vigil, easy to retune) -----
export const SQUEEZE_TARGET = 10;   // tradecraft check for the throat; prose gave no number — my guess
export const GEAR_LOSS_MONEY = -10; // money hit for a shed/replaced pack; money scale still TBD — my guess

export const caveItems: Record<string, Item> = {
  cave_gear:    { id: "cave_gear",    source: "item", label: "Caving pack",  slot: "pack" },
  // cave-b4 (the shard-as-symbol reframe, Dean's ruling): the artifact is the
  // COPY the player made, not a pocketed stone. The id stays `marked_shard`
  // (save-compat; `took_shard` likewise keeps its name and now reads "the
  // player recorded the symbol") — only the label and the prose changed.
  marked_shard: { id: "marked_shard", source: "item", label: "Copied page", slot: "evidence" },
};

// The daily-loop hook that commits the day and drops you into the chain.
export const caveEntryAction: LocationAction = {
  id: "ux_act_cave_reese",
  name: "Go caving with Reese",
  sub: "He's been texting about the White's Hall Cave System, off the old fire road.",
  cost: 3,                                          // commits the whole day (energy 3/day)
  requires: { kind: "noflag", flag: "cave_done" },  // the slice is one trip; the action retires after
  outcome: {
    log: "You load the pack and meet Reese at the fire road.",
    tone: "n",
    setFlags: { thread_reese: true },               // engages Reese's thread; Aunt Marie unlocks on any of thread_doug/reese/nora
    grantItems: ["cave_gear"],
    queueEvent: "ux_cave_enter",
  },
};

export const caveEvents: Record<string, GameEvent> = {
  // -- into the system --------------------------------------------------------
  ux_cave_enter: {
    id: "ux_cave_enter",
    title: "Into the System",
    body:
`The entrance is a slot behind a fallen slab off the old fire road, and Reese is through it before you've got your headlamp seated right. Inside, the air turns cool and mineral, and the daylight quits about thirty feet in — all at once, the way it always does, like a door closing behind you.

This stretch is travelled. You read it in the floor: worn smooth down the center where a few thousand boots picked the same line, a spray-painted arrow so old it's gone the color of the rock. Reese narrates the whole way — some guy on his feed who runs systems like this with no light, which is either a lie or a life expectancy. It's easy going. Almost cozy, if you're the sort who finds a mountain's insides cozy.

You are.`,
    choices: [
      { label: "Take point.", outcome: { log: "You take point.", tone: "n", setFlags: { cave_lead: "self" }, queueEvent: "ux_cave_descend" } },
      { label: "Let Reese run ahead.", outcome: { log: "You wave him on, and he's up the passage before you've finished the gesture.", tone: "n", setFlags: { cave_lead: "reese" }, queueEvent: "ux_cave_descend" } },
    ],
  },

  // -- the floor stops being friendly -----------------------------------------
  ux_cave_descend: {
    id: "ux_cave_descend",
    title: "The Floor Stops Being Friendly",
    body:
`An hour in, the cave stops being a place people come to.

It's gradual — that's the thing about it. The smooth center-line frays out into rubble. The old arrows stop. The passage starts to lean, the walls closing by degrees until you're both walking with a hand out and your head cocked. Mud where there was dry stone. The ceiling comes down to meet you a little at a time, so politely you don't notice you've been stooping until your back tells you.

Reese has gone quiet — not spooked, just working, reading the route. Ahead, the passage splits low and mean.`,
    choices: [
      { label: "Keep going. This is what you came for.", outcome: { log: "You press on.", tone: "n", queueEvent: "ux_cave_heard" } },
      // A real out, offered before there's any reason to take it — the sensible day. Exits clean (no queue).
      { label: "Call it — this is getting dangerous.", outcome: { log: "You call it. Reese gives you grief the whole way out, but he comes. You're back in daylight by mid-afternoon — filthy, thirsty, and entirely un-murdered. A good day, and nothing in it.", tone: "g", stats: { grip: 1 }, setFlags: { cave_done: true, cave_turned_back: true } } },
    ],
  },

  // -- "did you hear that?" ---------------------------------------------------
  ux_cave_heard: {
    id: "ux_cave_heard",
    title: "Did You Hear That?",
    body:
`Another twenty minutes and Reese stops dead, fist up. Kills his lamp. Yours too, a beat later, and the dark that comes down is total — not dim, not shadowed, the absolute black of a place the sun has never once reached.

"...tell me you heard that," Reese whispers. And it's strange coming from him, because Reese is the one who explains everything, and right now his voice has a thread in it you've never heard.`,
    choices: [
      { label: `"Probably a bat. They get down this deep."`, outcome: { log: "You give it a name — a bat, this deep, sure — and Reese takes it, and you both agree to be men who heard a bat.", tone: "n", queueEvent: "ux_cave_squeeze" } },
      // LEAK dropped (was the intent-note "You let it in."): open ux_cave_squeeze directly.
      { label: `"That wasn't a bat. That sounded like a voice."`, outcome: { stats: { grip: -1 }, setFlags: { cave_heard_voice: true }, queueEvent: "ux_cave_squeeze" } },
      { label: `"I didn't hear anything. Lamp back on."`, outcome: { log: "You call for the light. Reese gives it to you fast — a little too fast — and neither of you mentions that.", tone: "n", queueEvent: "ux_cave_squeeze" } },
      { label: `"Please tell me you're not turning into one of those people, Reese."`, outcome: { log: "You give him a hard time, and it lands. You're two idiots in a hole again, and the dark gives back a few feet.", tone: "g", stats: { grip: 1 }, queueEvent: "ux_cave_squeeze" } },
    ],
  },

  // -- the pinch --------------------------------------------------------------
  ux_cave_squeeze: {
    id: "ux_cave_squeeze",
    title: "The Pinch",
    body:
`The passage chokes down to a horizontal slot maybe a foot and a half high — a wet stone throat that goes somewhere; you can feel air moving through it, which means it opens on the far side. Reese is already flat on his belly, lamp poking in, grinning back at you with too many teeth.

"I can make this. Three body-lengths, tops. You right behind me?"

You've done squeezes. You know the math of them — the part where your ribs are the widest thing about you, and the rock does not care.`,
    choices: [
      { label: `"Yeah. Right behind you."`, outcome: { log: "You don't love it; you don't say so.", tone: "n", queueEvent: "ux_cave_squeeze_through" } },
      // Echo dropped so ux_cave_otherway opens on its own written prose (Loom: no annotation should precede it).
      { label: `"That's a no. There's the high passage — let's take the long way."`, outcome: { queueEvent: "ux_cave_otherway" } },
      // Hesitate: Reese waits, and you still have to choose. Shows once, then loops back.
      { label: `"This isn't really what I had in mind, man."`, requires: { kind: "noflag", flag: "cave_hesitated" }, outcome: { log: "Reese waits. The slot isn't going anywhere.", tone: "n", setFlags: { cave_hesitated: true }, queueEvent: "ux_cave_squeeze" } },
      { label: `"I'll spot you. Go — I'll follow if it goes."`, outcome: { log: "You send him through first and follow when the grunting says it's clear.", tone: "n", queueEvent: "ux_cave_squeeze_through" } },
    ],
  },

  // -- the throat (tense, not fatal this run) ---------------------------------
  ux_cave_squeeze_through: {
    id: "ux_cave_squeeze_through",
    title: "The Throat",
    body:
`Reese goes first and vanishes to the soles of his boots, then those too, and for a few seconds you're alone in the black with the sound of him grunting somewhere ahead. Then your turn. Arms first, lamp scraping, and you get halfway before the rock finds your ribs and holds — that half-second again, the one from the quarry, except there's no drop this time. Just a mountain deciding whether to let you through.`,
    choices: [
      {
        label: "Empty your lungs and go.",
        outcome: {
          roll: {
            tag: "squeeze", statMod: "tradecraft", target: SQUEEZE_TARGET,
            win: { log: "The spare quarter-inch is enough. You pour out the far side onto Reese, both of you filthy and laughing the ugly laugh you only laugh when it's over.", tone: "g", setFlags: { cave_squeeze_done: true }, queueEvent: "ux_cave_deep" },
            lose: { log: "For one long moment you are genuinely stuck, the panic a white animal behind your eyes — then Reese has your wrists and hauls, and the rock lets go with a scrape you'll feel for a week.", tone: "b", stats: { grip: -1, energy: -1 }, setFlags: { cave_squeeze_done: true, cave_scare: true }, queueEvent: "ux_cave_deep" },
          },
        },
      },
    ],
  },

  // -- the high passage (the safe-ish long way — where it goes wrong) ----------
  ux_cave_otherway: {
    id: "ux_cave_otherway",
    title: "The High Passage",
    body:
`You take the high line instead, and it's the right call, and it's also where the day quietly stops making sense.

Because the high passage keeps going — down, and down — and somewhere along it you both stop talking, because the smell has started. Not animal. Not rot, exactly. Something underneath rot. And you realize, in the slow way you realize things you'd rather not, that the floor has gone clean. No boot-scuff. No arrows. No candle-smoke on the ceiling, no cans, no carved initials — none of the century of human garbage that every reachable cave on Earth is upholstered in.

Nobody has been here. You can't find one sign that anybody has ever been here.`,
    choices: [
      { label: "Go on.", outcome: { log: "No one has ever been here.", tone: "b", setFlags: { cave_notrace: true }, queueEvent: "ux_cave_deep" } },
    ],
  },

  // -- no reference points ----------------------------------------------------
  ux_cave_deep: {
    id: "ux_cave_deep",
    title: "No Reference Points",
    body:
`However you came through it, you're somewhere now that isn't on any map in either of your heads.

The chamber is bigger than it has any right to be this deep — the lamps don't find the far wall. Underfoot, that same wrong cleanness. And the smell, stronger, sitting in the back of your throat. Reese turns a slow circle and for once doesn't narrate. You watch him decide, very deliberately, to be fine. "Cool. This is sick, actually. Nobody's tagged this."

Then his lamp catches the wall, and stops.`,
    choices: [
      { label: "Follow the lamp.", outcome: { log: "You follow the beam to the wall.", tone: "n", queueEvent: "ux_cave_etchings" } },
    ],
  },

  // -- the marks (the first wrong thing) --------------------------------------
  ux_cave_etchings: {
    id: "ux_cave_etchings",
    title: "The Marks",
    body:
`They're cut into the rock at about chest height, and they run along — not one mark, a sequence, worked into the stone with something patient. A star boxed inside a circle. Rows of small deliberate scratches beside it that your eye keeps trying to read as letters and keeps failing. The cuts are clean-edged. They aren't old.

Someone made these. Carefully. In a place with no way in that a person has ever used, and no way out but the two you just barely found.

"It's teenagers," Reese says, too fast. "It's — this is your imagination doing the thing. Teenagers, they get everywhere." He is already not looking at it.`,
    choices: [
      { label: `"You're right. Teenagers. Little idiots with too much rope."`, outcome: { log: "You take the version you can live with — teenagers, idiots with rope. You almost sell it to yourself.", tone: "g", stats: { grip: 1 }, setFlags: { cave_etchings_seen: true }, queueEvent: "ux_cave_return" } },
      // LEAK dropped (was "You let the pattern in — a thread reaches across to Nora.", which named the hidden link
      // outright). The choice label already lets the reader make the Nora connection; the game must not confirm it.
      { label: `"…I've seen this. Nora had a picture of one just like it."`, outcome: { stats: { grip: -1 }, setFlags: { cave_etchings_seen: true, etchings_link_nora: true }, queueEvent: "ux_cave_return" } },
      { label: `"It looks like something out of a church. Old. The kind of old that means something."`, outcome: { log: "Old, you think. Church-old. The kind of old that was built to point at something.", tone: "n", setFlags: { cave_etchings_seen: true, etchings_read_spiritual: true }, queueEvent: "ux_cave_return" } },
      { label: `"Where have I seen this before?"`, outcome: { log: "The question sits down somewhere behind your ribs and doesn't get up.", tone: "n", setFlags: { cave_etchings_seen: true }, queueEvent: "ux_cave_return" } },
      // The visible-but-illegible seed: greyed while grip is high, reachable only frayed.
      // showWhenLocked keeps it VISIBLE (greyed) on the first cave — grip never drops to 3 in
      // one trip, so it's always locked here; that's the seed. Its payoff is the return trip.
      { label: "▓▓▓▓▓▓▓▓", requires: { kind: "stat", stat: "grip", op: "<=", value: 3 }, showWhenLocked: true, outcome: { log: "For a moment the scratches almost resolve.", tone: "b", setFlags: { cave_etchings_seen: true, cave_read_illegible: true }, queueEvent: "ux_cave_return" } },
    ],
  },

  // -- back through (the leave-something-behind decision) ----------------------
  ux_cave_return: {
    id: "ux_cave_return",
    title: "Back Through",
    body:
`"We're going," Reese says, and it isn't a suggestion, and you don't argue. The way back is the way you came — the throat again — and going up through a squeeze is worse than down, everyone knows that, and your pack is the widest thing on you now.

It won't fit with you. You can feel that already. You can wear the pack or wear yourself out fighting it, but not both.`,
    choices: [
      // Shed the pack — the sane trade. Exits (no queue).
      { label: "Shed the pack — push it ahead, take the loss.", outcome: { log: "You shove the pack ahead of you through the throat and come out with nothing on your back. It costs you a good kit and the last of your pride — cheap, tonight.", tone: "n", removeItems: ["cave_gear"], stats: { money: GEAR_LOSS_MONEY }, setFlags: { cave_done: true, cave_deep_seen: true } } },
      // Keep the pack — a tradecraft check. Both branches exit.
      {
        label: "Keep the pack. Fight through with it.",
        outcome: {
          roll: {
            tag: "squeeze", statMod: "tradecraft", target: SQUEEZE_TARGET,
            win: { log: "You force it through by main strength, and somehow both you and the pack come out the far side. Filthy. Whole.", tone: "g", setFlags: { cave_done: true, cave_deep_seen: true } },
            lose: { log: "You force it through and lose — the pack tears off on the rock, and you come out with less than you carried in, and a scrape you'll feel for a week.", tone: "b", stats: { grip: -1 }, removeItems: ["cave_gear"], setFlags: { cave_done: true, cave_deep_seen: true } },
          },
        },
      },
      // Take proof — a thread for Nora, and maybe something that shouldn't come out.
      // cave-b4 (the shard-as-symbol reframe): the player RECORDS the mark —
      // stay-and-copy vs. run — instead of chipping stone loose. `took_shard`
      // and `marked_shard` keep their names (save-compat); they now read "the
      // player made the copy" / "the copied page". THEN the same throat check.
      {
        label: "Stay a minute. Copy the marks before you go.",
        outcome: {
          log: "You crouch at the wall with the light in your teeth and copy the strangest run of it line for line — a row of marks like numerals knocked sideways, an ellipse around them that doesn't quite close — while Reese holds his lamp on it and complains about the cold. Proof, if you ever need to prove this to anyone. Yourself included.",
          tone: "b",
          grantItems: ["marked_shard"],
          setFlags: { took_shard: true },
          roll: {
            tag: "squeeze", statMod: "tradecraft", target: SQUEEZE_TARGET,
            win: { log: "You wear the pack out through the throat, the page folded flat in your chest pocket.", tone: "n", setFlags: { cave_done: true, cave_deep_seen: true } },
            lose: { log: "You get out — pack torn away on the rock — but the page stays on you.", tone: "b", stats: { grip: -1 }, removeItems: ["cave_gear"], setFlags: { cave_done: true, cave_deep_seen: true } },
          },
        },
      },
    ],
  },
};
