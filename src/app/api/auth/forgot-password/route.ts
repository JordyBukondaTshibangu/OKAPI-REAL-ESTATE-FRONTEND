import { NextRequest } from "next/server";
import { proxy } from "../../user/_proxy";

export async function POST(req: NextRequest) {
  return proxy(req, "/auth/forgot-password", "POST");
}
