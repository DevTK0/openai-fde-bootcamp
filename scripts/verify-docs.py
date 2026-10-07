#!/usr/bin/env python3
"""Check a deployed docs site, including its nginx routing and CSS."""
import sys
from html.parser import HTMLParser
from urllib.error import HTTPError
from urllib.parse import unquote, urljoin, urlparse
from urllib.request import HTTPRedirectHandler, build_opener, urlopen


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stylesheets = []
        self.links = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
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

pages = {}
for path, title in [
    ("/docs/", "Overview"),
]:
    with urlopen(base + path, timeout=10) as response:
        assert response.status == 200
        assert response.headers.get_content_type() == "text/html"
        html = response.read().decode()
    assert title in html, path
    links = Links()
    links.feed(html)
    pages[path] = links
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

# Follow additional documentation pages exposed by the sidebar.
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
