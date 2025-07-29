import { doctors } from "@/server/db/schema";

export type ConversationItem = {
  role: "user" | "assistant";
  content: string;
  timestamp: string; // or Date, depending on how you store it
};

export type Report = {
  summary: string;
  keywords: string[];
  analysis: {
    score: number;
    notes: string;
  };
};

export type TDoctor = typeof doctors.$inferSelect;
