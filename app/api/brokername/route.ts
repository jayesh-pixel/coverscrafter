import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://instapolicy.coverscrafter.com";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Authorization header required" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/v1/brokername`, {
      method: "POST",
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

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Broker name creation error:", error);
    return NextResponse.json(
      { message: "Failed to create broker name" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Authorization header required" }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/brokername`, {
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
    console.error("Broker names fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch broker names" },
      { status: 500 }
    );
  }
}
