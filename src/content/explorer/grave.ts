// ============================================================================
// content/explorer/grave.ts — the Empty Vault (Loom's story pass, wired):
// Marie's return payoff, the image her episode held back. Percept only — the
// vault is empty, and the game never supplies one word of why. Restraint is
// a content rule: no elaboration on the morbid; the absence is the whole
// horror, and it's quiet.
//
// Wiring shape: a player-initiated short outing gated on
// `grave_suspicion ∧ NOT grave_confirmed_empty` (the ratified re-enterable
// gate: a player who left it closed can return and open it later, or never).
// Both paths reach the close; the sealed layer surfaces in NOTHING.
// ============================================================================

import type { GameEvent, LocationAction } from "../../engine/types";

export const graveActions: LocationAction[] = [
  {
    id: "ux_act_grave_visit",
    name: "Go out to the old cemetery",
    sub: "Past the church, against the treeline. The grave Marie won't visit.",
    cost: 1,
    requires: {
      kind: "all",
      of: [{ kind: "flag", flag: "grave_suspicion" }, { kind: "noflag", flag: "grave_confirmed_empty" }],
    },
    outcome: {
      log: "You drive out past the church as the light goes long, to the place Marie has spent forty years not driving to.",
      tone: "n",
      queueEvent: "ux_grave_visit",
    },
  },
];

