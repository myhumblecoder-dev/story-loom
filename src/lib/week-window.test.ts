import { describe, it, expect } from 'vitest'
import { weekWindow } from './week-window'

describe('week-window', () => {
  it('weekWindow returns gte equal to weekStart and lt exactly seven days later', () => {
    const weekStart = new Date(Date.UTC(2026, 5, 1)) // June 1, 2026
    const result = weekWindow(weekStart)
    
    expect(result.gte).toEqual(weekStart)
    expect(result.lt).toEqual(new Date(Date.UTC(2026, 5, 8))) // June 8, 2026
  })

  it('weekWindow window is half-open (lt is 7 days after gte, not 6 or 8)', () => {
    const weekStart = new Date(Date.UTC(2026, 5, 1)) // June 1, 2026
    const result = weekWindow(weekStart)
    
    // Verify the window is exactly 7 days
    const diffInMs = result.lt.getTime() - result.gte.getTime()
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    
    expect(diffInDays).toBe(7)
  })
})