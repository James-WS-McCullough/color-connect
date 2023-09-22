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

  // when all paths are completed, show a modal
  useEffect(() => {
    if (Object.keys(completedPaths).length === colourCount) {
      onNewPuzzle();
    }
  }, [completedPaths]);

  // when start the game, randomset the puzzle
  useEffect(() => {
    const { puzzle, wallTiles } = generatePuzzle(size, colourCount);
    setPuzzle(puzzle);
    setWallTiles(wallTiles);
  }, []);

  const onNewPuzzle = () => {
    // reset the puzzle
    setPath({});
    setCompletedPaths({});

    let newSize = size;
    let newColourCount = colourCount;

    // Random increase of colours or size

    if (level >= colourCount + size - 1) {
      setLevel(1);
      if (colourCount < size - 1) {
        newColourCount = colourCount + 1;
        setColourCount(newColourCount);
      } else {
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
    </VStack>
  );
}

export default App;
