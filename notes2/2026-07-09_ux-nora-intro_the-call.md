# Story Pass — Nora's Intro: The Call from the Cousin Who Was Right
### Nora's establishing beat · the materialist lens arrives · prose-first, for Armature/Plumb
*From: Loom (Explorer corner) · carried by Dean · 2026-07-09 · the `ux_nora_intro` stub, authored*

**What this is.** Nora's first real appearance — a phone call after the player's first trip to White's Hall. It seats the **materialist/institutional lens** (the research center, the disappearances-against-dates) as the counter-melody to Marie's folk dread, establishes Nora as the eccentric-but-*right* cousin (conspiracy-minded, a little wild, wrong about plenty and not wrong about this), pitches the return-to-the-cave as an urbex documentation run, and — for the player paying attention — shows the fray under the eccentricity and the one biographical silence she won't open. If the player copied the cave cipher, this is where Nora *recognizes* it, and her theories stop being a hobby.

**Where it sits.** Fires after the first cave trip (`cave_done`). Sets `thread_nora` + `nora_center_known` (both choices — the wall gets revealed regardless). The engaged choice plants `noticed_nora_fray`. A `[if took_shard]` extra lands the cipher recognition. Coordinate-silent (this is Nora *presenting* a frame; the player's reading of it comes at her thread's frame-setters, not here).

---

## `ux_nora_intro` — the call

Nora calls two days after you get back from White's Hall — which is how you find out Nora knows you went to White's Hall, a small unsettling thing you decide not to poke at. "Don't tell me it was nothing," she says, before hello. "You went down there. What did you see."

She's been waiting years, she says, for somebody in the family to go down there who'd actually *pay attention* — not Reese, God, Reese would step over a body and call it a rock — somebody who'd notice things. She wants you to go back. Properly, this time: lights, a camera, a real record. "You're the explorer, you know how to document a site — I need it documented." She frames it like a favor to the hobby, footage for the channel, a diagnostic pass. But there's a pitch under the pitch and you can both hear it humming.

Because Nora has a *wall*, it turns out — actual string, she admits, not embarrassed enough to stop: forty years of people who went into those woods and came out wrong, or didn't come out, laid against dates. And at the middle of the dates there's a place. A research station, past the hall, back in the fifties and sixties — federal money, then no money, then nothing, and the records gone in the specific way records go when somebody made them gone. "That's not a theory," she says. "That's a records request that came back with a black rectangle where a building used to be."

- **"Nora. Is this the lizard-people thing again?"** *(you reach for the old joke)* → *(narration: "'Laugh,' she says — and she does, a little, because you two have ribbed each other about this since you were kids and the ribbing is load-bearing. Then she stops. 'I'm wrong about a lot of it. I keep a whole folder of the stuff I've been wrong about. This one I'm not wrong about. And it scares me that you went down there, and I need you to take it a *little* bit seriously, because I can't get one other person on this earth to.'")* → sets `thread_nora`, `nora_center_known`.
- **"Okay. Show me the wall."** *(you take her at her word)* → *(narration: "Something goes out of her all at once — relief, or the particular tiredness of being believed after a long time of not being. 'Yeah,' she says. 'Yeah. Come over.' And then, quieter, careful: 'You said you drew something, down there. Bring that.' There's a beat where you catch it — how worn she sounds under the wire of her, like she hasn't slept the good kind of sleep in a while. And when she says a year — 'I've been keeping track since —,' and names one — she says it the way you'd say a scar, and you go to ask why that year, what happened that year, and something in how she said it closes the door before you reach it. She's your cousin. You've known her your whole life. There's a room in her you have never once been inside.")* → sets `thread_nora`, `nora_center_known`, `noticed_nora_fray`.

**[if `took_shard`]** You mention the marks — describe them, the numerals knocked sideways, the ellipse that won't close — and Nora goes very quiet on the line. "Send me a picture," she says, and her voice isn't the same voice. "Now. Send it now." You do. The silence runs long enough that you say her name into it. "Where did you *see* this," she says, and it isn't a question the way she says it — it's the sound of a thing she's been afraid of for a long time finally walking in the door. She won't say one more word about it over the phone.

---

## Notes for the wire (Armature / Plumb)

- **Fires on `cave_done`** (Nora's establishing call after the first cave trip). Reads `cave_done`, `took_shard`. Writes `thread_nora`, `nora_center_known` (both choices); `noticed_nora_fray` (the second/engaged choice only — the attentive player catches the fray and the biographical silence). The `[if took_shard]` extra is additive and fires under either choice.
- **The biographical silence is the quarry-pattern instance** — an unexplained year she won't open, a room in her the player never enters. It plants that Nora's stake is *personal*, points somewhere real, and is never explained here (or ideally anywhere near here) — that's the whole grammar of it. It's gated behind the engaged choice so it reads as a reward for paying attention, not a broadcast.
- **Coordinate- and lens-silent** — Nora *presents* the institutional frame; the player's adoption of it (skeptic vs. institutional reads) happens at her thread's frame-setter beats (the day-trip's `ux_nora_explore`), not on this call. No `diamondCoord`/`attune`/`lensFlavor` here.
- **The cipher recognition** is the concrete hook that turns Nora's "hobby" into the materialist spine — and the payoff for the reframed shard. It reads clean whether or not the player took the copy: absent `took_shard`, the call simply ends on her wanting the wall seen.
- **Frozen-cave-safe; linter-clean** — prose only, no `*…*` in any log.

— Loom
