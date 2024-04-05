import React from "react";
import { Button, HStack, VStack } from "@chakra-ui/react";
import { GameMode, allStageEffects, levelTimerStart } from "../types";

type StartGameButtonsProps = {
  onCloseModal: () => void;
  setGameMode: (gameMode: GameMode) => void;
  setUnlockedStageTypes: (unlockedStageTypes: string[]) => void;
  setLevelTimer: (levelTimer: number) => void;
  beginNewPuzzle: () => void;
};

const StartGameButtons: React.FC<StartGameButtonsProps> = ({
  onCloseModal,
  setGameMode,
  setUnlockedStageTypes,
  setLevelTimer,
  beginNewPuzzle,
}) => {
  return (
    <VStack>
      <HStack>
        <Button
          colorScheme="blue"
          onClick={() => {
            setGameMode(GameMode.standard);
            setUnlockedStageTypes([]);

            beginNewPuzzle();
            onCloseModal();
          }}
        >
          Standard
        </Button>
        <Button
          colorScheme="green"
          onClick={() => {
            setGameMode(GameMode.classic);
            setUnlockedStageTypes([]);

            beginNewPuzzle();
            onCloseModal();
          }}
        >
          Classic
        </Button>
        {localStorage.getItem("unlockedEndlessMode") === "true" && (
          <Button
            colorScheme="red"
            onClick={() => {
              setGameMode(GameMode.endless);
              setUnlockedStageTypes(allStageEffects);

              beginNewPuzzle();
              onCloseModal();
            }}
          >
            Endless
          </Button>
        )}
      </HStack>
      <HStack>
        <Button
          colorScheme="purple"
          onClick={() => {
            setLevelTimer(levelTimerStart);
            setGameMode(GameMode.standard);
            setUnlockedStageTypes([]);

            beginNewPuzzle();
            onCloseModal();
          }}
        >
          ⏱️ Standard
        </Button>
        <Button
          colorScheme="orange"
          onClick={() => {
            setLevelTimer(levelTimerStart);
            setGameMode(GameMode.classic);
            setUnlockedStageTypes([]);

            beginNewPuzzle();
            onCloseModal();
          }}
        >
          ⏱️ Classic
        </Button>
        {localStorage.getItem("unlockedEndlessMode") === "true" && (
          <Button
            colorScheme="yellow"
            onClick={() => {
              setLevelTimer(levelTimerStart);
              setGameMode(GameMode.endless);
              setUnlockedStageTypes(allStageEffects);

              beginNewPuzzle();
              onCloseModal();
            }}
          >
            ⏱️ Endless
          </Button>
        )}
      </HStack>
    </VStack>
  );
};

export default StartGameButtons;
