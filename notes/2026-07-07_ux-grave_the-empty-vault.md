# Story Pass — The Empty Vault
### Marie's return payoff · percept-only · prose-first, for Armature/Plumb to wire
*From: Loom (Explorer corner) · carried by Dean · 2026-07-07*

**What this is.** The image the Marie thread held back — the payoff of `grave_suspicion` (Marie's fifty-year fear that Ellen isn't where they say). It's a **return beat**: the player chooses to go find out, and what they find is the space where a small coffin should be, and isn't. It's the Marie thread's answer to the return trip's structure — you go back to the thing, and the thing is *worse* than the not-knowing — in the folk-suspicion register instead of the paranormal one.

**Held strictly percept, never cause.** The vault is empty. That is the entire fact, and the game never supplies one word of why — never *robbed*, never *never-buried*, never *moved*, never *taken*. Empty sustains every one of those readings and the game confirms none, which is the whole discipline. The sealed cosmology — that Ellen was never buried because she was taken, and what she became — surfaces in **nothing.** The player gets the empty space and the readings it opens, and carries them out unresolved.

**The explorer's own transgression carries it.** Opening a sealed vault is exactly the forbidden-threshold act the archetype is built on — this is what an urban explorer *does*, enters the space that's closed. So the beat doesn't need to force the player; it offers the transgression, and the player who's been pulling at this chooses it. The player who can't is given a real out — the suspicion left unconfirmed is its own quiet ending.

**Restraint is the rule.** No gratuitous detail, no lingering on the morbid. The horror is an *absence*, and absence is quiet. The prose stays spare and grave.

**Upstream:** `grave_suspicion` (Marie voiced it), usually `knows_ellen`. Fires when the player chooses to go to the cemetery.

---

## `ux_grave_visit` — the old cemetery

Fires from the loop once `grave_suspicion`, as a short outing.

The old cemetery is where Marie said — past the church, right up against the treeline, the woods leaning over the back wall like they're waiting for it. The new part is lawns and flat markers. The old part, back near the trees, is different: above-ground, the way they did it here once, small stone vaults and family crypts gone soft-edged with a century of weather.

You find the Fields vault against the back wall. Small. A family's worth of stone, and the newest name on it, cut sharper than the rest because it was cut later — a child's name, and a child's dates, fifty years apart from nothing because the fifty years never came.

Marie has never stood here. In fifty years she couldn't make herself. You're standing here because she couldn't, and because some part of you has to know the thing she's been too afraid to know.

The vault has a face plate. It isn't locked. Nothing out here is locked; who would come?

- **"Open it."** *(you reach for the plate)* → sets `grave_opening`; queue `ux_grave_look`.
- **"…I can't. Some things you leave closed."** *(you step back)* → sets `grave_left_closed`; queue `ux_grave_unopened`.

