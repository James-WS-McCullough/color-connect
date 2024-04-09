import { Box, HStack, Icon, Image, VStack } from "@chakra-ui/react";
import Circle from "./Circle";
import { GridBoxPath, SpecialTile, colors } from "../types";
import { useEffect, useState } from "react";
import { escape } from "querystring";
import { MagicBox } from "../images/magicBox";

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
  bombTimer?: number;
  onSpecialClick?: () => void;
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
  bombTimer,
  onSpecialClick,
}) => {
  const [rotateClass, setRotateClass] = useState("");

  useEffect(() => {
    if (specialTile?.tileType === "rotating-vertical-only") {
      setRotateClass("rotate-horizontal-to-vertical");
    } else if (specialTile?.tileType === "rotating-horizontal-only") {
      setRotateClass("rotate-vertical-to-horizontal");
    }
  }, [specialTile?.tileType]);
  let backgroundColor = "black";
  if (isWallTile) {
    backgroundColor = "gray";
  } else if (stageEffects && stageEffects.includes("summer")) {
    if (path.color) {
      backgroundColor = "#145001";
    } else {
      backgroundColor = "#0F3B01";
    }
  } else if (stageEffects && stageEffects.includes("autumn")) {
    if (path.color) {
      backgroundColor = "#793600";
    } else {
      backgroundColor = "#682700";
    }
  } else if (path.color) {
    backgroundColor = "#303030";
  }
  return (
    <Box
      w="100%"
      h="100%"
      border="1px solid white"
      backgroundColor={backgroundColor}
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
      onMouseDown={(e) => {
        e.preventDefault();
        if (specialTile?.tileType === "summer-switch") {
          onSpecialClick && onSpecialClick();
        } else {
          onMouseDown();
        }
      }}
      onTouchStart={(e) => {
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
      {(specialTile?.tileType === "lock" ||
        specialTile?.tileType === "unlocking") && (
        <Image
          src="lockbox.png"
          w="100%"
          h="100%"
          position="absolute"
          zIndex="0"
          className={
            specialTile?.tileType === "unlocking" ? "lock-disappear" : ""
          }
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
      {(specialTile?.tileType === "rotating-vertical-only" ||
        specialTile?.tileType === "rotating-horizontal-only") && (
        // rotating box image inside the grid box
        <Image
          className={`${rotateClass} active`} // Apply dynamic class
          src="rotatingWall.png"
          w="100%"
          h="100%"
          position="absolute"
          zIndex="1"
        />
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
            onMouseDown={(e) => {
              e.preventDefault();
              onMouseDown();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              onMouseDown();
            }}
          >
            {bombTimer ? bombTimer : "-"}
          </Box>
        </Box>
      )}
      {(specialTile?.tileType === "magic-box-up-left" ||
        specialTile?.tileType === "magic-box-up-right" ||
        specialTile?.tileType === "magic-box-up-down") && (
        // A magic box image inside the grid box
        // <Image
        //   src="MagicBox.png"
        //   w="100%"
        //   h="100%"
        //   position="absolute"
        //   zIndex="0"
        // />
        // <Icon as={MagicBox} w="100%" h="100%" position="absolute" zIndex="0" />
        <MagicBox />
      )}
      {specialTile?.tileType === "summer-switch" && (
        // A switch image inside the grid box
        <Image
          src="summmerSwitch.png"
          w="100%"
          h="100%"
          position="absolute"
          zIndex="0"
        />
      )}

      {stageEffects &&
        stageEffects.includes("summer") &&
        color &&
        !!(colors.indexOf(color) % 2) && (
          // the leafCoverSumer image inside the grid box
          <Image
            src="leafCoverSummer.png"
            w="100%"
            h="100%"
            position="absolute"
            zIndex="2"
          />
        )}

      {stageEffects &&
        stageEffects.includes("autumn") &&
        color &&
        !(colors.indexOf(color) % 2) && (
          // the leafCoverSumer image inside the grid box
          <Image
            src="leafCoverAutumn.png"
            w="100%"
            h="100%"
            position="absolute"
            zIndex="2"
          />
        )}

      {specialTile?.tileType === "painter-box-horizontal" && (
        // A painter box image inside the grid box
        <Image
          src="painterBoxHorizontal.png"
          w="100%"
          h="100%"
          position="absolute"
          zIndex="0"
          backgroundColor={specialTile?.color || "tomato"}
        />
      )}
      {specialTile?.tileType === "painter-box-vertical" && (
        // A painter box image inside the grid box
        <Image
          src="painterBoxVertical.png"
          w="100%"
          h="100%"
          position="absolute"
          zIndex="0"
          backgroundColor={specialTile?.color || "tomato"}
        />
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
