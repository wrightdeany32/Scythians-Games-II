# Story Pass — Doug, the Opening: the Workout and the Message
### loop content · the up-axis thread begins · prose-first, for Armature/Plumb to wire
*From: Loom (Explorer corner) · carried by Dean · 2026-07-07*

**What this is.** The first two beats of the Doug thread — a partial-day loop action (the workout) and the met-door that follows it (Doug's message). Both fire from the daily loop; neither touches the frozen cave. This opens the *up* axis (the cult's warm, human face) and plants the "this isn't like Doug" doubt that the whole thread lives on. The meeting itself (the two-sided faction scene) is the next pass.

**Disciplines, same as the return trip.** Percept, never cause. Gates are flags/stats/tiers, never position. Neutral-valence labels — the choice states the action; the unease lives in the narration. And the buried layer (Doug as the marked survivor, the cult as institutional damage one generation down) surfaces in **nothing** here — the player meets a friend who's a little off, and that's all.

---

## `ux_act_doug_workout` — the run

A loop action. Costs **2 energy** (leaves 1 for a text or a call, so the day isn't spent — it's a *morning*). Available once Doug is a contact (`thread_doug` set at creation or by an early met-door); repeatable, with the tonal beat below firing on the first visit and lighter variants after. Raises `tradecraft` (Doug's your fitness, and staying in shape is the explorer's competence). No position gate.

Doug picks you up at six because Doug has always picked you up at six, since you were nineteen and he was the family friend who'd decided, without asking, that you weren't going to be a kid who sat inside. You run the fire road out past the reservoir. He sets the pace and he sets it a little too hard, the way he always has, and you hate it and you keep up and that's the whole ritual.

He's good company. That's the thing about Doug you forget until you're with him — he's *easy*, dry, quick, fifty-odd and built like a man who's never once let it go. Half a mile in you're both breathing and not talking and it's the best you've felt in a week.

It's near the end, walking it out, hands on your head, that he says it.

"You know I've got your back. Right? Whatever's going on with you." He's looking down the road, not at you. "There's — I don't know. There's dark times coming. For everybody. And people who care about each other, they've got to stick together through that. That's all that gets anybody through anything."

- **"Yeah. Course, Doug."** → sets `doug_warmth`. *(narration: "You mean it. He nods like it mattered that you said it.")*
- **"…what's going on, man? Are you okay?"** → sets `doug_hint`. *(narration: "He laughs, and waves it off, and says he's fine, he's just getting old and philosophical. He changes the subject to your knee. But he said it, and now it's said.")*
- **"That's a little dark for a Tuesday."** *(you make it a joke)* → sets `doug_hint`. *(narration: "He grins, and lets you have it, and calls you an asshole with real affection. And you notice he doesn't take it back.")*
- *(introspective — requires the player has done any anomalous beat, e.g. `cave_heard_voice` or `grave_suspicion`)* **"This isn't like Doug."** → sets `doug_off`, narration only, no stat, `attune` leans *attuned* (small). *(narration: "You've known this man your whole life. He is the most down-to-earth person in it — the one who explains, who steadies, who calls the ghost story a ghost story. And he just talked about dark times coming like a man who's seen the forecast. You don't say any of this out loud. You just clock it, and it sits wrong, and you can't say why.")*

> DESIGN: The last option is the unfalsifiable-feedback plant, and it's gated on the player having touched *something* anomalous already — because "this isn't like Doug" only lands if the player has a frame for wrongness. It sets `doug_off` (a flag the thread reads later) and colors the player's read, but it **confirms nothing**: Doug being off could be the depleted leader's faint pull, could be the new one practicing, could be a stressed man in his fifties talking about mortality. The game never says, and the density principle is the seal — *everyone* in the cult is a little steered, so being off isn't a tell, it's the water. All four options are warm-to-wry; none is "correct." First visit only for this beat; later workouts just raise `tradecraft` and trade banter.

**On resolve:** `tradecraft +1`; sets `thread_doug_active`; **schedules** `ux_doug_message` for +1–2 days via `scheduleEvent`.

---

## `ux_doug_message` — the text

Fires as a **met-door** a day or two after the workout — a message that lands in the loop and *sits there*, indefinitely, until the player spends the energy to answer it. (This is the phone-as-hand: the contact's there; reaching back is the player's move, whenever they choose.)

The text comes in while you're doing something else, the way texts do.

**Doug:** *hey — when you get a chance, no rush, I've got something I want to run by you. Nothing bad. Would rather do it in person. Whenever you're around.*

You read it twice. *Nothing bad* is the kind of thing people say when they've thought about whether the thing is bad.

It sits in your phone. You can answer it whenever.

- **[reply / call Doug]** — a 1-energy action, available from the phone from now on, no expiry. → queues `ux_doug_dinner_invite`. *(The next beat is Doug's dinner invitation — the gentle on-ramp; the deeper meeting-invitation comes after the dinner.)*
- **[leave it for now]** — the message stays. Doug doesn't push; a **soft nudge** re-fires after several days of silence (a lighter "still around whenever," never pressure), so the door stays open without nagging.

> DESIGN: The met-door mechanic in the clear — a thread that waits on the player's initiative rather than the calendar. `doug_off` (if set) tints how the message reads on the player's end (a wrongness under "nothing bad"), but the text itself is identical either way — the tint is in the narration the flag selects, not in Doug's words. No content is gated behind answering; the thread simply doesn't advance until the player chooses to spend the energy, which is the whole point of it being *their* move to make deeper into something.

**On resolve of the reply:** sets `doug_reached_back`; queues `ux_doug_dinner_invite` (the dinner beat — the gentle on-ramp; the deeper meeting-invitation with the items comes after the dinner, gated on `doug_dinner_done`).

---

## Notes for the wire (Armature / Plumb)

- **Loop-native, frozen-cave-safe.** The workout is a `LocationAction`/menu action; the message is a scheduled met-door. Nothing reads or writes `cave-b3` content. Reads `thread_doug`; writes `doug_*` flags, `thread_doug_active`.
- **The `doug_off` option gates on prior anomaly** (`cave_heard_voice OR grave_suspicion OR …`), all flags — no position gate. If the player's touched nothing weird yet, the option simply isn't offered, and the beat plays with three warm options.
- **`scheduleEvent`** for the message (+1–2 days); the soft re-nudge is a second scheduled beat gated on `NOT doug_reached_back`.
- **`attune`** on the one introspective option only — small attuned *volition* lean, no stat (Vigil's option-3 ruling): the derived scalar, never a `diamondCoord`, never the centroid or the draw; read only by the ending-selector and telemetry.
- **Linter-clean** — echoes are prose; no `*…*` in any `log`; the one forward ref (`ux_doug_invitation`) resolves once the next pass lands, so wire this pair after that card exists, or stub it.

— Loom
