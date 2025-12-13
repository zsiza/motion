import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";

const COLORS = [
  "#FF6B6B",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

function assignColor(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const user = await currentUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { room } = await req.json();
    if (!room) return new Response("Missing room ID", { status: 400 });

    const color = assignColor(userId);

    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name: user.fullName ?? "Unknown",
        avatar: user.imageUrl ?? "",
        color,
      },
    });

    session.allow(room, session.FULL_ACCESS);

    const { body } = await session.authorize();
    const parsed = JSON.parse(body);

    return Response.json(parsed);
  } catch (error) {
    console.error("🔥 LIVEBLOCKS AUTH ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
