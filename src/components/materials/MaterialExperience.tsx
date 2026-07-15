"use client";

import type { MaterialDefinition, MaterialProgress, MaterialQuizAttempt } from "@/types/materialRecord";
import { ImmersiveAcademy } from "@/components/materials/immersive/ImmersiveAcademy";
import { PhoenixMaterialRenderer } from "@/components/materials/PhoenixMaterialRenderer";

type Props = {
  definition: MaterialDefinition;
  progress: MaterialProgress;
  chapterKey: string;
  onChapterSelect: (chapterKey: string) => void | Promise<void>;
  onChapterProgressChange: (chapterKey: string, value: number) => void | Promise<void>;
  onQuizAttempt?: (attempt: MaterialQuizAttempt) => void | Promise<void>;
};

export function MaterialExperience(props: Props) {
  const layout = props.definition.presentation?.layout ?? "editorial";

  if (layout === "immersive-academy") return <ImmersiveAcademy {...props} />;

  if (layout === "compact") {
    return (
      <div className="mx-auto max-w-3xl border-x border-slate-200 bg-white">
        <PhoenixMaterialRenderer
          chapterKey={props.chapterKey}
          definition={props.definition}
          onQuizAttempt={props.onQuizAttempt}
        />
      </div>
    );
  }

  return (
    <PhoenixMaterialRenderer
      chapterKey={props.chapterKey}
      definition={props.definition}
      onQuizAttempt={props.onQuizAttempt}
    />
  );
}
