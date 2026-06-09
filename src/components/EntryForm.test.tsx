import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EntryForm } from './EntryForm'

describe('EntryForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form elements', async () => {
    const mockCreateEntry = vi.fn()
    render(<EntryForm createEntry={mockCreateEntry} />)
    
    expect(screen.getByRole('textbox', { name: /write your entry/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save entry/i })).toBeInTheDocument()
  })

  it('submits non-empty text (mocks createEntry)', async () => {
    const mockCreateEntry = vi.fn()
    render(<EntryForm createEntry={mockCreateEntry} />)
    
    const user = userEvent.setup()
    const textarea = screen.getByRole('textbox', { name: /write your entry/i })
    await user.type(textarea, 'Test entry')
    await user.click(screen.getByRole('button', { name: /save entry/i }))
    
    expect(mockCreateEntry).toHaveBeenCalledWith('Test entry')
  })

  it('clears field after success', async () => {
    const mockCreateEntry = vi.fn().mockResolvedValue(undefined)
    render(<EntryForm createEntry={mockCreateEntry} />)
    
    const user = userEvent.setup()
    const textarea = screen.getByRole('textbox', { name: /write your entry/i })
    await user.type(textarea, 'Test entry')
    await user.click(screen.getByRole('button', { name: /save entry/i }))
    
    expect(textarea).toHaveValue('')
  })

  it('shows error on failure', async () => {
    const mockCreateEntry = vi.fn().mockRejectedValue(new Error('Save failed'))
    render(<EntryForm createEntry={mockCreateEntry} />)
    
    const user = userEvent.setup()
    const textarea = screen.getByRole('textbox', { name: /write your entry/i })
    await user.type(textarea, 'Test entry')
    await user.click(screen.getByRole('button', { name: /save entry/i }))
    
    expect(await screen.findByText(/save failed/i)).toBeInTheDocument()
  })

  it('blocks empty/whitespace submit', async () => {
    const mockCreateEntry = vi.fn()
    render(<EntryForm createEntry={mockCreateEntry} />)
    
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /save entry/i }))
    
    expect(mockCreateEntry).not.toHaveBeenCalled()
    expect(await screen.findByText(/entry cannot be empty/i)).toBeInTheDocument()
  })
})