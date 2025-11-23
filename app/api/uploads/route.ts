import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/config";

const UPLOAD_ENDPOINT = "/v1/uploads";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    const formData = await request.formData();

    if (![...formData.keys()].length) {
      return NextResponse.json({ message: "No file received." }, { status: 400 });
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}${UPLOAD_ENDPOINT}`, {
      method: "POST",
      headers: {
        Authorization: authorization,
      },
      body: formData,
      cache: "no-store",
    });

    const contentType = upstreamResponse.headers.get("content-type");
    const expectsJson = contentType?.includes("application/json");
    const data = expectsJson ? await upstreamResponse.json() : await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      const message =
        typeof data === "object" && data !== null && "message" in data
          ? String((data as { message: unknown }).message)
          : "Failed to upload document.";

      const errorBody =
        expectsJson && typeof data === "object" && data !== null
          ? data
          : { message };

      return NextResponse.json(errorBody, { status: upstreamResponse.status });
    }

    if (expectsJson) {
      return NextResponse.json(data, { status: upstreamResponse.status });
    }

    return new Response(typeof data === "string" ? data : String(data), {
      status: upstreamResponse.status,
      headers: contentType ? { "Content-Type": contentType } : undefined,
    });
  } catch (error) {
    console.error("Upload document proxy error", error);
    return NextResponse.json({ message: "Unable to reach upload service." }, { status: 500 });
  }
}
