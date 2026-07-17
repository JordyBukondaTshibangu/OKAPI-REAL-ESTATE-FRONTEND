import axios from "axios";
import type { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const url = process.env.API_URL || "http://localhost:3000";
    const headers: Record<string, string> = {};
    const sessionId = request.headers.get("x-session-id");
    const userId = request.headers.get("x-user-id");
    if (sessionId) headers["x-session-id"] = sessionId;
    if (userId) headers["x-user-id"] = userId;
    const res = await axios.post(`${url}/properties/${id}/whatsapp-click`, {}, { headers });
    return new Response(JSON.stringify(res.data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error recording WhatsApp click:", error);
    return new Response(JSON.stringify({ error: "Failed to record click" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
