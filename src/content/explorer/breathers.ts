// ============================================================================
// content/explorer/breathers.ts — the Breather Set: ordinary life (Loom's
// story pass, wired). The mundane texture the horror is a deviation FROM.
//
// Definitional disciplines: coordinate-silent and lens-silent — no
// diamondCoord, no lensFlavor, no attune, no thread flags on ANY of these.
// That silence is what lets a week be mechanically quiet (the centroid
// doesn't move), which arms the quiet-week snap. Genuinely uneventful: no
// anomaly, no hook, no wink.
//
// Ordinary life doesn't fork; it just passes — so these wire as plain
// actions whose prose rides the log (no cards, no choices). The one live
// effect is a small capped grip restore (statsMax 7: ordinary life can walk
// you back to barely-grounded, never to untouched — the cap number is
// Armature's to retune in the believer's-floor file).
//
// ux_life_evening_in has a took_shard twin (complementary requires; the menu
// only ever shows one): even the quiet is a shade less quiet with the shard
// in the drawer — and the shard evening restores nothing.
// ============================================================================

import type { LocationAction } from "../../engine/types";

const GRIP_RESTORE_CAP = 7;   // the believer's-floor cap on ordinary-life recovery

export const breatherActions: LocationAction[] = [
  {
    id: "ux_life_work",
    name: "Work a shift",
    sub: "You have a job, because everyone has a job.",
    cost: 2,
    outcome: {
      log: "The hours go the way hours go — some tedious, some fine, a small annoyance, a small satisfaction, a coworker's story about their weekend that you half-listen to. You are, for eight hours, a person with ordinary problems: a deadline, a printer, someone who took your lunch from the fridge. It is the most normal you feel all week, and you don't notice until you're driving home that your shoulders came down from around your ears somewhere in the afternoon.",
      tone: "g",
      stats: { grip: 1 },
      statsMax: { grip: GRIP_RESTORE_CAP },
    },
  },
  {
    id: "ux_life_dinner",
    tiredText: "Not today. You haven't got the face for people right now.",
    name: "Cook something",
    sub: "Nothing ambitious. The thing you know how to make without thinking.",
    cost: 1,
    outcome: {
      log: "The knife-work is automatic, the pan loud, the kitchen warm and smelling like a place people live. You eat it at the counter or in front of something, and it's good, or it's fine, and it's yours, and there is nothing in it but dinner.",
      tone: "g",
      stats: { grip: 1 },
      statsMax: { grip: GRIP_RESTORE_CAP },
    },
  },
  {
    id: "ux_life_call",
    tiredText: "Not today. You haven't got the face for people right now.",
    name: "Call someone from before",
    sub: "A friend, a sibling, a parent — someone whose world has never touched the woods.",
    cost: 1,
    surface: "phone",
    outcome: {
      log: "You talk about nothing that matters: their kid, a show, a complaint about a mutual acquaintance, a plan that may or may not happen. You don't mention any of it. For twenty minutes you are just a person they know, in the middle of a normal life, and hanging up you feel the specific steadiness of having been, briefly, only that.",
      tone: "g",
      stats: { grip: 1 },
      statsMax: { grip: GRIP_RESTORE_CAP },
    },
  },
  {
    id: "ux_life_errands",
    name: "Run the errands",
    sub: "Groceries. The hardware store. The post office. The ordinary list.",
    cost: 1,
    outcome: {
      log: "You run the list, and the list gets shorter, and there is a low animal satisfaction in the shortening. The store is fluorescent and boring and full of people buying paper towels. Nobody there has ever seen anything they couldn't explain. You buy your paper towels and go home.",
      tone: "n",
    },
  },
  {
    id: "ux_life_morning",
    tiredText: "Not today. Your legs are done, and you know it.",
    name: "Take the morning slow",
    sub: "You woke before the alarm, and the light's good, and there's coffee.",
    cost: 1,
    outcome: {
      log: "For once nothing is pulling at you. Maybe you sit outside. Maybe you just sit. It's the kind of ordinary hour that a life is actually made of, the kind you don't remember later because nothing happened in it, and it is quietly, completely fine.",
      tone: "g",
      stats: { grip: 1 },
      statsMax: { grip: GRIP_RESTORE_CAP },
    },
  },
  {
    id: "ux_life_evening_in",
    name: "An evening in",
    sub: "Nothing on. Nothing owed. An early night.",
    cost: 1,
    requires: { kind: "noflag", flag: "took_shard" },
    outcome: {
      log: "Something on the screen you're not really watching, or a book, or the specific pleasure of an early night. The apartment is quiet in the good way. You are tired in the good way. Nothing knocks. Nothing hums. You go to bed at a reasonable hour and you sleep, and the sleep is ordinary and full, and you don't dream of anywhere at all.",
      tone: "g",
      stats: { grip: 1 },
      statsMax: { grip: GRIP_RESTORE_CAP },
    },
  },
  {
    // The took_shard twin: even the quiet is a little less quiet, and it
    // restores nothing.
    id: "ux_life_evening_in_shard",
    name: "An evening in",
    sub: "Nothing on. Nothing owed. An early night.",
    cost: 1,
    requires: { kind: "flag", flag: "took_shard" },
    outcome: {
      log: "Something on the screen you're not really watching, or a book, or the specific pleasure of an early night. The apartment is quiet in the good way. You are tired in the good way. Nothing knocks. Nothing hums. You go to bed at a reasonable hour and you sleep, mostly, and if you dream you don't remember it, and you take the not-remembering as a mercy.",
      tone: "n",
    },
  },
  {
    id: "ux_life_walk",
    tiredText: "Not today. Your legs are done, and you know it.",
    name: "Go for a walk",
    sub: "No destination, nobody's pace but your own. Not the woods.",
    cost: 1,
    outcome: {
      log: "Around the block, along the river, wherever's near and easy. Just streets, and other people's windows going gold, and a dog that wants to say hello. Your body's glad of it. Your head goes quiet the way it only does when you're moving and nothing's wrong. You come back a little more yourself.",
      tone: "g",
      stats: { grip: 1 },
      statsMax: { grip: GRIP_RESTORE_CAP },
    },
  },
];
