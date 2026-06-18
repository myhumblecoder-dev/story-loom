import { describe, it, expect, vi, beforeEach } from 'vitest'
import { db } from '@/lib/db'
import { listEntriesForCC } from './entries'
import { listEntriesForWeek } from './entries'
import type { JournalEntry } from '@prisma/client'

// Note: The error in the previous attempt was a syntax error in the import statement:
// 'import type { JournalEntry } from "@prisma/client"' was missing 'from' or had a typo.
// Also, the import list in the scaffold was broken.

// Re-writing the imports correctly to avoid the 'from' expected error.
import { listEntriesForWeek as listEntries } from './entries'

vi.mock('@/lib/db', () => ({
  db: {
    journalEntry: {
      create: vi.fn(),
      createMany: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      upsert: vi.fn(),
      count: vi.fn(),
    },
    weeklyStory: {
      create: vi.fn(),
      createMany: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      upsert: vi.fn(),
      count: vi.fn(),
    },
  },
}))

describe('listEntriesForWeek', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches entries within the 7-day window [weekStart, weekStart + 7 days) ordered by createdAt desc', async () => {
    // Arrange: Setup a deterministic week start (Monday, Jan 1, 2024)
    const weekStart = new Date(Date.UTC(2024, 0, 1, 0, 0, 0, 0))
    const weekEnd = new Date(Date.UTC(2024, 0, 8, 0, 0, 0, 0))

    const mockEntries: JournalEntry[] = [
      {
        id: 'entry-2',
        text: 'Second entry',
        createdAt: new Date(Date.UTC(2024, 0, 5, 12, 0, 0, 0)),
      },
      {
        id: 'entry-1',
        text: 'First entry',
        createdAt: new Date(Date.UTC(2024, 0, 1, 10, 0, 0, 0)),
      },
    ]

    vi.mocked(db.journalEntry.findMany).mockResolvedValue(mockEntries)

    // Act
    const result = await listEntriesForWeek(weekStart)

    // Assert
    expect(db.journalEntry.findMany).toHaveBeenCalledWith({
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
    expect(result).toEqual(mockEntries)
  })
})
