#!/usr/bin/env python3
"""
handdepth.py — hand-authored depth maps for the three sample stills, used only
because the depth model's host was unreachable from the build container.
Real maps come from depth.py (Depth-Anything). Same output contract:
art/depth/<stem>.depth.png, 8-bit, bright = near.
"""
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
from pathlib import Path

W, H = 1408, 768
OUT = Path("art/depth"); OUT.mkdir(parents=True, exist_ok=True)

def vgrad(y0, d0, y1, d1):
    """depth as a function of row: linear from (y0,d0) to (y1,d1), clamped."""
    ys = np.arange(H)[:, None].astype(np.float32)
    t = np.clip((ys - y0) / max(1, (y1 - y0)), 0, 1)
    return np.broadcast_to(d0 + (d1 - d0) * t, (H, W)).copy()

def poly(base, pts, depth, feather=3):
    m = Image.new("L", (W, H), 0)
    ImageDraw.Draw(m).polygon(pts, fill=255)
    if feather: m = m.filter(ImageFilter.GaussianBlur(feather))
    a = np.asarray(m, dtype=np.float32) / 255.0
    return base * (1 - a) + depth * a

def save(stem, d, blur=2.0):
    d = np.clip(d, 0, 1)
    im = Image.fromarray((d * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(blur))
    im.save(OUT / f"{stem}.depth.png", optimize=True)
    Image.open(f"art/{stem}.png").convert("RGB").save(OUT / f"{stem}.jpg", quality=86, optimize=True)
    print("wrote", stem)

# --- 1: the town from the overlook -----------------------------------------
d = vgrad(120, 0.12, 768, 0.72)                      # town recedes to the horizon
d = poly(d, [(0,0),(W,0),(W,95),(900,110),(600,120),(300,120),(0,140)], 0.02, 6)   # sky + far ridge
d = poly(d, [(1180,540),(1408,520),(1408,768),(1150,768)], 0.86, 8)                # right foreground brush
d = poly(d, [(0,530),(150,480),(260,480),(330,490),(420,515),(470,590),(440,690),(600,768),(0,768)], 0.95, 6)  # the rock
d = poly(d, [(150,330),(205,318),(215,420),(210,560),(150,560),(140,430)], 0.97, 3)   # figure 1
d = poly(d, [(238,320),(300,308),(322,420),(318,560),(235,560),(230,430)], 0.97, 3)   # figure 2
save("1784747706759", d)

# --- 2: Dale on the porch step -----------------------------------------------
d = vgrad(0, 0.10, 768, 0.55)                        # far trees → the gravel toward camera
d = poly(d, [(0,0),(380,0),(380,768),(0,768)], 0.68, 10)                            # the house wall + screen door
d = poly(d, [(0,560),(520,520),(900,640),(900,768),(0,768)], 0.80, 10)              # the porch boards
d = poly(d, [(400,70),(560,55),(620,150),(600,260),(560,330),(700,400),(740,540),(700,768),(190,768),(200,520),(300,380),(380,320),(390,200)], 0.96, 3)  # Dale
save("1784749922735", d)

# --- 3: the woman in the cap ------------------------------------------------
d = vgrad(0, 0.10, 768, 0.30)
d = poly(d, [(0,180),(330,180),(330,768),(0,768)], 0.42, 10)                        # the bleacher figures
d = poly(d, [(150,0),(420,0),(420,110),(150,110)], 0.55, 8)                         # the lamp
d = poly(d, [(430,40),(700,30),(830,110),(800,300),(760,420),(860,560),(880,768),(270,768),(300,560),(400,420),(430,300),(420,180)], 0.96, 3)  # her
save("1784838675606", d)
