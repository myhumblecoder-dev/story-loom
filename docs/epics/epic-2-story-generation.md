# Epic 2 — Story Generation

*Goal: wire the LLM to generate a short creative story from this week's journal entries, store it, and display it on the home page with a pending state.*

---

## Story 5 — generateWeeklyStory Server Action

**Depends on:** Story 2

**Files to modify:**
- `src/app/actions.ts`

**Acceptance Criteria:**
- `src/app/actions.ts` gains `generateWeeklyStory(weekStart: Date): Promise<{ data?: WeeklyStory; error?: string }>`.
- The action fetches all `JournalEntry` rows for the given week; if zero entries exist it returns `{ error: "No entries for this week." }` without calling the AI API.
- It calls the Vercel AI SDK `generateText` with `anthropic("claude-3-5-haiku-20241022")`, passing a prompt that includes the week's entries as a numbered list and instructs the model to write a short (200–400 word) fiction story inspired by them.
- The generated story is upserted into `WeeklyStory` (unique on `weekStart`) and the record is returned in `data`.
- `getStoryForWeek(weekStart: Date): Promise<WeeklyStory | null>` is also added — fetches the stored story for a given week or returns null.

---

## Story 6 — WeeklyStoryPanel component and wired home page

**Depends on:** Story 4, Story 5

**Files to create:**
- `src/components/WeeklyStoryPanel.tsx`
- `src/components/WeeklyStoryPanel.test.tsx`

**Files to modify:**
- `src/app/page.tsx`

**Acceptance Criteria:**
- `WeeklyStoryPanel` is a `"use client"` component that accepts `initialStory: WeeklyStory | null` and `weekStart: Date` props.
- When `initialStory` is null: renders a "Generate this week's story" button; on click calls `generateWeeklyStory(weekStart)`, shows "Generating…" during the call, then displays the story text on success or an error message on failure.
- When `initialStory` is present: renders the story text in a shadcn/ui `Card` with a "Regenerate" button that triggers the same flow.
- `src/app/page.tsx` calls `getStoryForWeek(currentWeekStart())` and renders `<WeeklyStoryPanel initialStory={...} weekStart={...} />` below `EntryList`.
- `WeeklyStoryPanel.test.tsx` covers: shows generate button when no story (mocks action), shows pending state, displays story text after success, shows regenerate button when story present, shows error on failure.
