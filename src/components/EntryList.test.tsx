import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EntryList } from './EntryList'
import { formatDistanceToNow } from 'date-fns'

vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn(),
}))

describe('EntryList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders entries in order', async () => {
    const entries = [
      { id: '1', text: 'First entry', createdAt: new Date('2024-01-01T10:00:00Z') },
      { id: '2', text: 'Second entry', createdAt: new Date('2024-01-01T11:00:00Z') },
    ]
    vi.mocked(formatDistanceToNow).mockReturnValue('1 day ago')

    render(<EntryList entries={entries} />)

    const elements = screen.getAllByText(/entry/i)
    expect(elements).toHaveLength(2)
    expect(elements[0]).toHaveTextContent('First entry')
    expect(elements[1]).toHaveTextContent('Second entry')
  })

  it('shows the empty state', async () => {
    render(<EntryList entries={[]} />)
    expect(screen.getByText('No entries yet this week.')).toBeInTheDocument()
  })

  it('renders timestamps. Build the entries fixtures inline (plain objects matching JournalEntry); no DB', async () => {
    const entries = [
      { id: '1', text: 'Entry with time', createdAt: new Date('202<0xA0>24-01-01T10:00:00Z') },
    ]
    vi.mocked(formatDistanceToNow).mockReturnValue('about 1 hour ago')

    render(<EntryList entries={entries} />)

    expect(screen.getByText('about 1 hour ago')).toBeInTheDocument()
    expect(screen.getByText('Entry with time')).toBeInTheDocument()
  })
})
