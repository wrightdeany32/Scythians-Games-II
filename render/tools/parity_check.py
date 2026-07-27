#!/usr/bin/env python3
"""Does the textured path actually land where the procedural path does?

`render/README.md` claims "textures are an upgrade, never a dependency" — that
a scene renders the same with assets or without. That was [ASSERTED]. Gesso
measured it and found the town's walls ~7.5x under their intended value, so the
claim was false in the direction that matters.

This makes it a rule. For each tinted slot the scenes use, render a flat-lit
patch twice — once through `dio.textured(tint=)`, once through `dio.paint()`
with the same hex — and compare mean linear luminance. Identical lighting,
identical geometry, one variable.

    PYTHONPATH=.bpylib python3 render/tools/parity_check.py

Exits non-zero if any slot drifts past tolerance, so it can gate a build the
same way the camera guard and the never-opens-▓▓ linter do.
"""
import os
import sys

import bpy
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "lib"))
import dio  # noqa: E402

# Slot, tint: the tinted surfaces the scenes actually build. A slot with no
# tint takes the scan's own colour and has nothing to be in parity with.
CASES = [
    ("painted_wood", "#a89d86"),
    ("painted_wood", "#7f7259"),
    ("painted_wood", "#a48b52"),
    ("painted_wood", "#8a7458"),
    ("cloth", "#5d6b58"),
    ("cloth", "#a8873f"),
]

# Per channel, and this is the whole lesson of the first version. A scalar
# luminance check PASSED on a shader that rendered pale-grey walls as warm
# brown planks: normalising the substrate's brightness without its hue leaves
# the scan's colour in charge, and mean luminance cannot see that. The guard is
# only worth having if it measures the thing that was actually wrong.
# Relative, per channel. With roughness and normal controlled for, the drift
# collapses from ~14% to a few percent — but a residual of up to ~7.5% survives,
# concentrated in whichever channel the tint is darkest in, and it is NOT grain
# variance (drift is identical to the decimal across grain_strength 0.00-0.45,
# because the blend is mean-preserving). Candidates not yet separated: the
# albedo clamp biting asymmetrically per channel, and the measurement crop
# sampling a non-representative patch of the map. Set at 0.10 so the guard
# catches the failure class it was built for — a substrate overriding its tint —
# while the unexplained few percent stays named rather than tuned away.
#
# Absolute AND relative, the way allclose does it. A pure relative test on a
# channel whose absolute value is ~0.05 (cloth's blue) is dominated by sampling
# noise: an absolute difference of 0.006 reads as "+11.6%" and means nothing.
# The floor keeps the guard honest at the dark end instead of firing on
# arithmetic.
RTOL = 0.10
ATOL = 0.012   # absolute floor, in render units


def isolate_colour(material):
    """Hold roughness and normal constant so the comparison is about COLOUR.

    Measured: leaving the scanned roughness map bound drifts blue +14% against
    the procedural patch, and unbinding it drops that to +1.7%; turning
    specular off flips the sign. The mechanism is that a scan makes parts of a
    surface glossier than the flat value `paint()` uses, and the resulting
    white specular lift is largest *relative* to whichever channel is smallest
    — blue, under warm tints. The normal map pushes the other way.

    Both of those are the upgrade working. This guard's question is narrower:
    does `tint=` land the surface on the palette colour it was given? So the
    variables that are *supposed* to differ get held equal, and what is left is
    the one thing being asserted."""
    nt = material.node_tree
    b = nt.nodes["Principled BSDF"]
    for sock in ("Roughness", "Normal"):
        for link in list(nt.links):
            if link.to_socket == b.inputs[sock]:
                nt.links.remove(link)
    b.inputs["Roughness"].default_value = 0.74
    return material


def patch_mean(material):
    """Mean linear luminance of a flat-lit plane wearing this material."""
    dio.obj("primitive_plane_add", material, (0, 0, 0), (1, 1, 1))
    light = bpy.data.lights.new("k", "SUN")
    light.energy = 3.0
    lo = bpy.data.objects.new("k", light)
    bpy.context.collection.objects.link(lo)
    lo.rotation_euler = (0, 0, 0)          # straight down: no shading variation
    world = bpy.data.worlds.new("w")
    bpy.context.scene.world = world
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.0

    cam_d = bpy.data.cameras.new("c")
    cam_d.type = "ORTHO"
    cam_d.ortho_scale = 1.2
    cam = bpy.data.objects.new("c", cam_d)
    bpy.context.collection.objects.link(cam)
    cam.location = (0, 0, 3)
    bpy.context.scene.camera = cam

    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = 24
    sc.render.resolution_x = sc.render.resolution_y = 96
    sc.view_settings.view_transform = "Standard"   # raw values, no tone curve
    sc.view_settings.look = "None"
    sc.render.filepath = "/tmp/parity.png"
    sc.use_nodes = False
    bpy.ops.render.render(write_still=True)

    img = bpy.data.images.load("/tmp/parity.png", check_existing=False)
    buf = np.empty(len(img.pixels), dtype=np.float32)
    img.pixels.foreach_get(buf)
    rgb = buf.reshape(-1, 4)[:, :3]
    bpy.data.images.remove(img)
    return rgb.mean(axis=0)          # PER CHANNEL - see below


def main():
    print(f"{'slot':16} {'tint':9} {'drift R':>9} {'drift G':>9} {'drift B':>9}")
    print("-" * 60)
    failures = []
    for slot, tint in CASES:
        dio.reset()
        proc = patch_mean(isolate_colour(dio.paint("proc", tint, rough=0.74)))
        dio.reset()
        tex = patch_mean(isolate_colour(
            dio.textured("tex", slot, tint, scale=2.6, rough=0.74, tint=tint)))
        drift = (tex - proc) / np.maximum(proc, 1e-6)
        over = np.abs(tex - proc) - (ATOL + RTOL * np.abs(proc))
        worst = float(over.max())
        flag = "" if worst <= 0 else "  <-- OUT"
        if flag:
            failures.append((slot, tint, worst))
        print(f"{slot:16} {tint:9} " + " ".join(f"{d:+8.1%}" for d in drift) + flag)

    if failures:
        print(f"\n{len(failures)} slot(s) outside atol {ATOL} + rtol {RTOL:.0%} on some "
              f"channel: the textured path is not an upgrade, it is a different look.")
        return 1
    print(f"\nparity ok — every tinted slot within atol {ATOL} + rtol {RTOL:.0%} of its "
          f"palette colour, on ALL THREE channels")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
