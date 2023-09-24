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
} from "@chakra-ui/react";

type IntroductionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const IntroductionModal: React.FC<IntroductionModalProps> = ({
  isOpen,
  onClose,
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
          circles.
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Start
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IntroductionModal;
