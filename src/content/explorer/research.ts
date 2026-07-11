// ============================================================================
// content/explorer/research.ts — the lens engine (Loom's story pass, wired):
// three research actions, each carrying a lensFlavor, that let the player dig
// into an angle. Divergence by player agency: dig paranormal and your lens
// tilts paranormal; dig materialist and you build a materialist world.
//
// THE discipline: research grows THEORIES, never confirms TRUTH. theory_*
// counters gate how much of a reading the player has built — nothing more
// (the ratified anti-model: investment, never correctness). The self-undercut
// lines are load-bearing, per Loom: never cut them.
//
// The fourth flavor, skeptic, deliberately has no research action — it lives
// in the denial-brakes (Marie's dismiss, the meeting's "just rich people,"
// Nora's stripped-building read). Skeptics don't research the anomaly.
//
// Wiring shape: home-surface actions queue a dig card; bodyVariants unlock
// the deeper material on the theory counter; the conditional grip swings are
// complementary-`requires` twins of the "keep digging" choice (exactly one is
// ever visible). Grip swings are stat effects, never position.
// ============================================================================

import type { GameEvent, LocationAction } from "../../engine/types";

export const researchActions: LocationAction[] = [
  {
    id: "ux_act_research_symbol",
    tiredText: "Not today. The words would just swim; you'd be staring at nothing.",
    name: "Research the mark",
    sub: "You sketch it from memory. Somebody, somewhere, has seen this before.",
    cost: 1,
    surface: "home",
    requires: { kind: "any", of: [{ kind: "flag", flag: "cave_etchings_seen" }, { kind: "flag", flag: "meeting_mark_seen" }] },
    outcome: {
      log: "You spread out at the table with the sketch and the laptop — the library's local-history shelf, the county historical society's bad website, the kind of forums where people take this seriously.",
      tone: "n",
      queueEvent: "ux_research_symbol",
    },
  },
  {
    id: "ux_act_research_ground",
    tiredText: "Not today. The words would just swim; you'd be staring at nothing.",
    name: "Look up what caves do to people",
    sub: "The other thing. The rock, the air, the body. What's actually known.",
    cost: 1,
    surface: "home",
    requires: { kind: "flag", flag: "cave_done" },
    outcome: {
      log: "You do the other thing. You look up what caves actually do to people.",
      tone: "n",
      queueEvent: "ux_research_ground",
    },
  },
  {
    id: "ux_act_research_property",
    tiredText: "Not today. The words would just swim; you'd be staring at nothing.",
    name: "Pull the property records",
    sub: "The paper a place leaves behind when it dies.",
    cost: 1,
    surface: "home",
    requires: { kind: "any", of: [{ kind: "flag", flag: "nora_center_known" }, { kind: "flag", flag: "nora_daytrip_done" }] },
    outcome: {
      log: "You pull the thread Nora pulled. Property records, old newspapers, the trail of a dead institution.",
      tone: "n",
      queueEvent: "ux_research_property",
    },
  },
];

