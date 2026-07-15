import { z } from "zod";

export const PHOENIX_MATERIAL_SCHEMA = "phoenix.material.v1" as const;

export const semverSchema = z
  .string()
  .regex(
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/,
    "version 必須是有效的 semver，例如 1.2.0",
  );

const requiredText = (label: string) => z.string().trim().min(1, `${label} 不可空白`);
const textList = (label: string) => z.array(requiredText(label)).min(1, `${label} 至少需要一項`);

export const materialLayoutSchema = z.enum(["compact", "editorial", "immersive-academy"]);
export const materialThemeSchema = z.enum([
  "criminal-rose",
  "jurist-rose",
  "neural-rose",
  "cipher-rose",
  "command-rose",
  "black-dossier",
]);
export const materialModuleSchema = z.enum([
  "battlefield",
  "roadmap",
  "reader",
  "lesson",
  "duel",
  "diagnostic",
  "trap-field",
  "quiz",
  "achievements",
  "floating-console",
]);

export const battlefield3dSchema = z
  .object({
    enabled: z.boolean().default(false),
    mapStyle: z
      .enum(["frontline-territories", "island-campaign", "neural-network", "fortress-ring"])
      .default("frontline-territories"),
    layout: z.enum(["curved-front", "grid", "radial", "custom"]).default("curved-front"),
    seed: z.string().trim().min(1, "battlefield3d.seed 不可空白").optional(),
    cameraPreset: z
      .enum(["war-room", "isometric", "cinematic-low", "top-down"])
      .default("war-room"),
    environment: z
      .enum(["dark-chamber", "neural-void", "cipher-grid", "command-table"])
      .default("dark-chamber"),
    quality: z.enum(["auto", "low", "medium", "high"]).default("auto"),
    allowCinematics: z.boolean().default(true),
  })
  .strict();

export const materialPresentationSchema = z
  .object({
    layout: materialLayoutSchema.default("editorial"),
    theme: materialThemeSchema.default("criminal-rose"),
    renderOrder: z.enum(["authored", "phoenix-default"]).default("phoenix-default"),
    modules: z.array(materialModuleSchema).default(["reader", "quiz"]),
    battlefield3d: battlefield3dSchema.optional(),
  })
  .strict();

export const materialPrerequisiteSchema = z
  .object({
    slug: requiredText("prerequisite.slug"),
    title: requiredText("prerequisite.title"),
    requiredLevel: z.enum(["basic", "intermediate", "advanced"]).default("basic"),
  })
  .strict();

export const materialSourceSchema = z
  .object({
    id: requiredText("source.id"),
    title: requiredText("source.title"),
    type: z.enum(["law", "judgment", "official", "paper", "book", "documentation"]),
    url: z.string().url("source.url 必須是有效網址").optional(),
    citation: requiredText("source.citation").optional(),
    accessedAt: z.string().datetime({ message: "source.accessedAt 必須是 ISO 8601 日期時間" }),
    applicableVersion: requiredText("source.applicableVersion").optional(),
    freshness: z.enum(["stable", "review-needed", "expired"]).default("stable"),
  })
  .strict();

const blockMetadata = {
  key: z
    .string()
    .trim()
    .min(1, "block.key 不可空白")
    .regex(/^[a-z0-9][a-z0-9._-]*$/i, "block.key 只能使用英數、點、底線與連字號")
    .optional(),
  importance: z.enum(["supporting", "core", "critical"]).optional(),
  examWeight: z.number().int().min(0).max(10).optional(),
  includeInQuickReview: z.boolean().optional(),
  estimatedMinutes: z.number().int().positive().optional(),
};

export const positionBlockSchema = z
  .object({
    ...blockMetadata,
    type: z.literal("position"),
    category: requiredText("category"),
    before: requiredText("before"),
    current: requiredText("current"),
    after: requiredText("after"),
  })
  .strict();

export const conceptBlockSchema = z
  .object({
    ...blockMetadata,
    type: z.literal("concept"),
    title: requiredText("title"),
    body: requiredText("body"),
  })
  .strict();

export const comparisonBlockSchema = z
  .object({
    ...blockMetadata,
    type: z.literal("comparison"),
    title: requiredText("title"),
    columns: z.array(requiredText("column")).min(2, "columns 至少需要兩欄"),
    rows: z.array(z.array(requiredText("cell")).min(1)).min(1, "rows 至少需要一列"),
  })
  .strict();

export const confusionBlockSchema = z
  .object({
    ...blockMetadata,
    type: z.literal("confusion"),
    items: z
      .array(
        z
          .object({
            name: requiredText("name"),
            role: requiredText("role"),
            difference: requiredText("difference"),
          })
          .strict(),
      )
      .min(2, "confusion.items 至少需要兩項"),
  })
  .strict();

export const flowBlockSchema = z
  .object({
    ...blockMetadata,
    type: z.literal("flow"),
    title: requiredText("title"),
    steps: textList("steps"),
  })
  .strict();

export const examSignalBlockSchema = z
  .object({
    ...blockMetadata,
    type: z.literal("exam-signal"),
    cues: textList("cues"),
    answerRule: requiredText("answerRule"),
    traps: textList("traps"),
  })
  .strict();

export const exampleBlockSchema = z
  .object({
    ...blockMetadata,
    type: z.literal("example"),
    prompt: requiredText("prompt"),
    reasoningSteps: textList("reasoningSteps"),
    answer: requiredText("answer"),
  })
  .strict();

export const memoryBlockSchema = z
  .object({
    ...blockMetadata,
    type: z.literal("memory"),
    anchor: requiredText("anchor"),
    explanation: requiredText("explanation"),
  })
  .strict();

