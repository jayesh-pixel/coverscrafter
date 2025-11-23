import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://instapolicy.coverscrafter.com";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Authorization header required" }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/profile`, {
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
    console.error("User profile fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
