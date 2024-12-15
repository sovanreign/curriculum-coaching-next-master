import { NextRequest, NextResponse } from "next/server";
import { SignInSchema, signInSchema } from "@/validation/authSchema";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
    try {
        const body: SignInSchema = await req.json();

        const validatedData = signInSchema.parse(body);
        console.log(validatedData);
        const response = await fetch(process.env.SIGN_IN_API_URL_DEV!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                role: validatedData.role,
                username: validatedData.username,
                password: validatedData.password,
            }),
        });
        const result = await response.json();

        console.log(result);


        if (response.ok) {

            const accessToken = result['access_token'];

            const cookie = serialize("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24,
                path: "/",
            });
            return NextResponse.json({ success: true, data: result }, {
                headers: {
                    "Set-Cookie": cookie,
                }
            });
        }

        return NextResponse.json(
            { success: false, message: result.message === "Unauthorized" ? "Wrong username or password" : result.message },
            { status: response.status }
        );
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        );
    }
}