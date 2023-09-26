import { useEffect, useState } from "react";
import "./App.css";
import Grid from "./components/Grid";
import { Box, IconButton, Text, VStack, useDisclosure } from "@chakra-ui/react";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { generatePuzzle } from "./utils/generatePuzzle";
import {
  ColourPoint,
  GridBoxPath,
  Point,
  SpecialTile,
  colors,
  iconColors,
} from "./types";
import IntroductionModal from "./components/IntroductionModal";
import { playSFX } from "./utils/playSFX";
import HelpModal from "./components/HelpModal";
import { unlockAStageType } from "./utils/unlockAStageType";
import { toAddNewColor } from "./utils/toAddNewColour";
import { pickRandomStageType } from "./utils/pickRandomStageType";
import { onNewPuzzle } from "./utils/onNewPuzzle";

function App() {
  const [completedPaths, setCompletedPaths] = useState<{
    [key: string]: boolean;
  }>({});
  const [puzzle, setPuzzle] = useState<{
    circles: ColourPoint[];
    size: number;
    wallTiles: Point[];
    specialTiles: SpecialTile[];
    stageEffects: string[];
    colorCount?: number;
    backgroundColor?: string;
  }>({
    circles: [],
    size: 0,
    colorCount: -1,
    wallTiles: [],
    specialTiles: [],
    backgroundColor: "black",
    stageEffects: [],
  });
  const [size, setSize] = useState(3);
  const [colourCount, setColourCount] = useState(1);
  const [path, setPath] = useState<{ [key: string]: GridBoxPath }>({});
  const [level, setLevel] = useState(1);
  const [levelNumber, setLevelNumber] = useState(1);
  const [numberOfConnectedColors, setNumberOfConnectedColors] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [unlockedStageTypes, setUnlockedStageTypes] = useState<string[]>([]);
  const [popupColor, setPopupColor] = useState("rgba(0,0,0,0.7)");
  const {
    isOpen: isIntroModalOpen,
    onOpen: onIntroModalOpen,
    onClose: onIntroModalClose,
  } = useDisclosure();
  const {
    isOpen: isHelpModalOpen,
    onOpen: onHelpModalOpen,
    onClose: onHelpModalClose,
  } = useDisclosure();

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
      onNewPuzzle({
        setPath,
        setCompletedPaths,
        setNumberOfConnectedColors,
        level,
        size,
        colourCount,
        setLevel,
        setSize,
        setColourCount,
        setPuzzle,
        unlockedStageTypes,
        setUnlockedStageTypes,
        triggerPopup,
        levelNumber,
        setLevelNumber,
      });
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
      specialTiles: [],
      stageEffects: [],
    });
    onIntroModalOpen();
  }, []);

  const startEndlessMode = () => {
    // Set level number to 100
    setLevelNumber(100);
    // Unlock all stage types
    setUnlockedStageTypes([
      "lock",
      "colour-spesific-tiles",
      "direction-spesific-tiles",
      "warp",
      "arrow-tiles",
      "dark",
    ]);
    // trigger onnewpuzzle
    onNewPuzzle({
      setPath,
      setCompletedPaths,
      setNumberOfConnectedColors,
      level,
      size,
      colourCount,
      setLevel,
      setSize,
      setColourCount,
      setPuzzle,
      unlockedStageTypes,
      setUnlockedStageTypes,
      triggerPopup,
      levelNumber: 100,
      setLevelNumber,
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
          specialTiles={puzzle.specialTiles}
          setPuzzle={setPuzzle}
          stageEffects={puzzle.stageEffects}
          isHelpModalOpen={isHelpModalOpen}
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
            zIndex: 100,
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
      <IntroductionModal
        isOpen={isIntroModalOpen}
        onClose={onIntroModalClose}
      />
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={onHelpModalClose}
        unlockedStageTypes={unlockedStageTypes}
        levelNumber={levelNumber}
        startEndlessMode={startEndlessMode}
      />
      <IconButton
        aria-label="Help"
        colorScheme="blue"
        icon={<HelpCenterIcon />}
        position="absolute" //Bottom right
        bottom="3%"
        right="3%"
        onClick={onHelpModalOpen}
      />
      {
        // Only if on localhost, show the refresh button
        window.location.hostname === "localhost" && (
          <IconButton
            aria-label="Skip"
            colorScheme="blue"
            icon={<SkipNextIcon />}
            position="absolute" //Bottom left
            bottom="3%"
            left="3%"
            onClick={() => {
              onNewPuzzle({
                setPath,
                setCompletedPaths,
                setNumberOfConnectedColors,
                level,
                size,
                colourCount,
                setLevel,
                setSize,
                setColourCount,
                setPuzzle,
                unlockedStageTypes,
                setUnlockedStageTypes,
                triggerPopup,
                levelNumber,
                setLevelNumber,
              });
            }}
          />
        )
      }
    </VStack>
  );
}

export default App;
