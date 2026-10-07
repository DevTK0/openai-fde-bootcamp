"""Extract source geography without baking services or stop positions into the UI."""
import argparse
import hashlib
import json
import pathlib
import re
import urllib.request
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--maps', type=pathlib.Path, required=True)
parser.add_argument('--kml', type=pathlib.Path, required=True, help='Download cache')
args = parser.parse_args()
args.kml.mkdir(parents=True, exist_ok=True)
network = json.loads((args.maps / 'network-map-data.json').read_text())
projection = network['meta']['projection']

def project(lon, lat):
    return [round((lon-projection['lon0'])*projection['cos']*projection['scale'], 5),
            round(-(lat-projection['lat0'])*projection['scale'], 5)]

def sources(value):
    if isinstance(value, dict):
        if str(value.get('source_id', '')).startswith('LTA-KML-'):
            yield value
        for child in value.values():
            yield from sources(child)
    elif isinstance(value, list):
        for child in value:
            yield from sources(child)

registry = json.loads((args.maps / 'map-source-registry.json').read_text())
shapes = []
provenance = []
for source in sources(registry):
    file = args.kml / (source['source_id'] + '.kml')
    if not file.exists():
        file.write_bytes(urllib.request.urlopen(source['url'], timeout=45).read())
    raw = file.read_bytes()
    if hashlib.sha256(raw).hexdigest() != source['sha256']:
        raise ValueError(f"Source hash mismatch: {source['source_id']}")
    _, _, service, direction = source['source_id'].split('-')
    parts = []
    for line in ET.fromstring(raw).findall('.//{*}LineString/{*}coordinates'):
        parts.append([project(*map(float, coord.split(',')[:2])) for coord in line.text.split()])
    shapes.append({'service': service, 'direction': int(direction), 'parts': parts})
    provenance.append({key: source[key] for key in ('source_id', 'url', 'sha256')})

land, labels = [], []
for group in ET.parse(args.maps / 'lionlink-operations-network-map.svg').getroot().iter():
    if group.get('id') == 'geography':
        for path in group:
            for part in re.findall(r'M([^M]+)', path.get('d', '')):
                points = [[float(x)-700, float(y)-450] for x, y in re.findall(r'(-?[\d.]+),(-?[\d.]+)', part)]
                if len(points) > 2:
                    land.append(points)
    if group.get('id') == 'place-labels':
        for label in group.iter():
            if label.tag.endswith('text'):
                labels.append({'name': ''.join(label.itertext()), 'point': [float(label.get('x'))-700, float(label.get('y'))-450]})

out = pathlib.Path('apps/web/components/service-replay')
(out / 'map-data.json').write_text(json.dumps({'land': land, 'labels': labels, 'projection': projection}, separators=(',', ':')))
(out / 'road-shapes.json').write_text(json.dumps(shapes, separators=(',', ':')))
pathlib.Path('apps/web/public/service-replay/routes-source.json').write_text(json.dumps({'snapshot': registry['snapshot_local_date'], 'sources': provenance}, indent=2)+'\n')
print(f'{len(shapes)} route directions from {len(set(s["service"] for s in shapes))} services; all source hashes verified')
