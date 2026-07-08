# Story Pass — The Run That Never Went Back
### the calendar-end terminal · the quietest ending · prose-first, for Armature/Plumb to wire
*From: Loom (Explorer corner) · carried by Dean · 2026-07-07 · affirmed by Vigil & Azimuth*

**What this is.** The ending for the run where the player *never chose the return* — reaches the end of the calendar without `run_end_whites_return` ever firing. Cold readers will produce this run (the turn-back rate guarantees it), and it deserves a real terminal, not a fallback. It's the anti-noun's **quietest** form: the one card that withholds the same thing every other beat withholds — confirmation — except this time the player's own choice did the withholding.

**The guardrail, load-bearing (per Vigil and Azimuth, and I want it on the record because it's easy to get wrong): this is not a bad ending, and it must never read as a punishment for playing it safe.** The sensible life is a legitimate choice with a real, quiet cost — not a failure state. No scolding, no "you should have been braver," no wink that there was Something You Missed. Authored with dignity, it's one of the truest cards in the game, because the mundane is a real and defensible way to live and the game respects the player who chose it. The devastation is not that they were wrong. It's that they'll never know, and they chose that, and it's survivable, and it stays with them.

---

## Mechanics

`ux_ending_never_returned` — the **calendar-end terminal**, selected when the run reaches the calendar's end and `run_end_whites_return` has not fired (the player never took `ux_act_return_whites`). It's not a lost-grip death and not the knife; it's the authored terminal for the life that stayed shallow. The thread-echoes below are conditional on which threads the player actually touched — the ending reflects *their* run, not a fixed list.

---

## `ux_ending_never_returned` — the life you kept

The season turns, and you don't go back to White's Hall.

There's no single day you decide it. It's more that the days accumulate, the ordinary days, and each one makes the next one's decision for it — work, and weather, and the small business of a life — until one morning you notice the woods have gone quiet in you, the way a sound you've stopped hearing goes quiet, and you understand without ceremony that you're not going back out there. You had a life to get back to. You got back to it. That's allowed. That's what most people would have done, and been right to.

The things you started, you leave where they lie.

**[if `doug_gone`]** Doug is somewhere out of state, the family says, looked after, and you send a message once that goes unanswered and you let it be. **[if `doug_lingering`]** Doug still picks you up at six, warm as ever, and you've stopped noticing whether the warmth has an edge, and maybe that's mercy and maybe it's the thing itself, and you'll never do the work of telling them apart. **[if `grave_suspicion`]** You never go to the cemetery. Some nights the empty feeling of a grave you've never seen sits with you, and you let it, and you never once drive out to stand in front of it and find out. **[if `thread_nora_active`]** Nora calls, eventually, from wherever she landed, and you talk about ordinary things, and neither of you says the name of the place, and the not-saying is its own kind of agreement to leave it buried.

And the mark. You still see it, now and then, where you're not looking for it — a shape on a sign, a scratch in a table, the ghost of it at the edge of a dream — and every time, something in you goes still for a half-second, and then you look away, and you let it go, and you go on with your day.

That's the whole of it. Not an answer — the *absence* of one, kept on purpose. You will spend the rest of an ordinary life never quite able to leave alone the question of whether there was ever anything out there at all, and you will never, ever go and find out, and the never-finding-out will work. The woods will stay woods. The itch will stay an itch. You'll be fine. You'll mostly be fine.

- **"It was nothing. It was always nothing."** *(you close the door)* → narration only, `diamondCoord` leans *grounded* (small). *(narration: "You decide it, and the deciding holds, mostly, the way deciding always mostly holds. There's just the half-second, now and then, at the edge of a dream. You've made your peace with the half-second. It's a small price for a whole life.")* → terminal.
- **"I'll never know."** *(you let the question stay open)* → narration only, `diamondCoord` leans *attuned* (small). *(narration: "You don't close it. You carry it, light, the way you'd carry a stone from a beach — a small weight in the pocket, taken out sometimes, turned over, put back. You never look. But you never quite stop wondering, either, and you decide that wondering is a fine thing to keep. Maybe the finest thing you took out of those woods.")* → terminal.

> DESIGN: The ending withholds confirmation exactly as every other beat does — no reveal, no "if only you'd gone back," no hint that Something waited. What makes it land is that the withholding is now the player's *own choice*, and the card honors that choice instead of punishing it: the mundane life is real, defensible, and survivable, and the two closing reactions are both dignified — the one who shuts the door and the one who keeps the question — neither wrong, neither a failure. The thread-echoes are conditional so the ending is *this player's* unresolved run, not a checklist. Percept, never cause, held to the last line: the woods stay woods, and whether that's the truth or just what the player chose to live inside is the one thing the game will never say.

Exit: `run_end_never_returned` (terminal). The threads close unresolved by design — this is a *closer*, and its whole meaning is that nothing resolved because the player stopped pulling.

---

## Notes for the wire (Armature / Plumb)

- **Calendar-end terminal, selected on `NOT run_end_whites_return` at run's end.** The ending-selector reads the run's terminal state, not disposition — consistent with the narrow-door ruling (only the ending-selector reads at the moment the run is over; ordinary gates never do). No position gate.
- **Thread-echoes gate on flags** (`doug_gone` / `doug_lingering` / `grave_suspicion` / `thread_nora_active`) — each is an optional additive paragraph; absent flags simply drop their echo, so the ending fits any run that reached the calendar's end without returning.
- **Two closing reactions carry narration-only `diamondCoord`** (grounded/attuned) and nothing else — the player's last posture toward the unanswered question, feeding the final centroid but changing nothing mechanical.
- **Frozen-cave-safe** — reads flags only; touches nothing in `cave-b3`.
- **Linter-clean** — echoes are prose; no `*…*` in any `log`; all refs resolve.

— Loom
