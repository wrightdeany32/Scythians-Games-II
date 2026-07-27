"""dio — the shared diorama rig. One camera recipe, one material recipe, one
render call, imported by every scene so no two assets can disagree.

The whole argument for this pipeline is in this file rather than in any scene:
a scene file holds STATE. The camera height, the aperture, the sun angle, the
paint roughness are values that persist, get reviewed, and stay put. That is
the one thing image generation structurally cannot offer, and it is what the
project's presentation guards need in order to be enforceable rather than
merely agreed.

Nothing here knows about the game. Scenes pass in plain numbers; the engine is
never imported. (An asset pipeline that could read GameState would be a way
around the WO-4 wall, so it simply cannot — see render/README.md.)
"""
import json
import math
import os

import bpy
from mathutils import Vector

# ---------------------------------------------------------------- colour ----

def hex_rgb(h):
    """sRGB hex -> linear RGBA, so authored hex values mean what they look like."""
    h = h.lstrip("#")
    lin = lambda c: (c / 12.92) if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return tuple(lin(int(h[i:i + 2], 16) / 255) for i in (0, 2, 4)) + (1.0,)


_MATS = {}

def reset():
    """Empty scene. Every scene starts here so a render never inherits state."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    _MATS.clear()


def paint(name, hexcol, rough=0.70, grain=0.0, sheen=0.0):
    """THE material recipe: matte, faintly fibrous, barely specular.

    Applying one recipe to every surface in the world is what makes unrelated
    geometry read as a single hand-built object. It matters more than shape:
    a crude form in a consistent material reads as 'carved'; a good form in an
    inconsistent one reads as 'CG'. Override everything with this.
    """
    if name in _MATS:
        return _MATS[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = hex_rgb(hexcol)
    b.inputs["Roughness"].default_value = rough
    if "Specular IOR Level" in b.inputs:
        b.inputs["Specular IOR Level"].default_value = 0.25 + sheen
    if grain:
        n = nt.nodes.new("ShaderNodeTexNoise")
        n.inputs["Scale"].default_value = 120
        n.inputs["Detail"].default_value = 8
        r = nt.nodes.new("ShaderNodeValToRGB")
        r.color_ramp.elements[0].color = (max(0.0, rough - grain),) * 3 + (1,)
        r.color_ramp.elements[1].color = (min(1.0, rough + grain),) * 3 + (1,)
        nt.links.new(n.outputs["Fac"], r.inputs["Fac"])
        nt.links.new(r.outputs["Color"], b.inputs["Roughness"])
    _MATS[name] = m
    return m


def mottle(name, hex_a, hex_b, rough=0.93, scale_lo=0.9, scale_hi=26.0):
    """Two-tone ground cover. An unvarying surface reads as plastic however
    good the geometry is; real flocking and static grass are always mottled.
    Large-scale patchiness plus a fine fibrous break-up."""
    if name in _MATS:
        return _MATS[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Roughness"].default_value = rough
    lo = nt.nodes.new("ShaderNodeTexNoise")
    lo.inputs["Scale"].default_value = scale_lo
    lo.inputs["Detail"].default_value = 6
    hi = nt.nodes.new("ShaderNodeTexNoise")
    hi.inputs["Scale"].default_value = scale_hi
    hi.inputs["Detail"].default_value = 10
    hi.inputs["Roughness"].default_value = 0.8
    mixf = nt.nodes.new("ShaderNodeMix")
    mixf.data_type = "FLOAT"
    mixf.inputs[0].default_value = 0.42
    nt.links.new(lo.outputs["Fac"], mixf.inputs[2])
    nt.links.new(hi.outputs["Fac"], mixf.inputs[3])
    r = nt.nodes.new("ShaderNodeValToRGB")
    r.color_ramp.elements[0].position = 0.34
    r.color_ramp.elements[1].position = 0.66
    r.color_ramp.elements[0].color = hex_rgb(hex_a)
    r.color_ramp.elements[1].color = hex_rgb(hex_b)
    nt.links.new(mixf.outputs[0], r.inputs["Fac"])
    nt.links.new(r.outputs["Color"], b.inputs["Base Color"])
    _MATS[name] = m
    return m


ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")


_MANIFEST_CACHE = None

def _color_mean(slot):
    """The substrate's scene-linear mean, measured at download time by
    render/tools/measure_means.py. None when it hasn't been measured — in which
    case the blend falls back to a plain multiply rather than guessing, because
    a wrong normalisation is worse than none."""
    global _MANIFEST_CACHE
    if _MANIFEST_CACHE is None:
        path = os.path.join(ASSETS, "manifest.json")
        try:
            with open(path) as f:
                man = json.load(f)
            _MANIFEST_CACHE = {}
            for e in man.get("materials", []):
                v = e.get("colorMean")
                if isinstance(v, (int, float)):     # legacy scalar -> grey triple
                    v = [float(v)] * 3
                _MANIFEST_CACHE[e["slot"]] = v
        except (OSError, ValueError):
            _MANIFEST_CACHE = {}
    return _MANIFEST_CACHE.get(slot)


def _maps(slot):
    """Find a downloaded PBR set by slot name, or return {} if it isn't there."""
    d = os.path.join(ASSETS, "materials", slot)
    if not os.path.isdir(d):
        return {}
    found = {}
    for name in os.listdir(d):
        low = name.lower()
        for key, token in (("color", "_color."), ("rough", "_roughness."),
                           ("normal", "_normalgl."), ("disp", "_displacement.")):
            if token in low:
                found[key] = os.path.join(d, name)
    return found


