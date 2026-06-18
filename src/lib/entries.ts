import { db } from "@/lib/db"
import type { JournalEntry } from "@prisma/client"

/**
 * Fetches journal entries that fall within the 7-day window starting from weekStart.
 * The window is [weekStart, weekStart + 7 days).
 */
export async function listEntriesForWeek(weekStart: Date): Promise<JournalEntry[]> {
  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7)

  return await db.journalEntry.findMany({
    where: {
      createdAt: {
        gte: weekStart,
        lt: weekEnd,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}
