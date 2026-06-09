import { z } from 'zod'

export const journalEntryTextSchema = z.string().trim().min(1).max(2000)
export const weekStartSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)