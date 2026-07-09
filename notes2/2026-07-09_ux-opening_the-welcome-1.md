# Story Pass — The Opening: The Welcome (family-reunion start)
### the creation beat, reframed as an ensemble gathering · the player's first afternoon back · prose-first, for Armature/Plumb
*From: Loom (Explorer corner) · carried by Dean · 2026-07-09 · the flagship's first scene — DRAFT v2 (reunion), supersedes the solo-arrival draft*

**What this is.** The first beat of the game, reframed per Dean's vision as a **family-reunion welcome** — the family throws the player a gathering the first weekend back. It does what the solo arrival did (seats the player in a warm ordinary life, plants the woods at the edge, starts the Doug thread, sets up Marie) but *better*, because a gathering introduces the **whole ensemble at once** — Aunt Marie, cousins Reese and Nora, family-friend Doug — each through the texture of the afternoon rather than one at a time. Coordinate-silent; the two flavor choices seed *origin*.

**Why the reunion is the stronger open:** every relationship the game leans on later gets planted here, in one scene, as *already old* — so Reese arrives at the cave, Nora on the phone, Doug at the workout, and Marie in the woods as people the player already has. And the one wrong note (the woods) lands *inside the warmth*, which is the whole engine: the horror will erupt into a life, and here's the life, full of people glad you're back.

**Where it sits.** The run's origin card. Sets `arrived_town` + `thread_doug`; schedules `ux_marie_warning` (+2 days — Marie's present here; her *warning* comes after). Coordinate- and lens-silent. Leads into the ordinary loop.

---

## `ux_explorer_opening` — the welcome

They throw you a thing the first weekend, because that's what this family does — any excuse, and you moving back is a good one. It's at Aunt Marie's, which means the good folding chairs and three times too much food and the cooler Doug always brings, and it spills off the back deck into a yard that runs right up to the treeline. Half the town filters through at some point. You'd forgotten how that goes out here — how everyone turns out to be somebody's cousin or somebody's old coach, how a place this size holds onto you.

Marie gets to you first, both hands on your arms, looking you over like she's checking for damage. She's your mother's sister and she has decided — in the way she decides things, which is to say it's already done — that keeping an eye on you is her job now. She's got a plate in your hand before you've managed ten words, and she keeps touching your shoulder through the afternoon like she's making sure you didn't leave again.

Reese is talking about the caves before you've finished the plate. Your cousin Reese, who never met a hole in the ground he didn't want to go down, who calls the whole business "just rock and dark, don't be dramatic" and honestly means it — he's got White's Hall half-planned for you already, headlamps and rope and a Saturday. His certainty is a comfortable thing to stand next to. You can see how a person could hide inside it.

Nora catches you by the cooler to tell you, low, like it costs something to say out loud, about the thing she's been looking into. She won't say what — not here, not with people around — but there's a lot of it, and she's got that particular shine in her eye. The family's fond of Nora the way you're fond of weather: you don't argue with it, you just dress for it. Thing is, she's not wrong nearly as often as everyone likes to think.

And Doug holds the grill the whole afternoon, the way he has at every one of these since you were a kid mowing his lawn for gas money. He and Marie went to school together a hundred years ago; he taught you the fire road and how to hold a pace and how not to quit partway up a thing. When he catches your eye across the yard he just lifts his chin — *good, you made it* — and goes back to the burgers. Some things don't get said between people who go back that far.

It's a good afternoon, the whole long warm length of it. And only once — late, when the food's gone cold and the smallest kids are melting into tears and you step off the deck to breathe — only once do you look to where the mown grass quits and the woods start, close and dark and brimming with the evening, and feel the quiet that comes off them go wrong. Not the quiet of trees. The quiet of a room where the talking stopped because you walked in. Then Reese is hollering something from the deck about headlamps, and it's just trees again, black against a failing sky, saying nothing, being woods. You go back to your people. You don't think about it again. It was a long week. You're just tired.

- **"You came back to start something."** *(a fresh page)* → *(narration: "That's the version you'd say out loud — new chapter, clean slate, the whole line — and it's even mostly true. You mean to stay this time.")* → resolve to the loop.
- **"You came back because it was the one door still open."** *(you don't turn it over too hard)* → *(narration: "You wouldn't put it that way to anyone, and you don't put it that way to yourself. But here you are, and the people are real, and whatever you were leaving is a long drive back the way you came.")* → resolve to the loop.

> DESIGN: The tone-setter, and it earns the whole register in one scene — a warm, crowded, *ordinary* homecoming (the life the horror needs to erupt into) with exactly one note off, felt and unnamed and instantly explained away by the player themselves (*you're just tired*), which is the anti-noun's opening statement of intent. The ensemble lands entirely through the afternoon's texture — Marie's already-decided protectiveness (which becomes her warning), Reese's comfortable certainty (*"you can see how a person could hide inside it"* — the skeptic pole named without a label, the denial the player will be tempted by), Nora's weather-system eccentricity plus the tell that she's *not wrong as often as people think*, Doug's decades of chin-lifts and unspoken history (starting `thread_doug`, seeding the pace detail the workout pays off). Nobody explains anybody; the familiarity does the work. The two flavor choices seed *origin* — the hopeful return vs. the quiet flight — coordinate-silent, for the creation deck to build a backstory on, because who the player is hasn't met what's out here yet. **[Wiring: sets `arrived_town`, `thread_doug`; schedules `ux_marie_warning` +2 days. No coordinate, no flavor. Both choices resolve identically to the loop — the flavor is the origin seed, not a branch.]**

---

## Notes for the wire (Armature / Plumb)

- **Origin card — coordinate- and lens-silent.** Sets `arrived_town` + `thread_doug` on entry (both regardless of choice); schedules `ux_marie_warning` at +2 days (Marie is present at the reunion; her *warning* beat is the scheduled follow-up). No `diamondCoord`/`attune`/`lensFlavor` anywhere.
- **The two flavor choices are origin seeds, not a branch** — no thread flag, resolve identically. If the creation deck will read origin later, give each a distinct `origin_*` flag (`origin_fresh_start` / `origin_last_door`); otherwise pure flavor.
- **Frozen-cave-safe; linter-clean** — upstream of the cave, prose only, no `*…*` in any log.
- **Creation-deck qualifiers** (for the start-deck Dean's designing): **Explorer sector**; **solo character — no significant other** (deal this start only when the player's answers don't call for a partner); grounded/ordinary origin. The two flavor choices seed the axis lean the creation questions will formalize. This is one start-card among the deck; it's built to seat cleanly under the questions → qualifiers → roll system, and its solo-Explorer profile is exactly the slot Dean named for it.
- **Supersedes** the solo-arrival draft (`2026-07-09_ux-opening_arrival.md`) if Dean prefers the reunion; the arrival version remains as the fallback.

— Loom
