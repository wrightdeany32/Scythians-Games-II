# Story Pass — The Opening: Arrival
### the creation beat · the player's first hour in the town · prose-first, for Armature/Plumb to wire
*From: Loom (Explorer corner) · carried by Dean · 2026-07-09 · the flagship's first scene — DRAFT for Dean*

> **⚠ FALLBACK — DO NOT WIRE.** This solo-arrival draft is superseded by the reunion opening (`2026-07-09_ux-opening_the-welcome.md`), which is the live version. This one is retained only as an alternative framing if Dean ever prefers the quieter solo arrival. Wire the reunion, not this. Only one `ux_explorer_opening` ships.

**What this is.** The first beat of the whole game — the Explorer's arrival in the town. It seats the player in an ordinary life (so the horror has something to erupt *into*), plants the woods at the edge of it (the first faint wrongness, unremarked and deniable), starts the Doug thread (the family friend who is the player's warmest anchor here), and schedules Marie. Coordinate-silent: the two flavor choices seed *origin*, not position — the creation deck builds on them when it lands.

**The discipline for a first beat:** the relationships are shown as *already old.* You don't ask a man you've known your whole life how you know him — so Doug's history, Marie's aunthood, the cousins all land through the texture of long familiarity, not through anyone explaining anything. And the town's one wrong note is *felt, never named* — the anti-noun holds from the very first scene, so a player who blinks and misses it has missed nothing they can point to, which is exactly the game working.

**Where it sits.** The run's origin card. Sets `arrived_town` + `thread_doug`; schedules `ux_marie_warning` (+2 days). Coordinate- and lens-silent. Leads into the ordinary loop, from which the cave, Nora's call, and the threads open.

---

## `ux_explorer_opening` — the town at the end of the road

You get in a little before dark, which is the wrong time to arrive somewhere new — everything half-lit, nobody expecting you — but the drive was long and you took it in one go. The town is smaller than you'd let yourself remember: a main street, a gas station with two pumps, a church, the kind of place where the streetlights come on one at a time like somebody's flipping them by hand. The hills stand up dark behind all of it. There's more woods than town out here. There always was.

Doug's truck is already in the drive when you pull in, because of course it is. Doug, who's been turning up to help since you were a kid mowing his yard for gas money — who taught you the fire road, and how to hold a pace, and how not to quit halfway up a thing. He's got the tailgate down and half your boxes already inside, and he doesn't make a production of it, just claps you on the shoulder and says the place isn't bad, needs work, he'll bring a ladder Saturday. You don't thank him too much. He'd hate that. Some things don't get said between people who've known each other that long.

It's a good hour, the first one. Boxes, and the shut-up smell of a place waiting for somebody, and Doug telling a story you've half heard before while the light goes down blue over the hills. Your aunt Marie called twice on the drive and you let it ring out both times — not avoiding her, just saving her for when you can sit still; she'll want to feed you and hear everything, and that's a tomorrow thing. And somewhere in the week there'll be the cousins: Reese, who'll have you down some hole in the ground by the weekend if you let him, and Nora, who'll have a theory about that hole that takes an hour and a half to get through. It's a lot of people who are glad you're here. You'd forgotten what that was like.

Only once, carrying the last box in from the truck, you stop. The woods come right down to the edge of the yard back here — closer than they looked from the road — and for a second, the way things go crooked when you're this tired, the quiet coming off them isn't the quiet of trees. It's the quiet of a room where the talking stopped because you walked in. Then it's just trees again, black against a blue-black sky, saying nothing, being woods. You take the box inside. It was a long drive. You're seeing things.

- **"You came here to start something."** *(a fresh page)* → *(narration: "That's the version you'd say out loud — new town, new start, the whole line. It's even mostly true. You unpack like someone who means to stay.")* → resolve to the loop.
- **"You came here because it was the one door still open."** *(you don't turn it over too hard)* → *(narration: "You wouldn't put it that way to anyone, least of all yourself. But you came, and you're here, and the boxes are real, and whatever it was you were leaving is a long drive back the way you came.")* → resolve to the loop.

> DESIGN: The tone-setter, and it earns the whole game's register in one scene — an ordinary, *warm* arrival (a life worth the horror erupting into) with exactly one note off, felt and unnamed and immediately explained away by the player themselves (*you're seeing things*), which is the anti-noun's opening statement of intent. Doug lands as the warmest anchor through pure long-familiarity texture (the yard-mowing, the fire road, "some things don't get said") — starting `thread_doug` without a syllable of exposition, and seeding the pace detail the workout beat pays off. Marie and the cousins are planted the same way — already-old relations, glad you're here — so Reese arrives at the cave and Nora on the phone as people the player already has, not cold introductions; and their one-line characterizations (Reese → a hole in the ground; Nora → a theory that takes an hour) are the threads' seeds in miniature. The two flavor choices seed *origin* — the hopeful arrival vs. the quiet flight from something — coordinate-silent, for the creation deck to build a backstory on; neither tilts grip or lens, because who you are hasn't met what's out here yet. **[Wiring: sets `arrived_town`, `thread_doug`; schedules `ux_marie_warning` +2 days. No coordinate, no flavor. Both choices resolve identically to the loop — the flavor is the origin seed, not a branch.]**

---

## Notes for the wire (Armature / Plumb)

- **The origin card — coordinate- and lens-silent.** Sets `arrived_town` + `thread_doug` on entry (both land regardless of choice); schedules `ux_marie_warning` at +2 days (the host for Marie's scheduler Plumb flagged). No `diamondCoord`, no `attune`, no `lensFlavor` on anything here — the creation deck seeds origin; the opening seeds *life*.
- **The two flavor choices are origin seeds, not a branch** — they set no thread flag and resolve identically to the loop. If the creation deck wants to read the origin later, give each a distinct `origin_*` flag (`origin_fresh_start` / `origin_last_door`); otherwise they're pure flavor. Loom's fine either way — flag them if the deck will use them.
- **Frozen-cave-safe.** Touches nothing in `cave-b3`; it's upstream of the cave entirely.
- **Linter-clean** — prose only, no `*…*` in any log.

— Loom
