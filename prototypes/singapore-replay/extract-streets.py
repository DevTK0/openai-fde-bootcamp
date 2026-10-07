import requests,math,json,pathlib,concurrent.futures
import mapbox_vector_tile
from shapely.geometry import shape,box,mapping
from shapely import make_valid
out=pathlib.Path('apps/web/public/prototype-map'); cache=pathlib.Path('.audit/vector-tiles');cache.mkdir(parents=True,exist_ok=True);out.mkdir(parents=True,exist_ok=True)
meta=requests.get('https://tiles.openfreemap.org/planet',timeout=30).json(); template=meta['tiles'][0]
(out/'source.json').write_text(json.dumps({'provider':'OpenFreeMap','source':'OpenStreetMap contributors','licence':'ODbL','url':'https://www.openstreetmap.org/copyright','tilejson':meta,'detailBounds':[103.78,1.26,103.94,1.415]},indent=2))
def tile(lon,lat,z):return (int((lon+180)/360*2**z),int((1-math.asinh(math.tan(math.radians(lat)))/math.pi)/2*2**z))
def project(lon,lat):return [round((lon-103.81259461900001)*.9997194593461591*3525.1854378257794,3),round(-(lat-1.3572057355)*3525.1854378257794,3)]
def fetch(spec):
 z,x,y=spec; f=cache/f'{z}-{x}-{y}.pbf'
 if not f.exists():
  r=requests.get(template.format(z=z,x=x,y=y),timeout=60);r.raise_for_status();f.write_bytes(r.content)
 return spec,mapbox_vector_tile.decode(f.read_bytes(),default_options={'y_coord_down':True})
specs=[]
for z,bounds in [(12,(103.59,1.20,104.10,1.49)),(14,(103.78,1.26,103.94,1.415))]:
 x0,y1=tile(bounds[0],bounds[1],z);x1,y0=tile(bounds[2],bounds[3],z)
 specs.extend((z,x,y) for x in range(x0,x1+1) for y in range(y0,y1+1))
result={'roads':[],'buildings':[],'water':[],'parks':[]}
for (z,x,y),layers in concurrent.futures.ThreadPoolExecutor(max_workers=6).map(fetch,specs):
 for name,layer in layers.items():
  if name not in ['transportation','building','water','landuse','landcover']:continue
  if z==12 and name!='transportation':continue
  if z==14 and name=='transportation':continue
  size=layer['extent']
  def convert(p):
   lon=(x+p[0]/size)/2**z*360-180
   lat=math.degrees(math.atan(math.sinh(math.pi*(1-2*(y+p[1]/size)/2**z))))
   return project(lon,lat)
  for feature in layer['features']:
   props=feature['properties']; kind=props.get('class','')
   if name=='transportation' and kind in ['path','rail','aerialway','ferry']:continue
   if name in ['landuse','landcover'] and kind not in ['park','wood','grass','forest','cemetery','recreation_ground']:continue
   geom=make_valid(shape(feature['geometry'])).intersection(box(0,0,size,size))
   if geom.is_empty:continue
   g=mapping(geom)
   if name=='transportation':
    lines=[g['coordinates']] if g['type']=='LineString' else g['coordinates'] if g['type']=='MultiLineString' else []
    for line in lines: result['roads'].append({'class':kind,'points':[convert(p) for p in line]})
   else:
    polygons=[g['coordinates']] if g['type']=='Polygon' else g['coordinates'] if g['type']=='MultiPolygon' else []
    for rings in polygons:
     polygon=[[convert(p) for p in ring] for ring in rings]
     if name=='building':result['buildings'].append({'rings':polygon,'height':props.get('render_height',8),'minimum':props.get('render_min_height',0)})
     elif name=='water':result['water'].append(polygon)
     else:result['parks'].append(polygon)
(out/'streets.json').write_text(json.dumps(result,separators=(',',':')))
print('Tiles:',len(specs),'features:',{k:len(v) for k,v in result.items()},'bytes:',(out/'streets.json').stat().st_size)
