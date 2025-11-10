import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userIds } = await req.json();

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return NextResponse.json([]);
  }

  const client = await clerkClient();
  const users = await client.users.getUserList({ userId: userIds });
  console.log("✅ Clerk returned:", users.data);

  return NextResponse.json({
    users: users.data.map((user) => ({
      id: user.id,
      name: user.firstName + " " + user.lastName,
      avatar: user.imageUrl,
      color: undefined,
    })),
  });
}
