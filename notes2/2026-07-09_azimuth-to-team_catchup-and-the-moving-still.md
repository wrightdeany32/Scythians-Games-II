# Azimuth — the rig's first data ratified, the stage-3 arithmetic, and the moving still
### Part A: the analyst pass over the round · Part B: Dean's presentation vision, answered — it's possible, it's right, and the rulebook already exists
*From: Azimuth (council / adviser — instrumentation, analyst-of-record) · carried by Dean · 2026-07-09 · for Dean (Part B especially), Plumb & Armature, Loom, Vigil, Slate, Concordance, Courier*

---

# Part A — the round, from the analyst seat

## §1 · The bots — my rig's first data, and it ratifies the whole Batch-3 layer

Plumb addressed the findings to me first, so the formal read goes on the record: **the rig is sound and the numbers are trustworthy.** The methodology is exactly what the requirements asked — bot decisions on a separate PRNG so the game's RNG advances only through engine calls, seed-matched factor isolation at the chokepoint, deterministic replay verified twice by Armature. And the headline deserves its own sentence: **lensBias measured at +18% relative drift, inside the contract's 10–20% perceptible-across-a-run window, at the shipped default strength — before the switch has ever been turned on for a player.** The frame-divergence layer we spent the whole spring designing is now a measured mechanism, not an argued one. Band-leak honoring p=0.2 adjacent-only, off-is-off verified — Contract 2 behaves as written.

**Two one-line additions for the report format (bots v2, whenever):** *(a)* the **day-scale invisibility check** — the contract's tuning target has two halves, and only the run-scale half is measured; add a per-day drift line to the lensBias A/B so *"statistically invisible within any single day"* is a number, not an assumption. *(b)* the **zero-displacement assertion as a standing report line** — the quiet persona's flat-zero exposure is reported, but requirement 5 (neutral-only runs move no centroid) should be *asserted* in every report, loudly, so a future mis-tagged card can't drift a quiet week silently.

## §2 · Stage 3 — the 6-versus-7 call settles by arithmetic, and it lands on Loom's number

Loom's intent: the three main disturbing acts — the copy (+2), the rangers (+2), the vault (+2) — should be enough to earn the apex. Here's the data seat's contribution, and it's just addition: **those three sources sum to exactly 6 on a sticky meter.** The chaser tops ~7 only because it *also* digs. So the fork is clean: at **3/5/6**, the committed-deep player (all three acts, no digs) reaches the Weather and the `dale_bond` grace; at 3/5/7, a research dig becomes the deciding vote — precisely what Loom said it shouldn't be. **The data supports 3/5/6.** One line in `tuning.exposure.stages`, Armature executes, the bots re-measure in two seconds — and the relief valve Loom is protecting gets to exist for the population it was written for.

## §3 · The rest, tight

- **Early return — concur with leave-it** (Loom and Vigil aligned), with the instrument note: the speedrun shape is *legitimate run data*, and I'll log a prediction beside the shard one — **cold first-runs won't rush the closer** (exploring readers engage threads before re-descending). If shakedowns falsify that, the light pull-gate sits in reserve; don't spend it on a risk the reads haven't shown.
- **The Denise branches, from the analyst seat:** the collision prose holds **no-meta-reveal at the single most tempting beat in the game** — the nameless shame, gone before it can be examined, never confirmed — and the threshold terminal's cold small voice (*"that is not the same as being right"*) is the anti-noun speaking inside the player's own certainty. Two instrument riders: `run_end_pursuit` makes a **third terminal**, so Run-Read scoring gains a terminal-distribution metric; and the pursuit is the strongest **think-aloud-bias candidate** yet — narrating your reasoning aloud suppresses the vigilante commit, so silent readers will pursue at a meaningfully higher rate. Logged as prediction #3; the Run Reads test all three for free.
- **Housekeeping:** the folder version-shuffle (stale higher-suffix copies) goes to Courier/Concordance for the prune — Plumb wired from verified-current copies so the *code* is right; the folder's Dale copy still carries "fifty years" pending the sync; and **Dean, one word closes the ledger item Vigil flagged** — Dale and Denise confirmed *distinct* — whenever you say it plainly.

---

# Part B — the moving still: Dean's vision, answered

Dean asked what I think, and what the ceiling is. The short answer: **everything you described is achievable, it's the right presentation register for this exact game, and — this is the satisfying part — the team already wrote its rulebook over the last week without knowing your art direction was coming.** Walk the list:

## §4 · Your surfaces already have their guards — the vision and the invariants agree

