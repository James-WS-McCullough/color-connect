import { Point } from "framer-motion";
import { ColourPoint, GridBoxPath, SpecialTile } from "../types";
import { stopDrawing } from "../utils/stopDrawing";
import { invalidMoveCheck } from "../utils/test/invalidMoveCheck";
import { playSFX } from "../utils/playSFX";

type handleMouseEnterProps = {
  x: number;
  y: number;
  drawing: boolean;
  prevBox: { x: number; y: number } | null;
  circles: ColourPoint[];
  currentColor: string | null;
  wallTiles: Point[];
  specialTiles: SpecialTile[];
  path: { [key: string]: any };
  setDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  setPath: React.Dispatch<React.SetStateAction<{ [key: string]: GridBoxPath }>>;
  setCompletedPaths: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  stageEffects: string[];
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
  setPrevBox: React.Dispatch<
    React.SetStateAction<{ x: number; y: number } | null>
  >;
};

export const handleMouseEnter = ({
  x,
  y,
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
}: handleMouseEnterProps) => {
  if (!drawing) return;

  const key = `${x},${y}`;
  const prevKey = prevBox && `${prevBox.x},${prevBox.y}`;

  if (!prevKey) return;

  const prevX = prevBox?.x;
  const prevY = prevBox?.y;

  const diffX = x - prevX;
  const diffY = y - prevY;

  // Check if (x, y) is adjacent to (prevX, prevY)
  if (Math.abs(diffX) + Math.abs(diffY) !== 1) return;

  // Check if the move is valid
  if (
    invalidMoveCheck({
      diffX,
      diffY,
      key,
      prevKey,
      circles,
      currentColor,
      wallTiles,
      specialTiles,
      path,
    })
  ) {
    console.log("invalid move");
    stopDrawing({ setDrawing });
    return;
  }

  const backtracking = path[key] && path[key].color === currentColor;

  setPath((prevPath) => {
    const newPath = { ...prevPath };

    if (newPath[key]) {
      // This path already exists.
      // If this is backtracking along the current path, delete the prevKey and remove the connection from the current key
      if (prevKey === key) {
        delete newPath[key];
      } else {
        console.log("backtracking");
        if (diffX === 1) {
          if (newPath[key].left && newPath[prevKey].right) {
            newPath[key].left = false;
            newPath[prevKey].right = false;
          }
        } else if (diffX === -1) {
          if (newPath[key].right && newPath[prevKey].left) {
            newPath[key].right = false;
            newPath[prevKey].left = false;
          }
        } else if (diffY === 1) {
          if (newPath[key].up && newPath[prevKey].down) {
            newPath[key].up = false;
            newPath[prevKey].down = false;
          }
        } else if (diffY === -1) {
          if (newPath[key].down && newPath[prevKey].up) {
            newPath[key].down = false;
            newPath[prevKey].up = false;
          }
        }

        // If the previous key has no connections, delete it
        if (
          !newPath[prevKey].up &&
          !newPath[prevKey].down &&
          !newPath[prevKey].left &&
          !newPath[prevKey].right
        ) {
          delete newPath[prevKey];
        }
        if (
          !newPath[key].up &&
          !newPath[key].down &&
          !newPath[key].left &&
          !newPath[key].right
        ) {
          delete newPath[key];
        }
      }
    } else {
      // The user is extending the path, add the connection
      newPath[key] = {
        up: false,
        down: false,
        left: false,
        right: false,
        color: currentColor || "tomato",
      };
      // If newPath[prevKey] doesn't exist, create it
      newPath[prevKey] = newPath[prevKey] || {
        up: false,
        down: false,
        left: false,
        right: false,
        color: currentColor || "tomato",
      };

      if (diffX === 1) {
        newPath[prevKey].right = true;
        newPath[key].left = true;
      } else if (diffX === -1) {
        newPath[prevKey].left = true;
        newPath[key].right = true;
      } else if (diffY === 1) {
        newPath[prevKey].down = true;
        newPath[key].up = true;
      } else if (diffY === -1) {
        newPath[prevKey].up = true;
        newPath[key].down = true;
      }
    }

    return newPath;
  });

  if (!backtracking) {
    // If the key is a circle, stop drawing
    const circleData = circles.find((p) => p.x === x && p.y === y);
    if (circleData) {
      setCompletedPaths((prevCompletedPaths) => ({
        ...prevCompletedPaths,
        [currentColor || "tomato"]: true,
      }));
      stopDrawing({ setDrawing });
      if (stageEffects.includes("dark") && currentColor == "yellow") {
        playSFX("SFX/light2.wav");
        stageEffects.splice(stageEffects.indexOf("dark"), 1, "light");
      }
      // If any of the special tiles are lock, if the current color is green, remove all locks
      if (
        specialTiles.some(
          (s) => s.tileType === "lock" && currentColor === "green"
        )
      ) {
        // Remove all lock objects from specialTiles
        setPuzzle((prevPuzzle) => ({
          ...prevPuzzle,
          specialTiles: prevPuzzle.specialTiles.filter(
            (s) => s.tileType !== "lock"
          ),
        }));

        playSFX("SFX/lock1.wav");
      }
    }

    // If the key is a special tile, and it's a warp, set the location of the other warp to be this color
    const specialTileData = specialTiles.find((s) => s.x === x && s.y === y);
    if (specialTileData && specialTileData.tileType === "warp") {
      console.log("warp");
      const otherWarp = specialTiles.find(
        (s) => (s.x !== x || s.y !== y) && s.tileType === "warp"
      );
      console.log("otherWarp", otherWarp);
      if (otherWarp) {
        setPath((prevPath) => ({
          ...prevPath,
          [`${otherWarp.x},${otherWarp.y}`]: {
            up: false,
            down: false,
            left: false,
            right: false,
            color: currentColor || "tomato",
          },
        }));
        stopDrawing({ setDrawing });
        playSFX("SFX/warp1.wav");
      }
    }
  }
  setPrevBox({ x, y });
};
