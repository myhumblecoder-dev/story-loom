import Link from 'next/link';
import { weekLabel } from '@/lib/week';

interface WeekData {
  weekStart: Date;
  entryCount: number;
  hasStory: boolean;
}

interface WeekListProps {
  weeks: WeekData[];
}

export function WeekList({ weeks }: WeekListProps) {
  if (weeks.length === 0) {
    return <p>No past weeks yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {weeks.map((week) => (
        <li key={week.weekStart.toISOString()}>
          <Link 
            href={`/history/${week.weekStart.toISOString()}`}
            className="block p-4 border rounded-lg hover:bg-accent transition-colors"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {weekLabel(week.weekStart)}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {week.entryCount} entries
                </span>
                {week.hasStory && <span>Story</span>}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}