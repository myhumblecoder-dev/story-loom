import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WeeklyStoryPanel } from './WeeklyStoryPanel'

vi.mock('@/app/actions/generate-weekly-story', () => ({
  generateWeeklyStory: vi.fn(),
}))

describe('WeeklyStoryPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the Generate this week\'s story button when initialStory is null', async () => {
    render(<WeeklyStoryPanel initialStory={null} weekStart={new Date('2024-01-01')} />)
    expect(screen.getByRole('button', { name: "Generate this week's story" })).toBeInTheDocument()
  })

  it('renders the story text and a Regenerate button when initialStory is present', async () => {
    const initialStory = {
      id: '1',
      weekStart: new Date('202rab-01-01'),
      story: 'Once upon a time...',
      createdAt: new Date(),
    }
    render(<WeeklyStoryPanel initialStory={initialStory as any} weekStart={new Date('2024-01-01')} />)
    expect(screen.getByText('Once upon a time...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Regenerate' })).toBeInTheDocument()
  })
})
