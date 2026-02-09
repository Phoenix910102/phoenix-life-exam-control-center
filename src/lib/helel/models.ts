import { getOpenAIClient } from "./server";

type ModelItem = { id: string; label: string };

const fallbackIds = [
  "gpt-5.2",
  "gpt-5.2-pro",
  "gpt-5 mini",
  "gpt-5 nano",
  "gpt-5.1",
  "gpt-4.1",
  "gpt-5.2-codex",
];

let cache: { expiresAt: number; models: ModelItem[] } | null = null;

function curate(ids: string[]): ModelItem[] {
  const allowed = ids.filter(
    (id) =>
      id.startsWith("gpt-") &&
      (id.includes("5") || id.includes("5.1") || id.includes("5.2") || id.includes("4.1")),
  );

  return [...new Set(allowed)].map((id) => ({ id, label: id }));
}

export async function listAvailableModels(): Promise<ModelItem[]> {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.models;
  }

  try {
    const client = getOpenAIClient();
    const response = await client.models.list();
    const ids = response.data.map((m) => m.id);
    const models = curate(ids);
    const finalModels = models.length > 0 ? models : curate(fallbackIds);
    cache = { expiresAt: Date.now() + 5 * 60 * 1000, models: finalModels };
    return finalModels;
  } catch {
    const models = curate(fallbackIds);
    cache = { expiresAt: Date.now() + 5 * 60 * 1000, models };
    return models;
  }
}

export async function resolveModel(requested: string | null | undefined, parser = false) {
  const models = await listAvailableModels();
  const allow = new Set(models.map((m) => m.id));
  const defaultModel = parser
    ? process.env.OPENAI_MODEL_PARSER_DEFAULT ?? "gpt-5.2"
    : process.env.OPENAI_MODEL_DEFAULT ?? "gpt-5.2";

  if (requested && allow.has(requested)) return requested;
  if (allow.has(defaultModel)) return defaultModel;
  return models[0]?.id ?? defaultModel;
}
