/**
 * Sandbox Worker for test.chnkukoolwal.vc only.
 * Static files live in /public and are served via env.ASSETS.
 * /health and /kv-demo prove Worker logic + KV bindings.
 */

export interface Env {
  ASSETS: Fetcher;
  FLAGS: KVNamespace;
}

const FLAG_KEY = "sandbox.message";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      console.log("sandbox.health", {
        path: url.pathname,
        method: request.method,
      });
      return Response.json({
        ok: true,
        sandbox: "test.chnkukoolwal.vc",
        worker: "test0chnkukoolwal0vc",
        model: "custom-domain + static-assets + kv + logs",
        path: url.pathname,
      });
    }

    if (url.pathname === "/kv-demo") {
      // GET  → read current flag
      // POST → set flag from ?message=... (or default)
      if (request.method === "POST") {
        const message =
          url.searchParams.get("message") ??
          `hello from sandbox @ ${new Date().toISOString()}`;
        await env.FLAGS.put(FLAG_KEY, message);
        return Response.json({
          ok: true,
          action: "put",
          key: FLAG_KEY,
          value: message,
          namespace: "test-chnkukoolwal-flags",
        });
      }

      const value = await env.FLAGS.get(FLAG_KEY);
      return Response.json({
        ok: true,
        action: "get",
        key: FLAG_KEY,
        value,
        hint: "POST /kv-demo?message=your-text to set a value",
        namespace: "test-chnkukoolwal-flags",
      });
    }

    // Serve files from ./public (Workers Static Assets)
    return env.ASSETS.fetch(request);
  },
};
