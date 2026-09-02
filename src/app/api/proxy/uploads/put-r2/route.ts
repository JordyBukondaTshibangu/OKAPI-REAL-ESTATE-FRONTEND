import type { NextRequest } from "next/server";

/**
 * Server-side proxy for R2 PUT uploads.
 *
 * The browser sends the file binary to THIS route (same origin → no CORS).
 * This route forwards the PUT to the presigned R2 URL server-side, where
 * CORS doesn't apply.
 *
 * Usage:
 *   POST /api/proxy/uploads/put-r2
 *   Headers:
 *     Content-Type:      <file mime type>
 *     X-Presigned-Url:   <the presigned R2 PUT URL>
 *   Body: raw file binary
 */
export async function POST(req: NextRequest) {
  const presignedUrl = req.headers.get("x-presigned-url");
  const contentType = req.headers.get("content-type") ?? "application/octet-stream";

  if (!presignedUrl) {
    return new Response(JSON.stringify({ error: "Missing X-Presigned-Url header" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.arrayBuffer();

    const r2Res = await fetch(presignedUrl, {
      method: "PUT",
      body,
      headers: { "Content-Type": contentType },
    });

    if (!r2Res.ok) {
      const text = await r2Res.text().catch(() => "");
      console.error("[put-r2] R2 returned", r2Res.status, text);
      return new Response(JSON.stringify({ error: "R2 upload failed", status: r2Res.status }), {
        status: r2Res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(null, { status: 200 });
  } catch (err) {
    console.error("[put-r2] Proxy error:", err);
    return new Response(JSON.stringify({ error: "Proxy error" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
