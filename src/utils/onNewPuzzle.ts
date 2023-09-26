import { GridBoxPath, colors } from "../types";
import { generatePuzzle } from "./generatePuzzle";
import { pickRandomStageType } from "./pickRandomStageType";
import { playSFX } from "./playSFX";
import { toAddNewColor } from "./toAddNewColour";
import { unlockAStageType } from "./unlockAStageType";

type onNewPuzzleProps = {
  setPath: (path: { [key: string]: GridBoxPath }) => void;
  setCompletedPaths: (completedPaths: { [key: string]: boolean }) => void;
  setNumberOfConnectedColors: (numberOfConnectedColors: number) => void;
  level: number;
  size: number;
  colourCount: number;
  setLevel: (level: number) => void;
  setSize: (size: number) => void;
  setColourCount: (colourCount: number) => void;
  setPuzzle: (puzzle: any) => void;
  unlockedStageTypes: string[];
  setUnlockedStageTypes: (unlockedStageTypes: string[]) => void;
  triggerPopup: (text: string, color?: string) => void;
  levelNumber: number;
  setLevelNumber: (levelNumber: number) => void;
};

export const onNewPuzzle = ({
  setPath,
  setCompletedPaths,
  setNumberOfConnectedColors,
  level,
  size,
  colourCount,
  setLevel,
  setSize,
  setColourCount,
  setPuzzle,
  unlockedStageTypes,
  setUnlockedStageTypes,
  triggerPopup,
  levelNumber,
  setLevelNumber,
}: onNewPuzzleProps) => {
  // play success sfx at volume 50
  const increaseDifficulty = level >= size;

  // reset the puzzle
  setPath({});
  setCompletedPaths({});
  setNumberOfConnectedColors(0);

  let newSize = size;
  let newColourCount = colourCount;

  // Random increase of colours or size

  // If the level number is divisible by 5, and the size is 5 or more, give a breezy level
  if ((levelNumber + 1) % 5 === 0) {
    playSFX("SFX/breeze1.mp3");
    if (levelNumber === 4) {
      triggerPopup("Eazy Breezy!", "blue");
    }
    setLevelNumber(levelNumber + 1);
    const breezySize = Math.min(Math.max(Math.round(size / 2) + 1, 3), 5);
    const breezyColourCount = Math.min(
      Math.max(Math.round(colourCount / 2), 2),
      4
    );
    const { circles, wallTiles } = generatePuzzle(
      breezySize,
      breezyColourCount
    );
    setPuzzle({
      circles,
      size: breezySize,
      wallTiles,
      colorCount: breezyColourCount,
      backgroundColor: "#006399",
      specialTiles: [],
      stageEffects: [],
    });
    return;
  }

  let stageType;

  if (increaseDifficulty && levelNumber < 100) {
    playSFX("SFX/success2.wav");
    setLevel(1);
    if (toAddNewColor({ colourCount, size })) {
      if (colourCount < 19) {
        const newColorColor = colors[colourCount];
        triggerPopup("New Colour!", newColorColor);
        newColourCount = colourCount + 1;
        setColourCount(newColourCount);
      }
    } else {
      if (size < 8) {
        triggerPopup("Bigger Board!");
        newSize = size + 1;
        setSize(newSize);
      }
    }
  } else {
    playSFX("SFX/success1.wav");
    setLevel(level + 1);
    stageType = unlockAStageType({
      levelNumber: levelNumber + 1,
      unlockedStageTypes: unlockedStageTypes,
      setUnlockedStageTypes: setUnlockedStageTypes,
      triggerPopup: triggerPopup,
    });
  }

  if (levelNumber == 100) {
    triggerPopup("Endless Mode Activated!", "green");
    localStorage.setItem("unlockedEndlessMode", "true");
  }
  if (levelNumber >= 100) {
    newSize = Math.floor(Math.random() * 4) + 5;
    newColourCount = Math.floor(Math.random() * (newSize - 1)) + 2;
  }

  setLevelNumber(levelNumber + 1);

  const stageTypes = stageType
    ? [stageType]
    : pickRandomStageType({
        unlockedStageTypes: unlockedStageTypes,
        levelNumber: levelNumber + 1,
      });

  const { circles, wallTiles, specialTiles, stageEffects } = generatePuzzle(
    newSize,
    newColourCount,
    stageTypes
  );
  setPuzzle({
    circles,
    size: newSize,
    wallTiles,
    colorCount: newColourCount,
    backgroundColor: "black",
    specialTiles: specialTiles,
    stageEffects: stageEffects,
  });
};
