import type { ReactNode } from "react";
import styles from "./command-shell.module.css";

export function CommandTopHUD({ children }: { children: ReactNode }) {
  return <div className={styles.topHud}>{children}</div>;
}
