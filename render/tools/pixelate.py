#!/usr/bin/env python3
"""Quantise a render down to a pixel-art register: fixed grid, fixed palette.

Two knobs and they are the whole style — vertical resolution and palette size.
A 16-bit console sat around 256x224 with 256 on-screen colours; this defaults
lower on both, because restraint reads as intent and generosity reads as an
accident.

Why this belongs in the pipeline rather than in a prompt: pixel art is defined
by *constraints* — one grid, one palette, hard edges — and constraints are the
one thing a diffusion model cannot hold. Generators produce pixel-art-FLAVOURED
images: the grid drifts, colours land off-palette, edges stay anti-aliased. A
quantiser cannot make those mistakes; the grid is arithmetic.

The useful property for this project: this transform accepts input from BOTH
pipelines. A Blender render and a generated plate, quantised to the same
palette at the same grid, come out siblings. The style is a normaliser — which
is exactly the seam we have been unable to close by any other means.

    python3 render/tools/pixelate.py render/out/town_overlook_dusk.png --height 180 --colors 32
"""
import argparse
import os
import sys

import bpy
import numpy as np


def load_rgb(path):
    img = bpy.data.images.load(path, check_existing=False)
    buf = np.empty(len(img.pixels), dtype=np.float32)
    img.pixels.foreach_get(buf)
    w, h = img.size
    a = buf.reshape(h, w, 4)[::-1]        # bpy is bottom-up
    bpy.data.images.remove(img)
    return a[:, :, :3], w, h


def save_rgb(path, arr):
    h, w, _ = arr.shape
    img = bpy.data.images.new(os.path.basename(path), width=w, height=h, alpha=False)
    rgba = np.concatenate([arr, np.ones((h, w, 1), dtype=np.float32)], axis=2)
    img.pixels.foreach_set(rgba[::-1].ravel())
    img.filepath_raw = path
    img.file_format = "PNG"
    img.save()
    bpy.data.images.remove(img)


def downsample(rgb, target_h):
    """Box-average down to the target grid. Averaging (not point-sampling)
    keeps the small stuff — wires, window lights — present as tone instead of
    dropping it on whichever pixel it happened to miss."""
    h, w, _ = rgb.shape
    scale = h / target_h
    target_w = int(round(w / scale))
    ys = (np.arange(target_h + 1) * h / target_h).astype(int)
    xs = (np.arange(target_w + 1) * w / target_w).astype(int)
    out = np.empty((target_h, target_w, 3), dtype=np.float32)
    for y in range(target_h):
        for x in range(target_w):
            out[y, x] = rgb[ys[y]:max(ys[y + 1], ys[y] + 1),
                            xs[x]:max(xs[x + 1], xs[x] + 1)].reshape(-1, 3).mean(axis=0)
    return out


def quantise(rgb, n_colors, iters=12, seed=7):
    """k-means in RGB, deterministic seeding. A fixed palette is what makes an
    image read as *authored* rather than photographed: every surface in the
    frame has to agree to use the same handful of colours, which is the same
    discipline as one material recipe, one camera, one light rig."""
    flat = rgb.reshape(-1, 3)
    rng = np.random.default_rng(seed)
    # k-means++ style spread, so the palette covers the darks instead of
    # spending every slot on the sky.
    centres = [flat[rng.integers(len(flat))]]
    for _ in range(n_colors - 1):
        d = np.min(((flat[:, None, :] - np.array(centres)[None]) ** 2).sum(2), axis=1)
        probs = d / max(d.sum(), 1e-9)
        centres.append(flat[rng.choice(len(flat), p=probs)])
    centres = np.array(centres, dtype=np.float32)

    for _ in range(iters):
        lab = np.argmin(((flat[:, None, :] - centres[None]) ** 2).sum(2), axis=1)
        for k in range(n_colors):
            m = lab == k
            if m.any():
                centres[k] = flat[m].mean(axis=0)
    lab = np.argmin(((flat[:, None, :] - centres[None]) ** 2).sum(2), axis=1)
    return centres[lab].reshape(rgb.shape), centres


def grade(rgb, desat=0.0, cool=0.0, lift=0.0, gamma=1.0):
    """Push the image toward a register BEFORE quantising, so the palette that
    k-means finds is already the palette we want.

    This is the knob that decides whether a pixel style reads as nostalgic or
    as dread, and it is not the resolution — 16-bit reads cheerful because of
    saturated primaries and high key, not because of the grid. Desaturating,
    cooling the shadows and lifting the blacks toward grey gets the same
    geometry to a very different place."""
    out = rgb.copy()
    if gamma != 1.0:
        out = np.clip(out, 0, None) ** gamma
    if desat:
        lum = (out * np.array([0.2126, 0.7152, 0.0722])).sum(axis=2, keepdims=True)
        out = out * (1 - desat) + lum * desat
    if cool:
        out = out * np.array([1.0 - cool * 0.35, 1.0 - cool * 0.12, 1.0], dtype=np.float32)
    if lift:
        out = out * (1 - lift) + lift            # blacks toward grey: fog, not ink
    return np.clip(out, 0.0, 1.0)


def upscale(rgb, factor):
    """Nearest-neighbour, so the pixels stay pixels. Any smooth filter here
    undoes the entire style."""
    return np.repeat(np.repeat(rgb, factor, axis=0), factor, axis=1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("--height", type=int, default=180, help="vertical resolution of the grid")
    ap.add_argument("--colors", type=int, default=32, help="palette size")
    ap.add_argument("--zoom", type=int, default=4, help="nearest-neighbour upscale for viewing")
    ap.add_argument("--desat", type=float, default=0.0, help="0..1 toward greyscale")
    ap.add_argument("--cool", type=float, default=0.0, help="0..1 toward blue")
    ap.add_argument("--lift", type=float, default=0.0, help="0..1 blacks toward grey")
    ap.add_argument("--gamma", type=float, default=1.0)
    ap.add_argument("--suffix", default="", help="appended to the output stem")
    a = ap.parse_args()

    rgb, w, h = load_rgb(a.source)
    print(f"source {w}x{h} -> grid height {a.height}, {a.colors} colours")
    small = grade(downsample(rgb, a.height), a.desat, a.cool, a.lift, a.gamma)
    quant, palette = quantise(small, a.colors)

    stem = os.path.splitext(a.source)[0] + (a.suffix or "")
    save_rgb(f"{stem}_px{a.height}.png", quant)
    save_rgb(f"{stem}_px{a.height}_x{a.zoom}.png", upscale(quant, a.zoom))
    print(f"  wrote {stem}_px{a.height}.png  ({quant.shape[1]}x{quant.shape[0]})")
    print(f"  wrote {stem}_px{a.height}_x{a.zoom}.png")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
