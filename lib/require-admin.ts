import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/** Returns a 401/403 response if the caller is not an authenticated admin, otherwise null. */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if ((session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
