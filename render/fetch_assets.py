#!/usr/bin/env python3
"""Fetch the CC0 material and HDRI sets listed in render/assets/manifest.json.

Run it and it does one of two useful things:

  * If the network reaches the asset CDNs, it downloads and unpacks everything
    missing, and says nothing about what it already has.
  * If it can't reach them, it prints a **shopping list** — every missing asset,
    the search terms that identify it, and exactly where the files go — so the
    same manifest serves a manual download without any of it being retyped.

Either way `render/assets/` ends up in the one layout `dio.textured()` expects,
and the scenes light up automatically the moment the files exist. Nothing here
is a prerequisite for rendering: every material falls back to its procedural
version when its directory is absent.

    python3 render/fetch_assets.py           # fetch what's missing
    python3 render/fetch_assets.py --list    # just print the shopping list
"""
import io
import json
import os
import sys
import urllib.error
import urllib.request
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "assets")
MANIFEST = os.path.join(ASSETS, "manifest.json")

# Download URL patterns. Best-effort and deliberately isolated here: if either
# service changes its scheme, this is the only thing that needs editing, and a
# stale pattern produces a clear failure plus a manual link rather than a
# silently wrong file.
ACG_URL = "https://ambientcg.com/get?file={id}_{res}.zip"
ACG_PAGE = "https://ambientcg.com/view?id={id}"
PH_URL = "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/{res}/{id}_{res}.hdr"
PH_PAGE = "https://polyhaven.com/a/{id}"

TIMEOUT = 60


def load():
    with open(MANIFEST) as f:
        return json.load(f)


def target_dir(kind, entry):
    return os.path.join(ASSETS, kind, entry["slot"])


def have(kind, entry):
    d = target_dir(kind, entry)
    return os.path.isdir(d) and any(
        n.lower().endswith((".jpg", ".png", ".hdr", ".exr")) for n in os.listdir(d))


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "scythians-render/1"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        return r.read()


def get_material(entry):
    d = target_dir("materials", entry)
    url = ACG_URL.format(id=entry["id"], res=entry["res"])
    blob = fetch(url)
    os.makedirs(d, exist_ok=True)
    with zipfile.ZipFile(io.BytesIO(blob)) as z:
        for name in z.namelist():
            # Keep only the maps the shader actually binds. NormalGL, never
            # NormalDX — Blender uses the OpenGL green-channel convention and
            # the DirectX map inverts every surface's lighting in a way that is
            # subtle enough to ship by accident.
            low = name.lower()
            if any(k in low for k in ("_color.", "_roughness.", "_normalgl.",
                                      "_displacement.", "_ambientocclusion.")):
                with z.open(name) as src, open(os.path.join(d, os.path.basename(name)), "wb") as dst:
                    dst.write(src.read())
    return d


def get_hdri(entry):
    d = target_dir("hdris", entry)
    url = PH_URL.format(id=entry["id"], res=entry["res"])
    blob = fetch(url)
    os.makedirs(d, exist_ok=True)
    path = os.path.join(d, f"{entry['id']}_{entry['res']}.hdr")
    with open(path, "wb") as f:
        f.write(blob)
    return d


def shopping_list(missing):
    print("\n" + "=" * 74)
    print("SHOPPING LIST — the asset CDNs are not reachable from here.")
    print("=" * 74)
    print("""
Two ways forward, either is fine:

  A) Open the network policy for this environment so the fetch can run
     itself. The two hosts that matter are:

         ambientcg.com  (and acg-download.struffelproductions.com)
         polyhaven.com  (and dl.polyhaven.org)

     Environment network settings live with the environment, not the repo —
     see https://code.claude.com/docs/en/claude-code-on-the-web

  B) Download by hand. Every entry below names what to search for, which
     download button to press, and the exact folder to unzip into. The
     scenes pick the files up automatically; no code changes either way.

All of it is CC0 — public domain, no attribution required, no licence file
to track.
""")
    for kind, entry in missing:
        page = (ACG_PAGE if kind == "materials" else PH_PAGE).format(id=entry["id"])
        rel = os.path.relpath(target_dir(kind, entry), os.path.dirname(HERE))
        print(f"  • {entry['slot']}")
        print(f"      look for : {entry['search']}")
        print(f"      why      : {entry['why']}")
        print(f"      likely   : {entry['id']}  —  {page}")
        if kind == "materials":
            print(f"      download : the \"{entry['res']}\" zip; keep Color, Roughness,")
            print(f"                 NormalGL, Displacement (NOT NormalDX)")
        else:
            print(f"      download : HDRI, {entry['res']} .hdr")
        print(f"      unzip to : {rel}/")
        print()
    print("The ids are best-effort — trust the 'look for' line over the number,")
    print("and pick whatever on the page actually matches it.\n")


def main():
    man = load()
    entries = [("materials", e) for e in man["materials"]] + \
              [("hdris", e) for e in man["hdris"]]
    missing = [(k, e) for k, e in entries if not have(k, e)]

    print(f"manifest: {len(entries)} assets · {len(entries) - len(missing)} present · "
          f"{len(missing)} missing")
    if not missing:
        print("nothing to do.")
        return 0
    if "--list" in sys.argv:
        shopping_list(missing)
        return 0

    got, failed = [], []
    for kind, entry in missing:
        try:
            print(f"  fetching {entry['slot']} ({entry['id']}) …", flush=True)
            (get_material if kind == "materials" else get_hdri)(entry)
            got.append(entry["slot"])
        except (urllib.error.URLError, urllib.error.HTTPError, OSError,
                zipfile.BadZipFile) as exc:
            failed.append((kind, entry, exc))

    if got:
        print(f"\nfetched {len(got)}: {', '.join(got)}")
    if failed:
        print(f"\n{len(failed)} could not be fetched:")
        for _, entry, exc in failed:
            print(f"  {entry['slot']}: {type(exc).__name__} — {exc}")
        shopping_list([(k, e) for k, e, _ in failed])
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
