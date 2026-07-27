#!/usr/bin/env python3
# =============================================================================
# render/tools/import_boundary.py — the WO-4 wall's PYTHON half.
#
# `src/tools/import-boundary.ts` enforces the surface wall for TypeScript
# renderers, but it walks `src/` and reads `.ts`. The asset pipeline is Python
# and lives in `render/`, so it sits entirely outside that scan: until this
# file, "render/ never imports the engine" was a sentence in a README, not a
# rule. Per the ledger discipline — a claim that something is mechanically
# enforced names the rule that enforces it, or is marked [ASSERTED] — this is
# that rule, so the claim can stop being [ASSERTED].
#
# THE WALL, restated for this side: an asset pipeline that could read
# `GameState` would be a route around WO-4. The renderer receives a `Surface`,
# never a `GameState`, and that has to hold for the thing that MAKES the
# pictures too. Scenes take plain numbers. If a figurine sheet ever needs
# per-character values, they arrive as a plain dict from a generation step —
# never by reaching into the engine.
#
# WHAT IS CHECKED (over the AST, so prose is structurally exempt):
#   1 · imports — nothing under render/ may import the engine, the content
#       packs, the cold-read harness, or reach up out of the tree.
#   2 · sys.path — no insertion that would put the repo root (and therefore
#       src/) on the import path, which is how an "innocent" import would
#       start resolving.
#   3 · identifiers — the trajectory names may not appear as code at all
#       (GameState, coordLog, centroid, attune, exposure, rngState, …), the
#       same belt-and-suspenders list the TypeScript side keeps.
#
# Comments and docstrings are NOT scanned — this file and dio.py's header both
# discuss `GameState` in order to forbid it, and a linter that cannot tell
# prose from code would make its own documentation unwritable. That is the same
# trap the TS linter's anchored directive-regex avoids, solved here by reading
# the AST instead of the text.
#
# Pure stdlib, no Blender, no pip install — it runs anywhere python3 does:
#
#     python3 render/tools/import_boundary.py
# =============================================================================
import ast
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
RENDER = os.path.dirname(HERE)
ROOT = os.path.dirname(RENDER)

# Import roots a render file may never touch. `src` is the engine and all its
# content; `coldreads` is the transcript store. Anything else is fine — the
# stdlib, bpy, mathutils, and render-local modules are all unconstrained.
FORBIDDEN_ROOTS = ("src", "engine", "content", "coldread", "smoke", "bots")

# Names that must never appear as code under render/, even if a future
# reshuffle moved them somewhere new — the belt-and-suspenders half of
# ALWAYS_FORBIDDEN in src/tools/import-boundary.ts.
#
# Deliberately NARROW, and the narrowness is the point. A 3D pipeline computes
# `centroid`s of meshes, sets a film `exposure`, and talks about `surface`s all
# day; those words are native here and mean something else entirely. A linter
# that flagged `sc.view_settings.exposure` would be wrong, would be argued
# with, and would eventually be switched off — which costs more than the
# coverage it buys. So this list holds only identifiers that could not
# plausibly mean anything but the engine, and the real load is carried by the
# import and sys.path checks above: without one of those, engine state cannot
# reach this process at all.
FORBIDDEN_NAMES = {
    "GameState", "ContentDB",
    "coordLog", "resolveCount",
    "dispositionCentroid", "lensCentroid", "deckCentroid",
    "diamondCoord", "lensFlavor", "attune", "rngState",
}


class Violation:
    def __init__(self, file, line, what, reason):
        self.file, self.line, self.what, self.reason = file, line, what, reason

    def __str__(self):
        rel = os.path.relpath(self.file, ROOT)
        return f"{rel}:{self.line}  {self.what} — {self.reason}"


def _root_of(module):
    """First path segment of a dotted module name ('src.engine.types' -> 'src')."""
    return (module or "").split(".")[0]


def _escapes_render(path, call):
    """True if a sys.path call resolves somewhere outside render/.

    `../lib` from render/scenes/ is render/lib — legitimate, and the scenes
    genuinely do it to find the shared rig. `../..` is the repo root, which is
    how src/ would quietly become importable. String-matching '..' cannot tell
    those apart, so resolve the segments against the file's own directory and
    ask the only question that matters: does the result stay in the tree?
    """
    segs = [n.value for n in ast.walk(call)
            if isinstance(n, ast.Constant) and isinstance(n.value, str)]
    # os.pardir reaches the same place '..' does.
    segs += [".." for n in ast.walk(call)
             if isinstance(n, ast.Attribute) and n.attr == "pardir"]
    if not segs:
        # Nothing statically resolvable — a computed path is precisely the
        # evasion this check exists for, so it does not get the benefit of
        # the doubt.
        return True
    base = os.path.dirname(path) if os.path.isabs(path) else os.path.join(RENDER, "scenes")
    resolved = os.path.normpath(os.path.join(base, *segs))
    return os.path.commonpath([resolved, RENDER]) != RENDER


