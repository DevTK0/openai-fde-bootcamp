"""Read-only checks on the saved Blender scenes at real replay timestamps."""
import bisect
import json
import math
import sys
from pathlib import Path

import bpy

OUT = Path(__file__).resolve().parent
DATA = json.loads((OUT / 'replay-data.json').read_text(encoding='utf-8-sig'))
date = DATA['default']['date']
start, end = DATA['default']['start'], DATA['default']['end']
result = []

for service in DATA['default']['services']:
    bpy.ops.wm.open_mainfile(filepath=str(OUT / f'service-{service}-{date}.blend'))
    scene = bpy.context.scene
    routes = [(rid, r) for rid, r in DATA['routes'].items() if str(r['service']) == str(service)]
    stops = [s for _, r in routes for s in r['stops']]
    lat0 = (min(s['lat'] for s in stops) + max(s['lat'] for s in stops)) / 2
    lon0 = (min(s['lon'] for s in stops) + max(s['lon'] for s in stops)) / 2
    raw = lambda s: ((s['lon'] - lon0) * 111.32 * math.cos(math.radians(lat0)), (s['lat'] - lat0) * 111.32)
    coords = [raw(s) for s in stops]
    scale = min(16 / (max(x for x, y in coords) - min(x for x, y in coords)),
                14 / (max(y for x, y in coords) - min(y for x, y in coords)))
    checks = 0
    samples = []
    for seconds in [21600, 22000, 23401, 26101, 32401, 39601, 43200]:
        frame = 1 + (seconds - start) / (end - start) * (scene.frame_end - 1)
        whole = int(math.floor(frame))
        scene.frame_set(whole, subframe=frame - whole)
        counts = {'seconds': seconds, 'visible_buses': 0, 'queues_checked': 0, 'unknown_queues': 0}
        for index, (rid, route) in enumerate(sorted(routes, key=lambda pair: str(pair[1]['direction']))):
            cx = -9.8 if index == 0 else 9.8
            xy = lambda s: (cx + raw(s)[0] * scale, -.35 + raw(s)[1] * scale)
            by_order = {str(s['order']): s for s in route['stops']}
            record = DATA['dates'][date][rid]
            for trip in record['trips']:
                calls = sorted(trip['calls'], key=lambda c: c[2])
                if calls[0][0] > end or calls[-1][1] < start:
                    continue
                obj = bpy.data.objects.get(f"{rid} {trip['vehicle']} trip {trip['id']}")
                assert obj is not None, (rid, trip['id'])
                active = calls[0][0] <= seconds <= calls[-1][1]
                assert (not obj.hide_render) == active, (seconds, rid, trip['id'], obj.hide_render, active)
                if not active:
                    continue
                counts['visible_buses'] += 1
                target = None
                for i, (arrival, departure, order) in enumerate(calls):
                    if arrival <= seconds <= departure:
                        target = xy(by_order[str(order)])
                        break
                    if i < len(calls) - 1 and departure < seconds < calls[i + 1][0]:
                        a = xy(by_order[str(order)])
                        b = xy(by_order[str(calls[i + 1][2])])
                        k = (seconds - departure) / (calls[i + 1][0] - departure)
                        target = (a[0] + k * (b[0] - a[0]), a[1] + k * (b[1] - a[1]))
                        break
                assert target is not None
                error = math.hypot(obj.location.x - target[0], obj.location.y - target[1])
                assert error < .0001, (seconds, obj.name, error)
                assert max(obj.dimensions) < .8, (obj.name, tuple(obj.dimensions))
                checks += 1
            for stop in route['stops']:
                if stop.get('final'):
                    assert bpy.data.objects.get(f"{rid} stop {stop['id']} queue") is None
                    continue
                events = sorted(record['queues'].get(str(stop['order']), []), key=lambda e: e[0])
                cut = bisect.bisect_right([e[0] for e in events], seconds) - 1
                value = events[cut][1] if cut >= 0 else None
                bar = bpy.data.objects[f"{rid} stop {stop['id']} queue"]
                height = .025 if value is None or value == 0 else min(3, .07 * value)
                assert abs(bar.scale.z - height) < .0001, (seconds, rid, stop['order'], bar.scale.z, height)
                label_prefix = f"{rid} {stop['id']} remaining "
                visible_labels = [obj.data.body for obj in scene.objects if obj.name.startswith(label_prefix) and not obj.hide_render]
                assert visible_labels == ['?' if value is None else str(value)], (seconds, rid, stop['order'], visible_labels, value)
                counts['queues_checked'] += 1
                counts['unknown_queues'] += value is None
                checks += 1
        samples.append(counts)
    result.append({'service': service, 'checks_passed': checks, 'samples': samples})

(OUT / 'scene-verification.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
print('SCENE_VERIFICATION_PASSED ' + json.dumps(result))
