import { NextResponse } from "next/server";
import { guardApiToken } from "@/lib/helel/auth";
import { questionSchema } from "@/types/question";
import { parseRawQuestion } from "@/lib/helel/questionParser";
import { newId } from "@/lib/utils/id";
import { ingestQuestionSchema } from "@/lib/helel/ingestSchemas";

export async function POST(req: Request) {
  const blocked = guardApiToken(req);
  if (blocked) return blocked;

  try {
    const body = ingestQuestionSchema.parse(await req.json());

    if (body.mode === "structured") {
      const question = questionSchema.parse({
        ...body.questionDraft,
        questionId: body.questionDraft.questionId ?? newId("q"),
        answer: body.questionDraft.answer ?? null,
      });
      return NextResponse.json({ question, warnings: [] });
    }

    const result = await parseRawQuestion(body.rawText, body.model);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid payload" },
      { status: 400 },
    );
  }
}