def textured(name, slot, fallback_hex, scale=1.0, rough=0.70, grain=0.0,
              tint=None, grain_strength=0.45):
    """A scanned PBR material if its set has been downloaded, the procedural
    `paint` recipe if not. Every surface in every scene goes through here, so
    the pipeline renders identically-structured frames with or without assets —
    the textures are an upgrade, never a dependency.

    `tint` turns one scanned wood into seven painted finishes: the paint gives
    the colour, the scan gives the grain. See the blend below for why the
    substrate is normalised first and why the mean has to be a linear one.
    `grain_strength` dials how much substrate shows through without moving the
    surface's mean brightness.
    """
    if name in _MATS:
        return _MATS[name]
    maps = _maps(slot)
    if not maps.get("color"):
        return paint(name, fallback_hex, rough=rough, grain=grain)

    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]

    coords = nt.nodes.new("ShaderNodeTexCoord")
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (scale, scale, scale)
    nt.links.new(coords.outputs["Object"], mapping.inputs["Vector"])

    def image(path, non_color):
        t = nt.nodes.new("ShaderNodeTexImage")
        t.image = bpy.data.images.load(path, check_existing=True)
        if non_color:
            t.image.colorspace_settings.name = "Non-Color"
        nt.links.new(mapping.outputs["Vector"], t.inputs["Vector"])
        return t

    col = image(maps["color"], False)
    if tint:
        # THE PAINT BLEND. A straight multiply of tint x substrate returns the
        # palette colour DARKENED by the substrate's own brightness, so the
        # textured path lands well under the procedural one (this is what put
        # the town's walls ~7.5x under their intended value). Paint on wood
        # should take its COLOUR from the paint and only its GRAIN from the
        # wood, so the substrate is first normalised to mean 1.
        #
        # The mean must be the SCENE-LINEAR one. An 8-bit map stores sRGB and
        # Blender converts before Base Color; the two means differ by 1.6x-5.2x
        # across our set. Normalising by the stored mean under-corrects by
        # exactly that factor and reads as "the fix partly worked" — which is
        # how this presented the first time round. render/tools/measure_means.py
        # writes the right number into the manifest.
        mean = _color_mean(slot)
        src = col.outputs["Color"]
        if mean:
            # PER-CHANNEL. A single scalar fixes brightness and leaves hue, so a
            # warm plank scan tinted pale grey still renders as warm planks —
            # which is exactly what the first version of this did, while passing
            # a luminance-only parity check. Dividing each channel by its own
            # mean neutralises the substrate to grey; the tint then owns colour
            # outright and the scan contributes variation and nothing else.
            norm = nt.nodes.new("ShaderNodeVectorMath")
            norm.operation = "MULTIPLY"
            norm.inputs[1].default_value = tuple(1.0 / max(c, 1e-4) for c in mean)
            nt.links.new(src, norm.inputs[0])
            # `grain_strength` dials how much of the wood shows through, and it
            # is MEAN-PRESERVING by construction: mix(white, normalised, f) has
            # mean 1 at every f, so this moves texture and never brightness.
            # Measured across f = 0.00 / 0.15 / 0.30 / 0.45 the parity drift is
            # identical to the decimal — which is the design working, not the
            # parameter being inert. It costs nothing against colour fidelity,
            # so set it for how the surface should look.
            lerp = nt.nodes.new("ShaderNodeMix")
            lerp.data_type = "RGBA"
            lerp.inputs[0].default_value = grain_strength
            lerp.inputs[6].default_value = (1.0, 1.0, 1.0, 1.0)
            nt.links.new(norm.outputs[0], lerp.inputs[7])
            src = lerp.outputs[2]

        mix = nt.nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.blend_type = "MULTIPLY"
        mix.inputs[0].default_value = 1.0
        nt.links.new(src, mix.inputs[6])
        mix.inputs[7].default_value = hex_rgb(tint)
        # Albedo above 1 is unphysical; a bright fleck of normalised grain can
        # reach it. Clamp rather than lower `grain` — clamping bites a handful
        # of pixels, lowering grain costs the whole surface its texture.
        clamp = nt.nodes.new("ShaderNodeVectorMath")
        clamp.operation = "MINIMUM"
        clamp.inputs[1].default_value = (1.0, 1.0, 1.0)
        nt.links.new(mix.outputs[2], clamp.inputs[0])
        nt.links.new(clamp.outputs[0], b.inputs["Base Color"])
    else:
        nt.links.new(col.outputs["Color"], b.inputs["Base Color"])

    if maps.get("rough"):
        nt.links.new(image(maps["rough"], True).outputs["Color"], b.inputs["Roughness"])
    else:
        b.inputs["Roughness"].default_value = rough

    if maps.get("normal"):
        nrm = nt.nodes.new("ShaderNodeNormalMap")
        nrm.inputs["Strength"].default_value = 0.8
        nt.links.new(image(maps["normal"], True).outputs["Color"], nrm.inputs["Color"])
        nt.links.new(nrm.outputs["Normal"], b.inputs["Normal"])

    _MATS[name] = m
    return m


