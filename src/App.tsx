import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Grid from "./components/Grid";
import {
  Box,
  Modal,
  ModalContent,
  ModalOverlay,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import CongratulationsModal from "./components/CongratulationModal";

function App() {
  const [completedPaths, setCompletedPaths] = useState<{
    [key: string]: boolean;
  }>({});
  const {
    isOpen: isCompleteModalOpen,
    onOpen: onCompleteModalOpen,
    onClose: onCompleteModalClose,
  } = useDisclosure();

  // when all paths are completed, show a modal
  React.useEffect(() => {
    if (Object.keys(completedPaths).length === 2) {
      onCompleteModalOpen();
    }
  }, [completedPaths, onCompleteModalOpen]);

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
          size={5}
          completedPaths={completedPaths}
          setCompletedPaths={setCompletedPaths}
          puzzle={[
            { color: "red", x: 0, y: 0 },
            {
              color: "red",
              x: 3,
              y: 3,
            },
            {
              color: "yellow",
              x: 4,
              y: 4,
            },
            {
              color: "yellow",
              x: 0,
              y: 4,
            },
          ]}
        />
      </Box>
      <CongratulationsModal
        isOpen={isCompleteModalOpen}
        onClose={onCompleteModalClose}
        onReplay={() => {
          setCompletedPaths({});
          onCompleteModalClose();
        }}
      />
    </VStack>
  );
}

export default App;
