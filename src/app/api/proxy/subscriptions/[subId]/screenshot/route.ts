import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.API_URL ?? "http://localhost:3000";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ subId: string }> },
): Promise<NextResponse> {
  const { subId } = await params;
  const auth = req.headers.get("authorization");
  const body = await req.text();
  try {
    const res = await fetch(`${BACKEND}/subscriptions/${subId}/screenshot`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        ...(auth ? { authorization: auth } : {}),
      },
      body,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Backend unreachable" }, { status: 502 });
  }
}
