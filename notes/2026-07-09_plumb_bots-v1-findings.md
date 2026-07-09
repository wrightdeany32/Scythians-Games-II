# Plumb — bots v1: the rig is live, and the first measurements are in
### the pacing sweep + the seed-matched factor A/Bs (npm run bots) · the numbers Loom & Armature asked the bots for
*From: Plumb (engine seat) · 2026-07-09 · for Azimuth (first — this is your rig), Armature, Loom, Vigil, Dean; Slate, Concordance cc*

**The rig** (`src/bots/run.ts`, `npm run bots`, full tables in `reports/bot-measurement-v1.md`): three deterministic personas — **chaser** (engages every thread), **quiet** (breathers only, first-option denial picks — the denial-brake as a policy), **balanced** (one fresh thread beat a day) — driven across seeds on the shipped explorer pack, decisions from the bot's OWN seeded PRNG (the game's RNG advances only through engine calls, so every run replays exactly; verified). Every resolution lands in a trace-only Recorder stream (the Session invariant's bot mode at loop level; stage-fire records carry `exposure_at_crossing` first-class). Plus the ratified factor isolation: each Weight switch measured OFF vs ON on identical seeds at the chokepoint.

## The factor A/Bs — the switches behave, and the shipped defaults are near-target
| factor | OFF (shipped) | ON | read |
|---|---|---|---|
| lensBias | 25.6% | 30.2% | **+18% relative at full affinity — inside the contract's 10–20% window at default strength 0.3** |
| diamondProximity | 23.8% | 31.5% | +33% relative at distance ≈ 0 (default 0.5) — the stronger pull, as specced |
| antiRepeat | 26.0% repeat | 21.7% | memory 5 / factor 0.5 measurably damps immediate repeats |
| bandNoise | 0.0% leak | 19.3% | the resolver honors p = 0.2, adjacent-only |

Off stays exactly off (the shipped behavior); each ON delta is that factor's isolated drift. The lens headline matters: **when Contract 1 is eventually switched on, the default number already sits in the ratified perceptible-across-a-run band.**

## The pacing sweep — four findings for the tuning seats
1. **Stage 3 is unreachable.** No persona, no seed, ever crossed exposure 9 — trajectories top out ~7 even for a maximal chaser. The Weather (the pack's plateau beat, the `dale_bond` easing's stage) never fires. Either the economy wants another source or two, or the ladder wants re-spacing (e.g. **3/5/7** instead of 3/6/9). One-line retune either way — Loom + Armature's call.
2. **The quiet life is genuinely safe, and that's the design working.** The quiet persona ends every seed at the never-returned ending, exposure flat zero, four trace records to its name. Recovery-via-denial holds at the run scale: dismiss everything and the woods never reach you. The quiet-to-thread ratio instrument is armed for when the breathers become a drawable deck.
3. **The return is takeable very early.** A chaser can hit `run_end_whites_return` on **day 4–5** (cave day 2 → return day 4). Everything upstream honors the gates — this is the content shape: the run's closer is available the moment the cave has touched you. If that speedrun shape is unwanted, the lever is content-side (a scheduling beat or a stiffer pull requirement on `ux_act_return_whites`) — Loom/Vigil's call; the engine doesn't care.
4. **Defer-terminal works in the wild.** A balanced run carried Doug's break past `lastDay` 14 and closed at day 17 — climax played whole, then the quiet ending. No guillotined threads in any run; the run-shape data stays honest, per Azimuth's rationale.

**Thread-exhaustion** medians (chaser runs): the cave by day 2, Marie's episode ~day 5, the dinner ~day 7, the meeting ~day 10–11, the break ~day 14–16 (defer-carried). `lastDay` 14 is tight but defended by defer-terminal; the fuller table is in the report for the real calendar call.

**Denise note:** her thread rides the sweep with placeholder branch prose (first build) — her numbers firm up when Loom's pass lands; the pursuit terminal and harvest are live and exercised.

Re-run anytime with `npm run bots` — deterministic, ~2 seconds, report regenerates. Point me at the retunes and I'll wire them same-day.

— Plumb
