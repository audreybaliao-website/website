#!/bin/bash
# Dhey Creates: one-click deploy
# Double-click this file to push your latest changes live to Vercel.

set -u
cd "$(dirname "$0")"

printf '\n========================================\n'
printf '   Dhey Creates · Audrey Baliao : Deploy\n'
printf '========================================\n\n'

if [ ! -d ".git" ]; then
  echo "❌ This file is not inside a git project. Aborting."
  echo ""
  echo "First-time setup: run 'git init', then add a GitHub remote, before"
  echo "you can use Deploy.command."
  echo ""
  read -n 1 -s -r -p "Press any key to close..."
  exit 1
fi

echo "🔎 Running pre-deploy audit..."
mkdir -p docs
set -o pipefail
bash scripts/audit 2>&1 | tee docs/audit-latest.txt
AUDIT_EXIT=${PIPESTATUS[0]}
set +o pipefail
if [ "$AUDIT_EXIT" -ne 0 ]; then
  echo ""
  echo "❌ System audit blocked the deploy. See docs/audit-latest.txt"
  read -n 1 -s -r -p "Press any key to close..."
  exit 1
fi
echo ""

echo "📄 Refreshing manuals (docs/Dhey Creates - Manual.pdf)..."
if python3 scripts/generate-manuals.py 2>&1; then
  echo "   Done."
else
  echo "   ⚠️  Manual generation failed: continuing with deploy anyway."
fi
echo ""

echo "📦 Looking for changes since your last deploy..."
echo ""

git add -A

if [ -n "$(git diff --cached --name-only 2>/dev/null)" ]; then
  echo "Files staged for deploy:"
  git status --short
  echo ""
  STAMP=$(date '+%b %-d, %Y at %-I:%M %p')
  COMMIT_MSG="Update on $STAMP"
  git commit -m "$COMMIT_MSG" >/dev/null
  echo "✏️  Committed as: \"$COMMIT_MSG\""
  echo ""
else
  echo "📋 No new file changes since the last commit."
  echo ""
fi

echo "🚀 Pushing to GitHub..."
echo ""
if git push origin HEAD:main 2>&1; then
  echo ""
  echo "✅ Push succeeded."
  echo "   Vercel will rebuild your live site in about 90 seconds."
else
  echo ""
  echo "❌ Push failed. See the message above."
  echo ""
  echo "Most common cause: your GitHub token does not have"
  echo "Contents: Read and write permission, or it expired."
  echo "Generate a new token at:"
  echo "  https://github.com/settings/personal-access-tokens"
  echo "and update the URL in .git/config."
  echo ""
fi

echo ""
read -n 1 -s -r -p "Press any key to close..."
echo ""
