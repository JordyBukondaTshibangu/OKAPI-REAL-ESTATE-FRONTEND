import axios from "axios";
import type { NextRequest } from "next/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const url = process.env.API_URL || "http://localhost:3000";
    const res = await axios.post(`${url}/properties/${id}/view`);
    return new Response(JSON.stringify(res.data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error recording property view:", error);
    return new Response(JSON.stringify({ error: "Failed to record view" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
