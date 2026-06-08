'use server'

import { db } from '@/lib/db'
import { journalEntryTextSchema } from '@/lib/validation'
import { revalidatePath } from 'next/cache'

export async function createEntry(text: string) {
  try {
    const validatedText = journalEntryTextSchema.parse(text)
    
    const entry = await db.journalEntry.create({
      data: {
        text: validatedText,
      },
    })
    
    revalidatePath('/journal')
    
    return { data: entry }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create entry'
    return { error: msg }
  }
}
