import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { generateStory } from './generate-story'

vi.mock('ai', () => ({ generateText: vi.fn() }))
vi.mock('@ai-sdk/anthropic', () => ({ anthropic: vi.fn() }))

describe('generate-story', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generateStory returns the text produced by generateText', async () => {
    vi.mocked(generateText).mockResolvedValue({ text: 'The generated story' } as { text: string })

    const result = await generateStory([{ text: 'Entry 1' }])

    expect(result).toBe('The generated story')
    expect(generateText).toHaveBeenCalled()
  })

  it('generateStory builds a prompt that includes each entry\'s text', async () => {
    vi.mocked(generateText).mockResolvedValue({ text: '...' } as { text: string })
    const entries = [{ text: 'Entry A' }, { text: 'Entry B' }]

    await generateStory(entries)

    expect(generateText).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('- Entry A\n- Entry B')
      })
    )
    expect(anthropic).toHaveBeenCalledWith('claude-3-5-haiku-20241022')
  })
})