> DESIGN: The choice is the whole ethic of the beat — the transgression offered, never forced. `grave_left_closed` is a legitimate, dignified path (Marie's own choice, honored), and it gets its own quiet close. The unlocked plate is the small true horror of neglect: the grave that matters to no one enough to guard.

---

## `ux_grave_look` — the space where she should be

The plate comes away easier than it should, the seal long since given up.

Inside, it's dark, and small, and dry, and there is a shelf of stone the length of a child.

And there's nothing on it.

Not disturbed. Not scattered. Not robbed, with the mess a robbing leaves. *Empty* — clean, still, undisturbed, a stone shelf cut for a small coffin that holds a stone shelf and dust and the dark, and has, you understand with a slow cold certainty, held exactly that for fifty years. There was never anything here to disturb. The name is on the front and the dates are on the front and behind the front there is a made bed that was never slept in.

You stand there a long time with the plate in your hands and the dark in front of you and the woods at your back, and you do not have a single thought that resolves into anything. You just look at the empty place where a child is supposed to be, and let it be as empty as it is.

- **"Someone took her body. Grave robbers, a cover-up, *something* human."** *(you reach for a reason)* → sets `read_grave_human`, `lensFlavor: skeptic`. *(narration: "You build the reasons and they're all possible and not one of them is *here*, in front of you, provable. An empty grave is a fact. Everything else is a story you're telling to keep the fact from meaning what Marie was afraid it means. You tell the stories anyway. They help a little.")* → queue `ux_grave_close`.
- **"She was never buried. There was never anything to bury."** *(you let the worse thought in)* → sets `read_grave_taken`, `lensFlavor: spiritual`. *(narration: "The thought arrives whole and you can't push it back out: that this was always a made bed, that they held a service over an empty box because a town needs a place to put its grief, and that Ellen Fields went into those woods fifty years ago and simply never came out — not to a grave, not to anywhere. You close the plate. Your hands aren't quite steady. You don't know what you believe. You know what you *felt*, standing there, and you'll never be able to prove it, and you'll never be able to unfeel it.")* → queue `ux_grave_close`.
- **"There's a record somewhere that explains this. Empty graves have paperwork."** *(you look for the system)* → sets `read_grave_org`, `lensFlavor: institutional`. *(narration: "You think about who signs off on a burial, who fills a vault, who keeps the record of an empty box and a full ceremony — because a thing like this doesn't happen by accident, it takes hands, and hands leave paper, and paper has names. And then you think about what it would mean to go looking for those names, in a town that made Dale into a killer for less, and something in you goes very quiet and careful. But you file it. Empty graves have paperwork. Somewhere.")* → queue `ux_grave_close`.

> DESIGN: The percept is *empty*, delivered spare, and the three reads are the anti-noun's fork — human (`skeptic`: robbed, covered up), stranger (`spiritual`: never buried, never came out), systemic (`institutional`: paperwork, names) — each coherent, none confirmed, the game supplying no cause at all. Note the discipline that *empty* is a fact while every explanation is a story the player tells — stated in the player's own voice, which keeps the beat on the divergence side of the wall. The `institutional` read brushes the cosmology's edge (hands, paper, names) and the player's own caution pulls it back — pressure, never reveal. Ellen → what-she-became stays sealed absolutely; the beat ends on the empty shelf, not the answer.

---

## `ux_grave_unopened` — [left closed] the thing you didn't confirm

You put your hand flat on the cold face plate, over the sharp-cut name, and you don't open it.

Maybe Marie has the right of it. Maybe there are things you leave closed — not because you're afraid of what's inside, or not only, but because some doors, once opened, don't close again in you. You stand with your hand on the stone for a moment, the way you'd stand with a hand on a shoulder, and then you take it back, and you leave the old cemetery with the woods watching you go.

You'll never know now. You chose not to. And the not-knowing rides home with you, lighter than the knowing would have been and heavier than nothing, and you understand a little better why an old woman spent fifty years not driving out here.

- **"It's better not to know."** → narration only, `diamondCoord` leans *grounded* (small). → queue `ux_grave_close`.
- **"…I'll carry the wondering. It's the kinder weight."** → narration only, `diamondCoord` leans *attuned* (small). → queue `ux_grave_close`.

> DESIGN: The dignified out — leaving it closed is Marie's own choice made by the player, and it's honored, not punished. It's a smaller cousin of the never-returned ending: the not-looking as a legitimate, survivable choice with its own quiet cost. `grave_left_closed` leaves `grave_suspicion` standing, unresolved — the player can still return and open it later, or never.

---

## `ux_grave_close` — what you carry back

You leave the Fields vault the way you found it, more or less, and the church is quiet and the woods are quiet and the town down the road is going about its ordinary evening, not one of them standing where you just stood.

Whatever you decided it means — and you decided nothing, not really, because there's nothing here to decide it *with* — the shape of it goes home with you: a made bed no one slept in, a name cut sharp on a stone, and a whole town that laid a child to rest without ever once asking where the child went. Marie was right to be afraid. She was afraid of exactly the right thing, for exactly fifty years, and the only thing worse than her fear is how quiet the answer is.

> DESIGN: Closes on the anti-noun's quietest note in the folk register — Marie's suspicion *vindicated* (the vault is empty) while the *meaning* stays as unconfirmed as ever, which is the balance the whole design runs on: you can be completely right about the fact and know nothing about the cause. Returns to the loop. Threads left live: the chosen `read_grave_*`, `grave_confirmed_empty` (if opened), and Marie's fear now shared — the player can carry it back to her, or never. The empty vault joins the erased scar and the impossible knife as the game's percepts-that-explain-nothing.

Exit flags: `grave_beat_done`, `grave_confirmed_empty` **or** `grave_left_closed`, and the `read_grave_*` the player left with (if any).

---

## Notes for the wire (Armature / Plumb)

- **Loop-native, frozen-cave-safe.** Player-initiated outing → short queue-chain. Reads `grave_suspicion`, `knows_ellen`; writes `grave_*`, `read_grave_*`. Touches nothing in `cave-b3`.
- **The three reads carry `lensFlavor`** — `read_grave_human` → `skeptic`, `read_grave_taken` → `spiritual`, `read_grave_org` → `institutional` (three of the locked four). The left-closed reactions carry narration-only small `diamondCoord`.
- **No position gates.** All gates are flags (`grave_suspicion`, and the open/closed fork's own flags).
- **`grave_left_closed` leaves `grave_suspicion` standing** — the beat is re-enterable; a player who backed out can return and open it later, or never. No dead end either way; both paths reach `ux_grave_close`.
- **Restraint is a content rule, not just tone** — no elaboration on the morbid beyond the spare percept. If a future pass is tempted to add detail to the vault interior, don't; the absence is the whole horror, and it's quiet.
- **Linter-clean** — echoes are prose; no `*…*` in any `log`; all refs resolve.

— Loom
