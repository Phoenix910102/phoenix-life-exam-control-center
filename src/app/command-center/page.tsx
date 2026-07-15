import type { Metadata } from "next";
import { CommandCenter } from "@/components/command-center/CommandCenter";

export const metadata: Metadata = {
  title: "Phoenix Command Center",
  description: "Phoenix 與 Rékaí 的私人戰役與學習中樞",
};

export default function CommandCenterPage() {
  return <CommandCenter />;
}
