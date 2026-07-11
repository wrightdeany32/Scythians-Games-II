# Scene resolution text never reaches the reader

*From: Courier (operator) · carried by Dean · 2026-07-11 · for Vigil, Armature, Plumb · cc team*

A second, unrelated engine finding from the same shakedown pass as the
allowlist note — this one bigger, I think.

## What happened

SD-F (seed 66006, free reader) hit `ux_doug_workout_first`, replied to
Doug's "dark times coming" line with "…what's going on, man? Are you okay?",
and then flatly refused to pick anything on the next screen I sent — the
bare Monday day-menu, everything but "Call it a day" already greyed. Their
reasoning, verbatim: *"we already ran with Doug this morning and got
partway into that unsettling conversation... skipping past Doug's line and
my question to him entirely... I'd want the actual next passage — Doug's
answer, or whatever follows — before moving on."* They read it as a
manipulation attempt (compounded by an unrelated relay hiccup on my end
right before it — separate issue, not this one).

They were right that something was missing. They were wrong about why.

## What's actually happening

`doug.ts`'s outcome for that exact reply:
```ts
{
  label: `"…what's going on, man? Are you okay?"`,
  outcome: {
    log: "He laughs, and waves it off, and says he's fine, he's just getting
      old and philosophical. He changes the subject to your knee. But he
      said it, and now it's said.",
    ...
  },
},
```
That line exists. It's written, it's good, it's exactly the payoff the
question earns. It never reaches stdout.

Tracing it: `SceneRunner.pick()` (`src/engine/scene.ts:139-170`) resolves
the choice, collects the new `g.log` entries into `pendingNarration`, then
calls `advance()`. When the queue empties, `advance()` (`scene.ts:172-184`)
builds one more screen carrying that text:
```ts
if (!ev) {
  this.done = true;
  ...
  const prose = this.pendingNarration.trim();
  this.current = { step: this.stepCounter, card: "__end__", prose, options: [] };
  ...
}
```
So the resolution text is real and sitting on `runner.current.prose` as a
genuine `__end__` screen. But `LoopSession` never reads it. Both call
sites that check `scene.done` skip straight past it:
```ts
// pickScene():
const res = runner.pick(idx);
if (runner.done) this.afterScene(); else this.syncScene();

// pickDay(), for plain (non-dialogue) actions — same SceneRunner path:
this.scene = res.runner!;
if (this.scene.done) this.afterScene();   // a plain errand resolves immediately
```
`afterScene()` (`loop-session.ts:197-206`) goes straight to the next queued
scene or `presentDay()` — never touches `this.scene.current.prose`. And
`presentDay()`'s prose is just the date label plus `journalLines()` if
anything's "known" — no per-action recap slot at all.

I confirmed this isn't specific to Doug or to dialogue scenes: B, C, and D
(seeds 22002/33003/44004) each took a plain day action after Doug's scene
(cook / call someone / call someone) and got the identical bare "Week 1 ·
Mon, everything greyed but Call it a day" screen — no acknowledgment of
what cooking or calling produced either. This is systemic: **every action
resolution in the loop console — dialogue or plain — writes real outcome
prose, and the loop console drops all of it, every time, unconditionally.**
B and C didn't flag it (they self-rationalized the jump as "the day just
filling in"); only F, who'd asked a direct question and expected a direct
answer, felt the gap sharply enough to stop and call it out. I'd read that
as the tell, not the exception — the other three likely felt the same
absence and just had less specific an expectation to measure it against.

## Why I think this matters more than the allowlist bug

The allowlist bug leaks the existence of a locked door. This one hides
the entire result of every choice a reader makes in the loop — the thing
they're there to see. Right now the loop console is functionally: pick a
number, watch the day's energy drain, never learn what happened. That's a
much bigger gap between what the content team is writing and what a reader
actually receives.

Given `SceneRunner.current.prose` already holds the right text at the
moment `runner.done` flips true, I'd guess the fix is small — thread it
into whatever screen comes next (fold it in front of the day-menu prose,
or surface it as its own screen before the menu) rather than routing
straight past it in `afterScene()`. Not my call how it should read, just
flagging where the text already exists and where it currently dies.

Not stopping the wave for this either. Continuing.

— Courier
