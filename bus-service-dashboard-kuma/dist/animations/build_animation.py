"""Build faithful, local Blender replay assets from replay-data.json.

Run with Blender 4.5:
  blender --background --python build_animation.py -- --animate
  blender --background --python build_animation.py -- --service 132 --animate

The saved .blend contains all arrival/departure and queue-event keyframes,
including subframe events. The MP4 samples this six-hour replay at 12 fps.
Bus positions between stops are straight-line interpolation, not GPS fixes.
"""
import argparse
import bisect
import json
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

OUT = Path(__file__).resolve().parent
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
parser = argparse.ArgumentParser()
parser.add_argument('--data', type=Path, default=OUT / 'replay-data.json')
parser.add_argument('--service', action='append')
parser.add_argument('--date')
parser.add_argument('--animate', action='store_true')
parser.add_argument('--frames', type=int, default=120)
parser.add_argument('--width', type=int, default=1100)
parser.add_argument('--height', type=int, default=700)
opts = parser.parse_args(ARGS)
DATA = json.loads(opts.data.read_text(encoding='utf-8-sig'))
DATE = opts.date or DATA['default']['date']
START, END = DATA['default']['start'], DATA['default']['end']
SERVICES = opts.service or DATA['default']['services']
FRAME_END = opts.frames


def at(sec):
    return 1 + (float(sec) - START) / (END - START) * (FRAME_END - 1)


def clock(sec):
    return f'{int(sec // 3600):02d}:{int(sec % 3600 // 60):02d}'


def material(name, color):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    return m


