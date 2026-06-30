"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { generateWeeklyStory } from '@/app/actions/generate-weekly-story'

export type WeeklyStory = {
  id: string
  weekStart: Date
  story: string
  createdAt: Date
}

interface WeeklyStoryPanelProps {
  initialStory: WeeklyStory | null
  weekStart: Date
}

export function WeeklyStoryPanel({ initialStory, weekStart }: WeeklyStoryPanelProps) {
  const [story, setStory] = useState<string | null>(initialStory?.story ?? null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const result = await generateWeeklyStory(weekStart)
      setStory(result.story)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate story')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const result = await generateWeeklyStory(weekStart)
      setStory(result.story)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate story')
    } finally {
      setIsGenerating(false)
    }
  }

  if (isGenerating) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Generating...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-destructive text-sm">
        {error}
        {!initialStory && (
          <Button onClick={handleGenerate} variant="link" className="p-0 ml-2">
            Try again
          </Button>
        )}
      </div>
    )
  }

  if (initialStory) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {story}
          </p>
          <Button onClick={handleRegenerate} variant="outline" size="sm">
            Regenerate
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-4 border rounded-lg border-dashed text-center">
      <Button onClick={handleGenerate}>
        Generate this week's story
      </Button>
    </div>
  )
}
