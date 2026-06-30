import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateStory } from './generate-story'

describe('generate-story', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('generateStory returns the Ollama response text — `vi.stubGlobal(\'fetch\', vi.fn())`, mock it to resolve `{ ok: true, json: async () => ({ response: \'The generated story\' }) }`, assert the result is `\'The generated story\'`', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ response: 'The generated story' }),
    }
    vi.mocked(fetch).mockResolvedValue(mockResponse as Response)

    const result = await generateStory([{ text: 'Entry 1' }])

    expect(result).toBe('The generated story')
  })

  it('generateStory sends a prompt containing the entries — call with `[{ text: \'Entry A\' }, { text: \'Entry B\' }]`, then assert the fetch was called and the request body (JSON.parse of the `body` arg) `.prompt` contains `\'- Entry A\'` and `\'- Entry B\'`', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ response: 'The generated story' }),
    }
    vi.mocked(fetch).mockResolvedValue(mockResponse as Response)

    const testEntries = [{ text: 'Entry A' }, { text: 'Entry B' }]

    await generateStory(testEntries)

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/generate'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('- Entry A'),
      })
    )

    const callArgs = vi.mocked(fetch).mock.calls[0][1]
    const body = JSON.parse(callArgs.body as string)
    expect(body.prompt).toContain('- Entry A')
    expect(body.prompt).toContain('- Entry B')
  })
})
