import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return client;
}

export function getDefaultModel() {
  return process.env.OPENAI_MODEL_DEFAULT ?? "gpt-5.2";
}

export function getParserDefaultModel() {
  return process.env.OPENAI_MODEL_PARSER_DEFAULT ?? "gpt-5.2";
}
