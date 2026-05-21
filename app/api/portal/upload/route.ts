import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.formData();
  const file = data.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (!ALLOWED.has(file.type))
    return NextResponse.json({ error: "Only JPEG, PNG, WebP and GIF are allowed" }, { status: 415 });
  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: "Image exceeds 10 MB limit" }, { status: 413 });

  const cloud  = process.env.CLOUDINARY_CLOUD_NAME;
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset)
    return NextResponse.json({ error: "Upload not configured" }, { status: 500 });

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);
  form.append("folder", "foxmen-studio/messages");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body: form });
  if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 502 });

  const json = await res.json();
  return NextResponse.json({ url: json.secure_url as string });
}