export const researchEvents: Record<string, GameEvent> = {
  // -- the mark, and the old stories · spiritual -------------------------------------
  ux_research_symbol: {
    id: "ux_research_symbol",
    title: "The Mark, and the Old Stories",
    body:
`It's not nothing. The shape — or shapes close to it — turns up in more places than it has any right to: protective marks scratched on old barn beams three counties over, a motif in a privately printed book on regional folklore, a thing an old woman in a 1970s oral-history recording calls "the keep-away." None of it matches exactly. All of it rhymes. And the stories that cluster around the marks are always the same story: a place you don't go, and people who went, and people who didn't come back.`,
    bodyVariants: [
      {
        when: { kind: "counter", flag: "theory_spiritual", op: ">=", value: 2 },
        text:
`You find the taken-girl story is not the only taken story. There are others, thin and old and scattered across a century, and they share a grammar — the woods, the marks, someone drawn back again and again until the night they're not. You could believe, if you let yourself, that you're looking at the long record of a single patient thing.`,
      },
    ],
    choices: [
      // Deep dig: the third pull and beyond costs footing. Exactly one of these
      // two "keep pulling" twins is ever visible (complementary requires).
      {
        label: `"Keep pulling on this."`,
        requires: { kind: "counter", flag: "theory_spiritual", op: ">=", value: 2 },
        lensFlavor: "spiritual",
        outcome: {
          log: "You build the shape of it in your head, and the more you build the more it holds — and you notice, in the clear part of you, that you can't actually prove a single link. The marks rhyme. The stories rhyme. Rhyme isn't proof. You know that. You keep reading anyway.",
          tone: "n",
          stats: { grip: -1, exposure: 1 },
          addFlags: { theory_spiritual: 1 },
        },
      },
      {
        label: `"Keep pulling on this."`,
        requires: { kind: "counter", flag: "theory_spiritual", op: "<", value: 2 },
        lensFlavor: "spiritual",
        outcome: {
          log: "You build the shape of it in your head, and the more you build the more it holds — and you notice, in the clear part of you, that you can't actually prove a single link. The marks rhyme. The stories rhyme. Rhyme isn't proof. You know that. You keep reading anyway.",
          tone: "n",
          addFlags: { theory_spiritual: 1 },
        },
      },
      {
        label: `"Close the laptop."`,
        outcome: {
          log: "You put it down. It's folklore and coincidence and a symbol simple enough that lots of people would scratch it into lots of things. That's the sensible read, and you take it, and it holds until the next time you can't sleep.",
          tone: "n",
        },
      },
    ],
  },

  // -- the cave, and the body · physics --------------------------------------------------
  ux_research_ground: {
    id: "ux_research_ground",
    title: "The Cave, and the Body",
    body:
`There's a lot, and it's real and cited and boring in the way true things often are. Infrasound — sound below hearing — pools in caves and passages, and it does exactly what you felt: dread, a sense of presence, the hair up on your arms, sometimes a shape at the edge of vision. Carbon dioxide settles in low chambers and muddies your thinking before you know it's happening. And the brain, starved of light and pattern, *manufactures* pattern — faces in the dark, meaning in the marks, a voice in the drip. You didn't experience a haunting. You experienced a nervous system in a hole in the ground.`,
    bodyVariants: [
      {
        when: { kind: "counter", flag: "theory_physics", op: ">=", value: 2 },
        text:
`You push into the harder question — the scar that closed, the thing that shouldn't have been there — and the materialist answer is unnerving in its own way: *you misremembered.* You didn't chip the stone where you think. You've built a memory around a shape your brain wanted. It's not comfortable, but it's the parsimonious read, and parsimony has never once been wrong about anything like this.`,
      },
    ],
    choices: [
      // The explanation steadies you from the second dig on — capped so
      // materialism can't be farmed into invulnerability (tuning: Armature's).
      {
        label: `"This is the answer. It's the ground and it's my own head."`,
        requires: { kind: "counter", flag: "theory_physics", op: ">=", value: 1 },
        lensFlavor: "physics",
        outcome: {
          log: "You feel the floor come back under you as you read. There's a mechanism for every single thing you felt. And in the clear part of you — the same part that flagged the folklore — a small voice notes that 'you misremembered' is a thing that also can't be proven, and can explain literally anything, and is therefore exactly as unfalsifiable as a ghost. You set the voice aside. The mechanism is right there. It's easier.",
          tone: "g",
          stats: { grip: 1 },
          statsMax: { grip: 8 },
          addFlags: { theory_physics: 1 },
        },
      },
      {
        label: `"This is the answer. It's the ground and it's my own head."`,
        requires: { kind: "counter", flag: "theory_physics", op: "<", value: 1 },
        lensFlavor: "physics",
        outcome: {
          log: "You feel the floor come back under you as you read. There's a mechanism for every single thing you felt. And in the clear part of you — the same part that flagged the folklore — a small voice notes that 'you misremembered' is a thing that also can't be proven, and can explain literally anything, and is therefore exactly as unfalsifiable as a ghost. You set the voice aside. The mechanism is right there. It's easier.",
          tone: "n",
          addFlags: { theory_physics: 1 },
        },
      },
      {
        label: `"Close the laptop."`,
        outcome: {
          log: "You close the tab. The mechanism will still be there tomorrow.",
          tone: "n",
        },
      },
    ],
  },

  // -- the center, and the records · institutional ----------------------------------------
  ux_research_property: {
    id: "ux_research_property",
    title: "The Center, and the Records",
    body:
`The research center was real, and its paper trail is *strange* in a specific, mundane-looking way: it changed hands too many times, through holding companies that dissolve into other holding companies, and the public record thins out exactly where you'd want it to be thickest. There's no smoking gun. There's an *absence* shaped like one — the documentary equivalent of a swept floor. And the property, dead and stripped for decades, is still owned by *someone*, through enough layers that you give up before you reach a name.`,
    bodyVariants: [
      {
        when: { kind: "counter", flag: "theory_institutional", op: ">=", value: 2 },
        text:
`You start cross-referencing the disappearances against the center's active years and the map, and a pattern assembles — loose, deniable, the kind a statistician would wave off and a frightened person would not. You could believe you're looking at the footprint of an organization that was here, did something, and took care to leave nothing you could hold.`,
      },
    ],
    choices: [
      {
        label: `"There's something here. Keep digging."`,
        lensFlavor: "institutional",
        outcome: {
          log: "The reading builds and it's the most credible-feeling of all of them, because it's all documents and dates, nothing supernatural, just powerful people and missing paper. And the clear part of you notes that missing paper is also what mundane incompetence looks like, and that a pattern you went looking for is a pattern you'll tend to find. You keep digging. It feels like the responsible thing, which is its own kind of pull.",
          tone: "n",
          stats: { exposure: 1 },
          addFlags: { theory_institutional: 1 },
        },
      },
      {
        label: `"Close the laptop."`,
        outcome: {
          log: "You close the folder. The paper isn't going anywhere. That's rather the point.",
          tone: "n",
        },
      },
    ],
  },
};
