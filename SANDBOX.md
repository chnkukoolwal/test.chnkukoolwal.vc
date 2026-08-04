# test.chnkukoolwal.vc — unified sandbox

This is the **only** surface Cursor should mutate during the Cursor Pro masterclass and other experiments.

## Linked platforms

| Platform | Resource | Notes |
|----------|----------|-------|
| Domain | `https://test.chnkukoolwal.vc` | Pure **Worker Custom Domain** (Worker-origin) |
| Cloudflare Worker | `test0chnkukoolwal0vc` | Site + sandbox KV MCP at `/mcp` — never rename to production routers |
| Google MCP Worker | `test0chnkukoolwal0vc-google-mcp` | Separate sandbox Worker for Google APIs (keeps KV MCP pure) |
| Experimental Google account | `ckoolwal@gmail.com` | **Sandbox Google identity** — course Google MCP may experiment freely here only |
| GitHub | `chnkukoolwal/test.chnkukoolwal.vc` | This repo |
| Notion teamspace | `test.chnkukoolwal.vc` | Hub page + Masterclass Lab |
| Slack channel | `#os-test0chnkukoolwal0vc` (`C0BM04ZA7FF`) | **Only** Slack write surface for course demos |

## Routing + serving model

This sandbox uses:

1. **Custom Domain** (not a Workers route) for hostname binding
2. **Workers Static Assets** for the website files

Details:

- Cloudflare manages DNS + certs for `test.chnkukoolwal.vc`
- The Worker is the origin for the whole hostname
- Static files live in `public/` and are served via `env.ASSETS`
- `/health`, `/kv-demo`, and `/mcp` are handled by Worker logic (`run_worker_first`)
- Sandbox KV namespace: `test-chnkukoolwal-flags` bound as `env.FLAGS`
- Workers Logs enabled via `observability.enabled = true`
- Config: `"custom_domain": true` + Assets + sandbox KV + logs
- **Custom MCP — KV (Lesson 5.6):** Streamable HTTP at `https://test.chnkukoolwal.vc/mcp` (`mc-sandbox-mcp`) — tools `sandbox_info`, `sandbox_flag_get`, `sandbox_flag_put` (sandbox KV only). Authless lab MCP.
- **Custom MCP — Google (sandbox):** Worker `test0chnkukoolwal0vc-google-mcp` at `https://test0chnkukoolwal0vc-google-mcp.chinkukoolwal.workers.dev/mcp` (`mc-sandbox-google-mcp`). OAuth Google; **only** `ckoolwal@gmail.com`. Code in `google-mcp/`. Setup: `google-mcp/README.md`. Both servers wired in project `.cursor/mcp.json`.
- **Project hooks (Module 7):** `.cursor/hooks.json` + `.cursor/hooks/*` — shell/file gates, MCP Slack/Google firewall (`failClosed`), optional prompt network reviewer. See `.cursor/hooks/README.md`. Cloud Agents: **command** hooks only (no prompt / no MCP hooks / no `~/.cursor` user hooks).

Do **not** re-add a `test.chnkukoolwal.vc/*` Workers route unless intentionally migrating away from Custom Domain.

## Slack sandbox rule

- Workspace: `OS.chnkukoolwal` (MCP acts as your user — not a bot)
- **Allowed writes:** `#os-test0chnkukoolwal0vc` only (`C0BM04ZA7FF`)
- **Reads:** elsewhere only when the lesson needs them; never send/create/archive outside this channel without explicit named approval
- Prefer **draft → approve → send** even in the sandbox channel while learning

## Cursor Automations sandbox rule

- **Allowed course Automations** may only target sandbox surfaces: this repo (`chnkukoolwal/test.chnkukoolwal.vc`), Slack `#os-test0chnkukoolwal0vc` (`C0BM04ZA7FF`), sandbox Notion under `test.chnkukoolwal.vc`, Workers `test0chnkukoolwal0vc` + `test0chnkukoolwal0vc-google-mcp`, and Google account `ckoolwal@gmail.com`
- Do **not** create or reconfigure Automations aimed at Brand/Avvyun prod repos, channels, or Workers unless the human explicitly names that Automation and approves it in that message
- Prefer draft/comment-style outcomes over live posts until a recipe is trusted
- “Automate this” in English is ambiguous — confirm **Cursor Automations** vs CF cron / GitHub Actions / scripts before building
- For **Slack-triggered** Automations: enable built-in Slack tools **and** add **Slack under MCP** in the Automation editor. Built-in Slack alone can leave Runs empty even when `@Cursor` works in the channel. Pick the channel from the UI dropdown when possible.
- Working course demo: **MC Sandbox Slack Echo** — `:robot_face:` in `#os-test0chnkukoolwal0vc` → thread reply (Slack MCP + built-in Slack)

## Hard boundaries (do not touch)

- `chnkukoolwal.vc` / `www.chnkukoolwal.vc`
- `avvyun.vc` and Avvyun card/contact Workers
- Production routers (`chnkukoolwal0vc-router`, `avvyun-router`, etc.)
- Production Notion teamspaces (Avvyun OS, personal brand live docs)
- Other GitHub repos unless explicitly requested
- Other Slack channels / DMs for writes (unless explicitly approved by name)

## Local commands

```bash
npm install
npm run dev      # local Worker
npm run deploy   # deploys ONLY test0chnkukoolwal0vc + custom domain test.chnkukoolwal.vc

# Deploy / rollback awareness (sandbox only)
npx wrangler deployments list
npx wrangler versions list
npx wrangler deployments status
# Rollback ONLY if intentionally undoing a sandbox deploy:
# npx wrangler rollback <version-id> -m "reason"
```

## Cursor prompt scope (paste when needed)

```text
SANDBOX ONLY: test.chnkukoolwal.vc
- Cloudflare Workers: test0chnkukoolwal0vc (+ google MCP: test0chnkukoolwal0vc-google-mcp)
- Experimental Google: ckoolwal@gmail.com only
- GitHub repo: chnkukoolwal/test.chnkukoolwal.vc
- Notion teamspace: test.chnkukoolwal.vc
- Slack writes: #os-test0chnkukoolwal0vc only (C0BM04ZA7FF)
Do not read-for-edit or modify any other domain, Worker, repo, teamspace, Slack channel, or Google account.
```

## Production workflow mindset (do not mutate prod from here)

Promote **patterns**, not **configs**.

1. Prove the change on this sandbox Worker first.
2. Open a **separate** Cursor chat for any real prod change.
3. Require an explicit `ALLOW PROD WRITE` line naming the exact Worker/hostname.
4. Never copy sandbox KV/R2/D1 ids into production `wrangler` configs.
5. Know the prior version id before risky deploys; verify with health + logs after.
6. For Slack: prove drafts/sends in `#os-test0chnkukoolwal0vc` before any Brand/Avvyun channel write (separate chat + named approval).
7. For Cursor Automations: prove recipes against sandbox repo/channel first; never point course Automations at prod Brand/Avvyun surfaces without a separate chat + named approval.

Notion masterclass hub:
- Cursor Pro Masterclass (course home for new chats)
- Course Recaps + Module Continuity Prompts (top children of that hub)
- Prompt Templates / Sandbox OS Samples / Lab Demos & Playbooks folders
