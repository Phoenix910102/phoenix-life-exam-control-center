import { describe, expect, it } from "vitest";
import {
  analyzeLegalContentPatch,
  exampleLegalContentPatch,
  parseAndAnalyzeLegalContentPatch,
} from "@/lib/law/contentPatch";

function examplePatch() {
  return structuredClone(exampleLegalContentPatch);
}

describe("Phoenix legal content patch", () => {
  it("accepts the example and separates link counts from content additions", () => {
    const result = analyzeLegalContentPatch(examplePatch());

    expect(result.status).toBe("ready");
    expect(result.issues).toHaveLength(0);
    expect(result.counts).toEqual({ add: 2, revise: 0, retire: 0, link: 1, total: 3 });
  });

  it("rejects official questions without a source", () => {
    const patch = examplePatch();
    const operation = patch.operations.find((item) => item.op === "question.add");
    if (!operation || operation.op !== "question.add") throw new Error("example question missing");
    operation.value.sourceRefs = [];

    const result = analyzeLegalContentPatch(patch);

    expect(result.status).toBe("invalid");
    expect(result.issues.some((issue) => issue.path.endsWith("sourceRefs") && issue.message.includes("官方題"))).toBe(true);
  });

  it("does not let AI-generated questions enter a human-reviewed or published state", () => {
    const patch = examplePatch();
    const operation = patch.operations.find((item) => item.op === "question.add");
    if (!operation || operation.op !== "question.add") throw new Error("example question missing");
    operation.value.origin = "ai-generated";
    operation.value.reviewStatus = "published";

    const result = analyzeLegalContentPatch(patch);

    expect(result.status).toBe("invalid");
    expect(result.issues.some((issue) => issue.path.endsWith("reviewStatus") && issue.message.includes("AI 題"))).toBe(true);
  });

  it("rejects answer revisions that point to an option that does not exist", () => {
    const patch = examplePatch();
    const operation = patch.operations.find((item) => item.op === "question.add");
    if (!operation || operation.op !== "question.add") throw new Error("example question missing");
    operation.value.answerRevisions[0].correctOptionKeys = ["z"];

    const result = analyzeLegalContentPatch(patch);

    expect(result.status).toBe("invalid");
    expect(result.issues.some((issue) => issue.message.includes("不存在的選項 z"))).toBe(true);
  });

  it("marks repeated operations against the same stable resource as a conflict", () => {
    const patch = examplePatch();
    const source = patch.operations.find((item) => item.op === "source.add");
    if (!source || source.op !== "source.add") throw new Error("example source missing");
    patch.operations.push(structuredClone(source));

    const result = analyzeLegalContentPatch(patch);

    expect(result.status).toBe("conflict");
    expect(result.issues.some((issue) => issue.severity === "conflict" && issue.path.includes(source.value.key))).toBe(true);
  });

  it("returns a field-level error for malformed JSON", () => {
    const result = parseAndAnalyzeLegalContentPatch('{"schema":');

    expect(result.status).toBe("invalid");
    expect(result.issues[0].path).toBe("json");
  });
});
