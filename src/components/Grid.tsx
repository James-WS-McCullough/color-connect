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
  const [zorbieOnMove, setZorbieOnMove] = useState(false);

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
          // Get color list of bombs
          const bombTiles = specialTiles.filter((s) => s.tileType === "bomb");

          // Get tile color for each special tile location
          let bombColors = bombTiles.map((b) => {
            const color = circles.find((c) => c.x === b.x && c.y === b.y);
            if (!color || !color.color)
              return console.log("color not found", b.x, b.y, circles);
            return color.color;
          });

          console.log("bombColors", bombColors);

          const bombColorHasPaintbox = specialTiles.find(
            (s) =>
              (s.tileType === "painter-box-vertical" ||
                s.tileType === "painter-box-horizontal") &&
              bombColors.includes(s?.color)
          );

          // Clear the path with those colors
          setPath((prevPath) => {
            const newPath = { ...prevPath };
            Object.keys(newPath).forEach((key) => {
              if (bombColors.includes(newPath[key].color)) {
                delete newPath[key];
              }
              if (bombColorHasPaintbox) {
                if (newPath[key]?.color === "white") {
                  delete newPath[key];
                }
              }
            });
            return newPath;
          });

          // Set completed paths for each bomb color to false
          setCompletedPaths((prevCompletedPaths) => {
            const updatedCompletedPaths = { ...prevCompletedPaths };
            bombColors.forEach((color) => {
              updatedCompletedPaths[color || "tomato"] = false;
            });
            return updatedCompletedPaths;
          });

          // If the user is drawing in any of the bomb colors, stop drawing
          if (currentColor && bombColors.includes(currentColor)) {
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

  // useEffect to move zorbie every 1 second in the direction it is facing. If it reaches a zorbie-sign, it will change direction. If it hits a wall, the edge of the grid or another line, it will reset to the start.
  useEffect(() => {
    if (!isHelpModalOpen) {
      if (zorbieOnMove) {
        const interval = setInterval(() => {
          const zorbieStart = specialTiles.find((s) =>
            s.tileType.includes("zorbie-start")
          );
          const zorbieIndex = specialTiles.findIndex(
            (s) =>
              s.tileType === "zorbie-up" ||
              s.tileType === "zorbie-left" ||
              s.tileType === "zorbie-down" ||
              s.tileType === "zorbie-right"
          );
          const zorbie = specialTiles[zorbieIndex];
          if (!zorbie) {
            return;
          }
          let nextX = zorbie.x;
          let nextY = zorbie.y;
          let nextTileType = zorbie.tileType;
          let zorbieReset = false;
          let hasSFX = false;

          if (zorbie.tileType === "zorbie-up") {
            nextY = zorbie.y - 1;
          } else if (zorbie.tileType === "zorbie-left") {
            nextX = zorbie.x - 1;
          } else if (zorbie.tileType === "zorbie-down") {
            nextY = zorbie.y + 1;
          } else if (zorbie.tileType === "zorbie-right") {
            nextX = zorbie.x + 1;
          }

          let pathFromTileType = "";
          if (zorbie.tileType === "zorbie-up") {
            pathFromTileType = "down";
          } else if (zorbie.tileType === "zorbie-down") {
            pathFromTileType = "up";
          } else if (zorbie.tileType === "zorbie-left") {
            pathFromTileType = "right";
          } else if (zorbie.tileType === "zorbie-right") {
            pathFromTileType = "left";
          }

          // If the next move contains a magic box, follow magic box rules
          if (
            specialTiles.some(
              (s) =>
                s.x === nextX &&
                s.y === nextY &&
                s.tileType.includes("magic-box")
            )
          ) {
            const magicBox = specialTiles.find(
              (s) =>
                s.x === nextX &&
                s.y === nextY &&
                s.tileType.includes("magic-box")
            );
            if (magicBox) {
              hasSFX = true;
              playSFX("SFX/magic-box.wav");
              const sfxString =
                "SFX/zorbie_surprise_" +
                Math.floor(Math.random() * 9 + 1)
                  .toString()
                  .padStart(2, "0") +
                ".mp3";
              playSFX(sfxString);
              if (magicBox.tileType === "magic-box-up-left") {
                if (zorbie.tileType === "zorbie-down") {
                  nextX = zorbie.x - 1;
                  nextY = zorbie.y + 1;
                  pathFromTileType = "right";
                } else if (zorbie.tileType === "zorbie-right") {
                  nextX = zorbie.x + 1;
                  nextY = zorbie.y - 1;
                  pathFromTileType = "down";
                } else if (zorbie.tileType === "zorbie-left") {
                  nextX = zorbie.x - 1;
                  nextY = zorbie.y + 1;
                  pathFromTileType = "up";
                } else if (zorbie.tileType === "zorbie-up") {
                  nextX = zorbie.x + 1;
                  nextY = zorbie.y - 1;
                  pathFromTileType = "left";
                }
              }
              if (magicBox.tileType === "magic-box-up-right") {
                if (zorbie.tileType === "zorbie-down") {
                  nextX = zorbie.x + 1;
                  nextY = zorbie.y + 1;
                  pathFromTileType = "left";
                } else if (zorbie.tileType === "zorbie-left") {
                  nextX = zorbie.x - 1;
                  nextY = zorbie.y - 1;
                  pathFromTileType = "down";
                } else if (zorbie.tileType === "zorbie-right") {
                  nextX = zorbie.x + 1;
                  nextY = zorbie.y + 1;
                  pathFromTileType = "up";
                } else if (zorbie.tileType === "zorbie-up") {
                  nextX = zorbie.x - 1;
                  nextY = zorbie.y - 1;
                  pathFromTileType = "right";
                }
              }
              if (magicBox.tileType === "magic-box-up-down") {
                if (zorbie.tileType === "zorbie-down") {
                  nextY = zorbie.y + 2;
                } else if (zorbie.tileType === "zorbie-up") {
                  nextY = zorbie.y - 2;
                } else if (zorbie.tileType === "zorbie-left") {
                  nextX = zorbie.x - 2;
                } else if (zorbie.tileType === "zorbie-right") {
                  nextX = zorbie.x + 2;
                }
              }
            }
          }

          let nextColor = zorbie.color;

          // If the next tile includes a painter box, apply the painter box effect
          if (
            specialTiles.some(
              (s) =>
                s.x === nextX &&
                s.y === nextY &&
                s.tileType.includes("painter-box")
            )
          ) {
            const painterBox = specialTiles.find(
              (s) =>
                s.x === nextX &&
                s.y === nextY &&
                s.tileType.includes("painter-box")
            );
            if (painterBox) {
              if (painterBox.tileType === "painter-box-vertical") {
                if (zorbie.tileType === "zorbie-up") {
                  nextY = zorbie.y - 2;
                } else if (zorbie.tileType === "zorbie-down") {
                  nextY = zorbie.y + 2;
                }
              }
              if (painterBox.tileType === "painter-box-horizontal") {
                if (zorbie.tileType === "zorbie-left") {
                  nextX = zorbie.x - 2;
                } else if (zorbie.tileType === "zorbie-right") {
                  nextX = zorbie.x + 2;
                }
              }

              if (nextColor === "white") {
                nextColor = zorbieStart?.color || "tomato";
              } else {
                nextColor = "white";
              }
              hasSFX = true;
              playSFX("SFX/painter-box.wav");
              const sfxString =
                "SFX/zorbie_surprise_" +
                Math.floor(Math.random() * 9 + 1)
                  .toString()
                  .padStart(2, "0") +
                ".mp3";
              playSFX(sfxString);
            }
          }

          if (nextX < 0 || nextX >= size || nextY < 0 || nextY >= size) {
            zorbieReset = true;
          }

          if (wallTiles.some((w) => w.x === nextX && w.y === nextY)) {
            zorbieReset = true;
          }

          if (path[`${nextX},${nextY}`]) {
            zorbieReset = true;
          }

          // If the next move contains an endpoint not matching the zorbie color, reset zorbie
          if (
            circles.some(
              (c) => c.x === nextX && c.y === nextY && c.color !== zorbie.color
            )
          ) {
            zorbieReset = true;
          }

          // If the next move contains a special tile type lock, reset zorbie
          if (
            specialTiles.some(
              (s) => s.x === nextX && s.y === nextY && s.tileType === "lock"
            )
          ) {
            zorbieReset = true;
          }

          // If the next move contains a special tile type color-specific-tiles, reset zorbie if not in the right color
          if (
            specialTiles.some(
              (s) =>
                s.x === nextX &&
                s.y === nextY &&
                s.tileType.includes("colour-specific")
            )
          ) {
            const colorSpecificTile = specialTiles.find(
              (s) =>
                s.x === nextX &&
                s.y === nextY &&
                s.tileType.includes("colour-specific")
            );
            if (colorSpecificTile) {
              if (colorSpecificTile.color !== zorbie.color) {
                zorbieReset = true;
              }
            }
          }

          // If the next move contains a special tile type rotating-tiles, reset zorbie if not in the right alignment
          if (
            specialTiles.some(
              (s) =>
                s.x === nextX &&
                s.y === nextY &&
                s.tileType.includes("rotating")
            )
          ) {
            const rotatingTile = specialTiles.find(
              (s) =>
                s.x === nextX &&
                s.y === nextY &&
                s.tileType.includes("rotating")
            );
            if (rotatingTile) {
              if (
                (zorbie.tileType === "zorbie-up" &&
                  !rotatingTile.tileType.includes("vertical-only")) ||
                (zorbie.tileType === "zorbie-down" &&
                  !rotatingTile.tileType.includes("vertical-only")) ||
                (zorbie.tileType === "zorbie-left" &&
                  !rotatingTile.tileType.includes("horizontal-only")) ||
                (zorbie.tileType === "zorbie-right" &&
                  !rotatingTile.tileType.includes("horizontal-only"))
              ) {
                zorbieReset = true;
              }
            }
          }

          // If the next move contains an endpoint matching the zorbie color, complete the path
          if (
            circles.some(
              (c) =>
                c.x === nextX &&
                c.y === nextY &&
                c.color === (zorbieStart?.color || zorbie.color)
            ) &&
            !specialTiles.some(
              (s) =>
                s.x === nextX &&
                s.y === nextY &&
                s.tileType.includes("zorbie-start")
            )
          ) {
            setCompletedPaths((prevCompletedPaths) => {
              return {
                ...prevCompletedPaths,
                [zorbie.color || "tomato"]: true,
              };
            });
            hasSFX = true;
            const sfxString =
              "SFX/zorbie_happy_" +
              Math.floor(Math.random() * 12 + 1)
                .toString()
                .padStart(2, "0") +
              ".mp3";
            playSFX(sfxString);

            if (stageEffects.includes("dark") && zorbie.color === "yellow") {
              playSFX("SFX/light2.wav");
              stageEffects.splice(stageEffects.indexOf("dark"), 1, "light");
            }

            if (
              specialTiles.some((s) => s.tileType === "lock") &&
              zorbie.color === "green"
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

            setZorbieOnMove(false);
            clearInterval(interval);
            nextTileType = "zorbie-happy";
          }

          const nextTile = specialTiles.find(
            (s) => s.x === nextX && s.y === nextY
          );

          if (nextTile) {
            if (nextTile.tileType.includes("zorbie-sign")) {
              if (nextTile.tileType === "zorbie-sign-up") {
                nextTileType = "zorbie-up";
              }
              if (nextTile.tileType === "zorbie-sign-left") {
                nextTileType = "zorbie-left";
              }
              if (nextTile.tileType === "zorbie-sign-down") {
                nextTileType = "zorbie-down";
              }
              if (nextTile.tileType === "zorbie-sign-right") {
                nextTileType = "zorbie-right";
              }
            }
          }

          if (zorbieReset) {
            nextX = zorbieStart?.x || 0;
            nextY = zorbieStart?.y || 0;
            nextTileType = `zorbie-${zorbieStart?.tileType.split("-")[2]}`;
            nextColor = zorbieStart?.color || "tomato";
            setZorbieOnMove(false);
            clearInterval(interval);
            playSFX("SFX/bomb-boom.wav");
            const sfxString =
              "SFX/zorbie_sad_" +
              Math.floor(Math.random() * 6 + 1)
                .toString()
                .padStart(2, "0") +
              ".mp3";
            playSFX(sfxString);
            hasSFX = true;
          }

          setPuzzle((prevPuzzle) => {
            return {
              ...prevPuzzle,
              specialTiles: prevPuzzle.specialTiles.map((tile, index) => {
                if (index === zorbieIndex) {
                  return {
                    ...tile,
                    x: nextX,
                    y: nextY,
                    tileType: nextTileType,
                    color: nextColor,
                  };
                }
                return tile;
              }),
            };
          });

          if (!hasSFX) {
            const sfxString =
              "SFX/zorbie_walk_" +
              Math.floor(Math.random() * 17 + 1)
                .toString()
                .padStart(2, "0") +
              ".mp3";
            playSFX(sfxString);
          }

          // if zorbieReset is false, add next move to path
          if (!zorbieReset) {
            setPath((prevPath) => {
              return {
                ...prevPath,
                [`${zorbie.x},${zorbie.y}`]: {
                  ...prevPath[`${zorbie.x},${zorbie.y}`],
                  color: zorbie.color || "tomato",
                  [zorbie.tileType.split("-")[1]]: true,
                },
                [`${nextX},${nextY}`]: {
                  ...prevPath[`${nextX},${nextY}`],
                  color: nextColor || "tomato",
                  [pathFromTileType]: true,
                },
              };
            });
          }

          // If zorbie is reset, clear the path for the zorbie color
          if (zorbieReset) {
            const sfxString =
              "SFX/zorbie_sad_" +
              Math.floor(Math.random() * 6 + 1)
                .toString()
                .padStart(2, "0") +
              ".mp3";
            playSFX(sfxString);
            setPath((prevPath) => {
              const newPath = { ...prevPath };
              Object.keys(newPath).forEach((key) => {
                if (newPath[key].color === zorbie.color) {
                  delete newPath[key];
                }
              });
              return newPath;
            });

            // If there is a painterbox that matches the zorbie color, reset clear the path for white too
            if (
              specialTiles.some(
                (s) =>
                  s.tileType.includes("painter-box") &&
                  s.color === zorbieStart?.color
              )
            ) {
              setPath((prevPath) => {
                const newPath = { ...prevPath };
                Object.keys(newPath).forEach((key) => {
                  if (
                    newPath[key].color === "white" ||
                    newPath[key].color === zorbieStart?.color
                  ) {
                    delete newPath[key];
                  }
                });
                return newPath;
              });
            }
          }
        }, 500);
        return () => clearInterval(interval);
      }
    }
  }, [specialTiles, zorbieOnMove, stageEffects, isHelpModalOpen]);

  const resetZorbie = () => {
    const sfxString =
      "SFX/zorbie_surprise_" +
      Math.floor(Math.random() * 9 + 1)
        .toString()
        .padStart(2, "0") +
      ".mp3";
    playSFX(sfxString);
    const zorbieStart = specialTiles.find((s) =>
      s.tileType.includes("zorbie-start")
    );
    if (!zorbieStart) {
      return;
    }
    if (stageEffects.includes("light") && zorbieStart?.color === "yellow") {
      playSFX("SFX/light1.wav");
      stageEffects.splice(stageEffects.indexOf("light"), 1, "dark");
    }
    setCompletedPaths((prevCompletedPaths) => {
      return {
        ...prevCompletedPaths,
        [zorbieStart.color || "tomato"]: false,
      };
    });
    setPuzzle((prevPuzzle) => {
      return {
        ...prevPuzzle,
        specialTiles: prevPuzzle.specialTiles.map((tile, index) => {
          if (
            tile.tileType.includes("zorbie") &&
            !tile.tileType.includes("zorbie-sign") &&
            !tile.tileType.includes("zorbie-start") &&
            !tile.tileType.includes("zorbie-end")
          ) {
            return {
              ...tile,
              x: zorbieStart.x,
              y: zorbieStart.y,
              tileType: `zorbie-${zorbieStart.tileType.split("-")[2]}`,
              color: zorbieStart.color,
            };
          }
          return tile;
        }),
      };
    });

    setPath((prevPath) => {
      const newPath = { ...prevPath };
      Object.keys(newPath).forEach((key) => {
        if (newPath[key].color === zorbieStart.color) {
          delete newPath[key];
        }
      });
      return newPath;
    });

    // If there is a painterbox that matches the zorbie color, reset clear the path for white too
    if (
      specialTiles.some(
        (s) =>
          s.tileType.includes("painter-box") && s.color === zorbieStart?.color
      )
    ) {
      setPath((prevPath) => {
        const newPath = { ...prevPath };
        Object.keys(newPath).forEach((key) => {
          if (
            newPath[key].color === "white" ||
            newPath[key].color === zorbieStart?.color
          ) {
            delete newPath[key];
          }
        });
        return newPath;
      });
    }
  };

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

  // On special click to handle replace summer stage effect with autumn and autumn with summer
  const handleSpecialClick = ({
    tileType,
    x,
    y,
    color,
  }: {
    tileType: string;
    x: number;
    y: number;
    color?: string;
  }) => {
    // If puzzle doesn't have summer or autumn stage effects, return
    if (
      tileType == "summer-switch" &&
      (stageEffects.includes("summer") || stageEffects.includes("autumn"))
    ) {
      playSFX("SFX/leaves.wav");

      setPuzzle((prevPuzzle) => {
        return {
          ...prevPuzzle,
          stageEffects: prevPuzzle.stageEffects.map((effect) => {
            if (effect === "summer") {
              return "autumn";
            } else if (effect === "autumn") {
              return "summer";
            } else {
              return effect;
            }
          }),
        };
      });
      return;
    }

    if (
      tileType === "zorbie-happy" ||
      (tileType === "zarbie-end" && zorbieOnMove)
    ) {
      resetZorbie();
      setZorbieOnMove(false);
      return;
    }

    if (tileType?.includes("zorbie-sign")) {
      playSFX("SFX/zorbie-sign-rotate.mp3");

      let nextTileType = "";

      if (tileType === "zorbie-sign-up") {
        nextTileType = "zorbie-sign-right";
      } else if (tileType === "zorbie-sign-right") {
        nextTileType = "zorbie-sign-down";
      } else if (tileType === "zorbie-sign-down") {
        nextTileType = "zorbie-sign-left";
      } else if (tileType === "zorbie-sign-left") {
        nextTileType = "zorbie-sign-up";
      }

      setPuzzle((prevPuzzle) => {
        return {
          ...prevPuzzle,
          specialTiles: prevPuzzle.specialTiles.map((tile) => {
            if (tile.x === x && tile.y === y) {
              return {
                ...tile,
                tileType: nextTileType,
              };
            }
            return tile;
          }),
        };
      });
      return;
    }

    if (
      tileType?.includes("zorbie") &&
      !zorbieOnMove &&
      !specialTiles.some((s) => s.tileType === "zorbie-happy")
    ) {
      const sfxString =
        "SFX/zorbie_happy_" +
        Math.floor(Math.random() * 12 + 1)
          .toString()
          .padStart(2, "0") +
        ".mp3";
      playSFX(sfxString);
      setZorbieOnMove(true);
      return;
    }
  };

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
                bombTimer,
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
            specialTiles={specialTiles.filter(
              (s) => s.x === col && s.y === row
            )}
            onSpecialClick={handleSpecialClick}
          />
        );
      })}
    </Box>
  );
};

export default Grid;
