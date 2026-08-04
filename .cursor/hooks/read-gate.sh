#!/usr/bin/env bash
# MC 7.2 — beforeReadFile: deny secret-ish files from entering model context
set -euo pipefail

input=$(cat)
mkdir -p .cursor/hooks/state
ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
path=$(echo "$input" | jq -r '.file_path // empty')
base=$(basename "$path")

printf '[%s] beforeReadFile path=%q\n' "$ts" "$path" >> .cursor/hooks/state/mc72-audit.log

# Allow checked-in examples / templates
if [[ "$base" == ".env.example" || "$base" == ".dev.vars.example" ]]; then
  jq -n '{ permission: "allow" }'
  exit 0
fi

deny=false
case "$base" in
  .env|.dev.vars|credentials.json|id_rsa|id_ed25519)
    deny=true
    ;;
esac

if [[ "$base" == .env.* || "$base" == *.pem ]]; then
  deny=true
fi

if [[ "$deny" == true ]]; then
  jq -n \
    --arg p "$path" \
    '{
      permission: "deny",
      user_message: ("MC 7.2 read gate blocked secret file: " + $p)
    }'
  exit 0
fi

jq -n '{ permission: "allow" }'
