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
} from "@chakra-ui/react";
import { GameMode, allStageEffects } from "../types";

type IntroductionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setGameMode: (gameMode: GameMode) => void;
  setUnlockedStageTypes: (unlockedStageTypes: string[]) => void;
};

const IntroductionModal: React.FC<IntroductionModalProps> = ({
  isOpen,
  onClose,
  setGameMode,
  setUnlockedStageTypes,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          It's a simple puzzle game! All you need to do is connect matching
          coloured circles together. Use your mouse to draw a path between the
          circles
        </ModalBody>
        <ModalBody>We reccomend standard mode to start with.</ModalBody>

        <ModalFooter>
          <HStack>
            <Button
              colorScheme="blue"
              onClick={() => {
                setGameMode(GameMode.standard);
                onClose();
              }}
            >
              Standard
            </Button>
            <Button
              colorScheme="green"
              onClick={() => {
                setGameMode(GameMode.classic);
                onClose();
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
                  onClose();
                }}
              >
                Endless
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IntroductionModal;
