"""Build original SPACEFOLIO meshes, diffuse-light atlas and editable source.

Blender runs this file with --background --factory-startup --python build.py -- ...
All modelling coordinates use the web scene's X-right/Y-up/Z-front convention.
"""
import argparse
import json
import math
import sys
from pathlib import Path
import bpy
from mathutils import Matrix, Vector

parser = argparse.ArgumentParser()
parser.add_argument('--config', required=True)
parser.add_argument('--output', default='public/models/spacefolio.glb')
parser.add_argument('--atlas', type=int, default=2048)
parser.add_argument('--samples', type=int, default=32)
parser.add_argument('--device', choices=['HIP', 'CPU'], default='HIP')
parser.add_argument('--preview', action='store_true')
args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:])
bpy.context.preferences.filepaths.save_version = 0
config = json.loads(Path(args.config).read_text(encoding='utf-8-sig'))
output = Path(args.output).resolve()
source = Path(__file__).resolve().parent
output.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
parts = {}
current = []
basis = Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1)))


def point(p):
    return Vector((p[0], -p[2], p[1]))


def rotation(r):
    return basis @ (Matrix.Rotation(r[0], 4, 'X') @ Matrix.Rotation(r[1], 4, 'Y') @ Matrix.Rotation(r[2], 4, 'Z')) @ basis.inverted()


