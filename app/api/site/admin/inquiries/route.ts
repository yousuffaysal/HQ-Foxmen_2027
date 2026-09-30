import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { deleteInquiry, listInquiries, setInquiryStatus } from "@/lib/site/store";
import { INQUIRY_STATUSES } from "@/lib/site/data";
import { sameOrigin } from "@/lib/site/sanitize";

export const runtime = "nodejs";

export async function GET() {
  const deny = await requireAdmin(); if (deny) return deny;
  return NextResponse.json(await listInquiries());
}

export async function PATCH(req: Request) {
  const deny = await requireAdmin(); if (deny) return deny;
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, status } = await req.json().catch(() => ({}));
  if (!Number.isInteger(id) || !(INQUIRY_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "Invalid id or status" }, { status: 400 });
  }
  return (await setInquiryStatus(id, status)) ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(req: Request) {
  const deny = await requireAdmin(); if (deny) return deny;
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json().catch(() => ({}));
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  return (await deleteInquiry(id)) ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
