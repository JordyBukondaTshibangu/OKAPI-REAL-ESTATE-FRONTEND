import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.API_URL ?? "http://localhost:3000";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = req.headers.get("authorization");
  try {
    const res = await fetch(`${BACKEND}/boosts/mine`, {
      headers: { "content-type": "application/json", ...(auth ? { authorization: auth } : {}) },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Backend unreachable" }, { status: 502 });
  }
}
