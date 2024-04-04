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
  bombTimer: number;
  setBombTimer: React.Dispatch<React.SetStateAction<number>>;
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
  bombTimer,
  setBombTimer,
}) => {
  const [drawing, setDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState<string | null>(null);
  const [prevBox, setPrevBox] = useState<{ x: number; y: number } | null>(null);

  // console log drawing updates
  useEffect(() => {
    console.log("drawing", drawing);
  }, [drawing]);

  // use effect to countdown bomb timer every second when it's above 0
  useEffect(() => {
    if (bombTimer > 0) {
      const interval = setInterval(() => {
        setBombTimer((prev) => prev - 1);

        if (bombTimer === 0) {
          clearInterval(interval);
        }

        if (bombTimer === 1) {
          playSFX("SFX/bomb-boom.wav");
          // Get color of bomb
          const bombTile = specialTiles.find((s) => s.tileType === "bomb");
          console.log("bombTile", bombTile);
          const bombColor = circles.find(
            (c) => c.x === bombTile?.x && c.y === bombTile?.y
          )?.color;
          console.log("bombColor", bombColor);
          // Clear the path with that color
          setPath((prevPath) => {
            const newPath = { ...prevPath };
            Object.keys(newPath).forEach((key) => {
              if (newPath[key].color === bombColor) {
                delete newPath[key];
              }
            });
            return newPath;
          });
          setCompletedPaths((prevCompletedPaths) => ({
            ...prevCompletedPaths,
            [bombColor || "tomato"]: false,
          }));

          // If the user is drawing in that color, stop drawing
          if (currentColor === bombColor) {
            setDrawing(false);
            setCurrentColor(null);
            setPrevBox(null);
          }
        } else {
          playSFX("SFX/bomb-beep.wav");
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [bombTimer]);

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
      e.preventDefault();
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
      // Always square, max at 70vh or 90vw
      width="min(70vh, 90vw)"
      height="min(70vh, 90vw)"
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
            bombTimer={bombTimer}
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
                setBombTimer,
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
