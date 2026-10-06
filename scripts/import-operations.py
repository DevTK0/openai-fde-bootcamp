"""Build portable compressed source tables and compact operations report aggregates.
Usage: python3 scripts/import-operations.py /path/to/lionlink-operations-source
No database, dependencies, or source-system changes required.
"""
import csv, datetime as dt, gzip, hashlib, io, json, pathlib, runpy, sys
from collections import defaultdict
ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent.parent.parent / 'lionlink-operations-source'
if not (SOURCE / 'data/schema.json').exists():
    raise SystemExit('Provide the operations source folder: python3 scripts/import-operations.py /home/exedev/lionlink-operations-source')
OUT = ROOT / 'apps/web/data/operations'
OUT.mkdir(parents=True, exist_ok=True)
schema = {t['name']: {c['name']: c['type'] for c in t['columns']} for t in json.loads((SOURCE/'data/schema.json').read_text())['tables']}
manifest = {'tables': [], 'documents': [], 'source': 'lionlink-operations-source', 'scope': 'Departures 06:00–11:59, 5–16 October 2026; complete downstream calls retained.'}
tables = {}
def write_gzip(path, payload):
    path.write_bytes(gzip.compress(payload, mtime=0))
for path in sorted((SOURCE/'data').rglob('*.csv')):
    name = path.stem
    raw = path.read_bytes()
    with path.open(newline='') as f:
        reader = csv.DictReader(f)
        cols = reader.fieldnames
        rows = []
        for row in reader:
            for col, value in row.items():
                typ = schema.get(name, {}).get(col, 'INTEGER' if col in ['capacity_people','wheelchair_spaces'] else 'TEXT')
                row[col] = None if value == '' else int(value) if typ == 'INTEGER' else float(value) if typ in ('REAL','NUMERIC') else value
            rows.append(row)
    write_gzip(OUT/f'{name}.jsonl.gz', ''.join(json.dumps(r, separators=(',',':'))+'\n' for r in rows).encode())
    write_gzip(OUT/f'{name}.csv.gz',raw)
    manifest['tables'].append({'id':name,'file':str(path.relative_to(SOURCE)), 'columns':cols, 'count':len(rows), 'sha256':hashlib.sha256(raw).hexdigest()})
    tables[name] = rows
for path in [SOURCE/'data/README.md',SOURCE/'data/DATA_DICTIONARY.md',SOURCE/'data/workshop/README.md']:
    manifest['documents'].append({'file':str(path.relative_to(SOURCE)), 'text':path.read_text()})
trips = tables['trips']; trip_by_id = {r['trip_id']:r for r in trips}
routes = {r['route_id']:r for r in tables['routes']}; stops = {r['stop_id']:r for r in tables['stops']}
def duration(a,b): return (dt.datetime.fromisoformat(a)-dt.datetime.fromisoformat(b)).total_seconds()
def bucket(): return {'trips':0,'completed':0,'km':0,'positioningKm':0,'seconds':0,'vehicles':set(),'departureDelays':[],'arrivalDelays':[],'substitutions':0,'calls':0,'boardings':0,'alightings':0,'queuedCalls':0,'fullCalls':0,'occupancySum':0,'initialQueue':0,'arrivals':0,'remainingQueue':0,'windowBoardings':0,'controlActions':0,'resourceUpdates':0}
groups=defaultdict(bucket)
for r in trips:
    g=groups[(r['service_date'],r['service_no'])]
    g['trips']+=1;g['completed']+=r['completion_state']=='completed';g['km']+=r['published_distance_km'];g['seconds']+=duration(r['actual_arrival_at'],r['actual_departure_at']);g['vehicles'].add(r['actual_vehicle_id'])
    g['departureDelays'].append(duration(r['actual_departure_at'],r['scheduled_departure_at']))
    g['arrivalDelays'].append(duration(r['actual_arrival_at'],r['scheduled_arrival_at']))
    g['substitutions']+=r['actual_vehicle_id']!=r['planned_vehicle_id']
for r in tables['terminal_movements']:
    trip=trip_by_id[r['from_trip_id']];g=groups[(r['service_date'],trip['service_no'])]
    g['positioningKm']+=r['planning_distance_km'];g['seconds']+=r['planning_seconds']
