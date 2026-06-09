"use server"

import { db } from '@/lib/db'
import type { WeeklyStory } from '@prisma/client'

export async function saveWeeklyStory(weekStart: Date, story: string): Promise<WeeklyStory> {
  return await db.weeklyStory.upsert({
    where: { weekStart },
    update: { story },
    create: { weekStart, story }
  })
}