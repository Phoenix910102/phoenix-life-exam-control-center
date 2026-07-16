"use client";

import type { ReactNode } from "react";
import type { MaterialDefinition, MaterialProgress, MaterialQuizAttempt } from "@/types/materialRecord";
import type { DomainEventReceipt } from "@/types/domainEvent";
import { CampaignThemeProvider } from "@/components/campaign/theme/CampaignThemeProvider";
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
  if (props.definition.kind !== "phoenix-package") {
    return (
      <PhoenixMaterialRenderer
        chapterKey={props.chapterKey}
        definition={props.definition}
        onQuizAttempt={props.onQuizAttempt}
      />
    );
  }

  const presentation = normalizeMaterialPresentation(props.definition.presentation);
  const definition = { ...props.definition, presentation };
  const normalizedProps = { ...props, definition };
  const layout = definition.presentation?.layout ?? "editorial";

  let experience: ReactNode;

  if (layout === "immersive-academy") {
    experience = <ImmersiveAcademy {...normalizedProps} />;
  } else if (layout === "compact") {
    experience = (
      <div className="campaign-reading-stage">
        <PhoenixMaterialRenderer
          chapterKey={props.chapterKey}
          definition={definition}
          onQuizAttempt={props.onQuizAttempt}
        />
      </div>
    );
  } else {
    experience = (
      <div className="campaign-reading-stage">
        <PhoenixMaterialRenderer
          chapterKey={props.chapterKey}
          definition={definition}
          onQuizAttempt={props.onQuizAttempt}
        />
      </div>
    );
  }

  return (
    <CampaignThemeProvider presentation={presentation}>
      {experience}
    </CampaignThemeProvider>
  );
}
