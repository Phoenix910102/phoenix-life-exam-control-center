import type { Metadata } from "next";
import { LawOperationsHome } from "@/components/law/LawOperationsHome";

export const metadata: Metadata = {
  title: "鳳凰行動・司律主線",
  description: "Phoenix Question-first 司律學習與增量內容系統",
};

export default function LawPage() {
  return <LawOperationsHome />;
}
