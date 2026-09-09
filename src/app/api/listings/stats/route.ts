import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = process.env.API_URL || "http://localhost:8080";
    const res = await fetch(`${url}/stats`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Backend returned ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch platform stats:", error);
    return NextResponse.json(
      { properties: null, agents: null, agencies: null, users: null },
      { status: 200 }, // return 200 so UI can show fallbacks gracefully
    );
  }
}
