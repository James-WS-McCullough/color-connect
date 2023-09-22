import { Box } from "@chakra-ui/react";
import React from "react";

type CircleProps = {
  color: string;
};

const Circle: React.FC<CircleProps> = ({ color }) => {
  return (
    <Box
      position="absolute"
      w="70%"
      h="70%"
      borderRadius="50%"
      backgroundColor={color}
    />
  );
};

export default Circle;
