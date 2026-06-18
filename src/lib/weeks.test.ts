import { describe, it, expect, vi, beforeEach } from 'vitest'
import { db } from '@/lib/db'
import { listWeeks } from './weeks'
import type { JournalEntry, WeeklyStory } from '@prisma/client'

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

describe('listWeeks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns weeks ordered DESC by weekStart, with correct entryCount and hasStory status', async () => {
    // Setup dates using UTC to ensure timezone independence
    // Week 1: Monday, Jan 1, 2024 (ISO Week 1)
    const week1Monday = new Date(Date.UTC(2024, 0, 1, 0, 0, 0, 0))
    // Week 2: Monday, Jan 8, 2024 (ISO Week 2)
    const week2Monday = new Date(Date.UTC(2024, 0, 8, 0, 0, 0, 0))
    // Week 3: Monday, Jan 15, 2024 (ISO Week 3)
    const week3Monday = new Date(Date.UTC(2024, 0, 15, 0, 0, 0, 0))

    // Mock Journal Entries
    // 2 entries in Week 1
    // 1 entry in Week 2
    const mockEntries: JournalEntry[] = [
      { id: 'e1', text: 'Entry 1', createdAt: new Date(Date.UTC(2024, 0, 1, 10, 0, 0)) },
      { id: 'e2', text: 'Entry 2', createdAt: new Date(Date.UTC(2024, 0, 2, 10, 0, 0)) },
      { id: 'e3', text: 'Entry 3', createdAt: new Date(Date.UTC(2024, 0, 8, 10, 0, 0)) },
    ]
    vi.mocked(db.journalEntry.findMany).mockResolvedValue(mockEntries)

    // Mock Weekly Stories
    // 1 story in Week 2
    // 1 story in Week 3 (no entries in this week)
    const mockStories: WeeklyStory[] = [
      { id: 's1', weekStart: week2Monday, story: 'Story 2', createdAt: new Date(0) },
      { id: 's2', weekStart: week3Monday, story: 'Story 3', createdAt: new Date(0) },
    ]
    vi.mocked(db.weeklyStory.findMany).mockResolvedValue(mockStories)

    const result = await listWeeks()

    // Assertions
    // Expected order: Week 3, Week 2, Week 1
    expect(result).toHaveLength(3)
    
    // Week 3 (Most recent)
    expect(result[0].weekStart.toISOString()).toBe(week3Monday.toISOString())
    expect(result[0].entryCount).toBe(0)
    expect(result[0].hasStory).toBe(true)

    // Week 2
    expect(result[1].weekStart.toISOString()).toBe(week2Monday.toISOString())
    expect(result[1].entryCount).toBe(1)
    expect(result[1].hasStory).toBe(true)

    // Week 1 (Oldest)
    expect(result[2].weekStart.toISOString()).toBe(week1Monday.toISOString())
    expect(result[2].entryCount).toBe(2)
    expect(result[2].hasStory).toBe(false)
  })

  it('handles empty database gracefully', async () => {
    vi.mocked(db.journalEntry.findMany).mockResolvedValue([])
    vi.mocked(db.weeklyStory.findMany).mockResolvedValue([])

    const result = await listWeeks()
    expect(result).toEqual([])
  })
})
