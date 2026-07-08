# Story Pass — Nora, the Day-Trip: the Center and the Rangers
### loop content · the right-axis thread · prose-first, for Armature/Plumb to wire
*From: Loom (Explorer corner) · carried by Dean · 2026-07-07*

**What this is.** The Nora thread's centerpiece — the day-trip to the stripped research center, the rangers who turn out to be looking for *them*, and Nora's breakdown in the woods. This is the *right* axis (attuned, uncoverer) in the **institutional** register: the counterweight to Marie's folk-avoidant *down* and Doug's spiritual *up*. The horror here is not supernatural — it's being hunted by competent people, and a dead place that someone still watches. It's the beat that breaks the skeptic **honestly**: nothing's there, you were right… and then someone is still guarding the nothing, and a rational person can't wave that off and still doesn't need a ghost to explain it.

**Disciplines.** Percept, never cause — the rangers stay mundane and unfalsifiable (real monitoring of a real site, or hunters in disguise; never confirmed), and the sense that the place is *watched* is institutional dread, never adjudicated into a conspiracy the player can hold. Gates are flags/stats/tiers, never position. Neutral-valence labels. And the sealed cosmology — what the center was, its fate, who owns and watches it — surfaces in **nothing**. The player gets a stripped building, hunters with a description, and a place too valuable to leave alone, and never learns one word more.

**Nora's breakdown is the emotional crux, and it's the grip mechanic pointed at a companion.** Her footing fails in real time, and it's a real fork with real cost: push her and she turns on you and you leave her behind; go gentle and she surfaces and you walk out together with a pact to disappear for a while. It teaches the player what fraying looks like *from the outside* — and the price of pushing versus the value of care — before it ever happens to them.

**Upstream:** Nora is a contact by now (`thread_nora`), established via the etchings link (`etchings_link_nora`) or an early met-door, and she's told the player about the center (`nora_center_known`). This scene fires when the player commits to going with her.

---

## `ux_nora_daytrip` — she asks you to come

Fires from the loop once `thread_nora AND nora_center_known`, as a committed outing (a full day).

Nora's been building something for weeks and you've watched her build it — the way she talks faster now, sleeps less, has a folder on her phone she turns away from you to open. When she finally asks, she asks like it costs her: "I found where it goes. The center. It's real, it's out past the county line, and it's abandoned, and I want to see it, and I don't want to see it alone." She looks at you. "You're the only person I know who wouldn't tell me I'm crazy."

- **"Then let's go see it."** → sets `nora_daytrip_committed`; queue `ux_nora_arrive`.
- **"I'll come. But Nora — you doing okay? You seem wound pretty tight."** → sets `nora_daytrip_committed`, `noticed_nora_fray`. *(narration: "She waves it off — she's fine, she's just close to something, she'll rest when she knows. You've flagged it, to yourself. You'll be glad, later, that you did, and sorry it didn't change anything.")* → queue `ux_nora_arrive`.

