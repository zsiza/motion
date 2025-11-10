import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";

function assignColor(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

const liveblocks = new Liveblocks({
  secret:
    "sk_dev_ynAoL_zPrDHSYjQgI4I1VGttk55_bCjMiphA0uUwhQnFx6A8Z_clWiYga5pS7cGd",
});
const COLORS = [
  "#FF6B6B",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const color = assignColor(userId);

    const { status, body } = await liveblocks.identifyUser(
      {
        userId,
        groupIds: [],
      },
      {
        userInfo: {
          name: user.fullName ?? "Unknown",
          avatar: user.imageUrl ?? "",
          color,
        },
      }
    );

    console.log("🎟️ Liveblocks response:", status);
    return new Response(body, { status });
  } catch (err) {
    console.error("🔥 LIVEBLOCKS AUTH ERROR:", err);
    return new Response("Error", { status: 500 });
  }
}
