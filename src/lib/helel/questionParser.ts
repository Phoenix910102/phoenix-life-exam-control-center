import { getOpenAIClient } from "./server";
import { resolveModel } from "./models";
import { extractTextPayload, parseJsonSafely } from "./responseJson";
import { questionSchema, type Question } from "@/types/question";

export type ParseResult = {
  question: Question;
  warnings: string[];
};

type ParsedQuestionPayload = {
  subject: string;
  topic: string;
  type: "single" | "multi" | "short" | "essay";
  stem: string;
  options?: string[];
  answer?: string | string[] | null;
  explanation?: string | null;
  tags?: string[];
  difficulty?: number | null;
  source?: string | null;
  explicitAnswerFound: boolean;
};

const PARSE_SCHEMA = {
  name: "question_parse",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      subject: { type: "string" },
      topic: { type: "string" },
      type: { type: "string", enum: ["single", "multi", "short", "essay"] },
      stem: { type: "string" },
      options: { type: "array", items: { type: "string" } },
      answer: {
        anyOf: [
          { type: "string" },
          { type: "array", items: { type: "string" } },
          { type: "null" },
        ],
      },
      explanation: { anyOf: [{ type: "string" }, { type: "null" }] },
      tags: { type: "array", items: { type: "string" } },
      difficulty: { anyOf: [{ type: "number" }, { type: "null" }] },
      source: { anyOf: [{ type: "string" }, { type: "null" }] },
      explicitAnswerFound: { type: "boolean" },
    },
    required: ["subject", "topic", "type", "stem", "explicitAnswerFound"],
  },
  strict: true,
};

export async function parseRawQuestion(rawText: string, model?: string | null): Promise<ParseResult> {
  const client = getOpenAIClient();
  const selectedModel = await resolveModel(model, true);
  const response = await client.responses.create({
    model: selectedModel,
    store: false,
    input: [
      {
        role: "system",
        content:
          "Parse exam text into schema. Never invent answers. If answer is not explicitly present, set answer=null and explicitAnswerFound=false.",
      },
      {
        role: "user",
        content: rawText,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: PARSE_SCHEMA.name,
        strict: true,
        schema: PARSE_SCHEMA.schema,
      },
    },
  });

  const text = extractTextPayload(response);
  const parsed = parseJsonSafely<ParsedQuestionPayload>(text);
  if (!parsed) {
    throw new Error("Parser returned invalid JSON");
  }

  const warnings: string[] = [];
  if (!parsed.explicitAnswerFound) {
    parsed.answer = null;
    warnings.push("Answer not explicitly found; set to null.");
  }

  const question = questionSchema.parse({
    questionId: crypto.randomUUID(),
    subject: parsed.subject,
    topic: parsed.topic,
    type: parsed.type,
    stem: parsed.stem,
    options: parsed.options,
    answer: parsed.answer ?? null,
    explanation: parsed.explanation ?? null,
    tags: parsed.tags,
    difficulty: parsed.difficulty ?? null,
    source: parsed.source ?? null,
  });

  return { question, warnings };
}
