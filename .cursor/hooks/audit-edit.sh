#!/usr/bin/env bash
# MC 7.2 — afterFileEdit: observe-only edit audit
set -euo pipefail

input=$(cat)
mkdir -p .cursor/hooks/state
ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
path=$(echo "$input" | jq -r '.file_path // empty')
edit_count=$(echo "$input" | jq -r '.edits | length // 0')

printf '[%s] afterFileEdit path=%q edits=%s\n' "$ts" "$path" "$edit_count" >> .cursor/hooks/state/mc72-audit.log
echo '{}'
