import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function generateStory(entries: { text: string }[]): Promise<string> {
  const entriesText = entries.map((e) => `- ${e.text}`).join('\n');
  const prompt = `Write a weekly story based on these journal entries:\n${entriesText}`;

  const { text } = await generateText({
    model: anthropic('claude-3-5-haiku-20241022'),
    prompt,
  });

  return text;
}