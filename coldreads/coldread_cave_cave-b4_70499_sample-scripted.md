# Cold read — cave · build `cave-b4` · seed 70499
*schema v1 · reader-facing prose + numbered options; `> trace` lines are analyst-only (never shown to the reader)*

## Step 1 — `ux_cave_enter`

He's been texting about the White's Hall Cave System, off the old fire road.

You load the pack and meet Reese at the fire road.

The entrance is a slot behind a fallen slab off the old fire road, and Reese is through it before you've got your headlamp seated right. Inside, the air turns cool and mineral, and the daylight quits about thirty feet in — all at once, the way it always does, like a door closing behind you.

This stretch is travelled. You read it in the floor: worn smooth down the center where a few thousand boots picked the same line, a spray-painted arrow so old it's gone the color of the rock. Reese narrates the whole way — some guy on his feed who runs systems like this with no light, which is either a lie or a life expectancy. It's easy going. Almost cozy, if you're the sort who finds a mountain's insides cozy.

You are.

Options:
1. Take point.
2. Let Reese run ahead.

**Reader:** [reader think-aloud for ux_cave_enter]
**Picked:** 1. Take point.

> trace: day 1 · stats — · flags cave_lead=self

## Step 2 — `ux_cave_descend`

You take point.

An hour in, the cave stops being a place people come to.

It's gradual — that's the thing about it. The smooth center-line frays out into rubble. The old arrows stop. The passage starts to lean, the walls closing by degrees until you're both walking with a hand out and your head cocked. Mud where there was dry stone. The ceiling comes down to meet you a little at a time, so politely you don't notice you've been stooping until your back tells you.

Reese has gone quiet — not spooked, just working, reading the route. Ahead, the passage splits low and mean.

Options:
1. Keep going. This is what you came for.
2. Call it — this is getting dangerous.

**Reader:** [reader think-aloud for ux_cave_descend]
**Picked:** 1. Keep going. This is what you came for.

> trace: day 1 · stats — · flags —

## Step 3 — `ux_cave_heard`

You press on.

Another twenty minutes and Reese stops dead, fist up. Kills his lamp. Yours too, a beat later, and the dark that comes down is total — not dim, not shadowed, the absolute black of a place the sun has never once reached.

"...tell me you heard that," Reese whispers. And it's strange coming from him, because Reese is the one who explains everything, and right now his voice has a thread in it you've never heard.

Options:
1. "Probably a bat. They get down this deep."
2. "That wasn't a bat. That sounded like a voice."
3. "I didn't hear anything. Lamp back on."
4. "Please tell me you're not turning into one of those people, Reese."

**Reader:** [reader think-aloud for ux_cave_heard]
**Picked:** 2. "That wasn't a bat. That sounded like a voice."

> trace: day 1 · stats grip -1 · flags cave_heard_voice=true

## Step 4 — `ux_cave_squeeze`

The passage chokes down to a horizontal slot maybe a foot and a half high — a wet stone throat that goes somewhere; you can feel air moving through it, which means it opens on the far side. Reese is already flat on his belly, lamp poking in, grinning back at you with too many teeth.

"I can make this. Three body-lengths, tops. You right behind me?"

You've done squeezes. You know the math of them — the part where your ribs are the widest thing about you, and the rock does not care.

Options:
1. "Yeah. Right behind you."
2. "That's a no. There's the high passage — let's take the long way."
3. "This isn't really what I had in mind, man."
4. "I'll spot you. Go — I'll follow if it goes."

**Reader:** [reader think-aloud for ux_cave_squeeze]
**Picked:** 1. "Yeah. Right behind you."

> trace: day 1 · stats — · flags —

## Step 5 — `ux_cave_squeeze_through`

You don't love it; you don't say so.

Reese goes first and vanishes to the soles of his boots, then those too, and for a few seconds you're alone in the black with the sound of him grunting somewhere ahead. Then your turn. Arms first, lamp scraping, and you get halfway before the rock finds your ribs and holds — that half-second again, the one from the quarry, except there's no drop this time. Just a mountain deciding whether to let you through.

Options:
1. Empty your lungs and go.

**Reader:** [reader think-aloud for ux_cave_squeeze_through]
**Picked:** 1. Empty your lungs and go.

