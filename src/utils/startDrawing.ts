import { ColourPoint, GridBoxPath, SpecialTile } from "../types";
import { pathKeyHasOnly1Connection } from "./pathHasOnly1Connection";
import { playSFX } from "./playSFX";

type startDrawingProps = {
  x: number;
  y: number;
  circles: ColourPoint[];
  specialTiles: SpecialTile[];
  stageEffects: string[];
  path: { [key: string]: any };
  setPath: React.Dispatch<React.SetStateAction<{ [key: string]: GridBoxPath }>>;
  setCompletedPaths: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  setDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentColor: React.Dispatch<React.SetStateAction<string | null>>;
  setPrevBox: React.Dispatch<
    React.SetStateAction<{ x: number; y: number } | null>
  >;
  bombTimer: number;
  setBombTimer: React.Dispatch<React.SetStateAction<number>>;
};

export const startDrawing = ({
  x,
  y,
  circles,
  specialTiles,
  stageEffects,
  path,
  setPath,
  setCompletedPaths,
  setDrawing,
  setCurrentColor,
  setPrevBox,
  bombTimer,
  setBombTimer,
}: startDrawingProps) => {
  const key = `${x},${y}`;
  const circleData = circles.find((p) => p.x === x && p.y === y);
  const specialTileData = specialTiles.find((s) => s.x === x && s.y === y);

  // If circleData, or if the path key has only 1 or 0 connections, start drawing
  if (
    (circleData &&
      (circleData.color == "yellow" || !stageEffects.includes("dark"))) ||
    (specialTileData?.tileType === "warp" &&
      path[key] &&
      !path[key].down &&
      !path[key].up &&
      !path[key].left &&
      !path[key].up) ||
    (!(specialTileData?.tileType === "warp") &&
      path[key] &&
      pathKeyHasOnly1Connection(path, key))
  ) {
    // If on a circle, clear all paths of that color
    if (circleData) {
      const circleColorHasPaintbox = specialTiles.find(
        (s) =>
          (s.tileType === "painter-box-vertical" ||
            s.tileType === "painter-box-horizontal") &&
          s?.color === circleData?.color
      );

      setPath((prevPath) => {
        const newPath = { ...prevPath };
        Object.keys(newPath).forEach((key) => {
          if (newPath[key].color === circleData?.color) {
            delete newPath[key];
          }
          if (circleColorHasPaintbox) {
            if (newPath[key]?.color === "white") {
              delete newPath[key];
            }
          }
        });
        return newPath;
      });
      setCompletedPaths((prevCompletedPaths) => ({
        ...prevCompletedPaths,
        [circleData?.color || "tomato"]: false,
      }));
      if (stageEffects.includes("light") && circleData?.color == "yellow") {
        playSFX("SFX/light1.wav");
        stageEffects.splice(stageEffects.indexOf("light"), 1, "dark");
      }
      if (specialTileData?.tileType === "bomb" && bombTimer <= 0) {
        setBombTimer(5);
        playSFX("SFX/bomb-start.wav");
      }
    }
    setDrawing(true);
    setCurrentColor(circleData?.color || path[key]?.color);
    setPrevBox({ x, y });
    setPath((prevPath) => ({
      ...prevPath,
      [key]: prevPath[key] || {
        up: false,
        down: false,
        left: false,
        right: false,
        color: circleData?.color || "tomato",
      },
    }));
  }
};
