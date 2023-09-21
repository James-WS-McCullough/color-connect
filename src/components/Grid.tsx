import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import GridBox from "./GridBox";

type GridProps = {
  size: number;
  puzzle: { color: string; x: number; y: number }[];
};

const Grid: React.FC<GridProps> = ({ size, puzzle }) => {
  return (
    <Box
      position="relative"
      display="grid"
      gridTemplateColumns={`repeat(${size}, 1fr)`}
    >
      {Array.from({ length: size * size }, (_, index) => {
        const row = Math.floor(index / size);
        const col = index % size;
        const circleData = puzzle.find((p) => p.x === col && p.y === row);
        return (
          <GridBox key={index} color={circleData?.color} x={col} y={row} />
        );
      })}
    </Box>
  );
};

export default Grid;
