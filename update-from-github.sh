#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/alXanderE/Habit_Haven.git"
BRANCH="main"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$APP_DIR"

if [ ! -d .git ]; then
  echo "This folder is not a git repository. Cloning fresh copy..."
  cd ..
  rm -rf "$APP_DIR"
  git clone "$REPO_URL" "$(basename "$APP_DIR")"
  cd "$APP_DIR"
fi

git remote set-url origin "$REPO_URL"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

if command -v systemctl >/dev/null 2>&1; then
  sudo systemctl restart habit-haven || true
else
  pkill -f "node src/server.js" || true
  nohup npm start > app.log 2>&1 &
fi

echo "Update complete."
echo "If systemd was not available, the app was started with nohup and logs are in app.log"
