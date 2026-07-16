"use client";

import { useEffect, useRef } from "react";
import { ChromaKeyCharacters } from "./ChromaKeyCharacters";
import type { CommandCharacterState, CommandSceneMode } from "./types";
import styles from "./command-center.module.css";

type CommandSceneProps = {
  characterState: CommandCharacterState;
  mode?: CommandSceneMode;
};

export function CommandScene({ characterState, mode = "layered-art" }: CommandSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const resetPointer = () => {
      sceneRef.current?.style.setProperty("--pointer-x", "0");
      sceneRef.current?.style.setProperty("--pointer-y", "0");
    };

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

      frameRef.current = requestAnimationFrame(() => {
        const scene = sceneRef.current;
        if (!scene) return;
        const bounds = scene.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
        scene.style.setProperty("--pointer-x", x.toFixed(3));
        scene.style.setProperty("--pointer-y", y.toFixed(3));
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", resetPointer);
    document.documentElement.addEventListener("mouseleave", resetPointer);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetPointer);
      document.documentElement.removeEventListener("mouseleave", resetPointer);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      className={styles.scene}
      data-character-state={characterState}
      data-scene-mode={mode}
      data-testid="command-scene"
      ref={sceneRef}
    >
      <div className={styles.background} />
      <div className={styles.cityGlow} />
      <div className={styles.characterStage}>
        <div className={styles.characterIdle}>
          <ChromaKeyCharacters />
        </div>
      </div>
      <div className={styles.tableLight} />
      <div className={styles.foregroundHaze} />
      <div className={styles.sceneGrain} />
    </div>
  );
}
