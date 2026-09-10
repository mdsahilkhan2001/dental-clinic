#!/usr/bin/env bash
# One-off: rewrite ALL commits on `main` so the author/committer is
#   Md Sahil Khan <mdsahilkhan2001@gmail.com>
# and strip every "Co-Authored-By: Claude ..." / "Generated with ... Claude Code"
# line from commit messages, then force-push to origin/main.
#
# ⚠️ This REWRITES history and FORCE-PUSHES. Anyone who already cloned must
#    re-clone or `git fetch && git reset --hard origin/main`.
#
# Run from the repo root:  bash rewrite-git-identity.sh
# Delete this file afterwards.

set -euo pipefail
cd "$(dirname "$0")"

NEW_NAME="Md Sahil Khan"
NEW_EMAIL="mdsahilkhan2001@gmail.com"

git config user.name  "$NEW_NAME"
git config user.email "$NEW_EMAIL"

echo "Before:"
git log --format='  %h | %an <%ae> | %s'

FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f \
  --env-filter "
    export GIT_AUTHOR_NAME='$NEW_NAME'
    export GIT_AUTHOR_EMAIL='$NEW_EMAIL'
    export GIT_COMMITTER_NAME='$NEW_NAME'
    export GIT_COMMITTER_EMAIL='$NEW_EMAIL'
  " \
  --msg-filter "sed -e '/^[Cc]o-[Aa]uthored-[Bb]y: *Claude/d' -e '/Generated with .*Claude Code/d'" \
  -- --all

# Drop the filter-branch backup + shrink
git for-each-ref --format='%(refname)' refs/original/ | while read -r r; do
  git update-ref -d "$r"
done
git reflog expire --expire=now --all
git gc --prune=now --quiet

echo
echo "After:"
git log --format='  %h | %an <%ae> | %s'

echo
echo "Force-pushing to origin/main ..."
git push --force-with-lease origin main

echo
echo "Done. You can now delete this script:  rm rewrite-git-identity.sh"
