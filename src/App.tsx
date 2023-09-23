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
import { GridBoxPath, colors, iconColors } from "./types";

function App() {
  const [completedPaths, setCompletedPaths] = useState<{
    [key: string]: boolean;
  }>({});
  const [puzzle, setPuzzle] = useState<{
    circles: {
      color: string;
      x: number;
      y: number;
    }[];
    size: number;
    wallTiles: {
      x: number;
      y: number;
    }[];
    colorCount?: number;
    backgroundColor?: string;
  }>({
    circles: [],
    size: 0,
    colorCount: -1,
    wallTiles: [],
    backgroundColor: "black",
  });
  const [size, setSize] = useState(3);
  const [colourCount, setColourCount] = useState(1);
  const [path, setPath] = useState<{ [key: string]: GridBoxPath }>({});
  const [level, setLevel] = useState(1);
  const [levelNumber, setLevelNumber] = useState(1);
  const [numberOfConnectedColors, setNumberOfConnectedColors] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupColor, setPopupColor] = useState("rgba(0,0,0,0.7)");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (showPopup) {
      timeoutId = setTimeout(() => {
        setShowPopup(false);
      }, 1500); // Hide the popup after 2 seconds
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [showPopup]);

  const triggerPopup = (text: string, color: string = "rgba(0,0,0,0.7)") => {
    setPopupText(text);
    setPopupColor(color);
    setShowPopup(true);
  };

  // when all paths are completed, show a modal
  useEffect(() => {
    // If every the number of completedPaths that are true equals the puzzle.colorCount, then show the modal
    if (
      Object.values(completedPaths).filter((v) => v).length ===
      puzzle.colorCount
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
    const { circles, wallTiles } = generatePuzzle(size, colourCount);
    setPuzzle({
      circles,
      size,
      wallTiles,
      colorCount: colourCount,
      backgroundColor: "black",
    });
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
    return colourCount < size;
  };

  const playSFX = (filename: string) => {
    const success = new Audio(filename);
    success.volume = 0.5;
    success.play();
  };

  const onNewPuzzle = () => {
    // play success sfx at volume 50
    const increaseDifficulty = level >= size;

    // reset the puzzle
    setPath({});
    setCompletedPaths({});
    setNumberOfConnectedColors(0);

    let newSize = size;
    let newColourCount = colourCount;

    // Random increase of colours or size

    // If the level number is divisible by 5, and the size is 5 or more, give a breezy level
    if ((levelNumber + 1) % 5 === 0) {
      playSFX("SFX/breeze1.mp3");
      if (levelNumber === 4) {
        triggerPopup("Eazy Breezy!", "blue");
      }
      setLevelNumber(levelNumber + 1);
      const breezySize = Math.max(Math.round(size / 2) + 1, 3);
      const breezyColourCount = Math.max(Math.round(colourCount / 2), 2);
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
      });
      return;
    }

    if (increaseDifficulty) {
      playSFX("SFX/success2.wav");
      setLevel(1);
      if (toAddNewColor({ colourCount, size })) {
        const newColorColor = colors[colourCount];
        triggerPopup("New Colour!", newColorColor);
        newColourCount = colourCount + 1;
        setColourCount(newColourCount);
      } else {
        triggerPopup("Bigger Board!");
        newSize = size + 1;
        setSize(newSize);
      }
    } else {
      playSFX("SFX/success1.wav");
      setLevel(level + 1);
    }
    setLevelNumber(levelNumber + 1);

    const { circles, wallTiles } = generatePuzzle(newSize, newColourCount);
    setPuzzle({
      circles,
      size: newSize,
      wallTiles,
      colorCount: newColourCount,
      backgroundColor: "black",
    });
  };

  return (
    <VStack>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundColor={puzzle.backgroundColor}
        h="100vh"
        w="100vw"
      >
        <Grid
          size={puzzle.size}
          completedPaths={completedPaths}
          setCompletedPaths={setCompletedPaths}
          circles={puzzle.circles}
          path={path}
          setPath={setPath}
          wallTiles={puzzle.wallTiles}
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
            backgroundColor: popupColor,
            color: iconColors[popupColor as keyof typeof iconColors] || "white",
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
