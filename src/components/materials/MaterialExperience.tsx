"use client";

import type { MaterialDefinition, MaterialProgress, MaterialQuizAttempt } from "@/types/materialRecord";
import type { DomainEventReceipt } from "@/types/domainEvent";
import { ImmersiveAcademy } from "@/components/materials/immersive/ImmersiveAcademy";
import { PhoenixMaterialRenderer } from "@/components/materials/PhoenixMaterialRenderer";
import { normalizeMaterialPresentation } from "@/lib/materials/presentation";

type Props = {
  definition: MaterialDefinition;
  progress: MaterialProgress;
  chapterKey: string;
  onChapterSelect: (chapterKey: string) => void | Promise<void>;
  onChapterProgressChange: (chapterKey: string, value: number) => void | Promise<void>;
  onQuizAttempt?: (attempt: MaterialQuizAttempt) => void | Promise<void>;
  battlefieldEventReceipts?: DomainEventReceipt[];
  onBattlefieldEventReceiptsConsumed?: (eventIds: string[]) => void;
  onBattlefieldEventReceipts?: (receipts: DomainEventReceipt[]) => void;
};

export function MaterialExperience(props: Props) {
  const definition = props.definition.kind === "phoenix-package"
    ? { ...props.definition, presentation: normalizeMaterialPresentation(props.definition.presentation) }
    : props.definition;
  const normalizedProps = { ...props, definition };
  const layout = definition.presentation?.layout ?? "editorial";

  if (layout === "immersive-academy") return <ImmersiveAcademy {...normalizedProps} />;

  if (layout === "compact") {
    return (
      <div className="mx-auto max-w-3xl border-x border-slate-200 bg-white">
        <PhoenixMaterialRenderer
          chapterKey={props.chapterKey}
          definition={definition}
          onQuizAttempt={props.onQuizAttempt}
        />
      </div>
    );
  }

  return (
    <PhoenixMaterialRenderer
      chapterKey={props.chapterKey}
      definition={definition}
      onQuizAttempt={props.onQuizAttempt}
    />
  );
}
