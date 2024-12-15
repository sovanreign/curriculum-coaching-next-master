import { parse } from "cookie";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Parse the "cookie" header
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = parse(cookieHeader);
    const accessToken = cookies.accessToken;

    console.log("Access Token:", accessToken);

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Authorization token is missing" },
        { status: 401 }
      );
    }

    // Construct the request URL
    const baseUrl = process.env.COURSES_API_URL_DEV!;
    const url = new URL(baseUrl);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("API Response Status:", response.status);

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json(
        { success: true, data: result },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "Failed to fetch profile data",
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
