export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { iso8601ToDate } from '@/lib/week';
import { listEntriesForWeek } from '@/lib/entries';
import { getStoryForWeek } from '@/lib/stories';
import { EntryList } from '@/components/EntryList';
import { WeeklyStoryPanel } from '@/components/WeeklyStoryPanel';

interface PageProps {
  params: {
    weekStart: string;
  };
}

export default async function WeekHistoryPage({ params }: PageProps) {
  const { weekStart: weekStartStr } = params;
  const weekStart = iso8601ToDate(weekStartStr);

  const [entries, story] = await Promise.all([
    listEntriesForWeek(weekStart),
    getStoryForWeek(weekStart),
  ]);

  if (entries.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Link
          href="/history"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to history
        </Link>
        <h1 className="text-3xl font-bold">Week of {weekStart.toLocaleDateString()}</h1>
        <p className="text-muted-foreground">No entries found for this week.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <Link
        href="/history"
        className="text-sm text-muted-foreground hover:underline"
      >
        ← Back to history
      </Link>

      <header>
        <h1 className="text-3xl font-bold">
          Week of {weekStart.toLocaleDateString()}
        </h1>
      </header>

      <section className="space-y-4">
        <EntryList entries={entries} />
      </section>

      <section className="pt-8 border-t">
        <WeeklyStoryPanel initialStory={story} weekStart={weekStart} />
      </section>
    </div>
  );
}
