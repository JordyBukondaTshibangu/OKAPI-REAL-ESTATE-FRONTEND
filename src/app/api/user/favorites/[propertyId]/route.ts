import { NextRequest } from "next/server";
import { proxy } from "../../_proxy";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  const { propertyId } = await params;
  return proxy(req, `/favorites/${propertyId}`, "DELETE");
}
