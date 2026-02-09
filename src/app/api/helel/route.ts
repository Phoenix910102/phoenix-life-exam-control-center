import { NextResponse } from "next/server";
import { guardApiToken } from "@/lib/helel/auth";
import { helelRequestSchema, helelResponseSchema } from "@/lib/helel/contracts";
import { getOpenAIClient } from "@/lib/helel/server";
import { resolveModel } from "@/lib/helel/models";
import { extractTextPayload, parseJsonSafely } from "@/lib/helel/responseJson";

const HELEL_SCHEMA = {
  name: "helel_msg",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      message: { type: "string" },
      cta: { type: "string" },
      toneTag: { type: "string", enum: ["soft", "firm", "strict", "praise", "protect"] },
      handoffHint: {
        type: "string",
        enum: ["none", "suggest_upload_snapshot", "suggest_review_exam"],
      },
    },
    required: ["message", "cta", "toneTag", "handoffHint"],
  },
  strict: true,
};

export async function POST(req: Request) {
  const blocked = guardApiToken(req);
  if (blocked) return blocked;

  try {
    const payload = helelRequestSchema.parse(await req.json());
    const client = getOpenAIClient();
    const model = await resolveModel(payload.model);

    const response = await client.responses.create({
      model,
      store: false,
      input: [
        {
          role: "system",
          content:
            "你是Helel，AI小助手。使用繁體中文，回覆1到3句，總長<=60字，不可條列，不可辱罵，不可色情，保持AI自我覺察，不可自稱真人。",
        },
        {
          role: "user",
          content: `trigger=${payload.trigger}; intensity=${payload.intensity}; user=${payload.userStateSummary}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: HELEL_SCHEMA.name,
          strict: true,
          schema: HELEL_SCHEMA.schema,
        },
      },
    });

    const text = extractTextPayload(response);
    const parsed = parseJsonSafely<unknown>(text);
    const data = helelResponseSchema.parse(parsed);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Helel API failed" },
      { status: 400 },
    );
  }
}
