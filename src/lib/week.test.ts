import { describe, it, expect } from 'vitest'
import { currentWeekStart, weekLabel, iso8601ToDate } from './week'

describe('week', () => {
  it('currentWeekStart returns a Monday at 00:00:00.000 UTC', () => {
    // Use a known date to make the test deterministic
    const testDate = new Date(Date.UTC(2026, 5, 1)) // 2026-06-01T00:00:00.000Z (a Monday)
    
    // Mock Date.now() to return our test date
    const originalNow = Date.now
    Date.now = () => testDate.getTime()
    
    try {
      const result = currentWeekStart()
      expect(result.getUTCDay()).toBe(1) // Monday is 1 in getUTCDay()
      expect(result.getUTCHours()).toBe(0)
      expect(result.getUTCMinutes()).toBe(0)
      expect(result.getUTCSeconds()).toBe(0)
      expect(result.getUTCMilliseconds()).toBe(0)
    } finally {
      // Restore original Date.now
      Date.now = originalNow
    }
  })

  it('weekLabel formats the week correctly', () => {
    const testDate = new Date(Date.UTC(2026, 5, 1)) // 2026-06-01T00:00:00.000Z (a Monday)
    const result = weekLabel(testDate)
    expect(result).toBe('Jun 1–Jun 7, 2026')
  })

  it('iso8601ToDate parses ISO string correctly', () => {
    const result = iso8601ToDate('2026-06-01T12:00:00.000Z')
    expect(result.toISOString()).toBe('2026-06-01T12:00:00.000Z')
  })
})