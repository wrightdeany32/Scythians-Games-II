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
import math
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