def cube(name, loc, dimensions, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = dimensions
    o.data.materials.append(mat)
    return o


def line(name, points, mat, radius=.025):
    c = bpy.data.curves.new(name, 'CURVE')
    c.dimensions = '3D'
    c.bevel_depth = radius
    c.bevel_resolution = 1
    s = c.splines.new('POLY')
    s.points.add(len(points) - 1)
    for p, co in zip(s.points, points):
        p.co = (*co, 1)
    o = bpy.data.objects.new(name, c)
    bpy.context.collection.objects.link(o)
    o.data.materials.append(mat)
    return o


def text(body, size, mat, camera, loc, hud=False):
    body = ' '.join(str(body).split())
    c = bpy.data.curves.new(body, 'FONT')
    c.body = str(body)
    c.size = size
    c.align_y = 'CENTER'
    o = bpy.data.objects.new(str(body), c)
    bpy.context.collection.objects.link(o)
    o.data.materials.append(mat)
    if hud:
        o.parent = camera
        o.location = (loc[0], loc[1], -40)
    else:
        o.location = loc
        o.rotation_euler = camera.rotation_euler
    return o


def interpolation(obj, mode='CONSTANT', path=None):
    action = obj.animation_data.action if obj.animation_data else None
    if action:
        for curve in action.fcurves:
            if path is None or curve.data_path == path:
                for key in curve.keyframe_points:
                    key.interpolation = mode


def visible_between(obj, begin, end):
    # Visibility uses real subframe timings, so saved scenes preserve all events.
    for frame, hidden in [(min(0, begin - 1), True),
                          (begin, False), (end, True)]:
        obj.hide_render = hidden
        obj.hide_viewport = hidden
        obj.keyframe_insert(data_path='hide_render', frame=frame)
        obj.keyframe_insert(data_path='hide_viewport', frame=frame)
    interpolation(obj)


def bus_mesh(name, color, white, dark):
    parts = []
    for label, loc, dim, mat in [
        ('body', (0, 0, .20), (.25, .48, .18), color),
        ('roof', (0, -.02, .30), (.21, .37, .04), white),
        ('front', (0, .244, .22), (.20, .012, .10), dark),
        ('windowsL', (-.13, 0, .24), (.012, .34, .08), dark),
        ('windowsR', (.13, 0, .24), (.012, .34, .08), dark),
    ]:
        parts.append(cube(name + label, loc, dim, mat))
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts:
        o.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    o = bpy.context.object
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bpy.context.scene.cursor.location = (0, 0, 0)
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
    mesh = o.data
    mesh.name = name
    bpy.data.objects.remove(o, do_unlink=True)
    return mesh


def build(service):
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = FRAME_END
    scene.render.fps = 12
    scene.render.engine = 'BLENDER_WORKBENCH'
    scene.render.resolution_x = opts.width
    scene.render.resolution_y = opts.height
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = False
    scene.render.image_settings.file_format = 'PNG'
    scene.view_settings.view_transform = 'Standard'
    scene.display.shading.light = 'STUDIO'
    scene.display.shading.studiolight_rotate_z = .5
    scene.display.shading.color_type = 'MATERIAL'
    scene.display.shading.show_shadows = False
    scene.display.shading.show_cavity = True
    scene.display.shading.cavity_type = 'WORLD'
    scene.display.shading.show_specular_highlight = False
    scene.display.shading.background_type = 'WORLD'
    scene.world.color = (.010, .019, .035)
    scene.display.render_aa = '8'

    navy = material('Panel', (.014, .032, .055))
    white = material('Type', (.86, .94, 1))
    muted = material('Secondary', (.40, .56, .68))
    grid = material('Subtle grid', (.035, .067, .095))
    cyan = material('Direction 1', (.035, .70, .77))
    blue = material('Direction 2', (.32, .51, 1))
    amber = material('Passengers remaining', (1, .58, .10))
    coral = material('High remaining queue', (1, .29, .20))
    unknown = material('No previous boarding cutoff', (.36, .44, .53))
    dark = material('Bus windows', (.012, .022, .038))

    bpy.ops.object.camera_add(location=(0, -29, 43))
    camera = bpy.context.object
    camera.rotation_euler = (Vector((0, 0, 0)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
    camera.data.type = 'ORTHO'
    camera.data.ortho_scale = 40
    scene.camera = camera
    hud = lambda body, x, y, size=.27, mat=white: text(body, size, mat, camera, (x, y), True)

    hud('SERVICE ' + service, -19, 11.35, .84, cyan)
    hud('BUS POSITIONS + QUEUES AFTER BOARDING', -19, 10.35, .47)
    subtitle = hud(f'{DATE}  /  06:00-12:00 SGT  /  both directions', -19, 9.60, .30, muted)
    hud('SYNTHETIC REPLAY', 12.65, 11.20, .32, amber)
    for frame in range(1, FRAME_END + 1):
        sec = START + (frame - 1) / (FRAME_END - 1) * (END - START)
        label = hud(clock(sec) + ' SGT', 13.4, 10.35, .60)
        visible_between(label, frame, frame + 1)

    routes = [(rid, r) for rid, r in DATA['routes'].items() if str(r['service']) == str(service)]
    routes.sort(key=lambda pair: str(pair[1]['direction']))
    if len(routes) not in (1, 2):
        raise ValueError(f'Service {service} requires one or two published directions; found {len(routes)}')
    if len(routes) == 1:
        subtitle.data.body = f'{DATE} / 06:00-12:00 SGT / published loop direction only'
    stops = [s for _, r in routes for s in r['stops']]
    lat0 = (min(s['lat'] for s in stops) + max(s['lat'] for s in stops)) / 2
    lon0 = (min(s['lon'] for s in stops) + max(s['lon'] for s in stops)) / 2
    raw = lambda s: ((s['lon'] - lon0) * 111.32 * math.cos(math.radians(lat0)),
                     (s['lat'] - lat0) * 111.32)
    coords = [raw(s) for s in stops]
    extent_x = max(x for x, _ in coords) - min(x for x, _ in coords)
    extent_y = max(y for _, y in coords) - min(y for _, y in coords)
    scale = min(16 / max(extent_x, .01), 14 / max(extent_y, .01))
    dynamic = []
    validation = {'service': service, 'date': DATE, 'frame_start': 1, 'frame_end': FRAME_END,
                  'seconds_start': START, 'seconds_end': END, 'directions': [],
                  'method': 'Recorded synthetic arrival/departure dwell; linear interpolation between known stop coordinates; latest boarding cutoff queue, unknown before first observation.'}

    for direction_index, (rid, route) in enumerate(routes):
        cx = 0 if len(routes) == 1 else -9.8 if direction_index == 0 else 9.8
        color = cyan if direction_index == 0 else blue
        route_stops = sorted(route['stops'], key=lambda s: s['order'])
        by_order = {str(s['order']): s for s in route_stops}
        xy = lambda s: (cx + raw(s)[0] * scale, -.35 + raw(s)[1] * scale)
        panel = cube(rid + ' panel', (cx, 0, -.16), (18.6, 20, .18), navy)
        for n in range(-8, 9, 2):
            line('Longitude grid', [(cx + n, -9, -.058), (cx + n, 9, -.058)], grid, .008)
        for n in range(-8, 9, 2):
            line('Latitude grid', [(cx - 9, n, -.058), (cx + 9, n, -.058)], grid, .008)
        points = [(*xy(s), .025) for s in route_stops]
        line(rid + ' joins known stops', points, color, .038)
        heading = 'LOOP DIRECTION' if route.get('loop') else 'DIRECTION ' + str(route['direction'])
        hud(heading, cx - 8.9, 8.62, .34, color)
        hud(route_stops[0]['name'] + ' > ' + route_stops[-1]['name'], cx - 8.9, 8.07, .23, white)

        record = DATA['dates'][DATE].get(rid, {'trips': [], 'queues': {}})
        observed = 0
        queue_events = 0
        for stop in route_stops:
            x, y = xy(stop)
            bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=.075, depth=.045, location=(x, y, .05))
            marker = bpy.context.object
            marker.name = f"{rid} stop {stop['order']:02} {stop['id']} {stop['name']}"
            marker.data.materials.append(color)
            marker['stop_id'] = stop['id']
            marker['stop_name'] = stop['name']
            marker['order'] = stop['order']
            marker['final_terminal'] = bool(stop.get('final'))
            text(str(stop['order']), .11, muted, camera, (x - .13, y - .09, .10))
            if stop.get('final'):
                text('END', .14, muted, camera, (x + .12, y, .12))
                continue
            events = sorted(record['queues'].get(str(stop['order']), []), key=lambda q: q[0])
            observed += bool(events)
            queue_events += len(events)
            # Before the first observed boarding cutoff, the state is unknown.
            bar = cube(f"{rid} stop {stop['id']} queue", (x, y, .095), (.085, .085, .025), amber)
            dynamic.append(bar)
            bar['measure'] = 'Most recent queue after boarding cutoff; passengers'
            bar['events'] = json.dumps(events)
            states = [(0, None)] + [(at(t), max(0, int(q))) for t, q, *_ in events]
            for frame, value in states:
                height = .025 if value is None or value == 0 else min(3, .07 * value)
                bar.scale.z = height
                bar.location.z = .08 + height / 2
                bar.keyframe_insert(data_path='scale', frame=frame)
                bar.keyframe_insert(data_path='location', frame=frame)
            interpolation(bar)
            # One text object per observed value preserves numeric labels without scripts.
            for value in {value for _, value in states}:
                label = text('?' if value is None else str(value), .23,
                             unknown if value is None else coral if value >= 20 else amber if value else muted,
                             camera, (x + .105, y, .18))
                label.name = f"{rid} {stop['id']} remaining {'unknown' if value is None else value}"
                dynamic.append(label)
                for frame, state in states:
                    hidden = state != value
                    label.hide_render = hidden
                    label.hide_viewport = hidden
                    label.keyframe_insert(data_path='hide_render', frame=frame)
                    label.keyframe_insert(data_path='hide_viewport', frame=frame)
                    height = .025 if state is None or state == 0 else min(3, .07 * state)
                    label.location.z = .18 + height
                    label.keyframe_insert(data_path='location', frame=frame)
                interpolation(label)

        mesh = bus_mesh(rid + ' bus geometry', color, white, dark)
        active_trips = 0
        for trip in record['trips']:
            calls = sorted(trip['calls'], key=lambda c: c[2])
            if not calls or calls[0][0] > END or calls[-1][1] < START:
                continue
            active_trips += 1
            obj = bpy.data.objects.new(f"{rid} {trip['vehicle']} trip {trip['id']}", mesh)
            bpy.context.collection.objects.link(obj)
            dynamic.append(obj)
            obj['trip_id'] = trip['id']
            obj['vehicle_id'] = trip['vehicle']
            obj['movement_method'] = 'Dwell at recorded stop arrival/departure; linear geographic interpolation between stops.'
            visible_between(obj, at(calls[0][0]), at(calls[-1][1]) + .0001)
            previous_angle = None
            for i, (arrival, departure, order) in enumerate(calls):
                stop = by_order[str(order)]
                x, y = xy(stop)
                target = by_order[str(calls[min(i + 1, len(calls) - 1)][2])]
                tx, ty = xy(target)
                if i == len(calls) - 1 and i:
                    px, py = xy(by_order[str(calls[i - 1][2])])
                    tx, ty = x + (x - px), y + (y - py)
                angle = -math.atan2(tx - x, ty - y)
                if previous_angle is not None:
                    while angle - previous_angle > math.pi:
                        angle -= 2 * math.pi
                    while angle - previous_angle < -math.pi:
                        angle += 2 * math.pi
                previous_angle = angle
                for sec in (arrival, departure):
                    obj.location = (x, y, .09)
                    obj.rotation_euler.z = angle
                    obj.keyframe_insert(data_path='location', frame=at(sec))
                    obj.keyframe_insert(data_path='rotation_euler', frame=at(sec))
            interpolation(obj, 'LINEAR', 'location')
            interpolation(obj, 'CONSTANT', 'rotation_euler')
        hud(f'{len(route_stops)} stops  /  {active_trips} recorded trips', cx - 8.9, -8.28, .26, muted)
        hud('? = no earlier boarding observation   END = no boarding', cx - 8.9, -8.88, .24, muted)
        validation['directions'].append({'route_id': rid, 'stop_count': len(route_stops),
                                        'observed_boarding_stops': observed, 'queue_events': queue_events,
                                        'active_trips': active_trips})

    hud('Label = latest queue at boarding cutoff; column heights capped at 43 passengers', -19, -10.08, .27, amber)
    hud('Bus positions interpolate between recorded stops. Route lines join stops, not streets.', -19, -10.70, .27, muted)
    hud('Synthetic replay, not live GPS. Last observed queues are not continuously measured demand.', -19, -11.26, .25, muted)
    scene['replay_date'] = DATE
    scene['service'] = service
    scene['data_type'] = 'Synthetic operational replay, not live GPS'
    scene['motion_method'] = validation['method']
    scene['seconds_start'] = START
    scene['seconds_end'] = END
    scene['frame_mapping'] = f'seconds = {START} + (frame - 1) / {FRAME_END - 1} * {END - START}'
    block = bpy.data.texts.new('REPLAY DATA - service ' + service)
    block.write(json.dumps({'routes': {r: d for r, d in routes},
                           'date': DATE, 'records': {r: DATA['dates'][DATE].get(r) for r, _ in routes},
                           'validation': validation}, indent=2))
    source = bpy.data.texts.new('build_animation.py')
    source.write(Path(__file__).read_text(encoding='utf-8'))
    target = OUT
    stem = f'service-{service}-{DATE}'
    # Render a bus-free route reference for the optional browser composition.
    scene.frame_set(1)
    previously_hidden = [o.hide_render for o in dynamic]
    for o in dynamic:
        o.hide_render = True
    scene.render.filepath = str(target / f'{stem}-route-background.png')
    bpy.ops.render.render(write_still=True)
    for o, hidden in zip(dynamic, previously_hidden):
        o.hide_render = hidden
    # Midday preview and saved scene make opening the .blend immediately useful.
    scene.frame_set(round(FRAME_END * .25))
    scene.render.filepath = str(target / f'{stem}-preview.png')
    bpy.ops.render.render(write_still=True)
    scene.render.image_settings.file_format = 'FFMPEG'
    scene.render.ffmpeg.format = 'MPEG4'
    scene.render.ffmpeg.codec = 'H264'
    scene.render.ffmpeg.constant_rate_factor = 'MEDIUM'
    scene.render.ffmpeg.ffmpeg_preset = 'GOOD'
    scene.render.filepath = str(target / f'{stem}.mp4')
    bpy.ops.wm.save_as_mainfile(filepath=str(target / f'{stem}.blend'))
    if opts.animate:
        bpy.ops.render.render(animation=True)
    validation['objects'] = len(scene.objects)
    validation['blend'] = str(target / f'{stem}.blend')
    validation['movie'] = str(target / f'{stem}.mp4')
    (target / f'{stem}-validation.json').write_text(json.dumps(validation, indent=2), encoding='utf-8')
    print('REPLAY_COMPLETED ' + json.dumps(validation), flush=True)


for service in SERVICES:
    build(str(service))
