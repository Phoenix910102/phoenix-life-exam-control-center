import styles from "./command-shell.module.css";

export function CommandSceneBackdrop({ variant = "archive" }: { variant?: "archive" | "quiet" }) {
  return (
    <div className={styles.backdrop} data-variant={variant} aria-hidden="true">
      <div className={styles.backdropImage} />
      <div className={styles.archiveGrid} />
      <div className={styles.horizonLines} />
      <div className={styles.backdropVignette} />
      <div className={styles.grain} />
    </div>
  );
}
