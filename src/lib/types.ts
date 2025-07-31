import { doctors } from "@/server/db/schema";

export type TMessages = {
  type: "user" | "assistant" | "system";
  content: string;
  time: string;
};

export type TDoctor = typeof doctors.$inferSelect;
