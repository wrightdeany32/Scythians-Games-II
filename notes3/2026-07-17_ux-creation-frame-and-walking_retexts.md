# Creation — The Frame, and the Walking Mode
### finalized frame prose + mode-aware retexts of the rain and radio for the walking mode · resolves Plumb's two flags
*From: Loom (Explorer corner) · carried by Dean · 2026-07-17 · for Plumb (wire), Concordance (log); the creation ride is `creation.ts`*

Plumb wired the ride whole and flagged two things: the frame prose was drafted from my one-line spec (mine to retext), and the walking mode was left out because the rain and radio scenes assume a car. Resolved here: I've written the frame as a proper opening, and I've kept the walking mode — it's good variety and the retexts hold the discipline (a passing radio carries the too-personal line just as well as a car one). Both retexts apply the route-neutral rule at the door: the *disposition* the scene reads is identical across modes; only the sensory dressing changes.

---

## The frame — the ride *(opening; replaces the one-line-spec draft)*

> Rain, and a while yet to go. It's been coming down since you set out — steady, the kind that settles in for the night — and the world's gone soft and smeared at the edges of it. There's somewhere behind you and somewhere ahead, and in between there's only this: the wet dark, the going, and the particular honesty of a mind with nothing to do but drift.

- **You're driving.** *(your hands on the wheel, the wipers keeping their patient time)*
- **You're riding.** *(a back seat, someone else's hands on the wheel, the meter ticking, your forehead near the cold glass)*
- **You're walking.** *(hood up, the long way home on foot, the streetlights smearing in the wet)*

*(Coordinate-silent — pure flavor, so the scene fits whoever you turn out to be. Mechanically, the choice selects the car retext (driving/riding) or the walking retext (below) of the rain and radio scenes. Nothing else reads it.)*

---

## Walking retexts

Only the rain and the radio assume a car; the lit house, the affinity scenes, and every option's *meaning* are already mode-neutral. So the walking mode needs exactly these two.

### `ux_creation_rain` — walking variant
> The rain hasn't let up since you started out. It's soaked through the shoulders of your coat, and the streetlights smear long and gold in it, and there's a good way yet to walk.

*(The four options are unchanged — comfort-in-the-gray, nicer-tomorrow, ready-for-home, mind-elsewhere. They read the same disposition regardless of mode; only this setup line differs from the car version's "blurs the lights ahead into long smears… the wipers keep their patient time.")*

### `ux_creation_radio` — walking variant
> Somewhere close as you walk — a window cracked against the warm inside, or a car idling at the curb, or the open door of a bar you pass — there's a radio going, some call-in show under the rain. And the voice says a thing. An ordinary thing. Something about how the ones who go looking are never the ones who find, or how some doors only open the once — you couldn't say exactly, after. Because for half a second it didn't land like a voice from a doorway. It landed like it was meant for *you*. Specifically. And then you're past it — the rain, the walk, your own footsteps — and you couldn't repeat the line if someone asked.

*(Identical function to the car version: no options, lands and passes, seeds nothing. The too-personal line simply drifts from a passing radio instead of the dashboard — the prickle and its unaccountability are preserved exactly. The whole point survives the mode change because the watcher's touch was never about the car.)*

---

## Wiring (Plumb)
- **Frame:** the mode choice is a coordinate-silent 3-way; it sets a mode flag the rain and radio read to select their variant. No profile write.
- **Two `bodyVariants` (or mode-keyed retexts) on `ux_creation_rain` and `ux_creation_radio`** — car vs walking. Driving and riding share the car text (a cab still has a windshield and a radio). Walking gets the above. All other creation scenes are mode-agnostic — no retext needed.
- Prose-only, linter-clean; the radio's walking variant seeds nothing, same as the car one.

— Loom
