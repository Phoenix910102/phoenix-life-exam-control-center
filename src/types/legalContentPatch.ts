import { z } from "zod";

export const PHOENIX_CONTENT_PATCH_SCHEMA = "phoenix.content-patch.v1" as const;

const stableKey = z
  .string()
  .trim()
  .min(3, "穩定 key 不可空白")
  .regex(/^[a-z0-9][a-z0-9._-]*$/, "穩定 key 只能使用小寫英數、點、底線與連字號");
const optionKey = z
  .string()
  .trim()
  .min(1, "選項 key 不可空白")
  .regex(/^[a-z0-9][a-z0-9._-]*$/, "選項 key 只能使用小寫英數、點、底線與連字號");
const contentHash = z.string().regex(/^sha256:[a-f0-9]{64}$/, "內容 hash 必須使用 sha256:<64 hex>");
const semver = z.string().regex(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/, "版本必須是 semver");
const nonEmptyText = z.string().trim().min(1, "內容不可空白");

export const legalReviewStatusSchema = z.enum(["draft", "machine-checked", "human-reviewed", "published", "retired"]);
export const legalQuestionOriginSchema = z.enum(["official", "derived-from-official", "ai-generated", "user-authored"]);

export const legalSourceRecordSchema = z
  .object({
    key: stableKey,
    title: nonEmptyText,
    kind: z.enum(["exam", "answer-announcement", "law", "judgment", "official", "book", "note"]),
    url: z.string().url().optional(),
    citation: nonEmptyText.optional(),
    authority: nonEmptyText.optional(),
    accessedAt: z.string().datetime(),
    effectiveFrom: z.string().date().optional(),
    effectiveTo: z.string().date().optional(),
    freshness: z.enum(["stable", "review-needed", "expired"]).default("review-needed"),
  })
  .strict();

export const legalAnswerRevisionSchema = z
  .object({
    id: stableKey,
    correctOptionKeys: z.array(optionKey).min(1),
    status: z.enum(["original", "corrected"]),
    sourceRef: stableKey,
    effectiveAt: z.string().datetime(),
  })
  .strict();

export const legalQuestionDefinitionSchema = z
  .object({
    key: stableKey,
    subjectKey: stableKey,
    origin: legalQuestionOriginSchema,
    reviewStatus: legalReviewStatusSchema.default("draft"),
    prompt: nonEmptyText,
    options: z
      .array(z.object({ key: optionKey, text: nonEmptyText }).strict())
      .min(2)
      .max(8),
    answerRevisions: z.array(legalAnswerRevisionSchema).default([]),
    chapterRefs: z.array(stableKey).default([]),
    issueRefs: z.array(stableKey).default([]),
    termRefs: z.array(stableKey).default([]),
    sourceRefs: z.array(stableKey).default([]),
    questionSignals: z.array(nonEmptyText).default([]),
    negativeStem: z.boolean().default(false),
    contentHash: contentHash.optional(),
  })
  .strict()
  .superRefine((question, ctx) => {
    const optionKeys = new Set(question.options.map((option) => option.key));
    if (optionKeys.size !== question.options.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["options"], message: "選項 key 不可重複" });
    }
    for (const [revisionIndex, revision] of question.answerRevisions.entries()) {
      for (const optionKey of revision.correctOptionKeys) {
        if (!optionKeys.has(optionKey)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["answerRevisions", revisionIndex, "correctOptionKeys"],
            message: `答案引用不存在的選項 ${optionKey}`,
          });
        }
      }
    }
    if (question.origin === "official" && question.sourceRefs.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["sourceRefs"], message: "官方題必須附來源" });
    }
    if (question.origin === "ai-generated" && ["published", "human-reviewed"].includes(question.reviewStatus)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["reviewStatus"], message: "AI 題不可在 Patch 內直接標成人工審核或發布" });
    }
  });

export const legalLessonBlockSchema = z
  .object({
    key: stableKey,
    chapterKey: stableKey,
    type: z.enum(["chapter-guide", "statute-map", "concept", "comparison", "case-digest", "exam-signal", "example", "memory", "callout"]),
    title: nonEmptyText,
    body: nonEmptyText,
    sourceRefs: z.array(stableKey).default([]),
    reviewStatus: legalReviewStatusSchema.default("draft"),
  })
  .strict();

