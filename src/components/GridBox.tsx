import { Box, HStack, VStack } from "@chakra-ui/react";
import Circle from "./Circle";
import { GridBoxPath } from "../types";

type GridBoxProps = {
  color?: string;
  x: number;
  y: number;
  path: GridBoxPath;
  onMouseDown: () => void;
  onMouseEnter: () => void;
};

const GridBox: React.FC<GridBoxProps> = ({
  color,
  x,
  y,
  path,
  onMouseDown,
  onMouseEnter,
}) => {
  return (
    <Box
      w="80px"
      h="80px"
      border="3px solid white"
      display="flex"
      justifyContent="center"
      alignItems="center"
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown();
      }}
      onMouseEnter={onMouseEnter}
    >
      {color && <Circle color={color} />}

      <VStack spacing="0" width="100%" height="100%">
        <Box
          w="20%"
          h="40%"
          backgroundColor={path.color || "tomato"}
          opacity={path.up ? 1 : 0}
        />
        <HStack spacing="0" height="20%" width="100%">
          <Box
            w="40%"
            h="100%"
            backgroundColor={path.color || "tomato"}
            opacity={path.left ? 1 : 0}
          />

          <Box
            w="20%"
            h="100%"
            backgroundColor={path.color || "tomato"}
            opacity={path.left || path.right || path.up || path.down ? 1 : 0}
          />
          <Box
            w="40%"
            h="100%"
            backgroundColor={path.color || "tomato"}
            opacity={path.right ? 1 : 0}
          />
        </HStack>
        <Box
          w="20%"
          h="40%"
          backgroundColor={path.color || "tomato"}
          opacity={path.down ? 1 : 0}
        />
      </VStack>
    </Box>
  );
};

export default GridBox;
