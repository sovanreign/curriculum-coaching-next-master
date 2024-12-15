import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
    const cookie = serialize("accessToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
    });

    return NextResponse.json({ success: true, message: "Signed out successfully" }, {
        headers: {
            "Set-Cookie": cookie,
        },
    });
}
