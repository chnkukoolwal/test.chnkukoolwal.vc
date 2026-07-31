/**
 * Sandbox Worker for test.chnkukoolwal.vc only.
 * Do not reuse this config against production routers.
 */
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({
        ok: true,
        sandbox: "test.chnkukoolwal.vc",
        worker: "test0chnkukoolwal0vc",
        path: url.pathname,
      });
    }

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>test.chnkukoolwal.vc</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #111;
        --muted: #555;
        --line: #ddd;
        --bg: #f7f7f5;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: "SF Pro Display", "Segoe UI", sans-serif;
        background:
          radial-gradient(1200px 600px at 10% -10%, #e8eef8 0%, transparent 55%),
          radial-gradient(900px 500px at 100% 0%, #f3ebe3 0%, transparent 50%),
          var(--bg);
        color: var(--ink);
      }
      main {
        max-width: 42rem;
        margin: 0 auto;
        padding: 18vh 1.5rem 4rem;
      }
      p.kicker {
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 0.75rem;
        color: var(--muted);
        margin: 0 0 0.75rem;
      }
      h1 {
        font-size: clamp(2rem, 5vw, 3rem);
        line-height: 1.05;
        margin: 0 0 1rem;
        font-weight: 600;
      }
      p.lead {
        font-size: 1.1rem;
        line-height: 1.5;
        color: var(--muted);
        margin: 0 0 2rem;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        border-top: 1px solid var(--line);
      }
      li {
        border-bottom: 1px solid var(--line);
        padding: 0.85rem 0;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        font-size: 0.95rem;
      }
      li span:last-child { color: var(--muted); }
      a { color: inherit; }
    </style>
  </head>
  <body>
    <main>
      <p class="kicker">Cursor sandbox</p>
      <h1>test.chnkukoolwal.vc</h1>
      <p class="lead">
        Experimental surface for the Cursor Pro masterclass.
        Safe to break. Production domains stay untouched.
      </p>
      <ul>
        <li><span>Worker</span><span>test0chnkukoolwal0vc</span></li>
        <li><span>Repo</span><span>chnkukoolwal/test.chnkukoolwal.vc</span></li>
        <li><span>Notion</span><span>teamspace test.chnkukoolwal.vc</span></li>
        <li><span>Health</span><span><a href="/health">/health</a></span></li>
      </ul>
    </main>
  </body>
</html>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  },
};
