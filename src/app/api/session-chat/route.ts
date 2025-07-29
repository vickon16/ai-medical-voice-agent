import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { sessionsChat } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidV4 } from "uuid";

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;
  if (!userEmail || !userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { notes, selectedDoctorId } = await request.json();

    if (!notes || !selectedDoctorId) {
      return NextResponse.json(
        { error: "Notes and selected doctor are required" },
        { status: 400 }
      );
    }

    // Check if a session already exists for this user with the same doctor
    const existingSession = await db
      .select()
      .from(sessionsChat)
      .where(
        and(
          eq(sessionsChat.userId, userId),
          eq(sessionsChat.doctorId, selectedDoctorId)
        )
      );

    // If session exists, return it
    if (existingSession.length > 0) {
      return NextResponse.json({
        sessionId: existingSession[0].id,
        message: "Existing session found",
      });
    }

    // Create a new session
    const newSession = await db
      .insert(sessionsChat)
      .values({
        userId,
        sessionId: uuidV4(),
        notes,
        doctorId: selectedDoctorId,
        createdBy: userEmail,
        conversation: [], // Empty initial conversation
        report: {
          summary: "",
          keywords: [],
          analysis: {
            score: 0,
            notes: "",
          },
        },
      })
      .returning();

    return NextResponse.json({
      sessionId: newSession[0].id,
      message: "New session created",
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
