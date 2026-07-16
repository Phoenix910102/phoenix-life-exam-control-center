import { z } from "zod";
import {
  campaignModuleSurfaceValues,
  campaignReadingModeValues,
  campaignReadingThemeValues,
} from "@/components/campaign/theme/campaign-theme.types";

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
export const campaignReadingModeSchema = z.enum(campaignReadingModeValues);
export const campaignReadingThemeSchema = z.enum(campaignReadingThemeValues);
export const campaignModuleSurfaceSchema = z.enum(campaignModuleSurfaceValues);
export const materialModuleSurfacesSchema = z
  .object({
    home: campaignModuleSurfaceSchema.optional(),
    battlefield: campaignModuleSurfaceSchema.optional(),
    roadmap: campaignModuleSurfaceSchema.optional(),
    reader: campaignModuleSurfaceSchema.optional(),
    lesson: campaignModuleSurfaceSchema.optional(),
    duel: campaignModuleSurfaceSchema.optional(),
    diagnostic: campaignModuleSurfaceSchema.optional(),
    "trap-field": campaignModuleSurfaceSchema.optional(),
    quiz: campaignModuleSurfaceSchema.optional(),
    glossary: campaignModuleSurfaceSchema.optional(),
    "question-bank": campaignModuleSurfaceSchema.optional(),
    "source-library": campaignModuleSurfaceSchema.optional(),
    "quick-review": campaignModuleSurfaceSchema.optional(),
  })
  .strict()
  .default({});
export const materialModuleSchema = z.enum([
  "home",
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
  "glossary",
  "question-bank",
  "source-library",
  "quick-review",
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
    shellTheme: materialThemeSchema.optional(),
    readingTheme: campaignReadingThemeSchema.default("ivory-archive"),
    defaultMode: campaignReadingModeSchema.default("reading"),
    availableModes: z.array(campaignReadingModeSchema).min(1).default([...campaignReadingModeValues]),
    moduleSurfaces: materialModuleSurfacesSchema,
    renderOrder: z.enum(["authored", "phoenix-default"]).default("phoenix-default"),
    modules: z.array(materialModuleSchema).default(["reader", "quiz"]),
    battlefield3d: battlefield3dSchema.optional(),
  })
  .strict()
  .superRefine((presentation, ctx) => {
    if (!presentation.availableModes.includes(presentation.defaultMode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["availableModes"],
        message: "availableModes 必須包含 defaultMode",
      });
    }
  });

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

export const termCardBlockSchema = z
  .object({
    ...blockMetadata,
    type: z.literal("term-card"),
    term: requiredText("term"),
    english: requiredText("english").optional(),
    category: requiredText("category"),
    level: z.enum(["core", "frequent", "index"]).default("index"),
    oneLiner: requiredText("oneLiner"),
    questionSignal: requiredText("questionSignal"),
    application: requiredText("application"),
    examExample: requiredText("examExample"),
    confusion: requiredText("confusion"),
  })
  .strict();

export const termReferenceBlockSchema = z
  .object({
    ...blockMetadata,
    type: z.literal("term-reference"),
    title: requiredText("title"),
    termRefs: z.array(requiredText("termRef")).min(1, "termRefs 至少需要一項"),
    display: z.enum(["inline", "rail", "featured"]),
  })
  .strict();

export const questionBankReferenceBlockSchema = z
  .object({
    ...blockMetadata,
    type: z.literal("question-bank-reference"),
    title: requiredText("title"),
    bankRefs: z.array(requiredText("bankRef")).min(1, "bankRefs 至少需要一項"),
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
  termCardBlockSchema,
  termReferenceBlockSchema,
  questionBankReferenceBlockSchema,
  comparisonBlockSchema,
  confusionBlockSchema,
  flowBlockSchema,
  examSignalBlockSchema,
  exampleBlockSchema,
  memoryBlockSchema,
  calloutBlockSchema,
  quizBlockSchema,
]);

export const glossaryTermSchema = z.object({
  key: requiredText("glossaryTerm.key"),
  term: requiredText("glossaryTerm.term"),
  english: requiredText("glossaryTerm.english").optional(),
  categoryKey: requiredText("glossaryTerm.categoryKey"),
  level: z.enum(["core", "frequent", "index"]),
  oneLiner: requiredText("glossaryTerm.oneLiner"),
  questionSignal: requiredText("glossaryTerm.questionSignal"),
  application: requiredText("glossaryTerm.application"),
  examExample: requiredText("glossaryTerm.examExample"),
  confusion: requiredText("glossaryTerm.confusion"),
  chapterRefs: z.array(requiredText("glossaryTerm.chapterRef")),
  relatedTermRefs: z.array(requiredText("glossaryTerm.relatedTermRef")),
  sourceRefs: z.array(requiredText("glossaryTerm.sourceRef")),
}).strict();

export const glossaryCategorySchema = z.object({
  key: requiredText("glossaryCategory.key"),
  title: requiredText("glossaryCategory.title"),
  order: z.number().int().nonnegative(),
}).strict();

export const materialQuestionSchema = z.object({
  key: requiredText("materialQuestion.key"),
  prompt: requiredText("materialQuestion.prompt"),
  options: z.array(requiredText("materialQuestion.option")).min(2),
  answer: z.number().int().nonnegative(),
  explanation: requiredText("materialQuestion.explanation"),
  chapterRefs: z.array(requiredText("materialQuestion.chapterRef")),
  termRefs: z.array(requiredText("materialQuestion.termRef")),
  sourceRefs: z.array(requiredText("materialQuestion.sourceRef")),
  imageAsset: requiredText("materialQuestion.imageAsset").optional(),
}).strict().superRefine((question, ctx) => {
  if (question.answer >= question.options.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["answer"], message: "answer 超出 options 索引範圍" });
  }
});

