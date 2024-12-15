import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;

  console.log(`Request pathname: ${pathname}`);
  console.log(`Access token present: ${accessToken}`);

  const protectedRoutes = ["/ccms"]; // Routes requiring authentication
  const authRoutes = ["/signin", "/signup"]; // Routes accessible without authentication

  console.log("Protected routes:", protectedRoutes);
  console.log("Auth routes:", authRoutes);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  console.log(`Is protected route: ${isProtectedRoute}`);
  console.log(`Is auth route: ${isAuthRoute}`);

  // Redirect unauthenticated users accessing the home page to /signin
  if (!accessToken && pathname === "/") {
    console.log(
      "Unauthenticated user accessing home page. Redirecting to sign-in page."
    );
    const signInUrl = new URL("/signin", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect unauthenticated users accessing the home page to /signin
  if (accessToken && pathname === "/") {
    console.log("Authenticated user accessing home page. Redirecting to ccms.");
    const ccmsUrl = new URL("/ccms/profile", req.url);
    return NextResponse.redirect(ccmsUrl);
  }

  if (isProtectedRoute && !accessToken) {
    console.log(
      "Unauthenticated user trying to access a protected route. Redirecting to sign-in page."
    );
    // Redirect unauthenticated users to the sign-in page
    const signInUrl = new URL("/signin", req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && accessToken) {
    console.log(
      "Authenticated user trying to access an auth route. Redirecting to ccms."
    );
    // Redirect authenticated users away from auth pages to ccms (Curriculum Coaching Management System)
    const ccmsURL = new URL("/ccms/profile", req.url);
    return NextResponse.redirect(ccmsURL);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // Match everything
};
