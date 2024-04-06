import {
  GameMode,
  GridBoxPath,
  allStageEffects,
  colors,
  levelTimerStart,
  worlds,
} from "../types";
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
  gameMode: GameMode;
  setGameMode: (gameMode: GameMode) => void;
  setBombTimer: (bombTimer: number) => void;
  levelTimer: number;
  setLevelTimer: (levelTimer: number) => void;
  worldNumber: number;
  setWorldNumber: (worldNumber: number) => void;
  worldLevelNumber: number;
  setWorldLevelNumber: (worldLevelNumber: number) => void;
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
  gameMode,
  setGameMode,
  setBombTimer,
  levelTimer,
  setLevelTimer,
  worldNumber,
  setWorldNumber,
  worldLevelNumber,
  setWorldLevelNumber,
}: onNewPuzzleProps) => {
  // play success sfx at volume 50
  const increaseDifficulty = level >= size;

  // reset the puzzle
  setPath({});
  setCompletedPaths({});
  setNumberOfConnectedColors(0);
  setBombTimer(0);
  if (levelTimer) {
    setLevelTimer(levelTimerStart);
  }
  if (gameMode === GameMode.adventure) {
    setWorldLevelNumber(worldLevelNumber + 1);
  }

  let newSize = size;
  let newColourCount = colourCount;

  // Random increase of colours or size

  // If the level number is divisible by 5, and the size is 5 or more, give a breezy level
  if ((levelNumber + 1) % 5 === 0) {
    playSFX("SFX/breeze1.mp3");
    if (levelNumber === 4) {
      if (gameMode !== GameMode.adventure) {
        triggerPopup("Eazy Breezy!", "blue");
      }
    }
    setLevelNumber(levelNumber + 1);
    if (gameMode === GameMode.endless) {
      newSize = Math.floor(Math.random() * 3) + 5;
      newColourCount =
        Math.floor(Math.random() * (newSize - 1)) + Math.max(2, newSize - 3);
    }
    const breezySize = Math.min(Math.max(Math.round(newSize / 2) + 1, 3), 5);
    const breezyColourCount = Math.min(
      Math.max(Math.round(newColourCount / 2), 2),
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
  if (
    (gameMode === GameMode.standard ||
      gameMode === GameMode.classic ||
      gameMode === GameMode.adventure) &&
    increaseDifficulty
  ) {
    if (gameMode === GameMode.adventure) {
      if (worldLevelNumber >= 20) {
        playSFX("SFX/success2.wav");
      } else {
        playSFX("SFX/success1.wav");
      }
    } else {
      playSFX("SFX/success2.wav");
    }
    setLevel(1);
    if (toAddNewColor({ colourCount, size })) {
      if (colourCount < 19) {
        const newColorColor = colors[colourCount];
        if (gameMode !== GameMode.adventure) {
          triggerPopup("New Colour!", newColorColor);
        }
        newColourCount = colourCount + 1;
        setColourCount(newColourCount);
      }
    } else {
      if (size < 7) {
        if (gameMode !== GameMode.adventure) {
          triggerPopup("Bigger Board!");
        }
        newSize = size + 1;
        setSize(newSize);
      }
    }
  } else {
    if (gameMode === GameMode.adventure) {
      if (worldLevelNumber >= 20) {
        playSFX("SFX/success2.wav");
      } else {
        playSFX("SFX/success1.wav");
      }
    } else {
      playSFX("SFX/success1.wav");
    }
    setLevel(level + 1);
    if (gameMode === GameMode.standard) {
      stageType = unlockAStageType({
        levelNumber: levelNumber + 1,
        unlockedStageTypes: unlockedStageTypes,
        setUnlockedStageTypes: setUnlockedStageTypes,
        triggerPopup: triggerPopup,
      });
    }
  }

  if (gameMode === GameMode.adventure) {
    if (worldLevelNumber >= 20) {
      setWorldNumber(worldNumber + 1);
      setWorldLevelNumber(1);
      const newWorld = worldNumber + 1;
      const worldData = worlds[worldNumber];
      if (!worldData) {
        triggerPopup("You've completed all the worlds!", "green");
        localStorage.setItem("worldNumberReached", "1");
        setGameMode(GameMode.endless);
        setUnlockedStageTypes(allStageEffects);
        const { circles, wallTiles, specialTiles, stageEffects } =
          generatePuzzle(5, 3, []);
        setPuzzle({
          circles: circles,
          size: 0,
          wallTiles: wallTiles,
          colorCount: 0,
          specialTiles: specialTiles,
          stageEffects: stageEffects,
          backgroundColor: "black",
        });
        return;
      }
      triggerPopup(`World ${newWorld}!`, worldData.backgroundColour || "green");
      setSize(worldData.startingSize);
      setColourCount(worldData.startingColors);
      setLevelNumber(levelNumber + 1);

      localStorage.setItem("worldNumberReached", newWorld.toString());

      const { circles, wallTiles, specialTiles, stageEffects } = generatePuzzle(
        worldData.startingSize,
        worldData.startingColors,
        worldData.effects
      );
      setPuzzle({
        circles,
        size: worldData.startingSize,
        wallTiles,
        colorCount: worldData.startingColors,
        specialTiles: specialTiles,
        stageEffects: stageEffects,
        backgroundColor: worldData.backgroundColour,
      });
      return;
    }
  }

  if (gameMode !== GameMode.endless) {
    if (levelNumber == 100) {
      triggerPopup("Endless Mode Activated!", "green");
      setGameMode(GameMode.endless);
      if (gameMode === GameMode.standard) {
        localStorage.setItem("unlockedEndlessMode", "true");
      }
    }
  }

  if (gameMode === GameMode.endless) {
    newSize = Math.floor(Math.random() * 3) + 5;
    newColourCount =
      Math.floor(Math.random() * (newSize - 1)) + Math.max(2, newSize - 3);
  }

  setLevelNumber(levelNumber + 1);

  let stageTypes = [] as string[];
  let backgroundColor = "black";

  if (gameMode === GameMode.adventure) {
    backgroundColor = worlds[worldNumber - 1].backgroundColour || "black";
  }

  if (stageType) {
    stageTypes = [stageType];
  } else if (gameMode === GameMode.adventure) {
    stageTypes = worlds[worldNumber - 1].effects;
  } else {
    stageTypes = pickRandomStageType({
      unlockedStageTypes: unlockedStageTypes,
      levelNumber: levelNumber + 1,
      gameMode,
    });
  }

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
    backgroundColor: backgroundColor,
    specialTiles: specialTiles,
    stageEffects: stageEffects,
  });
};
