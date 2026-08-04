#!/bin/bash
# Deploy the tip of main to the weiztech.com app ONLY (never touches /home/weiz).
set -u
APP=/home/weiztech-english/app
NODE=/home/weiztech-english/.nvm/versions/node/v22.23.2/bin
SHA=main   # deploys the tip of main; the script prints the commit it fetched
STAMP=$(date +%Y%m%d-%H%M%S)

echo "=== 1. Download from GitHub ==="
curl -sfL "https://codeload.github.com/wpcoderakash/weiztech-english/tar.gz/$SHA" -o /tmp/repo.tar.gz || { echo "FATAL: download failed"; exit 1; }
rm -rf /tmp/repo-sync && mkdir /tmp/repo-sync
tar xzf /tmp/repo.tar.gz -C /tmp/repo-sync --strip-components=1
ls /tmp/repo-sync | head -5

echo "=== 2. Backup ==="
cd "$APP" || exit 1
tar czf "/root/weiztech-backup-$STAMP.tar.gz" src public next.config.ts package.json package-lock.json supabase 2>/dev/null
echo "backup: /root/weiztech-backup-$STAMP.tar.gz ($(du -h /root/weiztech-backup-$STAMP.tar.gz | cut -f1))"

echo "=== 3. Sync code (src, public, config, deps, migrations) ==="
rm -rf "$APP/src"
cp -R /tmp/repo-sync/src "$APP/src"
cp -R /tmp/repo-sync/public/. "$APP/public/"
cp /tmp/repo-sync/next.config.ts /tmp/repo-sync/package.json /tmp/repo-sync/package-lock.json /tmp/repo-sync/tsconfig.json "$APP/"
mkdir -p "$APP/supabase" && cp -R /tmp/repo-sync/supabase/. "$APP/supabase/"
chown -R weiztech-english:weiztech-english "$APP/src" "$APP/public" "$APP/next.config.ts" "$APP/package.json" "$APP/package-lock.json" "$APP/tsconfig.json" "$APP/supabase"
echo "synced"

echo "=== 4. npm ci-style install (lockfile may have drifted) ==="
su weiztech-english -c "export PATH=$NODE:\$PATH && cd $APP && npm install --no-audit --no-fund" 2>&1 | tail -3

echo "=== 5. Build ==="
su weiztech-english -c "export PATH=$NODE:\$PATH && cd $APP && npm run build" 2>&1 | tail -6
BUILD_RC=${PIPESTATUS[0]}
if [ "$BUILD_RC" != "0" ]; then
  echo "BUILD FAILED — ROLLING BACK"
  cd "$APP" && rm -rf src && tar xzf "/root/weiztech-backup-$STAMP.tar.gz"
  chown -R weiztech-english:weiztech-english "$APP"
  su weiztech-english -c "export PATH=$NODE:\$PATH && cd $APP && npm install --no-audit --no-fund >/dev/null 2>&1 && npm run build" >/dev/null 2>&1
  su weiztech-english -c "export PATH=$NODE:\$PATH && pm2 restart weiztech" >/dev/null 2>&1
  echo "ROLLED BACK"
  exit 1
fi
echo "BUILD OK"

echo "=== 6. Restart weiztech only ==="
su weiztech-english -c "export PATH=$NODE:\$PATH && pm2 restart weiztech --update-env" 2>&1 | grep -E "weiztech|✓" | head -3
sleep 4
su weiztech-english -c "export PATH=$NODE:\$PATH && pm2 ls" 2>/dev/null | grep weiztech

echo "=== 7. Smoke ==="
PORT_GUESS=$(grep -o '"PORT"[^,]*' /home/weiztech-english/.pm2/dumps/* 2>/dev/null | head -1)
for p in / /contact-us/ /quote/; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -H "Host: weiztech.com" http://127.0.0.1:3000$p 2>/dev/null)
  echo "  127.0.0.1:3000$p -> $code"
done
echo "=== DEPLOY COMPLETE $SHA ==="
