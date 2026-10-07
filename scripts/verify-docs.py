#!/usr/bin/env python3
"""Check a deployed docs site, including its nginx routing and CSS."""
import sys
import json
import gzip
from pathlib import Path
from html.parser import HTMLParser
from urllib.error import HTTPError
from urllib.parse import unquote, urljoin, urlparse
from urllib.request import HTTPRedirectHandler, build_opener, urlopen


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stylesheets = []
        self.links = []
        self.charts = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if "data-report-chart" in attrs:
            self.charts.append(json.loads(attrs["data-report-chart"]))
        if tag == "a" and "href" in attrs:
            self.links.append(attrs["href"])
        if tag == "link" and attrs.get("rel") == "stylesheet":
            self.stylesheets.append(attrs["href"])


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


base = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://127.0.0.1:8000"
try:
    build_opener(NoRedirect).open(base + "/docs?check=1", timeout=10)
    raise AssertionError("/docs should redirect")
except HTTPError as response:
    assert response.code == 308, response.code
    assert response.headers["Location"] == "/docs/?check=1", response.headers

charts = {}
pages = {}
for path, title in [
    ("/docs/", "Understand your fleet"),
    ("/docs/getting-started/", "Read a maintenance comparison"),
    ("/docs/explore-records/", "Trace a finding to its records"),
    ("/docs/compare-reports/", "Compare report periods"),
    ("/docs/applications/", "Evidence sources"),
    ("/docs/measures/", "Measures and coverage"),
    ("/docs/maintenance-findings/", "Why repair spending needs a distance comparison"),
    ("/docs/reliability-findings/", "What the recorded journeys say about reliability"),
    ("/docs/crowding-findings/", "Why a remaining queue does not always mean a full bus"),
    ("/docs/workshop-findings/", "Why the workshop requests cannot run together"),
    ("/docs/passenger-findings/", "What six passenger accounts can tell us"),
    ("/docs/cost-findings/", "Why a lower quote is not automatically the better option"),
]:
    with urlopen(base + path, timeout=10) as response:
        assert response.status == 200
        assert response.headers.get_content_type() == "text/html"
        html = response.read().decode()
    assert title in html, path
    links = Links()
    links.feed(html)
    pages[path] = links
    charts.update({chart["title"]: chart for chart in links.charts})
    assert links.stylesheets, "Missing stylesheet"
    resolved_paths = [urlparse(urljoin(base + path, href)).path for href in links.links]
    assert "/docs/dashboard/" not in resolved_paths, "Dashboard incorrectly inside docs"
    assert "/docs/slides/" not in resolved_paths, "Slides incorrectly inside docs"
    assert not any(p.rstrip("/") in {"/dashboard", "/slides"} for p in resolved_paths), "App shortcuts should not appear in docs"
    for stylesheet in links.stylesheets:
        assert stylesheet.startswith("/docs/"), stylesheet
        with urlopen(base + stylesheet, timeout=10) as response:
            assert response.status == 200
            assert response.headers.get_content_type() == "text/css"
            assert response.read(), "Empty stylesheet"
    print(f"OK {path} and stylesheets")

# Follow additional documentation pages exposed by the sidebar, including opportunities.
pending = [href for page in pages.values() for href in page.links]
while pending:
    target = urlparse(urljoin(base + "/docs/", pending.pop()))
    if target.netloc != urlparse(base).netloc or not target.path.startswith("/docs/"):
        continue
    if target.path in pages:
        continue
    with urlopen(base + target.path, timeout=10) as response:
        assert response.status == 200
        assert response.headers.get_content_type() == "text/html"
        html = response.read().decode()
    page = Links()
    page.feed(html)
    pages[target.path] = page
    pending.extend(urljoin(target.path, href) for href in page.links)
    print(f"OK discovered {target.path}")

for path, page in pages.items():
    for href in page.links:
        target = urlparse(urljoin(base + path, href))
        if target.netloc != urlparse(base).netloc:
            continue
        assert target.path in pages, (path, href)
        if target.fragment:
            assert unquote(target.fragment) in pages[target.path].ids, (path, href)
print("OK internal page links and heading anchors")

