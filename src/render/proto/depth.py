#!/usr/bin/env python3
"""
depth.py — the one offline step of the viewfinder pipeline: turn a generated
still into a depth map, so the browser can parallax, rack focus, fog, and
relight it without any layer decomposition.

Usage:  python3 src/render/proto/depth.py art/<image>.png [more images...]
Writes: art/depth/<image>.depth.png  (8-bit, bright = near)
        art/depth/<image>.jpg        (a q88 JPEG of the color, for the web)

Requires: torch (CPU is fine), transformers, pillow. Model weights (~100MB,
Depth-Anything-V2-Small) download on first run and are cached by HF.
Nothing here touches the engine; it's an asset-pipeline tool.
"""
import sys, os
from pathlib import Path

def main(paths):
    from PIL import Image, ImageFilter
    import numpy as np
    from transformers import pipeline
    pipe = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf")
    out_dir = Path("art/depth"); out_dir.mkdir(parents=True, exist_ok=True)
    for p in paths:
        p = Path(p)
        img = Image.open(p).convert("RGB")
        res = pipe(img)
        # 'predicted_depth' is relative inverse depth (bigger = nearer).
        d = res["predicted_depth"].squeeze().float().cpu().numpy()
        d = (d - d.min()) / max(1e-6, (d.max() - d.min()))
        dep = Image.fromarray((d * 255).astype(np.uint8), mode="L").resize(img.size, Image.BICUBIC)
        dep = dep.filter(ImageFilter.GaussianBlur(1.0))   # soften step edges → smoother parallax
        stem = p.stem
        dep.save(out_dir / f"{stem}.depth.png", optimize=True)
        img.save(out_dir / f"{stem}.jpg", quality=88, optimize=True)
        print(f"{p} -> {out_dir}/{stem}.depth.png  ({img.size[0]}x{img.size[1]})")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    main(sys.argv[1:])
