import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { doctors, sessionsChat, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const user = await auth();
  if (!user) return redirect("/auth/login");
  const { messages, sessionId } = await request.json();

  try {
    const result = await db
      .select()
      .from(sessionsChat)
      .where(eq(sessionsChat.id, sessionId))
      .leftJoin(users, eq(users.id, sessionsChat.userId))
      .leftJoin(doctors, eq(doctors.id, sessionsChat.doctorId));

    const sessionDetails = result[0];
    if (!sessionDetails) {
      return new Response("Session not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching session details:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
