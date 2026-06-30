export const dynamic = 'force-dynamic';

import { listWeeks } from '@/lib/weeks';
import { WeekList } from '@/components/WeekList';

export default async function HistoryPage() {
  const weeks = await listWeeks();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your story history</h1>
      <WeekList weeks={weeks} />
    </div>
  );
}