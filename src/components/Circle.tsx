import { Box } from "@chakra-ui/react";
import React from "react";

type CircleProps = {
  color: string;
};

const Circle: React.FC<CircleProps> = ({ color }) => {
  return (
    <Box
      w="70%"
      h="70%"
      borderRadius="50%"
      backgroundColor={color}
      zIndex={2}
    />
  );
};

export default Circle;
