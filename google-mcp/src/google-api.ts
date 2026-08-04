/** Thin Google REST helpers for the sandbox Google MCP (ckoolwal@gmail.com). */

export async function googleFetch<T = unknown>(
  accessToken: string,
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Google API ${res.status}: ${text.slice(0, 800)}`);
  }
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

export function textResult(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: typeof data === "string" ? data : JSON.stringify(data, null, 2),
      },
    ],
  };
}
