# Epic 3 — History

*Goal: allow the user to browse all past weeks, view each week's entries and generated story, and generate/regenerate stories for past weeks.*

---

## Story 3.1 — `listWeeks` Server Action and WeekList component

**Depends on:** Story 1.4

**Files to create:**
- `src/components/WeekList.tsx`
- `src/components/WeekList.test.tsx`

**Files to modify:**
- `src/app/actions.ts`
- `src/app/history/page.tsx`

**Acceptance Criteria:**
- `src/app/actions.ts` gains `listWeeks(): Promise<{ weekStart: Date; entryCount: number; hasStory: boolean }[]>` — groups `JournalEntry` rows by ISO week, joins with `WeeklyStory`, returns weeks ordered descending by `weekStart`.
- `WeekList` is a server component that renders the list as navigation links using `weekLabel()` from `src/lib/week.ts`; each link points to `/history/[weekStart]` (ISO8601 string); shows entry count and a "📖" badge if a story exists; shows "No past weeks yet." when empty.
- `src/app/history/page.tsx` calls `listWeeks()` and renders `<WeekList weeks={…} />` with a heading "Your story history".
- `WeekList.test.tsx` covers: renders week links with labels, shows badge for weeks with stories, shows empty state.

---

## Story 3.2 — Per-week detail page

**Depends on:** Story 1.4, Story 2.2

**Files to create:**
- `src/app/history/[weekStart]/page.tsx`

**Acceptance Criteria:**
- `src/app/history/[weekStart]/page.tsx` is a server component that reads `params.weekStart` (ISO8601), converts it with `iso8601ToDate`, then calls `listEntriesForWeek` and `getStoryForWeek` in parallel.
- Renders the week label as a heading, `<EntryList entries={…} />` for that week's entries, and `<WeeklyStoryPanel initialStory={…} weekStart={…} />` below.
- If no entries exist for the week, renders "No entries found for this week." instead of the panels.
- A "← History" back link is included at the top.
