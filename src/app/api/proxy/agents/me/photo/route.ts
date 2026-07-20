import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.API_URL ?? "http://localhost:3000";

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const auth = req.headers.get("authorization");
  const body = await req.text();

  try {
    const res = await fetch(`${BACKEND}/agents/me/photo`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        ...(auth ? { authorization: auth } : {}),
      },
      body: body || undefined,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Backend unreachable" }, { status: 502 });
  }
}
