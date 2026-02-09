import { NextResponse } from "next/server";
import { guardApiToken } from "@/lib/helel/auth";
import { splitInboxText } from "@/lib/helel/inboxParser";
import { parseRawQuestion } from "@/lib/helel/questionParser";
import { ingestQuestionInboxSchema } from "@/lib/helel/ingestSchemas";

export async function POST(req: Request) {
  const blocked = guardApiToken(req);
  if (blocked) return blocked;

  try {
    const body = ingestQuestionInboxSchema.parse(await req.json());
    const chunks = splitInboxText(body.text, body.format);

    const questions = [] as Awaited<ReturnType<typeof parseRawQuestion>>["question"][];
    const warnings: string[] = [];
    const errors: Array<{ index: number; message: string }> = [];

    for (let i = 0; i < chunks.length; i += 1) {
      try {
        const parsed = await parseRawQuestion(chunks[i], body.model);
        questions.push(parsed.question);
        warnings.push(...parsed.warnings.map((w) => `#${i}: ${w}`));
      } catch (error) {
        errors.push({ index: i, message: error instanceof Error ? error.message : "parse failed" });
      }
    }

    return NextResponse.json({ questions, warnings, errors });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid payload" },
      { status: 400 },
    );
  }
}
