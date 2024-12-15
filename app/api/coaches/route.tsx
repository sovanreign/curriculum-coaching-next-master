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

    // Get the q parameter from the request's query string
    const q = req.nextUrl.searchParams.get("q");

    // Construct the request URL
    const baseUrl = process.env.COACHES_API_URL_DEV!;
    const url = new URL(baseUrl);

    // If q is not null, add it as a query parameter
    if (q) {
      url.searchParams.set("q", q);
    }

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
        message: result.message || "Failed to fetch coach data",
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

export async function POST(req: NextRequest) {
  try {
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

    // Parse the request body
    const body = await req.json();
    console.log("Request Body:", body);

    if (!body) {
      return NextResponse.json(
        { success: false, message: "Request body is missing or invalid" },
        { status: 400 }
      );
    }

    // Construct the request URL
    const baseUrl = process.env.COACHES_CREATE_API_URL_DEV!;
    const url = new URL(baseUrl);

    // Send the POST request to the external API
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    console.log("API Response Status:", response.status);

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json(
        { success: true, data: result },
        { status: 201 } // Status 201 for a successful creation
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "Failed to create resource",
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
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
