import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { doctors, sessionsChat, users } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { Circle, PhoneCall } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export const getSessionDetails = async (sessionId: string) => {
  const user = await auth();
  if (!user) return redirect("/auth/login");

  try {
    const result = await db
      .select()
      .from(sessionsChat)
      .where(eq(sessionsChat.id, sessionId))
      .leftJoin(users, eq(users.id, sessionsChat.userId))
      .leftJoin(doctors, eq(doctors.id, sessionsChat.doctorId));

    return result[0];
  } catch (error) {
    console.error("Error fetching session details:", error);
    return null;
  }
};

export const getAllSessionDetails = async () => {
  const user = await auth();
  if (!user || !user?.user?.email) return redirect("/auth/login");

  try {
    const result = await db
      .select()
      .from(sessionsChat)
      .where(eq(sessionsChat.createdBy, user.user.email))
      .orderBy(desc(sessionsChat.createdAt))
      .leftJoin(users, eq(users.id, sessionsChat.userId))
      .leftJoin(doctors, eq(doctors.id, sessionsChat.doctorId));

    return result;
  } catch (error) {
    console.error("Error fetching session details:", error);
    return [];
  }
};
