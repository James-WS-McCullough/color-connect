import { Box, HStack, VStack } from "@chakra-ui/react";
import Circle from "./Circle";

type GridBoxProps = {
  color?: string;
  x: number;
  y: number;
};

const GridBox: React.FC<GridBoxProps> = ({ color, x, y }) => {
  return (
    <Box
      w="80px"
      h="80px"
      border="3px solid white"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {color && <Circle color={color} />}

      <VStack spacing="0" width="100%" height="100%">
        <Box w="20%" h="40%" backgroundColor="red" />
        <HStack spacing="0" height="20%" width="100%">
          <Box w="40%" h="100%" backgroundColor="red" />
          <Box w="20%" h="100%" backgroundColor="red" />
          <Box w="40%" h="100%" backgroundColor="red" />
        </HStack>
        <Box w="20%" h="40%" backgroundColor="red" />
      </VStack>
    </Box>
  );
};

export default GridBox;
