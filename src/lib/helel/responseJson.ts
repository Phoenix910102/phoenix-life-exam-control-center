export function extractTextPayload(response: any): string {
  if (typeof response?.output_text === "string") return response.output_text;
  const textFromItems = response?.output
    ?.flatMap((item: any) => item?.content ?? [])
    ?.find((c: any) => c.type === "output_text")?.text;
  if (typeof textFromItems === "string") return textFromItems;
  return "";
}

export function parseJsonSafely<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
