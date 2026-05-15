import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.API_URL ?? "http://localhost:3000";

export async function proxy(
  req: NextRequest,
  path: string,
  method?: string
): Promise<NextResponse> {
  const resolvedMethod = method ?? req.method;
  const auth = req.headers.get("authorization");

  const init: RequestInit = {
    method: resolvedMethod,
    headers: {
      "content-type": "application/json",
      ...(auth ? { authorization: auth } : {}),
    },
  };

  if (resolvedMethod !== "GET" && resolvedMethod !== "DELETE") {
    const body = await req.text();
    if (body) init.body = body;
  }

  try {
    const res = await fetch(`${BACKEND}${path}`, init);
    const ct = res.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
    return new NextResponse(null, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Backend unreachable" }, { status: 502 });
  }
}
