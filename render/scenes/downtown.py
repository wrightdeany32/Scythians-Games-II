"""Main street, from up the block — the environment test for the pixel register.

The counterpart to porch.py, and the half of the split this pipeline is
actually good at. Everything in frame is geometry: the kerb line, the pole
spacing, the wires between pole tops, the parking angle. None of it can come
apart, which is the failure the generated wides kept producing.

All metres. The street is a real 11m kerb-to-kerb with 3m walks, buildings on a
real 7m storefront module, because at this grid the eye reads RHYTHM before it
reads anything else — and rhythm only comes out right if the underlying
dimensions are.

    PYTHONPATH=.bpylib python3 render/scenes/downtown.py
"""
import math
import os
import random
import sys

import bpy

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "lib"))
import dio  # noqa: E402

OUT = os.path.join(os.path.dirname(__file__), "..", "out")
SEED = 3

def build():
    dio.reset()
    random.seed(SEED)
    P = {k: dio.paint(k, v, rough=0.88) for k, v in PALETTE.items()}

    def box(mat, loc, half, rot=(0, 0, 0)):
        return dio.obj("primitive_cube_add", mat, loc, half, rot=rot, size=2)

    ROAD_W, WALK_W = 11.0, 3.0
    EDGE = ROAD_W / 2
    BLOCK = 90.0

    # ---- ground, road, kerbs, markings ------------------------------------
    dio.obj("primitive_plane_add", P["walk"], (0, 20, 0.0), (120, 120, 1))
    box(P["asphalt"], (0, 20, 0.01), (EDGE, BLOCK, 0.01))
    for s in (-1, 1):
        box(P["kerb"], (s * EDGE, 20, 0.07), (0.18, BLOCK, 0.07))
        box(P["walk"], (s * (EDGE + WALK_W / 2), 20, 0.06), (WALK_W / 2, BLOCK, 0.06))
    for i in range(24):                                   # centre line, dashed
        box(P["line"], (0, -18 + i * 5.0, 0.03), (0.10, 1.6, 0.01))
    for s in (-1, 1):                                     # parking stripes
        for i in range(26):
            box(P["line"], (s * (EDGE - 1.2), -18 + i * 4.4, 0.03), (1.15, 0.07, 0.01))

    # ---- the built frontage ------------------------------------------------
    # A row of storefront modules: ground floor with a recessed window band and
    # a sign fascia, upper floors with punched windows, a cornice on top. The
    # module repeats at 7m with varied heights and colours, which is what gives
    # a street its rhythm.
    def building(x_sign, y, width, floors, wall):
        h = 4.2 + (floors - 1) * 3.4
        depth = 12.0
        cx = x_sign * (EDGE + WALK_W + depth / 2)
        box(P[wall], (cx, y, h / 2), (depth / 2, width / 2, h / 2))

        face = cx - x_sign * (depth / 2 + 0.02)           # the street-facing plane
        # ground floor: dark recessed glass + a sign band above it
        box(P["glass"], (face, y, 1.9), (0.10, width / 2 - 0.5, 1.5))
        box(P["sign"], (face - x_sign * 0.06, y, 3.9), (0.14, width / 2 - 0.4, 0.55))
        box(P[wall], (face, y, 0.35), (0.12, width / 2 - 0.5, 0.35))   # bulkhead
        # awning on some
        if random.random() < 0.45:
            box(P["awn"], (face - x_sign * 0.85, y, 3.25),
                (0.85, width / 2 - 0.6, 0.06), rot=(0, math.radians(x_sign * 9), 0))
        # upper windows, punched on a grid
        for f in range(1, floors):
            zf = 4.2 + (f - 1) * 3.4 + 1.7
            n = max(2, int(width // 2.4))
            for k in range(n):
                wy = y - width / 2 + 1.2 + k * (width - 2.4) / max(n - 1, 1)
                box(P["glass"], (face, wy, zf), (0.08, 0.45, 0.75))
                box(P["stone"], (face - x_sign * 0.04, wy, zf + 0.88), (0.10, 0.55, 0.09))
        # cornice — a proud BAND at the parapet, not a slab. The first version
        # gave it the building's whole depth, so from above every roof read as
        # a bright stone plate and the street lost its frontage line.
        box(P["stone"], (face - x_sign * 0.18, y, h + 0.12),
            (0.30, width / 2 + 0.15, 0.22))
        box(P["roof"], (cx, y, h + 0.04), (depth / 2, width / 2 + 0.05, 0.06))

    walls = ["brick_a", "brick_b", "brick_c", "stone", "cream"]
    for s in (-1, 1):
        y = -16.0
        while y < 62.0:
            w = random.choice([7.0, 7.0, 9.0, 12.0])
            building(s, y + w / 2, w - 0.4, random.choice([2, 2, 3, 3, 4]),
                     random.choice(walls))
            y += w

    # the courthouse tower, closing the far end
    box(P["stone"], (0, 82, 7.0), (9.0, 9.0, 7.0))
    box(P["stone"], (0, 82, 15.0), (2.6, 2.6, 8.0))
    box(P["glass"], (-2.62, 82, 17.5), (0.06, 1.1, 1.1))
    dio.obj("primitive_cone_add", P["roof"], (0, 82, 24.5), (1, 1, 1),
            vertices=8, radius1=3.4, radius2=0, depth=4.0)

    # ---- street furniture --------------------------------------------------
    def tree(x, y, s=1.0):
        box(P["trunk"], (x, y, 1.1 * s), (0.09 * s, 0.09 * s, 1.1 * s))
        for _ in range(3):
            dio.obj("primitive_ico_sphere_add", P[random.choice(["fol_a", "fol_b", "fol_c"])],
                    (x + random.uniform(-.4, .4) * s, y + random.uniform(-.4, .4) * s,
                     (2.5 + random.uniform(0, .7)) * s),
                    (1, 1, 0.8), subdivisions=2, radius=random.uniform(1.1, 1.5) * s,
                    smooth=True)

    def car(x, y, rot, body):
        c = P[body]
        box(c, (x, y, 0.55), (0.85, 2.05, 0.32), rot=(0, 0, rot))
        box(c, (x, y - 0.15, 1.08), (0.72, 1.15, 0.24), rot=(0, 0, rot))
        box(P["glass"], (x, y - 0.15, 1.10), (0.74, 1.05, 0.20), rot=(0, 0, rot))
        box(P["tyre"], (x, y, 0.28), (0.88, 1.85, 0.14), rot=(0, 0, rot))

    poles = []
    for i in range(9):
        y = -14 + i * 10.0
        for s in (-1, 1):
            x = s * (EDGE + WALK_W - 0.6)
            if i % 2 == (0 if s < 0 else 1):
                tree(x, y + 3.0, random.uniform(0.85, 1.15))
        px = EDGE + WALK_W - 0.5
        box(P["trunk"], (px, y, 4.4), (0.10, 0.10, 4.4))
        box(P["trunk"], (px, y, 8.1), (0.07, 0.9, 0.07))
        poles.append((px, y, 8.1))

    for a, b in zip(poles, poles[1:]):            # wires that reach, by construction
        for off in (-0.8, 0.0, 0.8):
            n = 5
            for k in range(n):
                t0, t1 = k / n, (k + 1) / n
                y0 = a[1] + (b[1] - a[1]) * t0
                y1 = a[1] + (b[1] - a[1]) * t1
                sag = -0.30
                z0 = a[2] + sag * 4 * t0 * (1 - t0)
                z1 = a[2] + sag * 4 * t1 * (1 - t1)
                mid = ((y0 + y1) / 2, (z0 + z1) / 2)
                ln = math.hypot(y1 - y0, z1 - z0)
                dio.obj("primitive_cylinder_add", P["wire"],
                        (a[0] + off * 0.0 + (0.0 if off == 0 else off), mid[0], mid[1]),
                        radius=0.035, depth=ln, vertices=4,
                        rot=(math.radians(90) + math.atan2(z1 - z0, y1 - y0), 0, 0))

    bodies = ["car_a", "car_b", "car_c", "car_d"]
    for s in (-1, 1):                              # parked, nose to the kerb
        for i in range(9):
            if random.random() < 0.3:
                continue
            car(s * (EDGE - 1.3), -14 + i * 4.4 + random.uniform(-.4, .4),
                random.uniform(-.05, .05), random.choice(bodies))
    for y, lane in ((6.0, -1), (24.0, 1), (41.0, -1)):     # moving
        car(lane * 2.6, y, 0, random.choice(bodies))

    dio.daylight(sun_energy=3.4, elevation_deg=27, azimuth_deg=-116,
                 sky_strength=0.62, warm=(1.0, 0.88, 0.72))

    # In the roadway at the top of the block, a couple of storeys up — the
    # street read as a corridor, which is how a main street actually presents.
    # (The first attempt put the camera at x=13.5, which is INSIDE the right-hand
    # building row: the frontage runs 8.5m to 20.5m from the centreline. Worth
    # the comment because it is the failure mode of laying a scene out in
    # metres — the numbers are all correct and the camera is in a wall.)
    dio.camera((5.5, -37.0, 12.5), (-1.0, 30.0, 4.0),
               lens=46, fstop=0.32, focus_bias=1.0, max_height=18.0,
               guard_note="a vantage from the street, never a drone over the town")
    bpy.context.scene.camera.data.dof.use_dof = False
    bpy.context.scene.render.filter_size = 0.01


PALETTE = {
    "asphalt": "#41403f", "line": "#a8933f", "walk": "#8e8a80", "kerb": "#a29d92",
    "brick_a": "#8a5744", "brick_b": "#6e4a3c", "brick_c": "#93705a",
    "stone": "#9a9184", "cream": "#b3a894",
    "glass": "#2f3438", "sign": "#5c5348", "awn": "#7c4a3a", "roof": "#4d4a44",
    "trunk": "#6b5a46", "wire": "#2a2825",
    "fol_a": "#5f6a30", "fol_b": "#8a6f24", "fol_c": "#6d5a26",
    "car_a": "#7d3a33", "car_b": "#39485c", "car_c": "#9a9690", "car_d": "#4a5a48",
    "tyre": "#2b2926",
}


def main():
    os.makedirs(OUT, exist_ok=True)
    build()
    dio.render(os.path.abspath(os.path.join(OUT, "downtown.png")),
               res=(360, 216), samples=96, exposure=-1.55)


if __name__ == "__main__":
    main()
