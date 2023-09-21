import { Box } from "@chakra-ui/react";
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
    </Box>
  );
};

export default GridBox;
