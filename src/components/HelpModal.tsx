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
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";
import GridBox from "./GridBox";
import MockGridBox from "./MockGridBox";

type HelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  unlockedStageTypes: string[];
  levelNumber: number;
};

const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  unlockedStageTypes,
  levelNumber,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Help!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="50px">
            <VStack>
              <Text>
                All you need to do is connect matching coloured circles
                together. Use your mouse to draw a path between the circles.
              </Text>
              <HStack height="100px" width="400px" spacing="0">
                <MockGridBox
                  color="red"
                  path={{
                    color: "red",
                    left: false,
                    right: true,
                    up: false,
                    down: false,
                  }}
                />
                <MockGridBox
                  path={{
                    color: "red",
                    left: true,
                    right: true,
                    up: false,
                    down: false,
                  }}
                />
                <MockGridBox
                  path={{
                    color: "red",
                    left: true,
                    right: true,
                    up: false,
                    down: false,
                  }}
                />
                <MockGridBox
                  color="red"
                  path={{
                    color: "red",
                    left: true,
                    right: false,
                    up: false,
                    down: false,
                  }}
                />
              </HStack>
            </VStack>
            {levelNumber >= 5 && (
              <Text>
                Every 5 levels is a easy breezy level. They're a bit easier, to
                give you a break.
              </Text>
            )}
            {unlockedStageTypes.includes("lock") && (
              <VStack>
                <Text>
                  Some cells can be locked. You need to unlock them by
                  connecting the green key circles together.
                </Text>
                <HStack height="100px" width="400px" spacing="0">
                  <MockGridBox
                    color="green"
                    path={{
                      color: "green",
                      left: false,
                      right: true,
                      up: false,
                      down: false,
                    }}
                  />
                  <MockGridBox
                    path={{
                      color: "green",
                      left: true,
                      right: false,
                      up: false,
                      down: false,
                    }}
                  />
                  <MockGridBox
                    color="green"
                    path={{
                      color: "",
                      left: false,
                      right: false,
                      up: false,
                      down: false,
                    }}
                  />
                  <MockGridBox
                    path={{
                      color: "",
                      left: false,
                      right: false,
                      up: false,
                      down: false,
                    }}
                    specialTile={{
                      tileType: "lock",
                      x: 0,
                      y: 0,
                    }}
                  />
                </HStack>
              </VStack>
            )}
            {unlockedStageTypes.includes("colour-spesific-tiles") && (
              <VStack>
                <Text>
                  Chroma-Set tiles can only be passed through by the matching
                  color.
                </Text>
                <HStack height="100px" width="400px" spacing="0">
                  <MockGridBox
                    color="red"
                    path={{
                      color: "red",
                      left: false,
                      right: true,
                      up: false,
                      down: false,
                    }}
                  />
                  <MockGridBox
                    specialTile={{
                      tileType: "colour-specific",
                      color: "red",
                      x: 0,
                      y: 0,
                    }}
                    path={{
                      color: "red",
                      left: true,
                      right: true,
                      up: false,
                      down: false,
                    }}
                  />
                  <MockGridBox
                    path={{
                      color: "red",
                      left: true,
                      right: true,
                      up: false,
                      down: false,
                    }}
                  />
                  <MockGridBox
                    color="red"
                    path={{
                      color: "red",
                      left: true,
                      right: false,
                      up: false,
                      down: false,
                    }}
                  />
                </HStack>
              </VStack>
            )}
            {unlockedStageTypes.includes("warp") && (
              <VStack>
                <Text>
                  Warp tiles teleport you to the other warp tile of the same
                  color.
                </Text>
                <HStack height="100px" width="400px" spacing="0">
                  <MockGridBox
                    color="red"
                    path={{
                      color: "red",
                      left: false,
                      right: true,
                      up: false,
                      down: false,
                    }}
                  />
                  <MockGridBox
                    specialTile={{
                      tileType: "warp",
                      x: 0,
                      y: 0,
                    }}
                    path={{
                      color: "red",
                      left: true,
                      right: false,
                      up: false,
                      down: false,
                    }}
                  />
                  <MockGridBox
                    specialTile={{
                      tileType: "warp",
                      x: 0,
                      y: 0,
                    }}
                    path={{
                      color: "red",
                      left: false,
                      right: true,
                      up: false,
                      down: false,
                    }}
                  />
                  <MockGridBox
                    color="red"
                    path={{
                      color: "red",
                      left: true,
                      right: false,
                      up: false,
                      down: false,
                    }}
                  />
                </HStack>
              </VStack>
            )}
            {unlockedStageTypes.includes("dark") && (
              <VStack>
                <Text>
                  If a stage is dark, connect the yellow light circles to light
                  the stage up.
                </Text>
                <HStack height="100px" width="400px" spacing="0">
                  <MockGridBox
                    color="yellow"
                    path={{
                      color: "yellow",
                      left: false,
                      right: true,
                      up: false,
                      down: false,
                    }}
                  />
                  <MockGridBox
                    path={{
                      color: "yellow",
                      left: true,
                      right: false,
                      up: false,
                      down: false,
                    }}
                  />
                  <MockGridBox
                    color="yellow"
                    path={{
                      color: "",
                      left: false,
                      right: false,
                      up: false,
                      down: false,
                    }}
                  />
                  <MockGridBox
                    color="gray"
                    path={{
                      color: "",
                      left: false,
                      right: false,
                      up: false,
                      down: false,
                    }}
                  />
                </HStack>
              </VStack>
            )}
            {unlockedStageTypes.includes("direction-spesific-tiles") && (
              <VStack>
                <Text>
                  Directional tiles can only be passed through from the correct
                  direction.
                </Text>
                <HStack height="100px" width="400px" spacing="0">
                  <MockGridBox
                    color="red"
                    path={{
                      color: "red",
                      left: false,
                      right: true,
                      up: false,
                      down: false,
                    }}
                  />
                  <MockGridBox
                    path={{
                      color: "red",
                      left: true,
                      right: true,
                      up: false,
                      down: false,
                    }}
                  />
                  <MockGridBox
                    specialTile={{
                      tileType: "horizontal-only",
                      x: 0,
                      y: 0,
                    }}
                    path={{
                      color: "red",
                      left: true,
                      right: false,
                      up: false,
                      down: false,
                    }}
                  />
                  <MockGridBox
                    color="red"
                    path={{
                      color: "",
                      left: false,
                      right: false,
                      up: false,
                      down: false,
                    }}
                  />
                </HStack>
              </VStack>
            )}
            <Text>How many levels can you beat? Have fun!</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Resume
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HelpModal;
