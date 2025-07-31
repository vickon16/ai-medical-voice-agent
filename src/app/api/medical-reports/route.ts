import { generateReport } from "@/lib/ai/functions/generate-report";
import { TMessages } from "@/lib/types";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { doctors, sessionsChat, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await auth();
  if (!user) return redirect("/auth/login");
  const body = await request.json();
  const sessionId = (body.sessionId || "") as string;
  const messages = (body?.messages || []) as TMessages[];

  try {
    const result = await db
      .select()
      .from(sessionsChat)
      .where(eq(sessionsChat.id, sessionId))
      .leftJoin(users, eq(users.id, sessionsChat.userId))
      .leftJoin(doctors, eq(doctors.id, sessionsChat.doctorId));

    const sessionDetails = result[0];
    if (
      !sessionDetails ||
      !sessionDetails.sessionChat ||
      !sessionDetails.doctor
    ) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const report = await generateReport(messages, {
      sessionId: sessionDetails.sessionChat.id,
      doctor: sessionDetails.doctor.specialist,
      patient: sessionDetails.user?.name || "Anonymous",
    });

    console.log({ report });

    await db.update(sessionsChat).set({
      report,
      conversation: messages,
    });

    return NextResponse.json(
      { message: "Report generated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating medical reports:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
