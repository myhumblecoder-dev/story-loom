export async function generateStory(entries: { text: string }[]): Promise<string> {
  const entriesText = entries.map((e) => `- ${e.text}`).join('\n');
  const prompt = `Write a weekly story based on these journal entries:\n${entriesText}`;

  const baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL ?? 'gemma4:26b';

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status}`);
  }

  const data = (await response.json()) as { response: string };
  return data.response;
}