export const questionBankSchema = z.object({
  key: requiredText("questionBank.key"),
  title: requiredText("questionBank.title"),
  kind: z.enum(["chapter", "boss", "final", "weakness"]),
  questionRefs: z.array(requiredText("questionBank.questionRef")),
}).strict();

export const sourceRecordSchema = z.object({
  key: requiredText("sourceRecord.key"),
  title: requiredText("sourceRecord.title"),
  citation: requiredText("sourceRecord.citation").optional(),
  url: z.string().url().optional(),
  kind: z.enum(["official", "paper", "book", "documentation"]),
}).strict();

export const learningPathSchema = z.object({
  key: requiredText("learningPath.key"),
  title: requiredText("learningPath.title"),
  chapterRefs: z.array(requiredText("learningPath.chapterRef")),
  termRefs: z.array(requiredText("learningPath.termRef")),
  questionBankRefs: z.array(requiredText("learningPath.questionBankRef")),
}).strict();

export const materialCollectionsSchema = z.object({
  glossary: z.object({
    terms: z.array(glossaryTermSchema),
    categories: z.array(glossaryCategorySchema),
  }).strict().optional(),
  questions: z.array(materialQuestionSchema).optional(),
  questionBanks: z.array(questionBankSchema).optional(),
  sourceLibrary: z.array(sourceRecordSchema).optional(),
  learningPaths: z.array(learningPathSchema).optional(),
}).strict();

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
    collections: materialCollectionsSchema.optional(),
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
    const collections = material.collections;
    if (!collections) return;
    const chapterKeys = new Set(material.chapters.map((chapter) => chapter.key));
    const termKeyList = collections.glossary?.terms.map((term) => term.key) ?? [];
    const termKeys = new Set(termKeyList);
    const categoryKeys = new Set(collections.glossary?.categories.map((category) => category.key) ?? []);
    const questionKeyList = collections.questions?.map((question) => question.key) ?? [];
    const questionKeys = new Set(questionKeyList);
    const bankKeys = new Set(collections.questionBanks?.map((bank) => bank.key) ?? []);
    const sourceKeys = new Set(collections.sourceLibrary?.map((source) => source.key) ?? []);
    const checkUnique = (values: string[], path: (string | number)[], label: string) => {
      if (new Set(values).size !== values.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path, message: `${label} 包含重複 key` });
    };
    checkUnique(termKeyList, ["collections", "glossary", "terms"], "glossary terms");
    checkUnique(questionKeyList, ["collections", "questions"], "questions");
    collections.glossary?.terms.forEach((term, index) => {
      if (!categoryKeys.has(term.categoryKey)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["collections", "glossary", "terms", index, "categoryKey"], message: "找不到 categoryKey" });
      term.chapterRefs.forEach((key) => { if (!chapterKeys.has(key)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["collections", "glossary", "terms", index, "chapterRefs"], message: `找不到章節 ${key}` }); });
      term.relatedTermRefs.forEach((key) => { if (!termKeys.has(key)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["collections", "glossary", "terms", index, "relatedTermRefs"], message: `找不到詞條 ${key}` }); });
      term.sourceRefs.forEach((key) => { if (!sourceKeys.has(key)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["collections", "glossary", "terms", index, "sourceRefs"], message: `找不到來源 ${key}` }); });
    });
    collections.questions?.forEach((question, index) => {
      question.chapterRefs.forEach((key) => { if (!chapterKeys.has(key)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["collections", "questions", index, "chapterRefs"], message: `找不到章節 ${key}` }); });
      question.termRefs.forEach((key) => { if (!termKeys.has(key)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["collections", "questions", index, "termRefs"], message: `找不到詞條 ${key}` }); });
      question.sourceRefs.forEach((key) => { if (!sourceKeys.has(key)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["collections", "questions", index, "sourceRefs"], message: `找不到來源 ${key}` }); });
    });
    collections.questionBanks?.forEach((bank, index) => bank.questionRefs.forEach((key) => { if (!questionKeys.has(key)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["collections", "questionBanks", index, "questionRefs"], message: `找不到題目 ${key}` }); }));
    material.chapters.forEach((chapter, chapterIndex) => chapter.blocks.forEach((block, blockIndex) => {
      if (block.type === "term-reference") block.termRefs.forEach((key) => { if (!termKeys.has(key)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["chapters", chapterIndex, "blocks", blockIndex, "termRefs"], message: `找不到詞條 ${key}` }); });
      if (block.type === "question-bank-reference") block.bankRefs.forEach((key) => { if (!bankKeys.has(key)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["chapters", chapterIndex, "blocks", blockIndex, "bankRefs"], message: `找不到題庫 ${key}` }); });
    }));
  });

export type MaterialPackage = z.infer<typeof materialPackageSchema>;
export type MaterialPackageChapter = z.infer<typeof materialPackageChapterSchema>;
export type MaterialBlock = z.infer<typeof materialBlockSchema>;
export type MaterialQuizQuestion = z.infer<typeof materialQuizQuestionSchema>;
export type GlossaryTerm = z.infer<typeof glossaryTermSchema>;
export type MaterialQuestion = z.infer<typeof materialQuestionSchema>;
export type MaterialCollections = z.infer<typeof materialCollectionsSchema>;
