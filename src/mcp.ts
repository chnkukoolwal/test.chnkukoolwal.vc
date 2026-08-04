/**
 * Sandbox-only custom MCP for the Cursor Pro masterclass (Lesson 5.6).
 * Tools may only touch test.chnkukoolwal.vc / test-chnkukoolwal-flags.
 * Do not add prod Brand/Avvyun tools here.
 */

import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import type { Env } from "./env";

const FLAG_KEY = "sandbox.message";

export function createSandboxMcpServer(env: Env): McpServer {
  const server = new McpServer({
    name: "mc-sandbox-mcp",
    version: "0.1.0",
  });

  server.registerTool(
    "sandbox_info",
    {
      description:
        "Return sandbox identity for the Cursor Pro masterclass. Read-only. No production domains.",
      inputSchema: {},
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              sandbox: "test.chnkukoolwal.vc",
              worker: "test0chnkukoolwal0vc",
              kv: "test-chnkukoolwal-flags",
              mcpPath: "/mcp",
              slackWritesOnly: "#os-test0chnkukoolwal0vc (C0BM04ZA7FF)",
              rule: "SANDBOX ONLY — do not target Brand/Avvyun prod from course tools",
            },
            null,
            2,
          ),
        },
      ],
    }),
  );

  server.registerTool(
    "sandbox_flag_get",
    {
      description:
        "Read the sandbox KV flag (test-chnkukoolwal-flags / sandbox.message). Read-only.",
      inputSchema: {},
    },
    async () => {
      const value = await env.FLAGS.get(FLAG_KEY);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ok: true,
                action: "get",
                key: FLAG_KEY,
                value,
                namespace: "test-chnkukoolwal-flags",
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerTool(
    "sandbox_flag_put",
    {
      description:
        "Write the sandbox KV flag (test-chnkukoolwal-flags / sandbox.message). Sandbox KV only — never production token namespaces.",
      inputSchema: {
        message: z
          .string()
          .min(1)
          .max(500)
          .describe("Value to store in the sandbox flag key"),
      },
    },
    async ({ message }) => {
      await env.FLAGS.put(FLAG_KEY, message);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ok: true,
                action: "put",
                key: FLAG_KEY,
                value: message,
                namespace: "test-chnkukoolwal-flags",
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  return server;
}
