# test.chnkukoolwal.vc — unified sandbox

This is the **only** surface Cursor should mutate during the Cursor Pro masterclass and other experiments.

## Linked platforms

| Platform | Resource | Notes |
|----------|----------|-------|
| Domain | `https://test.chnkukoolwal.vc` | Pure **Worker Custom Domain** (Worker-origin) |
| Cloudflare Worker | `test0chnkukoolwal0vc` | Never rename to production routers |
| GitHub | `chnkukoolwal/test.chnkukoolwal.vc` | This repo |
| Notion teamspace | `test.chnkukoolwal.vc` | Hub page + Masterclass Lab |

## Routing + serving model

This sandbox uses:

1. **Custom Domain** (not a Workers route) for hostname binding
2. **Workers Static Assets** for the website files

Details:

- Cloudflare manages DNS + certs for `test.chnkukoolwal.vc`
- The Worker is the origin for the whole hostname
- Static files live in `public/` and are served via `env.ASSETS`
- `/health` and `/kv-demo` are handled by Worker logic (`run_worker_first`)
- Sandbox KV namespace: `test-chnkukoolwal-flags` bound as `env.FLAGS`
- Workers Logs enabled via `observability.enabled = true`
- Config: `"custom_domain": true` + Assets + sandbox KV + logs

Do **not** re-add a `test.chnkukoolwal.vc/*` Workers route unless intentionally migrating away from Custom Domain.

## Hard boundaries (do not touch)

- `chnkukoolwal.vc` / `www.chnkukoolwal.vc`
- `avvyun.vc` and Avvyun card/contact Workers
- Production routers (`chnkukoolwal0vc-router`, `avvyun-router`, etc.)
- Production Notion teamspaces (Avvyun OS, personal brand live docs)
- Other GitHub repos unless explicitly requested

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
- Cloudflare Worker: test0chnkukoolwal0vc (Custom Domain / Worker-origin)
- GitHub repo: chnkukoolwal/test.chnkukoolwal.vc
- Notion teamspace: test.chnkukoolwal.vc
Do not read-for-edit or modify any other domain, Worker, repo, or teamspace.
```
