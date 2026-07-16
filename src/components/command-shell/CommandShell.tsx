import type { ReactNode } from "react";
import { CommandPageHeader, type CommandPageIdentity } from "./CommandPageHeader";
import { CommandRail } from "./CommandRail";
import { CommandTopHUD } from "./CommandTopHUD";
import styles from "./command-shell.module.css";

type CommandShellProps = {
  children: ReactNode;
  identity: CommandPageIdentity;
  scene?: ReactNode;
  hud?: ReactNode;
  className?: string;
  contentMode?: "document" | "overlay";
  state?: string;
};

export function CommandShell({
  children,
  identity,
  scene,
  hud,
  className = "",
  contentMode = "document",
  state,
}: CommandShellProps) {
  return (
    <main className={`${styles.shell} ${className}`} data-command-state={state} data-state={state}>
      {scene ? <div className={styles.sceneSlot}>{scene}</div> : null}
      <div className={styles.frame} aria-hidden="true" />
      <CommandPageHeader identity={identity} />
      {hud ? <CommandTopHUD>{hud}</CommandTopHUD> : null}
      <CommandRail />
      <div className={contentMode === "overlay" ? styles.overlayContent : styles.documentContent}>
        {children}
      </div>
    </main>
  );
}
