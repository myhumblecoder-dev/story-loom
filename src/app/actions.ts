"use server"

import { db } from '@/lib/db'
import type { JournalEntry, WeeklyStory } from '@prisma/client'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function generateWeeklyStory(weekStart: Date): Promise<{ data?: WeeklyStory; error?: string }> {
  try {
    const entries = await db.journalEntry.findMany({
      where: {
        createdAt: {
          gte: weekStart,
          lt: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    if (entries.length === 0) {
      return { error: "No entries for this week." }
    }

    const prompt = `Based on the following journal entries, write a short (200-400 word) fiction story inspired by them:

${entries.map((entry, index) => `${index + 1}. ${entry.text}`).join('\n')}

The story should be creative and engaging, drawing connections between the events described in the entries.`

    const result = await generateText({
      model: anthropic('claude-3-5-haiku-20241022'),
      prompt,
    })

    const story = result.text.trim()

    const weeklyStory = await db.weeklyStory.upsert({
      where: { weekStart },
      update: { story },
      create: { weekStart, story },
    })

    return { data: weeklyStory }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to generate story"
    return { error: msg }
  }
}

export async function getStoryForWeek(weekStart: Date): Promise<WeeklyStory | null> {
  return await db.weeklyStory.findUnique({
    where: { weekStart }
  })
}