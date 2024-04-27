import { Box, HStack, Icon, Image, VStack } from "@chakra-ui/react";
import Circle from "./Circle";
import { GridBoxPath, SpecialTile, colors } from "../types";
import { useEffect, useState } from "react";
import { escape } from "querystring";
import { MagicBox } from "../images/magicBox";
import { ArrowTile } from "../images/arrowTile";
import { WarpTile } from "../images/warpTile";
import { LeafCover } from "../images/leafCover";
import { SummerAutumnSwitch } from "../images/summerAutumnSwitch";
import { PainterBox } from "../images/painterBox";
import { Bomb } from "../images/bomb";
import { Zorbie } from "../images/zorbie";
import { RotatingWall } from "../images/rotatingWall";
import { ZorbieSign } from "../images/zorbieSign";

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
  onSpecialClick?: ({
    tileType,
    x,
    y,
    color,
  }: {
    tileType: string;
    x: number;
    y: number;
    color?: string;
  }) => void;
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

    if (specialTile?.tileType === "zorbie-sign-up") {
      setRotateClass("rotate-up-to-right");
    } else if (specialTile?.tileType === "zorbie-sign-right") {
      setRotateClass("rotate-right-to-down");
    } else if (specialTile?.tileType === "zorbie-sign-down") {
      setRotateClass("rotate-down-to-left");
    } else if (specialTile?.tileType === "zorbie-sign-left") {
      setRotateClass("rotate-left-to-up");
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

  const isZorbie =
    specialTile?.tileType?.includes("zorbie") &&
    !specialTile?.tileType?.includes("zorbie-start") &&
    !specialTile?.tileType?.includes("zorbie-end");

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
        if (
          specialTile?.tileType === "summer-switch" ||
          specialTile?.tileType.includes("zorbie")
        ) {
          onSpecialClick &&
            onSpecialClick({
              ...specialTile,
              x,
              y,
            });
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
      {color && !isZorbie && (
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
        <WarpTile />
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
      {specialTile?.tileType === "arrow-up" && <ArrowTile rotation={0} />}
      {specialTile?.tileType === "arrow-down" && <ArrowTile rotation={180} />}
      {specialTile?.tileType === "arrow-left" && <ArrowTile rotation={270} />}
      {specialTile?.tileType === "arrow-right" && <ArrowTile rotation={90} />}
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
        <Box
          className={`${rotateClass} active`} // Apply dynamic class
          w="100%"
          h="100%"
          position="absolute"
          zIndex="1"
        >
          <RotatingWall />
        </Box>
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
          <Bomb
            text={bombTimer ? bombTimer.toString() : "-"}
            color={color || "tomato"}
          />
        </Box>
      )}
      {(specialTile?.tileType === "magic-box-up-left" ||
        specialTile?.tileType === "magic-box-up-right" ||
        specialTile?.tileType === "magic-box-up-down") && (
        // A magic box image inside the grid box
        <MagicBox />
      )}
      {specialTile?.tileType === "zorbie-up" && (
        // A zorbie image inside the grid box
        <Zorbie
          type="up"
          color={
            stageEffects &&
            stageEffects.includes("dark") &&
            specialTile?.color != "yellow"
              ? "gray"
              : specialTile?.color || "tomato"
          }
        />
      )}
      {specialTile?.tileType === "zorbie-down" && (
        // A zorbie image inside the grid box
        <Zorbie
          type="down"
          color={
            stageEffects &&
            stageEffects.includes("dark") &&
            specialTile?.color != "yellow"
              ? "gray"
              : specialTile?.color || "tomato"
          }
        />
      )}
      {specialTile?.tileType === "zorbie-left" && (
        // A zorbie image inside the grid box
        <Zorbie
          type="left"
          color={
            stageEffects &&
            stageEffects.includes("dark") &&
            specialTile?.color != "yellow"
              ? "gray"
              : specialTile?.color || "tomato"
          }
        />
      )}
      {specialTile?.tileType === "zorbie-right" && (
        // A zorbie image inside the grid box
        <Zorbie
          type="right"
          color={
            stageEffects &&
            stageEffects.includes("dark") &&
            specialTile?.color != "yellow"
              ? "gray"
              : specialTile?.color || "tomato"
          }
        />
      )}
      {specialTile?.tileType === "zorbie-happy" && (
        // A zorbie image inside the grid box
        <Zorbie
          type="happy"
          color={
            stageEffects &&
            stageEffects.includes("dark") &&
            specialTile?.color != "yellow"
              ? "gray"
              : specialTile?.color || "tomato"
          }
        />
      )}
      {(specialTile?.tileType === "zorbie-sign-up" ||
        specialTile?.tileType === "zorbie-sign-down" ||
        specialTile?.tileType === "zorbie-sign-left" ||
        specialTile?.tileType === "zorbie-sign-right") && (
        // rotating box image inside the grid box
        <Box
          w="100%"
          h="100%"
          position="absolute"
          zIndex="0"
          className={`${rotateClass} active`}
        >
          <ZorbieSign
            color={
              stageEffects &&
              stageEffects.includes("dark") &&
              specialTile?.color != "yellow"
                ? "gray"
                : specialTile?.color || "tomato"
            }
          />
        </Box>
      )}
      {specialTile?.tileType === "summer-switch" && (
        // A switch image inside the grid box
        <SummerAutumnSwitch />
      )}

      {stageEffects &&
        stageEffects.includes("summer") &&
        color &&
        !!(colors.indexOf(color) % 2) && <LeafCover type="summer" />}

      {stageEffects &&
        stageEffects.includes("autumn") &&
        color &&
        !(colors.indexOf(color) % 2) && <LeafCover type="autumn" />}

      {specialTile?.tileType === "painter-box-horizontal" && (
        // A painter box image inside the grid box
        <PainterBox
          direction="horizontal"
          color={specialTile?.color || "tomato"}
        />
      )}
      {specialTile?.tileType === "painter-box-vertical" && (
        // A painter box image inside the grid box
        <PainterBox
          direction="vertical"
          color={specialTile?.color || "tomato"}
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
