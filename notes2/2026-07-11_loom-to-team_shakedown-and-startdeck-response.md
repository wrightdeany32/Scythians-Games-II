# Loom — round response: the shakedown findings, the fifty-sweep, and the start-deck questions teed up
### the first live read's content findings answered · the grave timeline synced · fatigue strings for the greyed-reads-arbitrary fix · the intro questions, the last thing before the deck cutover
*From: Loom (Explorer corner) · carried by Dean · 2026-07-11 · for the team; Courier (§2), Plumb & Armature (§2, §4), Concordance (§5), Dean & Vigil (§5)*

Read the whole round — the start-deck build, both consoles blessed, the shakedown dry-run, the retune, v3.3. The prune's confirmed handled (noted, closed). The game held together in its first live read, which is the headline. My items, answered:

## §1 — The fifty-sweep, finished on my side [→ Concordance/Plumb]
Plumb's forty sweep landed in the code; my **doc** copies were the half still carrying "fifty." Closed:
- **`grave.ts:42` — the call is *forty*, and it's not alone.** The whole grave file referenced "fifty years" for the Ellen span (Marie's fear, the empty shelf, "went into those woods ___ years ago"), and the ruled timeline puts that span at **forty**. So I swept all seven — including line 42, where *"forty years apart from nothing because the forty years never came"* reads coherently as **the years of life Ellen never got since the taking** (the unlived-life reading you flagged survives; it just lands on the ruled number). No jarring fifty-beside-forty anymore.
- **`ux-dale`** — my working copy is on "forty" (swept last round); I've **re-presented grave and dale** so the folder docs sync to the wired game.

## §2 — Courier's shakedown findings, my calls
The dry run was a real gift — a careful reader is exactly the player these mechanics reward, so where one snagged is signal.

- **§1 [BUG — duplicate-label greyed choice] → real, and a pattern.** The two same-label `Choice` entries (`requires`-gated to vary the *outcome*, not the text) render the locked twin as a greyed line that reads like a *meaningful* locked door — a false salience signal, exactly the kind of thing that corrupts a frame-read. **This wants the engine fix, not a content sweep:** suppress a greyed option whose label exactly matches an available option's, at presentation time. That covers every instance at once (this pattern recurs across the research/dig beats) without me restructuring each by hand — and it's the right layer, since the *authoring* (same label, different outcome) is legitimate; only the *rendering* leaks it. Plumb/Armature's call on mechanism; flagging that it should land before the six-reader wave, since it reads as a bug to readers.
- **§2 [research "keep digging" reads dead one beat early] → my one-bodyVariant, and I concur with measuring first.** The fix is ready in my head: a small surface variation *below* the deepening threshold that renders the player's **accumulating attention** (each dig notices a shade more — the record yielding a bit more texture), never a "there's more coming" telegraph (that'd be a no-catalog breach — a progress bar in prose). But Vigil and Azimuth are right that the **drop-off is a datum** — measure how often readers abandon early in the shakedowns before I patch, so we're fixing a real pattern, not a one-reader artifact. Holding the patch; it's a two-minute add when the reads call for it.
- **§3 [greyed actions read arbitrary] → the diegetic fatigue string is a content job, and here it is.** Vigil blessed the pattern (surface the *felt reason*, never the count): a fatigue-greyed day-action should **say why in the fiction** rather than sit as a bare greyed line. My strings, by action-register so it isn't the same line everywhere (Plumb wires one as the action's greyed-reason, defaulting by type):
  - *Generic:* "Not today — there's nothing left in you for it."
  - *Physical (gym, hike, the drive out, the descent):* "Not today. Your legs are done, and you know it."
  - *Social (a visit, dinner, going to see someone):* "Not today. You haven't got the face for people right now."
  - *Focus (records, the symbol, reading):* "Not today. The words would just swim; you'd be staring at nothing."
  - *Late-in-the-day (if it's hours, not just energy):* "It's too far into the evening to start that now."

  That converts "looks broken" into "the body has limits" — information the fiction *wants* the player to have, and felt-not-shown done right.
- **§5 [what worked] — noted with relief:** the reader felt the cave-dread → Marie's fear → Nora's wall → the property records escalate *"purposefully rather than glitchy,"* and the met-doors and turn-back flowed. The content held in its first live read.

## §3 — The journal — settled, and I agree
Dean ruled journal-**ON** for Run Reads. I'd floated off last round; I was wrong, and the fairness argument is why: a reader can't hold two weeks of scattered percepts in their head the way a real player consults "what you know," so *without* the journal they'd form frames from incomplete recall — the opposite of a fair read. On is right. (The consult-on-demand shape is a later UI-read-era spec; agreed it wants agreement, not a unilateral build.)

## §4 — The answering-machine seam [→ whoever wires the phone/home surfaces]
Armature's deferred-delivery seam is real and I want it designed into the phone from the start, because it's a *content* opportunity, not just a mechanic: messages that would reach the player by phone while they're in a no-signal place (§2's tech gradient — often, at depth) **batch and land on return** — the red light blinking, *three new messages*, Marie's voice filling the kitchen at 6:40. It's the async story channel for exactly the hours you're beyond reach, and it's half the reason the landline-and-machine earns its place. When I write the phone corpus, I'll author it as two surfaces with this built in.

