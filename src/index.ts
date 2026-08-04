/**
 * Sandbox Worker for test.chnkukoolwal.vc only.
 * Static files live in /public and are served via env.ASSETS.
 * /health and /kv-demo prove Worker logic + KV bindings.
 * /mcp is the Lesson 5.6 custom remote MCP (stateless Streamable HTTP).
 */

import { createMcpHandler } from "agents/mcp/server";
import type { Env } from "./env";
import { createSandboxMcpServer } from "./mcp";

export type { Env };

const FLAG_KEY = "sandbox.message";

const MCP_HANDLER_OPTIONS = {
  route: "/mcp",
  // Custom domain Host allowlist (required for non-workers.dev hosts)
  allowedHostnames: [
    "test.chnkukoolwal.vc",
    "test0chnkukoolwal0vc.workers.dev",
  ],
  // Non-browser MCP clients often omit Origin. Tools themselves are sandbox-only.
  allowedOriginHostnames: "*" as const,
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/mcp" || url.pathname.startsWith("/mcp/")) {
      // Fresh factory per request so tools close over this request's env (KV).
      const handler = createMcpHandler(
        () => createSandboxMcpServer(env),
        MCP_HANDLER_OPTIONS,
      );
      return handler(request, env, ctx);
    }

    if (url.pathname === "/health") {
      console.log("sandbox.health", {
        path: url.pathname,
        method: request.method,
      });
      return Response.json({
        ok: true,
        sandbox: "test.chnkukoolwal.vc",
        worker: "test0chnkukoolwal0vc",
        model: "custom-domain + static-assets + kv + logs + mcp",
        path: url.pathname,
        mcp: "/mcp",
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
