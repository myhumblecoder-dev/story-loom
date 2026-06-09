'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface EntryFormProps {
  createEntry: (text: string) => Promise<void>
}

export function EntryForm({ createEntry }: EntryFormProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text.trim()) {
      setError('Entry cannot be empty')
      return
    }
    
    setIsSaving(true)
    setError(null)
    
    try {
      await createEntry(text)
      setText('')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save entry'
      setError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your entry..."
        rows={4}
        aria-label="Write your entry"
      />
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving…' : 'Save Entry'}
      </Button>
    </form>
  )
}
