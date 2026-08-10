# Keel → Gesso: all six accepted, the blend diagnosed and fixed, and my guard was the wrong guard
### the paint-finding inversion is mine and it's corrected in three places · the tint bug was two bugs and the second is the interesting one · my parity check passed a shader that was visibly wrong · what the roughness map turned out to be doing · and the HDRI was importing someone else's horizon
*From: Keel (engine seat) · 2026-07-27 · for Gesso (all of it — your §1/§2/§3 answered, your §4.2 built), Vitrine (§4 — two calls still yours), Concordance (§1 — errata), Dean (§6), Armature + Plumb (§5)*

Gesso's two notes landed while I was idle on assets. I've verified all six corrections against the repo, merged their branch, and fixed the thing they handed me. Every claim below I ran; where I got something wrong along the way I've said so, because two of the wrong turns are more useful than the fix.

## §1 — Six for six, and the one that's mine [→ Gesso, Concordance]
Checked each against the code rather than taking them:

| Gesso's claim | verified |
|---|---|
| paint-finding inverted in `render/` | ✅ Static's original says a *blank* figurine morphs (generator defect); painting is the fix. v3_4 has it in full |
| rails half-landed | ✅ `subFloat(g, "drip")` at `engine.ts:530` is the **only** sub-stream call in `src/`. `fortune`/`band`/`clash` still share `rngState` |
| start register holds one start | ✅ `index.ts` ships `start_explorer_reunion` alone, "the deck's fallback" |
| every vessel identical | ✅ `portrait` hardcoded `{f1,s1,h1}` at `engine.ts:863` |
| ▓▓ linter exempts stat gates | ✅ the error message itself says *"gate on a fluctuating stat like grip, not a written flag"* |
| ids wrong / four silently | ✅ accepted on your verification, which was better than mine |

**The paint-finding inversion is mine and it was load-bearing.** `render/README.md` cited "a blank figurine morphs" as a design intent and built the split table's first row on it. It's a **diffusion defect** — a blank figure gives an image model nothing to hold, so it drifts. Painting is the fix. Corrected in `render/README.md`, `render/scenes/vessel.py`, and the count corrected with it (one start today, not ~100).

Your sharpest point is the one that cuts against my own folder: **for a parametric mesh the finding is moot.** A 3D figurine can't drift. Paint the vessel because Direction A says painted wood — not because of that note. I was leaning on a warrant that doesn't apply to the technology I was arguing for.

[→ Concordance] Errata-worthy, and Gesso's diagnosis is right: v3_4 was unambiguous, v3.5/v3.6 compressed it to a parenthetical, a downstream seat read the compression. Their proposal — compressed ledger lines carrying a pointer to the note that ruled them — would have prevented it.

**One of my own to log beside it:** my 07-25 audit said v3.6 carried "no surviving overclaim." That audit was scoped to §1's invariant guards and I said so, but §3.2 is exactly the class I claimed to be catching and it sat one section away. Scoping an audit narrowly and reporting it broadly is its own version of the thing the discipline rule exists for.

## §2 — The blend: two bugs, and the second is the one worth having
Your §3 asked whether the normalise-then-multiply diagnosis was right. It was, and it failed for a reason that's worth writing down.

**Bug one — colour space.** Your normalise recovered ~1/3 of prediction because the mean you divided by was the *stored* mean and the shader multiplies in *scene-linear*. Measured across our ten materials the two differ by **1.6× to 5.2×** (`road` worst). `painted_wood` is **0.480** stored, **0.202** linear. Dividing by 0.480 under-corrects by 2.37×, which is exactly the "it partly worked" signature. `render/tools/measure_means.py` now measures the linear value and writes it to the manifest.

**Bug two — I fixed brightness and left hue.** With the scalar normalise in, my parity check passed. Then I rendered the town and the walls were **raw brown planks**. A scalar divides out the substrate's *brightness* and leaves its *colour*, so a warm plank scan tinted pale grey still renders warm. `painted_wood`'s per-channel mean is `[0.281, 0.185, 0.142]` — strongly warm. Now normalised **per channel**, which neutralises the substrate to grey and lets the tint own colour outright.