def linear(c):
    v = [int(c[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple(x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in v)


def mat(name, color, metal=0, rough=.55, emission=0):
    material = bpy.data.materials.new(name)
    bsdf = material.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*linear(color), 1)
    bsdf.inputs['Metallic'].default_value = metal
    bsdf.inputs['Roughness'].default_value = rough
    if emission:
        bsdf.inputs['Emission Color'].default_value = (*linear(color), 1)
        bsdf.inputs['Emission Strength'].default_value = emission
    return material


m = {
    'hull': mat('Ceramic hull', '#778490'),
    'dark': mat('Deep blue graphite', config['colors']['dark'], .08),
    'steel': mat('Brushed titanium', config['colors']['steel'], .22, .35),
    'white': mat('Porcelain casing', config['colors']['white'], .12, .32),
    'bronze': mat('Champagne anodised trim', '#b99461', .22, .38),
    'desk': mat('Warm grey composite', '#b2b9bc', 0, .68),
    'floor': mat('Blue grey deck', '#394957'),
    'fabric': mat('Woven upholstery', '#485963', 0, .9),
    'rubber': mat('Soft graphite', '#18232c', 0, .76),
    'leaf': mat('Sage foliage', '#6a8654', 0, .72),
    'leafLight': mat('Young sage foliage', '#91a66a', 0, .7),
    'soil': mat('Planter charcoal', '#26372d'),
    'paper': mat('Ivory pages', '#e9dfc2', 0, .85),
    'book': mat('Navy book cloth', '#30485d'),
    'amber': mat('Amber marking', '#ffc37c', .1, .4, .6),
    'blue': mat('Ice blue indicators', '#a8e1e8', .1, .26, .8),
    'glass': mat('Ink blue glass', '#102d3d', .35, .17),
}


def finish(obj, material, p=(0, 0, 0), r=(0, 0, 0), smooth=False):
    obj.data.materials.append(m[material] if isinstance(material, str) else material)
    obj.matrix_world = Matrix.Translation(point(p)) @ rotation(r) @ obj.matrix_world
    if smooth:
        for poly in obj.data.polygons:
            poly.use_smooth = True
    current.append(obj)
    return obj


def box(size, p=(0, 0, 0), material='dark', bevel=.06, r=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add()
    obj = bpy.context.object
    obj.dimensions = (size[0], size[2], size[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        mod = obj.modifiers.new('Manufactured edge radii', 'BEVEL')
        mod.width = min(bevel, min(size) * .47)
        mod.segments = 5
        bpy.ops.object.modifier_apply(modifier=mod.name)
        normal = obj.modifiers.new('Surface normals', 'WEIGHTED_NORMAL')
        normal.keep_sharp = True
        bpy.ops.object.modifier_apply(modifier=normal.name)
    return finish(obj, material, p, r, True)


def cylinder(radius, height, p=(0, 0, 0), material='steel', top=None, r=(0, 0, 0), vertices=48):
    bpy.ops.mesh.primitive_cone_add(vertices=vertices, radius1=radius, radius2=radius if top is None else top, depth=height)
    obj = bpy.context.object
    mod = obj.modifiers.new('Edge glints', 'BEVEL')
    mod.width = min(.015, height * .2, radius * .1)
    mod.segments = 3
    bpy.ops.object.modifier_apply(modifier=mod.name)
    return finish(obj, material, p, r, True)


def orb(size, p=(0, 0, 0), material='white', r=(0, 0, 0)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=40, ring_count=24)
    obj = bpy.context.object
    obj.scale = (size[0], size[2], size[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, material, p, r, True)


def mesh(vertices, faces, material='dark', smooth=False):
    data = bpy.data.meshes.new('Precision surface')
    data.from_pydata([point(v) for v in vertices], [], faces)
    data.update()
    obj = bpy.data.objects.new('Surface', data)
    bpy.context.collection.objects.link(obj)
    return finish(obj, material, smooth=smooth)


def ring(radius, tube, p=(0, 0, 0), material='bronze', r=(0, 0, 0)):
    vertices = []
    for i in range(64):
        a = math.tau * i / 64
        for j in range(12):
            b = math.tau * j / 12
            vertices.append(((radius + tube * math.cos(b)) * math.cos(a), (radius + tube * math.cos(b)) * math.sin(a), tube * math.sin(b)))
    obj = mesh(vertices, [(i * 12 + j, ((i + 1) % 64) * 12 + j, ((i + 1) % 64) * 12 + (j + 1) % 12, i * 12 + (j + 1) % 12) for i in range(64) for j in range(12)], material, True)
    obj.matrix_world = Matrix.Translation(point(p)) @ rotation(r)
    return obj


def tube(points, radius=.02, material='steel'):
    data = bpy.data.curves.new('Swept conduit', 'CURVE')
    data.dimensions = '3D'
    data.resolution_u = 12
    data.bevel_depth = radius
    data.bevel_resolution = 3
    spline = data.splines.new('BEZIER')
    spline.bezier_points.add(len(points) - 1)
    for node, p in zip(spline.bezier_points, points):
        node.co = point(p)
        node.handle_left_type = node.handle_right_type = 'AUTO'
    obj = bpy.data.objects.new('Conduit', data)
    bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.convert(target='MESH')
    return finish(bpy.context.object, material, smooth=True)


def transform_new(start, p, r=(0, 0, 0)):
    matrix = Matrix.Translation(point(p)) @ rotation(r)
    for obj in current[start:]:
        obj.matrix_world = matrix @ obj.matrix_world


def part(name):
    bpy.ops.object.select_all(action='DESELECT')
    for obj in current:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = current[0]
    bpy.ops.object.join()
    obj = bpy.context.object
    bpy.context.scene.cursor.location = (0, 0, 0)
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
    obj.name = obj.data.name = name
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=.004)
    bpy.ops.object.mode_set(mode='OBJECT')
    parts[name] = obj
    current.clear()
    return obj


# Static cabin: large, softly machined surfaces with actual inset panel details.
box((14, .22, 10), (0, -.22, 0), 'floor', .08)
for x in [-5.5, -3.7, -1.85, 0, 1.85, 3.7, 5.5]:
    box((.016, .008, 9.5), (x, -.102, .1), 'steel', .002)
cylinder(2.7, .035, (0, -.075, 1.7), 'fabric', vertices=96)
ring(2.55, .012, (0, -.05, 1.7), 'bronze', (-math.pi / 2, 0, 0))
for side in [-1, 1]:
    box((1.4, 6.8, .7), (side * 6.4, 3.2, -4.12), 'hull', .16)
    box((.5, 6.4, 4.5), (side * 6.65, 3, -1.5), 'dark', .18)
    box((1.6, 5.5, .8), (side * 5.75, 3, -2.65), 'hull', .25, (0, -side * .3, 0))
    box((1.28, 4.65, .035), (side * 5.75, 3, -2.2), 'dark', .012, (0, -side * .3, 0))
    for i in range(6):
        box((.65, .035, .15), (side * 6.12, 1.2 + i * .58, -1.94), 'steel', .01)
    box((1.8, .2, 3.5), (side * 5.25, 5.98, -1.3), 'steel', .075, (0, 0, side * .34))
    box((.9, .055, .09), (side * 5.45, 5.35 if side < 0 else 4.85, -1.94), 'amber', .018)
    tube([(side * 5.84, .3, -1.2), (side * 5.84, 2, -1.2), (side * 5.5, 4.8, -1.7), (side * 4.8, 6, -2)], .04)
box((12, 1.1, .8), (0, 6.65, -4), 'dark', .18)
box((11, 1.7, .7), (0, .75, -3.8), 'dark', .16)
window = [(-4.9, 1.9, -3.8), (-5.05, 2.6, -3.8), (-4.7, 4.7, -3.8), (-3.9, 5.6, -3.8), (0, 5.9, -3.8), (3.9, 5.6, -3.8), (4.7, 4.7, -3.8), (5.05, 2.6, -3.8), (4.9, 1.9, -3.8), (0, 1.82, -3.8), (-4.9, 1.9, -3.8)]
tube(window, .24, 'steel')
tube([(x, y, z + .1) for x, y, z in window], .09, 'rubber')
tube([(x * 1.036, y * 1.014, z - .03) for x, y, z in window], .035, 'bronze')
for x in [-3.5, -1.7, 0, 1.7, 3.5]:
    box((.065, .16, .08), (x, 5.92 - abs(x) * .035, -3.54), 'bronze', .018)

# Curved desk from the original front and rear contours, extruded with soft edges.
front = []
for i in range(65):
    x = -5.65 + 11.3 * i / 64
    z = -.65 + 1.28 * (abs(x) / 5.65) ** 1.8
    front.append((x, z))
outline = front + [(5.75, -2.9), (3, -3.2), (0, -3.35), (-3, -3.2), (-5.75, -2.9)]
n = len(outline)
vertices = [(x, y, z) for y in [1.91, 2.09] for x, z in outline]
obj = mesh(vertices, [tuple(reversed(range(n))), tuple(range(n, n * 2))] + [(i, (i + 1) % n, (i + 1) % n + n, i + n) for i in range(n)], 'desk')
bpy.context.view_layer.objects.active = obj
mod = obj.modifiers.new('Desk edge', 'BEVEL'); mod.width = .055; mod.segments = 5
bpy.ops.object.modifier_apply(modifier=mod.name)
tube([(x, 1.985, z + .018) for x, z in front[::8]], .018, 'amber')
for x in [-4.8, -3, 3, 4.8]:
    box((1.3, 1.55, 1.25), (x, 1, .3), 'dark', .11)
    for y, h in [(1.25, .65), (.62, .45)]:
        box((1.08, h, .08), (x, y, .95), 'hull', .035)
        box((.86, h - .12, .025), (x, y, 1.002), 'dark', .01)
    box((.67, .04, .05), (x, 1.52, 1.02), 'amber', .012)
    box((.4, .035, .06), (x, .81, 1.02), 'steel', .01)
    for sign in [-1, 1]:
        cylinder(.022, .01, (x + sign * .46, 1.43, 1.01), 'bronze', r=(math.pi / 2, 0, 0), vertices=16)
for side in [-1, 1]:
    for i in range(7):
        box((.1, .035, .055), (side * 2 + i * .18, 2.11, -2.65), 'amber' if i % 3 else 'steel', .01)
cylinder(1.28, .13, (0, 6.25, -.8), 'dark', vertices=96)
cylinder(1.1, .06, (0, 6.15, -.8), 'amber', vertices=96)
ring(.98, .025, (0, 6.1, -.8), 'bronze', (-math.pi / 2, 0, 0))

# Planters with thick, curved lanceolate leaves instead of ellipsoid primitives.
for p, scale in [((-5.7, 0, 2.7), 1.3), ((5.8, 0, 2.8), 1.1)]:
    start = len(current)
    cylinder(.36, .65, (0, .33, 0), 'hull', top=.48)
    ring(.46, .025, (0, .66, 0), 'bronze', (-math.pi / 2, 0, 0))
    cylinder(.44, .025, (0, .66, 0), 'soil')
    for i in range(14):
        a = i * 2.4
        height = .8 + (i % 7) * .15
        radial = .5 + (i % 3) * .07
        tube([(0, .65, 0), (math.sin(a) * radial * .5, height, math.cos(a) * radial * .5), (math.sin(a) * radial, height + .28, math.cos(a) * radial)], .014, 'leaf')
        verts = []
        for j in range(17):
            t = j / 16
            width = .17 * math.sin(math.pi * t) ** .7
            reach = radial * t
            for edge in [-1, 0, 1]:
                verts.append((math.sin(a) * reach + math.cos(a) * width * edge, .72 + height * t + .16 * math.sin(math.pi * t) + (.035 if edge == 0 else 0), math.cos(a) * reach - math.sin(a) * width * edge))
        leaf = mesh(verts, [(j * 3 + k, (j + 1) * 3 + k, (j + 1) * 3 + k + 1, j * 3 + k + 1) for j in range(16) for k in range(2)], 'leafLight' if i % 4 == 0 else 'leaf', True)
        bpy.context.view_layer.objects.active = leaf
        solid = leaf.modifiers.new('Leaf thickness', 'SOLIDIFY'); solid.thickness = .009
        bpy.ops.object.modifier_apply(modifier=solid.name)
    matrix = Matrix.Translation(point(p)) @ Matrix.Diagonal((scale, scale, scale, 1))
    for item in current[start:]:
        item.matrix_world = matrix @ item.matrix_world
part('CabinShell')

# Command console is one enclosed wedge seated on the desktop.
profile = [(-.5, 0), (.5, 0), (.5, 1.24), (-.5, .4)]
verts = [(x, 2.025 + y, -1.96 - z) for x in [-1.525, 1.525] for z, y in profile]
mesh(verts, [(3, 2, 1, 0), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)], 'dark')
box((2.84, 1.14, .045), (0, 2.865, -1.94), 'rubber', .02, (-.872, 0, 0))
for side in [-1, 1]:
    for i in range(9):
        box((.05, .16, .022), (side * 1.49, 2.25, -1.7 - i * .055), 'steel', .006)
part('ConsoleBody')

# Chair remains independent so its source stays editable.
cylinder(.62, .12, (0, .12, .95), 'dark')
cylinder(.12, .65, (0, .48, .95), 'steel')
box((1.35, .28, 1.2), (0, .88, .95), 'dark', .13)
box((1.38, 1.38, .34), (0, 1.35, 1.45), 'dark', .16, (-.12, 0, 0))
box((1.12, 1.1, .12), (0, 1.39, 1.63), 'fabric', .055, (-.12, 0, 0))
for x in [-.35, -.18, 0, .18, .35]:
    box((.014, .8, .009), (x, 1.36, 1.698), 'steel', .003)
for side in [-1, 1]:
    cylinder(.055, .6, (side * .77, 1, 1.05), 'steel')
    box((.23, .17, .95), (side * .77, 1.15, .95), 'fabric', .07)
part('Chair')

# Flight-log frame.
box((1.65, 1.7, .18), material='bronze', bevel=.075)
box((1.55, 1.6, .08), (0, 0, .11), 'dark', .035)
for side in [-1, 1]:
    for y in [-.72, .72]:
        cylinder(.024, .012, (side * .72, y, .162), 'steel', r=(math.pi / 2, 0, 0), vertices=16)
part('RoadmapFrame')

cylinder(.53, .13, material='dark')
cylinder(.45, .06, (0, .09, 0), 'bronze')
ring(.36, .025, (0, .13, 0), 'amber', (-math.pi / 2, 0, 0))
part('RocketBase')
rocket_profile = [(.12, .22), (.19, .35), (.245, .55), (.25, .95), (.23, 1.18), (.17, 1.4), (.065, 1.58), (0, 1.66)]
verts = [(radius * math.cos(math.tau * j / 64), y, radius * math.sin(math.tau * j / 64)) for radius, y in rocket_profile for j in range(64)]
mesh(verts, [(i * 64 + j, i * 64 + (j + 1) % 64, (i + 1) * 64 + (j + 1) % 64, (i + 1) * 64 + j) for i in range(len(rocket_profile) - 1) for j in range(64)], 'white', True)
for a in [0, math.pi / 2, math.pi, math.pi * 1.5]:
    start = len(current)
    fin = mesh([(.17, .37, -.04), (.17, .81, -.04), (.42, .18, -.04), (.34, .12, -.04), (.17, .37, .04), (.17, .81, .04), (.42, .18, .04), (.34, .12, .04)], [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)], 'steel')
    transform_new(start, (0, 0, 0), (0, a, 0))
ring(.113, .024, (0, .85, .245), 'bronze')
orb((.09, .09, .027), (0, .85, .254), 'glass')
cylinder(.105, .14, (0, .24, 0), 'dark')
ring(.247, .009, (0, 1.01, 0), 'bronze', (-math.pi / 2, 0, 0))
part('RocketBody')

box((1.06, .09, .84), material='dark', bevel=.04)
box((.18, .73, .15), (0, .4, -.15), 'steel', .035, (.38, 0, 0))
box((.14, .35, .12), (0, .23, .3), 'steel', .025)
box((.97, 1.08, .06), (0, .85, -.12), 'steel', .025, (-.6, -.08, -.06))
box((1.02, .08, .16), (0, .4, .32), 'bronze', .025)
part('Lectern')
box((.88, 1.02, .11), material='book', bevel=.035)
box((.77, .91, .09), (0, 0, .08), 'paper', .015)
box((.15, .3, .07), (.45, 0, .23), 'steel', .025)
part('BookBase')
box((.88, 1.02, .07), (.44, 0, 0), 'book', .025)
ring(.12, .019, (.44, .12, .043), 'bronze')
box((.15, .035, .015), (.44, -.13, .045), 'bronze', .005)
box((.36, .022, .015), (.44, -.3, .045), 'steel', .005)
part('BookCover')
box((.76, .9, .009), (.38, 0, 0), 'paper', .003)
for y in [.24, .15, .06, -.03, -.12]:
    box((.48, .008, .003), (.38, y, .008), 'bronze', .001)
part('BookPage')

box((1.08, 1.06, .13), material='bronze', bevel=.045)
box((.94, .92, .05), (0, 0, .08), 'dark', .02)
part('MedalFrame')
cylinder(.4, .085, material='bronze', r=(math.pi / 2, 0, 0))
ring(.36, .025, (0, 0, .06), 'amber')
box((.29, .13, .035), (0, .075, .12), 'bronze', .008, (0, 0, .35))
box((.22, .14, .05), (0, -.06, .13), 'bronze', .015)
for side in [-1, 1]:
    for i in range(6):
        orb((.025, .055, .014), (side * (.22 + math.sin(i * .5) * .025), -.2 + i * .075, .07), 'amber', (0, 0, side * (.3 + i * .12)))
part('MedalFace')

box((1.6, .16, 1), material='dark')
start = len(current)
box((1.6, 1.04, .15), material='bronze', bevel=.065)
box((1.5, .94, .09), (0, 0, .08), 'rubber', .035)
transform_new(start, (0, .6, -.25), (-.25, 0, 0))
for x in [-.5, 0, .5]:
    box((.15, .03, .06), (x, .1, .37), 'blue' if x == 0 else 'amber', .01)
part('TechBase')
ring(.235, .035, material='blue')
ring(.12, .023, material='blue')
for i in range(12):
    a = i * math.tau / 12
    box((.09, .1, .035), (-math.sin(a) * .26, math.cos(a) * .26, 0), 'blue', .015, (0, 0, a))
part('TechGear')

box((.58, 1.48, .18), material='bronze', bevel=.065)
box((.45, 1.36, .12), (0, 0, .12), 'dark', .045)
box((.035, .68, .04), (.2, 0, .2), 'amber', .015)
for i in range(9):
    box((.042, .045, .025), (.13 + (i % 3) * .055, -.28 - (i // 3) * .075, .21), 'steel', .01)
helix = [(.09 + math.sin(i / 179 * math.pi * 42) * .055, -.68 - i / 179 * .62, math.cos(i / 179 * math.pi * 42) * .035 + .1) for i in range(180)]
tube(helix, .014, 'rubber')
tube([(.09, -1.3, .1), (.12, -1.43, .1), (.27, -1.3, .1), (.27, -.5, .05)], .015, 'rubber')
part('PhoneBase')
box((.2, .72, .15), (-.06, 0, .12), 'rubber', .07)
for sign in [-1, 1]:
    box((.31, .3, .26), (-.06, sign * .47, .14), 'dark', .1)
    for i in [-1, 0, 1]:
        box((.14, .018, .01), (-.06, sign * .47 + i * .035, .275), 'steel', .005)
part('PhoneReceiver')

# Articulated robot parts preserve the original pivots and move as rigid shells.
orb((.36, .23, .27), (0, .97, 0), 'rubber')
box((.76, .72, .5), (0, 1.39, 0), 'white', .19)
box((.51, .36, .035), (0, 1.4, .266), 'steel', .015)
ring(.08, .017, (0, 1.5, .29), 'amber')
box((.46, .27, .04), (0, 1.43, -.265), 'steel', .015)
for i in [-1, 0, 1]:
    box((.3, .022, .02), (0, 1.35 + i * .055, -.3), 'rubber', .005)
cylinder(.14, .24, (0, 1.88, 0), 'rubber')
for side in [-1, 1]:
    cylinder(.025, .01, (side * .28, 1.16, .26), 'bronze', r=(math.pi / 2, 0, 0), vertices=16)
part('RobotTorso')
box((1.13, .89, .85), material='white', bevel=.28)
box((1.01, .72, .17), (0, -.015, .395), 'steel', .075)
box((.91, .6, .07), (0, -.018, .495), 'glass', .032)
for side in [-1, 1]:
    box((.075, .23, .04), (side * .23, -.005, .54), 'blue', .034)
    cylinder(.235, .09, (side * .6, 0, 0), 'steel', r=(0, 0, math.pi / 2))
    ring(.175, .023, (side * .66, 0, 0), 'amber', (0, math.pi / 2, 0))
box((.44, .23, .035), (0, -.07, -.438), 'steel', .015)
part('RobotHead')
for side, suffix in [(-1, 'L'), (1, 'R')]:
    orb((.17, .17, .17), material='rubber')
    box((.25, .44, .27), (side * .06, -.23, 0), 'white', .11)
    box((.06, .22, .02), (side * .06, -.23, .14), 'steel', .01)
    part('RobotUpperArm' + suffix)
    orb((.12, .12, .12), material='steel')
    box((.23, .36, .26), (0, -.2, .01), 'white', .09)
    box((.25, .18, .22), (0, -.47, .035), 'steel', .07)
    for i in [-1, 0, 1]:
        box((.052, .15, .07), (i * .073, -.59, .07), 'white', .023)
    part('RobotLowerArm' + suffix)
    orb((.19, .19, .19), material='rubber')
    box((.34, .43, .36), (0, -.23, 0), 'white', .13)
    box((.12, .17, .025), (0, -.23, .19), 'steel', .01)
    part('RobotThigh' + suffix)
    cylinder(.15, .34, material='steel', r=(0, 0, math.pi / 2))
    box((.34, .32, .35), (0, -.2, 0), 'white', .12)
    box((.4, .18, .55), (0, -.41, .09), 'white', .085)
    box((.4, .055, .53), (0, -.5, .09), 'rubber', .025)
    part('RobotShin' + suffix)

# Only these fixed pieces participate in the light bake. Animated geometry is
# hidden so its standing pose can never leave a permanent shadow in the atlas.
static_names = ['CabinShell', 'ConsoleBody', 'Chair']
for name, obj in parts.items():
    obj.hide_render = name not in static_names
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = args.samples
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 6
scene.world.color = (.25, .3, .4)
if args.device == 'HIP':
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'HIP'
    prefs.refresh_devices()
    assert any(d.type == 'HIP' for d in prefs.devices), 'No HIP device; rerun explicitly with --device CPU'
    for device in prefs.devices:
        device.use = device.type == 'HIP'
    scene.cycles.device = 'GPU'
else:
    scene.cycles.device = 'CPU'


def light(name, p, target, color, power, size):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = power
    data.color = linear(color)
    data.shape = 'DISK'
    data.size = size
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = point(p)
    obj.rotation_euler = (point(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()


light('Warm softbox', (-3, 8, 5), (0, 1, -1), '#ffe4c8', 1800, 7)
light('Window bounce', (2, 5, -6), (0, 2, 1), '#b2d6ff', 1700, 6)
light('Ceiling practical', (0, 5.9, -.8), (0, 1, 0), '#ffd294', 450, 2)
light('Port console accent', (-5, 3, 0), (-2, 1, -1), '#ffd59b', 130, 2)
light('Starboard fill', (5, 4, 2), (1, 2, -1), '#bedaff', 550, 4)

bpy.ops.object.select_all(action='DESELECT')
for name in static_names:
    parts[name].select_set(True)
bpy.context.view_layer.objects.active = parts['CabinShell']
# Pack UVs together across the separate static nodes into one atlas.
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.select_all(action='SELECT')
bpy.ops.uv.average_islands_scale()
bpy.ops.uv.pack_islands(rotate=True, margin=.004)
bpy.ops.object.mode_set(mode='OBJECT')
atlas = bpy.data.images.new('Cabin diffuse light atlas', width=args.atlas, height=args.atlas, alpha=False)
for name in static_names:
    for material in parts[name].data.materials:
        node = material.node_tree.nodes.new('ShaderNodeTexImage')
        node.image = atlas
        material.node_tree.nodes.active = node
scene.render.bake.margin = 6
scene.render.bake.use_clear = False
for name in static_names:
    bpy.ops.object.select_all(action='DESELECT')
    obj = parts[name]
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.bake(type='DIFFUSE', pass_filter={'DIRECT', 'INDIRECT', 'COLOR'})
atlas.filepath_raw = str(source / 'cabin-light.png')
atlas.file_format = 'PNG'
atlas.save()

# The exporter recognises a color connected directly to Surface as unlit.
# Never light the baked radiance a second time in the web renderer.
baked = bpy.data.materials.new('Cabin baked radiance')
nodes = baked.node_tree.nodes
nodes.clear()
tex = nodes.new('ShaderNodeTexImage'); tex.image = atlas
output_node = nodes.new('ShaderNodeOutputMaterial')
baked.node_tree.links.new(tex.outputs['Color'], output_node.inputs['Surface'])
for name in static_names:
    obj = parts[name]
    obj.data.materials.clear()
    obj.data.materials.append(baked)
    for poly in obj.data.polygons:
        poly.material_index = 0
for obj in parts.values():
    obj.hide_render = False
bpy.ops.object.select_all(action='DESELECT')
for obj in parts.values():
    obj.select_set(True)
bpy.context.view_layer.objects.active = parts['CabinShell']
bpy.ops.export_scene.gltf(filepath=str(output), export_format='GLB', use_selection=True, export_cameras=False, export_lights=False, export_yup=True)
atlas.pack()

# Lay out the editable source after export; GLB parts stay in local coordinates
# because the existing React groups own placement and animation pivots.
def tr(p=(0, 0, 0), r=(0, 0, 0)):
    return Matrix.Translation(point(p)) @ rotation(r)


positions = config['objectPositions']
placements = {
    'RoadmapFrame': tr(positions[0], (0, .23, 0)),
    'RocketBase': tr(positions[1]), 'RocketBody': tr(positions[1]),
    'Lectern': tr(positions[2]),
    'BookBase': tr(positions[2]) @ tr((0, .85, 0), (-.6, -.08, -.06)),
    'MedalFrame': tr(positions[3], (0, 1.05, 0)),
    'MedalFace': tr(positions[3], (0, 1.05, 0)) @ tr((0, 0, .15)) @ Matrix.Diagonal((.84, .84, .84, 1)),
    'TechBase': tr(positions[4]),
    'TechGear': tr(positions[4]) @ tr((0, .6, -.25), (-.25, 0, 0)) @ tr((0, 0, .16)),
    'PhoneBase': tr(positions[5], (0, -.3, 0)),
    'PhoneReceiver': tr(positions[5], (0, -.3, 0)) @ tr((0, 0, .12)),
}
placements['BookCover'] = placements['BookBase'] @ tr((-.44, 0, .19))
placements['BookPage'] = placements['BookBase'] @ tr((-.385, 0, .15))
root = tr((-1.4, 0, 2.15), (0, -.08, 0))
placements['RobotTorso'] = root
placements['RobotHead'] = root @ tr((0, 2.26, 0))
for side, suffix in [(-1, 'L'), (1, 'R')]:
    placements['RobotUpperArm' + suffix] = root @ tr((side * .43, 1.55, 0))
    placements['RobotLowerArm' + suffix] = placements['RobotUpperArm' + suffix] @ tr((side * .1, -.48, 0))
    placements['RobotThigh' + suffix] = root @ tr((side * .23, .91, 0))
    placements['RobotShin' + suffix] = placements['RobotThigh' + suffix] @ tr((0, -.46, 0))
for name, matrix in placements.items():
    parts[name].matrix_world = matrix
camera_data = bpy.data.cameras.new('Web intro camera')
camera_data.sensor_fit = 'VERTICAL'
camera_data.sensor_height = 24
camera_data.lens = 24 / (2 * math.tan(math.radians(40) / 2))
camera = bpy.data.objects.new('Web intro camera', camera_data)
bpy.context.collection.objects.link(camera)
camera.location = point((0, 3.8, 10.4))
camera.rotation_euler = (point((0, 2.45, -1.3)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
scene.camera = camera
scene.render.resolution_x = 1440
scene.render.resolution_y = 774
scene.render.resolution_percentage = 100
bpy.ops.wm.save_as_mainfile(filepath=str(source / 'scene.blend'))
manifest = {
    'generator': bpy.app.version_string,
    'build_hash': bpy.app.build_hash.decode(),
    'device': args.device, 'samples': args.samples, 'atlas': args.atlas,
    'source_config': config,
    'static_nodes': static_names,
    'parts': {name: {'vertices': len(obj.data.vertices), 'triangles': sum(len(p.vertices) - 2 for p in obj.data.polygons), 'materials': len(obj.data.materials)} for name, obj in parts.items()},
    'glb_bytes': output.stat().st_size,
}
(source / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print('SPACEFOLIO_BUILD=' + json.dumps({k: v for k, v in manifest.items() if k != 'parts'}))
if args.preview:
    scene.render.filepath = str(source / '../../artifacts/blender-cabin-preview.png')
    bpy.ops.render.render(write_still=True)
