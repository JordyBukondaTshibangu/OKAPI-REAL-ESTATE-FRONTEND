import { NextRequest } from "next/server";
import { proxy } from "../../../_proxy";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;
  return proxy(req, `/reviews/agent/${agentId}`, "GET");
}