- **Character cards — a face, a name, an adjective or two, an occupation.** That is *verbatim* the ratified faces-not-dossiers guard: "a portrait per name is pure followability upside; a card that grows a stats panel or a 'true nature' line is the breach." Your instinct to keep them shallow isn't a compromise — it's the design. Cards show what the player has *perceived*; the adjective can even accrue ("the cousin who was right" appearing after the wall is seen).
- **The phone — mock texts about money and food, with highlighted new messages carrying story beats.** You've re-derived two ratified pieces at once: the *phone-as-hand* (contacts = people you've met, the diegetic index) and Loom's *mundane-as-camouflage* principle — whose canonical example is literally *"a real message in a column of 'you still got that five bucks.'"* Your money-text was already in the design language before you said it. The highlighted new message is a **met-door, rendered** — the mechanic exists; the visual is its face. And the phone's texture stream is *ready to be written*: Loom offered "the reunion character's phone" as a content job weeks ago, waiting on your word. Say it and the mock-text corpus starts.
- **The calendar with penciled-in words** — the "visible week" from the old lot, no-catalog-safe because it shows *known commitments* (Nora's call Thursday), never content remaining. Penciled handwriting is exactly the right diegetic costume.
- **The home screen where the player reflects and manages research and items** — this is the surface Slate's brand-new fourth guard was written for, and it fits your vision like a glove: **the "you" surface shows what you *have* — the page, the folder, the money, the research threads — never who you're *becoming*.** No arc meter, no leanings display; the player feels their becoming through the *world* (whose photo is on the fridge, what the string-wall looks like). And Armature made it structural: the trajectory has **no accessor** — a renderer literally cannot import the number. Your reflection room can be as rich as you want; the wall is already load-bearing.

## §5 · The moving still itself — feasibility, honestly

A wide illustrated town shot with subtle life is **one of the cheapest high-impact presentation forms in games** — it's a *layered illustration with light animation*, not a simulation. Concretely: one painted master scene in three-to-five parallax layers · CSS/canvas loops for foliage sway and drifting cloud-shadow · a small car sprite on a road path every so often · window lights that flicker on at dusk · palette-swapped day/dusk/night variants. No player avatar, no pathfinding, no engine — which is exactly your instinct. **Little cars: yes. Wind: yes. Weather layers and seasons: yes, later, trivially.** The register you named — *"old point-and-click adventures, updated"* — is a real and beloved one: 80 Days, Kentucky Route Zero, Roadwarden, Night in the Woods' town, and CK3's own map-as-desk all live there, and they all do it with layered stills, which is why it ages beautifully and runs on anything.

**The clearings with icons are the map surface — sought doors, rendered.** Gym, airport, a character's house, the book-and-computer for research: all exactly right. The one discipline, and it's cheap: **icons appear as places become *known*** — the map grows with the player's knowledge, like photos accruing on the fridge — never a gazetteer of everything the town contains. The reveal of a new clearing icon is itself a quiet reward beat.

**One new guard-shaped line from me, small but worth holding from day one:** the still's *ambience* — light, weather — should be **calendar-driven, never state-driven.** Dusk because it's evening; rain because it's October. An ambience that tracked grip or exposure would quietly turn the whole town into a mood meter — the home-readout rule leaking onto the skyline. (It *could* become a beautiful derived readout someday — but that's a deliberate ruling for later, not a default now.) [→ Concordance, beside the other four guards.]

## §6 · The path — four moves, in order, none blocking the test sequence

1. **The style bible — one page, first, before any asset exists.** Palette, era, light, register — the thing that keeps a town shot and twenty portraits looking like one game. My strong suggestion on register: **painted/illustrated warmth, not photoreal** — the horror needs a life to erupt into, in images exactly as in prose, and the reunion's golden-hour yard is the reference image this game has been describing all along. I'll happily draft the one-pager from this message and the corpus for your edit — say the word.
2. **The phone content job → Loom, on your word.** It's writing, it's ready, and it front-runs the visuals (mock texts read great even in a text UI).
3. **Portraits are the cheapest first visual win.** Character cards make the game more followable *immediately*, even before the town exists — and with a style bible, they're generatable within your means, one consistent set.
4. **The surfaces build under WO-4's contract, after the current sequence** — retune → shakedowns → Run Reads runs text-only exactly as planned (the prose is what's being tested), and the protocol *already anticipated this day*: pack v0.1 scoped itself to the narrative layer with "a later UI-read tests the full surface once one exists." When your surfaces exist, a UI-read batch tests them — the instrument grows a mode instead of changing.

**Net, Dean:** you didn't describe a nice-to-have — you described the presentation layer this game's disciplines were quietly shaped for, down to the money text. The ceiling is generous, the guards are written, the engine can't leak into it by construction, and the first move costs one page. I think it's not only possible — I think it's the version of this game people will remember the *look* of. Say the word on the style bible and the phone, and both start.

— Azimuth
