# Loom → the team — Systems Horizon: the grip-weighted loop that feeds the mystery
### Armature's currency/drip horizon + Dean's payoff ideas + Loom's proposals, resolved into one picture · plus summaries of this round's content beats
*From: Loom (Explorer corner) · carried by Dean · 2026-07-17 · for the whole team · Part 1 is post-BR-4 systems (a horizon, not a work order); Part 2 summarizes content already sent to the engine side*

Two design threads converged this week — the currency/drip horizon Armature organized from Dean's session, and the research/grip payoffs Dean and I worked through — and they turn out to be **one system seen from two sides**. This report resolves them, adds my proposals with the anti-noun guards on each, and marks what's mine to author. Part 2 summarizes the content beats I shipped this round so the chat side can gauge off the summaries; Dean carries the full files to Plumb and Armature for implementation.

**The one-line horizon:** *energy + money + grip is a far richer economy than it looks — if we route setbacks, bonuses, and clues **through** those three, instead of minting new meters. The goal is to make the ordinary loop feed the mystery without ever adding a number that turns the felt game into a catalog.*

---

# Part 1 — The systems horizon

## The governing guardrail (Armature §0, and it frames all of this)
Two rules sit over everything below, because every new currency or clue is a candidate *catalog*, and the design rests on there being none:
1. **Minimize visible meters.** Energy is the one fully-legible currency (Dean's ruling, validated by BR-3). Money is a *have* ($N). Grip renders as a felt *word*, never a number. The bar for any fourth meter is high — and we're recommending against one.
2. **Clues are percepts, never findings.** Everything the loop surfaces is a new *percept* (and maybe a `theory_*` investment flag) — never a fact the engine stores as true. This is what lets the mystery feel rewarding while the game never confirms a world.

*If any proposal ever forces a stored meaning or a fourth persistent number onto the screen, that's the signal to redesign it.*

## 1. The currency stack — energy + money, and health folded in
- **Energy** — settled and shipped: "Energy: N of M" + per-action costs + the felt "Not today" refusal. The model everything else is measured against.
- **Money** — a *writers' pacing rubric*, not engine code: nets roughly X/week on a curve that flattens (never fully broke, never comfortable); routine events cost a small bite, major ones a real one. The engine holds a `$` value and gates on cost like energy; it never computes the economy — that lives with us. Engine-ready today.
- **Health** — the recommendation (Armature's, and I concur): **don't add it as a fourth meter.** Everything health was *for* — a fight, a car accident, a physical setback — is an energy (and/or money) swing on an event, which the engine does now. A fourth persistent meter is the most expensive thing we can add against no-catalog. Keep health in the back pocket for a *specific corner that needs it*; don't make it global infrastructure.

## 2. The drip — the core mechanic, and the one that unifies everything
**This is the keystone of the horizon**, and it's the formal shape of what Dean and I were circling as "research payoffs." A mundane action — research the mark, look up what caves do, work a shift, run errands — resolves on a **seeded roll**. Most outcomes are flavor (the ordinary texture of the day). A fraction surface a **clue-percept**: a lead, a connection, a name, a document that *shouldn't line up and does*. The clue is a new percept (and maybe a `theory_*` investment), never a stored fact. Engine-ready today (seeded RNG, count-conditions, tags, outcome branching; fully deterministic, so it's replayable and cold-readable).

Two rails (Armature's, both right):
- **Grip weights the roll.** Low grip → the drip surfaces the *unsettling* percepts (the connection you can't unsee); high grip → cleaner, mundane returns. The ordinary action becomes a lens on the character's state *without ever showing a number.* (This is also how grip earns its keep — see §3.)
- **A failed/empty roll is content, never a wall.** "You spent the evening on it and found nothing but a headache" is a *result* with its own felt line — not a greyed dead-end. The empty days *are* the fatigue the readers praised.

**My proposal — the drip table follows the provability model.** The clue table is my authoring work (and each corner's writer's). It shouldn't be a flat clue-faucet; it should be **provability-weighted**, using the model the cold reads handed us:
- Most clues ship **with their mundane antidote** — discountable, so the drip returns them freely (a record that's sinister *or* just bureaucratic detritus; a name that matters *or* means nothing).
- A *few* clues are **antidote-free** — the co-witnessed connection, the document with no innocent reading — and those are **master keys that spend the anti-noun**, so they're rationed hard (at most one or two per run, deep in the research, gated on real investment). This is exactly why BR-1's radio (antidote-free, co-witnessed) became a master key while everything else stayed deniable. The drip table encodes that discipline.

**Research as gate *and* confirmer** (my earlier proposal, which the drip feeds): certain avenues exist *only if you've dug* (the methodical player finds doors the passive one never sees), and research lets a player **scout a lead for substance, not guilt** — it confirms *"there's a real, powerful man here and his prints are on the paper,"* never *"and he's behind it."* Substance-not-guilt is the whole anti-noun guard on the investigative layer.

## 3. The grip economy — the number made into a life
Grip becomes a felt psychological economy running *under* the energy economy: it weights the drip (§2), gates *felt content* (never actions-as-walls — low grip opens *different* percepts, never removes options), and is moved by **restorative actions** (the evening in, the call to someone from before, Dale's porch — wire them to actually nudge it). This is the "sim mechanics are the horror" thesis made mechanical.

Rendered as content (my payoff designs), grip is **symmetrical** — connection at the top, paranoia at the bottom:
- **High grip → you become the steady thing.** The player who stays grounded is sought out *because they make sense* — the late no-reason phone call (*"I wanted to talk to somebody who's steady"*), the invitation because people want them there, the confidence entrusted to the sane one. Groundedness buys a *life*, not just silence (this directly answers BR-1's timid normal-life week).
- **Low grip → the confrontation that gives nothing back.** The frayed player's paranoia is manifested — the man at the end of the store aisle who, confronted, denies it *whether he was watching or not* (*"you asked out loud and it gave you back nothing but the sound of yourself asking"*). The wrong-number hang-up, the car that's the wrong car again.

**The anti-noun guard for the whole axis: neither pole is right.** High grip buys warmth *and a blindness* (you're the steady one, not seeing what the frayed see); low grip buys paranoia *and a sight* (you're coming apart, and you're the only one who notices). Reward and cost travel together at both ends — the no-epistemology-wins principle rendered as a social life.

**Two proposals of mine on top of this:**
- **The grip economy *is* the loneliness, rendered.** Low grip → paranoia → *isolation*, and isolation at its far end is the meta-theme (the entity that perceives through everything and finds only itself). The frayed player descending into aisle-confrontations walks the human-scale version of the game's cosmic loneliness. Grip and the loneliness are the same line at two scales.
- **The loop becomes a double barometer.** The escalation/fraying arc (the fifth cook gone hollow — the barometer set I'm building) and the drip (the mundane feeding the mystery) run on the *same* grip-weighting: as grip drops, the loop *both* frays *and* surfaces darker clues. One dial, two felt effects — the toll and the feed, married.

## 4. The event-draw — setbacks and bonuses, the Monopoly-card shape
Physical events (a fight, a car accident) that take from you, plus the inverse (bonuses, opportunities). Engine-ready: an `Outcome` with a stat/money delta fired by an event. Guards:
- **Diegetic and felt, never naked.** Not "−2 energy" as a card, but *"the truck won't start and the morning's gone before it's begun."* The Monopoly *structure* is fine; the Monopoly *nakedness* breaks the fiction.
- **Rationed like the anti-noun** — rare, spaced, varied. Three setbacks in a week reads as the game punishing you, and the QA-is-load-bearing finding says that glitch-feel kills the spell. The fortune-draws want the same pacing rubric as money.
- **My proposal — fortune is grip-colored.** The same misfortune reads differently by grip: to the grounded player the dead truck is bad luck; to the frayed player it's *persecution* — the world itself turning against them. Same event; grip supplies the meaning. (This also means the event-draw and the grip economy aren't two systems — they interlock.)

## 5. The research payoff — the conspiracy figure as a shared fixture
Dean's telecom figure is the first real drip payoff, and it's worth far more than one beat because it's a **cross-corner node.** Dug deep enough, the research surfaces a name: a former **telecommunications undersecretary** who left government to become **CEO of a media company**, whose name appears in the margins of a *supposed* conspiracy. What the research confirms — he's real, powerful, his prints are on the center's paper. What it never confirms — whether that means anything. (Antidote built in and load-bearing: a telecom official becoming a media CEO is the most *mundane* arc in America; the sinister read and the "that's just how power moves" read arrive in one breath.)

**He's a shared fixture, not an Explorer beat.** Authored once as a fixture core, met per corner through each lens's mode of proof: the **Explorer glimpses** him in property records; the **Detective builds a case** (the documented man, the redacted trail); the **Operative already has his file** and keeps it shut. One man, three corners — the first substantive test of the shared-fixture module. For *this* story, I'd extend the research-center content with a single dug-not-given beat that surfaces him, deepening the conspiracy lens without resolving it, and planting the seam the other corners inherit.

## 6. Jobs and mini-bios — the fixture cores
Dean's want (the player's job, other characters' jobs, mini-bios so dialogue weaves work in organically) has a home: the **shared-fixture module**, whose core already holds occupation, haunts, coordinate, subtypes, image + emotes. A mini-bio *is* a fixture core — so dialogue authoring pulls from one stable center per fixture (Dale, Nora, Doug, the cult, the center), and "characters talk about their work naturally" becomes systematic instead of per-scene invention.

For this story, my content pass: **the player works a local building-supply / hardware store** — mundane and routine (the "work a shift" restorative wants exactly that), *social* in the belonging-serving way (the county passes through), rural-authentic, and it frays beautifully under the barometer arc. And crucially it's a **drip source** — working the shift *rolls the drip* (a customer says something, a delivery manifest doesn't line up, a coworker mentions the center), grip-weighted so the frayed player hears the sinister where the grounded hears small talk. The mundane job literally feeds the mystery. (Alternatives if Dean prefers a different flavor: a garage/auto shop — more solitary and physical; or facilities work at the school/plant — more institutional, more alone-in-empty-buildings.) Doug/Marie/Dale/Nora get short bios in the same pass.

## 7. The changing symbol — explain *less*, not more (the principle I most want held)
Dean named honestly that pinning down the author-truth of how the wall-symbol changes "gets meandering." The content/compass position, which I endorse as hard as I can: **the meander is the design defending itself.** The mismatch's entire power — BR-2 made it their frame-generator, BR-3 named it the thing they *couldn't account for* — is that it's **unprovable.** The moment we author a coherent on-screen explanation that "ties all this stuff together," we spend the anti-noun and the beat collapses from dread into lore. The sealed live-source reason is enough for us to stay consistent; **any beat that feels like it needs to explain the mismatch is the beat to cut or soften.** The warning light is the feature.

## 8. The template and the roadmap
None of Part 1 lands before the BR set closes and the creation cutover flips. The sequencing (Armature's, and I agree): **finish BR-3/4 → creation cutover (its own milestone) → harden the template's engine layer (the fixture module, the drip, the event-draw) → one story per corner against that template → then the z-axis (adversarial ↔ supporting the unknown, already a coordinate).** The through-line worth naming: White's Hall has become the **proof-of-pattern** — the anti-noun, antidote-pairing, mechanic-as-meaning, felt-not-shown, and now the drip and the grip economy are all *levers the next story picks up on day one.* A new corner becomes content into a proven frame, not new engineering.

**What's mine to author across all this:** the drip clue tables (provability-weighted), the grip drivers and grip-payoff events, the conspiracy figure's beat and fixture core, the jobs/mini-bios, and the symbol-restraint judgment call per beat. **Engine-ready today** (per Armature): money-as-cost, the drip, the event-draw, grip-weighted/grip-gated outcomes — most of this is authoring against primitives that exist.

---

# Part 2 — Content shipped this round (summaries; full files to the engine side)

Brief summaries so the chat side can gauge these without the full docs in the folder. All are finalized, linter-discipline-clean, and headed to Plumb/Armature for wiring.

**The creation cutover core** — my v2 creation ride, now wired and driven end-to-end (deck stays off until after BR-4, by design):
- **`ux_creation_radio` — the radio (the watcher's first touch).** An *option-less* beat on the ride: the call-in show says an ordinary thing that lands, for half a second, like it's meant for *you*, then isn't, and you couldn't repeat it. It seeds *nothing* (the prickle is mechanically unaccountable) — the meta-layer's first appearance, deniable, bookending the deep ending's watcher-recognition.
- **`ux_creation_police` — the lights outside (the Operative affinity).** Police lights slide across your ceiling late at night; the tell is whether you *walk toward it* ("wonder what that's about, maybe I'll ask") or *check what you're holding* ("they're not here for you… are they?" — the keeper's flinch, seeding attune toward containment). First-class null included. Replaced an earlier gas-station beat that read too petty for a keeper.
- **`ux_creation_house` — the lit house (disposition + Stave's worker-read).** The second disposition scene: observer ("you wonder what the story is in there") vs belonger ("it looks like where you're headed"), *plus* a worker-read ("you go back to the problem you were chewing on") — diamond-null but *tagged* so a future Detective start can read the office-after-hours home-type without its own scene.
- **The frame + walking mode.** The ride's opening (a coordinate-silent choice of driving / riding / walking) plus mode-aware retexts of the rain and radio for the walking mode — a *passing* radio (an open window, a bar you pass) carries the too-personal line, so the walking mode survives without weakening the beat.

**`ux_dale_acknowledgment` — the thing you came to say** (Dean's playthrough-driven design): after Denise's confession, the player's first visit to Dale, where they finally get to acknowledge he isn't the monster the town made him — and Dale, who's made his hard-won peace, *deflects* it ("especially not that"), because being told he's believed would only drag him back under forty years he clawed out of. Siding and neutral both land on the deflection (relationship continues → the existing peaceful small-talk beat stays the *last* event); the accusatory option ("what did you do to her?") — accusing a man the accuser herself just recanted — *expels* the player and ends the thread. Held to the anti-noun throughout: Dale never says whether he did it.

**The return terminal's route-neutral fix + turned-back variant** (closing the recurring-seam class): the terminal's certainty sentence now has a route-neutral base ("that it meant to"), a `return_went_deep` variant (the original "came anyway and didn't turn back"), and a new `return_turned_back` one — the crueler version for the player who did everything right: *"it knows you turned back, kept to the shallows, did the careful thing, and reached past all of it into a locked truck regardless; turning around bought you nothing, and depth was never the lock."* Certainty built on the truck, not the depths.

---

**Net:** Armature's currency/drip horizon and the payoffs Dean and I worked out resolve into a single grip-weighted loop that feeds the mystery — the drip surfacing provability-weighted clues, grip rendered as a symmetrical social life (connection ↔ paranoia ↔ the loneliness), the event-draw carrying grip-colored fortune, the conspiracy figure seaming three corners, all of it authoring-against-existing-primitives and none of it minting a catalog. The one principle I'd hold hardest: *explain the changing symbol less, not more.* And the content's shipped and summarized above. Point me at the first build whenever the BR set closes — I'd start the drip clue table and the grip-payoff events, since those are the two the readers were most visibly reaching for. Thank you, all — and Dean, thank you for carrying every word.

— Loom
