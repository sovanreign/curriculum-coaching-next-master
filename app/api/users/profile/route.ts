import { parse } from "cookie";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Parse the "cookie" header, not "accessToken"
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

    const response = await fetch(process.env.PROFILE_API_URL_DEV!, {
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

export async function PATCH(req: NextRequest) {
  try {
    // Access query parameters
    const id = req.nextUrl.searchParams.get("id");

    // Parse the "cookie" header to get the access token
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

    // Parse the request body to get the update data
    const body = await req.json();
    console.log("Request Body:", body);

    const response = await fetch(
      process.env.PATCH_USER_API_URL_DEV!.replace("%", id ?? ""),
      {
        method: "PATCH", // Use PATCH for partial updates
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...body }), // Include accessible in the body if needed
      }
    );

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
        message: result.message || "Failed to update profile data",
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("Error in PATCH handler:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
