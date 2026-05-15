import { NextRequest } from "next/server";
import { proxy } from "../_proxy";

export async function GET(req: NextRequest) {
  return proxy(req, "/alerts", "GET");
}

export async function POST(req: NextRequest) {
  return proxy(req, "/alerts", "POST");
}
