"""Preview only: the preview host cannot load pictures from other sites, so copy the CMS pictures in and note where each went."""
import json, os, hashlib, io, urllib.request, ssl
from PIL import Image
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.environ.get('CMS_URL', 'https://taxstreem-cms-backend-61341992308.us-central1.run.app') + '/api/v1/public'
ctx = ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE') or os.environ.get('REQUESTS_CA_BUNDLE') or None)
def get(u, t=25):
    return urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'}), timeout=t, context=ctx).read()
urls = []
try:
    a = json.loads(get(BASE + '/articles'))['articles']
    for x in a:
        urls.append(x.get('coverImage')); urls += [b.get('url') for b in x['body'] if b.get('type') == 'image']
    urls += [v.get('thumbnail') for v in json.loads(get(BASE + '/videos'))['videos']]
    urls += [n.get('thumbnail') for n in json.loads(get(BASE + '/newsroom'))['items']]
except Exception as e:
    print('CMS not reachable:', e)
out = {}; os.makedirs(os.path.join(root, 'public/cms'), exist_ok=True)
for u in [u for u in dict.fromkeys(urls) if u]:
    name = hashlib.sha1(u.encode()).hexdigest()[:12] + '.jpg'; dest = os.path.join(root, 'public/cms', name)
    try:
        if not os.path.exists(dest):
            im = Image.open(io.BytesIO(get(u))).convert('RGB'); im.thumbnail((1280, 1280)); im.save(dest, quality=78, optimize=True, progressive=True)
        out[u] = '/cms/' + name
    except Exception as e:
        print('skipped', u[:70], str(e)[:60])
json.dump(out, open(os.path.join(root, 'src/content/cms-images.json'), 'w'), indent=0)
print(len(out), 'of', len([u for u in dict.fromkeys(urls) if u]), 'pictures copied')
