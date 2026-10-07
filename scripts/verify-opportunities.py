#!/usr/bin/env python3
"""Check opportunity coverage and links; semantic distinctness needs human review."""
import argparse
import re
from pathlib import Path
from urllib.request import urlopen

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--expected', type=int, required=True)
parser.add_argument('--base-url', help='Optional running docs server origin')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
content = root / 'apps/docs/src/content/docs'
folder = content / 'explanations/opportunities'
pages = sorted(folder.glob('[0-9][0-9]-*.md'))
assert len(pages) == args.expected, f'Expected {args.expected} writeups, found {len(pages)}'
assert [int(p.name[:2]) for p in pages] == list(range(1, args.expected + 1))
index = (folder / 'index.md').read_text()
titles = set()
for page in pages:
    source = page.read_text()
    assert source.startswith('---\ntitle:'), page
    title = re.search(r'^title: (.+)$', source, re.M)[1]
    assert title not in titles, f'Duplicate title: {title}'
    titles.add(title)
    body = source.split('---', 2)[2].strip()
    assert body, f'Missing article body: {page}'
    route = '/docs/' + str(page.relative_to(content).with_suffix('')) + '/'
    assert route in index, f'Index omits {route}'
    for target in re.findall(r'\]\((/docs/[^)#]*)\)', source):
        slug = target.removeprefix('/docs/').rstrip('/')
        assert any(p.exists() for p in [content / f'{slug}.md', content / f'{slug}.mdx', content / slug / 'index.md']), (page, target)
    if args.base_url:
        with urlopen(args.base_url.rstrip('/') + route, timeout=10) as response:
            html = response.read().decode()
            assert response.status == 200
        title = re.search(r'^title: (.+)$', source, re.M)[1]
        assert title in html, (route, title)
    print(f'OK {page.name}')
print(f'OK {len(pages)} writeups, article bodies, index coverage, and internal links')
print('Semantic uniqueness and source claims require editorial review.')
