"""Convert supplied XLSX/CSV sources to a reproducible dashboard snapshot (stdlib only)."""
import csv
import datetime as dt
import json
import pathlib
import re
import sys
import xml.etree.ElementTree as ET
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'Data'
NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}


def read_workbook(path):
    tables = []
    with zipfile.ZipFile(path) as z:
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            strings = [''.join(n.itertext()) for n in ET.fromstring(z.read('xl/sharedStrings.xml'))]
        styles = ET.fromstring(z.read('xl/styles.xml'))
        formats = {int(n.get('numFmtId')): n.get('formatCode') for n in styles.findall('s:numFmts/s:numFmt', NS)}
        style_formats = [int(n.get('numFmtId')) for n in styles.find('s:cellXfs', NS)]
        rels = {n.get('Id'): n.get('Target') for n in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
        for sheet in ET.fromstring(z.read('xl/workbook.xml')).find('s:sheets', NS):
            target = rels[sheet.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')]
            target = target.lstrip('/') if target.startswith('/') else 'xl/' + target
            rows = []
            for row in ET.fromstring(z.read(target)).findall('s:sheetData/s:row', NS):
                values = {}
                for c in row:
                    col = 0
                    for ch in re.match('[A-Z]+', c.get('r'))[0]:
                        col = col * 26 + ord(ch) - 64
                    v = c.find('s:v', NS)
                    value = v.text if v is not None else None
                    if c.get('t') == 's':
                        value = strings[int(value)]
                    elif c.get('t') == 'inlineStr':
                        value = ''.join(c.find('s:is', NS).itertext())
                    elif value is not None and c.get('t') not in ('str', 'e'):
                        value = float(value)
                        fmt_id = style_formats[int(c.get('s', 0))]
                        fmt = formats.get(fmt_id, '')
                        if fmt_id in range(14, 23) or re.search('[ydh]', re.sub(r'"[^"]*"', '', fmt), re.I):
                            date = dt.datetime(1899, 12, 30) + dt.timedelta(seconds=round(value * 86400))
                            value = date.strftime('%Y-%m-%d %H:%M:%S' if 'h' in fmt.lower() or fmt_id in (18,19,20,21,22) else '%Y-%m-%d')
                        elif value.is_integer():
                            value = int(value)
                    values[col - 1] = value if value != '' else None
                vals = [values.get(i) for i in range(max(values, default=-1) + 1)]
                rows.append((int(row.get('r')), vals))
            notes = [' '.join(str(v) for v in vals if v is not None) for _, vals in rows if sum(v is not None for v in vals) == 1]
            title = sheet.get('name')
            active = None
            for row_num, vals in rows:
                count = sum(v is not None for v in vals)
                if count < 2:
                    active = None
                    if count == 1:
                        title = str(next(v for v in vals if v is not None))
                    continue
                if active is None:
                    headers = [str(v) for v in vals if v is not None]
                    active = {'id': f'{path.stem}/{sheet.get("name")}/{row_num}', 'file': path.name, 'sheet': sheet.get('name'), 'title': title, 'columns': headers, 'rows': [], 'sourceRows': [], 'notes': notes}
                    tables.append(active)
                else:
                    active['rows'].append({key: vals[i] if i < len(vals) else None for i, key in enumerate(active['columns'])})
                    active['sourceRows'].append(row_num)
    return tables


def read_csv(path):
    with path.open(newline='') as f:
        reader = csv.DictReader(f)
        rows = []
        for row in reader:
            for key, value in row.items():
                if not value:
                    row[key] = None
                elif re.fullmatch(r'-?\d+(\.\d+)?', value):
                    number = float(value)
                    row[key] = int(number) if number.is_integer() else number
            rows.append(row)
        return {'id': path.stem, 'file': str(path.relative_to(SOURCE)), 'sheet': 'CSV', 'title': path.stem.replace('_', ' ').title(), 'columns': reader.fieldnames, 'rows': rows, 'sourceRows': list(range(2, len(rows) + 2)), 'notes': ['Monthly views overlap workbook summaries. Do not add duplicate records. See the data dictionary for scope and definitions.']}


tables = [table for path in sorted(SOURCE.glob('*.xlsx')) for table in read_workbook(path)]
tables += [read_csv(path) for path in sorted(SOURCE.rglob('*.csv'))]
output = {'tables': tables, 'documents': [{'file': str(p.relative_to(SOURCE)), 'text': p.read_text()} for p in sorted(SOURCE.rglob('*.md'))]}
(ROOT / 'apps/web/lib/fleet-data.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
print(f'Imported {len(tables)} tables, {sum(len(t["rows"]) for t in tables)} source rows (includes overlapping views).')
for t in tables:
    print(f'{t["sheet"]} / {t["title"]}: {len(t["rows"])}')
