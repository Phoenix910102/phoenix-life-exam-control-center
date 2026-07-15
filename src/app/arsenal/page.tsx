import Link from "next/link";
import { ArrowLeft, LockKeyhole, Warehouse } from "lucide-react";
import styles from "./arsenal.module.css";

export default function ArsenalPage() {
  return (
    <main className={styles.page}>
      <div className={styles.backdrop} />
      <section className={styles.content}>
        <span className={styles.icon}><Warehouse size={28} /></span>
        <p>PHOENIX ARSENAL / ACCESS 01</p>
        <h1>軍需庫正在整備</h1>
        <span className={styles.rule} />
        <div className={styles.status}><LockKeyhole size={15} /> Night Commander 已列入下一批解鎖</div>
        <Link href="/command-center"><ArrowLeft size={17} /> 返回中控台</Link>
      </section>
    </main>
  );
}
