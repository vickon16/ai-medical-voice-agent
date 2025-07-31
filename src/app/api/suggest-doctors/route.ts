import { suggestDoctors } from "@/lib/ai/functions/suggest-doctors";
import { db } from "@/server/db";
import { doctors } from "@/server/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const note = body.note;
  try {
    // Fetch all doctors from the database
    const allDoctors = await db.select().from(doctors);

    // If no doctors are found, return an appropriate response
    if (!allDoctors.length) {
      return NextResponse.json(
        { message: "No doctors available", doctors: [] },
        { status: 200 }
      );
    }

    const suggestedDoctors = await suggestDoctors(note, allDoctors);

    return NextResponse.json({ doctors: suggestedDoctors }, { status: 200 });
  } catch (error) {
    console.error("Error suggesting doctors:", error);
    return NextResponse.json(
      { error: "Failed to suggest doctors" },
      { status: 500 }
    );
  }
}
