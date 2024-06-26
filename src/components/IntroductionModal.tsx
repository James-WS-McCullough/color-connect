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

type IntroductionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setGameMode: (gameMode: GameMode) => void;
  setUnlockedStageTypes: (unlockedStageTypes: string[]) => void;
  setLevelTimer: (levelTimer: number) => void;
  beginNewPuzzle: () => void;
};

const IntroductionModal: React.FC<IntroductionModalProps> = ({
  isOpen,
  onClose,
  setGameMode,
  setUnlockedStageTypes,
  setLevelTimer,
  beginNewPuzzle,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome!</ModalHeader>
        <ModalBody>
          It's a simple puzzle game! All you need to do is connect matching
          coloured circles together. Use your mouse to draw a path between the
          circles
        </ModalBody>
        <ModalBody>We reccomend standard mode to start with.</ModalBody>

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

export default IntroductionModal;