for path in ["/docs/does-not-exist/", "/docs/_astro/missing.css", "/docs/deployment/", "/docs/vm-deployment/", "/docs/authoring/", "/docs/development/", "/docs/data/", "/docs/workspace/", "/docs/data-flow/"]:
    try:
        urlopen(base + path, timeout=10)
        raise AssertionError(f"{path} should return 404")
    except HTTPError as response:
        assert response.code == 404, response.code
print("OK redirect, query string, and missing paths")

# Independently reconcile published chart payloads against the source records.
root = Path(__file__).resolve().parent.parent
fleet = json.loads((root / "apps/web/lib/fleet-data.json").read_text())
monthly = next(t["rows"] for t in fleet["tables"] if t["id"] == "monthly_vehicle_history")
expected_costs = []
expected_rates = []
for start, end, name in [("2024-10", "2025-09", "2024–25"), ("2025-10", "2026-09", "2025–26")]:
    rows = [r for r in monthly if start <= r["month"] <= end]
    repairs = sum(r["repair_cost_sgd"] for r in rows)
    expected_costs.append({"name": name, "repairs": repairs,
        "routine": sum(r["scheduled_service_cost_sgd"] for r in rows),
        "preventive": sum(r["additional_preventive_cost_sgd"] for r in rows)})
    expected_rates.append({"name": name, "rate": repairs / sum(r["recorded_km"] for r in rows) * 1000})
assert charts["Recorded maintenance costs across two years"]["rows"] == expected_costs
assert charts["Repair cost for the distance recorded"]["rows"] == expected_rates
with gzip.open(root / "apps/web/data/operations/summary.json.gz", "rt") as stream:
    groups = json.load(stream)["groups"]
departures = [d for group in groups for d in group["departureDelays"]]
assert charts["Departure timing in the recorded journeys"]["rows"] == [
    {"name": "Early", "trips": sum(d < 0 for d in departures)},
    {"name": "0–5 min late", "trips": sum(0 <= d <= 300 for d in departures)},
    {"name": "Over 5 min late", "trips": sum(d > 300 for d in departures)},
]
assert charts["Passenger queue accounting"]["rows"] == [
    {"name": label, "people": sum(g[key] for g in groups)}
    for label, key in [("Initial queue", "initialQueue"), ("New arrivals", "arrivals"),
                       ("Boarded", "boardings"), ("Remaining", "remainingQueue")]
]
assert sum(g["initialQueue"] + g["arrivals"] for g in groups) == sum(g["boardings"] + g["remainingQueue"] for g in groups)
expected_arrivals = []
for date in sorted({g["date"] for g in groups}):
    values = sorted(v for g in groups if g["date"] == date for v in g["arrivalDelays"])
    index = (len(values) - 1) * 0.9
    lower = int(index)
    p90 = (values[lower] + (values[min(lower + 1, len(values)-1)] - values[lower]) * (index-lower)) / 60
    expected_arrivals.append({"name": date[5:], "mean": sum(values) / len(values) / 60, "p90": p90})
assert charts["Arrival delay by recorded date"]["rows"] == expected_arrivals
requests = next(t["rows"] for t in fleet["tables"] if t["title"] == "Requested maintenance")
capacity = next(t["rows"] for t in fleet["tables"] if t["title"] == "Bay and staffing capacity")
assert charts["Requests overlap the available workshop capacity"]["rows"] == [
    {"name": label, "requested": sum(r[request_key] for r in requests), "available": sum(r[capacity_key] for r in capacity)}
    for label, request_key, capacity_key in [("Bays", "Required bays", "Available bays"), ("Technicians", "Required technicians", "Available technicians")]
]
reports = next(t["rows"] for t in fleet["tables"] if t["sheet"] == "Passenger reports")
channels = dict.fromkeys((r["Channel"] for r in reports), 0)
for row in reports:
    channels[row["Channel"]] += 1
assert charts["How the selected passenger accounts were received"]["rows"] == [{"name": name, "reports": count} for name, count in channels.items()]
quotes = next(t["rows"] for t in fleet["tables"] if t["sheet"] == "Cost options")
assert charts["Proposed maintenance packages have different scopes"]["rows"] == [{"name": r["Option ID"], "quote": r["Quoted price SGD"]} for r in quotes if r["Option"] != "Fleet replacement option"]
assert len(charts) == 8
print("OK all eight published graphs reconcile with source records")
