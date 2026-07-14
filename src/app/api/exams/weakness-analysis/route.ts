import { NextResponse } from "next/server";
import { z } from "zod";
import { guardApiToken } from "@/lib/helel/auth";
import { getOpenAIClient } from "@/lib/helel/server";
import { resolveModel } from "@/lib/helel/models";
import { extractTextPayload, parseJsonSafely } from "@/lib/helel/responseJson";

const topicStatSchema = z.object({
  subject: z.string(),
  topic: z.string(),
  attempted: z.number().min(0),
  correct: z.number().min(0),
  wrong: z.number().min(0),
  errorRate: z.number().min(0).max(1),
  avgTimeSec: z.number().min(0).optional(),
});

const weaknessAnalysisRequestSchema = z.object({
  model: z.string().optional().nullable(),
  overall: z.object({
    attempted: z.number().min(0),
    correct: z.number().min(0),
    wrong: z.number().min(0),
    accuracy: z.number().min(0).max(1),
  }),
  topics: z.array(topicStatSchema).max(20),
  recentMisses: z
    .array(
      z.object({
        questionId: z.string(),
        subject: z.string(),
        topic: z.string(),
        stem: z.string(),
        chosenAnswer: z.string(),
        correctAnswer: z.string(),
      }),
    )
    .max(12),
});

const weaknessAnalysisResponseSchema = z.object({
  summary: z.string(),
  focusTopics: z.array(
    z.object({
      subject: z.string(),
      topic: z.string(),
      diagnosis: z.string(),
      nextDrill: z.string(),
    }),
  ),
  nextActions: z.array(z.string()),
  riskFlags: z.array(z.string()),
});

const WEAKNESS_SCHEMA = {
  name: "aiap_weakness_analysis",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      summary: { type: "string" },
      focusTopics: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            subject: { type: "string" },
            topic: { type: "string" },
            diagnosis: { type: "string" },
            nextDrill: { type: "string" },
          },
          required: ["subject", "topic", "diagnosis", "nextDrill"],
        },
      },
      nextActions: { type: "array", items: { type: "string" } },
      riskFlags: { type: "array", items: { type: "string" } },
    },
    required: ["summary", "focusTopics", "nextActions", "riskFlags"],
  },
  strict: true,
};

type WeaknessPayload = z.infer<typeof weaknessAnalysisRequestSchema>;
type WeaknessReport = z.infer<typeof weaknessAnalysisResponseSchema>;

function localReport(payload: WeaknessPayload): WeaknessReport {
  const attempted = payload.overall.attempted;
  const accuracy = Math.round(payload.overall.accuracy * 100);
  const ranked = [...payload.topics]
    .filter((topic) => topic.attempted > 0 && topic.wrong > 0)
    .sort((a, b) => b.errorRate - a.errorRate || b.wrong - a.wrong)
    .slice(0, 3);

  const focusTopics = ranked.map((topic) => ({
    subject: topic.subject,
    topic: topic.topic,
    diagnosis: `${topic.wrong}/${topic.attempted} 題答錯，錯誤率 ${Math.round(topic.errorRate * 100)}%。`,
    nextDrill: `先重做 ${topic.topic} 的錯題，再補 5 題同主題隨機題。`,
  }));

  return {
    summary:
      attempted > 0 && focusTopics.length > 0
        ? `已累積 ${attempted} 題作答，正確率 ${accuracy}%。先把高錯誤率主題壓下來。`
        : attempted > 0
          ? `已累積 ${attempted} 題作答，正確率 ${accuracy}%，目前尚未出現錯題。`
        : "目前還沒有作答紀錄。先完成一輪隨機 20 題，分析會更準。",
    focusTopics,
    nextActions:
      focusTopics.length > 0
        ? ["重做最弱主題錯題", "整理每題誤判原因", "完成一輪混合題檢查遷移能力"]
        : attempted > 0
          ? ["切換完整卷擴大樣本", "保留目前正確題速度", "下一輪刻意混入第二科題組題"]
          : ["完成隨機 20 題", "交卷後查看主題錯誤率", "再啟動弱點補強模式"],
    riskFlags: payload.recentMisses.slice(0, 3).map((miss) => `${miss.topic}: ${miss.correctAnswer} 被選成 ${miss.chosenAnswer}`),
  };
}

export async function POST(req: Request) {
  const blocked = guardApiToken(req);
  if (blocked) return blocked;

  try {
    const payload = weaknessAnalysisRequestSchema.parse(await req.json());
    const fallback = localReport(payload);

    try {
      const client = getOpenAIClient();
      const model = await resolveModel(payload.model);
      const response = await client.responses.create({
        model,
        store: false,
        input: [
          {
            role: "system",
            content:
              "你是考證照弱點分析教練。使用繁體中文，根據統計資料診斷弱點，不要編造未提供的分數或題目。輸出務實、短句、可執行。",
          },
          {
            role: "user",
            content: JSON.stringify(payload),
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: WEAKNESS_SCHEMA.name,
            strict: true,
            schema: WEAKNESS_SCHEMA.schema,
          },
        },
      });

      const text = extractTextPayload(response);
      const parsed = parseJsonSafely<unknown>(text);
      const report = weaknessAnalysisResponseSchema.parse(parsed);
      return NextResponse.json({ ...report, source: "openai" });
    } catch {
      return NextResponse.json({ ...fallback, source: "local" });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Weakness analysis failed" },
      { status: 400 },
    );
  }
}
