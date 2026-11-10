"""Turn the approved copy document (saved Docs read) into src/content/copy.json: sections of typed blocks."""
import json, re, sys, html
from xml.etree import ElementTree as ET
src = sys.argv[1]
d = json.JSONDecoder().raw_decode(open(src).read())[0]
root = ET.fromstring(d['data']['xml'])

def runs(el):
    out = []
    for t in el.iter('text'):
        b = t.find('bold'); txt = ''.join(t.itertext())
        if txt: out.append({'t': txt, 'b': b is not None})
    # merge neighbours
    m = []
    for r in out:
        if m and m[-1]['b'] == r['b']: m[-1]['t'] += r['t']
        else: m.append(dict(r))
    return m
def text(el): return ''.join(r['t'] for r in runs(el)).strip()

blocks = []
for el in root:
    if el.tag == 'paragraph':
        h = el.get('heading'); r = runs(el)
        if not r: continue
        blocks.append({'k': 'h' + h if h else 'p', 'r': r, 'x': ''.join(x['t'] for x in r).strip()})
    elif el.tag == 'table':
        rows = [[{'x': text(c), 'r': runs(c)} for c in row.findall('cell')] for row in el.findall('row')]
        blocks.append({'k': 'table', 'head': [c['x'] for c in rows[0]], 'rows': rows[1:]})
    elif el.tag == 'list':
        blocks.append({'k': 'ol' if el.get('kind') == 'ordered' else 'ul', 'items': [{'x': text(li), 'r': runs(li)} for li in el.findall('listItem')]})

# sections: h2 then h3 inside the page groups
secs, cur2, cur = {}, None, None
PAGE_GROUPS = {'Product pages', 'Solutions pages', 'Pricing, Partners, Modules and company pages'}
for b in blocks:
    if b['k'] == 'h2' and (b['x'] in PAGE_GROUPS or b['x'] in ('Home', 'Martina', 'Header, menus and footer', 'Search and AI answers', 'What changed from v2')):
        cur2 = b['x']; cur = cur2 if cur2 not in PAGE_GROUPS else None
        if cur: secs[cur] = []
        continue
    if b['k'] == 'h3' and cur2 in PAGE_GROUPS:
        cur = b['x']; secs[cur] = []; continue
    if cur: secs[cur].append(b)
json.dump(secs, open('src/content/copy.json', 'w'), ensure_ascii=False)
if '--outline' in sys.argv:
    for name, bl in secs.items():
        if name in ('Home', 'Header, menus and footer', 'What changed from v2'): continue
        print('\n##', name, len(bl))
        for b in bl:
            if b['k'] == 'table': print('   table', b['head'], len(b['rows']), '| first:', ' / '.join(c['x'][:26] for c in b['rows'][0]))
            elif b['k'] in ('ol', 'ul'): print('  ', b['k'], len(b['items']), b['items'][0]['x'][:60])
            else: print('  ', b['k'], ('*' if b['r'][0]['b'] else ' '), b['x'][:92])
