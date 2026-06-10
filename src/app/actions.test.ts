import { describe, it, expect, vi } from 'vitest'
import { db } from '@/lib/db'
import { createEntry, saveWeeklyStory } from './actions'

vi.mock('@/lib/db', () => ({
  db: {
    journalEntry: { create: vi.fn(), createMany: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn(), delete: vi.fn(), deleteMany: vi.fn(), upsert: vi.fn(), count: vi.fn() },
    weeklyStory: { create: vi.fn(), createMany: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn(), delete: vi.fn(), deleteMany: vi.fn(), upsert: vi.fn(), count: vi.fn() },
  },
}))

describe('actions', () => {
  it('createEntry persists a valid entry via db.journalEntry.create and returns the created row', async () => {
    const mockEntry = {
      id: '1',
      text: 'Hello world',
      createdAt: new Date(Date.UTC(2023, 5, 15)),
    }

    vi.mocked(db.journalEntry.create).mockResolvedValue(mockEntry)

    const result = await createEntry('Hello world')

    expect(db.journalEntry.create).toHaveBeenCalledWith({
      data: { text: 'Hello world' }
    })
    expect(result).toEqual({ data: mockEntry })
  })

  it('createEntry rejects whitespace-only text with the required-field error and does not call the database', async () => {
    vi.mocked(db.journalEntry.create).mockClear()

    const result = await createEntry('   ')

    expect(result).toEqual({ error: 'Entry text is required.' })
    expect(db.journalEntry.create).not.toHaveBeenCalled()
  })

  it('saveWeeklyStory upserts by weekStart with the story and returns the row', async () => {
    const mockWeeklyStory = {
      id: '1',
      weekStart: new Date(Date.UTC(2023, 5, 15)),
      story: 'This is a weekly story',
      createdAt: new Date(Date.UTC(2023, 5, 16)),
    }
    
    vi.mocked(db.weeklyStory.upsert).mockResolvedValue(mockWeeklyStory)
    
    const result = await saveWeeklyStory(new Date(Date.UTC(2023, 5, 15)), 'This is a weekly story')
    
    expect(db.weeklyStory.upsert).toHaveBeenCalledWith({
      where: { weekStart: new Date(Date.UTC(2023, 5, 15)) },
      update: { story: 'This is a weekly story' },
      create: { weekStart: new Date(Date.UTC(2023, 5, 15)), story: 'This is a weekly story' }
    })
    expect(result).toEqual(mockWeeklyStory)
  })
})