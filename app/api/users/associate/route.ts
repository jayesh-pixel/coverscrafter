import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://instapolicy.coverscrafter.com";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Authorization header required" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const queryString = id ? `?userId=${encodeURIComponent(id)}` : "";

    const response = await fetch(`${API_BASE_URL}/v1/users/associate${queryString}`, {
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
    console.error("Associate users fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch associate users" },
      { status: 500 }
    );
  }
}
