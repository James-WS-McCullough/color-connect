import { unlockableStageTypes } from "../types";

type unlockAStageTypeProps = {
  levelNumber: number;
  unlockedStageTypes: string[];
  setUnlockedStageTypes: (unlockedStageTypes: string[]) => void;
  triggerPopup: (text: string, color: string) => void;
};

export const unlockAStageType = ({
  levelNumber,
  unlockedStageTypes,
  setUnlockedStageTypes,
  triggerPopup,
}: unlockAStageTypeProps) => {
  // List all unlockableStageTypes with a level below the current level that isn't in unlockedStageEffects
  // Randomly select one of them
  // Add it to the unlockedStageEffects
  const unlockableStageTypesBelowLevel = unlockableStageTypes.filter(
    (stageType) =>
      stageType.level <= levelNumber &&
      !unlockedStageTypes.includes(stageType.effect)
  );
  if (unlockableStageTypesBelowLevel.length === 0) {
    return;
  }

  const randomIndex = Math.floor(
    Math.random() * unlockableStageTypesBelowLevel.length
  );
  const randomStageType = unlockableStageTypesBelowLevel[randomIndex];
  setUnlockedStageTypes([...unlockedStageTypes, randomStageType.effect]);
  triggerPopup(randomStageType.popupText, randomStageType.color);
  return randomStageType.effect;
};
