import { generateObject } from "ai";
import { gemini25Flash, openAi } from "..";
import { TMessages } from "@/lib/types";
import { generateReportSchema } from "../schema";

export const generateReport = async (
  messages: TMessages[],
  sessionDetails: {
    sessionId: string;
    doctor: string;
    patient: string;
  }
) => {
  const result = await generateObject({
    model: gemini25Flash,
    schema: generateReportSchema,
    system: `You are a medical voice agent that just finished a voice conversation with a patient. Your task is to generate a detailed medical report based on the conversation transcript provided.
    
    Guidelines:
    1. Summarize the patient's symptoms, concerns, and any relevant medical history.
    2. Analyze the conversation history and extract key medical information.
    3. Provide a clear and concise report that includes:
       - Chief Complaint: The main health concern or symptom reported by the patient in one sentence.
       - Summary: A detailed summary of the patient's symptoms, concerns, recommendations, and any relevant medical history.
       - Symptoms: A list of symptoms reported by the patient.
       - Duration: How long the user has experienced the symptoms.
       - Severity: The severity of the symptoms (mild, moderate, severe).
       - Medications Mentioned: A list of medications mentioned by the patient.
       - Recommendations: A list of recommendations provided by the doctor (e.g., 'Consult a specialist', 'Take prescribed medication', etc.).
    `,

    prompt: `Generate a medical report for a patient based on the following conversation history:

    <conversationHistory>
      ${JSON.stringify(messages, null, 2)}
    </conversationHistory>

    This is the session details of the doctor and patient:

    <sessionDetails>
      ${JSON.stringify(sessionDetails, null, 2)}
    </sessionDetails>
    `,
  });

  return result.object;
};
