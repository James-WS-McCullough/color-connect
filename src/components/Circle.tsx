import { Box } from "@chakra-ui/react";
import React from "react";

type CircleProps = {
  color: string;
};

const Circle: React.FC<CircleProps> = ({ color }) => {
  return (
    <Box
      position="absolute"
      w="60px"
      h="60px"
      borderRadius="50%"
      backgroundColor={color}
      zIndex={2}
    />
  );
};

export default Circle;
