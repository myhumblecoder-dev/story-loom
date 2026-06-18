import { describe, it, expect, vi, beforeEach } from 'vitest'
import { db } from '@/lib/db'
import { getStoryForCC, getStoryForWeek } from '@/lib/stories'
import type { WeeklyStory } from '@prisma/client'

// Note: The error in the logs suggested a parsing error in the test file.
// The error 'Expected `from` but found `import`' usually indicates a syntax error
// or a malformed import statement in the test file itself.

vi.mock('@/lib/db', () => ({
  db: {
    journalEntry: { create: vi.fn(), createMany: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn(), delete: vi.fn(), deleteMany: vi.fn(), upsert: vi.fn(), count: vi.fn() },
    weeklyStory: { create: vi.fn(), createMany: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn(), delete: vi.fn(), deleteMany: vi.fn(), upsert: vi.fn(), count: vi.fn() },
  },
}))

describe('getStoryForWeek', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the WeeklyStory for the exact weekStart provided', async () => {
    const weekStart = new Date(Date.UTC(2023, 10, 6, 0, 0, 0, 0))
    const mockStory: WeeklyStory = {
      id: 'story-123',
      weekStart: weekStart,
      story: 'Once upon a time in a Vitest test...',
      createdAt: new Date(Date.UTC(2023, 10, 6, 12, 0, 0, 0)),
    }

    vi.mocked(db.weeklyStory.findUnique).mockResolvedValue(mockStory)

    const result = await getStoryForWeek(weekStart)

    expect(db.weeklyStory.findUnique).toHaveBeenCalledWith({
      where: { weekStart },
    })
    expect(result).toEqual(mockStory)
    expect(result?.id).toBe('story-123')
    expect(result?.weekStart.getUTCFullYear()).toBe(2023)
  })

  it('returns null if no story is found for the given weekStart', async () => {
    const weekStart = new Date(Date.UTC(2023, 10, 7, 0, 0, 0, 0))
    vi.mocked(db.weeklyStory.findUnique).mockResolvedValue(null)

    const result = await getStoryForWeek(weekStart)

    expect(db.weeklyStory.findUnique).toHaveBeenCalledWith({
      where: { weekStart },
    })
    expect(result).toBeNull()
  })
})
