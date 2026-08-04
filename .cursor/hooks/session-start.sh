#!/usr/bin/env bash
# MC 7.1 — sessionStart: inject sandbox law + write audit line
set -euo pipefail

input=$(cat)
mkdir -p .cursor/hooks/state
ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
printf '[%s] sessionStart %s\n' "$ts" "$input" >> .cursor/hooks/state/mc71-audit.log

cat <<'EOF'
{
  "additional_context": "SANDBOX HOOK ACTIVE (MC 7.x): Workspace is chnkukoolwal/test.chnkukoolwal.vc only. Allowed writes: Worker test0chnkukoolwal0vc, domain test.chnkukoolwal.vc, KV test-chnkukoolwal-flags, Slack #os-test0chnkukoolwal0vc (C0BM04ZA7FF), Google ckoolwal@gmail.com, Notion teamspace test.chnkukoolwal.vc. Never mutate Brand/Avvyun production. Cloud Agents: project COMMAND hooks travel with the repo; prompt hooks and MCP hooks do NOT run in Cloud — see .cursor/hooks/README.md."
}
EOF
