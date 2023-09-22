import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Grid from "./components/Grid";
import {
  Box,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import CongratulationsModal from "./components/CongratulationModal";
import { generatePuzzle } from "./utils/generatePuzzle";
import { GridBoxPath } from "./types";

function App() {
  const [completedPaths, setCompletedPaths] = useState<{
    [key: string]: boolean;
  }>({});
  const [puzzle, setPuzzle] = useState<
    {
      color: string;
      x: number;
      y: number;
    }[]
  >([]);
  const [size, setSize] = useState(3);
  const [colourCount, setColourCount] = useState(1);
  const [path, setPath] = useState<{ [key: string]: GridBoxPath }>({});
  const [wallTiles, setWallTiles] = useState<{ x: number; y: number }[]>([]);
  const [level, setLevel] = useState(1);
  const [levelNumber, setLevelNumber] = useState(1);
  const [numberOfConnectedColors, setNumberOfConnectedColors] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (showPopup) {
      timeoutId = setTimeout(() => {
        setShowPopup(false);
      }, 2000); // Hide the popup after 2 seconds
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [showPopup]);

  const triggerPopup = (text: string) => {
    setPopupText(text);
    setShowPopup(true);
  };

  // when all paths are completed, show a modal
  useEffect(() => {
    // If every path is completed and true, show modal
    if (
      Object.keys(completedPaths).length === colourCount &&
      Object.values(completedPaths).every((v) => v)
    ) {
      onNewPuzzle();
    } else {
      // if the number of connected colors is less than the number of true values in completedPaths, play connect sfx
      if (
        numberOfConnectedColors <
        Object.values(completedPaths).filter((v) => v).length
      ) {
        const filename = "SFX/connect1.wav";
        const success = new Audio(filename);
        success.volume = 0.3;
        success.play();
      }
      setNumberOfConnectedColors(
        Object.values(completedPaths).filter((v) => v).length
      );
    }
  }, [completedPaths]);

  // when start the game, randomset the puzzle
  useEffect(() => {
    const { puzzle, wallTiles } = generatePuzzle(size, colourCount);
    setPuzzle(puzzle);
    setWallTiles(wallTiles);
  }, []);

  const toAddNewColor = ({
    colourCount,
    size,
  }: {
    colourCount: number;
    size: number;
  }) => {
    if (size < 4) {
      return colourCount < size - 1;
    }
    return colourCount <= size;
  };

  const onNewPuzzle = () => {
    // play success sfx at volume 50
    const increaseDifficulty = level >= size;

    const filename = !increaseDifficulty
      ? "SFX/success1.wav"
      : "SFX/success2.wav";
    const success = new Audio(filename);
    success.volume = 0.5;
    success.play();

    // reset the puzzle
    setPath({});
    setCompletedPaths({});
    setNumberOfConnectedColors(0);

    let newSize = size;
    let newColourCount = colourCount;

    // Random increase of colours or size

    if (increaseDifficulty) {
      setLevel(1);
      if (toAddNewColor({ colourCount, size })) {
        triggerPopup("New Colour!");
        newColourCount = colourCount + 1;
        setColourCount(newColourCount);
      } else {
        triggerPopup("Bigger Board!");
        newSize = size + 1;
        setSize(newSize);
      }
    } else {
      setLevel(level + 1);
    }
    setLevelNumber(levelNumber + 1);

    const { puzzle, wallTiles } = generatePuzzle(newSize, newColourCount);
    setPuzzle(puzzle);
    setWallTiles(wallTiles);
  };

  return (
    <VStack>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundColor="black"
        h="100vh"
        w="100vw"
      >
        <Grid
          size={size}
          completedPaths={completedPaths}
          setCompletedPaths={setCompletedPaths}
          puzzle={puzzle}
          path={path}
          setPath={setPath}
          wallTiles={wallTiles}
        />
      </Box>
      <Text
        fontSize="6xl"
        fontFamily="monospace"
        color="white"
        position="absolute" //Top center
        top="3%"
        left="50%"
        transform="translate(-50%, 0)"
      >
        {levelNumber}
      </Text>
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            borderRadius: "10px",
            animation: "grow 1s ease-in-out",
            fontFamily: "monospace",
            fontSize: "4rem",
          }}
        >
          {popupText}
        </div>
      )}

      <style>
        {`
          @keyframes grow {
            0% {
              transform: translate(-50%, -50%) scale(0.5);
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `}
      </style>
    </VStack>
  );
}

export default App;