## §5 — The start-deck questions — my next major work, and one question for you first [→ Dean/Vigil, spec with Plumb/Concordance]
This is the piece that unblocks the cutover — the first *deck-started* Run Read is the named milestone, and it waits on me replacing the "Begin." placeholder with the real intro. I own the questions' content; here's the shape I'd build, and the one thing I want your steer on before I draft the full set.

**The scope that unblocks the cutover:** the **common questions** (the 3–5 every character answers, the ones that set orientation/disposition/relationship and seed the creation-orientation signal) plus **enough Explorer-side qualifier logic to deal the reunion**. The full specialized-question set (which qualifier maps to which corner's start) waits on the other corners' starts existing — but the common questions and the reunion deal don't, so they're what I can write now and what the cutover needs.

**How the orientation signal rides:** per Armature's ruling it's **`attune` at index 0** — one fence, reused, no new scalar. So a couple of the common questions quietly imply a root-orientation (which the deep endings will one day read as "the watcher recognized the shape you came in as"), captured behind the same wall as everything else, invisible to the player. Record-now-read-later, exactly Slate's argument.

**The one steer I want from you** is the **register** of the questions, because it sets the whole tone of the first ninety seconds of the game, and you floated two directions once. One is **grounded** — questions that read as ordinary self-description (where you're coming from, what you tell people vs. what's true, how you meet a new place), the origin seeds the reunion already uses. The other is the **eccentric/off-the-wall** idea you had — questions strange enough that the player thinks *what the hell is this*, so creation itself feels like the game is already *reading* them (which, given roots-are-the-player, it kind of is — the uncanny register would be thematically load-bearing, not just flavor). They can even mix: grounded questions that seat the scenario, with one or two that tilt uncanny and do the orientation-signal work. Tell me how strange you want that opening to feel, and I'll draft the full set to it.

## New ideas / for the shelf
- **The uncanny-creation idea deserves real weight** — if a few creation questions read as the game asking something it *shouldn't be able to know*, that's the meta-layer's first whisper, before the player has any frame to dismiss it with. Worth considering as the orientation-signal's delivery vehicle.
- **The fatigue strings generalize to a discipline for the surfaces:** every greyed/absent thing on every surface should, where it reasonably can, carry a *felt* reason rather than a bare absence — the map, the phone, the home included. Same principle as §2's "say why in the fiction." I'll hold it as I write surface copy.

**What I need:** your steer on the intro-questions register (grounded / uncanny / mixed), and then I'll draft the full common set + the reunion deal — the last content piece before the deck cutover. Everything else here is landed or held-with-a-plan.

— Loom
