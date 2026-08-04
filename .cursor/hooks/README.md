# Sandbox project hooks (Module 7)

Course hooks for `chnkukoolwal/test.chnkukoolwal.vc` only. Promote **patterns**, not these exact configs, into Brand/Avvyun repos.

## What ships in this folder

| Script / config | Event | Role |
|---|---|---|
| `session-start.sh` | `sessionStart` | Inject sandbox law (desktop/IDE sessions) |
| `shell-gate.sh` | `beforeShellExecution` | allow / ask / deny for deploy & secret-cat |
| `audit-shell.sh` | `afterShellExecution` | observe |
| `read-gate.sh` | `beforeReadFile` | best-effort secret file deny |
| `audit-edit.sh` | `afterFileEdit` | observe edits |
| `mcp-gate.sh` | `beforeMCPExecution` | Slack/Google firewall (`failClosed`) |
| `audit-mcp.sh` | `afterMCPExecution` | observe |

Prompt hook (network review) lives in `hooks.json` as `type: "prompt"` — desktop/IDE only.

## Cloud Agents vs desktop

| Capability | Desktop / Remote Control (Mac) | Cloud Agent |
|---|---|---|
| Project **command** hooks | Yes | Yes (after writable env) |
| Project **prompt** hooks | Yes | **No** |
| User hooks (`~/.cursor`) | Yes | **No** |
| `sessionStart` / `sessionEnd` | Yes | **No** |
| `beforeMCPExecution` / `afterMCPExecution` | Yes | **No** |
| Shell / file / preToolUse command hooks | Yes | Yes |

Implication: **never rely on `mcp-gate.sh` alone for Cloud Agent Slack/Google side effects.** Prefer tool picker discipline + Automation allowlists + human review. Shell/deploy gates in `shell-gate.sh` *do* travel with the repo to Cloud.

## Dual-OS pattern map (examples only — do not mutate prod)

| Concern | Sandbox practice | Brand pattern (later, separate chat) | Avvyun pattern (later, separate chat) |
|---|---|---|---|
| Deploy | `wrangler deploy` → **ask** | Same ask on brand Worker repo | Same ask on Avvyun Worker repos |
| Secrets via shell | deny `cat .dev.vars` / `.env` | Same | Same |
| Slack destination | deny ≠ `C0BM04ZA7FF`; ask on allowlist | Allowlist brand channels only | Allowlist Avvyun ops channels only |
| Google writes | ask on send/create/append | Brand Google identity + ask | Avvyun Google identity + ask |
| Cloud Agent | project command hooks only | Commit hooks before relying on cloud | Same |
| Mobile (Module 6) | RC uses Mac hooks; Cloud uses project command hooks | Never RC a prod-scoped dirty session | Same |

## failClosed

`mcp-gate.sh` uses `failClosed: true`. A crash blocks MCP. Keep the script emitting valid JSON on every path.
