import type { Metadata } from "next";
import { QuestionSessionController } from "@/components/law/question-engine/QuestionSessionController";

export const metadata: Metadata = {
  title: "司律題庫主線｜AIAP Soft Study",
  description: "Phoenix Question-first 九步法律題目學習流程",
};

export default function LegalPracticePage() {
  return <QuestionSessionController />;
}
