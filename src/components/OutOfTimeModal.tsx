import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { GameMode, allStageEffects, levelTimerStart } from "../types";
import StartGameButtons from "./StartGameButtons";

type OutOfTimeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  levelNumber: number;
  setGameMode: (gameMode: GameMode) => void;
  setUnlockedStageTypes: (unlockedStageTypes: string[]) => void;
  setLevelTimer: (levelTimer: number) => void;
  beginNewPuzzle: () => void;
};

const OutOfTimeModal: React.FC<OutOfTimeModalProps> = ({
  isOpen,
  onClose,
  levelNumber,
  setGameMode,
  setUnlockedStageTypes,
  setLevelTimer,
  beginNewPuzzle,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          color="red.500"
          fontSize="5xl"
          fontWeight="bold"
          textAlign="center"
        >
          Boom!
        </ModalHeader>
        <ModalBody>
          You ran out of time! You were on level {levelNumber}. Try again?
        </ModalBody>

        <ModalFooter justifyContent="center">
          <StartGameButtons
            onCloseModal={onClose}
            setGameMode={setGameMode}
            setUnlockedStageTypes={setUnlockedStageTypes}
            setLevelTimer={setLevelTimer}
            beginNewPuzzle={beginNewPuzzle}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OutOfTimeModal;
