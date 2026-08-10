"""A man on a porch step — the character test for the pixel register.

Characters are where a pixel style either carries a game or doesn't, and they
are the hardest thing to render here: a face at this grid is around twenty
pixels tall. The bet is that twenty pixels is enough, because at that size a
face is carried by SILHOUETTE and a few value steps rather than by modelling.
So the sculpt stays crude and the budget goes to the pose, the outline, and
where the light falls.

That is also the argument for the style on this project: a face you cannot
quite read is the anti-noun in a medium rather than in prose. The resolution
withholds, and withholding is what the whole compass is built on.

EVERYTHING HERE IS IN METRES. The first version of this scene drifted off
scale — a head ended up 34cm tall — and at pixel resolution bad proportion is
the one error the style cannot hide, because the silhouette is all there is.

    PYTHONPATH=.bpylib python3 render/scenes/porch.py
"""
import math
import os
import random
import sys

import bpy

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "lib"))
import dio  # noqa: E402

OUT = os.path.join(os.path.dirname(__file__), "..", "out")

# Authored, not sampled. At this grid a scanned map is per-pixel noise, so
# colour has to be decided: muted, a stop down, slightly dusty — the reference's
# hour remembered rather than photographed.
PAL = {
    "siding":    "#c0a95f",
    "siding_sh": "#8b7940",
    "trim":      "#ada492",
    "deck":      "#8f8474",
    "deck_dk":   "#6b6153",
    "post":      "#a99f8c",
    "dark":      "#3b362e",
    "screen":    "#24221d",
    "skin":      "#b98e68",
    "skin_sh":   "#8e6a4c",
    "hair":      "#8d8880",
    "jacket":    "#a08d64",
    "jacket_dk": "#7b6c4c",
    "shirt":     "#bdb5a5",
    "trouser":   "#4d4f55",
    "ground":    "#6d7145",
    "gravel":    "#9a958a",
    "fol_a":     "#696e37",
    "fol_b":     "#a4692a",
    "fol_c":     "#7a5824",
    "trunk":     "#6b5a46",
}