def hdri(slot, strength=1.0, rotation_deg=0.0, backdrop="#8fa3b8"):
    """Use a downloaded HDRI as the world. Returns False if it isn't there, so
    a caller can fall back to the analytic sky without branching on files.

    The HDRI lights the scene but is HIDDEN from camera rays, with `backdrop`
    shown instead. A captured environment is a photograph of somewhere else —
    left visible it puts that place's skyline behind our ridges, which is both
    an obvious artifact and a quiet way to import someone else's location into
    a world we are supposed to be building. We want its light, not its horizon.
    Pass backdrop=None to show the HDRI itself.
    """
    d = os.path.join(ASSETS, "hdris", slot)
    if not os.path.isdir(d):
        return False
    files = [f for f in os.listdir(d) if f.lower().endswith((".hdr", ".exr"))]
    if not files:
        return False
    world = bpy.data.worlds.new("w")
    bpy.context.scene.world = world
    world.use_nodes = True
    nt = world.node_tree
    env = nt.nodes.new("ShaderNodeTexEnvironment")
    env.image = bpy.data.images.load(os.path.join(d, files[0]), check_existing=True)
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Rotation"].default_value = (0, 0, math.radians(rotation_deg))
    coords = nt.nodes.new("ShaderNodeTexCoord")
    nt.links.new(coords.outputs["Generated"], mapping.inputs["Vector"])
    nt.links.new(mapping.outputs["Vector"], env.inputs["Vector"])
    bg = nt.nodes["Background"]
    nt.links.new(env.outputs["Color"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = strength

    if backdrop is not None:
        plain = nt.nodes.new("ShaderNodeBackground")
        plain.inputs["Color"].default_value = hex_rgb(backdrop)
        plain.inputs["Strength"].default_value = strength * 0.55
        lp = nt.nodes.new("ShaderNodeLightPath")
        mix = nt.nodes.new("ShaderNodeMixShader")
        nt.links.new(lp.outputs["Is Camera Ray"], mix.inputs[0])
        nt.links.new(bg.outputs["Background"], mix.inputs[1])    # lighting path
        nt.links.new(plain.outputs["Background"], mix.inputs[2])  # what the camera sees
        out = nt.nodes["World Output"]
        nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])
    return True


def obj(prim, material, loc, scale=(1, 1, 1), rot=(0, 0, 0), smooth=False, **kw):
    """Add a primitive with a material. The whole modelling vocabulary."""
    getattr(bpy.ops.mesh, prim)(location=loc, **kw)
    o = bpy.context.object
    o.scale = scale
    o.rotation_euler = rot
    o.data.materials.append(material)
    if smooth:
        bpy.ops.object.shade_smooth()
    return o


# ----------------------------------------------------------------- light ----

