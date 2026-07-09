# Loom — round wrap: content manifest, design decisions, and presentation-layer discipline notes
### everything generated this round, the direction it was built to, the guards for the new surfaces, and what's still open
*From: Loom (Explorer corner) · carried by Dean · 2026-07-09 · for Dean, and Concordance for the ledger; Plumb, Armature, Vigil, Slate, Azimuth, Courier cc*

A single handoff for the round — a manifest of what I generated, the design calls behind it, the discipline guards for the surfaces Dean's designing, and the open items. My working copies are the source of truth for all content files named here.

---

## 1 — CONTENT GENERATED THIS ROUND

**Corrections to existing content (done / blessed):**
- **Timeline** (Dean's ruling): Doug's incident pinned to 30y (done prior round); Ellen night to 40y → Dale's seven "fifty years" swept to "forty" (Dale now ~54); Marie's "forty years" stands.
- **The Marie mutual-exclusivity → SPLIT** — `ux_marie_ellen` restructured so Marie names Ellen and points to Dale in her main text (`pointed_to_dale` for every player); the pattern probe is the one branching choice; Dale is never traded away, and the convergence is now an independent reward. Reasoning: the paths were too asymmetric to be a fair choice, and the null pole (Dale) is best *reached by more players, not fewer*.
- **`knows_ellen` dropped** across marie/dale/grave (dead flag; its tendril is carried safely by the convergence percept; also fixed the grave beat's assumed name).
- **The 29 line-edits — bless all but #2** (keep Doug's "family friend" descriptor). The percept-discipline gates (mark-coda, grave vindication) affirmed.

**New content (authored):**
- **`ux_explorer_opening` — the reunion opening** (`the-welcome`): the flagship's first beat, reframed to a family-reunion welcome. The whole ensemble (Aunt Marie, cousins Reese + Nora, family-friend Doug) lands in one afternoon through the gathering's texture; the woods get one wrong note inside the warmth; two flavor choices seed origin. Tagged with creation-deck qualifiers (Explorer sector, solo character, no significant other). Supersedes the earlier solo-arrival draft (kept as fallback).
- **`ux_nora_intro` — the call** (`the-call`): Nora's establishing beat after the first cave trip — the eccentric-but-*right* cousin, the research-center wall (`nora_center_known`), the fray and the one biographical silence gated behind the engaged choice (`noticed_nora_fray`), and the cipher recognition if the player copied the symbol.
- **`ux_shard_settles` — the copy you made** (`the-copy-you-made`): the shard reframed (see §2) to a recorded symbol — a curious page in a drawer, the mystery, the banked exposure.
- **`ux_denise_*` — the one who was sure** (`the-one-who-was-sure`): the Denise thread — Dale's mirror. Full encounter authored; both branches (the fear-crack, the antagonist-turn pursuit) structured with their beats named and discipline fixed. Branches to full prose next pass.
- **Pressure strand reframed** (`ux-pressure`): the three shard stages rewritten from physical warmth to the symbol's psychological grip (the page you keep opening → drawing it unbidden → seeing it in everything; the possession beat intact for the knife).

---

## 2 — DESIGN DECISIONS & DIRECTION (for the record)

- **The start-deck.** The reunion is *one start-card among a deck.* Creation runs on ~3–5 set questions (common factors: orientation, grip, lens, relationship) + ~3–5 specialized ones (corner, axis, qualifiers), and a roll deals a start whose qualifiers match. Relationship is handled as **narrative, not a player toggle** — some written characters have a partner woven into their world, some are solo; no second player is manifested. Starts spiral out from each corner (left/right/up/down), with the deepest stories gyring through the sectors toward the center. (Grand vision; the creation *system* is Plumb's/the deck's build. My content seats under it.)
- **The shard is a symbol, not an object** (Dean). A research-center cipher — the private notation the people there used to talk unheard — carved in the cave; the player *records* it (a copy on paper) rather than extracting rock (which would have meant a crumble-check). No physical warmth; the tell is *a page you can't stop looking at.* Nora recognizes it (the materialist lens's concrete hook; deepen the connection later).
- **Denise doubles the ambiguity.** Dale's account arms innocent-Dale; Denise's arms guilty-Dale — through a person as sympathetic and as unreliable as Dale is reliable. Her certainty is fear-masked-as-cowardice (she never says "I know"; her hands never move), so the second ambiguity — *is her certainty knowledge or fear* — sits inside her and is never resolved either. Non-exclusive with Dale; the drama is what the player *does* with two irreconcilable men. The **antagonist-turn** (dig → authorities shrug → drastic action) ends at the **threshold**, conviction-voice, the act never shown — the medium's hard presentation control makes the restraint free. Cross-run jewel: `dale_suspected` on one run colliding with `dale_bond` on the next.
- **The anti-ham-fist principle = the mundane as camouflage.** The knife works because it was never mentioned. The same logic governs every surface: significant things hide inside ordinary ones (a real message in a column of "you still got that five bucks"), so the player almost scrolls past them, which is why they land. The breather set's logic — a life for the horror to erupt into — applied to the phone, the map, the home.

---

## 3 — PRESENTATION-LAYER DISCIPLINE GUARDS [→ Concordance]

The new surfaces Dean's designing (map, phone, home, schedule, character cards, the circle) are diegetic containers my content seats into cleanly. Three guards keep them on the right side of the invariants — each is the visible-grip-meter trap in a new costume:

- **The circle = felt presence, never a scored panel.** A Crusader-Kings-style council that ranks or meters relationships is a `no-catalog` / `no-stored-disposition` breach. Build it as *who is in your life right now* — photos on the fridge, a coat by the door — appearing and receding as threads open and strain, never numbered. The player feels Reese pull away because his photo's gone, not because a bar dropped.
- **The home manifestation = qualitative, derived-on-read.** The run-down/conspiracy-wall visuals should reflect *derived* state (the string goes up, the dishes pile) and **never render the position they're derived from.** The visual *is* the readout; no number anywhere. (Same rule as grip rendering as its band, extended to the environment.)
- **Character cards = faces, not dossiers.** A portrait per name is pure upside for followability. A card that grows a stats panel, a relationship meter, or a "true nature" line is a `no-catalog` breach. Cards never show what the player hasn't perceived, and **no card ever renders the compass.**

The through-line: the visuals are *readouts of felt/derived state*, never the state itself — so the presentation layer can be rich without a single surface tipping the game's hand.

---

## 4 — OPEN ITEMS / NEXT

- **Denise's two branches to full prose** — the fear-crack and the antagonist-turn pursuit (drastic action stops at the threshold, per the ruling above). Ready to write.
- **The reunion character's phone** — offered as a content job: a contacts list that feels like a real life, with significant messages seeded as almost-mundane. Direct extension of the breather set. On Dean's word.
- **Cave-check [→ Armature]** — does `cave-b3` describe *pocketing* the shard or *recording* the carving? If the former, its `took_shard` beat wants a small reframe to stay-and-copy-vs-run. I'll adapt to whatever's there.
- **Optional smaller items** — a distinct left-closed grave close; Doug workout banter variants. Low priority.
- **Folder refresh** — my working copies (all of the above) are the content source of truth; whenever the folder syncs from them, the docs and the code align.
- **Ledger** — Concordance to fold §2's decisions and §3's guards into v3.1 alongside the prior-round items.

---

**Net:** a full round — the flagship opening reframed to the reunion, Nora and the reframed shard authored, Denise's core built with the antagonist-turn structured, and every correction from the checkpoint landed. The presentation-layer concepts are exciting and my content is built to sit under them; the three guards keep the new surfaces honest. Point me at Denise's branches or the phone whenever you're ready.

— Loom
