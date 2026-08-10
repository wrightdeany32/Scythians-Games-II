#!/usr/bin/env python3
"""Measure each colour map's mean in SCENE-LINEAR space and write it into the
manifest as `colorMean`, so `dio.textured(tint=)` can normalise the substrate
before multiplying.

Why this exists, and why the number has to be the linear one
------------------------------------------------------------
`tint=` multiplies a scanned colour map by a palette colour. Without
normalisation the result is the palette colour *darkened by the substrate's own
brightness*, so the textured path and the procedural path disagree — which is
what made the town's walls land ~7.5x under their intended value.

The fix is to divide the substrate by its mean so it contributes grain and
nothing else. The trap is which mean: an 8-bit JPEG stores sRGB-encoded values,
Blender converts to scene-linear before the Base Color socket, and the two means
differ by 1.6x-5.2x across our set (`road` is the worst at 5.23x). Normalising
by the stored mean under-corrects by exactly that factor and looks like the fix
"partly worked" — which is precisely how it presented the first time.

    PYTHONPATH=.bpylib python3 render/tools/measure_means.py

Separate from fetch_assets.py on purpose: that script is deliberately
dependency-free so it can run anywhere Python does, and this one needs bpy.
"""
import json
import os
import sys

import bpy
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "..", "assets")
MANIFEST = os.path.join(ASSETS, "manifest.json")


def srgb_to_linear(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def linear_mean(path):
    """PER-CHANNEL scene-linear means.

    Per channel, not one number: a single scalar normalises the substrate's
    BRIGHTNESS but leaves its HUE, so a warm plank scan tinted pale grey still
    renders as warm planks. Dividing each channel by its own mean neutralises
    the substrate to grey, after which the tint alone decides colour and the
    scan contributes only variation. (Found by looking at the render after a
    scalar version passed its own parity check — the check measured luminance,
    which was the wrong single number to be satisfied by.)"""
    img = bpy.data.images.load(path, check_existing=True)
    try:
        buf = np.empty(len(img.pixels), dtype=np.float32)
        img.pixels.foreach_get(buf)
        rgb = srgb_to_linear(buf.reshape(-1, 4)[:, :3])
        return [round(float(v), 4) for v in rgb.mean(axis=0)]
    finally:
        bpy.data.images.remove(img)


def main():
    with open(MANIFEST) as f:
        man = json.load(f)

    changed = 0
    for entry in man["materials"]:
        d = os.path.join(ASSETS, "materials", entry["slot"])
        if not os.path.isdir(d):
            continue
        col = [n for n in os.listdir(d) if "_color." in n.lower()]
        if not col:
            continue
        m = linear_mean(os.path.join(d, col[0]))
        if entry.get("colorMean") != m:
            entry["colorMean"] = m
            changed += 1
        print(f"  {entry['slot']:16} colorMean(linear rgb) = {m}")

    with open(MANIFEST, "w") as f:
        json.dump(man, f, indent=2)
        f.write("\n")
    print(f"\n{changed} value(s) written to {os.path.relpath(MANIFEST)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
