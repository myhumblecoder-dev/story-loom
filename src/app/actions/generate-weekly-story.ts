"use server"

import { listEntriesForWeek } from "@/lib/entries"
import { generateStory } from "@/lib/generate-story"
import { saveWeeklyStory } from "@/app/actions"
import type { WeeklyStory } from "@prisma/client"

/**
 * Orchestrates the generation of a weekly story by fetching entries,
 * generating text via AI, and persisting the result.
 */
export async function generateWeeklyStory(weekStart: Date): Promise<WeeklyStory> {
  // 1. Read the week's entries via listEntriesForWeek(weekStart)
  const entries = await listEntriesForWeek(weekStart)

  // 2. Generate text via generateStory(entries)
  const text = await generateStory(entries)

  // 3. Persist + return via saveWeeklyStory(weekStart, text)
  const story = await saveWeeklyStory(weekStart, text)

  return story
}