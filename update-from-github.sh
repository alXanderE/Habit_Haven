#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/alXanderE/Habit_Haven.git"
BRANCH="main"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$APP_DIR"

git remote set-url origin "$REPO_URL"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

pkill -f "node src/server.js" || true
nohup npm start > app.log 2>&1 &

echo "Update complete."
echo "App started with nohup. Logs: app.log"

