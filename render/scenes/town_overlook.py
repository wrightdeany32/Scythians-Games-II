"""The town, seen from the overlook — built as geometry, not prompted.

Every failure Dean reported from the generated wides is a class of error that
cannot occur here: power lines that stop short, pole spacing that implies miles
the ground doesn't have, perspective that comes apart as complexity rises. A
pole is at a coordinate. A wire is a curve between two pole-top coordinates.
The camera is a transform. There is no roll to lose and nothing to re-roll.

The layout has ONE source of truth — the road polyline. Buildings face it,
poles march down it, wires span between them, traffic sits on it. Nothing in
the frame can disagree with anything else, because everything is derived from
the same curve.

    python3 render/scenes/town_overlook.py

Change SEED for a different town with the same rules; change TIME_OF_DAY for
the palette variants over identical geometry.
"""
import math
import os
import random
import sys

import bpy

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "lib"))
import dio  # noqa: E402
from mathutils import Vector  # noqa: E402

OUT = os.path.join(os.path.dirname(__file__), "..", "out")
SEED = 7

# Palette variants: identical geometry, three light rigs. This is the art
# plan's "town master, 3 palette variants" — guaranteed the same town rather
# than hoped to be.
TIME_OF_DAY = {
    "day":   dict(sun_energy=4.4, elevation_deg=52, sky_strength=0.45, warm=(1.0, 0.95, 0.86)),
    "dusk":  dict(sun_energy=4.4, elevation_deg=38, sky_strength=0.30, warm=(1.0, 0.87, 0.68)),
    "night": dict(sun_energy=0.35, elevation_deg=-6, sky_strength=0.09, warm=(0.62, 0.72, 1.0)),
}

# The overlook vantage. The ledger's camera guard as a coordinate rather than a
# review note: the shot is taken from a place on the valley wall where a person
# could stand. (The two in-frame watchers return once the figurine sculpt is
# worth showing at this distance.)
OVERLOOK = Vector((-19.0, -30.0, 15.5))
CEILING = 26.0   # above this the shot becomes the god's-eye view the guards forbid


