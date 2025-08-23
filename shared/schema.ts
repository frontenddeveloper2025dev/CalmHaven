import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const meditationSessions = pgTable("meditation_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  duration: integer("duration").notNull(), // in seconds
  sounds: jsonb("sounds").$type<string[]>().default([]),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  breathingRhythm: text("breathing_rhythm").notNull().default("4-7-8"),
  breathingStyle: text("breathing_style").notNull().default("circle"),
  intervalBellFrequency: integer("interval_bell_frequency").notNull().default(5), // in minutes
  bellVolume: integer("bell_volume").notNull().default(60),
  dailyReminder: boolean("daily_reminder").notNull().default(true),
  sessionEndSound: boolean("session_end_sound").notNull().default(true),
  soundVolumes: jsonb("sound_volumes").$type<Record<string, number>>().default({}),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMeditationSessionSchema = createInsertSchema(meditationSessions).omit({
  id: true,
  createdAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertMeditationSession = z.infer<typeof insertMeditationSessionSchema>;
export type MeditationSession = typeof meditationSessions.$inferSelect;

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
