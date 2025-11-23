import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/config";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}/v1/businessentry/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      cache: "no-store",
    });

    const contentType = upstreamResponse.headers.get("content-type");
    const expectsJson = contentType?.includes("application/json");
    const data = expectsJson ? await upstreamResponse.json() : await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      const message =
        typeof data === "object" && data !== null && "message" in data
          ? String((data as { message: unknown }).message)
          : "Failed to fetch business entry.";

      const errorBody =
        expectsJson && typeof data === "object" && data !== null
          ? data
          : { message };

      return NextResponse.json(errorBody, { status: upstreamResponse.status });
    }

    return NextResponse.json(data, { status: upstreamResponse.status });
  } catch (error) {
    console.error("Get business entry proxy error", error);
    return NextResponse.json({ message: "Unable to reach business entry service." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}/v1/businessentry/${id}`, {
      method: "PUT",
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
          : "Failed to update business entry.";

      const errorBody =
        expectsJson && typeof data === "object" && data !== null
          ? data
          : { message };

      return NextResponse.json(errorBody, { status: upstreamResponse.status });
    }

    return NextResponse.json(data, { status: upstreamResponse.status });
  } catch (error) {
    console.error("Update business entry proxy error", error);
    return NextResponse.json({ message: "Unable to reach business entry service." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    const upstreamResponse = await fetch(`${API_BASE_URL}/v1/businessentry/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      cache: "no-store",
    });

    const contentType = upstreamResponse.headers.get("content-type");
    const expectsJson = contentType?.includes("application/json");
    const data = expectsJson ? await upstreamResponse.json() : await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      const message =
        typeof data === "object" && data !== null && "message" in data
          ? String((data as { message: unknown }).message)
          : "Failed to delete business entry.";

      const errorBody =
        expectsJson && typeof data === "object" && data !== null
          ? data
          : { message };

      return NextResponse.json(errorBody, { status: upstreamResponse.status });
    }

    return NextResponse.json(data, { status: upstreamResponse.status });
  } catch (error) {
    console.error("Delete business entry proxy error", error);
    return NextResponse.json({ message: "Unable to reach business entry service." }, { status: 500 });
  }
}