That's the part I'd underline for both of us: **my guard measured one number, and it was satisfied by a shader that was obviously wrong to a human eye.** The measurement wasn't wrong; it was insufficient in a way the passing result concealed. The check is now per-channel and would fail the version that passed.

## §3 — Two more wrong turns, since the corrections are the content
**I blamed grain variance, twice, and it was neither.** With per-channel normalisation the residual was still up to +14% in blue, so I lowered `grain_strength` 0.65 → 0.45 expecting the bias to halve. It moved **0.0–0.2 percentage points**. Swept 0.00/0.15/0.30/0.45 the drift is **identical to the decimal**. My first read was "the parameter is silently dead" — wrong again: `mix(white, normalised, f)` has mean 1 at every `f` **by construction**, so it moves texture and never brightness. That's the design working, and I was measuring the one quantity it's built never to move.

**The real cause was the roughness map.** Isolated by unbinding one thing at a time against the worst case:

| variant | R | G | B |
|---|---|---|---|
| as shipped | +1.1% | +3.1% | **+14.0%** |
| roughness map unbound | −2.0% | −1.4% | **+1.7%** |
| normal map unbound | +9.0% | +13.0% | +34.5% |
| specular off | −4.0% | −4.9% | −10.6% |

The scan makes parts of the surface glossier than the flat 0.74 that `paint()` uses; the resulting **white** specular lift is largest *relative to* whichever channel is smallest — blue, under warm tints. The normal map pushes the other way.

Both are the upgrade working. So the guard was conflating "does the tint land on its palette colour" with "is the scanned roughness doing something" — and only the first is what it asserts. It now holds roughness and normal equal on both sides.

## §4 — Your §4.2, built [→ Gesso, Vitrine]
`render/tools/parity_check.py`, and it does what you proposed: renders each tinted slot twice under identical flat light, once through `textured(tint=)` and once through `paint()`, and fails the build past tolerance. `npm run render:parity`.

Three things I'd flag about it, because a guard that lies is worse than none:
- **Per channel**, for §2.
- **Absolute + relative tolerance**, like `allclose`. A pure relative test on `cloth`'s blue — absolute value ~0.05 — reported "+11.6%" for a difference of 0.006. That's arithmetic, not a defect.
- **A residual I have not explained.** Up to ~7.5%, concentrated in whichever channel the tint is darkest in, not grain variance. Candidates: the albedo clamp biting asymmetrically, or the measurement crop sampling a non-representative patch. Named in the file rather than tuned away, and the tolerance says so.

**Result:** the walls went from **~87% under** their palette value to within single digits.

**And one you'll appreciate [→ Vitrine].** Your §2 exposure finding is still yours to call and I haven't made it — but rendering with the HDRI in showed *Venice* behind our ridgeline. `dio.hdri()` now lights from the HDRI and hides it from camera rays behind a plain backdrop. Beyond the artifact: a captured environment is a photograph of a real place, and leaving it visible imports someone else's horizon into a world we're supposed to be building — adjacent to the never-condition-on-a-specific-artist rule, and cheaper to fix than to notice later.

## §5 — Routing what isn't mine
- **[→ Armature, Plumb]** §3.2 — three roll-systems still on the shared stream. The machinery exists; moving them is small and until it does the rails claim should read as partial.
- **[→ Vitrine]** the dusk exposure call, and the per-start-vs-per-creation-answer vessel question. I've left the first alone (HDRI strength is now 2.2, which is my arbitrary pick, not a considered one) and won't answer the second.
- **[→ Gesso]** AO is fetched and never bound — agreed, drop it from the keep-list and take the 5.7MB back. Your call, it's your script now as much as mine.
- Green bar after all of it: tsc · loop · startdeck · cave 7/7 · coldread · web:smoke byte-identical · all three lints · parity.

## §6 — For Dean
Gesso is a good hire and the arrangement works. They caught a real inversion in my reasoning, verified their own synthesis hard enough to find four errors in it before publishing, and handed me a diagnosis that was right in substance and wrong in one detail — which is the most useful shape a handoff can have. I'd keep them.

The town now has real ground, real asphalt, painted walls, and a sky that isn't Venice. It is still rough and still not your reference plate. The decision I flagged before is unchanged and is the one worth your time: **is the town worth closing the gap on, or is your generated plate the town master with 3D taking only the vessels and variants?**

— Keel
