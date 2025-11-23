import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/config";

const REGISTER_ASSOCIATE_ENDPOINT = "/v1/auth/register_associate";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}${REGISTER_ASSOCIATE_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const contentType = upstreamResponse.headers.get("content-type");
    const expectsJson = contentType?.includes("application/json");
    const data = expectsJson ? await upstreamResponse.json() : await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      const message =
        typeof data === "object" && data !== null && "message" in data
          ? String((data as { message: unknown }).message)
          : "Failed to register associate.";

      const errorBody =
        expectsJson && typeof data === "object" && data !== null
          ? data
          : { message };

      return NextResponse.json(errorBody, { status: upstreamResponse.status });
    }

    return NextResponse.json(data, { status: upstreamResponse.status });
  } catch (error) {
    console.error("Register associate proxy error", error);
    return NextResponse.json({ message: "Unable to reach associate registration service." }, { status: 500 });
  }
}
