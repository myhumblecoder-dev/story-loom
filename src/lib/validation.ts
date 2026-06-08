import { z } from 'zod'

export const journalEntryTextSchema = z
  .string()
  .min(1, 'Entry text is required.')
  .trim()
  .max(2000, 'Entry text must be less than 2000 characters.')

export const weekStartSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Expected YYYY-MM-DD.')