> trace: day 1 · stats grip -1 · flags cave_squeeze_done=true, cave_scare=true · roll squeeze d20 4+0=4 vs 10 → LOSE

## Step 6 — `ux_cave_deep`

For one long moment you are genuinely stuck, the panic a white animal behind your eyes — then Reese has your wrists and hauls, and the rock lets go with a scrape you'll feel for a week.

However you came through it, you're somewhere now that isn't on any map in either of your heads.

The chamber is bigger than it has any right to be this deep — the lamps don't find the far wall. Underfoot, that same wrong cleanness. And the smell, stronger, sitting in the back of your throat. Reese turns a slow circle and for once doesn't narrate. You watch him decide, very deliberately, to be fine. "Cool. This is sick, actually. Nobody's tagged this."

Then his lamp catches the wall, and stops.

Options:
1. Follow the lamp.

**Reader:** [reader think-aloud for ux_cave_deep]
**Picked:** 1. Follow the lamp.

> trace: day 1 · stats — · flags —

## Step 7 — `ux_cave_etchings`

You follow the beam to the wall.

They're cut into the rock at about chest height, and they run along — not one mark, a sequence, worked into the stone with something patient. A star boxed inside a circle. Rows of small deliberate scratches beside it that your eye keeps trying to read as letters and keeps failing. The cuts are clean-edged. They aren't old.

Someone made these. Carefully. In a place with no way in that a person has ever used, and no way out but the two you just barely found.

"It's teenagers," Reese says, too fast. "It's — this is your imagination doing the thing. Teenagers, they get everywhere." He is already not looking at it.

Options:
1. "You're right. Teenagers. Little idiots with too much rope."
2. "…I've seen this. Nora had a picture of one just like it."
3. "It looks like something out of a church. Old. The kind of old that means something."
4. "Where have I seen this before?"
5. ▓▓▓▓▓▓▓▓  *(unavailable)*

**Reader:** [reader think-aloud for ux_cave_etchings]
**Picked:** 2. "…I've seen this. Nora had a picture of one just like it."

> trace: day 1 · stats grip -1 · flags cave_etchings_seen=true, etchings_link_nora=true

## Step 8 — `ux_cave_return`

"We're going," Reese says, and it isn't a suggestion, and you don't argue. The way back is the way you came — the throat again — and going up through a squeeze is worse than down, everyone knows that, and your pack is the widest thing on you now.

It won't fit with you. You can feel that already. You can wear the pack or wear yourself out fighting it, but not both.

Options:
1. Shed the pack — push it ahead, take the loss.
2. Keep the pack. Fight through with it.
3. Stay a minute. Copy the marks before you go.

**Reader:** [reader think-aloud for ux_cave_return]
**Picked:** 3. Stay a minute. Copy the marks before you go.

> trace: day 1 · stats grip -1 · flags took_shard=true, cave_done=true, cave_deep_seen=true · roll squeeze d20 5+0=5 vs 10 → LOSE

## — end of scene —

You crouch at the wall with the light in your teeth and copy the strangest run of it line for line — a row of marks like numerals knocked sideways, an ellipse around them that doesn't quite close — while Reese holds his lamp on it and complains about the cold. Proof, if you ever need to prove this to anyone. Yourself included.

You get out — pack torn away on the rock — but the page stays on you.

## Debrief

**Q1.** In a few sentences — what story do you think you just played?
[sample placeholder answer]

**Q2.** What kind of story would you call it? And when did you first start thinking of it that way?
[sample placeholder answer]

**Q3.** Was there a moment that stuck with you most? What was it, and what do you think was going on there?
[sample placeholder answer]

**Q4.** Some things may not have been fully explained. What do you believe was actually happening — your best theory, even if you're unsure? And how confident are you: not at all, somewhat, quite, or very?
[sample placeholder answer]

**Q5.** Was there anything you noticed that you couldn't quite account for — something small that didn't fit?
[sample placeholder answer]

**Q6.** If you could keep playing, what would you do next, and why?
[sample placeholder answer]

**Q7.** Last one — did anything about the experience itself, the way choices appeared or behaved, strike you as unusual?
[sample placeholder answer]

_Operator notes: scripted sample — not a real reader_
