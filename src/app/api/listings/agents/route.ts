import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = process.env.API_URL || "http://localhost:3000";
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const res = await axios.get(url + "/agents", { params });
    const payload = res.data as {
      data: Record<string, unknown>[];
      meta: unknown;
    };
    // Map backend agent shape to frontend Agent type:
    // backend returns agency as a full object; frontend expects agency as a string (the name)
    const mapped = {
      ...payload,
      data: payload.data.map((agent) => {
        const agencyObj = agent.agency as { name?: string } | null;
        return {
          ...agent,
          agency: agencyObj?.name ?? "",
        };
      }),
    };
    return new Response(JSON.stringify(mapped), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch agents" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
