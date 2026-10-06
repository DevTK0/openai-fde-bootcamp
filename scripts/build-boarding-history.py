"""Rebuild the PC07 comparison from imported operations records.
Run after import-operations.py: python3 scripts/build-boarding-history.py
"""
import gzip
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'apps/web/data/operations'
LIB = ROOT / 'apps/web/lib'


def read_rows(name):
    with gzip.open(DATA / f'{name}.jsonl.gz', 'rt') as source:
        for line in source:
            yield json.loads(line)


case = next(c for c in json.loads((LIB / 'operations-passengers.json').read_text())
            if c['caseId'] == 'PC07')
assert len(case['matches']) == 1
anchor = case['matches'][0]
# Match the route, origin and scheduled time, allowing the actual bus to vary.
trips = {t['trip_id']: t for t in read_rows('trips')
         if t['route_id'] == anchor['route_id']
         and t['origin_stop_id'] == anchor['origin_stop_id']
         and t['scheduled_departure_at'][11:19] == anchor['scheduled_departure_at'][11:19]}
rows = []
for call in read_rows('stop_calls'):
    if call['trip_id'] not in trips or call['stop_order'] != 1:
        continue
    trip = trips[call['trip_id']]
    rows.append({
        'date': call['service_date'], 'tripId': call['trip_id'],
        'callId': call['call_id'], 'vehicle': call['actual_vehicle_id'],
        'waiting': call['queue_before_people'], 'boarded': call['boarded_people'],
        'remaining': call['queue_after_people'], 'capacity': call['capacity_people'],
        'onboard': call['onboard_departing'],
        'reported': call['trip_id'] == anchor['trip_id'],
    })
rows.sort(key=lambda row: row['date'])
(LIB / 'boarding-history.json').write_text(json.dumps({
    'service': anchor['service_no'], 'route': anchor['route_id'],
    'stop': anchor['origin_stop_id'], 'departure': anchor['scheduled_departure_at'][11:16],
    'rows': rows,
}, indent=2) + '\n')
