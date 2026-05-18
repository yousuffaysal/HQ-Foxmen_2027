import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/portal")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?from=" + encodeURIComponent(pathname), req.url));
    }
  }

  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    return NextResponse.redirect(new URL("/portal", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/portal/:path*", "/login", "/register"],
};
