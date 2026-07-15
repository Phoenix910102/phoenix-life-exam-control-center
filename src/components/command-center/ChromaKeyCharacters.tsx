"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./command-center.module.css";

export function ChromaKeyCharacters() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = new Image();
    image.decoding = "async";
    image.src = "/command-center/phoenix-rekai-chroma.png";
    image.onload = () => {
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.drawImage(image, 0, 0);
      const frame = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = frame.data;

      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const dominance = green - Math.max(red, blue);

        if (green > 105 && dominance > 22) {
          const keyStrength = Math.min(1, (dominance - 22) / 92);
          pixels[index + 3] = Math.round(255 * (1 - keyStrength));
          pixels[index + 1] = Math.min(green, Math.max(red, blue) + 18);
        }
      }

      context.putImageData(frame, 0, 0);
      setReady(true);
    };
  }, []);

  return (
    <canvas
      aria-label="Phoenix 與 Rékaí 站在戰術桌前"
      className={`${styles.characters} ${ready ? styles.charactersReady : ""}`}
      data-testid="command-characters"
      ref={canvasRef}
      role="img"
    />
  );
}
