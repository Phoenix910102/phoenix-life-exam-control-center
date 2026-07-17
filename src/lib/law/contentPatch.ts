import { legalContentPatchSchema, type LegalContentPatch, type LegalContentPatchOperation } from "@/types/legalContentPatch";

export type ContentPatchIssue = {
  severity: "error" | "warning" | "conflict";
  path: string;
  message: string;
};

export type ContentPatchAnalysis = {
  status: "invalid" | "conflict" | "ready";
  patch?: LegalContentPatch;
  issues: ContentPatchIssue[];
  counts: {
    add: number;
    revise: number;
    retire: number;
    link: number;
    total: number;
  };
};

function operationTarget(operation: LegalContentPatchOperation) {
  switch (operation.op) {
    case "question.add": return `question:${operation.value.key}`;
    case "question.revise":
    case "question.retire": return `question:${operation.key}`;
    case "answer-revision.add": return `answer:${operation.questionKey}:${operation.value.id}`;
    case "lesson-block.add": return `block:${operation.value.key}`;
    case "lesson-block.revise": return `block:${operation.blockKey}`;
    case "term.add": return `term:${operation.value.key}`;
    case "source.add": return `source:${operation.value.key}`;
    case "link.add":
    case "link.remove": return `link:${operation.value.from}:${operation.value.relation}:${operation.value.to}`;
  }
}

export function analyzeLegalContentPatch(input: unknown): ContentPatchAnalysis {
  const parsed = legalContentPatchSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "invalid",
      issues: parsed.error.issues.map((issue) => ({
        severity: "error" as const,
        path: issue.path.length > 0 ? issue.path.join(".") : "patch",
        message: issue.message,
      })),
      counts: { add: 0, revise: 0, retire: 0, link: 0, total: 0 },
    };
  }

  const patch = parsed.data;
  const issues: ContentPatchIssue[] = [];
  const targetOperations = new Map<string, string[]>();
  const sourceKeys = new Set(
    patch.operations.flatMap((operation) => operation.op === "source.add" ? [operation.value.key] : []),
  );

  patch.operations.forEach((operation, index) => {
    const target = operationTarget(operation);
    const previous = targetOperations.get(target) ?? [];
    previous.push(operation.op);
    targetOperations.set(target, previous);

    if (operation.op === "question.add") {
      for (const sourceRef of operation.value.sourceRefs) {
        if (!sourceKeys.has(sourceRef)) {
          issues.push({
            severity: "warning",
            path: `operations.${index}.value.sourceRefs`,
            message: `來源 ${sourceRef} 不在本 Patch 內，套用時必須確認它已存在`,
          });
        }
      }
    }
  });

  for (const [target, operations] of targetOperations) {
    if (operations.length <= 1) continue;
    issues.push({
      severity: "conflict",
      path: target,
      message: `同一資源在本 Patch 出現 ${operations.length} 次操作：${operations.join("、")}`,
    });
  }

  const counts = patch.operations.reduce((result, operation) => {
    result.total += 1;
    if (operation.op.startsWith("link.")) result.link += 1;
    else if (operation.op.endsWith(".add")) result.add += 1;
    else if (operation.op.endsWith(".revise")) result.revise += 1;
    else if (operation.op.endsWith(".retire")) result.retire += 1;
    return result;
  }, { add: 0, revise: 0, retire: 0, link: 0, total: 0 });

  return {
    status: issues.some((issue) => issue.severity === "conflict") ? "conflict" : "ready",
    patch,
    issues,
    counts,
  };
}

export function parseAndAnalyzeLegalContentPatch(value: string): ContentPatchAnalysis {
  try {
    return analyzeLegalContentPatch(JSON.parse(value));
  } catch (error) {
    return {
      status: "invalid",
      issues: [{ severity: "error", path: "json", message: error instanceof Error ? error.message : "JSON 格式錯誤" }],
      counts: { add: 0, revise: 0, retire: 0, link: 0, total: 0 },
    };
  }
}

export const exampleLegalContentPatch = {
  schema: "phoenix.content-patch.v1",
  patchId: "criminal-law-20260717-001",
  createdAt: "2026-07-17T08:00:00.000Z",
  createdBy: { name: "Rekai", model: "chat" },
  target: {
    subjectKey: "criminal-law",
    packageSlug: "criminal-law-general-principles",
    baseVersion: "1.0.0",
  },
  summary: "新增一題犯罪成立三階層官方種子題與來源連結",
  operations: [
    {
      op: "source.add",
      value: {
        key: "exam.112.bar.first.criminal-law",
        title: "112 年司律一試刑法公告試題",
        kind: "exam",
        citation: "112 年司律一試刑法第 18 題",
        authority: "考選部",
        accessedAt: "2026-07-17T08:00:00.000Z",
        freshness: "review-needed",
      },
    },
    {
      op: "question.add",
      value: {
        key: "bar-112-criminal-law-q18",
        subjectKey: "criminal-law",
        origin: "official",
        reviewStatus: "draft",
        prompt: "下列關於犯罪成立三階層之敘述，何者正確？",
        options: [
          { key: "a", text: "選項 A" },
          { key: "b", text: "選項 B" },
          { key: "c", text: "選項 C" },
          { key: "d", text: "選項 D" },
        ],
        answerRevisions: [{
          id: "answer.original",
          correctOptionKeys: ["b"],
          status: "original",
          sourceRef: "exam.112.bar.first.criminal-law",
          effectiveAt: "2023-08-01T00:00:00.000Z",
        }],
        chapterRefs: ["criminal-law.offense-structure"],
        issueRefs: ["criminal-law.offense-structure.three-levels"],
        termRefs: [],
        sourceRefs: ["exam.112.bar.first.criminal-law"],
        questionSignals: ["何者正確"],
        negativeStem: false,
      },
    },
    {
      op: "link.add",
      value: {
        from: "bar-112-criminal-law-q18",
        to: "criminal-law.offense-structure",
        relation: "belongs-to",
      },
    },
  ],
} as const;
