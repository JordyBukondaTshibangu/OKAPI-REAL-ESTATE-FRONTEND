import { NextRequest } from "next/server";
import { proxy } from "../../../_proxy";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;
  return proxy(req, `/enquiries/property/${propertyId}`, "GET");
}
