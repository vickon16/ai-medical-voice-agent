import z from "zod";

export const generateReportSchema = z.object({
  sessionId: z.string().describe("a unique identifier for the session"),
  doctor: z
    .string()
    .describe("the medical specialist name (e.g, 'General Physician')"),
  patient: z
    .string()
    .describe("the patient's name or 'Anonymous' if not provided"),
  timestamp: z.string().describe("the current date and time in ISO format"),
  chiefComplaint: z
    .string()
    .describe(
      "the main health concern or symptom reported by the patient in one sentence"
    ),
  summary: z
    .string()
    .describe(
      "a detailed summary of the patient's symptoms, concerns, recommendations, and any relevant medical history"
    ),
  symptoms: z
    .array(z.string().describe("possible symptoms reported by the patient"))
    .describe("a list of symptoms reported by the patient"),
  duration: z
    .string()
    .nullable()
    .describe("How long the user has experienced the symptoms"),
  severity: z
    .enum(["mild", "moderate", "severe", "not-specified"])
    .describe("the severity of the symptoms"),
  medicationsMentioned: z
    .array(z.string().describe("medications mentioned by the patient"))
    .describe("a list of medications mentioned by the patient"),
  recommendations: z
    .array(z.string().describe("recommendations provided by the doctor"))
    .describe(
      "a list of recommendations provided by the doctor. e.g., 'Consult a specialist', 'Take prescribed medication', etc."
    ),
});

export type TGenerateReport = z.infer<typeof generateReportSchema>;

export const suggestDoctorSchema = z.array(
  z.object({
    id: z.string().describe("Unique identifier for the doctor"),
    specialist: z.string().describe("Specialty of the doctor"),
    description: z
      .string()
      .describe("Description of why this doctor is a good fit"),
  })
);

export type TSuggestDoctor = z.infer<typeof suggestDoctorSchema>;
