import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateWeeklyStory } from './generate-weekly-story'
import { listEntriesForWeek } from '@/lib/entries'
import { generateStory } from '@/lib/generate-story'
import { saveWeeklyStory } from '@/app/actions'
import type { JournalEntry, WeeklyStory } from '@prisma/client'

vi.mock('@/lib/entries', () => ({
  listEntriesForWeek: vi.fn(),
}))

vi.mock('@/lib/generate-story', () => ({
  generateStory: vi.fn(),
}))

vi.mock('@/app/actions', () => ({
  saveWeeklyStory: vi.fn(),
}))

describe('generate-weekly-story', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generate-weekly-story behaves per the acceptance criteria', async () => {
    // Arrange
    const weekStart = new Date(Date.UTC(2023, 10, 6))
    const mockEntries: JournalEntry[] = [
      {
        id: 'entry-1',
        text: 'Today was great!',
        createdAt: new Date(Date.UTC(2023, 10, 6, 10, 0, 0)),
      },
      {
        id: 'entry-2',
        text: 'Feeling tired.',
        createdAt: new Date(Date.UTC(2023, 10, 7, 15, 30, 0)),
      },
    ]
    const mockGeneratedText = 'Once upon a time, there was a great and tired day...'
    const mockSavedStory: WeeklyStory = {
      id: 'story-1',
      weekStart: weekStart,
      story: mockGeneratedText,
      createdAt: new Date(Date.UTC(2023, 10, 13, 0, 0, 0)),
    }

    vi.mocked(listEntriesForWeek).mockResolvedValue(mockEntries)
    vi.mocked(generateStory).mockResolvedValue(mockGeneratedText)
    vi.mocked(saveWeeklyStory).mockResolvedValue(mockSavedStory)

    // Act
    const result = await generateWeeklyStory(weekStart)

    // Assert
    expect(listEntriesForWeek).toHaveBeenCalledWith(weekStart)
    expect(generateStory).toHaveBeenCalledWith(mockEntries)
    expect(saveWeeklyStory).toHaveBeenCalledWith(weekStart, mockGeneratedText)
    expect(result).toEqual(mockSavedStory)
  })
})