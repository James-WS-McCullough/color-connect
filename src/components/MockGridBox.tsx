import { Box, HStack, Image, VStack } from "@chakra-ui/react";
import Circle from "./Circle";
import { GridBoxPath, SpecialTile } from "../types";

type MockGridBoxProps = {
  color?: string;
  path: GridBoxPath;
  isWallTile?: boolean;
  specialTile?: SpecialTile;
  stageEffects?: string[];
};

const MockGridBox: React.FC<MockGridBoxProps> = ({
  color,
  path,
  isWallTile = false,
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
      {specialTile?.tileType === "bomb" && (
        // A bomb image inside the grid box
        <Box w="100%" h="100%" position="absolute" zIndex="2">
          <Image
            src="Bomb.png"
            w="70%"
            h="70%"
            position="absolute"
            zIndex="3"
            top="50%"
            left="50%"
            transform="translateY(-50%) translateX(-50%)"
          />
          <Box
            position="absolute"
            w="70%"
            h="70%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            zIndex="4"
            textColor="white"
            fontWeight="bold"
            top="55%"
            left="50%"
            transform="translateY(-50%) translateX(-50%)"
          >
            4
          </Box>
        </Box>
      )}

      {specialTile?.tileType === "magic-box" && (
        // A magic box image inside the grid box
        <Image
          src="MagicBox.png"
          w="100%"
          h="100%"
          position="absolute"
          zIndex="0"
        />
      )}

      {specialTile?.tileType === "rotating-vertical-only" && (
        // rotating box image inside the grid box
        <Image
          src="rotatingWall.png"
          w="100%"
          h="100%"
          position="absolute"
          zIndex="0"
        />
      )}
      {specialTile?.tileType === "rotating-horizontal-only" && (
        // rotating box image inside the grid box, rotated 90 degrees
        <Image
          src="rotatingWall.png"
          w="100%"
          h="100%"
          position="absolute"
          zIndex="0"
          transform="rotate(90deg)"
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

export default MockGridBox;
