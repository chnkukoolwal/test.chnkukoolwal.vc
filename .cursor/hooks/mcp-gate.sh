#!/usr/bin/env bash
# MC 7.3 — beforeMCPExecution: sandbox MCP firewall (failClosed in hooks.json)
# Always exits 0 with valid JSON so decisions stay explicit under failClosed.
set -u

mkdir -p .cursor/hooks/state
ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
ALLOW_SLACK_CHANNEL="C0BM04ZA7FF"

emit() {
  # $1 = json object string
  printf '%s\n' "$1"
  exit 0
}

deny() {
  emit "$(jq -n --arg u "$1" --arg a "$2" '{
    permission: "deny",
    user_message: $u,
    agent_message: $a
  }')"
}

ask() {
  emit "$(jq -n --arg u "$1" --arg a "$2" '{
    permission: "ask",
    user_message: $u,
    agent_message: $a
  }')"
}

allow() {
  emit '{"permission":"allow"}'
}

# Fail closed on unexpected errors inside this script
trap 'deny "MC 7.3 mcp-gate error (failClosed)." "mcp-gate.sh hit an unexpected error; action denied."' ERR

input=$(cat)
if ! command -v jq >/dev/null 2>&1; then
  deny "MC 7.3 mcp-gate: jq missing (failClosed)." "Install jq so the MCP gate can evaluate tool calls."
fi

tool=$(echo "$input" | jq -r '.tool_name // empty')
# tool_input may be object or JSON string
tool_input_str=$(echo "$input" | jq -c '
  if (.tool_input | type) == "string" then
    (.tool_input | fromjson? // .tool_input)
  else
    .tool_input
  end // {}
')

printf '[%s] beforeMCPExecution tool=%q input=%s\n' "$ts" "$tool" "$tool_input_str" >> .cursor/hooks/state/mc73-audit.log

# Demo deny marker — only on structured write fields (NOT whole JSON tostring).
# Whole-payload substring matching falsely blocks Notion updates that *document* the marker.
demo_msg=$(echo "$tool_input_str" | jq -r '.message // .text // .body // empty')
if [[ "$tool" == "sandbox_flag_put" && "$demo_msg" == *MC73-DENY-DEMO* ]]; then
  deny \
    "MC 7.3 MCP gate denied call (demo marker MC73-DENY-DEMO)." \
    "beforeMCPExecution denied sandbox_flag_put because message contained MC73-DENY-DEMO."
fi

# Slack channel firewall (send / schedule / draft→send class)
case "$tool" in
  slack_send_message|slack_schedule_message)
    channel=$(echo "$tool_input_str" | jq -r '.channel_id // .channel // empty')
    if [[ -z "$channel" ]]; then
      deny \
        "MC 7.3 MCP gate: Slack send missing channel_id." \
        "Denied ${tool}: channel_id required; only ${ALLOW_SLACK_CHANNEL} is allowed."
    fi
    if [[ "$channel" != "$ALLOW_SLACK_CHANNEL" ]]; then
      deny \
        "MC 7.3 MCP gate: Slack writes only to #os-test0chnkukoolwal0vc (${ALLOW_SLACK_CHANNEL})." \
        "Denied ${tool} to channel ${channel}. Sandbox allowlist is ${ALLOW_SLACK_CHANNEL} only."
    fi
    # Allowed channel still requires human confirm for live sends
    ask \
      "MC 7.3 MCP gate: approve Slack send to sandbox channel ${ALLOW_SLACK_CHANNEL}?" \
      "Slack ${tool} targets the sandbox allowlisted channel. Wait for human approval."
    ;;
esac

# Higher-risk Google writes → ask (sandbox account only; still confirm)
case "$tool" in
  gmail_send|calendar_create_event|sheets_append_values)
    ask \
      "MC 7.3 MCP gate: approve Google write tool ${tool}?" \
      "Google write tool ${tool} requires human approval (sandbox account ckoolwal@gmail.com only)."
    ;;
esac

# sandbox_flag_put is allowlisted write — allow (course KV only)
# Notion / CF docs / read tools — allow by default
allow
