import { Box, HStack, Image, VStack } from "@chakra-ui/react";
import Circle from "./Circle";
import { GridBoxPath, SpecialTile } from "../types";

type GridBoxProps = {
  color?: string;
  x: number;
  y: number;
  path: GridBoxPath;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  isWallTile: boolean;
  specialTile?: SpecialTile;
  stageEffects?: string[];
};

const GridBox: React.FC<GridBoxProps> = ({
  color,
  x,
  y,
  path,
  onMouseDown,
  onMouseEnter,
  isWallTile,
  specialTile,
  stageEffects,
}) => {
  return (
    <Box
      w="100%"
      h="100%"
      border="1px solid white"
      backgroundColor={isWallTile ? "gray" : path.color ? "#303030" : "black"}
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown();
      }}
      onMouseEnter={onMouseEnter}
    >
      {color && (
        <Circle
          color={
            stageEffects && stageEffects.includes("dark") && color != "yellow"
              ? "gray"
              : color
          }
        />
      )}
      {specialTile?.tileType === "warp" && (
        // The image is under the other coloured boxes
        <Image
          src="warpPoint.png"
          w="70%"
          h="70%"
          position="absolute"
          // The image is under the other coloured boxes
          zIndex="0"
          animation="spin 5s linear infinite"
        />
      )}
      {specialTile?.tileType === "lock" && (
        <Image
          src="lockbox.png"
          w="100%"
          h="100%"
          position="absolute"
          zIndex="0"
        />
      )}
      {specialTile?.tileType === "arrow-up" && (
        <Image
          src="arrowTiles.png"
          w="100%"
          h="100%"
          position="absolute"
          zIndex="0"
        />
      )}
      {specialTile?.tileType === "arrow-down" && (
        <Image
          src="arrowTiles.png"
          w="100%"
          h="100%"
          position="absolute"
          transform="rotate(180deg)"
          zIndex="0"
        />
      )}
      {specialTile?.tileType === "arrow-left" && (
        <Image
          src="arrowTiles.png"
          w="100%"
          h="100%"
          position="absolute"
          transform="rotate(270deg)"
          zIndex="0"
        />
      )}
      {specialTile?.tileType === "arrow-right" && (
        <Image
          src="arrowTiles.png"
          w="100%"
          h="100%"
          position="absolute"
          transform="rotate(90deg)"
          zIndex="0"
        />
      )}
      {specialTile?.tileType === "colour-specific" && (
        // A diamond inside the grid box with the colour of the specialTile.color
        <Box
          position="absolute"
          w="40%"
          h="40%"
          transform="rotate(45deg)"
          backgroundColor={specialTile?.color || "tomato"}
          zIndex="1"
        />
      )}
      {specialTile?.tileType === "vertical-only" && (
        // Gray walls either side of the grid box
        <HStack
          justifyContent="space-between"
          height="100%"
          width="100%"
          position="absolute"
          zIndex="0"
        >
          <Box
            w="40%"
            h="100%"
            backgroundColor={"gray"}
            opacity={1}
            zIndex="1"
          />
          <Box
            w="40%"
            h="100%"
            backgroundColor={"gray"}
            opacity={1}
            zIndex="1"
          />
        </HStack>
      )}

      {specialTile?.tileType === "horizontal-only" && (
        // Gray walls either side of the grid box
        <VStack
          justifyContent="space-between"
          height="100%"
          width="100%"
          position="absolute"
          zIndex="0"
        >
          <Box
            w="100%"
            h="40%"
            backgroundColor={"gray"}
            opacity={1}
            zIndex="1"
          />
          <Box
            w="100%"
            h="40%"
            backgroundColor={"gray"}
            opacity={1}
            zIndex="1"
          />
        </VStack>
      )}

      <VStack spacing="0" width="100%" height="100%">
        <Box
          w="20%"
          h="40%"
          backgroundColor={
            stageEffects &&
            stageEffects.includes("dark") &&
            path.color != "yellow"
              ? "gray"
              : path.color || "tomato"
          }
          opacity={path.up ? 1 : 0}
          zIndex="1"
        />
        <HStack spacing="0" height="20%" width="100%">
          <Box
            w="40%"
            h="100%"
            backgroundColor={
              stageEffects &&
              stageEffects.includes("dark") &&
              path.color != "yellow"
                ? "gray"
                : path.color || "tomato"
            }
            opacity={path.left ? 1 : 0}
            zIndex="1"
          />

          <Box
            w="20%"
            h="100%"
            backgroundColor={
              stageEffects &&
              stageEffects.includes("dark") &&
              path.color != "yellow"
                ? "gray"
                : path.color || "tomato"
            }
            opacity={path.color ? 1 : 0}
            // borderRadius is 50 only opposite sides are true
            // If just 1 true, then 2 corners are rounded
            // If 2 true, then 1 corner is rounded
            borderRadius={
              path.left && !path.down && !path.up && !path.right
                ? "0% 50% 50% 0%"
                : !path.left && path.down && !path.up && !path.right
                ? "50% 50% 0% 0%"
                : !path.left && !path.down && path.up && !path.right
                ? "0% 0% 50% 50%"
                : !path.left && !path.down && !path.up && path.right
                ? "50% 0 0 50%"
                : path.left && path.down && !path.up && !path.right
                ? "0% 50% 0% 0%"
                : !path.left && path.down && !path.up && path.right
                ? "50% 0% 0% 0%"
                : !path.left && !path.down && path.up && path.right
                ? "0% 0% 0% 50%"
                : path.left && !path.down && path.up && !path.right
                ? "0% 0% 50% 0%"
                : !path.left && !path.down && !path.up && !path.right
                ? "50%"
                : "0%"
            }
            zIndex="1"
          />
          <Box
            w="40%"
            h="100%"
            backgroundColor={
              stageEffects &&
              stageEffects.includes("dark") &&
              path.color != "yellow"
                ? "gray"
                : path.color || "tomato"
            }
            opacity={path.right ? 1 : 0}
            zIndex="1"
          />
        </HStack>
        <Box
          w="20%"
          h="40%"
          backgroundColor={
            stageEffects &&
            stageEffects.includes("dark") &&
            path.color != "yellow"
              ? "gray"
              : path.color || "tomato"
          }
          opacity={path.down ? 1 : 0}
          zIndex="1"
        />
      </VStack>
    </Box>
  );
};

export default GridBox;
