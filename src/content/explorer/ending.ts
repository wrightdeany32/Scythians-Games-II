// ============================================================================
// content/explorer/ending.ts — the Run That Never Went Back (Loom's story
// pass, wired): the calendar-end terminal for the run where the player never
// chose the return. NOT a bad ending, and it must never read as punishment —
// the sensible life is a legitimate choice with a real, quiet cost.
//
// Wired as two cards so the thread-echoes (bodyExtras, append-only) can sit
// between the opening prose and the closing movement: the first card carries
// the season-turn and this player's echoes; the second carries the mark
// coda (a bodyVariant — only for a run that ever saw the mark) and the two
// attune closers. Selected by the ending-selector (db.endings) past
// tuning.calendar.lastDay; its exit flag is the terminal.
// ============================================================================

import type { GameEvent } from "../../engine/types";

export const endingEvents: Record<string, GameEvent> = {
  // -- the life you kept ---------------------------------------------------------
  ux_ending_never_returned: {
    id: "ux_ending_never_returned",
    once: "ending_never_returned_seen",
    title: "The Life You Kept",
    body:
`The season turns, and you don't go back to White's Hall.

There's no single day you decide it. It's more that the days accumulate, the ordinary days, and each one makes the next one's decision for it — work, and weather, and the small business of a life — until one morning you notice the woods have gone quiet in you, the way a sound you've stopped hearing goes quiet, and you understand without ceremony that you're not going back out there. You had a life to get back to. You got back to it. That's allowed. That's what most people would have done, and been right to.

The things you started, you leave where they lie.`,
    bodyExtras: [
      {
        when: { kind: "flag", flag: "doug_gone" },
        text: `Doug is somewhere out of state, the family says, looked after, and you send a message once that goes unanswered and you let it be.`,
      },
      {
        when: { kind: "flag", flag: "doug_lingering" },
        text: `Doug still picks you up at six, warm as ever, and you've stopped noticing whether the warmth has an edge, and maybe that's mercy and maybe it's the thing itself, and you'll never do the work of telling them apart.`,
      },
      {
        when: { kind: "flag", flag: "money_set_aside_doug" },
        text: `The pieces you bought that night are in a drawer you don't open — you paid real money for them, money you'd meant for something of your own, and you'll never put them on again, and you can't quite make yourself throw them out either, so they sit, the receipt for a road you walked a little way down and stepped off of.`,
      },
      {
        when: { kind: "all", of: [{ kind: "flag", flag: "grave_suspicion" }, { kind: "noflag", flag: "grave_beat_done" }] },
        text: `You never go to the cemetery. Some nights the empty feeling of a grave you've never seen sits with you, and you let it, and you never once drive out to stand in front of it and find out.`,
      },
      {
        when: { kind: "flag", flag: "grave_confirmed_empty" },
        text: `You did stand in front of that vault, once, and you opened it, and you know exactly what isn't in there — and you never told Marie, and you never went back for the rest of it, and you let the knowing sit where it fell, a fact with no home and no proof and nowhere to set it down.`,
      },
      {
        when: { kind: "any", of: [{ kind: "flag", flag: "dale_warned_unheeded" }, { kind: "flag", flag: "dale_bond" }] },
        text: `And somewhere at the end of a dead-end road there's a porch light you never took him up on, and an old man who spent forty years disbelieved and one evening being *heard* — and who will never know that this time, for once, somebody did the thing he begged them to do, and just went home. You gave Dale the only thing he ever asked anyone for, and he will never find out you gave it.`,
      },
      {
        when: { kind: "flag", flag: "thread_nora_active" },
        text: `Nora calls, eventually, from wherever she landed, and you talk about ordinary things, and neither of you says the name of the place, and the not-saying is its own kind of agreement to leave it buried.`,
      },
    ],
    choices: [
      {
        label: `Let the season turn.`,
        outcome: { queueEvent: "ux_ending_never_close" },
      },
    ],
  },

  // -- the mark coda, and the last fork ------------------------------------------------
  ux_ending_never_close: {
    id: "ux_ending_never_close",
    title: "Mostly Fine",
    // Base = the markless run; the variant adds the mark coda for a run that
    // ever saw it (cave etchings or the meeting ring).
    body:
`That's the whole of it. Not an answer — the *absence* of one, kept on purpose. You will spend the rest of an ordinary life never quite able to leave alone the question of whether there was ever anything out there at all, and you will never, ever go and find out, and the never-finding-out will work. The woods will stay woods. The itch will stay an itch. You'll be fine. You'll mostly be fine.`,
    bodyVariants: [
      {
        when: { kind: "any", of: [{ kind: "flag", flag: "cave_etchings_seen" }, { kind: "flag", flag: "meeting_mark_seen" }] },
        text:
`And the mark. You still see it, now and then, where you're not looking for it — a shape on a sign, a scratch in a table, the ghost of it at the edge of a dream — and every time, something in you goes still for a half-second, and then you look away, and you let it go, and you go on with your day.

That's the whole of it. Not an answer — the *absence* of one, kept on purpose. You will spend the rest of an ordinary life never quite able to leave alone the question of whether there was ever anything out there at all, and you will never, ever go and find out, and the never-finding-out will work. The woods will stay woods. The itch will stay an itch. You'll be fine. You'll mostly be fine.`,
      },
    ],
    choices: [
      {
        label: `"It was nothing. It was always nothing."`,
        attune: -0.25,
        outcome: {
          log: "You decide it, and the deciding holds, mostly, the way deciding always mostly holds. There's just the half-second, now and then, at the edge of a dream. You've made your peace with the half-second. It's a small price for a whole life.",
          tone: "n",
          setFlags: { run_end_never_returned: true },
        },
      },
      {
        label: `"I'll never know."`,
        attune: 0.25,
        outcome: {
          log: "You don't close it. You carry it, light, the way you'd carry a stone from a beach — a small weight in the pocket, taken out sometimes, turned over, put back. You never look. But you never quite stop wondering, either, and you decide that wondering is a fine thing to keep. Maybe the finest thing you took out of those woods.",
          tone: "n",
          setFlags: { run_end_never_returned: true },
        },
      },
    ],
  },
};
