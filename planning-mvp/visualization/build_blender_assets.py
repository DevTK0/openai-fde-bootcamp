"""Build Blender-authored route-view assets for the offline Planning Studio.

Run with Blender's bundled Python:
  blender --background --python visualization/build_blender_assets.py

Outputs are local project assets. Route geometry comes from the retained
geographic SVG; operations/demand data stays separate and synthetic.
"""
import json
import math
import re
from pathlib import Path

import bpy
from mathutils import Vector


HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent
ROOT = PROJECT.parent
MAP_DIR = ROOT / "lionlink-operations-source" / "maps"
MAP_DATA = json.loads((MAP_DIR / "network-map-data.json").read_text())
SVG = (MAP_DIR / "lionlink-operations-network-map.svg").read_text()
ROUTES = MAP_DATA["routes"]
STOPS = MAP_DATA["stops"]
PROJ = MAP_DATA["meta"]["projection"]
MAP_WIDTH, MAP_HEIGHT = 1400, 900


def svg_route_paths():
    found = {}
    pattern = re.compile(r'<g data-route="([^"]+)"[^>]*>\s*<path\s+d="([^"]+)"')
    for route_id, d in pattern.findall(SVG):
        points = [[float(x), float(y)] for x, y in re.findall(r"[ML]\s*(-?[\d.]+),(-?[\d.]+)", d)]
        if len(points) > 1:
            found[route_id] = points
    return found


def stop_map_xy(stop_id):
    lon, lat = STOPS[stop_id]["coord"]
    x = PROJ["x"] + (lon - PROJ["lon0"]) * PROJ["scale"] * PROJ["cos"]
    y = PROJ["y"] - (lat - PROJ["lat0"]) * PROJ["scale"]
    return [x, y]


def write_route_data():
    paths = svg_route_paths()
    routes = {}
    for route_id, route in ROUTES.items():
        if route_id not in paths:
            continue
        calls = []
        for stop in route["stops"]:
            stop_info = STOPS.get(stop["code"])
            if not stop_info:
                continue
            calls.append({
                "code": stop["code"], "name": stop_info["name"],
                "seq": stop["seq"], "km": float(stop["km"]),
                "xy": stop_map_xy(stop["code"]),
            })
        routes[route_id] = {
            "service": route["service"], "direction": route["direction"],
            "origin": route["origin"], "destination": route["destination"],
            "path": paths[route_id], "stops": calls,
        }
    payload = {
        "routes": routes,
        "source": "lionlink-operations-source/maps/network-map-data.json + lionlink-operations-network-map.svg",
        "geographyNote": "Public selected route geography; operational scenario values are synthetic exercise data.",
    }
    out = HERE / "route-data.js"
    out.write_text("window.LIONLINK_ROUTE_3D_DATA = " + json.dumps(payload, separators=(",", ":")) + ";\n")
    return routes


def material(name, color, roughness=0.75, emission=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1.0)
    mat.use_nodes = True
    principled = mat.node_tree.nodes.get("Principled BSDF")
    principled.inputs["Base Color"].default_value = (*color, 1.0)
    principled.inputs["Roughness"].default_value = roughness
    if emission:
        principled.inputs["Emission Color"].default_value = (*color, 1.0)
        principled.inputs["Emission Strength"].default_value = emission
    return mat


def assign(obj, mat):
    obj.data.materials.append(mat)
    return obj


def make_box(name, loc, scale, mat, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    assign(obj, mat)
    if bevel:
        mod = obj.modifiers.new("Soft edges", "BEVEL")
        mod.width = bevel
        mod.segments = 2
        obj.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
    return obj


def make_bus(materials):
    bus_parts = []
    # Blender local +Y is the bus's forward direction.
    bus_parts.append(make_box("Bus body", (0, 0, 0.48), (1.35, 3.45, 0.92), materials["body"], 0.12))
    bus_parts.append(make_box("Roof", (0, -0.05, 1.02), (1.25, 2.6, 0.16), materials["roof"], 0.07))
    bus_parts.append(make_box("Window band", (0, 0.12, 0.66), (1.38, 2.55, 0.38), materials["glass"], 0.03))
    bus_parts.append(make_box("Front glass", (0, 1.59, 0.74), (1.1, 0.06, 0.42), materials["glass"], 0.02))
    bus_parts.append(make_box("Front destination display", (0, 1.64, 0.91), (0.55, 0.04, 0.11), materials["amber"], 0.015))
    bus_parts.append(make_box("Lower front", (0, 1.67, 0.34), (1.18, 0.05, 0.22), materials["body"], 0.02))
    for side in (-1, 1):
        for y in (-1.12, 1.12):
            bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.27, depth=0.13,
                                                location=(side * 0.68, y, 0.29),
                                                rotation=(0, math.pi / 2, 0))
            wheel = bpy.context.object
            wheel.name = f"Wheel {side} {y}"
            assign(wheel, materials["tyre"])
            bus_parts.append(wheel)
    # Join to one portable, easy-to-serialize model.
    bpy.ops.object.select_all(action="DESELECT")
    for obj in bus_parts:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = bus_parts[0]
    bpy.ops.object.join()
    bus = bpy.context.object
    bus.name = "LionLink low-poly bus"
    bus["forward_axis"] = "+Y"
    return bus


