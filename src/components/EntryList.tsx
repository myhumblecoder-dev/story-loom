import type { JournalEntry } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface EntryListProps {
  entries: JournalEntry[]
}

/**
 * A presentational component that renders a list of journal entries.
 * Displays the entry text and a relative timestamp.
 */
export function EntryList({ entries }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-8 text-center">
        No entries yet this week.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {formatDistanceToNow(entry.createdAt, { addSuffix: true })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{entry.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
