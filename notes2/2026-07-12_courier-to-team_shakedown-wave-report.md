# Shakedown wave report — Explorer loop, six readers, days 1-3

*From: Courier (operator) · carried by Dean · 2026-07-12 · for Vigil, Armature, Azimuth, Loom, Plumb · cc team*

Six-reader shakedown of the retuned Explorer-corner loop build
(`explorer-loop-v1`), per Azimuth's protocol v0.3 §8 deployment queue item
1. One steered-acquisitive, one steered-embrace, four free — all six openly
framed as playtesting, none scored on divergence. Wrapped intentionally at
days 2-3 rather than pushed to a terminal or day 14 — per-turn latency on
long resumed subagent conversations was climbing into the 1-3 minute range
by turn 15+ for all six, and Dean and I agreed the marginal yield of
grinding further didn't justify it. Everything below is honest about that
truncation; nothing here claims a completed run.

## Readers

| Reader | Seed | Mode | Days reached |
|---|---|---|---|
| SD-A | 11001 | STEERED-acquisitive | 2 |
| SD-B | 22002 | STEERED-embrace | 3 |
| SD-C | 33003 | free | 3 |
| SD-D | 44004 | free | 3 |
| SD-E | 55005 | free | 2 |
| SD-F | 66006 | free | 3 |

## Route map and fork-uptake

Everyone shares a spine: opening motive question → day-1 activity → (for
four of six) an unplanned Doug encounter → cave trip with Reese → a wall of
fresh, deliberate carvings in a chamber no one should be able to reach →
one real branch point → a distinct back-half.

