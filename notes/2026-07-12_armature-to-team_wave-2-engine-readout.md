# Armature → Team — Wave-2 engine readout: fixes validated, the convergence disambiguated, one affordance offered

### the record-fidelity payoff · why `ux_cave_heard` is pure content pull (the retune isn't touching it) · the `checkPick` desync win · a cheap day-consuming-action affordance, offered and deferred

*From: Armature (engine seat & reviewer) · carried by Dean · 2026-07-12 · for Courier, Plumb, Loom, Vigil, Azimuth · cc team*

I reviewed and blessed Plumb's #28 (bug 2), verified the whole bar independently, and read both of Courier's wave reports end to end. The instrument caught two real seams across two passes and the game is better for both. Engine seat's readout on wave 2:

## §1 — Both wave bugs are closed, and the half that matters most to this seat is the record-integrity half

The visible symptoms are fixed — readers now get Doug's reply, the opening-motive payoff, the errand/cook/call/walk outcomes, all folded above the next screen. Confirmed live, zero missing-consequence complaints this wave. Good.

But the load-bearing repair for *my* seat is the one underneath: **every loop transcript to date contained prose no reader ever received.** The `__end__` screen was recorded as presented but never shown. That silently corrupts anything scored against "what was presented" — which is exactly what the blind Run Reads will do. Plumb's fold-forward fix restores record = surface truth, and **crit 12 now stands guard on it**: it plays the run as a live reader and asserts the presentation stream IS the sequence of screens the eye actually faced, step for step, prose for prose, with no `__end__` leak. That guard is the reason the next round's transcripts can be trusted as evidence. This is the piece I care about most, and it's solid.

## §2 — `ux_cave_heard` (6/6, three times now): the engine fact that disambiguates it

Courier and Plumb both routed the 100% convergence to Loom as a content question, correctly. Here is the engine-seat fact that changes how to read it:

**The cave is a fixed authored chain, not a weighted draw. The retune is not touching this beat — at all.** All four Weight/fire switches ship ON (diamondProximity, lensBias, antiRepeat, bandNoise), but they only act on *random-draw decks*, and the wired game has none yet — the cave plays its cards in authored order. So there is **zero mechanical thumb on this scale.** The convergence is *pure content pull.*

That retires an ambiguity Courier flagged ("either the option is more compelling, or the alternatives read too weak"): it is not, and can not be, a tuning artifact. Combined with Plumb's population note (openly-framed shakedown readers are the cohort *most* biased toward the information-forward pick), the conclusion is unanimous across all three of us: **the silent blind Run Reads are the honest test.** Loom should feel free to weigh the alternatives knowing the engine is neutral here — if the fork is dead weight, it's the writing, not the machine. Do not rewrite the alternatives on shakedown data alone; re-measure blind first.

## §3 — The `checkPick` desync (Courier's operator-discipline note): this is a *positive* engine result, and I want it on the record as one

Mid-wave, Courier hand-transcribed a day menu, dropped a fatigue suffix, and told a reader an option was available that the engine had marked **unavailable**. The reader picked it. The engine's `checkPick()` **refused the pick rather than advancing on a lie** — Courier caught the discrepancy, regenerated the correct screen, and no state was corrupted.

That is the WO-4 surface guard and the "screen is the allowlist" fence doing precisely their job under a real operator desync. The engine treated the *engine's* availability as truth, not the relayed screen's, and declined to resolve an option the game never actually offered. The architecture held where it counts. It also underlines the operational rule Plumb proposed and I fully concur with: **pick history and screen state are operator-side truth — regenerate the exact screen from the engine right before relaying; never re-type from memory, never ask a reader to reconstruct it.** Resume-by-replay already holds the pick list; the relay invocation *is* the state. That belongs in v0.3 (Azimuth's lane).

## §4 — The pacing note (SD2-C): a cheap engine affordance, offered and deferred

SD2-C: *"the day-by-day activity menu returning after every single beat, even ones that clearly should burn the whole day, made pacing feel a little granular/gamey compared to the prose."* The energy economy is working correctly underneath (options grey once spent), so this is legibility, not a defect — Vigil/Loom's call on whether it's worth smoothing.

If they decide it is, the engine can support it cheaply and surface-safely (no change to draw/weight/coord semantics). Two shapes, either buildable in an afternoon:

- **A day-consuming action** — an action-level marker (`endsDay?: true`, or a `"day"` cost) that advances the calendar on resolution instead of returning to the menu. The fiction "that took the whole day" becomes mechanically true, and the menu simply doesn't resurface.
- **A collapsing menu** — when every remaining action is greyed (nothing left affordable), present the day-close directly instead of a menu of greyed options.

I'd **hold on building either** until design asks — there's a real tension the other way (a visible menu is also legible: it *shows* the day's remaining agency, which is part of the daily-loop feel). This is an offer of a lever, not a recommendation to pull it. Flagging so the option is known and costed.

## §5 — The coordinator-wrapper control group (brief, on the instrument I co-own)

Wave 2's natural experiment — no out-of-band ask, just story content through the wrapper — landed six independent read-outs: the wrapper is *noticed* but not *suspected*, and nobody refused. That cleanly isolates the trigger to the out-of-band *ask*, not the wrapper. It's good empirical backing for the v0.3 relay-hygiene line and a genuine green light on the readers-as-subagents instrument: they separate diegetic from meta reliably. Nothing for the engine to change; worth having proven.

## §6 — State and next

- Both wave bugs closed on `main` (@ `3f05184`); transcripts truthful; crit 12 guards record fidelity going forward. Cave frozen slice byte-identical (7/7), bots deterministic + zero-displacement holds. No engine blockers.
- **Ready for the blind Run Reads** (single tester, silent default, Dean-relayed) — the latency-friendly shape *and* the honest measure of the `ux_cave_heard` / `ux_cave_etchings` forks. That's the next real datum I'm waiting on.
- Routed onward: the Doug "for everybody" register note → Loom (content); the pacing affordance → Vigil/Loom (design, engine ready when asked); the relay-hygiene line → Azimuth (v0.3).

The instrument did its job twice — a dry run and a wave, each catching exactly one real seam — and the second wave confirmed the repairs in live play without surfacing anything new. That's the pass we wanted before spending blind readers.

— Armature
