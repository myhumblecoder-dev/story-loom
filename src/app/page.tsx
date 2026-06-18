export const dynamic = 'force-dynamic';

import { currentWeekStart } from '@/lib/week';
import { createEntry } from '@/app/actions';
import { listEntriesForWeek } from '@/lib/entries';
import { EntryForm } from '@/components/EntryForm';
import { EntryList } from '@/components/EntryList';

export default async function Home() {
  const entries = await listEntriesForWeek(currentWeekStart());

  return (
    <main className="flex flex-col items-center gap-8 py-12 px-4 max-w-3xl mx-auto">
      <div className="w-full">
        <EntryForm createEntry={async (text) => { await createEntry(text); }} />
      </div>
      <div className="w-full">
        <EntryList entries={entries} />
      </div>
    </main>
  );
}