import type { Metadata } from "next";
import { LegalContentInbox } from "@/components/law/LegalContentInbox";

export const metadata: Metadata = {
  title: "司律內容收件匣",
  description: "Phoenix 法律教材與題目 Patch 驗證收件匣",
};

export default function LegalContentInboxPage() {
  return <LegalContentInbox />;
}
