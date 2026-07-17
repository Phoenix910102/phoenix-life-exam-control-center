import Link from "next/link";
import { ArrowLeft, Construction, FileCheck2 } from "lucide-react";
import { CommandSceneBackdrop } from "@/components/command-shell/CommandSceneBackdrop";
import { CommandShell } from "@/components/command-shell/CommandShell";
import styles from "@/app/law/law.module.css";

const sections: Record<string, { eyebrow: string; title: string; subtitle: string; next: string }> = {
  practice: { eyebrow: "QUESTION OPERATIONS", title: "題庫主線", subtitle: "官方題、衍生題與單題 Session", next: "等待 Question schema 與 Session state machine" },
  "wrong-book": { eyebrow: "ERROR ARCHIVE", title: "錯題檔案", subtitle: "保留錯誤歷史，不永久懲罰已修正內容", next: "等待 questionAttemptsV2 與 learningReviewQueue" },
  weakness: { eyebrow: "RECOVERY OPERATIONS", title: "弱點修復", subtitle: "錯誤分類、遺忘風險與複習排程", next: "等待錯誤分類契約與排程服務" },
  "mock-exams": { eyebrow: "EXAM CHAMBER", title: "模擬考場", subtitle: "只使用官方題與通過發布閘門的內容", next: "等待 contentReviewQueue 與正式發布規則" },
  glossary: { eyebrow: "LEGAL GLOSSARY", title: "法律名詞庫", subtitle: "跨章、爭點與混淆概念索引", next: "等待 stable term key 與教材關聯" },
  sources: { eyebrow: "SOURCE LIBRARY", title: "來源與版本", subtitle: "法條、裁判、答案公告與時效紀錄", next: "等待 source records 與法條版本模型" },
};

export function LawSectionPlaceholder({ section }: { section: string }) {
  const current = sections[section] ?? { eyebrow: "LAW OPERATIONS", title: "尚未登錄的區域", subtitle: "此路由不在目前司律架構內", next: "返回司律主線" };
  return (
    <CommandShell
      identity={{ eyebrow: current.eyebrow, title: current.title, subtitle: current.subtitle, breadcrumb: "LAW OPERATIONS" }}
      scene={<CommandSceneBackdrop variant="quiet" />}
      hud={<div className={styles.hud}><span>MODULE</span><strong>LOCKED</strong><i>CONTRACT FIRST</i></div>}
    >
      <section className={styles.placeholder}>
        <div className={styles.placeholderSeal}><Construction size={28} /></div>
        <p>{current.eyebrow}</p>
        <h1>{current.title}</h1>
        <span>{current.next}</span>
        <div>
          <Link href="/law"><ArrowLeft size={16} />返回司律主線</Link>
          <Link href="/law/content-inbox"><FileCheck2 size={16} />內容收件匣</Link>
        </div>
      </section>
    </CommandShell>
  );
}
