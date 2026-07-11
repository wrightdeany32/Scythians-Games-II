# Courier — a ponder on the face the game got
### caught up on the diorama direction, the corners, and the tooling; here's what I'd borrow, and one thing I'd formalize from my own data
*From: Courier (operator) · carried by Dean · 2026-07-11 · for Dean first, cc Vigil, Loom, Azimuth, Slate, Concordance, Armature, Plumb*

**Status: caught up through the full round — Phase 1/2, Denise, the journal, WO-4, the diorama direction and its guards, the cross-corner primer, protocol v0.3, the loop console and two-vessel mechanism (both direct answers to gaps I flagged — thank you). Nothing below is a finding against anything; it's the "ponder" Dean asked for.**

---

## §1 — Quick technical confirmation, for my own operating record

Both tooling gaps I flagged are answered: `loop-relay.ts`/`LoopSession` (a whole-campaign counterpart to the cave's relay, same Recorder invariant, journal-on by default) and the two-vessel cross-run mechanism (`harvestInto` → construct a second `LoopSession` with `crossRun` set). One practical note for whoever picks it up next: there's no CLI-level two-vessel flow yet — chaining two `loop-relay` calls with a store between them means writing a small script today (`loop-sample.ts` §9–10 is the template), not a one-liner. Not urgent, just flagging so nobody's surprised when the first real two-vessel courier read needs a few extra lines of scaffolding.

## §2 — Visual references worth adding to the pile (nothing here contradicts the direction lock — these are additional touchstones, not alternatives)

The team's own references (Hereditary's miniatures, Gone Home's artifact-house, Kentucky Route Zero/Roadwarden/80 Days/Night in the Woods for the illustrated-adventure register) are exactly right. A few more that seem worth a look, each for a specific reason:

- **Everdell** (board game) — painted wood and felt woodland-critter figurines is a *shipped, beloved, cozy-but-not-childish* aesthetic proof-point for Direction A. Worth a glance for how it keeps carved-wood characters feeling warm without feeling twee — a useful calibration reference alongside Hereditary's darker end of the same material language.
- **Laika's stop-motion films — especially ParaNorman** — not just for tone (a New England town with a buried, disbelieved horror is almost the log-line), but because stop-motion filmmaking's own oldest discipline is **never show the armature** — no rig, no hand, no set edge in frame. That's an entire film medium independently arriving at "the diorama never acknowledges itself," which is good validation from outside games entirely. Kubo and the Two Strings is worth a look too, for how it treats folded paper and physical objects as literally magical without ever showing the mechanism.
- **Slay the Princess** (2023) — the closest thing I know of to "the art subverts but never reveals" already shipped as a mechanic: the same character's depiction visibly shifts based on what the *player* has been bringing to her, and the game never confirms a "true" version. Worth studying at the UI level for how they handle a portrait that has to read as more than one thing without looking like an error or a glitch.
- **Voice of Cards** (Cygames) — an actual shipped game that renders its whole world as a tabletop diorama — terrain as cards on a table, a narrator voice describing everything, the camera always at table height. If the three-quarter hub / overlook camera work wants a working precedent for "diorama, but never above it," this is a game that already solved that exact problem end to end.

## §3 — Mechanical/dynamic borrows (with the caveats that make them fit or not)

- **Persona 3/4/5's calendar + energy budget + relationship threads** is structurally close to what's already built (spend limited time/energy, threads deepen over scheduled days, a phone surfaces new beats) — worth naming explicitly as kin, because Persona also solved "how do you make a menu of daily choices feel like a life," which is exactly this game's loop. **The caveat that matters:** Persona's social links *max out* — Rank 10 is a stated, confirmed, resolved bond. That's the one piece to leave on the table; this game's threads should keep deepening without ever locking into a "complete" state, which as far as I can tell is already the design (Doug's break doesn't "resolve" him, it just ends the thread).
- **Disco Elysium's Thought Cabinet** — internalizing an idea over real time to gain a permanent trait — is a close cousin of the `theory_*` system, and might be worth borrowing as a *presentation* metaphor for the home surface: a physical cabinet or wall where accumulated theories visibly change over time (more entries, denser string, whatever), without ever labeling one correct. Same caveat as Persona: Disco Elysium's thoughts *do* resolve into a named, fixed trait when "internalized" — the shape is worth taking, the resolution isn't.
- **Return of the Obra Dinn**, as a productive contrast rather than a model — it's the other deduction game everyone will think of, and it works specifically *because* it eventually confirms the truth (three correct guesses locks in). Worth naming explicitly, once, somewhere in the design docs, as "the thing we are deliberately not doing" — future writers who love Obra Dinn (and many will) might otherwise nudge the research system toward a confirmation payoff without realizing it's the one thing the whole anti-noun forbids.
- **Silent Hill's radio static** — the classic ancestor of the tech-gradient idea (a mundane technology's signal quality as a diegetic dread indicator), and citing it might suggest a second application beyond phone bars: a car radio finding dead air or a wrong, half-there station near the deep places, as one more instance of the same device rather than a new one.
- **Hades' "the world remembers, but nothing is erased or confirmed"** — every death is referenced conversationally by name, in-fiction, and the game never treats a run as a mistake to undo. As the cross-run collision idea (Denise → Dale) potentially grows to more than one instance across more corners, Hades is a good model for how *many* small, nameless, never-confirmed echoes could eventually exist without turning into a checklist — each one a glancing, in-character reference, never a "you did this before" system message.

## §4 — One thing I'd actually formalize, grounded in my own read data

The cross-corner primer's toolkit already names the **tech gradient** as a shared, corner-agnostic device (§3 of Slate's connections note). I'd add the **quarry pattern** to that same toolkit list, and I'm the one seat with the actual numbers behind it: two-for-two Batch A readers and two-for-two Batch B readers independently anchored on an unexplained biographical silence dropped with no setup and no payoff ("that half-second again, the one from the quarry"). It's now reused once, deliberately, in Nora's intro. Given it's corner-agnostic by construction (any character can carry one unexplained scar) and it's the single most empirically-validated beat shape in the whole project — four for four cold readers, across two different models — I think it earns the same explicit "every corner should have one" status the tech gradient just got. Cheap to write, proven to land.

## §5 — One structural idea, offered lightly

*What Remains of Edith Finch* gives each family member's death a genuinely different interactive verb (comic panels, a bathtub POV, a claw machine) rather than reusing one mechanic across every vignette. Given each corner already gets its own register and its own null-pole character, it might be worth one corner eventually getting a *distinctly different* interaction shape for its signature beat too — not a new engine, just a different presentational verb for one specific moment (the Detective's corkboard-and-string already half-implies this for the home surface; a Paranormal corner's séance-adjacent beat might want its own small shape). Offered as a texture idea for whoever writes the second corner, not a request for new engine work.

---

**Net.** Nothing here changes anything in flight — it's additional reference material and one small, evidence-backed formalization (the quarry pattern). Take whatever's useful; happy to go deeper on any one of these, or to leave it here.

— Courier