def export_bus_mesh(obj):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    mesh = obj.evaluated_get(depsgraph).to_mesh()
    mesh.calc_loop_triangles()
    palette = []
    for mat in mesh.materials:
        if mat:
            palette.append([round(float(v), 4) for v in mat.diffuse_color[:3]])
        else:
            palette.append([0.25, 0.4, 0.4])
    triangles = []
    for tri in mesh.loop_triangles:
        material_index = tri.material_index
        triangles.append({
            "v": [[round(float(x), 4) for x in mesh.vertices[i].co] for i in tri.vertices],
            "c": palette[material_index] if material_index < len(palette) else [0.25, 0.4, 0.4],
        })
    (HERE / "bus-model.js").write_text(
        "window.LIONLINK_BUS_MODEL = " + json.dumps(triangles, separators=(",", ":")) + ";\n"
    )
    obj.evaluated_get(depsgraph).to_mesh_clear()


def create_scene(routes):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.curves, bpy.data.meshes, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        # Keep only datablocks with no users; scene is regenerated from scratch.
        for block in list(datablocks):
            if block.users == 0:
                datablocks.remove(block)

    mats = {
        "ground": material("Map ground", (0.055, 0.12, 0.14)),
        "route": material("Selected route", (0.15, 0.82, 0.68), emission=0.22),
        "stop": material("Stops", (0.94, 0.75, 0.31), emission=0.12),
        "body": material("LionLink teal", (0.16, 0.72, 0.57), emission=0.12),
        "roof": material("Roof", (0.08, 0.43, 0.38), emission=0.04),
        "glass": material("Windows", (0.13, 0.24, 0.28), roughness=0.2),
        "amber": material("Destination amber", (1.0, 0.57, 0.19), emission=0.4),
        "tyre": material("Tyres", (0.06, 0.07, 0.08)),
    }
    route = routes.get("B238_1") or next(iter(routes.values()))
    all_xy = route["path"]
    min_x = min(p[0] for p in all_xy); max_x = max(p[0] for p in all_xy)
    min_y = min(p[1] for p in all_xy); max_y = max(p[1] for p in all_xy)
    center_x, center_y = (min_x + max_x) / 2, (min_y + max_y) / 2
    scale = 0.7
    def world(xy):
        return ((xy[0] - center_x) * scale, (center_y - xy[1]) * scale, 0.09)

    span = max((max_x - min_x) * scale, (max_y - min_y) * scale, 2.0)
    bpy.ops.mesh.primitive_plane_add(size=span * 1.35, location=(0, 0, 0))
    ground = bpy.context.object
    ground.name = "Route scene ground"
    assign(ground, mats["ground"])

    curve = bpy.data.curves.new(f"{route['service']} route path", "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = 0.075
    curve.bevel_resolution = 3
    spline = curve.splines.new("POLY")
    spline.points.add(len(route["path"]) - 1)
    for i, point in enumerate(route["path"]):
        x, y, z = world(point)
        spline.points[i].co = (x, y, z, 1.0)
    route_obj = bpy.data.objects.new("B238_1 route line", curve)
    bpy.context.collection.objects.link(route_obj)
    assign(route_obj, mats["route"])

    for stop in route["stops"]:
        x, y, z = world(stop["xy"])
        bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.16, depth=0.3, location=(x, y, z + 0.15))
        pin = bpy.context.object
        pin.name = f"Stop {stop['seq']:02d} · {stop['code']}"
        assign(pin, mats["stop"])

    bus = make_bus(mats)
    # Park at the route midpoint for the still preview; this is not vehicle GPS.
    mid_point = route["path"][len(route["path"]) // 2]
    bx, by, _ = world(mid_point)
    bus.location = (bx, by, 1.0)
    bus.scale = (0.95, 0.95, 0.95)
    export_bus_mesh(bus)

    bpy.ops.object.camera_add(location=(span * 0.48, -span * 0.72, span * 0.9))
    camera = bpy.context.object
    camera.name = "Route overview camera"
    target = Vector((0, 0, 0))
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = span * 1.32
    bpy.context.scene.camera = camera

    bpy.ops.object.light_add(type="AREA", location=(0, -span * 0.2, span * 0.9))
    key = bpy.context.object
    key.name = "Soft key light"
    key.data.energy = 2400
    key.data.shape = "DISK"
    key.data.size = span * 0.9
    key.rotation_euler = (0, 0, 0)
    bpy.ops.object.light_add(type="AREA", location=(-span * 0.55, span * 0.45, span * 0.55))
    fill = bpy.context.object
    fill.name = "Route fill light"
    fill.data.energy = 1000
    fill.data.size = span * 0.7
    fill.rotation_euler = (0, 0, 0)

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1200
    scene.render.resolution_y = 760
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(HERE / "route-preview.png")
    if scene.world is None:
        scene.world = bpy.data.worlds.new("Night-slate world")
    scene.world.use_nodes = True
    background = scene.world.node_tree.nodes.get("Background")
    background.inputs["Color"].default_value = (0.025, 0.04, 0.05, 1.0)
    background.inputs["Strength"].default_value = 0.35
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "Medium High Contrast"
    scene.render.film_transparent = False
    scene.frame_end = 120
    scene["note"] = "Public geographic route shape; bus placement and passenger/demand scenario are illustrative."
    bpy.ops.wm.save_as_mainfile(filepath=str(HERE / "lionlink-route-view.blend"))
    bpy.ops.render.render(write_still=True)
    print(f"Built Blender route scene for {route['service']} / B238_1")


if __name__ == "__main__":
    route_data = write_route_data()
    create_scene(route_data)
