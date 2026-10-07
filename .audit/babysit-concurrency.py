from concurrent.futures import ThreadPoolExecutor
import json
import sys
import time
import urllib.request

base = sys.argv[1].rstrip('/')

def fetch(path):
    with urllib.request.urlopen(base + path, timeout=60) as response:
        assert response.status == 200
        return response.read()

fetch('/dashboard')
fetch('/api/operations?service=238&date=2026-10-06')
runs = []
for round in range(3):
    start = time.monotonic()
    def request(name, path):
        data = fetch(path)
        if name.startswith('search'):
            report = json.loads(data)
            assert report['total'] == 0 and report['rows'] == []
        elif name == 'summary':
            assert json.loads(data)['metrics']['trips'] == 18
        else:
            assert b'Fleet overview' in data
        return name, time.monotonic() - start
    with ThreadPoolExecutor(max_workers=4) as executor:
        searches = [executor.submit(request, 'search' + str(i), '/api/operations?view=records&table=stop_calls&q=absent-proof-' + str(round) + '-' + str(i)) for i in range(2)]
        time.sleep(0.05)
        assert all(not future.done() for future in searches)
        unrelated = [executor.submit(request, 'page', '/dashboard'), executor.submit(request, 'summary', '/api/operations?service=238&date=2026-10-06')]
        results = dict(future.result() for future in searches + unrelated)
        results['responsive'] = max(results['page'], results['summary']) < min(results['search0'], results['search1'])
        runs.append(results)
print(json.dumps(runs, indent=2))
assert all(run['responsive'] for run in runs), 'Page and summary must finish while both absent searches are still running'
