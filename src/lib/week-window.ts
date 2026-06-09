import { addDays } from 'date-fns'

export function weekWindow(weekStart: Date): { gte: Date; lt: Date } {
  return {
    gte: weekStart,
    lt: addDays(weekStart, 7),
  }
}