def build(variant="dusk"):
    random.seed(SEED)
    dio.reset()

    GROUND  = dio.mottle("ground", "#3f5220", "#77883a")
    ASPHALT = dio.paint("asphalt", "#4a4744", 0.82, grain=0.06)
    ROOF_D  = dio.paint("roofd", "#4b4642", 0.80)
    ROOF_R  = dio.paint("roofr", "#7a4038", 0.78)
    POLE    = dio.paint("pole", "#6b5a46", 0.85, grain=0.05)
    WIRE    = dio.paint("wire", "#2b2a28", 0.60)
    STEEL   = dio.paint("steel", "#b9bcbd", 0.45, sheen=0.2)
    BRICK   = dio.paint("brick", "#96604a", 0.85, grain=0.05)
    WALLS = [dio.paint(f"w{i}", c, 0.74, grain=0.04) for i, c in enumerate(
        ["#a89d86", "#94825e", "#b3a892", "#7f7259", "#a48b52", "#918676", "#b9ac93"])]
    FOLIAGE = [dio.paint(f"f{i}", c, 0.93, grain=0.12) for i, c in enumerate(
        ["#5c6b22", "#8a6a12", "#a8500f", "#6d3f10", "#455c1c", "#c06a12", "#7d7a18"])]

    dio.obj("primitive_plane_add", GROUND, (0, 34, -0.02), (60, 60, 1))

    # Ridgelines, three ranks. Depth is real, so aerial perspective is free —
    # the far ranges desaturate because they are actually far away.
    for rank, (dist, h, col) in enumerate(
            [(104, 9, "#66714f"), (136, 13, "#5c6a5e"), (172, 18, "#5d6675")]):
        m = dio.paint(f"ridge{rank}", col, 0.97)
        for i in range(9):
            dio.obj("primitive_cone_add", m,
                    (-80 + i * 20 + random.uniform(-6, 6), dist + random.uniform(-8, 8), -1.5),
                    (random.uniform(2.4, 4.0), random.uniform(1.6, 2.4), 1),
                    vertices=14, radius1=9, radius2=0,
                    depth=h * random.uniform(0.8, 1.3), smooth=True)

    # ---- the road: the layout's single source of truth ---------------------
    ctrl = [Vector((-46, 6, 0)), Vector((-22, 9, 0)), Vector((-4, 15, 0)),
            Vector((14, 20, 0)), Vector((34, 30, 0)), Vector((52, 44, 0))]
    path = []
    for i in range(49):
        t = i / 48 * (len(ctrl) - 1)
        k = min(int(t), len(ctrl) - 2)
        path.append(ctrl[k].lerp(ctrl[k + 1], t - k))

    def ribbon(width, material, z):
        verts, faces = [], []
        for i, p in enumerate(path):
            d = path[min(i + 1, len(path) - 1)] - path[max(i - 1, 0)]
            n = Vector((-d.y, d.x, 0)).normalized() * (width / 2)
            verts += [(p.x + n.x, p.y + n.y, z), (p.x - n.x, p.y - n.y, z)]
            if i:
                faces.append((2 * i - 2, 2 * i - 1, 2 * i + 1, 2 * i))
        me = bpy.data.meshes.new("road")
        me.from_pydata(verts, [], faces)
        me.update()
        o = bpy.data.objects.new("road", me)
        bpy.context.collection.objects.link(o)
        o.data.materials.append(material)

    ribbon(3.6, ASPHALT, 0.10)
    ribbon(0.14, dio.paint("centerline", "#c9a83c", 0.8), 0.13)

    def frame(t):
        i = max(1, min(int(t * (len(path) - 1)), len(path) - 2))
        p = path[i]
        fwd = (path[i + 1] - path[i - 1]).normalized()
        return p, fwd, Vector((-fwd.y, fwd.x, 0))

    # ---- poles, and wires that reach --------------------------------------
    tops = []
    for k in range(11):
        p, fwd, left = frame(0.04 + k * 0.088)
        base = p + left * 2.9
        ph = 5.4
        dio.obj("primitive_cylinder_add", POLE, (base.x, base.y, ph / 2),
                radius=0.11, depth=ph, vertices=8)
        dio.obj("primitive_cube_add", POLE, (base.x, base.y, ph - 0.45),
                (0.06, 0.85, 0.06), rot=(0, 0, math.atan2(fwd.y, fwd.x) + math.pi / 2), size=2)
        tops.append([Vector((base.x, base.y - 0.72, ph - 0.42)),
                     Vector((base.x, base.y + 0.72, ph - 0.42)),
                     Vector((base.x, base.y, ph - 1.15))])

    for a, b in zip(tops, tops[1:]):
        for wi in range(3):
            p0, p1 = a[wi], b[wi]
            sag = -0.055 * (p1 - p0).length          # catenary, so it reads as wire
            for s in range(6):
                f0, f1 = s / 6, (s + 1) / 6
                q0 = p0.lerp(p1, f0) + Vector((0, 0, sag * 4 * f0 * (1 - f0)))
                q1 = p0.lerp(p1, f1) + Vector((0, 0, sag * 4 * f1 * (1 - f1)))
                d = q1 - q0
                o = dio.obj("primitive_cylinder_add", WIRE, (q0 + q1) / 2,
                            radius=0.022, depth=d.length, vertices=5)
                o.rotation_euler = d.to_track_quat("Z", "Y").to_euler()

    # ---- the built stock ---------------------------------------------------
    def house(x, y, rot, w=2.6, d=3.4, h=2.0):
        dio.obj("primitive_cube_add", random.choice(WALLS), (x, y, h / 2),
                (w / 2, d / 2, h / 2), rot=(0, 0, rot), size=2)
        dio.obj("primitive_cone_add", random.choice([ROOF_D, ROOF_R]), (x, y, h + 0.62),
                (w * 0.80, d * 0.62, 1), rot=(0, 0, rot + math.pi / 4),
                vertices=4, radius1=1.0, radius2=0, depth=1.25)

    def shop(x, y, rot, w=5.0, d=3.2, h=2.4, material=None):
        dio.obj("primitive_cube_add", material or random.choice(WALLS), (x, y, h / 2),
                (w / 2, d / 2, h / 2), rot=(0, 0, rot), size=2)
        dio.obj("primitive_cube_add", ROOF_D, (x, y, h + 0.10),
                (w / 2 + .12, d / 2 + .12, .10), rot=(0, 0, rot), size=2)

    def tree(x, y, s=1.0):
        """Overlapping lumps on a short trunk. One sphere reads as a lollipop;
        two or three overlapping masses read as a canopy."""
        f = random.choice(FOLIAGE)
        dio.obj("primitive_cylinder_add", POLE, (x, y, 0.22 * s),
                radius=0.07 * s, depth=0.46 * s, vertices=6)
        for _ in range(random.randint(2, 3)):
            dio.obj("primitive_ico_sphere_add", f,
                    (x + random.uniform(-.30, .30) * s, y + random.uniform(-.30, .30) * s,
                     (0.62 + random.uniform(0, .28)) * s),
                    (1, 1, random.uniform(0.62, 0.80)), subdivisions=2,
                    radius=random.uniform(0.42, 0.60) * s, smooth=True)

    def car(x, y, rot):
        c = dio.paint(f"car{random.randint(0, 5)}", random.choice(
            ["#8d3a34", "#2f4256", "#9a9a96", "#3c5140", "#c2bfb6", "#5a4a3f"]),
            0.42, sheen=0.35)
        dio.obj("primitive_cube_add", c, (x, y, 0.30), (0.85, 0.38, 0.22), rot=(0, 0, rot), size=2)
        dio.obj("primitive_cube_add", c, (x - 0.10, y, 0.62), (0.45, 0.34, 0.16), rot=(0, 0, rot), size=2)

    for _ in range(38):                                    # residential
        p, fwd, left = frame(0.05 + random.random() * 0.62)
        side = random.choice([-1, 1])
        off = left * side * random.uniform(5.2, 11.5)
        x, y = p.x + off.x, p.y + off.y
        house(x, y, math.atan2(fwd.y, fwd.x) + (0 if side > 0 else math.pi)
              + random.uniform(-.12, .12))
        for _ in range(random.randint(1, 3)):
            tree(x + random.uniform(-4, 4), y + random.uniform(-3.4, 3.4),
                 random.uniform(.8, 1.5))

    p, fwd, left = frame(0.50)                             # the commercial strip
    ang = math.atan2(fwd.y, fwd.x)
    strip = p + left * 6.2
    for i in range(3):
        o = strip + fwd * (i - 1) * 5.4
        shop(o.x, o.y, ang)
    lot = p + left * 11.4
    dio.obj("primitive_cube_add", ASPHALT, (lot.x, lot.y, 0.06),
            (7.5, 5.0, 0.05), rot=(0, 0, ang), size=2)
    for r in range(4):
        for c in range(8):
            car(lot.x - 5.6 + c * 1.9 + random.uniform(-.15, .15),
                lot.y - 2.6 + r * 2.6, ang + math.pi / 2 + random.uniform(-.06, .06))

    for t in (0.12, 0.21, 0.30, 0.37, 0.46, 0.58, 0.67, 0.79, 0.88):
        p, fwd, left = frame(t)
        o = p + left * random.uniform(-0.9, 0.9)
        car(o.x, o.y, math.atan2(fwd.y, fwd.x))

    p, fwd, left = frame(0.68)                             # the civic block
    civ = p + left * 8.0
    shop(civ.x, civ.y, math.atan2(fwd.y, fwd.x), w=7.5, d=4.6, h=3.4, material=BRICK)

    tx, ty = 30, 44                                        # the water tower
    for a in range(4):
        an = a * math.pi / 2 + math.pi / 4
        dio.obj("primitive_cylinder_add", STEEL,
                (tx + math.cos(an) * 1.1, ty + math.sin(an) * 1.1, 3.0),
                radius=0.075, depth=6.2, vertices=6,
                rot=(math.cos(an) * .10, math.sin(an) * .10, 0))
    dio.obj("primitive_cylinder_add", STEEL, (tx, ty, 6.9), radius=1.55, depth=1.9,
            vertices=16, smooth=True)
    dio.obj("primitive_cone_add", STEEL, (tx, ty, 8.35), radius1=1.55, radius2=0,
            depth=1.0, vertices=16, smooth=True)

    for _ in range(190):                                   # treelines
        a = random.random()
        if a < .5:   x, y = random.uniform(-58, -26), random.uniform(4, 62)
        elif a < .8: x, y = random.uniform(26, 58), random.uniform(10, 62)
        else:        x, y = random.uniform(-58, 58), random.uniform(56, 70)
        tree(x, y, random.uniform(1.1, 2.3))

    dio.daylight(**TIME_OF_DAY[variant])
    dio.camera(OVERLOOK, (7.0, 22.0, 0.6), lens=42, fstop=0.32, focus_bias=0.58,
               max_height=CEILING,
               guard_note="the town is seen from the valley wall, never from the air")


def main():
    os.makedirs(OUT, exist_ok=True)
    variant = sys.argv[1] if len(sys.argv) > 1 else "dusk"
    print(f"town_overlook · {variant} · seed {SEED}")
    build(variant)
    dio.render(os.path.join(OUT, f"town_overlook_{variant}.png"),
               res=(1024, 576), samples=96)


if __name__ == "__main__":
    main()
