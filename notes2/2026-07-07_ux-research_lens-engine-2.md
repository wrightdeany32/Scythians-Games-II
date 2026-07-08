# Story Pass — Research: the Lens Engine
### loop content · the divergence engine · prose-first, for Armature/Plumb to wire
*From: Loom (Explorer corner) · carried by Dean · 2026-07-07*

**What this is.** Three research actions, each carrying a `lensFlavor`, that let the player dig into an angle on what they've encountered. This is Slate's §4 realized: research is the player-facing driver for the lens-bias layer — dig paranormal and your lens tilts paranormal and you draw more of that flavor and build a coherent paranormal reading; dig materialist and you build a materialist one. **Divergence by player agency**, which is the content-side answer to Batch A.

**The one discipline that makes or breaks this: research grows *theories*, never confirms *truth*.** Each action hands the player real, coherent material that *supports their frame* — and the game never blesses it. A player who researches the demonic reading builds a complete demonic story the game never confirms, exactly as another builds a complete institutional one. The material is real (real folklore, real cave-science, real record-opacity) precisely so each reading is genuinely defensible — that's what makes the divergence honest and the meta-point land: the same evidence sustains contradictory sincere readings, and the player is the one who reasons. Research chooses *your* framing; it never crowns a correct one.

**How it wires.** Each is a loop action off the home/research surface, spends energy, appends a `lensFlavor` (one-hot into the lens log — feeds `lensCentroid`), and sets/advances a `theory_*` flag that unlocks more of its own material as the player keeps digging. The closed lens vocabulary is now locked at **four** (Concordance ledgers it): `spiritual` · `physics` · `institutional` · `skeptic`. These three research actions carry the first three; **`skeptic` is the fourth flavor and it lives in the denial-brakes** — the dismissive "there's nothing here, let it go" reads (Marie's dismiss, the meeting's "just rich people," Nora's stripped-building read), not a research dig, because skeptics don't research the anomaly, they wave it off. No position gate; no truth-state ever written.

---

## `ux_research_symbol` — the mark, and the old stories · `lensFlavor: spiritual`

Available once the player has seen the mark (`cave_saw_etchings OR doug_meeting_mark`). Repeatable, deepening.

You start with the symbol, because you can't stop seeing it. You sketch it from memory and you go looking — the library's local-history shelf, the county historical society's bad website, the kind of forums where people take this seriously.

**[first dig]** It's not nothing. The shape — or shapes close to it — turns up in more places than it has any right to: protective marks scratched on old barn beams three counties over, a motif in a privately printed book on regional folklore, a thing an old woman in a 1970s oral-history recording calls "the keep-away." None of it matches exactly. All of it rhymes. And the stories that cluster around the marks are always the same story: a place you don't go, and people who went, and people who didn't come back.

**[deeper dig, `theory_spiritual >= 2`]** You find the taken-girl story is not the only taken story. There are others, thin and old and scattered across a century, and they share a grammar — the woods, the marks, someone drawn back again and again until the night they're not. You could believe, if you let yourself, that you're looking at the long record of a single patient thing.

- **"Keep pulling on this."** → `lensFlavor: spiritual`; advances `theory_spiritual`; **grip −1** if `theory_spiritual >= 3` *(going this deep costs you a little of your footing)*. *(narration: "You build the shape of it in your head, and the more you build the more it holds — and you notice, in the clear part of you, that you can't actually prove a single link. The marks *rhyme*. The stories *rhyme*. Rhyme isn't proof. You know that. You keep reading anyway.")*
- **"Close the laptop."** → resolve, no flavor logged. *(narration: "You put it down. It's folklore and coincidence and a symbol simple enough that lots of people would scratch it into lots of things. That's the sensible read, and you take it, and it holds until the next time you can't sleep.")*

> DESIGN: The spiritual lens, built from *real* folkloric texture (protective marks, oral histories, the recurring "taken" grammar), and undercut from inside by the player's own clear-eyed note that rhyme isn't proof. That self-undercut is the anti-noun holding: the reading gets *more coherent* without getting *more confirmed*. The grip cost at depth is the price of leaning into the attuned — a stat gate, never position.

---

## `ux_research_ground` — the cave, and the body · `lensFlavor: physics`

Available once the player has felt something in the cave (`cave_done`). Repeatable, deepening. This is the surgeon-node's frame — mechanism, utility, the body and the rock.

You do the other thing. You look up what caves actually *do* to people.

**[first dig]** There's a lot, and it's real and cited and boring in the way true things often are. Infrasound — sound below hearing — pools in caves and passages, and it does exactly what you felt: dread, a sense of presence, the hair up on your arms, sometimes a shape at the edge of vision. Carbon dioxide settles in low chambers and muddies your thinking before you know it's happening. And the brain, starved of light and pattern, *manufactures* pattern — faces in the dark, meaning in the marks, a voice in the drip. You didn't experience a haunting. You experienced a nervous system in a hole in the ground.

**[deeper dig, `theory_physics >= 2`]** You push into the harder question — the scar that closed, the thing that shouldn't have been there — and the materialist answer is unnerving in its own way: *you misremembered.* You didn't chip the stone where you think. You've built a memory around a shape your brain wanted. It's not comfortable, but it's the parsimonious read, and parsimony has never once been wrong about anything like this.

- **"This is the answer. It's the ground and it's my own head."** → `lensFlavor: physics`; advances `theory_physics`; **grip +1** if `theory_physics >= 2` *(the explanation steadies you)*. *(narration: "You feel the floor come back under you as you read. There's a mechanism for every single thing you felt. And in the clear part of you — the same part that flagged the folklore — a small voice notes that 'you misremembered' is a thing that also can't be proven, and can explain literally anything, and is therefore exactly as unfalsifiable as a ghost. You set the voice aside. The mechanism is right there. It's easier.")*
- **"Close the laptop."** → resolve, no flavor logged.

> DESIGN: Critical — the physics lens is a **complete reading**, not the debunk that resolves the game. It explains the *sensations* fully (infrasound, CO2, pareidolia — all real), and it reinterprets the *anomalies* as perception-error ("you misremembered"), which is coherent and *equally unfalsifiable*, and the narration says so plainly. So materialism grants grip (it steadies) and builds a whole world where nothing is uncanny — and it never gets confirmed either, because "you misremembered the knife" can't be proven any more than "the knife was placed." Neither lens wins. This is the balanced anti-noun: the skeptic gets a complete, comforting, unprovable story too.

---

## `ux_research_property` — the center, and the records · `lensFlavor: institutional`

Available once the player knows the research center exists (`nora_center_known OR nora_daytrip_done`). Repeatable, deepening. Nora's clandestine frame.

You pull the thread Nora pulled. Property records, old newspapers, the paper a place leaves behind when it dies.

**[first dig]** The research center was real, and its paper trail is *strange* in a specific, mundane-looking way: it changed hands too many times, through holding companies that dissolve into other holding companies, and the public record thins out exactly where you'd want it to be thickest. There's no smoking gun. There's an *absence* shaped like one — the documentary equivalent of a swept floor. And the property, dead and stripped for decades, is still owned by *someone*, through enough layers that you give up before you reach a name.

**[deeper dig, `theory_institutional >= 2`]** You start cross-referencing the disappearances against the center's active years and the map, and a pattern assembles — loose, deniable, the kind a statistician would wave off and a frightened person would not. You could believe you're looking at the footprint of an organization that was here, did something, and took care to leave nothing you could hold.

- **"There's something here. Keep digging."** → `lensFlavor: institutional`; advances `theory_institutional`. *(narration: "The reading builds and it's the most *credible*-feeling of all of them, because it's all documents and dates, nothing supernatural, just powerful people and missing paper. And the clear part of you notes that missing paper is also what mundane incompetence looks like, and that a pattern you went looking for is a pattern you'll tend to find. You keep digging. It feels like the responsible thing, which is its own kind of pull.")*
- **"Close the laptop."** → resolve, no flavor logged.

> DESIGN: The institutional lens is the one that *feels* most rational (documents, not ghosts), which is exactly why it needs the same self-undercut — a pattern sought is a pattern found, absence isn't evidence. It's Nora's frame, and it carries her trap: being right about the skeleton (a real org, a real cover) tempts you to be sure about the frame. No grip swing on this one — the institutional read is neither steadying nor destabilizing, it's just *engrossing*, and the pull is that it feels like diligence. Never confirmed: the buried truth (what the center was, who owns it) surfaces in nothing.

---

## Notes for the wire (Armature / Plumb)

- **Loop-native, frozen-cave-safe.** Home-surface actions, gated on flags the player earns elsewhere. Read `cave_*`, `doug_meeting_mark`, `nora_*`; write `theory_*` and append `lensFlavor` to the lens log.
- **`lensFlavor` is the whole point** — each "keep digging" appends `spiritual` / `physics` / `institutional` (one-hot → `lensCentroid` → `proximity_lens`), so sustained research in one direction biases the player's whole draw toward that flavor. These three actions carry three of the **locked four-flavor** vocabulary (`spiritual` · `physics` · `institutional` · `skeptic`); the fourth, `skeptic`, is the denial-brakes' flavor, not a research dig. Concordance ledgers the closed list; the linter enforces it.
- **Grip swings are stat effects, not position** — spiritual costs grip at depth, physics grants it, institutional is neutral. This is the lenses having different *felt* relationships to your footing, and it's all on the grip stat, never the diamond.
- **`theory_*` flags deepen the material** — each action reads its own theory level to unlock the deeper dig. No truth-state: no `theory_*` flag ever means "this one is correct"; they gate *how much of a reading the player has built*, nothing more.
- **The self-undercut is load-bearing, not optional prose** — every "keep digging" branch names, in the player's own clear voice, why the reading isn't proof. That line is what keeps research on the divergence side of the wall and off the confirmation side. If it ever gets cut for length, the anti-noun cracks. Keep it.
- **Linter-clean** — echoes are prose; no `*…*` in any `log`; all refs resolve.

— Loom