def build():
    dio.reset()
    P = {k: dio.paint(k, v, rough=0.88) for k, v in PAL.items()}

    def box(mat, loc, half, rot=(0, 0, 0)):
        return dio.obj("primitive_cube_add", mat, loc, half, rot=rot, size=2)

    DECK = 0.62          # deck height above the yard
    STEP = 0.42          # the step he sits on

    # ---- the house wall ----------------------------------------------------
    # Clapboard as actual boards at a real 15cm reveal. Eight of them across the
    # frame gives a horizontal every few pixels, which is most of what says
    # "house" — a flat rectangle says "backdrop".
    for i in range(16):
        z = DECK + i * 0.15
        box(P["siding"], (-0.70, 0.0, z), (0.04, 3.0, 0.075))
        box(P["siding_sh"], (-0.665, 0.0, z - 0.075), (0.012, 3.0, 0.012))

    box(P["trim"], (-0.655, 0.75, DECK + 1.30), (0.03, 0.40, 0.48))   # window
    box(P["screen"], (-0.632, 0.75, DECK + 1.30), (0.012, 0.34, 0.42))
    box(P["trim"], (-0.625, 0.75, DECK + 1.30), (0.018, 0.025, 0.42))
    box(P["dark"], (-0.66, -1.35, DECK + 1.02), (0.035, 0.42, 1.02))  # screen door
    box(P["screen"], (-0.62, -1.35, DECK + 1.20), (0.012, 0.34, 0.72))

    # ---- deck, step, post, roof -------------------------------------------
    for i in range(11):
        box(P["deck"] if i % 2 else P["deck_dk"],
            (-0.55 + i * 0.14, 0.0, DECK - 0.03), (0.065, 3.0, 0.03))
    box(P["deck_dk"], (0.05, 0.0, DECK - 0.20), (0.72, 3.0, 0.17))
    box(P["deck"], (0.92, 0.0, STEP - 0.03), (0.22, 1.4, 0.03))       # the step
    box(P["deck_dk"], (0.92, 0.0, STEP - 0.20), (0.22, 1.4, 0.17))
    box(P["post"], (0.68, -1.05, DECK + 1.20), (0.05, 0.05, 1.20))    # post
    box(P["dark"], (0.30, 0.0, DECK + 2.42), (0.55, 3.0, 0.06))       # roof edge
    box(P["deck_dk"], (0.05, 0.0, DECK + 2.52), (0.80, 3.0, 0.06))

    # ---- the man, in metres -----------------------------------------------
    # Seated on the step: hip at the step, thighs forward, shins down, forearms
    # on the knees, head turned out of frame-left. Blocky on purpose — at this
    # scale the POSE is the characterisation.
    hx, hy, hz = 0.86, 0.15, STEP + 0.10          # hip
    lean = math.radians(-11)                      # elbows-on-knees forward tilt

    box(P["trouser"], (hx - 0.22, hy, hz - 0.02), (0.24, 0.17, 0.09))     # thighs
    box(P["trouser"], (hx - 0.44, hy, hz - 0.28), (0.09, 0.16, 0.24))     # shins
    box(P["dark"],    (hx - 0.47, hy, hz - 0.50), (0.13, 0.16, 0.035))    # boots

    box(P["jacket"], (hx + 0.05, hy, hz + 0.32), (0.16, 0.21, 0.32), rot=(0, lean, 0))
    box(P["shirt"],  (hx - 0.08, hy, hz + 0.44), (0.05, 0.08, 0.20), rot=(0, lean, 0))
    box(P["jacket_dk"], (hx + 0.02, hy, hz + 0.60), (0.17, 0.23, 0.055), rot=(0, lean, 0))

    for side in (-1, 1):
        box(P["jacket"], (hx + 0.01, hy + side * 0.20, hz + 0.34),
            (0.085, 0.075, 0.22), rot=(0, math.radians(14), 0))            # upper arm
        box(P["jacket"], (hx - 0.16, hy + side * 0.195, hz + 0.13),
            (0.19, 0.07, 0.065))                                            # forearm
        box(P["skin"], (hx - 0.33, hy + side * 0.19, hz + 0.10),
            (0.055, 0.06, 0.05))                                            # hand

    # head — box, jaw, brow, nose, hair. Five shapes, ~22px tall in frame. The
    # brow exists so the eye sockets fall into shadow; at this resolution that
    # shadow IS the face.
    top = hz + 0.68
    box(P["skin"],    (hx - 0.03, hy, top),        (0.085, 0.095, 0.105))
    box(P["skin_sh"], (hx - 0.07, hy, top - 0.10), (0.065, 0.075, 0.03))   # jaw
    box(P["skin_sh"], (hx - 0.115, hy, top + 0.02),(0.03, 0.085, 0.022))   # brow
    box(P["skin"],    (hx - 0.125, hy, top - 0.02),(0.025, 0.02, 0.022))   # nose
    box(P["hair"],    (hx - 0.01, hy, top + 0.095),(0.09, 0.10, 0.028))    # crown
    box(P["hair"],    (hx + 0.065, hy, top + 0.01),(0.03, 0.10, 0.085))    # back

    # ---- the yard ----------------------------------------------------------
    dio.obj("primitive_plane_add", P["ground"], (8.0, 0.0, 0.0), (14, 14, 1))
    dio.obj("primitive_cube_add", P["gravel"], (2.9, 0.7, 0.02),
            (1.5, 2.0, 0.02), rot=(0, 0, 0.12), size=2)

    random.seed(11)
    for _ in range(34):
        x, y = random.uniform(1.8, 12.0), random.uniform(-6.0, 6.0)
        if abs(y) < 1.8 and x < 4.6:
            continue
        s = random.uniform(0.22, 0.8)
        dio.obj("primitive_ico_sphere_add", P[random.choice(["fol_a", "fol_b", "fol_c"])],
                (x, y, s * 0.6), (1, 1, 0.72), subdivisions=2, radius=s, smooth=True)

    for px, py, ph in ((8.5, -3.8, 3.2), (12.5, 2.6, 3.0)):
        box(P["trunk"], (px, py, ph), (0.06, 0.06, ph))
        box(P["trunk"], (px, py, ph * 1.68), (0.045, 0.55, 0.045))

    dio.daylight(sun_energy=3.2, elevation_deg=20, azimuth_deg=-54,
                 sky_strength=0.34, warm=(1.0, 0.87, 0.68))

    # His eye level, and far enough back to carry the porch with him. The guard
    # doubles as characterisation here: you sit on the step with him, you never
    # stand over him.
    dio.camera((3.55, -2.55, STEP + 0.95), (0.72, 0.10, STEP + 0.62),
               lens=50, fstop=0.32, focus_bias=1.0, max_height=DECK + 2.2,
               guard_note="you sit on the step with him; you never stand over him")
    bpy.context.scene.camera.data.dof.use_dof = False
    bpy.context.scene.render.filter_size = 0.01


def main():
    os.makedirs(OUT, exist_ok=True)
    build()
    dio.render(os.path.abspath(os.path.join(OUT, "porch.png")),
               res=(320, 200), samples=96, exposure=-1.05)


if __name__ == "__main__":
    main()
