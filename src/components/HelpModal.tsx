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
  IconButton,
} from "@chakra-ui/react";
import WavesIcon from "@mui/icons-material/Waves";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
  const ModalElements = () => {
    const elementsArray = [];

    elementsArray.push(
      <VStack>
        <Text>
          All you need to do is connect matching coloured circles together. Use
          your mouse to draw a path between the circles.
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
    );

    if (levelNumber >= 5) {
      elementsArray.push(
        <HStack>
          <WavesIcon fontSize="large" />
          <Text>
            Every 5 levels is an <i>easy breezy level</i>. They're a bit easier,
            to give you a break.
          </Text>
        </HStack>
      );
    }

    if (unlockedStageTypes.includes("lock")) {
      elementsArray.push(
        <VStack>
          <Text>
            Some cells can be locked. You need to unlock them by connecting the
            green key circles together.
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
      );
    }

    if (unlockedStageTypes.includes("colour-spesific-tiles")) {
      elementsArray.push(
        <VStack>
          <Text>
            Chroma-Set tiles can only be passed through by the matching color.
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
      );
    }

    if (unlockedStageTypes.includes("direction-spesific-tiles")) {
      elementsArray.push(
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
              specialTile={{
                tileType: "vertical-only",
                x: 0,
                y: 0,
              }}
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
      );
    }

    if (unlockedStageTypes.includes("warp")) {
      elementsArray.push(
        <VStack>
          <Text>
            Warp tiles teleport you to the other warp tile of the same color.
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
      );
    }

    if (unlockedStageTypes.includes("arrow-tiles")) {
      elementsArray.push(
        <VStack>
          <Text>
            Arrow tiles can only be passed through from the direction of the
            arrow.
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
                tileType: "arrow-right",
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
                right: false,
                up: false,
                down: false,
              }}
            />
            <MockGridBox
              specialTile={{
                tileType: "arrow-left",
                x: 0,
                y: 0,
              }}
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
      );
    }

    if (unlockedStageTypes.includes("dark")) {
      elementsArray.push(
        <VStack>
          <Text>
            If a stage is dark, connect the yellow light circles to light the
            stage up.
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
      );
    }

    if (unlockedStageTypes.includes("bomb")) {
      elementsArray.push(
        <VStack>
          <Text>
            If a stage has bombs, you'll need to connect those colours fast
            before it explodes! Leaving these till last is usually best.
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
              specialTile={
                {
                  tileType: "bomb",
                  x: 0,
                  y: 0,
                } as any
              }
            />
            <MockGridBox
              path={{
                color: "red",
                left: true,
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
              specialTile={
                {
                  tileType: "bomb",
                  x: 0,
                  y: 0,
                } as any
              }
            />
          </HStack>
        </VStack>
      );
    }

    if (unlockedStageTypes.includes("magic-box")) {
      elementsArray.push(
        <VStack>
          <Text>
            Magic boxes can be passed into, even by multiple colours, but you
            won't know which direction you'll come out of!
          </Text>
          <VStack height="300px" width="400px" spacing="0">
            <HStack height="100px" width="400px" spacing="0">
              <MockGridBox
                color="blue"
                path={{
                  color: "blue",
                  left: false,
                  right: true,
                  up: false,
                  down: false,
                }}
              />
              <MockGridBox
                path={{
                  color: "blue",
                  left: true,
                  right: false,
                  up: false,
                  down: true,
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
              />
              <MockGridBox
                path={{
                  color: "",
                  left: false,
                  right: false,
                  up: false,
                  down: false,
                }}
              />
            </HStack>
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
                  tileType: "magic-box",
                  x: 0,
                  y: 0,
                }}
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
            <HStack height="100px" width="400px" spacing="0">
              <MockGridBox
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
                  color: "blue",
                  left: false,
                  right: true,
                  up: true,
                  down: false,
                }}
              />
              <MockGridBox
                color="blue"
                path={{
                  color: "blue",
                  left: true,
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
              />
            </HStack>
          </VStack>
        </VStack>
      );
    }

    if (unlockedStageTypes.includes("rotating-tiles")) {
      elementsArray.push(
        <VStack>
          <Text>
            Rotating tiles rotate 90 degrees every time you connect the orange
            path-switch nodes. Leaving a path on a rotating tile locks it in
            place.
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
                tileType: "rotating-horizontal-only",
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
                tileType: "rotating-vertical-only",
                x: 0,
                y: 0,
              }}
              path={{
                color: "",
                left: false,
                right: false,
                up: false,
                down: false,
              }}
            />
            <MockGridBox
              color="orange"
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
      );
    }

    if (unlockedStageTypes.includes("summer")) {
      elementsArray.push(
        <VStack>
          <Text>
            Summer stages have a switch that changes the stage between summer
            and autumn. Leaves will block your sight in both, so toggle between
            them to solve the level.
          </Text>
          <HStack height="100px" width="400px" spacing="0">
            <MockGridBox
              path={{
                color: "",
                left: false,
                right: false,
                up: false,
                down: false,
              }}
              specialTile={
                {
                  tileType: "summer-switch",
                  x: 0,
                  y: 0,
                } as any
              }
            />
            <MockGridBox
              path={{
                color: "red",
                left: false,
                right: false,
                up: false,
                down: false,
              }}
              stageEffects={["summer"]}
            />
            <MockGridBox
              path={{
                color: "red",
                left: false,
                right: false,
                up: false,
                down: false,
              }}
              stageEffects={["autumn"]}
            />
            <MockGridBox
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
      );
    }

    elementsArray.push(<Text>How many levels can you beat? Have fun!</Text>);

    return elementsArray;
  };

  const VerticalListModal = () => {
    return <VStack spacing="50px">{ModalElements()}</VStack>;
  };

  const PerPageModal = () => {
    const [currentPage, setCurrentPage] = React.useState(0);
    const pages = ModalElements().length;
    const page = ModalElements()[currentPage];

    const handleNext = () => {
      setCurrentPage((currentPage + 1) % pages);
    };

    const handlePrev = () => {
      setCurrentPage((currentPage - 1 + pages) % pages);
    };

    return (
      <VStack spacing="50px">
        {page}
        <HStack>
          <IconButton
            aria-label="Previous page"
            isDisabled={currentPage === 0}
            icon={<ArrowBackIcon />}
            onClick={handlePrev}
          />
          <Text>
            {currentPage + 1}/{pages}
          </Text>
          <IconButton
            aria-label="Next page"
            isDisabled={currentPage === pages - 1}
            icon={<ArrowForwardIcon />}
            onClick={handleNext}
          />
        </HStack>
      </VStack>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Help!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {window.innerWidth > 600 ? <VerticalListModal /> : <PerPageModal />}
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
