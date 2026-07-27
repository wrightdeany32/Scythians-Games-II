"""The player-vessel figurine — the strongest case for this pipeline.

The ledger's presentation ruling is "PAINT the player-vessel (a blank figurine
morphs)". That is not one asset; with ~100 starts in the deck it is ~100
variants of one object, and it has to stay recognisably the same carving each
time. No image generator can hold an object identical across a hundred images.
A parametric mesh does it by construction.

And the parameters are not invented. src/engine/types.ts already carries:

    BodyArchetype { height: number; build: number; }   // 0..1 scales
    portrait: { face: string; skin: string; hair: string }

so the vessel is a render of state the engine ALREADY holds. The app never
calls this — renders are baked offline into an asset sheet and the web shell
picks a sprite — so nothing here crosses the WO-4 wall.

    python3 render/scenes/vessel.py
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "lib"))
import dio  # noqa: E402

OUT = os.path.join(os.path.dirname(__file__), "..", "out")

# Stand-ins with the shape of a GameState.player. Real sheets are generated
# from the start-deck register, one entry per start.
CAST = [
    {"name": "vessel_tall_slight", "body": {"height": 0.72, "build": 0.30},
     "portrait": {"skin": "#c98f63", "hair": "#3a2317", "coat": "#4a5d68"}},
    {"name": "vessel_short_mid", "body": {"height": 0.34, "build": 0.52},
     "portrait": {"skin": "#d6a37a", "hair": "#8e8e8a", "coat": "#a8873f"}},
    {"name": "vessel_mid_heavy", "body": {"height": 0.58, "build": 0.80},
     "portrait": {"skin": "#bb8055", "hair": "#4a4a46", "coat": "#5d6b58"}},
]


def figurine(char, at=(0, 0, 0)):
    """A turned peg doll: base · tapered body · shoulders · neck · head · cap.

    Six primitives. At diorama distance the silhouette carries the whole
    likeness, which is why crude geometry is not a compromise here — a carved
    figurine is *supposed* to be a simplification of a person.
    """
    p = char["portrait"]
    H, B = char["body"]["height"], char["body"]["build"]
    x, y, z = at

    # Scanned sets when present, procedural when not — see dio.textured.
    # The coat takes a fabric weave tinted to its colour, which is the detail
    # doing most of the work in the reference plates.
    wood = dio.textured("wood", "figurine_wood", "#a07a4a", scale=3.0, rough=0.68)
    coat = dio.textured(f"coat_{p['coat']}", "cloth", p["coat"], scale=6.0,
                        rough=0.48, tint=p["coat"])
    skin = dio.paint(f"skin_{p['skin']}", p["skin"], rough=0.42, grain=0.03)
    hair = dio.paint(f"hair_{p['hair']}", p["hair"], rough=0.58)

    body_h = 0.62 + 0.52 * H          # height: how tall the turned body is
    body_r = 0.135 + 0.085 * B        # build:  how wide it is at the base
    head_r = 0.112 + 0.020 * B
    neck_z = z + 0.05 + body_h

    dio.obj("primitive_cylinder_add", wood, (x, y, z + 0.025),
            radius=body_r * 1.55, depth=0.05)
    dio.obj("primitive_cone_add", coat, (x, y, z + 0.05 + body_h / 2),
            radius1=body_r * 1.22, radius2=body_r * 0.70, depth=body_h, smooth=True)
    dio.obj("primitive_uv_sphere_add", coat, (x, y, neck_z - 0.012),
            (1.0, 0.86, 0.40), radius=body_r * 0.78, smooth=True)
    dio.obj("primitive_cylinder_add", skin, (x, y, neck_z + 0.030),
            radius=body_r * 0.34, depth=0.052)
    head_z = neck_z + 0.056 + head_r * 0.90
    dio.obj("primitive_uv_sphere_add", skin, (x, y, head_z),
            (1, 1, 1.07), radius=head_r, smooth=True)
    dio.obj("primitive_uv_sphere_add", hair, (x, y, head_z + head_r * 0.62),
            (0.98, 0.98, 0.52), radius=head_r, smooth=True)
    return body_h


def main():
    os.makedirs(OUT, exist_ok=True)
    for char in CAST:
        print(char["name"])
        dio.reset()
        body_h = figurine(char)
        dio.obj("primitive_plane_add",
                dio.mottle("table", "#5f4526", "#8a6a45", rough=0.86, scale_lo=3.0),
                (0, 0, 0), (6, 6, 1))
        dio.studio()
        # Eye level of the figure itself — the shot is taken from inside the
        # diorama's world, the same guard the town overlook answers to.
        dio.camera((1.15, -2.45, 0.05 + body_h * 0.58),
                   (0, 0, 0.05 + body_h * 0.52),
                   lens=62, fstop=1.7, focus_bias=1.0,
                   max_height=0.05 + body_h * 1.6,
                   guard_note="a figurine is met at its own height, never looked down on")
        dio.render(os.path.join(OUT, f"{char['name']}.png"),
                   res=(460, 620), samples=110)


if __name__ == "__main__":
    main()