export const legalTermSchema = z
  .object({
    key: stableKey,
    subjectKey: stableKey,
    term: nonEmptyText,
    definition: nonEmptyText,
    chapterRefs: z.array(stableKey).default([]),
    sourceRefs: z.array(stableKey).default([]),
    reviewStatus: legalReviewStatusSchema.default("draft"),
  })
  .strict();

export const legalContentLinkSchema = z
  .object({
    from: stableKey,
    to: stableKey,
    relation: z.enum(["belongs-to", "tests", "explains", "confuses-with", "cites", "derived-from"]),
  })
  .strict();

const questionRevisionChangesSchema = z
  .object({
    prompt: nonEmptyText.optional(),
    options: z.array(z.object({ key: optionKey, text: nonEmptyText }).strict()).min(2).max(8).optional(),
    chapterRefs: z.array(stableKey).optional(),
    issueRefs: z.array(stableKey).optional(),
    termRefs: z.array(stableKey).optional(),
    sourceRefs: z.array(stableKey).optional(),
    questionSignals: z.array(nonEmptyText).optional(),
    negativeStem: z.boolean().optional(),
    reviewStatus: legalReviewStatusSchema.optional(),
  })
  .strict()
  .refine((changes) => Object.keys(changes).length > 0, "修訂內容不可空白");

const lessonRevisionChangesSchema = legalLessonBlockSchema
  .omit({ key: true, chapterKey: true })
  .partial()
  .refine((changes) => Object.keys(changes).length > 0, "修訂內容不可空白");

export const legalContentPatchOperationSchema = z.discriminatedUnion("op", [
  z.object({ op: z.literal("question.add"), value: legalQuestionDefinitionSchema }).strict(),
  z.object({ op: z.literal("question.revise"), key: stableKey, expectedContentHash: contentHash, changes: questionRevisionChangesSchema }).strict(),
  z.object({ op: z.literal("question.retire"), key: stableKey, expectedContentHash: contentHash, reason: nonEmptyText, sourceRef: stableKey.optional() }).strict(),
  z.object({ op: z.literal("answer-revision.add"), questionKey: stableKey, expectedContentHash: contentHash, value: legalAnswerRevisionSchema }).strict(),
  z.object({ op: z.literal("lesson-block.add"), chapterKey: stableKey, afterBlockKey: stableKey.optional(), value: legalLessonBlockSchema }).strict(),
  z.object({ op: z.literal("lesson-block.revise"), blockKey: stableKey, expectedContentHash: contentHash, changes: lessonRevisionChangesSchema }).strict(),
  z.object({ op: z.literal("term.add"), value: legalTermSchema }).strict(),
  z.object({ op: z.literal("source.add"), value: legalSourceRecordSchema }).strict(),
  z.object({ op: z.literal("link.add"), value: legalContentLinkSchema }).strict(),
  z.object({ op: z.literal("link.remove"), value: legalContentLinkSchema }).strict(),
]);

export const legalContentPatchSchema = z
  .object({
    schema: z.literal(PHOENIX_CONTENT_PATCH_SCHEMA),
    patchId: stableKey,
    createdAt: z.string().datetime(),
    createdBy: z.object({ name: nonEmptyText, model: nonEmptyText.optional() }).strict().optional(),
    target: z
      .object({
        subjectKey: stableKey,
        packageSlug: stableKey.optional(),
        baseVersion: semver.optional(),
        expectedManifestHash: contentHash.optional(),
      })
      .strict(),
    summary: nonEmptyText,
    operations: z.array(legalContentPatchOperationSchema).min(1),
  })
  .strict();

export type LegalContentPatch = z.infer<typeof legalContentPatchSchema>;
export type LegalContentPatchOperation = z.infer<typeof legalContentPatchOperationSchema>;
export type LegalQuestionDefinition = z.infer<typeof legalQuestionDefinitionSchema>;
