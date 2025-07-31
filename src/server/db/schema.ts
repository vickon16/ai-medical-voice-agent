import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  boolean,
  varchar,
  primaryKey,
  json,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/core/adapters";
import type { TMessages } from "@/lib/types";
import { TGenerateReport } from "@/lib/ai/schema";

// ---------------------------------------------------
// Users Table
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  credits: integer("credits").notNull().default(10),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

export const doctors = pgTable("doctor", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  specialist: text("specialist").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  agentPrompt: text("agentPrompt").notNull(),
  voiceId: text("voiceId").notNull(),
  subscriptionRequired: boolean("subscriptionRequired").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const doctorsRelations = relations(doctors, ({ many }) => ({
  sessions: many(sessionsChat),
}));

export const sessionsChat = pgTable(
  "sessionChat",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    sessionId: text("sessionId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    notes: text("notes").notNull(),
    conversation: json("conversation").$type<TMessages[]>().notNull(),
    report: json("report").$type<TGenerateReport | null>(),
    doctorId: text("doctorId")
      .notNull()
      .references(() => doctors.id, { onDelete: "cascade" }),
    createdBy: text("createdBy").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  },
  (sessionChat) => [
    uniqueIndex("unique_session_user").on(
      sessionChat.sessionId,
      sessionChat.userId
    ),
  ]
);
