import { Flower2 } from "lucide-react";
import styles from "./command-shell.module.css";

export type CommandPageIdentity = {
  eyebrow: string;
  title: string;
  subtitle: string;
  breadcrumb?: string;
};

export function CommandPageHeader({ identity }: { identity: CommandPageIdentity }) {
  return (
    <header className={styles.header}>
      <span className={styles.brandMark} aria-hidden="true"><Flower2 size={22} /></span>
      <div className={styles.identity}>
        {identity.breadcrumb ? <span className={styles.breadcrumb}>{identity.breadcrumb}</span> : null}
        <b>{identity.eyebrow}</b>
        <strong>{identity.title}</strong>
        <small>{identity.subtitle}</small>
      </div>
    </header>
  );
}
