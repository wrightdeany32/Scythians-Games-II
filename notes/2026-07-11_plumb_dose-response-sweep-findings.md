# Plumb — the dose-response sweep: diamondProximity's window, ready to rule
### the strength ladder for both proximity factors, measured · what the retune should ship · one rig self-check that passed
*From: Plumb (engine seat) · carried by Dean · 2026-07-11 · for Azimuth (the ruling), Armature, Vigil, Dean*

The retune's one open number was diamondProximity's strength — shipped at 0.5, measured at +33% relative, and never given a ruled window the way lensBias got its +10–20%. I said I'd run the sweep if Azimuth named a window; on Dean's all-resources word I ran it first, so the window can be *chosen off the curve* instead of argued in the abstract. New standing tool: **`npm run bots:sweep`** — deterministic (seeded draws, fixed seeds), reruns byte-identically, same chokepoint-sampling discipline as the factor A/Bs.

## The curves (3 seeds × 400 draws per row; ceiling doses — distance ≈ 0 / full affinity)

**diamondProximity** — near-centroid card share (OFF baseline 23.8%):

| strength | share | relative drift |
|---|---|---|
| 0.10 | 25.7% | +8% |
| 0.20 | 27.0% | +14% |
| 0.30 | 29.0% | +22% |
| 0.40 | 30.3% | +28% |
| **0.50 (shipped)** | **31.5%** | **+33%** |
| 0.75 | 36.0% | +52% |
| 1.00 | 39.3% | +66% |

**lensBias** — matching-flavor share (OFF baseline 25.6%; contract window +10–20%):

| strength | share | relative drift |
|---|---|---|
| 0.10 | 27.4% | +7% |
| 0.20 | 28.7% | +12% |
| **0.30 (shipped)** | **30.2%** | **+18%** |
| 0.50 | 32.6% | +27% |
| 1.00 | 38.8% | +52% |

## The reading
1. **Both curves are near-linear in strength** — no knee, no cliff. The boost is linear by construction (`1 + strength × nearness`), and the draw pool passes that through almost proportionally. So the window choice is genuinely free: name a drift, read off the dose.
2. **If diamondProximity belongs in a lensBias-shaped window (+10–20%), the dose is strength ≈ 0.20–0.30.** The shipped 0.5 was never measured before the bots existed; at +33% it's half again past the top of that window. Whether position-following *should* be stronger than frame-following is a design call, not an engine one — but now it's a one-number call with the curve in hand. ⚑ Azimuth rules; I wire it into the retune PR same day.
3. **The rig self-checked**: lensBias's shipped 0.3 lands at +18% on the sweep — the same figure the original A/B measured. Two paths, one number; the instrument agrees with itself.
4. **Ceiling caveat carried from the A/B design**: these are maximum-signal doses (the prepared state sits ON the probe card). Real-run drift sits at or under the row. The contract's day-scale invisibility line (bots v2) already covers the other half.

## What the retune PR then is (one sitting, once Azimuth's number lands)
Flip `diamondProximity`, `lensBias`, `antiRepeat`, `bandNoise` ON in the explorer tuning block — lensBias at 0.3 (in-window, measured twice), diamondProximity at the ruled strength, antiRepeat/bandNoise at defaults (both measured, both behave as written) — then bots re-measure, baselines regenerate, green bar, Armature blesses. Shakedowns unblock behind it.

— Plumb
