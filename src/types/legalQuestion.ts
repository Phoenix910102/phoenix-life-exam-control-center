import { z } from "zod";

const stableKey = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9][a-z0-9._:-]*$/, "key 只能使用小寫英數、點、冒號、底線與連字號");
const nonEmptyText = z.string().trim().min(1);

export const legalReviewStatusV2Schema = z.enum([
  "draft",
  "machine-checked",
  "source-verified",
  "human-reviewed",
  "published",
  "retired",
]);
export const legalQuestionOriginV2Schema = z.enum([
  "official",
  "derived-from-official",
  "ai-generated",
  "user-authored",
]);
export const legalConfidenceSchema = z.enum(["certain", "hesitant", "guess", "changed", "unreadable"]);
export const legalErrorCategorySchema = z.enum([
  "negative-not-locked",
  "stem-signal-missed",
  "option-contamination",
  "previous-question-residue",
  "layer-confusion",
  "subject-role-missed",
  "timeline-missed",
  "law-version-mismatch",
  "doctrine-practice-confusion",
  "knowledge-gap",
  "lucky-correct",
]);

export const legalAnswerRevisionV2Schema = z.object({
  id: stableKey,
  correctOptionKeys: z.array(stableKey).min(1),
  status: z.enum(["original", "corrected"]),
  sourceRef: stableKey,
  effectiveAt: z.string().datetime(),
}).strict();

const legalOptionSchema = z.object({ key: stableKey, text: nonEmptyText }).strict();
const legalOptionAnalysisSchema = z.object({
  optionKey: stableKey,
  verdict: z.enum(["correct", "incorrect", "partially-correct"]),
  rule: nonEmptyText,
  errorPoint: nonEmptyText.optional(),
  minimalCorrection: nonEmptyText.optional(),
  sourceRefs: z.array(stableKey).default([]),
}).strict();

export const legalQuestionDefinitionV2Schema = z.object({
  key: stableKey,
  subjectKey: stableKey,
  origin: legalQuestionOriginV2Schema,
  reviewStatus: legalReviewStatusV2Schema,
  prompt: nonEmptyText,
  options: z.array(legalOptionSchema).min(2).max(8),
  answerRevisions: z.array(legalAnswerRevisionV2Schema).min(1),
  primaryChapterRef: stableKey.optional(),
  chapterRefs: z.array(stableKey).default([]),
  primaryIssueRef: stableKey.optional(),
  issueRefs: z.array(stableKey).default([]),
  predictionChoices: z.array(z.object({ key: stableKey, label: nonEmptyText }).strict()).default([]),
  termRefs: z.array(stableKey).default([]),
  sourceRefs: z.array(stableKey).default([]),
  year: z.number().int().min(1900).max(2200).optional(),
  examName: nonEmptyText.optional(),
  paperCode: nonEmptyText.optional(),
  questionNumber: z.number().int().positive().optional(),
  lawVersion: nonEmptyText.optional(),
  questionSignals: z.array(nonEmptyText).default([]),
  negativeStem: z.boolean().default(false),
  reasoningSteps: z.array(nonEmptyText).default([]),
  optionAnalyses: z.array(legalOptionAnalysisSchema).default([]),
  commonTraps: z.array(nonEmptyText).default([]),
  microLessonRefs: z.array(stableKey).default([]),
  variantOf: stableKey.optional(),
  generationProfile: nonEmptyText.optional(),
  contentHash: z.string().regex(/^sha256:[a-f0-9]{64}$/).optional(),
}).strict().superRefine((question, ctx) => {
  const optionKeys = new Set(question.options.map((option) => option.key));
  if (optionKeys.size !== question.options.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["options"], message: "選項 key 不可重複" });
  }
  question.answerRevisions.forEach((revision, revisionIndex) => {
    revision.correctOptionKeys.forEach((key) => {
      if (!optionKeys.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["answerRevisions", revisionIndex, "correctOptionKeys"],
          message: `答案引用不存在的選項 ${key}`,
        });
      }
    });
  });
  const analyzedOptions = new Set<string>();
  question.optionAnalyses.forEach((analysis, index) => {
    if (!optionKeys.has(analysis.optionKey)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["optionAnalyses", index, "optionKey"], message: "解析引用不存在的選項" });
    }
    if (analyzedOptions.has(analysis.optionKey)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["optionAnalyses", index, "optionKey"], message: "同一選項不可重複解析" });
    }
    analyzedOptions.add(analysis.optionKey);
  });
  if (question.origin === "official" && question.sourceRefs.length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["sourceRefs"], message: "官方題必須附來源" });
  }
  if (question.origin === "ai-generated" && ["human-reviewed", "published"].includes(question.reviewStatus)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["reviewStatus"], message: "AI 題不可直接標成人工審核或發布" });
  }
});

export const questionSessionStepValues = [
  "stem-only",
  "signal-lock",
  "issue-prediction",
  "options-visible",
  "answer-selected",
  "confidence-locked",
  "submitted",
  "option-analysis",
  "micro-lesson",
  "variant-question",
  "completed",
  "queued-for-review",
] as const;
export const questionSessionStepSchema = z.enum(questionSessionStepValues);
export const legalPresentationLayoutSchema = z.enum([
  "aiap-soft-study",
  "lavender-notebook",
  "midnight-academy",
  "modern-law-school",
  "guilt-rose-academy",
]);

