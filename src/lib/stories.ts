import { db } from "@/lib/db";
import type { WeeklyStory } from "@prisma/client";

/**
 * Retrieves the weekly story for a specific week start date.
 * 
 * @param weekStart - The start date of the week to look up.
 * @returns A promise that resolves to the WeeklyStory if found, or null.
 */
export async function getStoryForWeek(weekStart: Date): Promise<WeeklyStory | null> {
  return db.weeklyStory.findUnique({
    where: {
      weekStart,
    },
  });
}
