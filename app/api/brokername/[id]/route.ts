import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://instapolicy.coverscrafter.com";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Authorization header required" }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/brokername/${params.id}`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Broker name fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch broker name" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Authorization header required" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/v1/brokername/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Broker name update error:", error);
    return NextResponse.json(
      { message: "Failed to update broker name" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Authorization header required" }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/brokername/${params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Broker name delete error:", error);
    return NextResponse.json(
      { message: "Failed to delete broker name" },
      { status: 500 }
    );
  }
}