> DESIGN: `noticed_nora_fray` is the early planted read on her state — it changes nothing about what happens (the game doesn't reward foresight with rescue), but it colors the breakdown, so the player who saw it coming feels the specific grief of having seen it coming. Both options commit; there's no "talk her out of it" here, because by now Nora doesn't stop.

---

## `ux_nora_arrive` — the place that was cleaned, not abandoned

The drive is an hour past anywhere. She talks the whole way, laying it out — the holding companies, the dates, the disappearances she's mapped against them — and it's *coherent*, it's the institutional read built to a fine point, and you can't find the hole in it. Then the trees open and there it is.

It's a building the way a skull is a head. Low, concrete, industrial, every window gone, the parking lot cracked to rubble with saplings coming up through it. Decades dead. And Nora stops the car and doesn't get out and says, quietly, "Okay. Okay, it's real."

- **"Let's look. Carefully."** → queue `ux_nora_explore`.
- **"Nora. Doors and windows only. We do not go deep, and we leave the second either of us says leave."** → sets `nora_pact_careful`. *(narration: "She agrees, fast, grateful for the rule — a rule is a thing to hold when the place in front of you is this quiet. You both know you'll keep it right up until you don't.")* → queue `ux_nora_explore`.

---

## `ux_nora_explore` — nothing here, and the wrongness of that

Inside, it's empty. Not looted-empty — *emptied.* Where there should be the wreckage of a dead institution — files, furniture, the tide-line of forty years of trespassers — there is swept concrete and clean bolt-holes where heavy things were unbolted and carried out. Someone took this building apart on purpose and took the pieces somewhere and swept the floor behind them.

And a part of you — the skeptical, sensible part that has doubted this whole thing — feels *vindicated*, and says so, because look: there's nothing here. No horror. No sigils. No monster. A dead building somebody stripped for salvage. You were right to doubt.

Nora walks the empty rooms with her phone out and her face falling, because she came for proof and the proof is an absence, and an absence proves nothing to anyone but her.

- **"There's nothing here, Nora. I'm sorry. But this is — this is a stripped building. That's all it is."** → sets `read_skeptic`, `lensFlavor: skeptic`. *(narration: "You say it kindly and you mean it and it's the reasonable read, and you watch it land on her like a door closing, and something in you settles at having said the sensible thing out loud. There's nothing here. You're almost sure.")* → queue `ux_nora_rangers`.
- **"This wasn't abandoned. Somebody *cleaned* this. That's not the same thing."** → sets `read_institutional`, `lensFlavor: institutional`. *(narration: "You feel it before you can argue it — that emptied is different from empty, that someone chose this, paid for it, swept up after. It's the most rational dread there is, all documents and bolt-holes and nothing supernatural at all, and it's worse for that. Nora looks at you like you've thrown her a rope.")* → queue `ux_nora_rangers`.
- *(introspective — requires `noticed_nora_fray OR nora_pact_careful`)* **"We should go. Right now. I don't like this."** → sets `wants_out_early`, narration only, no stat, `attune` leans *grounded* (small). → queue `ux_nora_rangers`.

> DESIGN: This is the skeptic's vindication, delivered straight and *earned* — the sensible read grants the settling (and tilts skeptic), because the building really is stripped and empty. Which is exactly what makes the next beat land: the game agreed with the skeptic, and then someone shows up to guard the nothing. `read_institutional` is the frame that survives the day intact — Nora's, and it's *right about the skeleton*. Neither read is confirmed; emptied-on-purpose could be ordinary salvage, and the narration never closes it.

---

## `ux_nora_rangers` — the green truck

You hear the engine before you see it. You're near a gaping window when a truck noses up the cracked drive and stops — green, official, a gold star on the door, PARK SERVICE or something like it stenciled underneath. Two people get out in uniform, unhurried, competent, the body language of people who do this a lot.

You and Nora go down below the sill without a word, some animal agreement, and you listen.

They're not sightseeing. They walk the lot like they're checking it. One of them is on a radio, and the flat carry of a voice across empty concrete brings you pieces:

*"—nothing here, we don't see anyone—"*

*"—description again?—"* and then a description, and it is loose, and it is general, and it is close enough to you and Nora that your blood goes cold.

*"—yeah. If they come through, same as always, we flag it and we sit on it. Somebody wants eyes on this place, so we keep eyes on this place—"*

And that's the whole horror, delivered in a bored voice over a cheap radio in the middle of nowhere: they are *looking for people.* Not you specifically, maybe — a description, a type, whoever comes pulling at this — but people, and it's *routine* for them, and this dead stripped building that has nothing in it is watched, still, by someone with the reach to put uniforms on the ground and keep them there. Someone decided this nothing is worth guarding. And you are crouched under a window inside it.

- **"Do not move. Do not breathe."** → sets `rangers_hidden`. *(narration: "You go still in a way you didn't know your body knew how to, and you wait, and the radio crackles, and a boot scuffs somewhere too close, and every second is a year. And under the fear a cold clean thought assembles itself: someone is still watching an empty building. You will never be able to un-know that, and you will never be able to prove what it means.")* → queue `ux_nora_escape`.

> DESIGN: The exposure made visceral, per Dean — the walkie carries the two lines that do the work: *we don't see anyone* (you nearly weren't hidden), and *somebody wants eyes on this place* (the nothing is guarded, routinely, by reach). And it's held **unfalsifiable in the institutional key**: real rangers monitor real hazardous sites for real liability reasons, and "looking for people" can be trespasser-watch, and the mundane read stays fully available — which is what keeps this dread institutional and not supernatural. No lens tag here; the fear is pre-frame. The frame the player brought into the building (`read_skeptic` / `read_institutional`) is what they'll reinterpret this through, and the game never settles it.

---

## `ux_nora_escape` — out the back

You wait for the truck to work the far side of the lot and you go — low, fast, out a rear door and into the treeline, Nora's hand fisted in your sleeve, the two of you crashing into the woods with your hearts going and the building shrinking behind you until the green truck is gone and there's only trees.

You don't stop for a long time. When you finally stop, chests heaving, miles of nothing around you, you turn to say *we made it* —

and Nora isn't okay.

- **"Nora. Hey. Look at me. We're clear."** → queue `ux_nora_breakdown`.

---

## `ux_nora_breakdown` — she comes apart, and it's a choice how you meet it

She's shaking, and it's not the running. Her eyes are wrong — too wide, too fast, going from tree to tree like the woods are full of the truck. "We can't go home," she says. "You understand that? They had a *description.* They're *watching.* We can't go back, we can't go home, they'll be — they know, they *know* now—" and her voice is climbing toward something that won't come back down easy.

This is where you decide how to hold her. Choose carefully.