def daylight(sun_energy=4.4, elevation_deg=38.0, azimuth_deg=-124.0,
             sky_strength=0.30, warm=(1.0, 0.87, 0.68), sky_color=None):
    """One sun, one sky. `elevation_deg` is the sun's height above the horizon.

    The three palette variants the art plan asks of the town master (day / dusk
    / night) are three calls to this function over identical geometry — which
    is why they can be guaranteed to be the same town, rather than hoped to be.
    """
    sun = bpy.data.lights.new("sun", "SUN")
    sun.energy = sun_energy
    sun.angle = math.radians(4.0)      # a soft-edged shadow; a hard one reads as CG
    sun.color = warm
    so = bpy.data.objects.new("sun", sun)
    bpy.context.collection.objects.link(so)
    so.rotation_euler = (math.radians(90.0 - elevation_deg), math.radians(6),
                         math.radians(azimuth_deg))

    world = bpy.data.worlds.new("w")
    bpy.context.scene.world = world
    world.use_nodes = True
    nt = world.node_tree
    if sky_color is not None:
        # A physical sky at any sun elevation is a DAY sky; night needs the
        # dome replaced, not merely dimmed, or the frame reads as noon with the
        # lights on. (It did. That is how this parameter came to exist.)
        nt.nodes["Background"].inputs["Color"].default_value = hex_rgb(sky_color)
        nt.nodes["Background"].inputs["Strength"].default_value = sky_strength
        return so
    sky = nt.nodes.new("ShaderNodeTexSky")
    sky.sky_type = "MULTIPLE_SCATTERING"
    sky.sun_elevation = math.radians(elevation_deg)
    sky.sun_rotation = math.radians(azimuth_deg + 338)
    sky.altitude = 420
    for n, v in (("air_density", 1.6), ("dust_density", 2.2)):
        if hasattr(sky, n):
            setattr(sky, n, v)
    nt.links.new(sky.outputs["Color"], nt.nodes["Background"].inputs["Color"])
    nt.nodes["Background"].inputs["Strength"].default_value = sky_strength
    return so


def studio(key_energy=420, fill_energy=70):
    """The close-up rig for a single figure on a surface — key plus cool fill."""
    key = bpy.data.lights.new("key", "AREA")
    key.energy = key_energy
    key.size = 2.6
    key.color = (1.0, 0.94, 0.84)
    ko = bpy.data.objects.new("key", key)
    bpy.context.collection.objects.link(ko)
    ko.location = (2.1, -2.0, 2.9)
    ko.rotation_euler = (math.radians(40), 0, math.radians(46))

    fill = bpy.data.lights.new("fill", "AREA")
    fill.energy = fill_energy
    fill.size = 3.4
    fill.color = (0.70, 0.79, 1.0)
    fo = bpy.data.objects.new("fill", fill)
    bpy.context.collection.objects.link(fo)
    fo.location = (-2.6, -1.2, 1.5)
    fo.rotation_euler = (math.radians(68), 0, math.radians(-58))

    bpy.context.scene.world = bpy.data.worlds.new("w")
    bpy.context.scene.world.use_nodes = True
    bpy.context.scene.world.node_tree.nodes["Background"].inputs[0].default_value = \
        (0.035, 0.036, 0.042, 1)


# ---------------------------------------------------------------- camera ----

class CameraGuardError(AssertionError):
    """Raised when a shot violates the ledger's camera guard."""


def camera(location, target, lens=42, fstop=0.32, focus_bias=0.62,
           max_height=None, guard_note=""):
    """THE camera. Two things are load-bearing and both are single numbers:

    `fstop` — a physically absurd aperture is what makes the eye read 'a small
    object photographed close' rather than 'a large scene rendered'. It is the
    entire miniature illusion, and because it lives here it is identical on
    every asset this project ever produces.

    `max_height` — the ledger's camera guard, as an assertion instead of a
    review note: shot from within the world, never above it. A scene that puts
    the camera over the ceiling fails at render time rather than at art review.
    """
    location = Vector(location)
    target = Vector(target)
    if max_height is not None and location.z >= max_height:
        raise CameraGuardError(
            f"camera z={location.z:.2f} >= {max_height:.2f} — the god's-eye shot "
            f"the presentation guards forbid. {guard_note}")
    cd = bpy.data.cameras.new("cam")
    cd.lens = lens
    cd.dof.use_dof = True
    cd.dof.aperture_fstop = fstop
    cam = bpy.data.objects.new("cam", cd)
    bpy.context.collection.objects.link(cam)
    cam.location = location
    look = target - location
    cam.rotation_euler = look.to_track_quat("-Z", "Y").to_euler()
    cd.dof.focus_distance = look.length * focus_bias
    bpy.context.scene.camera = cam
    print(f"  camera ok · z={location.z:.2f} · focus {cd.dof.focus_distance:.1f}m · f/{fstop}")
    return cam


# ---------------------------------------------------------------- render ----

def render(filepath, res=(1024, 576), samples=96, exposure=-1.85,
           look="AgX - Medium High Contrast"):
    """Deterministic render. Same script + same seed => the same PNG, every
    time, on any machine — which makes an asset a build artifact that can be
    reviewed in a diff instead of a file someone has to remember how to remake.

    `exposure` matters more than it looks: AgX desaturates as values approach
    white, so a frame sitting high on the curve bleaches a palette that is not
    actually pale. When colour looks washed, drop exposure before touching hue.
    """
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.view_settings.look = look
    sc.view_settings.exposure = exposure
    sc.render.filepath = filepath
    bpy.ops.render.render(write_still=True)
    print(f"  wrote {filepath}")
    return filepath
