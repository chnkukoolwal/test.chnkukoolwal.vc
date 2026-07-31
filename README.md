# test.chnkukoolwal.vc

Experimental sandbox for learning Cursor + Cloudflare + Notion + GitHub as one AI-native OS.

- **Live site:** https://test.chnkukoolwal.vc
- **Worker:** `test0chnkukoolwal0vc`
- **Notion teamspace:** `test.chnkukoolwal.vc`

See [SANDBOX.md](./SANDBOX.md) for boundaries and workflow.

## Quick start

```bash
npm install
npm run dev
npm run deploy
```

## Layout

```text
public/          static site (HTML/CSS)
src/index.ts     Worker logic (/health + ASSETS passthrough)
wrangler.jsonc   Worker name, Custom Domain, Assets config
```

Production domains and Workers are intentionally out of scope for this repository.
