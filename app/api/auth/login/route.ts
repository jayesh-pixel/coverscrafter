import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/config";

const LOGIN_ENDPOINT = "/v1/auth/login";

// Proxy login requests through Next.js to bypass browser CORS limits.
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const upstreamResponse = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
          : "Authentication failed.";

      const errorBody =
        expectsJson && typeof data === "object" && data !== null
          ? data
          : { message };

      return NextResponse.json(errorBody, { status: upstreamResponse.status });
    }

    return NextResponse.json(data, { status: upstreamResponse.status });
  } catch (error) {
    console.error("Login proxy error", error);
    return NextResponse.json(
      { message: "Unable to reach authentication service." },
      { status: 500 },
    );
  }
}
