# Loom — Phase 2 content-pass checkpoint
### corrections to existing content (done/blessed) · rulings affirmed · the new-content list, with my questions and starting ideas for Dean's branch direction
*From: Loom (Explorer corner) · carried by Dean · 2026-07-09 · for Dean first; Plumb, Armature, Vigil, Slate, Concordance, Courier cc*

This is the checkpoint before we generate new content. Part 1 is everything I could do without writing new scenes — done in my working copies, or blessed for Plumb's code. Part 2 affirms the rulings. Part 3 is the new content I want to contribute, with my questions and initial ideas, laid out so Dean can give direction by branch.

---

# PART 1 — CORRECTIONS TO EXISTING CONTENT (done / blessed)

## 1.1 · The ruled timeline — applied
Per Dean's ruling (via Concordance §1):
- **Doug's incident = 30y** — the break's *"held forty years"* → *"held thirty years"* (done last round; the five other "thirty" stand).
- **The Ellen night = 40y** (not 50) — Dale's seven *"fifty years"* → *"forty years"* throughout (done this round). Dale's age at the incident, **fourteen**, stands, which puts him **~54** now.
- **Marie's *"forty years"*** of fear were already right — unchanged.
- The wake reads cleanly: Ellen taken + Dale spared ~40y → Doug reached-for ~30y → the player. Taken-in vs reached-for-and-survived, intentional.

## 1.2 · The Marie mutual-exclusivity — SPLIT (implemented)
Decision made and implemented in `ux-marie-opening`. The old three-way fork (`knows_ellen` / `pointed_to_dale` / `pattern_open`, pick one) forced the Dale thread and the convergence to trade off and made the `dale_bond` relief valve unreachable in any convergence run. **Split**, because the paths are too asymmetric to be a fair choice (Dale is a whole thread; the pattern side is one percept), and because the null pole is best *experienced* — gating Dale hides him from pattern-players, so the split reaches him to *more* players, not fewer.

Implementation (reorganizing existing prose, no new scene):
- Marie **names Ellen and points to Dale in her main text**, so `pointed_to_dale` and the name land for **every** player. The card sets `pointed_to_dale` regardless of the choice below — the wiring invariant is that it's never gated behind the pattern probe.
- The **pattern probe** (`asked_pattern`/`pattern_open`) stays as the one branching choice — the unfalsifiable seam. Second choice ("I'll go and find him. Dale.") is a texture alternative that leaves the pattern alone; both lead to the grave beat.
- Convergence stays reachable (`pattern_open ∧ nora_daytrip_done`), now **independent** of Dale.

→ **Plumb: re-wire `ux_marie_ellen`** to the new structure (`pointed_to_dale` on card entry or both branches; `pattern_open` on the probe only).

## 1.3 · `knows_ellen` — DROPPED
Dead flag (Armature confirmed: set, functionally read nowhere — the actual gates are `pointed_to_dale` and `grave_suspicion`). Its intended payoff (Ellen's name surfacing in Nora's research) is compass-adjacent — it edges the sealed Ellen/research-center connection — and is already carried, safely, by the convergence percept. Removed from `ux-marie` (set, exit flags, wire note, close design note), `ux-dale` (upstream + reads), `ux-grave` (upstream + reads). Marie names Ellen in prose, which also **fixes a real bug**: the grave beat used "Ellen" but the name was gated behind the old choice-1.

