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

type CongratulationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onReplay: () => void;
};

const CongratulationsModal: React.FC<CongratulationsModalProps> = ({
  isOpen,
  onClose,
  onReplay,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Congratulations!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>You have successfully completed the puzzle!</ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onReplay}>
            Next
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CongratulationsModal;
