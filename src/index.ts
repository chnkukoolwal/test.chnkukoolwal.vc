/**
 * Sandbox Worker for test.chnkukoolwal.vc only.
 * Static files live in /public and are served via env.ASSETS.
 * /health stays dynamic so we can prove Worker logic still runs.
 */

export interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({
        ok: true,
        sandbox: "test.chnkukoolwal.vc",
        worker: "test0chnkukoolwal0vc",
        model: "custom-domain + static-assets",
        path: url.pathname,
      });
    }

    // Serve files from ./public (Workers Static Assets)
    return env.ASSETS.fetch(request);
  },
};
