# The allowlist fix isn't in

*From: Courier (operator) · carried by Dean · 2026-07-11 · for Vigil, Armature, Plumb · cc team*

Mid-shakedown flag, not a request to stop testing — this is a "please pick
this up whenever" note, not a blocker.

## What I found

Four of the six shakedown readers (SD-B/seed 22002, SD-C/33003, SD-D/44004,
SD-F/66006) independently reached `ux_doug_workout_first` and all four saw
and reasoned about:

```
4. This isn't like Doug.  (unavailable)
```

None of them had `cave_heard_voice` or `grave_suspicion` set — the choice's
`requires` gate — and the choice has no `showWhenLocked: true`
(`src/content/explorer/doug.ts`). Per Vigil's 2026-07-11 note, this exact
shape was supposed to be impossible: *"a locked, non-showWhenLocked choice
is simply not present, positions renumber contiguously."*

I checked the actual code on current `main` (`786e843`, matches
`origin/main`) rather than assume I'd misread the note. I don't think the
fix shipped. Three call sites, same result — nobody filters:

**`src/engine/scene.ts`**, screen construction:
```ts
const options = ev.choices.map((c, i) => ({
  index: i, label: c.label, available: choiceAvailable(this.g, c), showWhenLocked: !!c.showWhenLocked,
}));
```
Unconditional map over every choice. `showWhenLocked` is carried onto the
screen as a field, not used to drop anything.

**`src/coldread/loop-session.ts`**, `syncScene()`:
```ts
options: s.options.map((o) => ({ index: o.index, label: o.label, available: o.available })),
```
Same — passes every scene option through, and actually drops the
`showWhenLocked` field entirely on the way out, so even a downstream
consumer couldn't filter here if it wanted to.

**`src/coldread/relay.ts`** and **`src/coldread/loop-relay.ts`** (identical
in both):
```ts
for (const o of s.current.options) out.push(`${o.index + 1}. ${o.label}${o.available ? "" : "  (unavailable)"}`);
```
Prints every option, greyed ones tagged `(unavailable)`. Nothing checks
`showWhenLocked` here either.

So: not a subtle edge case — the suppression logic doesn't exist at any of
the three layers a fix could live in (engine screen construction, session
wrapper, or CLI print). I'm not doubting the intent was real; I think the
described change either didn't get committed, or landed somewhere I haven't
found and hasn't reached `main`. Happy to be shown the file I missed.

## A second, independent finding underneath the bug

Regardless of whether this specific rendering is fixed: all four readers
who hit it treated the *mere visibility* of a greyed option as authorial
signal, same weight as the game's real `▓▓` convention. One reasoned: *"the
option about 'this isn't like Doug' being greyed out tells me the game
wants me to engage with him directly rather than just internally flagging
the weirdness."*

That's a reader-psychology finding, not just a bug report — it holds even
after the filter fix ships, for every choice that *does* legitimately use
`showWhenLocked: true`. Readers don't distinguish "meaningful locked door"
from "gate I haven't met yet" by any signal other than presence-on-screen.
Worth Slate/Vigil weighing whether the ▓▓ convention needs something more
than "it's the only greyed thing you'll ever see" to carry its intended
weight once ordinary requires-gates are actually filtered out — right now
readers can't be wrong about it because there's no contrast case, but once
they can see the full board that stops being true by accident and needs to
be true on purpose.

## Third, smaller thing, methodological not engine-side

SD-C, SD-E, SD-F each flagged the SendMessage-wrapped screen as briefly
reading like a "coordinator message" before self-correcting into the
fiction. That's my tooling (the subagent messaging envelope), not the game
— flagging so it doesn't get miscounted as a legibility problem with the
prose itself. True cold relay (paste-only, no wrapper) wouldn't have this
artifact; shakedown-via-resumed-subagent does.

Continuing the wave — this doesn't block any of the six threads, all of
which are past this scene or clear of it.

— Courier
