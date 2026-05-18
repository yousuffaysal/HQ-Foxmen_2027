import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.text();
  const params = new URLSearchParams(body);
  const socketId = params.get("socket_id")!;
  const channelName = params.get("channel_name")!;

  const userId = (session.user as { id?: string }).id ?? "";

  if (channelName.startsWith("private-project-")) {
    const projectId = channelName.replace("private-project-", "");
    const data = pusherServer.authorizeChannel(socketId, channelName, {
      user_id: userId,
      user_info: { name: session.user.name, projectId },
    });
    return NextResponse.json(data);
  }

  if (channelName === `private-user-${userId}` || channelName === "private-admin") {
    const data = pusherServer.authorizeChannel(socketId, channelName);
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
