import { NextRequest } from "next/server";
import { proxy } from "../_proxy";

/** POST /api/user/reports  { propertyId, reason, description? } */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { propertyId, ...rest } = body;
  // Rebuild the request with just the report fields as the body
  const proxyReq = new Request(req.url, {
    method: "POST",
    headers: req.headers,
    body: JSON.stringify(rest),
  });
  return proxy(proxyReq as NextRequest, `/properties/${propertyId}/report`);
}
