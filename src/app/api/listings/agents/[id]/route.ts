import axios from "axios";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = process.env.API_URL || "http://localhost:3000";
    const res = await axios.get(`${url}/agents/${id}`);
    const data = res.data as Record<string, unknown>;
    const agencyObj = data.agency as { name?: string } | null;
    return new Response(
      JSON.stringify({ ...data, agency: agencyObj?.name ?? "" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching agent:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
