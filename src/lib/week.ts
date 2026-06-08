export function currentWeekStart(): Date {
  const now = new Date()
  const day = now.getUTCDay()
  const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1) // adjust when day is Sunday
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff))
  return monday
}

export function weekLabel(date: Date): string {
  const start = new Date(date)
  start.setUTCDate(start.getUTCDate() + 1) // Move to Tuesday to ensure correct week
  const end = new Date(start)
  end.setUTCDate(start.getUTCDate() + 6)

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  if (start.getUTCFullYear() === end.getUTCFullYear()) {
    return `${startStr}–${endStr}`
  }

  return `${startStr}, ${start.getUTCFullYear()}–${endStr}`
}

export function iso8601ToDate(s: string): Date {
  return new Date(s)
}
