import { generateObject } from "ai";
import { gemini25Flash, openAi } from "..";
import { z } from "zod";
import { TDoctor } from "@/lib/types";
import { suggestDoctorSchema } from "../schema";

export const suggestDoctors = async (
  note: string,
  availableDoctors: TDoctor[]
) => {
  const mappedAvailableDoctors = availableDoctors.map((doctor) => ({
    id: doctor.id,
    specialist: doctor.specialist,
    description: doctor.description,
  }));

  const result = await generateObject({
    model: gemini25Flash,
    schema: z.object({
      suggestedDoctors: suggestDoctorSchema,
    }),
    system: `You are an intelligent medical triage assistant designed to help users find the most appropriate doctor based on their health concerns, symptoms, and preferences. 

    Your role is to analyze user input and recommend the best-suited medical specialist from the available doctors below.

    <availableDoctors>
    ${JSON.stringify(mappedAvailableDoctors, null, 2)}
    </availableDoctors>

    Guidelines:
    - Carefully analyze the user's symptoms, health concerns, and any specific requirements
    - Consider factors like age group (for pediatric needs), severity of symptoms, and specialty requirements
    - Match user needs with the most appropriate doctor specialist from the available database
    - If multiple doctors could help, rank them by suitability
    - If there is no suitable doctor, suggest a General Physician (GP) as a fallback option`,

    prompt: `User Input: "${note}"`,
  });

  const filteredDoctors = availableDoctors.filter((doctor) =>
    result.object.suggestedDoctors.some(
      (suggestedDoctor) => suggestedDoctor.id === doctor.id
    )
  );
  return filteredDoctors;
};
