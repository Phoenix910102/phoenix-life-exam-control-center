import type { Question } from "@/types/question";
import { aiapPastQuestions } from "@/lib/exams/aiapPastQuestions";
import { aiapSimulationQuestions } from "@/lib/exams/aiapSimulationQuestions";
import { aiapDrillQuestions } from "@/lib/exams/aiapDrillQuestions";
import { aiapPythonQuestions } from "@/lib/exams/aiapPythonQuestions";

export type AiapQuestionBankId = "official" | "simulation";

export type AiapQuestionBank = {
  id: AiapQuestionBankId;
  label: string;
  eyebrow: string;
  title: string;
  badgeLabel: string;
  description: string;
  questions: Question[];
};

export const aiapQuestionBanks: AiapQuestionBank[] = [
  {
    id: "official",
    label: "官方公告題",
    eyebrow: "114 年第二梯次",
    title: "AIAP 官方考古題戰情室",
    badgeLabel: "官方公告",
    description: "來源為 114 年第二梯次當次試題公告 PDF。",
    questions: aiapPastQuestions,
  },
  {
    id: "simulation",
    label: "模擬／仿真題",
    eyebrow: "非官方訓練題",
    title: "AIAP 模擬／仿真題訓練室",
    badgeLabel: "非官方訓練",
    description: "包含 PDF 模擬考、DOCX 仿真題與 Python 專項練習，皆為非官方題庫，也不是命中保證。",
    questions: [...aiapSimulationQuestions, ...aiapDrillQuestions, ...aiapPythonQuestions],
  },
];

export const aiapAllQuestions = aiapQuestionBanks.flatMap((bank) => bank.questions);

export function getAiapQuestionBank(id: string | null | undefined) {
  return aiapQuestionBanks.find((bank) => bank.id === id) ?? aiapQuestionBanks[0];
}