→ **Plumb: drop `knows_ellen`** from the code (it's now unset and unread everywhere).

## 1.4 · The 29 line-edits — BLESS all but one
Plumb's conversion pass was exemplary — every meaning-touch logged, all reversible. **Bless every item** with the single exception below. Naming the load-bearing ones for the record:
- **#1 doug_off tint prose**, **#5 "deflated, not hurt"**, **#8 "You sit with it, and she lets you"**, **#17 research close narrations**, **#21/22 return-trip replies + speechless log** — all in my register, all bless.
- **#13 grave-close restructure** — bless. Gating the "Marie was right" vindication on `grave_confirmed_empty` is correct: the left-closed player confirmed nothing and shouldn't read it. (See 3.5 for an optional enhancement.)
- **#15 research grip-swing thresholds** (pre-dig counts), **#16 physics cap 8**, **#19/20 breather grip +1/cap 7 + energy** — bless (tuning is Armature's; the readings match "at depth").
- **#25 mark-coda gate** (`cave_etchings_seen ∨ meeting_mark_seen`) — bless. A callback for a player who never saw the mark is a percept they never earned; the gate *enforces* the anti-noun.
- **The exit labels, de-italicized logs, magnitudes (attune ±0.25, dinner +0.2/+0.3, meeting ±0.4, break +0.7/−0.6, Y=0)** — bless, all.

**The one revert — #2:** the workout log dropped Doug's *"family friend"* descriptor (*"the family friend who'd decided"* → *"when he decided"*). **Keep "family friend."** It establishes Doug's relationship to the player in his very first beat, and it appears nowhere else in the opening if it's cut. My source retains it.

## 1.5 · The percept-discipline wiring catches — confirmed
Both of Plumb's percept-gates (the mark-coda, the grave vindication) are correct, and I want to affirm the pattern Vigil/Slate/Concordance named: **the conversion became an anti-noun check.** Gate every callback and vindication on the flag that means the player actually *perceived* the thing. That's the discipline holding at the mechanical layer, and I'll author to it from here (every future callback gated on its perception flag).

---

# PART 2 — RULINGS AFFIRMED (from the content seat)

- **Morning-pileup → front-insert** (Armature ruled, Vigil concurred): affirmed. A pressure stage firing mid-conversation inside Marie's woods walk breaks the scene's integrity — front-insert makes a scene play contiguously, which is what the authoring assumes. Byte-safe for the linear cave. Plumb builds.
- **Lens-silence scope — pre-frame silent, frame-setter speaks** (Vigil confirmed): affirmed, and it matches intent exactly. `ux_nora_rangers` (the liability beat, dread before a frame) is silent; `ux_nora_explore` (where the player reads the building institutionally or skeptically) correctly carries the flavor. The silence protects the frame the beat lets the player build.
- **Doug-break vs. the calendar → defer-terminal** (Slate, Armature, Concordance, Vigil all lean it; I concur): the principle is no authored thread-climax dies to the guillotine, and the *mechanism* I'd back is defer-terminal (the calendar-end holds while an authored climax is scheduled in-flight) over a bigger `lastDay`, which risks a hollow second week. Doug's reclamation is the thread's whole payoff — it can't die to a clock. Tune the actual length with the bots; hold the principle.

---

# PART 3 — NEW CONTENT — for Dean's branch direction

Here's what still needs writing. For each: what it is and where it sits, my questions, and where I've already got an instinct. Give me the direction by branch and I'll draft.

## 3.1 · `ux_explorer_opening` — the arrival (THE flagship's first beat)
**What it is:** the creation/opening scene — the player's first moment in the whole game. Sets `arrived_town` + `thread_doug`, schedules Marie (+2). Coordinate-silent (the creation deck seeds origins). This is the one I most want your steer on, because it frames everything.

**My questions:**
1. **Why is the player here?** Arriving to a fresh start? Moving back? Inherited a place? Following someone? A job? This is the hook that starts every run, and the fresh-character-each-run structure means the opening establishes *this* character's reason.
2. **What is the player to the town — new, or returning?** Plumb's stub has a "family roster," and the player already has Marie (family?) and Doug (the family friend / mentor who's picked them up "since you were nineteen"). So there are roots here. Is this a hometown they're returning to, or a place they have family in but are new to?
3. **Who is Reese?** Reese goes into the cave with the player and rides the return trip ("Reese doesn't answer"). Reese's pin is in the creation stub. A friend? Partner? Sibling? What's the relationship, so the cave and return carry the right weight?

**Where I'm leaning:** ordinary life on the cusp — boxes half-unpacked, the hills at the edge of everything, the specific texture of a small town that has a woods it doesn't talk about. The two coordinate-silent flavor choices as *disposition*, not stat: the kind of person the player is (reluctant vs. drawn; settler vs. pryer) — seeding tone, not position. But the reason-for-coming and the Marie/Doug/Reese relationships are yours to set, and they change everything downstream.

## 3.2 · `ux_nora_intro` — Nora's establishing call
**What it is:** Nora's first appearance — a call after the first cave trip (`cave_done`). Sets `thread_nora` + `nora_center_known`; the second choice plants `noticed_nora_fray` for the attentive player. Nora is the institutional/materialist lens (the research center, the disappearances-against-dates).

