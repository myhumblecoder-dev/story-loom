import { db } from "@/lib/db";
import { startOfISOWeek } from "date-fns";

export interface WeekSummary {
  weekStart: Date;
  entryCount: number;
  hasStory: boolean;
}

/**
 * Fetches all journal entries and weekly stories, grouping them by
 * their ISO-week Monday start date.
 */
export async function listWeeks(): Promise<WeekSummary[]> {
  const [entries, stories] = await Promise.all([
    db.journalEntry.findMany(),
    db.weeklyStory.findMany(),
  ]);

  // Map to track counts and story presence per week start date
  // Key is the ISO string of the Monday 00:00:00 UTC
  const weekMap = new Map<string, { weekStart: Date; entryCount: number; hasStory: boolean }>();

  // Process entries
  for (const entry of entries) {
    const monday = startOfISOWeek(entry.createdAt);
    const key = monday.toISOString();

    const existing = weekMap.get(key);
    if (existing) {
      existing.entryCount += 1;
    } else {
      weekMap.set(key, {
        weekStart: monday,
        entryCount: 1,
        hasStory: false,
      });
    }
  }

  // Process stories
  for (const story of stories) {
    const monday = startOfISOWeek(story.weekStart);
    const key = monday.toISOString();

    const existing = weekMap.get(key);
    if (existing) {
      existing.hasStory = true;
    } else {
      // If a story exists for a week that has no entries yet
      weekMap.set(key, {
        weekStart: monday,
        entryCount: 0,
        hasStory: true,
      });
    }
  }

  // Convert map to array and sort DESC by weekStart
  return Array.from(weekMap.values()).sort(
    (a, b) => b.weekStart.getTime() - a.weekStart.getTime(),
  );
}