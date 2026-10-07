import argparse, json, math, re, pathlib, xml.etree.ElementTree as E
parser=argparse.ArgumentParser(description='Extract the validated Singapore replay geography')
parser.add_argument('--maps', type=pathlib.Path, required=True)
parser.add_argument('--kml', type=pathlib.Path, required=True)
args=parser.parse_args()
source=args.maps
kml=args.kml
data=json.loads((source/'network-map-data.json').read_text()); p=data['meta']['projection']
def project(lon,lat): return [round((lon-p['lon0'])*p['cos']*p['scale'],5),round(-(lat-p['lat0'])*p['scale'],5)]
r=E.parse(source/'lionlink-operations-network-map.svg').getroot()
land=[]; labels=[]
for g in r.iter():
 if g.get('id')=='geography':
  for path in g:
   for part in re.findall(r'M([^M]+)',path.get('d','')):
    pts=[[float(x)-700,float(y)-450] for x,y in re.findall(r'(-?[\d.]+),(-?[\d.]+)',part)]
    if len(pts)>2: land.append(pts)
 if g.get('id')=='place-labels':
  for t in g.iter():
   if t.tag.endswith('text'): labels.append({'name':''.join(t.itertext()),'point':[float(t.get('x'))-700,float(t.get('y'))-450]})
routes=[]
for service in ['132','159']:
 for direction in [1,2]:
  raw=E.parse(kml/f'LTA-KML-{service}-{direction}.kml')
  coords=raw.find('.//{*}LineString/{*}coordinates').text.split()
  points=[project(*map(float,c.split(',')[:2])) for c in coords]
  distances=[0]
  for a,b in zip(points,points[1:]): distances.append(distances[-1]+math.dist(a,b))
  route=data['routes'][f'B{service}_{direction}']; stops=[]
  for stop in route['stops']:
   info=data['stops'][stop['code']]; q=project(*info['coord']); best=None
   for i,(a,b) in enumerate(zip(points,points[1:])):
    dx,dy=b[0]-a[0],b[1]-a[1]; length=dx*dx+dy*dy
    t=max(0,min(1,((q[0]-a[0])*dx+(q[1]-a[1])*dy)/length)) if length else 0
    foot=[a[0]+t*dx,a[1]+t*dy]; err=math.dist(q,foot)
    hit=(err,distances[i]+t*math.sqrt(length),foot)
    if best is None or err<best[0]: best=hit
   stops.append({'order':stop['seq'],'id':stop['code'],'name':info['name'],'point':q,'distance':best[1],'offsetMetres':best[0]*111195/p['scale']})
  assert all(a['distance']<=b['distance'] for a,b in zip(stops,stops[1:])),route['id']
  routes.append({'id':route['id'],'service':service,'direction':direction,'origin':route['origin'],'destination':route['destination'],'points':points,'distances':distances,'stops':stops})
out={'land':land,'labels':labels,'routes':routes}
pathlib.Path('apps/web/app/prototypes/singapore-replay/map-data.json').write_text(json.dumps(out,separators=(',',':')))
print(len(land),'land polygons;',len(routes),'validated ordered paths')
