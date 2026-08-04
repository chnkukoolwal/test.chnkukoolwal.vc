# Sandbox Google MCP (`test0chnkukoolwal0vc-google-mcp`)

Separate from the KV MCP on `test0chnkukoolwal0vc`.  
**Experimental Google account only:** `ckoolwal@gmail.com`

Live URL (after OAuth secrets are set):

`https://test0chnkukoolwal0vc-google-mcp.chinkukoolwal.workers.dev/mcp`

## What this covers (v1)

Google Workspace-class tools for the sandbox account:

| Product | Tools |
|---------|--------|
| Identity | `google_whoami` |
| Gmail | `gmail_search`, `gmail_get`, `gmail_send` |
| Drive | `drive_search`, `drive_get_metadata` |
| Calendar | `calendar_list_events`, `calendar_create_event`, `calendar_delete_event` |
| Contacts | `contacts_list` |
| Tasks | `tasks_list_tasklists`, `tasks_list` |
| Sheets | `sheets_get_values`, `sheets_append_values`, `sheets_clear_range` |
| Docs | `docs_get` |

This is **not** every Google product in existence (YouTube Ads, GCP, Photos Library full surface, etc.). Architecture is extendable — add tools in `src/index.ts`.

## One-time Google Cloud setup (you do this once)

Sign into Google Cloud as **`ckoolwal@gmail.com`**.

1. Create (or reuse) a GCP project, e.g. `mc-sandbox-google-mcp`.
2. **APIs & Services → Enable APIs** for the **classic** APIs (not the “MCP API” variants):
   - Gmail API
   - Google Drive API
   - Google Calendar API
   - People API
   - Tasks API
   - Google Sheets API
   - Google Docs API

   **Note:** Google also lists products like “Google Docs MCP API.” Those are Google’s *own* hosted MCP endpoints. Our Worker calls the classic REST APIs above. Enabling both is harmless for this lab; the required ones are the non-MCP names.
3. **OAuth consent screen**
   - User type: **External**
   - App name: `mc-sandbox-google-mcp`
   - Support email: `ckoolwal@gmail.com`
   - Publishing status: **Testing**
   - Test users: add **`ckoolwal@gmail.com`**
4. **Credentials → Create OAuth client ID**
   - Application type: **Web application**
   - Name: `mc-sandbox-google-mcp`
   - Authorized JavaScript origins:
     - `https://test0chnkukoolwal0vc-google-mcp.chinkukoolwal.workers.dev`
   - Authorized redirect URIs:
     - `https://test0chnkukoolwal0vc-google-mcp.chinkukoolwal.workers.dev/callback`
5. Copy Client ID + Client Secret, then in this folder run:

```bash
cd google-mcp
npx wrangler secret put GOOGLE_CLIENT_ID --name test0chnkukoolwal0vc-google-mcp
npx wrangler secret put GOOGLE_CLIENT_SECRET --name test0chnkukoolwal0vc-google-mcp
```

(`COOKIE_ENCRYPTION_KEY` is already set.)

6. In Cursor: refresh **Tools & MCP**. Connect `mc-sandbox-google-mcp` and complete Google login as **`ckoolwal@gmail.com`** only (other accounts are rejected).

## Local commands

```bash
cd google-mcp
npm install --legacy-peer-deps
npm run deploy
```
