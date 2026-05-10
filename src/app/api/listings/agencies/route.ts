import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = process.env.API_URL || "http://localhost:3000";
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const res = await axios.get(url + "/agencies", { params });
    return new Response(JSON.stringify(res.data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching agencies:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch agencies" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
