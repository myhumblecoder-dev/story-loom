import { describe, it, expect } from 'vitest'
import { currentWeekStart, weekLabel, iso8601ToDate } from './week'

describe('week', () => {
  it('currentWeekStart() always returns a Monday', () => {
    const monday = currentWeekStart()
    expect(monday.getUTCDay()).toBe(1) // Monday is 1 in UTC day format
    expect(monday.getUTCHours()).toBe(0)
    expect(monday.getUTCMinutes()).toBe(0)
    expect(monday.getUTCSeconds()).toBe(0)
    expect(monday.getUTCMilliseconds()).toBe(0)
  })

  it('weekLabel formats correctly', () => {
    // Test a known date (Monday, June 2, 2026)
    const testDate = new Date(Date.UTC(2026, 5, 2)) // June is month 5
    const label = weekLabel(testDate)
    expect(label).toBe('Jun 2–Jun 8, 2026')
  })

  it('iso8601ToDate round-trips', () => {
    const originalDate = new Date('2026-06-02T10:30:00Z')
    const isoString = originalDate.toISOString()
    const roundTripped = iso8601ToDate(isoString)
    expect(roundTripped.toISOString()).toBe(originalDate.toISOString())
  })
})