export const graveEvents: Record<string, GameEvent> = {
  // -- the old cemetery (re-enterable: no once-flag by design) ----------------------
  ux_grave_visit: {
    id: "ux_grave_visit",
    title: "The Old Cemetery",
    body:
`The old cemetery is where Marie said — past the church, right up against the treeline, the woods leaning over the back wall like they're waiting for it. The new part is lawns and flat markers. The old part, back near the trees, is different: above-ground, the way they did it here once, small stone vaults and family crypts gone soft-edged with a century of weather.

You find the Fields vault against the back wall. Small. A family's worth of stone, and the newest name on it, cut sharper than the rest because it was cut later — a child's name, and a child's dates, fifty years apart from nothing because the fifty years never came.

Marie has never stood here. In forty years she couldn't make herself. You're standing here because she couldn't, and because some part of you has to know the thing she's been too afraid to know.

The vault has a face plate. It isn't locked. Nothing out here is locked; who would come?`,
    choices: [
      {
        // Opening a sealed vault is a disturbance — it feeds the pressure
        // gradient (exposure charge proposed by the wire; flagged for tuning).
        label: `Open it.`,
        outcome: { stats: { exposure: 2 }, setFlags: { grave_opening: true }, queueEvent: "ux_grave_look" },
      },
      {
        label: `"…I can't. Some things you leave closed."`,
        outcome: { setFlags: { grave_left_closed: true }, queueEvent: "ux_grave_unopened" },
      },
    ],
  },

  // -- the space where she should be ---------------------------------------------------
  ux_grave_look: {
    id: "ux_grave_look",
    title: "The Space Where She Should Be",
    body:
`The plate comes away easier than it should, the seal long since given up.

Inside, it's dark, and small, and dry, and there is a shelf of stone the length of a child.

And there's nothing on it.

Not disturbed. Not scattered. Not robbed, with the mess a robbing leaves. *Empty* — clean, still, undisturbed, a stone shelf cut for a small coffin that holds a stone shelf and dust and the dark, and has, you understand with a slow cold certainty, held exactly that for forty years. There was never anything here to disturb. The name is on the front and the dates are on the front and behind the front there is a made bed that was never slept in.

You stand there a long time with the plate in your hands and the dark in front of you and the woods at your back, and you do not have a single thought that resolves into anything. You just look at the empty place where a child is supposed to be, and let it be as empty as it is.`,
    choices: [
      {
        label: `"Someone took her body. Grave robbers, a cover-up — something human."`,
        lensFlavor: "skeptic",
        outcome: {
          log: "You build the reasons and they're all possible and not one of them is here, in front of you, provable. An empty grave is a fact. Everything else is a story you're telling to keep the fact from meaning what Marie was afraid it means. You tell the stories anyway. They help a little.",
          tone: "n",
          setFlags: { read_grave_human: true, grave_confirmed_empty: true },
          queueEvent: "ux_grave_close",
        },
      },
      {
        label: `"She was never buried. There was never anything to bury."`,
        lensFlavor: "spiritual",
        outcome: {
          log: "The thought arrives whole and you can't push it back out: that this was always a made bed, that they held a service over an empty box because a town needs a place to put its grief, and that Ellen Fields went into those woods forty years ago and simply never came out — not to a grave, not to anywhere. You close the plate. Your hands aren't quite steady. You don't know what you believe. You know what you felt, standing there, and you'll never be able to prove it, and you'll never be able to unfeel it.",
          tone: "b",
          setFlags: { read_grave_taken: true, grave_confirmed_empty: true },
          queueEvent: "ux_grave_close",
        },
      },
      {
        label: `"There's a record somewhere that explains this. Empty graves have paperwork."`,
        lensFlavor: "institutional",
        outcome: {
          log: "You think about who signs off on a burial, who fills a vault, who keeps the record of an empty box and a full ceremony — because a thing like this doesn't happen by accident, it takes hands, and hands leave paper, and paper has names. And then you think about what it would mean to go looking for those names, in a town that made Dale into a killer for less, and something in you goes very quiet and careful. But you file it. Empty graves have paperwork. Somewhere.",
          tone: "n",
          setFlags: { read_grave_org: true, grave_confirmed_empty: true },
          queueEvent: "ux_grave_close",
        },
      },
    ],
  },

  // -- [left closed] the thing you didn't confirm ------------------------------------------
  ux_grave_unopened: {
    id: "ux_grave_unopened",
    title: "The Thing You Didn't Confirm",
    body:
`You put your hand flat on the cold face plate, over the sharp-cut name, and you don't open it.

Maybe Marie has the right of it. Maybe there are things you leave closed — not because you're afraid of what's inside, or not only, but because some doors, once opened, don't close again in you. You stand with your hand on the stone for a moment, the way you'd stand with a hand on a shoulder, and then you take it back, and you leave the old cemetery with the woods watching you go.

You'll never know now. You chose not to. And the not-knowing rides home with you, lighter than the knowing would have been and heavier than nothing, and you understand a little better why an old woman spent forty years not driving out here.`,
    choices: [
      {
        label: `"It's better not to know."`,
        attune: -0.25,
        outcome: { queueEvent: "ux_grave_close" },
      },
      {
        label: `"…I'll carry the wondering. It's the kinder weight."`,
        attune: 0.25,
        outcome: { queueEvent: "ux_grave_close" },
      },
    ],
  },

  // -- what you carry back ---------------------------------------------------------------------
  ux_grave_close: {
    id: "ux_grave_close",
    title: "What You Carry Back",
    // The close serves BOTH exits; the vindication paragraph only renders for
    // the player who opened it (the left-closed player confirmed nothing).
    body:
`You leave the old cemetery with the church quiet and the woods quiet and the town down the road going about its ordinary evening, not one of them standing where you just stood.`,
    bodyExtras: [
      {
        when: { kind: "flag", flag: "grave_confirmed_empty" },
        text:
`Whatever you decided it means — and you decided nothing, not really, because there's nothing here to decide it *with* — the shape of it goes home with you: a made bed no one slept in, a name cut sharp on a stone, and a whole town that laid a child to rest without ever once asking where the child went. Marie was right to be afraid. She was afraid of exactly the right thing, for exactly forty years, and the only thing worse than her fear is how quiet the answer is.`,
      },
    ],
    choices: [
      {
        label: `Drive back in the ordinary evening.`,
        outcome: { setFlags: { grave_beat_done: true } },
      },
    ],
  },
};
