#!/bin/sh
# render.sh — rebuild page.html and render it to entry.png (1024x1024).
# Headless Chromium's --screenshot viewport comes out ~122px shorter than
# the requested window height in this environment, so we screenshot at
# 1024x1200 and crop the top 1024 rows, which hold the whole 1024px page.
set -e
cd "$(dirname "$0")"
node generator/build-page.mjs
CHROME="${CHROME:-$HOME/.cloakbrowser/chromium-146.0.7680.177.5/chrome}"
rm -rf /tmp/chrome-ledger-render
"$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --force-device-scale-factor=1 --user-data-dir=/tmp/chrome-ledger-render \
  --window-size=1024,1200 --screenshot=/tmp/ledger-raw.png \
  "file://$PWD/page.html"
python3 -c "
from PIL import Image
im = Image.open('/tmp/ledger-raw.png')
assert im.size[0] == 1024 and im.size[1] >= 1024
im.crop((0, 0, 1024, 1024)).save('entry.png')
print('entry.png:', __import__('os').path.getsize('entry.png'), 'bytes')
"