def check_source(path, text):
    """The testable core: AST-scan one Python source, return its violations."""
    out = []
    try:
        tree = ast.parse(text)
    except SyntaxError as exc:
        return [Violation(path, exc.lineno or 0, "syntax error", str(exc))]

    for node in ast.walk(tree):
        # 1 · imports
        if isinstance(node, ast.Import):
            for alias in node.names:
                if _root_of(alias.name) in FORBIDDEN_ROOTS:
                    out.append(Violation(path, node.lineno, f"import {alias.name}",
                                         "render/ may not import the engine or its content"))
        elif isinstance(node, ast.ImportFrom):
            # `from .. import x` climbs out of render/ — level>=2 leaves the tree.
            if node.level and node.level >= 2:
                out.append(Violation(path, node.lineno, f"from {'.' * node.level}{node.module or ''} import …",
                                     "relative import climbs out of render/"))
            elif _root_of(node.module) in FORBIDDEN_ROOTS:
                out.append(Violation(path, node.lineno, f"from {node.module} import …",
                                     "render/ may not import the engine or its content"))

        # 2 · sys.path insertions that would put a parent of render/ on the path
        elif isinstance(node, ast.Call):
            f = node.func
            if isinstance(f, ast.Attribute) and f.attr in ("append", "insert", "extend"):
                base = f.value
                if isinstance(base, ast.Attribute) and base.attr == "path" \
                        and isinstance(base.value, ast.Name) and base.value.id == "sys":
                    if _escapes_render(path, node):
                        out.append(Violation(path, node.lineno, "sys.path." + f.attr,
                                             "puts a parent of render/ on the import path"))

        # 3 · forbidden identifiers, as code only (never prose)
        elif isinstance(node, ast.Name) and node.id in FORBIDDEN_NAMES:
            out.append(Violation(path, node.lineno, node.id,
                                 "engine/trajectory name used as code in render/"))
        elif isinstance(node, ast.Attribute) and node.attr in FORBIDDEN_NAMES:
            out.append(Violation(path, node.lineno, "." + node.attr,
                                 "engine/trajectory name used as code in render/"))

    return out


# ---- 1 · self-test ---------------------------------------------------------
# Same shape as the TypeScript runner: prove the check catches what it claims
# to catch BEFORE trusting a clean scan, so a linter that silently stopped
# working fails loudly instead of passing everything.
CASES = [
    ("importing the engine → blocked", True,
     "import src.engine.types\n"),
    ("from-importing engine content → blocked", True,
     "from src.engine.centroid import dispositionCentroid\n"),
    ("climbing out of render/ → blocked", True,
     "from ... import engine\n"),
    ("putting the repo root on sys.path → blocked", True,
     "import os, sys\nsys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))\n"),
    ("using GameState as code → blocked", True,
     "def build(state):\n    return GameState\n"),
    ("reading a trajectory attribute → blocked", True,
     "def f(g):\n    return g.coordLog\n"),
    ("deriving the disposition centroid → blocked", True,
     "def f(g):\n    return dispositionCentroid(g)\n"),
    # The two sides of the narrowness ruling above, pinned as cases so a later
    # hand widening FORBIDDEN_NAMES has to argue with a failing test first.
    ("a mesh centroid → allowed (native 3D vocabulary)", False,
     "def centroid(verts):\n    return sum(verts) / len(verts)\n"),
    ("setting film exposure → allowed (photographic term)", False,
     "def render(sc, exposure):\n    sc.view_settings.exposure = exposure\n"),
    ("prose naming what it forbids → allowed", False,
     '"""An asset pipeline that could read GameState would route around WO-4."""\n'
     "# never import src.engine here; the centroid and attune stay behind the wall\n"
     "import math\n"),
    ("importing bpy and the local rig → allowed", False,
     "import math, os\nimport bpy\nfrom mathutils import Vector\nimport dio\n"),
    ("a render-local sys.path insertion → allowed", False,
     "import os, sys\nsys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))\n"),
    ("plain scene parameters → allowed", False,
     "def vessel(height, build, skin, hair):\n    return {'h': height, 'b': build}\n"),
]


def self_test():
    failed = 0
    for name, should_flag, src in CASES:
        got = bool(check_source("<self-test>", src))
        ok = got == should_flag
        print(f"  {'OK  ' if ok else 'FAIL'} self-test: {name}")
        if not ok:
            failed += 1
    return failed


# ---- 2 · scan the tree -----------------------------------------------------
def walk_py(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames
                       if d not in ("__pycache__", "assets", "out", ".bpylib")]
        for fn in sorted(filenames):
            if fn.endswith(".py"):
                yield os.path.join(dirpath, fn)


def main():
    failed = self_test()
    violations, scanned = [], 0
    for path in walk_py(RENDER):
        scanned += 1
        with open(path, encoding="utf-8") as f:
            violations.extend(check_source(path, f.read()))

    if violations:
        print("\nWO-4 wall violations in render/:")
        for v in violations:
            print(f"  {v}")

    print(f"\nlint:render-wall — self-test "
          f"{f'{failed} FAILED' if failed else 'passed'} · "
          f"scanned {scanned} python file(s) under render/ · "
          f"{len(violations)} violation(s)")
    return 1 if (failed or violations) else 0


if __name__ == "__main__":
    raise SystemExit(main())
