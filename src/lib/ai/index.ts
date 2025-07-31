import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});

export const openAi = openai("gpt-4o-mini");

export const gemini25Flash = google("gemini-2.0-flash");