export const calloutBlockSchema = z
  .object({
    ...blockMetadata,
    type: z.literal("callout"),
    tone: z.enum(["info", "warning", "important"]),
    title: requiredText("title"),
    body: requiredText("body"),
  })
  .strict();

export const materialQuizQuestionSchema = z
  .object({
    question: requiredText("question"),
    options: z.array(requiredText("option")).min(2, "options 至少需要兩個選項"),
    answer: z.number().int().nonnegative("answer 必須是從 0 開始的選項索引"),
    explanation: requiredText("explanation"),
    tags: z.array(requiredText("tag")).default([]),
  })
  .strict()
  .superRefine((question, ctx) => {
    if (question.answer >= question.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["answer"],
        message: `answer=${question.answer} 超出 options 索引範圍 0-${question.options.length - 1}`,
      });
    }
  });

export const quizBlockSchema = z
  .object({
    ...blockMetadata,
    type: z.literal("quiz"),
    title: requiredText("title").optional(),
    questions: z.array(materialQuizQuestionSchema).min(1, "questions 至少需要一題"),
  })
  .strict();

export const materialBlockSchema = z.discriminatedUnion("type", [
  positionBlockSchema,
  conceptBlockSchema,
  comparisonBlockSchema,
  confusionBlockSchema,
  flowBlockSchema,
  examSignalBlockSchema,
  exampleBlockSchema,
  memoryBlockSchema,
  calloutBlockSchema,
  quizBlockSchema,
]);

export const materialPackageChapterSchema = z
  .object({
    key: z
      .string()
      .trim()
      .min(1, "chapter.key 不可空白")
      .regex(/^[a-z0-9][a-z0-9._-]*$/i, "chapter.key 只能使用英數、點、底線與連字號"),
    title: requiredText("chapter.title"),
    summary: requiredText("chapter.summary"),
    estimatedMinutes: z.number().int().positive("estimatedMinutes 必須是正整數"),
    objectives: textList("objectives"),
    blocks: z.array(materialBlockSchema).min(1, "blocks 至少需要一個內容區塊"),
  })
  .strict();

export const materialPackageSchema = z
  .object({
    schema: z.literal(PHOENIX_MATERIAL_SCHEMA, {
      errorMap: () => ({ message: `schema 必須固定為 ${PHOENIX_MATERIAL_SCHEMA}` }),
    }),
    slug: z
      .string()
      .trim()
      .min(1, "slug 不可空白")
      .regex(/^[a-z0-9][a-z0-9-]*$/, "slug 只能使用小寫英數與連字號"),
    version: semverSchema,
    title: requiredText("title"),
    description: requiredText("description"),
    subject: requiredText("subject"),
    exam: z
      .object({
        name: requiredText("exam.name"),
        level: requiredText("exam.level").optional(),
        session: requiredText("exam.session").optional(),
      })
      .strict()
      .optional(),
    language: z.string().trim().min(1).default("zh-TW"),
    tags: z.array(requiredText("tag")).default([]),
    generatedAt: z.string().datetime({ message: "generatedAt 必須是 ISO 8601 日期時間" }),
    generator: z
      .object({
        name: requiredText("generator.name"),
        version: z.string().trim().min(1).optional(),
        model: z.string().trim().min(1).optional(),
      })
      .strict()
      .optional(),
    presentation: materialPresentationSchema.optional(),
    difficulty: z.enum(["quick-pass", "standard", "deep"]).default("standard"),
    prerequisites: z.array(materialPrerequisiteSchema).default([]),
    sources: z.array(materialSourceSchema).default([]),
    quickReview: z
      .object({
        summary: requiredText("quickReview.summary").optional(),
        coreBlockKeys: z.array(requiredText("quickReview.coreBlockKey")).default([]),
        finalQuestionCount: z.number().int().positive().optional(),
      })
      .strict()
      .optional(),
    generationProfile: requiredText("generationProfile").optional(),
    chapters: z.array(materialPackageChapterSchema).min(1, "chapters 至少需要一章"),
  })
  .strict()
  .superRefine((material, ctx) => {
    const seen = new Map<string, number>();
    material.chapters.forEach((chapter, index) => {
      const previous = seen.get(chapter.key);
      if (previous !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["chapters", index, "key"],
          message: `chapter.key「${chapter.key}」與第 ${previous + 1} 章重複`,
        });
      } else {
        seen.set(chapter.key, index);
      }
    });
    material.chapters.forEach((chapter, chapterIndex) => {
      const seenBlockKeys = new Map<string, number>();
      chapter.blocks.forEach((block, blockIndex) => {
        if (block.key) {
          const previous = seenBlockKeys.get(block.key);
          if (previous !== undefined) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["chapters", chapterIndex, "blocks", blockIndex, "key"],
              message: `block.key「${block.key}」與本章第 ${previous + 1} 個 block 重複`,
            });
          } else {
            seenBlockKeys.set(block.key, blockIndex);
          }
        }
        if (block.type !== "comparison") return;
        block.rows.forEach((row, rowIndex) => {
          if (row.length !== block.columns.length) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["chapters", chapterIndex, "blocks", blockIndex, "rows", rowIndex],
              message: `第 ${rowIndex + 1} 列有 ${row.length} 欄，應與 columns 的 ${block.columns.length} 欄一致`,
            });
          }
        });
      });
    });
  });

export type MaterialPackage = z.infer<typeof materialPackageSchema>;
export type MaterialPackageChapter = z.infer<typeof materialPackageChapterSchema>;
export type MaterialBlock = z.infer<typeof materialBlockSchema>;
export type MaterialQuizQuestion = z.infer<typeof materialQuizQuestionSchema>;
