# test.chnkukoolwal.vc — unified sandbox

This is the **only** surface Cursor should mutate during the Cursor Pro masterclass and other experiments.

## Linked platforms

| Platform | Resource | Notes |
|----------|----------|-------|
| Domain | `https://test.chnkukoolwal.vc` | Experimental subdomain only |
| Cloudflare Worker | `test0chnkukoolwal0vc` | Never rename to production routers |
| GitHub | `chnkukoolwal/test.chnkukoolwal.vc` | This repo |
| Notion teamspace | `test.chnkukoolwal.vc` | Hub page + Masterclass Lab |

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
npm run deploy   # deploys ONLY test0chnkukoolwal0vc + test.chnkukoolwal.vc
```

## Cursor prompt scope (paste when needed)

```text
SANDBOX ONLY: test.chnkukoolwal.vc
- Cloudflare Worker: test0chnkukoolwal0vc
- GitHub repo: chnkukoolwal/test.chnkukoolwal.vc
- Notion teamspace: test.chnkukoolwal.vc
Do not read-for-edit or modify any other domain, Worker, repo, or teamspace.
```
