# Epic 1 — Entry Capture

*Goal: lay the data foundation (schema + db + week helpers) and deliver a working home page where a user can type free-text journal entries and see this week's list.*

---

## Story 1.1 — Database schema, Prisma client, and week helpers

**Depends on:** (none)

**Files to create:**
- `prisma/schema.prisma`
- `src/lib/db.ts`
- `src/lib/week.ts`
- `src/lib/week.test.ts`

**Acceptance Criteria:**
- `prisma/schema.prisma` declares `JournalEntry` (id, text, createdAt) and `WeeklyStory` (id, weekStart, story, createdAt) with indexes per the architecture data model.
- `src/lib/db.ts` exports a single Prisma client instance using the `globalThis` singleton pattern.
- `src/lib/week.ts` exports `currentWeekStart()` returning the Monday UTC midnight `Date` of the current ISO week, `weekLabel(date: Date): string` returning a human-readable label (e.g., "Jun 2–8, 2026"), and `iso8601ToDate(s: string): Date`.
- `week.test.ts` covers: `currentWeekStart()` always returns a Monday, `weekLabel` formats correctly, `iso8601ToDate` round-trips.

---

## Story 1.2 — Entry validation and `createEntry` Server Action

**Depends on:** Story 1.1

**Files to create:**
- `src/lib/validation.ts`
- `src/app/actions.ts`

**Acceptance Criteria:**
- `src/lib/validation.ts` exports `journalEntryTextSchema` (non-empty string, trimmed, max 2000 chars) and `weekStartSchema` (ISO8601 date string).
- `src/app/actions.ts` exports `createEntry(text: string): Promise<{ data?: JournalEntry; error?: string }>` — validates via Zod, inserts into DB, returns the created entry.
- Whitespace-only or empty text returns `{ error: "Entry text is required." }` without hitting the DB.
- The action is marked `"use server"` and imports db via `@/lib/db`.

---

## Story 1.3 — EntryForm component

**Depends on:** Story 1.2

**Files to create:**
- `src/components/EntryForm.tsx`
- `src/components/EntryForm.test.tsx`

**Acceptance Criteria:**
- `EntryForm` is a `"use client"` component that renders a shadcn/ui `Textarea` and a submit `Button`.
- On submit it calls `createEntry(text)` and clears the field on success; on error it displays the error message below the textarea.
- The button shows "Saving…" and is disabled while the action is pending.
- `EntryForm.test.tsx` covers: renders form elements, submits non-empty text (mocks `createEntry`), clears field after success, shows error on failure, blocks empty/whitespace submit.

---

## Story 1.4 — EntryList component and wired home page

**Depends on:** Story 1.2

**Files to create:**
- `src/components/EntryList.tsx`
- `src/components/EntryList.test.tsx`

**Files to modify:**
- `src/app/actions.ts`
- `src/app/page.tsx`

**Acceptance Criteria:**
- `src/app/actions.ts` gains `listEntriesForWeek(weekStart: Date): Promise<JournalEntry[]>` — fetches entries where `createdAt >= weekStart && createdAt < weekStart + 7 days`, ordered by `createdAt desc`.
- `EntryList` is a server component that renders the list of entries with relative timestamps; shows "No entries yet this week." when empty.
- `src/app/page.tsx` calls `listEntriesForWeek(currentWeekStart())` and renders `<EntryForm />` above `<EntryList entries={…} />`.
- `EntryList.test.tsx` covers: renders entries in order, shows empty state, renders timestamps.
