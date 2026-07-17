import Link from "next/link";
import {
  Archive,
  BookOpenText,
  BrainCircuit,
  ChevronRight,
  FileCheck2,
  LibraryBig,
  Scale,
  ShieldCheck,
  Swords,
} from "lucide-react";
import { CommandSceneBackdrop } from "@/components/command-shell/CommandSceneBackdrop";
import { CommandShell } from "@/components/command-shell/CommandShell";
import styles from "@/app/law/law.module.css";

const sections = [
  { href: "/law/practice", code: "01", title: "題庫主線", detail: "官方題、衍生題與單題 Session", icon: Swords, state: "契約準備" },
  { href: "/law/wrong-book", code: "02", title: "錯題檔案", detail: "高信心錯誤、猜對與答案更正", icon: Archive, state: "資料模型" },
  { href: "/law/weakness", code: "03", title: "弱點修復", detail: "錯誤分類與間隔複習佇列", icon: BrainCircuit, state: "排程待接" },
  { href: "/law/mock-exams", code: "04", title: "模擬考場", detail: "官方題與已發布題的限時演練", icon: Scale, state: "發布閘門" },
  { href: "/law/glossary", code: "05", title: "法律名詞庫", detail: "跨章、爭點與混淆關係", icon: BookOpenText, state: "關聯待接" },
  { href: "/law/sources", code: "06", title: "來源與版本", detail: "法條、裁判、答案公告與時效", icon: LibraryBig, state: "來源契約" },
] as const;

const flow = [
  ["CAPTURE", "Chat 提交局部 Patch"],
  ["VERIFY", "Schema、來源與衝突檢查"],
  ["REVIEW", "Phoenix 確認差異"],
  ["PUBLISH", "版本化後進入正式題庫"],
] as const;

export function LawOperationsHome() {
  return (
    <CommandShell
      identity={{
        eyebrow: "LAW OPERATIONS",
        title: "鳳凰行動・司律主線",
        subtitle: "題目是入口，教材是後援",
        breadcrumb: "COMMAND CENTER / LAW OPERATIONS",
      }}
      scene={<CommandSceneBackdrop variant="quiet" />}
      hud={<div className={styles.hud}><span>CONTENT CONTRACT</span><strong>v1</strong><i>LOCAL-FIRST</i></div>}
    >
      <div className={styles.lawHome}>
        <section className={styles.masthead}>
          <div>
            <p>PHOENIX LEGAL CAMPAIGN</p>
            <h1>司律題目主線</h1>
            <span>官方題、教材、來源與個人進度分層保存；新增內容只更新指定位置。</span>
          </div>
          <Link className={styles.primaryEntry} href="/law/content-inbox">
            <FileCheck2 size={18} />
            <span><small>PATCH INBOX</small>內容收件匣</span>
            <ChevronRight size={17} />
          </Link>
        </section>

        <section className={styles.statusBand} aria-label="法律系統基礎狀態">
          <div><small>ENGINE</small><strong>QUESTION-FIRST</strong></div>
          <div><small>CONTENT</small><strong>PATCH-BASED</strong></div>
          <div><small>PROGRESS</small><strong>SEPARATED</strong></div>
          <div><small>PUBLICATION</small><strong>REVIEW-GATED</strong></div>
        </section>

        <section className={styles.workflow}>
          <div className={styles.sectionHeading}>
            <div><span>CONTENT PIPELINE</span><h2>增量內容管線</h2></div>
            <p>不重做整份教材，不覆蓋既有作答。</p>
          </div>
          <ol>
            {flow.map(([code, label], index) => (
              <li key={code}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <span><small>{code}</small>{label}</span>
                {index < flow.length - 1 ? <ChevronRight aria-hidden="true" size={15} /> : <ShieldCheck aria-hidden="true" size={16} />}
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.moduleIndex}>
          <div className={styles.sectionHeading}>
            <div><span>OPERATION INDEX</span><h2>司律系統模組</h2></div>
            <p>路由先固定，內容再依科目逐批進場。</p>
          </div>
          <div className={styles.moduleRows}>
            {sections.map(({ href, code, title, detail, icon: Icon, state }) => (
              <Link href={href} key={href}>
                <b>{code}</b>
                <i><Icon size={18} /></i>
                <span><strong>{title}</strong><small>{detail}</small></span>
                <em>{state}</em>
                <ChevronRight size={16} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </CommandShell>
  );
}
