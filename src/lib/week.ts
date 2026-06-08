import { addDays, format } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

export function currentWeekStart(): Date {
  const now = new Date()
  const day = now.getUTCDay()
  const diff = (day === 0 ? -6 : 1) - day // Adjust so that Monday is 1 and Sunday is 0
  const monday = new Date(now)
  monday.setUTCDate(now.getUTCDate() + diff)
  monday.setUTCHours(0, 0, 0, 0)
  return monday
}

export function weekLabel(date: Date): string {
  const start = formatInTimeZone(date, 'UTC', 'MMM d')
  const end = formatInTimeZone(addDays(date, 6), 'UTC', 'MMM d')
  const year = formatInTimeZone(date, 'UTC', 'yyyy')
  return `${start}–${end}, ${year}`
}

export function iso8601ToDate(s: string): Date {
  return new Date(s)
}