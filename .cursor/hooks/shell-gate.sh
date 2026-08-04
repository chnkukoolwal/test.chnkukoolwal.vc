#!/usr/bin/env bash
# MC 7.2 — beforeShellExecution: allow / ask / deny for sandbox course gates
set -euo pipefail

input=$(cat)
mkdir -p .cursor/hooks/state
ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
cmd=$(echo "$input" | jq -r '.command // empty')

printf '[%s] beforeShellExecution command=%q\n' "$ts" "$cmd" >> .cursor/hooks/state/mc72-audit.log

# Explicit lesson deny marker (safe proof — does not touch prod)
if [[ "$cmd" == *MC72-DENY-DEMO* ]]; then
  jq -n \
    --arg c "$cmd" \
    '{
      permission: "deny",
      user_message: "MC 7.2 shell gate denied this command (demo marker MC72-DENY-DEMO).",
      agent_message: ("Denied by project hook shell-gate.sh. Command contained MC72-DENY-DEMO: " + $c)
    }'
  exit 0
fi

# Hard deny: classic foot-guns
if [[ "$cmd" =~ (^|[[:space:]])rm[[:space:]]+-rf[[:space:]]+/($|[[:space:]]) ]] || \
   [[ "$cmd" == *"rm -rf /*"* ]]; then
  jq -n '{
    permission: "deny",
    user_message: "Blocked destructive rm -rf / by project hook.",
    agent_message: "shell-gate.sh denied a destructive root wipe command."
  }'
  exit 0
fi

# Deny shell exfil of secret filenames (complements beforeReadFile)
if [[ "$cmd" =~ (^|[[:space:]])(cat|head|tail|less|more|bat|type)[[:space:]] ]] && \
   [[ "$cmd" == *".dev.vars"* || "$cmd" == *".env"* || "$cmd" == *"credentials.json"* ]]; then
  # Allow reading checked-in examples
  if [[ "$cmd" != *".env.example"* && "$cmd" != *".dev.vars.example"* ]]; then
    jq -n \
      --arg c "$cmd" \
      '{
        permission: "deny",
        user_message: "MC 7.2 shell gate blocked reading a secret-ish file via shell.",
        agent_message: ("Denied secret file read via shell: " + $c + ". Use non-secret examples only.")
      }'
    exit 0
  fi
fi

# Ask: deploy / push / publish class commands (human must approve)
if [[ "$cmd" =~ wrangler[[:space:]]+deploy ]] || \
   [[ "$cmd" =~ (^|[[:space:]])git[[:space:]]+push([[:space:]]|$) ]] || \
   [[ "$cmd" =~ npm[[:space:]]+publish ]] || \
   [[ "$cmd" =~ gh[[:space:]]+pr[[:space:]]+merge ]]; then
  jq -n \
    --arg c "$cmd" \
    '{
      permission: "ask",
      user_message: ("MC 7.2 shell gate: review before running: " + $c),
      agent_message: ("Command matched deploy/push/publish gate. Wait for human approval: " + $c)
    }'
  exit 0
fi

jq -n '{ permission: "allow" }'
