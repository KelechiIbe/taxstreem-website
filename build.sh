#!/bin/sh
# Preview build: flat pages for the preview host. Usage: sh build.sh
cd "$(dirname "$0")" && python3 scripts/cms-images.py | tail -1 && rm -rf out .next && PREVIEW=1 NEXT_PUBLIC_BASE=. NEXT_PUBLIC_FLAT=1 NEXT_TELEMETRY_DISABLED=1 npx next build 2>&1 | grep -E "rror|Failed|✓ Generating" ; python3 scripts/preview.py
(pkill -f "http.server 4174"; true); (cd preview && nohup python3 -m http.server 4174 >/dev/null 2>&1 &); sleep 1
