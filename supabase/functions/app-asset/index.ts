// Proxies static assets of the published Aether app so the in-app
// "Download Aether as app (HTML)" feature can fetch them without CORS issues.
// Only allows fetching static file paths from the app's own origin.

const APP_ORIGIN = "https://supermium-plus-plus.lovable.app";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SAFE_PATH = /^\/[A-Za-z0-9._~-]+(\/[A-Za-z0-9._~-]+)*$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const path = new URL(req.url).searchParams.get("path") ?? "/index.html";
  if (!SAFE_PATH.test(path)) {
    return new Response("Invalid path", { status: 400, headers: cors });
  }

  try {
    const upstream = await fetch(`${APP_ORIGIN}${path}`, { redirect: "follow" });
    if (!upstream.ok) {
      return new Response(`Upstream ${upstream.status}`, { status: upstream.status, headers: cors });
    }
    const headers = new Headers(cors);
    headers.set("Content-Type", upstream.headers.get("Content-Type") ?? "application/octet-stream");
    return new Response(await upstream.arrayBuffer(), { status: 200, headers });
  } catch (e) {
    return new Response(`Proxy error: ${String(e)}`, { status: 502, headers: cors });
  }
});
