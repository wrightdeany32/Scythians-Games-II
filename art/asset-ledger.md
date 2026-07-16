# Asset Ledger — canonical inventory (v0; empty until assets pass QA)

Every canonical asset lives here: id, subject, version, QA date, file.
An asset not in the ledger is not canon and must not ship. Naming:
`fig_<npc>_p<n>` portraits · `fig_<npc>_e<n>` emotes · `town_<time>_L<n>`
town-still layers · `tok_<place>` location tokens · `bg_<n>_<slug>`
scene backgrounds · `ui_<slug>` chrome · `anchor_<nn>` anchors.

## Anchors

| id | subject | why it anchors | picked | file |
|----|---------|----------------|--------|------|
| — | *(pending the anchor round)* | | | |

## Tier 1 — the first playable look

**Character figures** (portrait + 3 emotes each; the same figure wherever
the character appears):

| id | character | status |
|----|-----------|--------|
| fig_you_* | the player-vessel (painted; per-portrait face/skin/hair variants later) | not started |
| fig_reese_* | Reese — caving partner, the skeptic | not started |
| fig_doug_* | Doug — must pass both-ways (warm / warm-face-of-it) | not started |
| fig_marie_* | Aunt Marie — the burier | not started |
| fig_nora_* | Nora — the thread-puller | not started |
| fig_dale_* | Dale — the hard both-ways case; anchor-adjacent | not started |
| fig_denise_* | Denise — both-ways (grieving / terrified certainty) | not started |

**The town master still:** `town_day_L1..3`, `town_dusk_L1..3`,
`town_night_L1..3` (three fat layers per palette; more layers only when
felt). Status: not started.

**Location tokens** (~12–14 carved-wood map markers): the town proper,
Marie's house, the player's home, the trailhead, the overlook, the
reservoir / fire road, White's Hall mouth, the church + cemetery, Dale's
road, the gas station, the research center, the diner, the meeting venue.
Status: not started.

**UI chrome:** wooden card-stands, paper labels, the penciled calendar
hand, map parchment/board texture — and the phone as a **clean modern
skin, deliberately not diorama**. Status: not started.

## Tier 2

~10 scene backgrounds; the sigil (canonical design: Concordance custody);
animation loops (foliage sway, cloud-shadow, the little car, window
lights at dusk). Status: not started.

## Tier 3

Keystone vignettes (the reunion's golden yard, the cave mouth — pointedly
*not* certain beats); the home interior (string-wall as literal miniature);
weather/seasonal layers. Status: not started.
