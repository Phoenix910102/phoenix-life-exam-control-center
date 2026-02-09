export function splitInboxText(text: string, format: "md" | "csv" | "auto") {
  if (format === "csv") {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(1);
  }

  const mdItems = text
    .split(/^---$/m)
    .map((x) => x.trim())
    .filter(Boolean);

  if (format === "md") return mdItems;
  if (mdItems.length > 1) return mdItems;

  return text
    .split(/\n\n+/)
    .map((x) => x.trim())
    .filter(Boolean);
}
