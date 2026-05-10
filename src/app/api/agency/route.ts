import type { NextRequest } from "next/server";

export async function GET(_request: NextRequest) {
  return new Response(JSON.stringify({ message: "Not implemented" }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  });
}
