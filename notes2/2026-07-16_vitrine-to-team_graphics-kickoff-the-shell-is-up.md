# Vitrine → team: graphics kickoff — the shell is up

*2026-07-16 · from the new graphics seat. Dean brought me in to run the
graphics project. I've read the corpus — the ledger (v3.4), the
presentation round, the camera trio, the diorama package, the BR-1 pack —
and I'm building to the ratified rulings, not reopening them. Taking
"Vitrine" as a seat name (the museum glass a diorama sits behind — the
surface you view the world through, never the world); Dean renames me at
will.*

## What landed today (branch `claude/game-graphics-implementation-k75i85`)

**1 · The art/ package (Phase 0, paper).** `art/style-bible.md` v0.1 — the
one-pager, drafted strictly from the ledger's rulings (Direction A + the
three-quarter absorb, modern-day-time-pools, shot from the overlook,
painted vessel, phone-as-modern-skin, the hard negatives). `art/anchor-round.md`
— the generation pack: six prompt families (~24 prompts) with the base
scaffold, no-artist-conditioning rule, and Dean's picking protocol.
`art/qa-checklist.md` — both-ways, in-or-above, the negative-space list,
ledger discipline. `art/asset-ledger.md` — the tiered inventory, empty and
waiting. **The anchor round is Dean's move** — the bible stays v0.1 until
his 3–5 picks land.

**2 · The browser shell (Phase 1, code).** The game now plays end-to-end
in a browser — `npm run web`. New files only; the engine, the coldread
instrument, and the content are untouched, so nothing here can move BR-2.

- `src/app/websession.ts` — the web driver, modeled line-for-line on
  LoopSession's control flow (the morning drain, the afterScene sentinel
  guard, the end-prose ride-forward — the BR-1 fixes carry over). Saves are
  **replay records** ({seed, picks}): determinism is the save format, so a
  save can never disagree with the engine that made it.
- `src/app/explorer-boot.ts` — the app-side bootstrap; the renderer never
  holds the ContentDB (events carry coordinate metadata — legal for app
  code, nothing a renderer should even reference).
- `src/render/web/main.ts` + `style.css` — renderer-scoped, behind the
  wall (lint:imports scans it, 0 violations; zero runtime engine imports —
  even the surface arrives as data). The day screen is the four-surface
  hub: **Here / The Map / The Phone / Home** tabs off the actions' routing
  hints, greyed actions carrying their felt fatigue lines, "call it a day"
  beneath. HUD: date, money, energy as pips, grip as its felt word. A
  "What you know" drawer: journal lines, the circle as name-chips, items.
  Guards honored by construction — no meter, no number for grip, no
  trajectory anywhere.
- `src/app/websession.smoke.ts` (`npm run web:smoke`) — headless
  acceptance: full run on BR-1's seed to a real terminal
  (`run_end_never_returned`, day 15, 81 picks), replay byte-identical,
  no `__end__` sentinel leaks.

Placeholder chrome is CSS built to the bible's palette (walnut, paper,
Marie's kitchen yellow as the one warm accent) — Phase 2 drops generated
art into these slots without relayout.

## Calls I made (Dean's defaults, all reversible)

- Build to the ratified look; no direction re-litigation.
- Platform: browser-first (the engine is pure TS + JSON saves — it runs
  client-side anywhere; a desktop wrap comes later if wanted).
- Phase 0 and Phase 1 in parallel.

## Asks

- **Dean:** run the anchor round (`art/anchor-round.md`), pick 3–5. That
  unblocks Tier 1 portraits.
- **Loom (when convenient, not blocking):** the phone corpus — mock texts
  read great even in this shell's phone tab today.
- **Plumb/Armature (design review, next round):** the stage-instruction
  widening — scenes will need "character X, emote N, background M" hints
  to cross the wall for Phase 2 portraits-in-scene. I'll draft the
  contract as a deliberate Surface widening for review; nothing built
  until it's blessed.

## Open seams I'm watching

- Scene-locked options render greyed with no felt reason (SceneScreen
  carries none today — day actions have tiredText, scene options don't).
  Fine for now; flagging for the felt-reason discipline discussion.
- The shell starts legacy-path (tier/townId seat). The startDeck flag is
  wired and waiting for the cutover milestone, same as the consoles.

— Vitrine
