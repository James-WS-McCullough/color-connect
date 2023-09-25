import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import GridBox from "./GridBox";
import { ColourPoint, GridBoxPath, Point, SpecialTile } from "../types";
import { playSFX } from "../utils/playSFX";
import { invalidMoveCheck } from "../utils/test/invalidMoveCheck";
import { startDrawing } from "../utils/startDrawing";
import { stopDrawing } from "../utils/stopDrawing";
import { handleMouseEnter } from "../handlers/handleMouseEnter";

type GridProps = {
  size: number;
  circles: ColourPoint[];
  completedPaths: { [key: string]: boolean };
  setCompletedPaths: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  path: { [key: string]: GridBoxPath };
  setPath: React.Dispatch<React.SetStateAction<{ [key: string]: GridBoxPath }>>;
  wallTiles: Point[];
  specialTiles: SpecialTile[];
  setPuzzle: React.Dispatch<
    React.SetStateAction<{
      circles: ColourPoint[];
      size: number;
      wallTiles: Point[];
      specialTiles: SpecialTile[];
      stageEffects: string[];
      colorCount?: number;
      backgroundColor?: string;
    }>
  >;
  stageEffects: string[];
  isHelpModalOpen?: boolean;
};

const Grid: React.FC<GridProps> = ({
  size,
  circles,
  completedPaths,
  setCompletedPaths,
  path,
  setPath,
  wallTiles,
  specialTiles,
  setPuzzle,
  stageEffects,
  isHelpModalOpen,
}) => {
  const [drawing, setDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState<string | null>(null);
  const [prevBox, setPrevBox] = useState<{ x: number; y: number } | null>(null);
  // console log drawing updates
  useEffect(() => {
    console.log("drawing", drawing);
  }, [drawing]);

  useEffect(() => {
    const handleMouseUp = () => {
      stopDrawing({ setDrawing });
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [stopDrawing]);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isHelpModalOpen) e.preventDefault();
    };
    // Add non-passive event listener
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <Box
      position="relative"
      height="70vh"
      width="70vh"
      display="grid"
      gridTemplateColumns={`repeat(${size}, 1fr)`}
      onMouseLeave={() => {
        stopDrawing({ setDrawing });
      }}
      onTouchCancel={() => {
        stopDrawing({ setDrawing });
      }}
      onTouchMove={(e) => {
        // Touch coordinates
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;

        // Grid bounding box
        const boundingBox = e.currentTarget.getBoundingClientRect();

        // Calculate cell width and height
        const cellWidth = boundingBox.width / size;
        const cellHeight = boundingBox.height / size;

        // Calculate touched cell's x and y
        const col = Math.floor((touchX - boundingBox.left) / cellWidth);
        const row = Math.floor((touchY - boundingBox.top) / cellHeight);

        // Check if the calculated indices are within the grid boundaries
        if (col >= 0 && col < size && row >= 0 && row < size) {
          // Call the handleMouseEnter function for the touched cell
          handleMouseEnter({
            x: col,
            y: row,
            drawing,
            prevBox,
            circles,
            currentColor,
            wallTiles,
            specialTiles,
            path,
            setDrawing,
            setPath,
            setCompletedPaths,
            stageEffects,
            setPuzzle,
            setPrevBox,
          });
        }
      }}
    >
      {Array.from({ length: size * size }, (_, index) => {
        const row = Math.floor(index / size);
        const col = index % size;
        const circleData = circles.find((p) => p.x === col && p.y === row);
        return (
          <GridBox
            key={index}
            color={circleData?.color}
            x={col}
            y={row}
            stageEffects={stageEffects}
            path={
              path[`${col},${row}`] || {
                up: false,
                down: false,
                left: false,
                right: false,
              }
            }
            onMouseDown={() =>
              startDrawing({
                x: col,
                y: row,
                circles,
                specialTiles,
                stageEffects,
                path,
                setPath,
                setCompletedPaths,
                setDrawing,
                setCurrentColor,
                setPrevBox,
              })
            }
            onMouseEnter={() =>
              handleMouseEnter({
                x: col,
                y: row,
                drawing,
                prevBox,
                circles,
                currentColor,
                wallTiles,
                specialTiles,
                path,
                setDrawing,
                setPath,
                setCompletedPaths,
                stageEffects,
                setPuzzle,
                setPrevBox,
              })
            }
            isWallTile={wallTiles.some((w) => w.x === col && w.y === row)}
            specialTile={specialTiles.find((s) => s.x === col && s.y === row)}
          />
        );
      })}
    </Box>
  );
};

export default Grid;
