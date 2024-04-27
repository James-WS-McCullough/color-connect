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
  specialTiles?: SpecialTile[];
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
  specialTiles,
  stageEffects,
  bombTimer,
  onSpecialClick,
}) => {
  const [rotateClass, setRotateClass] = useState("");

  useEffect(() => {
    if (specialTiles?.[0]?.tileType === "rotating-vertical-only") {
      setRotateClass("rotate-horizontal-to-vertical");
    } else if (specialTiles?.[0]?.tileType === "rotating-horizontal-only") {
      setRotateClass("rotate-vertical-to-horizontal");
    }

    if (specialTiles?.[0]?.tileType === "zorbie-sign-up") {
      setRotateClass("rotate-up-to-right");
    } else if (specialTiles?.[0]?.tileType === "zorbie-sign-right") {
      setRotateClass("rotate-right-to-down");
    } else if (specialTiles?.[0]?.tileType === "zorbie-sign-down") {
      setRotateClass("rotate-down-to-left");
    } else if (specialTiles?.[0]?.tileType === "zorbie-sign-left") {
      setRotateClass("rotate-left-to-up");
    }
  }, [specialTiles?.[0]?.tileType]);
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
    specialTiles?.[0]?.tileType?.includes("zorbie") &&
    !specialTiles?.[0]?.tileType?.includes("zorbie-start") &&
    !specialTiles?.[0]?.tileType?.includes("zorbie-end");

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
          specialTiles?.[0]?.tileType === "summer-switch" ||
          specialTiles?.[0]?.tileType.includes("zorbie")
        ) {
          onSpecialClick &&
            onSpecialClick({
              ...specialTiles?.[0],
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
      {specialTiles?.some((tile: SpecialTile) => tile.tileType === "warp") && (
        <WarpTile />
      )}
      {(specialTiles?.some((tile: SpecialTile) => tile.tileType === "lock") ||
        specialTiles?.some(
          (tile: SpecialTile) => tile.tileType === "unlocking"
        )) && (
        <Image
          src="lockbox.png"
          w="100%"
          h="100%"
          position="absolute"
          zIndex="0"
          className={
            specialTiles?.some(
              (tile: SpecialTile) => tile.tileType === "unlocking"
            )
              ? "lock-disappear"
              : ""
          }
        />
      )}
      {specialTiles?.some(
        (tile: SpecialTile) => tile.tileType === "arrow-up"
      ) && <ArrowTile rotation={0} />}
      {specialTiles?.some(
        (tile: SpecialTile) => tile.tileType === "arrow-down"
      ) && <ArrowTile rotation={180} />}
      {specialTiles?.some(
        (tile: SpecialTile) => tile.tileType === "arrow-left"
      ) && <ArrowTile rotation={270} />}
      {specialTiles?.some(
        (tile: SpecialTile) => tile.tileType === "arrow-right"
      ) && <ArrowTile rotation={90} />}
      {specialTiles?.some(
        (tile: SpecialTile) => tile.tileType === "colour-specific"
      ) && (
        // A diamond inside the grid box with the colour of the specialTile.color
        <Box
          position="absolute"
          w="40%"
          h="40%"
          transform="rotate(45deg)"
          backgroundColor={specialTiles?.[0]?.color || "tomato"}
          zIndex="1"
        />
      )}
      {specialTiles?.some(
        (tile: SpecialTile) => tile.tileType === "vertical-only"
      ) && (
        // Gray walls either side of the grid box
        <HStack
          justifyContent="space-between"
          height="100%"
          width="100%"
          position="absolute"
        >
          <Box
            w="40%"
            h="100%"
            backgroundColor={"gray"}
            opacity={1}
            zIndex="0"
          />
          <Box
            w="40%"
            h="100%"
            backgroundColor={"gray"}
            opacity={1}
            zIndex="0"
          />
        </HStack>
      )}
      {specialTiles?.some(
        (tile: SpecialTile) =>
          tile.tileType === "rotating-vertical-only" ||
          tile.tileType === "rotating-horizontal-only"
      ) && (
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
      {specialTiles?.some(
        (tile: SpecialTile) => tile.tileType === "horizontal-only"
      ) && (
        // Gray walls either side of the grid box
        <VStack
          justifyContent="space-between"
          height="100%"
          width="100%"
          position="absolute"
        >
          <Box
            w="100%"
            h="40%"
            backgroundColor={"gray"}
            opacity={1}
            zIndex="0"
          />
          <Box
            w="100%"
            h="40%"
            backgroundColor={"gray"}
            opacity={1}
            zIndex="0s"
          />
        </VStack>
      )}
      {specialTiles?.some((tile: SpecialTile) => tile.tileType === "bomb") && (
        // A bomb image inside the grid box
        <Box w="100%" h="100%" position="absolute" zIndex="2">
          <Bomb
            text={bombTimer ? bombTimer.toString() : "-"}
            color={color || "tomato"}
          />
        </Box>
      )}
      {specialTiles?.some(
        (tile: SpecialTile) =>
          tile.tileType === "magic-box-up-left" ||
          tile.tileType === "magic-box-up-right" ||
          tile.tileType === "magic-box-up-down"
      ) && (
        // A magic box image inside the grid box
        <MagicBox />
      )}
      {specialTiles?.some(
        (tile: SpecialTile) => tile.tileType === "zorbie-up"
      ) && (
        // A zorbie image inside the grid box
        <Zorbie
          type="up"
          color={
            stageEffects &&
            stageEffects.includes("dark") &&
            specialTiles?.[0]?.color != "yellow"
              ? "gray"
              : specialTiles?.[0]?.color || "tomato"
          }
        />
      )}
      {specialTiles?.some(
        (tile: SpecialTile) => tile.tileType === "zorbie-down"
      ) && (
        // A zorbie image inside the grid box
        <Zorbie
          type="down"
          color={
            stageEffects &&
            stageEffects.includes("dark") &&
            specialTiles?.[0]?.color != "yellow"
              ? "gray"
              : specialTiles?.[0]?.color || "tomato"
          }
        />
      )}
      {specialTiles?.some(
        (tile: SpecialTile) => tile.tileType === "zorbie-left"
      ) && (
        // A zorbie image inside the grid box
        <Zorbie
          type="left"
          color={
            stageEffects &&
            stageEffects.includes("dark") &&
            specialTiles?.[0]?.color != "yellow"
              ? "gray"
              : specialTiles?.[0]?.color || "tomato"
          }
        />
      )}
      {specialTiles?.some(
        (tile: SpecialTile) => tile.tileType === "zorbie-right"
      ) && (
        // A zorbie image inside the grid box
        <Zorbie
          type="right"
          color={
            stageEffects &&
            stageEffects.includes("dark") &&
            specialTiles?.[0]?.color != "yellow"
              ? "gray"
              : specialTiles?.[0]?.color || "tomato"
          }
        />
      )}
      {specialTiles?.some(
        (tile: SpecialTile) => tile.tileType === "zorbie-happy"
      ) && (
        // A zorbie image inside the grid box
        <Zorbie
          type="happy"
          color={
            stageEffects &&
            stageEffects.includes("dark") &&
            specialTiles?.[0]?.color != "yellow"
              ? "gray"
              : specialTiles?.[0]?.color || "tomato"
          }
        />
      )}
      {specialTiles?.some(
        (tile: SpecialTile) =>
          tile.tileType === "zorbie-sign-up" ||
          tile.tileType === "zorbie-sign-down" ||
          tile.tileType === "zorbie-sign-left" ||
          tile.tileType === "zorbie-sign-right"
      ) && (
        // rotating box image inside the grid box
        <ZorbieSign
          rotateClass={rotateClass}
          color={
            stageEffects &&
            stageEffects.includes("dark") &&
            specialTiles?.[0]?.color != "yellow"
              ? "gray"
              : specialTiles?.[0]?.color || "tomato"
          }
        />
      )}
      {specialTiles?.some(
        (tile: SpecialTile) => tile.tileType === "summer-switch"
      ) && (
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
      {specialTiles?.some(
        (tile: SpecialTile) => tile.tileType === "painter-box-horizontal"
      ) && (
        // A painter box image inside the grid box
        <PainterBox
          direction="horizontal"
          color={specialTiles?.[0]?.color || "tomato"}
        />
      )}
      {specialTiles?.some(
        (tile: SpecialTile) => tile.tileType === "painter-box-vertical"
      ) && (
        // A painter box image inside the grid box
        <PainterBox
          direction="vertical"
          color={specialTiles?.[0]?.color || "tomato"}
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
