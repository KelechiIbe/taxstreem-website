"""Build output -> a folder the preview host accepts (no names starting with "_", no legacy polyfill)."""
import os, re, shutil, json, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out, pv = os.path.join(root, 'out'), os.path.join(root, 'preview')
shutil.rmtree(pv, ignore_errors=True); shutil.copytree(out, pv)
for junk in ['404.html', 'index.txt', '404', 'team', '_next/static/media']:
    p = os.path.join(pv, junk)
    shutil.rmtree(p) if os.path.isdir(p) else (os.path.exists(p) and os.remove(p))
os.rename(os.path.join(pv, '_next'), os.path.join(pv, 'nx'))
build = [d for d in os.listdir(os.path.join(pv, 'nx/static')) if d not in ('chunks', 'css', 'media')][0]
os.rename(os.path.join(pv, 'nx/static', build), os.path.join(pv, 'nx/static/build'))
subs = [('_next/', 'nx/'), (build + '/_buildManifest', 'build/buildManifest'), (build + '/_ssgManifest', 'build/ssgManifest'), (build, 'build'), ('pages/_app-', 'pages/app-'), ('pages/_error-', 'pages/error-'), ('app/_not-found/', 'app/not-found/')]
for d, _, fs in os.walk(pv, topdown=False):
    for f in fs:
        p = os.path.join(d, f)
        if f.startswith('polyfills-'): os.remove(p); continue
        if f.endswith(('.js', '.html', '.css')):
            s = open(p, encoding='utf8').read()
            for a, b in subs: s = s.replace(a, b)
            if f == 'index.html':
                s = re.sub(r'<script src="[^"]*polyfills-[^"]*"[^>]*></script>', '', s)
                s = re.sub(r'<title>[^<]*</title>', '<title>TaxStreem Site Preview</title>', s)
            open(p, 'w', encoding='utf8').write(s)
        if f.startswith('_'): os.rename(p, os.path.join(d, f[1:]))
    if os.path.basename(d).startswith('_'): os.rename(d, os.path.join(os.path.dirname(d), os.path.basename(d)[1:]))
for f in ['partners/upwork.png', 'partners/grey.png', 'brand/countev-logo.svg'] + [f'{d}/{n}' for d in ('modules', 'brand') for n in os.listdir(os.path.join(pv, d)) if '-black' in n or '-dark' in n]:
    p = os.path.join(pv, f)
    os.path.exists(p) and os.remove(p)
files = sorted(os.path.relpath(os.path.join(d, f), pv) for d, _, fs in os.walk(pv) for f in fs if f != 'index.html')
json.dump([{'path': f} for f in files], open(os.path.join(root, 'preview-files.json'), 'w'))
print(len(files), 'files')
