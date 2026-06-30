import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WeekList } from './WeekList'
import { weekLabel } from '@/lib/week'

vi.mock('@/lib/week', () => ({
  weekLabel: vi.fn(),
}))

describe('WeekList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('WeekList renders', async () => {
    const week1 = { weekStart: new Date('2024-01-01T00:00:00.000Z'), entryCount: 3, hasStory: true }
    const week2 = { weekStart: new Date('2024-01-08T00:00:00.000Z'), entryCount: 0, hasStory: false }
    
    vi.mocked(weekLabel).mockImplementation((date) => {
      if (date.toISOString() === week1.weekStart.toISOString()) return 'Jan 1–Jan 7, 2024'
      return 'Jan 8–Jan 14, 2024'
    })

    const { container } = render(<WeekList weeks={[week1, week2]} />)

    // Verify links by href
    const link1 = container.querySelector('a[href="/history/2024-01-01T00:00:00.000Z"]')
    const link2 = container.querySelector('a[href="/history/2024-01-08T00:00:00.000Z"]')
    expect(link1).toBeInTheDocument()
    expect(link2).toBeInTheDocument()

    // Verify entry count text
    expect(screen.getByText('3 entries')).toBeInTheDocument()
    expect(screen.getByText('0 entries')).toBeInTheDocument()

    // Verify Story span presence/absence
    expect(screen.getByText('Story')).toBeInTheDocument()
    // We check the second week specifically for absence
    const week2Container = container.querySelector('li:nth-child(2)')
    expect(week2Container?.textContent).not.toContain('Story')

    // Verify empty state
    const { rerender } = render(<WeekList weeks={[]} />)
    expect(screen.getByText('No past weeks yet.')).toBeInTheDocument()
  })
})