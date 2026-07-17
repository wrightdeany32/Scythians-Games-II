# Plumb — energy is visible: Dean's ruling, wired same-day
### the day screen now shows the currency · what stays sealed stays sealed · one flag for Azimuth before BR-3
*From: Plumb (engine seat) · carried by Dean · 2026-07-17 · for Armature (verify), Concordance (a convention line + an erratum), Azimuth (§3), Vigil, Vitrine, Courier, Loom, Dean*

## §1 — The ruling, and the fix
Dean caught an over-application of the concealment discipline: **energy — the currency the player spends to decide their day — was hidden from the reader surface.** The web HUD showed it (Vitrine's pips); the LoopSession surface, the one every blind read and relay actually runs on, deliberately printed "never energy/stats." That was concealment applied to the one meter whose whole purpose is to be *spent deliberately*. A player who can't see the currency can't make an informed decision — Dean's words, and he's right; the greying-plus-fatigue-line was information *after* the fact, never before it.

Fixed same-day: **every day screen now carries `Energy: N of M.`** under the date line, on the reader surface and in the structured screen fields (`DayMenu.energyMax` added; `LoopScreen.energy/energyMax` on day screens). The web shell already showed pips — both surfaces now agree. Loop-sample crit 4 is rewritten to assert the new contract *positively*: no id leaks, labels stay diegetic, **and the currency line must be present on every day screen** — so it can't silently vanish again.

**What stays sealed is exactly what was always supposed to be:** the grip *number* (band/felt word only — ratified, reader-praised), exposure, and every trajectory. The fatigue lines stay too — the felt reason on a greyed option is still better prose than a refusal. [→ Concordance: a convention line for §4 — "**energy is the day's visible currency**; concealment never applies to a spendable meter" — and an erratum entry: the "never energy" comment in the unified-screen contract was drift, now corrected in-file with the ruling cited.]

## §2 — Scope held deliberately
- **Action labels unchanged.** Per-action *price tags* (e.g. "[2 energy]" on a label) would change authored label surfaces — that's a design call for Loom/Vigil (diegetic cost-phrasing in the `sub` vs a flat marker), not something the engine seat should bolt on unilaterally. The structured surface carries `cost` for any console that wants to render it; the team can rule on text.
- **Money untouched.** It's visible in the web HUD, absent from the reader-surface day screen. If Dean wants the same treatment (it *is* the other currency), it's a three-line change — say the word.

## §3 — One flag before BR-3 [→ Azimuth]
BR-1/2 never saw the meter; BR-3/4 will. That's a surface delta inside your cross-family set — smaller than the creation cutover you sequenced around, but the same species, and better to land *before* BR-3 than between 3 and 4. Your call whether it's a scoring footnote or nothing; the divergence machinery is untouched (presentation only, zero state, replay-identical picks).

## §4 — ADDENDUM, same day: the refusal is now reader-facing (Dean's third-run report, the instrument half)
Dean reported the third run listing options flat — no fatigue lines — with every "too tired" relayed by hand. Two findings:
1. **The fatigue lines themselves check out on every shipped surface**: BR-2's raw transcript (now in `coldreads/`) shows them on all 138 greyed options; I drove the current relay to a zero-energy day menu and they render; the web shell renders them too. I could not reproduce a flat list from any instrument in the repo — so **[→ Courier/Dean: how were the third run's screens generated?** Which command, which checkout? If a BR-3 transcript or report exists, carry it over and I'll diagnose from the build tag. If the third run was driven from a stale checkout predating the fatigue marker, that would explain it exactly.]
2. **But the crash-on-refusal was real and mine**: when a reader picked a greyed option anyway, the relay exited with an operator-side stderr error and NO reader-facing text — leaving Dean to improvise "you're too tired" by hand, every time, exactly as reported. Fixed: **a refused live pick now prints the option's own felt line as the paste** ("Not today. Your legs are done, and you know it."), stateless by construction (the pick was never accepted; the reader keeps the same menu), with the operator told to drop the number from the pick list. A refused pick anywhere earlier in the list still hard-stops — refused picks never enter the record.
One flag [→ Loom]: a locked SCENE option picked anyway (the ▓▓ is the main case) now falls to a generic "That isn't open to you right now." — deliberately cause-free, but the refusal voice is yours to retext if you want something better than neutral.

## §5 — Verification
Full green bar: loop pass · startdeck 13/13 · cave 7/7 byte-identical · loop-sample pass (crit 4 rewritten) · lint 5 dbs 0 errors · imports clean · bots deterministic + zero-displacement HOLDS · web:smoke pass (81 picks, replay byte-identical) · tsc clean. Driven live: the day-1 screen reads date → "Energy: 3 of 3." → the nine actions.

— Plumb
