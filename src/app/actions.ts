"use server"

import { db } from '@/lib/db'
import type { JournalEntry } from '@prisma/client'
import { journalEntryTextSchema } from '@/lib/validation'

export async function createEntry(text: string): Promise<{ data?: JournalEntry; error?: string }> {
  const result = journalEntryTextSchema.safeParse(text)

  if (!result.success) {
    return { error: 'Entry text is required.' }
  }

  try {
    const data = await db.journalEntry.create({
      data: { text: result.data }
    })
    return { data }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create entry'
    return { error: msg }
  }
}