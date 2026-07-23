import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.API_URL ?? "http://localhost:3000";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> },
): Promise<NextResponse> {
  const { propertyId } = await params;
  const auth = req.headers.get("authorization");
  const body = await req.text();
  try {
    const res = await fetch(`${BACKEND}/boosts/properties/${propertyId}/request`, {
      method: "POST",
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
