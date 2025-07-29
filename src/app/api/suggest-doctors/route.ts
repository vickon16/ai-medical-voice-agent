import { db } from "@/server/db";
import { doctors } from "@/server/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const notes = body.notes;
  console.log({ notes });
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

    // Shuffle the doctors array to randomize it
    const shuffledDoctors = [...allDoctors].sort(() => Math.random() - 0.5);

    // Take up to 5 doctors (or fewer if there aren't 5 available)
    const suggestedDoctors = shuffledDoctors.slice(0, 5);

    return NextResponse.json({ doctors: suggestedDoctors }, { status: 200 });
  } catch (error) {
    console.error("Error suggesting doctors:", error);
    return NextResponse.json(
      { error: "Failed to suggest doctors" },
      { status: 500 }
    );
  }
}
