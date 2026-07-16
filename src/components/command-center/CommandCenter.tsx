"use client";

import { useEffect, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, Warehouse } from "lucide-react";
import { CommandShell } from "@/components/command-shell/CommandShell";
import { buildCommandCenterViewModel } from "@/lib/command-center/buildCommandCenterViewModel";
import { mockCommandCenterData } from "@/lib/command-center/mockCommandCenterData";
import { CommandScene } from "./CommandScene";
import { CurrencyDisplay } from "./CurrencyDisplay";
import { CurrentMission } from "./CurrentMission";
import { UpcomingReward } from "./UpcomingReward";
import styles from "./command-center.module.css";

export function CommandCenter() {
  const [viewModel, setViewModel] = useState(mockCommandCenterData);
  const [leaving, setLeaving] = useState(false);
  const router = useRouter();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    buildCommandCenterViewModel().then(setViewModel).catch(() => setViewModel(mockCommandCenterData));
  }, []);

  function navigateTo(path: Route) {
    if (reducedMotion) {
      router.push(path);
      return;
    }
    setLeaving(true);
    window.setTimeout(() => router.push(path), 420);
  }

  const intro = reducedMotion ? { duration: 0.12 } : { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <CommandShell
      className={styles.page}
      contentMode="overlay"
      hud={(
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
          transition={{ ...intro, delay: reducedMotion ? 0 : 1.15 }}
        >
          <CurrencyDisplay currency={viewModel.currency} />
        </motion.div>
      )}
      identity={{
        eyebrow: "PHOENIX",
        title: "COMMAND CENTER",
        subtitle: "私人戰役與學習中樞",
      }}
      scene={<CommandScene characterState={viewModel.characterState} />}
      state={viewModel.characterState}
    >

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={styles.missionPosition}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
        transition={{ ...intro, delay: reducedMotion ? 0 : 1.48 }}
      >
        <CurrentMission
          activeMaterialTitle={viewModel.stats.activeMaterialTitle}
          mission={viewModel.mission}
        />
      </motion.div>

      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className={styles.rewardPosition}
        initial={{ opacity: 0, x: reducedMotion ? 0 : 20 }}
        transition={{ ...intro, delay: reducedMotion ? 0 : 1.72 }}
      >
        <UpcomingReward reward={viewModel.upcomingReward} />
      </motion.div>

      <motion.blockquote
        animate={{ opacity: 1 }}
        className={styles.dialogue}
        initial={{ opacity: 0 }}
        transition={{ ...intro, delay: reducedMotion ? 0 : 1.9 }}
      >
        <span>RÉKAÍ / 03:16</span>
        <p>「今天不擴張戰線。把這個區域守穩。」</p>
      </motion.blockquote>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={styles.actions}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
        transition={{ ...intro, delay: reducedMotion ? 0 : 2.05 }}
      >
        <button className={styles.primaryAction} onClick={() => navigateTo("/materials")} type="button">
          <BookOpen size={18} />
          <span>進入戰役</span>
          <ArrowRight size={17} />
        </button>
        <button className={styles.secondaryAction} onClick={() => navigateTo("/arsenal")} type="button">
          <Warehouse size={18} />
          <span>軍需庫</span>
          <ArrowRight size={17} />
        </button>
      </motion.div>

      <AnimatePresence>
        {leaving ? (
          <motion.div
            animate={{ opacity: 1 }}
            className={styles.exitCurtain}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.42 }}
          />
        ) : null}
      </AnimatePresence>
    </CommandShell>
  );
}