export const questionSessionDraftSchema = z.object({
  selectedSignals: z.array(nonEmptyText).default([]),
  negativeLocked: z.boolean().default(false),
  issuePrediction: stableKey.optional(),
  positionConfidence: z.enum(["certain", "hesitant", "guess"]).optional(),
  firstSelectedOptionKeys: z.array(stableKey).default([]),
  finalSelectedOptionKeys: z.array(stableKey).default([]),
  confidence: legalConfidenceSchema.optional(),
  hintLevel: z.number().int().min(0).max(6).default(0),
  changedAnswer: z.boolean().default(false),
  optionAnalysisOpened: z.boolean().default(false),
  microLessonOpened: z.boolean().default(false),
  transferCorrect: z.boolean().optional(),
  submittedAttemptId: stableKey.optional(),
}).strict();

export const questionSessionStateSchema = z.object({
  sessionId: stableKey,
  status: z.enum(["active", "completed", "abandoned"]),
  subjectKey: stableKey,
  questionKeys: z.array(stableKey).min(1),
  currentIndex: z.number().int().nonnegative(),
  currentQuestionKey: stableKey,
  step: questionSessionStepSchema,
  layout: legalPresentationLayoutSchema,
  mode: z.enum(["reading", "immersive", "night"]),
  current: questionSessionDraftSchema,
  startedAt: z.string().datetime(),
  questionStartedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
}).strict();

export const questionAttemptV2Schema = z.object({
  attemptId: stableKey,
  sessionId: stableKey,
  questionKey: stableKey,
  answerRevisionId: stableKey,
  firstSelectedOptionKeys: z.array(stableKey),
  finalSelectedOptionKeys: z.array(stableKey),
  correct: z.boolean(),
  confidence: legalConfidenceSchema,
  issuePrediction: stableKey.optional(),
  negativeLocked: z.boolean(),
  selectedSignals: z.array(nonEmptyText),
  hintLevel: z.number().int().min(0).max(6),
  changedAnswer: z.boolean(),
  durationMs: z.number().int().nonnegative(),
  microLessonOpened: z.boolean(),
  errorCategories: z.array(legalErrorCategorySchema),
  attemptedAt: z.string().datetime(),
}).strict();

export const questionLearningStateSchema = z.object({
  questionKey: stableKey,
  mastery: z.number().min(0).max(100),
  attemptCount: z.number().int().nonnegative(),
  correctCount: z.number().int().nonnegative(),
  latestCorrect: z.boolean(),
  unresolved: z.boolean(),
  lastAttemptAt: z.string().datetime(),
  nextReviewAt: z.string().datetime().optional(),
  errorCategories: z.array(legalErrorCategorySchema).default([]),
}).strict();

export const legalReviewQueueItemSchema = z.object({
  id: stableKey,
  questionKey: stableKey,
  subjectKey: stableKey,
  errorCategory: legalErrorCategorySchema,
  dueAt: z.string().datetime(),
  status: z.enum(["pending", "completed", "dismissed"]),
  sourceAttemptId: stableKey,
}).strict();

export const materialNoteSchema = z.object({
  id: stableKey,
  targetType: z.enum(["question", "option", "chapter", "term"]),
  targetKey: stableKey,
  body: nonEmptyText,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();
export const materialBookmarkSchema = z.object({
  id: stableKey,
  targetType: z.enum(["question", "chapter", "term"]),
  targetKey: stableKey,
  createdAt: z.string().datetime(),
}).strict();
export const materialHighlightSchema = z.object({
  id: stableKey,
  targetKey: stableKey,
  quote: nonEmptyText,
  quoteHash: nonEmptyText,
  createdAt: z.string().datetime(),
}).strict();
export const contentPatchDraftSchema = z.object({
  patchId: stableKey,
  status: z.enum(["captured", "validated", "conflict", "reviewed", "applied", "rejected"]),
  patch: z.unknown(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).strict();
export const contentReleaseSchema = z.object({
  releaseId: stableKey,
  subjectKey: stableKey,
  version: nonEmptyText,
  publishedAt: z.string().datetime(),
  patchIds: z.array(stableKey),
  status: z.enum(["published", "rolled-back"]),
}).strict();

export type LegalQuestionDefinitionV2 = z.infer<typeof legalQuestionDefinitionV2Schema>;
export type LegalAnswerRevisionV2 = z.infer<typeof legalAnswerRevisionV2Schema>;
export type LegalConfidence = z.infer<typeof legalConfidenceSchema>;
export type LegalErrorCategory = z.infer<typeof legalErrorCategorySchema>;
export type QuestionSessionStep = z.infer<typeof questionSessionStepSchema>;
export type QuestionSessionDraft = z.infer<typeof questionSessionDraftSchema>;
export type QuestionSessionState = z.infer<typeof questionSessionStateSchema>;
export type QuestionAttemptV2 = z.infer<typeof questionAttemptV2Schema>;
export type QuestionLearningState = z.infer<typeof questionLearningStateSchema>;
export type LegalReviewQueueItem = z.infer<typeof legalReviewQueueItemSchema>;
export type MaterialNote = z.infer<typeof materialNoteSchema>;
export type MaterialBookmark = z.infer<typeof materialBookmarkSchema>;
export type MaterialHighlight = z.infer<typeof materialHighlightSchema>;
export type ContentPatchDraft = z.infer<typeof contentPatchDraftSchema>;
export type ContentRelease = z.infer<typeof contentReleaseSchema>;
