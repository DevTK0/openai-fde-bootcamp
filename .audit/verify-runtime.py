from pathlib import Path
from contextlib import ExitStack
import sys
import gzip
import hashlib
import json
import sqlite3
import urllib.request

root = Path(__file__).resolve().parents[1]
base = sys.argv[1].rstrip('/')
backup = root / '.audit/hidden-fixtures'
backup.mkdir(exist_ok=True)
fixtures = [root / 'apps/web/data/operations'] + [root / ('apps/web/lib/' + name + '.json') for name in ['fleet-data', 'operations-passengers', 'boarding-history']]
with ExitStack() as cleanup:
    for original in fixtures:
        moved = backup / original.name
        original.rename(moved)
        cleanup.callback(moved.rename, original)
    with sqlite3.connect('file:' + str(root / 'data/operations/lionlink-network.sqlite') + '?mode=ro', uri=True) as db:
        manifest = json.loads(db.execute("select value from dashboard_metadata where name='operations'").fetchone()[0])
    def read(path):
        with urllib.request.urlopen(base + path, timeout=30) as response:
            assert response.status == 200
            return response.read()
    assert b'Fleet overview' in read('/dashboard')
    for table in manifest['tables']:
        data = json.loads(read('/api/operations?view=records&table=' + table['id']))
        assert data['total'] == table['count']
        assert len(data['rows']) == min(25, table['count'])
        csv = gzip.decompress(read('/api/operations?view=download&table=' + table['id']))
        assert hashlib.sha256(csv).hexdigest() == table['sha256']
    report = json.loads(read('/api/operations'))
    assert report['metrics']['trips'] == 6900
    assert report['metrics']['boardings'] == 2048591
    report = json.loads(read('/api/operations?service=238&date=2026-10-06'))
    assert report['metrics']['trips'] == 18
    assert report['metrics']['boardings'] == 3054
    print('PASS production dashboard, all 21 table APIs and downloads, unfiltered and filtered reports with JSON/CSV fixtures unavailable')
print('PASS restored every source fixture')
