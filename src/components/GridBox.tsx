import { Box, HStack, Image, VStack } from "@chakra-ui/react";
import Circle from "./Circle";
import { GridBoxPath } from "../types";

type GridBoxProps = {
  color?: string;
  x: number;
  y: number;
  path: GridBoxPath;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  isWallTile: boolean;
  specialTileType?: string;
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
  specialTileType,
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
      {specialTileType === "warp" && (
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
      {specialTileType === "lock" && (
        <Image
          src="lockbox.png"
          w="100%"
          h="100%"
          position="absolute"
          zIndex="0"
        />
      )}

      <VStack spacing="0" width="100%" height="100%">
        <Box
          w="20%"
          h="40%"
          backgroundColor={path.color || "tomato"}
          opacity={path.up ? 1 : 0}
          zIndex="1"
        />
        <HStack spacing="0" height="20%" width="100%">
          <Box
            w="40%"
            h="100%"
            backgroundColor={path.color || "tomato"}
            opacity={path.left ? 1 : 0}
            zIndex="1"
          />

          <Box
            w="20%"
            h="100%"
            backgroundColor={path.color || "tomato"}
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
            backgroundColor={path.color || "tomato"}
            opacity={path.right ? 1 : 0}
            zIndex="1"
          />
        </HStack>
        <Box
          w="20%"
          h="40%"
          backgroundColor={path.color || "tomato"}
          opacity={path.down ? 1 : 0}
          zIndex="1"
        />
      </VStack>
    </Box>
  );
};

export default GridBox;
