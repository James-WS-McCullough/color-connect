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

  let key = `${x},${y}`;
  const prevKey = prevBox && `${prevBox.x},${prevBox.y}`;

  if (!prevKey) return;

  let paintchangeNewColor = "";

  // If on a magic box, calculate the new key
  const onMagicBox = specialTiles.some(
    (s) =>
      s.x === x &&
      s.y === y &&
      (s.tileType === "magic-box-up-left" ||
        s.tileType === "magic-box-up-right" ||
        s.tileType === "magic-box-up-down")
  );

  const prevX = prevBox?.x;
  const prevY = prevBox?.y;

  const diffX = x - prevX;
  const diffY = y - prevY;

  // Check if (x, y) is adjacent to (prevX, prevY)
  if (Math.abs(diffX) + Math.abs(diffY) !== 1) return;

  if (onMagicBox) {
    if (
      specialTiles.some(
        (s) => s.x === x && s.y === y && s.tileType === "magic-box-up-left"
      )
    ) {
      if (diffY === -1) {
        key = `${x + 1},${y}`;
      } else if (diffX === -1) {
        key = `${x},${y + 1}`;
      } else if (diffY === 1) {
        key = `${x - 1},${y}`;
      } else if (diffX === 1) {
        key = `${x},${y - 1}`;
      }
    } else if (
      specialTiles.some(
        (s) => s.x === x && s.y === y && s.tileType === "magic-box-up-right"
      )
    ) {
      if (diffY === 1) {
        key = `${x + 1},${y}`;
      } else if (diffX === 1) {
        key = `${x},${y + 1}`;
      } else if (diffY === -1) {
        key = `${x - 1},${y}`;
      } else if (diffX === -1) {
        key = `${x},${y - 1}`;
      }
    } else if (
      specialTiles.some(
        (s) => s.x === x && s.y === y && s.tileType === "magic-box-up-down"
      )
    ) {
      if (diffY === -1) {
        key = `${x},${y - 1}`;
      } else if (diffX === -1) {
        key = `${x - 1},${y}`;
      } else if (diffY === 1) {
        key = `${x},${y + 1}`;
      } else if (diffX === 1) {
        key = `${x + 1},${y}`;
      }
    }
  }

  // If on a painter box, generate the new key
  if (
    specialTiles.some(
      (s) => s.x === x && s.y === y && s.tileType === "painter-box-horizontal"
    )
  ) {
    if (diffX === -1) {
      key = `${x - 1},${y}`;
    } else if (diffX === 1) {
      key = `${x + 1},${y}`;
    } else {
      return;
    }
  }

  if (
    specialTiles.some(
      (s) => s.x === x && s.y === y && s.tileType === "painter-box-vertical"
    )
  ) {
    if (diffY === -1) {
      key = `${x},${y - 1}`;
    } else if (diffY === 1) {
      key = `${x},${y + 1}`;
    } else {
      return;
    }
  }

  const activeSpecialTile = specialTiles.find((s) => s.x === x && s.y === y);

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
      activeSpecialTile,
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

      if (
        specialTiles.some(
          (s) => s.x === x && s.y === y && s.tileType === "magic-box-up-left"
        )
      ) {
        console.log("magic box up left");
        // If the previous key is above, complete it down and add a new path to the left. Same for below and right
        if (diffY === 1) {
          newPath[prevKey].down = true;
          newPath[key] = {
            up: false,
            down: false,
            left: false,
            right: true,
            color: currentColor || "tomato",
          };
        } else if (diffX === 1) {
          newPath[prevKey].right = true;
          newPath[key] = {
            up: false,
            down: true,
            left: false,
            right: false,
            color: currentColor || "tomato",
          };
        } else if (diffY === -1) {
          newPath[prevKey].up = true;
          newPath[key] = {
            up: false,
            down: false,
            left: true,
            right: false,
            color: currentColor || "tomato",
          };
        } else if (diffX === -1) {
          newPath[prevKey].left = true;
          newPath[key] = {
            up: true,
            down: false,
            left: false,
            right: false,
            color: currentColor || "tomato",
          };
        }

        return newPath;
      }

      if (
        specialTiles.some(
          (s) => s.x === x && s.y === y && s.tileType === "magic-box-up-right"
        )
      ) {
        console.log("magic box up right");
        // If the previous key is above, complete it down and add a new path to the right. Same for below and left
        if (diffY === 1) {
          newPath[prevKey].down = true;
          newPath[key] = {
            up: false,
            down: false,
            left: true,
            right: false,
            color: currentColor || "tomato",
          };
        } else if (diffX === 1) {
          newPath[prevKey].right = true;
          newPath[key] = {
            up: true,
            down: false,
            left: false,
            right: false,
            color: currentColor || "tomato",
          };
        } else if (diffY === -1) {
          newPath[prevKey].up = true;
          newPath[key] = {
            up: false,
            down: false,
            left: false,
            right: true,
            color: currentColor || "tomato",
          };
        } else if (diffX === -1) {
          newPath[prevKey].left = true;
          newPath[key] = {
            up: false,
            down: true,
            left: false,
            right: false,
            color: currentColor || "tomato",
          };
        }

        return newPath;
      }

      if (
        specialTiles.some(
          (s) => s.x === x && s.y === y && s.tileType === "magic-box-up-down"
        )
      ) {
        console.log("magic box up down");
        // If the previous key is above, complete it down and add a new path above. Same for below
        if (diffY === -1) {
          newPath[prevKey].up = true;
          newPath[key] = {
            up: false,
            down: true,
            left: false,
            right: false,
            color: currentColor || "tomato",
          };
        } else if (diffX === -1) {
          newPath[prevKey].left = true;
          newPath[key] = {
            up: false,
            down: false,
            left: false,
            right: true,
            color: currentColor || "tomato",
          };
        } else if (diffY === 1) {
          newPath[prevKey].down = true;
          newPath[key] = {
            up: true,
            down: false,
            left: false,
            right: false,
            color: currentColor || "tomato",
          };
        } else if (diffX === 1) {
          newPath[prevKey].right = true;
          newPath[key] = {
            up: false,
            down: false,
            left: true,
            right: false,
            color: currentColor || "tomato",
          };
        }

        return newPath;
      }

      if (
        specialTiles.some(
          (s) =>
            s.x === x &&
            s.y === y &&
            (s.tileType === "painter-box-horizontal" ||
              s.tileType === "painter-box-vertical")
        )
      ) {
        console.log("painter box");
        // If the color is white, set the currentColor to the paint box special tile color
        // Otherwise, set currentColor to white

        const painterBox = specialTiles.find(
          (s) =>
            s.x === x &&
            s.y === y &&
            (s.tileType === "painter-box-horizontal" ||
              s.tileType === "painter-box-vertical")
        );

        paintchangeNewColor =
          currentColor === "white" ? painterBox?.color || "tomato" : "white";

        if (currentColor !== painterBox?.color || "white") {
          paintchangeNewColor = currentColor || "tomato";
        }

        newPath[key] = {
          up: false,
          down: false,
          left: false,
          right: false,
          color: paintchangeNewColor || "tomato",
        };
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

        return newPath;
      }

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
    const keyX = parseInt(key.split(",")[0]);
    const keyY = parseInt(key.split(",")[1]);
    const circleData = circles.find((p) => p.x === keyX && p.y === keyY);
    if (circleData) {
      setCompletedPaths((prevCompletedPaths) => ({
        ...prevCompletedPaths,
        [circleData?.color || "tomato"]: true,
      }));
      stopDrawing({ setDrawing });
      if (stageEffects.includes("dark") && currentColor === "yellow") {
        playSFX("SFX/light2.wav");
        stageEffects.splice(stageEffects.indexOf("dark"), 1, "light");
      }
      if (
        specialTiles.some(
          (s) =>
            (s.tileType === "rotating-horizontal-only" ||
              s.tileType === "rotating-vertical-only") &&
            !path[`${s.x},${s.y}`]
        ) &&
        currentColor === "orange"
      ) {
        console.log("rotating tiles");
        playSFX("SFX/tile-rotate.wav");
        // Iterate through all grid tiles, and rotate the tiles if they don't have a color path on that coordinate
        setPuzzle((prevPuzzle) => {
          const newSpecialTiles = prevPuzzle.specialTiles.map((s) => {
            // If there is a color path on this coordinate, don't rotate
            if (path[`${s.x},${s.y}`]) return s;

            if (s.tileType === "rotating-horizontal-only") {
              const newTile = { ...s };
              newTile.tileType = "rotating-vertical-only";
              return newTile;
            } else if (s.tileType === "rotating-vertical-only") {
              const newTile = { ...s };
              newTile.tileType = "rotating-horizontal-only";
              return newTile;
            }
            return s;
          });
          return {
            ...prevPuzzle,
            specialTiles: newSpecialTiles,
          };
        });
      }
      // If any of the special tiles are lock, if the current color is green, remove all locks
      if (
        specialTiles.some((s) => s.tileType === "lock") &&
        currentColor === "green"
      ) {
        // Set all lock objects from specialTiles to 'unlocking'
        setPuzzle((prevPuzzle) => ({
          ...prevPuzzle,
          specialTiles: prevPuzzle.specialTiles.map((s) => {
            if (s.tileType === "lock") {
              return { ...s, tileType: "unlocking" };
            }
            return s;
          }),
        }));

        playSFX("SFX/lock1.wav");

        // Set timeout to remove all 'unlocking' locks
        setTimeout(() => {
          setPuzzle((prevPuzzle) => ({
            ...prevPuzzle,
            specialTiles: prevPuzzle.specialTiles.filter(
              (s) => s.tileType !== "unlocking"
            ),
          }));
        }, 1000);
      }
    }

    // If the key is a special tile, and it's a warp, set the location of the other warp to be this color
    const specialTileData = specialTiles.find(
      (s) => s.x === keyX && s.y === keyY
    );
    if (specialTileData && specialTileData.tileType === "warp") {
      console.log("warp");
      const otherWarp = specialTiles.find(
        (s) => (s.x !== keyX || s.y !== keyY) && s.tileType === "warp"
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
            color: paintchangeNewColor || currentColor || "tomato",
          },
        }));
        stopDrawing({ setDrawing });
        playSFX("SFX/warp1.wav");
      }
    }

    if (onMagicBox) {
      stopDrawing({ setDrawing });
      playSFX("SFX/magic-box.wav");
    }

    const painterBoxData = specialTiles.find(
      (s) =>
        s.x === x &&
        s.y === y &&
        (s.tileType === "painter-box-horizontal" ||
          s.tileType === "painter-box-vertical")
    );

    if (painterBoxData) {
      stopDrawing({ setDrawing });
      playSFX("SFX/painter-box.wav");
    }
  }
  setPrevBox({ x, y });
};
