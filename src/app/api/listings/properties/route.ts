import axios from "axios";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = process.env.API_URL || "http://localhost:3000";
    const queryParameters = new URL(request.url).searchParams;
    const listingType = queryParameters.get("listingType");
    const category = queryParameters.get("category");
    const city = queryParameters.get("city");
    const type = queryParameters.get("type");
    const minPrice = queryParameters.get("minPrice");
    const maxPrice = queryParameters.get("maxPrice");

    let apiUrl = url + "/properties?";

    if (listingType) apiUrl += `listingType=${listingType}&`;
    if (category) apiUrl += `category=${category}&`;
    if (city) apiUrl += `city=${city}&`;
    if (type) apiUrl += `type=${type}&`;
    if (minPrice) apiUrl += `minPrice=${minPrice}&`;
    if (maxPrice) apiUrl += `maxPrice=${maxPrice}&`;

    const res = await axios.get(apiUrl);

    return new Response(JSON.stringify(res.data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
