#!/usr/bin/env bash
# MC 7.1 — afterShellExecution: observe-only audit (fail-open)
set -euo pipefail

input=$(cat)
mkdir -p .cursor/hooks/state
ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Prefer jq when available; otherwise log raw JSON
# afterShellExecution payload: command, output, duration, sandbox
if command -v jq >/dev/null 2>&1; then
  cmd=$(echo "$input" | jq -r '.command // empty')
  duration=$(echo "$input" | jq -r '.duration // empty')
  sandbox=$(echo "$input" | jq -r '.sandbox // empty')
  printf '[%s] afterShellExecution command=%q duration_ms=%s sandbox=%s\n' "$ts" "$cmd" "$duration" "$sandbox" >> .cursor/hooks/state/mc71-audit.log
else
  printf '[%s] afterShellExecution %s\n' "$ts" "$input" >> .cursor/hooks/state/mc71-audit.log
fi

# Observe-only: empty JSON object is a valid no-op response
echo '{}'