hotspots=[]
for r in tables['queue_windows']:
    route=routes[r['route_id']];g=groups[(r['service_date'],route['service_no'])]
    for dest,src in [('initialQueue','initial_queue_people'),('arrivals','total_arrivals_people'),('remainingQueue','remaining_queue_people'),('windowBoardings','total_boarded_people')]:g[dest]+=r[src]
    if r['initial_queue_people']+r['total_arrivals_people'] != r['total_boarded_people']+r['remaining_queue_people']:raise ValueError('Queue does not reconcile')
    hotspots.append({'date':r['service_date'],'service':route['service_no'],'route':r['route_id'],'order':r['stop_order'],'stop':r['stop_id'],'name':stops[r['stop_id']]['description'],'arrivals':r['total_arrivals_people'],'boardings':r['total_boarded_people'],'remaining':r['remaining_queue_people']})
origins={}
for r in tables['stop_calls']:
    trip=trip_by_id[r['trip_id']];g=groups[(r['service_date'],trip['service_no'])]
    g['calls']+=1;g['boardings']+=r['boarded_people'];g['alightings']+=r['alighted_people'];g['queuedCalls']+=r['queue_after_people']>0;g['fullCalls']+=r['onboard_departing']==r['capacity_people'];g['occupancySum']+=r['onboard_departing']/r['capacity_people']
    if r['stop_order']==1:origins[r['trip_id']]=r
    if r['queue_before_people']-r['boarded_people']!=r['queue_after_people']:raise ValueError('Stop queue does not reconcile')
    if r['onboard_arriving']-r['alighted_people']+r['boarded_people']!=r['onboard_departing']:raise ValueError('Occupancy does not reconcile')
for name,key in [('control_actions','controlActions'),('resource_updates','resourceUpdates')]:
    for r in tables[name]:
        trip=trip_by_id.get(r.get('trip_id') or r.get('related_trip_id'))
        if trip:groups[(r['service_date'],trip['service_no'])][key]+=1
summary=[]
for (date,service),g in sorted(groups.items()):
    g['vehicles']=sorted(g['vehicles']);summary.append({'date':date,'service':service,**g})
if sum(g['boardings'] for g in summary)!=sum(g['windowBoardings'] for g in summary):raise ValueError('Boardings do not reconcile to queue windows')
# Confirm passenger matches using the broader origin departure table.
handouts=json.loads((ROOT/'apps/web/lib/fleet-data.json').read_text())
reports=next(t['rows'] for t in handouts['tables'] if t['sheet']=='Passenger reports')
passengers=[]
for case in reports:
    matches=[]
    timekey='scheduled_departure_at' if case['Journey time basis']=='Expected departure' else 'actual_departure_at'
    for trip in trips:
        time=dt.datetime.fromisoformat(trip[timekey]).strftime('%Y-%m-%d %H:%M:%S')
        if trip['origin_stop_id']!=case['Reported stop ID']:continue
        if case['Reported service no'] and trip['service_no']!=str(case['Reported service no']):continue
        if case['Reported vehicle ID'] and trip['actual_vehicle_id']!=case['Reported vehicle ID']:continue
        if case['Journey window start']<=time<=case['Journey window end']:
            matches.append({**trip,'origin':origins[trip['trip_id']]})
    passengers.append({'caseId':case['Case ID'],'matches':matches})
manifest['dates']=sorted({r['service_date'] for r in trips})
manifest['services']=sorted({r['service_no'] for r in trips},key=lambda x:int(x) if x.isdigit() else 10000)
manifest['coverage']={'vehicles':len(tables['vehicles']),'workshopVehicles':len(tables['workshop_vehicles']),'trips':len(trips),'stopCalls':len(tables['stop_calls']),'services':len(manifest['services']),'routes':len(routes),'stops':len(stops)}
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
write_gzip(OUT/'summary.json.gz',json.dumps({'groups':summary,'hotspots':hotspots,'workshop':tables['workshop_work_orders']},separators=(',',':')).encode())
(ROOT/'apps/web/lib/operations-passengers.json').write_text(json.dumps(passengers,indent=2)+'\n')
runpy.run_path(str(ROOT / 'scripts/build-boarding-history.py'))
print(json.dumps(manifest['coverage']))
print('Imported',len(manifest['tables']),'tables; reconciled stop/queue accounting. Matched passenger cases:',[(c['caseId'],len(c['matches'])) for c in passengers])
print('Compressed snapshot bytes:',sum(p.stat().st_size for p in OUT.iterdir()))
