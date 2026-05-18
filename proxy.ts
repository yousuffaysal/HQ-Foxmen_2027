import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const session = req.auth;
  const isLoggedIn = !!session;
  const role = (session?.user as { role?: string } | undefined)?.role;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login?from=/admin", req.url));
    if (role !== "admin") return NextResponse.redirect(new URL("/portal", req.url));
  }

  if (pathname.startsWith("/portal")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login?from=" + encodeURIComponent(pathname), req.url));
  }

  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    return NextResponse.redirect(new URL(role === "admin" ? "/admin" : "/portal", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/login", "/register"],
};
