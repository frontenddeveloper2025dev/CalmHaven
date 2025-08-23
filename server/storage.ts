import { type MeditationSession, type InsertMeditationSession, type UserSettings, type InsertUserSettings } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Session methods
  createSession(session: InsertMeditationSession): Promise<MeditationSession>;
  getSessions(): Promise<MeditationSession[]>;
  getSessionStats(): Promise<{
    totalMinutes: number;
    sessionCount: number;
    streakDays: number;
  }>;
  
  // Settings methods
  getSettings(): Promise<UserSettings | undefined>;
  updateSettings(settings: Partial<InsertUserSettings>): Promise<UserSettings>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, MeditationSession>;
  private settings: UserSettings | undefined;

  constructor() {
    this.sessions = new Map();
    this.settings = undefined;
  }

  async createSession(insertSession: InsertMeditationSession): Promise<MeditationSession> {
    const id = randomUUID();
    const session: MeditationSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async getSessions(): Promise<MeditationSession[]> {
    return Array.from(this.sessions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getSessionStats(): Promise<{
    totalMinutes: number;
    sessionCount: number;
    streakDays: number;
  }> {
    const sessions = Array.from(this.sessions.values());
    const completedSessions = sessions.filter(s => s.completed);
    
    const totalMinutes = completedSessions.reduce((sum, s) => sum + Math.floor(s.duration / 60), 0);
    const sessionCount = completedSessions.length;
    
    // Calculate streak days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streakDays = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      const hasSessionThisDay = completedSessions.some(session => {
        const sessionDate = new Date(session.createdAt);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      });
      
      if (hasSessionThisDay) {
        streakDays++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (streakDays === 0 && currentDate.getTime() === today.getTime()) {
        // No session today, but we might have one yesterday
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return { totalMinutes, sessionCount, streakDays };
  }

  async getSettings(): Promise<UserSettings | undefined> {
    if (!this.settings) {
      // Create default settings
      this.settings = {
        id: randomUUID(),
        breathingRhythm: "4-7-8",
        breathingStyle: "circle",
        intervalBellFrequency: 5,
        bellVolume: 60,
        dailyReminder: true,
        sessionEndSound: true,
        soundVolumes: {
          rain: 70,
          ocean: 0,
          birds: 50,
          stream: 30,
          chimes: 0,
          bowls: 0
        },
        updatedAt: new Date(),
      };
    }
    return this.settings;
  }

  async updateSettings(settingsUpdate: Partial<InsertUserSettings>): Promise<UserSettings> {
    const currentSettings = await this.getSettings();
    this.settings = {
      ...currentSettings!,
      ...settingsUpdate,
      updatedAt: new Date(),
    };
    return this.settings;
  }
}

export const storage = new MemStorage();