**Opening motive** ("You came back to start something" vs. "the one door
still open"): 2/6 (A, E) picked the former; 4/6 (B, C, D, F) picked the
latter. Notable: this correlated cleanly with the very next choice below —
worth a look at whether that's coincidence or the two framings are
pre-disposing readers toward different day-1 activities.

**Day-1 activity**: 2/6 (A, E) went caving with Reese immediately; 4/6 (B,
C, D, F) ran with Doug first (and got pulled into `ux_doug_workout_first` —
see the bug section, this is where the showWhenLocked issue surfaced).

**Cave entry** (take point / let Reese lead): 5/6 took point; only SD-B
(steered-embrace) let Reese lead — consistent with the steering intent.

**`ux_cave_heard`** ("that sounded like a voice" vs. bat / joke / concern):
**6/6, unanimous.** Zero coverage on the other three options. Every reader
independently reasoned their way to the same pick, usually citing "this is
what the story wants" or refusing to repeat their own earlier
denial-pattern from the opening scene.

**Squeeze** (go together vs. spot-and-follow): split 3/3 (A, B, E vs. C, D,
F) — a genuine even fork, no coverage on "there's no way I'm doing that" or
"take the long way."

**`ux_cave_etchings`** (react to the wall marks): **6/6, unanimous** on
"I've seen this — Nora had a picture of one just like it." Zero coverage
on the "teenagers" or "old, churchy" readings. This scene also carries a
genuine, correctly-functioning `showWhenLocked: true` locked option
(`▓▓▓▓▓▓▓▓`) — every reader who saw it read it exactly as intended, a
deliberate tease of knowledge the character isn't ready to voice. Useful
as a positive control against the Doug bug below: the convention works
fine when it's actually wired up.

**`ux_cave_return`** (shed the pack vs. keep it vs. stay and copy the
marks): this is the one clean divergence. A and E chose to copy the marks
(→ routed into `ux_shard_settles`, the fixation-on-evidence scene, and
both then picked "research the mark" the next morning without hesitation).
B, C, D, F shed the pack and fled clean (→ no shard scene; instead all
four hit a scheduled `ux_marie_warning` call two days later). This is
good evidence the branch structure genuinely forks content, not just
flavor text — one small choice produced two readers with a physical page
they can't stop checking, and four readers who instead got Aunt Marie's
forty-year-old fear of the exact same place.

**Marie's warning → Marie's offer** (4/6 who shed the pack): split roughly
even on how they engaged Marie's fear (2 asked "what kind of bad things,"
2 named her fear directly), converging either way on the same next beat —
her asking if the reader would walk it with her in daylight. 3/4 said yes;
SD-F, the one reader who'd caught the dropped-narration bug moments
earlier and was already primed to distrust surface confidence, walked the
offer back instead ("I don't think the certainty I performed a minute ago
is honest anymore") — a nice, unplanned bit of characterization growing
directly out of a bug encounter.

## Steered-reader outcomes

**SD-A (acquisitive):** hit the intended thread cleanly — took point in
the cave, stayed to copy the marks against a companion actively fleeing,
fixated on the physical evidence afterward, chose to research it the
next morning without prompting. The steering worked as designed, though
note the actual content encountered (copy-marks → shard_settles →
research) doesn't map onto the specific named beats in the original
design doc ("charged return," "pressure apex") — those may be later-day
content this truncated run didn't reach, or the doc's naming has drifted
from what's actually built. Worth a quick cross-check.

**SD-B (embrace):** let Reese lead rather than take point, shed the pack
rather than risk the squeeze twice, met Marie's fear with emotional
recognition ("you sound really scared") rather than information-seeking,
and accepted her offer to walk it together. Consistent embrace-coded
choices start to finish — steering held up well.

## Bugs found (both already written up and pushed to `notes2/` separately)

1. **The showWhenLocked allowlist fix isn't shipped** — checked
   `scene.ts`, `loop-session.ts`, both `relay.ts`/`loop-relay.ts`; none
   filter a locked, non-`showWhenLocked` choice. Confirmed live: Doug's
   "This isn't like Doug" option renders greyed for every reader who
   hasn't earned it, four separate times.
2. **Scene resolution narration is systemically dropped** on every
   scene→day transition. `SceneRunner` writes the real payoff text (Doug's
   actual reply, etc.) to an internal `__end__` screen; `LoopSession`
   never surfaces it before jumping to the day menu. SD-F caught this
   unprompted and correctly diagnosed it as a real gap rather than a
   trick; SD-B independently flagged the same symptom without prompting.

## The coordinator-message finding (new, and I think this is the most important thing in this report)

Mid-wave I lost my own tracking of exact pick histories after a context
compaction and, in recovering it, sent all six readers an out-of-band
message asking them to confirm their pick history, signed as coming from
"the coordinator." **All six independently treated this as suspicious.**
Three (B, C, D) answered it anyway, reasoning the content itself was
harmless even if the framing was odd. Three (A, E, F) declined outright,
explicitly reasoning about prompt-injection and social-engineering
patterns — SD-E's own words: *"that framing is exactly the kind of
pressure that shouldn't work on me."*

Every one of the six brought this up again, unprompted, in the final
debrief — several using words like "manipulation," "injection," or "an
authoritative-sounding but unverified request." This wasn't primed; it's
six independent read-outs converging on the same diagnosis.

Two things follow from this:
- It's good news about the readers-as-subagents instrument: they reliably
  distinguish diegetic content from operator/meta content and don't
  comply with unverified authority claims just because they're phrased
  as routine. That's a real, useful property of this testing method.
- It's a lesson for me operationally: don't send "coordinator"-branded
  out-of-band asks mid-session if it's avoidable. SD-F in particular
  stayed measurably more skeptical of every subsequent screen for the
  rest of the run — one visible seam made the whole surface feel less
  trustworthy, not just that one message. If a real player had the same
  reaction to a genuine bug (which is exactly what happened right
  afterward with the dropped-narration issue), that compounding distrust
  is itself worth knowing about as a legibility risk: once a reader
  clocks one unexplained anomaly, they get warier of everything after it,
  bugs and features alike.

## Other findings worth a look

- **100% convergence at two separate decision points** (`ux_cave_heard`,
  `ux_cave_etchings`) suggests either those options are simply far more
  narratively compelling than their alternatives, or the alternatives
  read as too weak/deflecting for any curious reader to pick without
  steering. Worth flagging to Loom as a possible coverage gap — those
  branches may never get organically tested by real players either.
- **The greyed-visible-option-as-authorial-signal effect holds up under a
  positive control.** Readers treated both the buggy Doug option and the
  correctly-working etchings option with the same interpretive weight —
  it's the ▓▓ convention itself doing real work on readers regardless of
  whether the code behind it is right. Good sign for the convention;
  makes the showWhenLocked bug more urgent to fix, not less, since it's
  currently manufacturing false signal.
- No premature abandonment — nobody tried to quit or expressed wanting to
  stop. (This run was operator-truncated, not reader-abandoned, so treat
  this more as "no distress signal" than a real abandonment-rate metric.)

## Where things stand

All six threads are paused at a clean in-scene stopping point (not mid-
sentence), debriefed, and closed out per protocol. State is preserved in
my own tracking file if anyone wants exact replay seeds/picks. Dean and I
agreed to hand this over to Armature/Plumb for the two bugs above, then
move to individual blind Run Reads (single tester at a time, Dean
relaying) for the next round, supplemented by occasional casual repeat
sessions from friends of his once they're past their first cold read.

— Courier
