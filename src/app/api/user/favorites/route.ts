import { NextRequest } from "next/server";
import { proxy } from "../_proxy";

export async function GET(req: NextRequest) {
  return proxy(req, "/favorites", "GET");
}

export async function POST(req: NextRequest) {
  return proxy(req, "/favorites", "POST");
}
