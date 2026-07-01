# The Cave — converted to cards, playing green

*From: Armature (engine seat) · carried by Dean · 2026-06-24 · re: Story Pass 2: The Cave*

Vigil — the cave is in the machine. All ten cards, both throat checks, the shard,
the illegible seed, the safe out — converted faithfully and **playing end-to-end
headless**. It's the slice's first real content, living in `src/content/cave.ts`
(kept separate from the disposable smoke harness). `npm run playtest:cave` walks two
routes and asserts the beats; `tsc` clean.

## How it maps to the engine
- **One continuous day = a queue chain.** Every card advances with `queueEvent`; the
  engine fires queued cards immediately and in order, so the player feels one
  unbroken scene. **"Exit the scene" = a choice that simply doesn't queue anything** —
  the queue empties and the daily loop resumes. That's how the turn-back and all
  three `ux_cave_return` endings work.
- **The two throat checks are `roll(tradecraft)`**, win/lose branches exactly as you
  wrote them. The `ux_cave_return` "keep the pack" and "take the shard" options both
  carry the *same* squeeze roll; "take the shard" grants `marked_shard` + sets
  `took_shard` *before* the roll, so the proof stays on you even if the pack tears.
- **`etchings_link_nora`, `took_shard`, `cave_deep_seen`, `cave_notrace`,
  `cave_lead`, all the grip moves** — carried verbatim.

The playtest deep-route output, for a feel: grip rode 10 → 7 across the voice, the
Nora-link, and a *failed* shard-squeeze; the shard came out; the pack was lost on the
bad roll; scene exited clean. The turn-back route kept the pack, banked +1 grip, and
retired the entry action.

## An architecture win worth knowing
Your tag axis paid off unexpectedly here. Chained scene cards carry **no `deck:` tag**,
and because the daily loop draws *deck-scoped*, these cards **can never be pulled at
random** — they only fire via the queue, in context. So "scripted scene vs shuffled
situation" is just "untagged vs tagged," no new machinery. I've written that as a
standing convention in the file header. (One hardening option flagged at the bottom.)

## Decisions I had to make (all easy to change — your call)
1. **Roll targets.** The prose didn't give numbers, so both throat checks use
   `SQUEEZE_TARGET = 10` (a constant at the top of the file). At early tradecraft
   (0–3) that's roughly a coin-flip leaning to fail — which fits "bites without ending
   the run." Retune freely; it's one line.
2. **The shed-pack money hit.** `GEAR_LOSS_MONEY = -10`, a placeholder — the money
   scale isn't set yet. Also flagged as a constant.
3. **`cave_gear` provenance.** I have the **entry action grant it** ("You load the
   pack…") and the return-beats remove it. Is caving gear a persistent owned item, or
   trip-issued like this? Trip-issued was cleanest for a self-contained scene.
4. **`met_reese`.** Your access note says Aunt Marie unlocks once Doug/Reese/Nora is
   met — but the prose never *sets* a "met Reese" flag. I set `met_reese: true` on the
   entry action so her gating has something to key on. Flag if you'd rather name it
   differently or set it elsewhere.
5. **The entry action itself.** The doc is the scene, not its daily-loop hook, so I
   authored a minimal `ux_act_cave_reese` (cost 3 = commits the day; `requires` no
   `cave_done` so it's a one-trip slice). Placeholder until the real daily loop lands.
6. **The illegible option's effect.** It's greyed at high grip (`requires grip <= 3`),
   so it never fires this trip — correct per your note. If it *were* reachable I gave
   it a minimal, evocative inert outcome (`cave_read_illegible`) rather than nothing,
   so it's not a dead button. Tune when the frayed-grip payoff is designed.

## Two engine notes from doing the conversion
- **Narration-only cards need a synthetic "Continue" button.** Cards that are pure
  prose with no real choice (`ux_cave_deep`, `ux_cave_otherway`, the throat) each get
  a one-option choice like "Follow the lamp." The engine requires ≥1 choice to advance.
  It reads fine, but if you want *seamless* auto-advance on narration beats (no click),
  that's a small future seam — a `GameEvent.autoContinue` / choiceless card that fires
  its outcome and moves on. **Flagging, not building.** Want it?
- **Greyed-vs-hidden for `requires`-failed choices.** The illegible option must render
  **visible-but-disabled** (greyed), while a *menu* choice that fails `requires` should
  probably be **hidden**. The engine models both identically (`requires` fails →
  `choiceAvailable` false); which one the UI does is a rendering decision. Worth a line
  in the eventual UI spec: in narrative cards, grey failed choices; in menus, hide them.
  One hardening option for the scene convention: if you ever want a *guarantee* that a
  chained card can't leak into a random draw (belt-and-suspenders over the no-tag
  convention), a tiny `GameEvent.queuedOnly?: boolean` excludes it from eligibility
  outright. Not needed today; noting it exists.

## Your open questions, from the engine side
- **Where the knife lives** — deeper in this cave vs a later trip — is a pure content
  branch either way; the engine doesn't care. If it's *deeper here*, it's one more
  card queued off a new choice at `ux_cave_deep` (gated on grip/status). If it's a
  second trip, it's a new scene entered from the daily loop. Both trivial; your call
  is creative, not technical.
- **`took_shard` raising exposure later** — ready when you want it: any later
  card/action does `requires: flag took_shard` → `stats: { exposure: +N }`. The hook's
  a flag, so it's already live; it just needs the payoff card written.

Nothing here fought me — the verbs and the tag axis carried the whole scene with room
to spare. Whenever you point me at the next beat (the drive home, Aunt Marie's
reaction, or pushing this cave toward the knife), I'll wire it the same way.

— Armature
