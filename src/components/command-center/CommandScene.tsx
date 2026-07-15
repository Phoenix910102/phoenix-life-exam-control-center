"use client";

import { useRef, type PointerEvent } from "react";
import { ChromaKeyCharacters } from "./ChromaKeyCharacters";
import type { CommandCharacterState, CommandSceneMode } from "./types";
import styles from "./command-center.module.css";

type CommandSceneProps = {
  characterState: CommandCharacterState;
  mode?: CommandSceneMode;
};

export function CommandScene({ characterState, mode = "layered-art" }: CommandSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const scene = sceneRef.current;
    if (!scene) return;
    const bounds = scene.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    scene.style.setProperty("--pointer-x", x.toFixed(3));
    scene.style.setProperty("--pointer-y", y.toFixed(3));
  }

  function resetPointer() {
    sceneRef.current?.style.setProperty("--pointer-x", "0");
    sceneRef.current?.style.setProperty("--pointer-y", "0");
  }

  return (
    <div
      className={styles.scene}
      data-character-state={characterState}
      data-scene-mode={mode}
      onPointerLeave={resetPointer}
      onPointerMove={handlePointerMove}
      ref={sceneRef}
    >
      <div className={styles.background} />
      <div className={styles.cityGlow} />
      <div className={styles.characterStage}>
        <ChromaKeyCharacters />
      </div>
      <div className={styles.tableLight} />
      <div className={styles.foregroundHaze} />
      <div className={styles.sceneGrain} />
    </div>
  );
}
