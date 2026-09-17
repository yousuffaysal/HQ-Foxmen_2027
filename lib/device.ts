import { headers } from "next/headers";
import { userAgent } from "next/server";

/**
 * True when the request comes from a phone.
 * Tablets/desktops fall through to the desktop experience.
 * Reading headers opts the caller into dynamic rendering.
 */
export async function isMobileDevice(): Promise<boolean> {
  const { device } = userAgent({ headers: await headers() });
  return device.type === "mobile";
}