**My questions:**
1. **Who is Nora to the player?** A friend? An old contact? A journalist or researcher the player knows? The "establishing call" means she reaches out — so there's a prior relationship. What is it?
2. **Why does she call after the cave?** Does she know the player went? Is she reaching out to a fellow traveler because she's found something? Is the timing coincidence or does she track the woods?
3. **Nora's fray — what's under it?** `noticed_nora_fray` is the player clocking that Nora is wearing thin, and this is where the **quarry-pattern reuse** would live: a single unexplained biographical silence about *why she's really doing this*. At a high level, what's her hidden stake? (I don't need the sealed detail — just enough to plant the silence so it points somewhere real.)

**Where I'm leaning:** Nora as the materialist counter-melody to Marie's folk dread — someone who's been mapping this from records and disappearances, and calls the player as one of the few who'd believe her. The fray is the investigation wearing on her *plus* the private reason she won't name — the biographical silence. But her relationship to the player and the shape of her stake are yours.

## 3.3 · `ux_shard_settles` — the shard's first night
**What it is:** the beat after `took_shard` (+2 exposure) — the shard's first night in the player's home. Percept-only, anti-noun, in my register. This one I can draft with the least direction.

**My question:** just confirm what the shard physically **is** — a piece of etched stone? a fragment off the cave wall? something worked? I have it as an object the player pocketed that is subtly, deniably wrong (the frugality tell — warm when it shouldn't be).

**Where I'm leaning:** the shard in a drawer, the first night home, the small wrongness (warm when it shouldn't be, a hum you might be imagining, sleep that comes a shade off) — no word of what it is, the way the pressure beat withholds. Four to six sentences. I can write this on a nod.

## 3.4 · The Denise beat — the witness who makes Dale the antagonist (Dean's idea, parked)
**What it is:** your idea — a character (Denise) who reframes Dale as the antagonist, on a path where, because it's exclusive, you never get his account. This is a beautiful felt-but-unprovable move: is Dale the kind man the town made a monster (his read), or the guilty man wearing a good face (Denise's read)? And it's exactly the plant-enough-of-them philosophy — a second-playthrough player who took the Dale road one run and the Denise road the next holds two irreconcilable Dales and no way to adjudicate.

**My questions (for when we build it):**
1. **Who is Denise?** Someone who knew Ellen? A relative? A townsperson carrying the guilty-verdict as personal conviction? This also resolves the parked *"is Dale a renamed Denise or a second witness"* question — your framing now reads as Dale and Denise being **distinct** (Dale the survivor, Denise the accuser). Confirm?
2. **Exclusive, or coloring?** Do you want a hard exclusive (go to Denise, and Dale's account is unreachable that run — you carry only the accusation), or does Denise *color* a later Dale beat (you hear his account through her accusation)? Your "you wouldn't get his side" reads as the hard exclusive, which is the stronger version.
3. **What does Denise give the player mechanically** — a read that arms the *guilty-Dale* interpretation (a lensFlavor, a flag the later beats can lean on), the way Dale's account arms the *innocent-Dale* one?

**Where I'm leaning:** Denise as a second witness-fixture, reachable from a Marie-adjacent pointer, who gives the town's darkest read of Dale with total conviction — and on the exclusive path, that conviction is *all* the player gets, so the accusation stands un-rebutted. The horror is that both Dales are coherent and the game never says. But this is your character to shape — I'll draft to your direction.

## 3.5 · Optional smaller items (list, low priority)
- **A distinct left-closed grave close** — Plumb's restructure (neutral base, vindication only on confirmed-empty) works; but the player who chose *not* to open the vault made a real choice (to keep the wondering), and it could earn its own short close. Small new variant — your call whether it's worth it.
- **Workout banter variants** — repeated Doug workouts currently show only the ritual line; a couple of lighter banter variants would add life (needs a card per visit). Nice-to-have.
- **The quarry-pattern reuse** — folds into 3.2 (Nora's biographical silence). Same instinct; same direction needed.

---

# PART 4 — HOUSEKEEPING
- **Source reconciliation:** my `.md` sources now carry the structural changes (Marie split, `knows_ellen` drop, timeline) and lag only on Plumb's blessed cosmetic conversion edits — the accepted "cosmetically stale" state. The **code is the live content**; a future reconciliation syncs the docs to it. Nothing blocks.
- **Folder refresh** still pending from the prior round — my working copies (with everything above) are the source of truth for content; whenever you refresh the folder from them, the docs sync.

**Net:** every correction that didn't need a new scene is done or blessed — the timeline, the Marie split, the `knows_ellen` drop, the 29 line-edits (bless all but #2), the rulings affirmed. What's left is the new content in Part 3, and I'm ready to write the moment you give me the branches — especially the opening's reason-for-coming and the Marie/Doug/Reese/Nora relationships, which shape everything downstream.

— Loom