- **"Nora, we have to move. We have to get out of these woods and get you home and get you calm — come on, we're leaving, now."** *(you push — take control, move her)* → sets `nora_pushed`. *(narration: "You grab for her arm and you push, because pushing is what you do when someone's coming apart and you're scared too — and it goes wrong. She wrenches back from you so hard she stumbles. 'Don't — do NOT put your hands on me,' and there's something in her face you've never seen, cornered and furious and gone, and she's got a rock in her hand off the ground before you understand she's picked it up. 'I will put you down, I swear to God, get AWAY from me—' and she's not seeing you anymore, she's seeing the thing that's hunting her, and you realize the only way this doesn't get worse is if you stop being one more person closing in.")* → queue `ux_nora_close` with `nora_left_behind`.
- **"Okay. Okay. I'm right here, I'm not going anywhere, we don't have to move yet. Just breathe with me. In. Out. Nothing's coming. I've got you."** *(you go gentle — steady, stay, give her the ground back)* → sets `nora_gentled`. *(narration: "You stop pushing. You make yourself the one still thing in a spinning world, and you breathe, loud and slow, until she catches it — one ragged breath, then a slower one, then her eyes find you and it's *her* again, surfacing, exhausted, back. 'Okay,' she says, small. 'Okay. I'm here. I'm sorry.' She wipes her face. 'But I meant it. We can't be seen around here for a while. I'm gonna go stay with my — with somebody, out of the county, till this dies down. And you should keep your head down too.' And she means it, and she's right, and she walks out of these woods beside you instead of against you.")* → queue `ux_nora_close` with `nora_pact`.

> DESIGN: The whole grip theme, enacted through a person the player cares about. Push (the panicked, controlling response) and she turns on you — the rock, the *don't touch me*, the leaving-behind — and the lesson is written in her face: pressure on someone frayed is a threat, and it costs you. Go gentle and you give her footing back, and she surfaces and you get the pact — the reward of care. Neither is a stat check dressed as drama; it's the same grounded-vs-attuned cost the player will one day pay themselves, taught first from the outside. `nora_left_behind` and `nora_pact` both continue the thread (she reconnects either way — see close), but they change *how*.

---

## `ux_nora_close` — the walk out, and the thread stays live

**[if `nora_pact`]** You walk out of the woods together. At the trailhead she grips your hand hard, once, and says she'll call you when it's safe, and she means it, and she drives off toward wherever *out of the county* is, and you're left with a stripped building an hour behind you, a description that fits you, and the cold clean fact that someone still watches a place with nothing in it.

**[if `nora_left_behind`]** You back away with your hands up and you leave her there, because staying makes it worse, and it's the worst thing you've done in a while — walking out of woods and leaving someone you love holding a rock and shaking at shadows. You get to the road. You go home the long way, alone, sick with it. She'll surface — Nora always surfaces — and when she calls, days from now, she'll be flat and apologetic and she won't quite meet the memory of it, and neither will you.

Either way, this is where the day ends. Not with an answer — with a place too valuable to abandon and no way to say why, a cousin who was *right about the shape of it* and will never be able to prove the rest, and the specific institutional cold of knowing that the danger out here might not be a ghost at all. It might be people. That's worse.

> DESIGN: The thread stays live on both branches — Nora reconnects either way (she's the *right*-axis engine and the player's line into the institutional frame), but the pact-vs-left-behind changes the texture of every future Nora beat (warmth and partnership vs a wound neither names). No terminal; control returns to the loop. What she leaves the player: `read_institutional` reinforced (right about the skeleton, unconfirmed about the frame), the hunted-and-watched fact, and a standing reason to keep their head down. The sealed layer — who watches, what the center was — surfaces in nothing; the player carries only the *shape* of it out into the loop.

Exit flags: `nora_daytrip_done`, `thread_nora_active`, whichever of `nora_pact` / `nora_left_behind`, and the `read_*` frame the player left the building with.

---

## Notes for the wire (Armature / Plumb)

- **Loop-native, frozen-cave-safe.** Committed outing → queue-chained scene. Reads `thread_nora`, `nora_center_known`, `noticed_nora_fray`; writes `nora_*`, `read_*`. Touches nothing in `cave-b3`.
- **The `read_*` reads carry `lensFlavor`** — `read_skeptic` → `skeptic`, `read_institutional` → `institutional` (both in the locked vocabulary). The rangers beat carries **no** flavor — the fear is pre-frame, and it gets reinterpreted through whichever read the player already set. `noticed_nora_fray` / `nora_pact_careful` gate one introspective option carrying a small grounded `attune` lean (never in the draw).
- **No position gates anywhere.** Grip is not touched in this scene (Nora's fraying is *hers*, narrated, not the player's stat) — deliberately: the player watches fraying from outside without paying grip for it, which is the whole teaching function. The player's own grip cost for this frame lives back in the research decks, not here.
- **Both breakdown branches continue the thread** — no dead ends; `nora_left_behind` is a wound, not a termination.
- **Linter-clean** — echoes are prose; no `*…*` in any `log`; all refs resolve within this pass.

— Loom
