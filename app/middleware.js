import { NextResponse } from "next/server";

// Function to check if the user is logged in via cookies
function isLoggedIn(req) {
  const token = req.cookies.get("auth_token"); // Retrieve the token from cookies
  return token ? true : false;
}

export function middleware(req) {
  // Check if the request path is '/admin' and user is not logged in
  if (req.nextUrl.pathname === "/test" && !isLoggedIn(req)) {
    // Redirect to login page if not logged in
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next(); // Allow the request to continue if the user is logged in
}

export const config = {
  matcher: ["/test"], // Apply the middleware only to '/admin' route
};
