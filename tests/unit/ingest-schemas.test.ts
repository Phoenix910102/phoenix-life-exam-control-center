import { describe, expect, it } from "vitest";
import { ingestQuestionInboxSchema, ingestQuestionSchema, ingestTaskSchema } from "@/lib/helel/ingestSchemas";

describe("ingest schemas", () => {
  it("validates task payload", () => {
    const x = ingestTaskSchema.parse({ title: "x" });
    expect(x.title).toBe("x");
  });

  it("validates question structured payload", () => {
    const x = ingestQuestionSchema.parse({
      mode: "structured",
      questionDraft: { subject: "S", topic: "T", type: "single", stem: "Q" },
    });
    expect(x.mode).toBe("structured");
  });

  it("validates inbox payload", () => {
    const x = ingestQuestionInboxSchema.parse({ text: "abc", format: "auto" });
    expect(x.text).toBe("abc");
  });
});
