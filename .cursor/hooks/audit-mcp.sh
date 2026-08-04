#!/usr/bin/env bash
# MC 7.3 — afterMCPExecution: observe-only audit
set -euo pipefail

input=$(cat)
mkdir -p .cursor/hooks/state
ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

if command -v jq >/dev/null 2>&1; then
  tool=$(echo "$input" | jq -r '.tool_name // empty')
  duration=$(echo "$input" | jq -r '.duration // empty')
  printf '[%s] afterMCPExecution tool=%q duration_ms=%s\n' "$ts" "$tool" "$duration" >> .cursor/hooks/state/mc73-audit.log
else
  printf '[%s] afterMCPExecution %s\n' "$ts" "$input" >> .cursor/hooks/state/mc73-audit.log
fi

echo '{}'
