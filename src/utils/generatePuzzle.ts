import { dir } from "console";
import {
  ColourPoint,
  Grid,
  Point,
  SpecialTile,
  colors as allColors,
} from "../types";

const directions: Point[] = [
  { x: 0, y: -1 }, // up
  { x: 1, y: 0 }, // right
  { x: 0, y: 1 }, // down
  { x: -1, y: 0 }, // left
];

const isValidPuzzle = (
  puzzle: ColourPoint[],
  gridSize: number,
  specialTiles: SpecialTile[]
) => {
  // To be valid, the puzzle must:
  // - have an even number of points
  // - have no points on the same tile.
  // Don't use set

  if (puzzle.length % 2 !== 0) {
    return false;
  }

  const points = puzzle.map(({ x, y }) => `${x},${y}`);
  const uniquePoints = new Set(points);
  if (uniquePoints.size !== points.length) {
    return false;
  }

  // - Have no colour endpoints on the same tile as a special tiles aside from bombs
  const specialTilePoints = specialTiles
    .filter((specialTile) => specialTile.tileType !== "bomb")
    .map(({ x, y }) => `${x},${y}`);
  const specialTileSet = new Set(specialTilePoints);
  for (const { x, y, color } of puzzle) {
    if (specialTileSet.has(`${x},${y}`)) {
      return false;
    }
  }

  return true;
};

export function generatePuzzle(
  gridSize: number,
  numColors: number,
  stageTypes?: string[]
): {
  circles: ColourPoint[];
  wallTiles: Point[];
  specialTiles: SpecialTile[];
  stageEffects: string[];
} {
  let circles, wallTiles, specialTiles, stageEffects, generateCount;
  generateCount = 0;
  do {
    ({ circles, wallTiles, specialTiles, stageEffects } = generateOnePuzzle(
      gridSize,
      numColors,
      stageTypes
    ));
    generateCount++;
    if (generateCount > 1000) {
      console.log("Failed to generate a valid puzzle after 1000 attempts");
      break;
    }
  } while (!isValidPuzzle(circles, gridSize, specialTiles));

  return { circles, wallTiles, specialTiles, stageEffects };
}

function generateOnePuzzle(
  gridSize: number,
  numColors: number,
  stageTypes?: string[]
): {
  circles: ColourPoint[];
  wallTiles: Point[];
  specialTiles: SpecialTile[];
  stageEffects: string[];
} {
  const colors = allColors.slice(0, numColors);

  const grid: Grid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(null));

  const endpoints: { [color: string]: Point[] } = {};

  // Initialize the endpoints
  for (const color of colors) {
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * gridSize);
      const y = Math.floor(Math.random() * gridSize);

      if (!grid[y][x]) {
        grid[y][x] = color;
        endpoints[color] = [
          { x, y },
          { x, y },
        ];
        placed = true;
      }
    }
  }

  let specialTiles = [] as SpecialTile[];

  let warpColor = null as string | null;

  if (stageTypes && stageTypes.includes("warp")) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const possibleTiles = [] as Point[];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (grid[y][x] === null) {
          // If the tile is not an endpoint for the color, or not bordering an endpoint for the color
          if (endpoints[color][0].x !== x || endpoints[color][0].y !== y) {
            let isBordering = false;
            for (const { x: dx, y: dy } of directions) {
              const newX = x + dx;
              const newY = y + dy;
              if (
                newX >= 0 &&
                newX < gridSize &&
                newY >= 0 &&
                newY < gridSize &&
                endpoints[color][0].x === newX &&
                endpoints[color][0].y === newY
              ) {
                isBordering = true;
              }
            }
            if (!isBordering) possibleTiles.push({ x, y });
          }
        }
      }
    }

    const tile =
      possibleTiles[Math.floor(Math.random() * possibleTiles.length)];
    specialTiles.push({
      x: endpoints[color][0].x,
      y: endpoints[color][0].y,
      tileType: "warp",
    });
    specialTiles.push({
      x: tile.x,
      y: tile.y,
      tileType: "warp",
    });
    grid[tile.y][tile.x] = color;
    endpoints[color][0] = tile;
    warpColor = color;
  }

  if (stageTypes && stageTypes.includes("magic-box")) {
    // List all random tiles that aren't on the border of the grid, and that are empty, as well as surrounded by 4 empty tiles
    let magicBoxableTiles = [] as Point[];
    for (let y = 1; y < gridSize - 1; y++) {
      for (let x = 1; x < gridSize - 1; x++) {
        if (
          grid[y][x] === null &&
          grid[y - 1][x] === null &&
          grid[y + 1][x] === null &&
          grid[y][x - 1] === null &&
          grid[y][x + 1] === null
        ) {
          magicBoxableTiles.push({ x, y });
        }
      }
    }

    if (magicBoxableTiles.length === 0) {
      console.log("No magic boxable tiles");
    } else {
      const { x, y } =
        magicBoxableTiles[Math.floor(Math.random() * magicBoxableTiles.length)];

      // Choose 2 colours in the puzzle
      let remainingColors = colors.filter((color) => color !== warpColor);
      const color1 =
        remainingColors[Math.floor(Math.random() * remainingColors.length)];
      // Make sure the second colour is not the same as the first
      remainingColors = remainingColors.filter((color) => color !== color1);
      const color2 =
        remainingColors[Math.floor(Math.random() * remainingColors.length)];

      remainingColors = remainingColors.filter((color) => color !== color2);

      // Clear these colours endpoints
      if (color1) grid[endpoints[color1][0].y][endpoints[color1][0].x] = null;
      if (color2) grid[endpoints[color2][0].y][endpoints[color2][0].x] = null;

      // Decide on the type of box, magic-box-up-left, magic-box-up-down or magic-box-up-right
      const boxType = Math.floor(Math.random() * 3);
      if (boxType === 0) {
        // Magic-box-up-left
        grid[y][x] = "N/A";
        grid[y - 1][x] = color1;
        grid[y][x - 1] = color1;
        grid[y + 1][x] = color2;
        grid[y][x + 1] = color2;

        // Set the new endpoints to the 4 directions joining the chosen tile.
        if (color1)
          endpoints[color1] = [
            { x: x - 1, y: y },
            { x: x, y: y - 1 },
          ];
        if (color2)
          endpoints[color2] = [
            { x: x + 1, y },
            { x: x, y: y + 1 },
          ];

        // Set the current tile to be a magic box up left
        specialTiles.push({ x, y, tileType: "magic-box-up-left" });
      } else if (boxType === 1) {
        // Magic-box-up-down
        grid[y][x] = "N/A";
        grid[y - 1][x] = color1;
        grid[y + 1][x] = color1;
        grid[y][x - 1] = color2;
        grid[y][x + 1] = color2;

        // Set the new endpoints to the 4 directions joining the chosen tile.
        if (color1)
          endpoints[color1] = [
            { x, y: y - 1 },
            { x, y: y + 1 },
          ];
        if (color2)
          endpoints[color2] = [
            { x: x - 1, y },
            { x: x + 1, y },
          ];

        // Set the current tile to be a magic box up down
        specialTiles.push({ x, y, tileType: "magic-box-up-down" });
      } else {
        // Magic-box-up-right
        grid[y][x] = "N/A";
        grid[y - 1][x] = color1;
        grid[y][x + 1] = color1;
        grid[y + 1][x] = color2;
        grid[y][x - 1] = color2;

        // Set the new endpoints to the 4 directions joining the chosen tile.
        if (color1)
          endpoints[color1] = [
            { x: x + 1, y },
            { x: x, y: y - 1 },
          ];
        if (color2)
          endpoints[color2] = [
            { x: x - 1, y },
            { x: x, y: y + 1 },
          ];

        // Set the current tile to be a magic box up right
        specialTiles.push({ x, y, tileType: "magic-box-up-right" });
      }
    }
  }

  let failures = 0;
  while (failures < 20) {
    // List all colours with endpoints on the same tile, or if they are on a special tile
    const colorsOnSameTile = Object.keys(endpoints).filter(
      (color) =>
        (endpoints[color][0].x === endpoints[color][1].x &&
          endpoints[color][0].y === endpoints[color][1].y) ||
        specialTiles.some(
          (specialTile) =>
            specialTile.x === endpoints[color][0].x &&
            specialTile.y === endpoints[color][0].y
        )
    );
    // Pick from those colours if there are any, otherwise pick from all colours
    let color = "";
    if (colorsOnSameTile.length > 0) {
      color =
        colorsOnSameTile[Math.floor(Math.random() * colorsOnSameTile.length)];
    } else {
      color = colors[Math.floor(Math.random() * colors.length)];
    }
    const endpointIndex = Math.floor(Math.random() * 2);
    const currentEndpoint = endpoints[color][endpointIndex];

    const numberOfSurroundedBySameColorTiles = ({ x, y }: Point) => {
      let count = 0;
      for (const { x: dx, y: dy } of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (
          newX >= 0 &&
          newX < gridSize &&
          newY >= 0 &&
          newY < gridSize &&
          grid[newY][newX] === color
        ) {
          count++;
        }
      }
      return count;
    };

    const possibleDirections = directions.filter(({ x, y }) => {
      const newX = currentEndpoint.x + x;
      const newY = currentEndpoint.y + y;

      return (
        newX >= 0 &&
        newX < gridSize &&
        newY >= 0 &&
        newY < gridSize &&
        grid[newY][newX] === null &&
        numberOfSurroundedBySameColorTiles({ x: newX, y: newY }) < 2
      );
    });

    if (possibleDirections.length === 0) {
      failures++;
      continue;
    }

    failures = 0;
    const { x, y } =
      possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
    const newX = currentEndpoint.x + x;
    const newY = currentEndpoint.y + y;

    grid[newY][newX] = color;
    endpoints[color][endpointIndex] = { x: newX, y: newY };
  }

  console.log("stageTypes" + stageTypes);
  console.log("Stage type lock");

  // If the stageTypes includes "lock", add them to specialTiles
  if (stageTypes && stageTypes.includes("lock")) {
    // Create random lockboxes on non-endpoint coloured tiles that aren't green or yellow, and don't have a special tile on them
    const lockableTiles = [] as Point[];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (
          grid[y][x] !== null &&
          grid[y][x] !== "green" &&
          grid[y][x] !== "yellow" &&
          grid[y][x] !== "orange" &&
          !specialTiles.some(
            (specialTile) => specialTile.x === x && specialTile.y === y
          )
        ) {
          lockableTiles.push({ x, y });
        }
      }
    }
    const numLocks = Math.max(
      Math.min(Math.floor(Math.random() * 3), lockableTiles.length),
      1
    );
    const lockTiles = [] as Point[];
    for (let i = 0; i < numLocks; i++) {
      const index = Math.floor(Math.random() * lockableTiles.length);
      lockTiles.push(lockableTiles[index]);
      lockableTiles.splice(index, 1);
    }
    if (lockTiles?.length > 0)
      specialTiles.push(
        ...lockTiles.map(({ x, y }) => ({ x, y, tileType: "lock" }))
      );
  }

  console.log("Stage type colour-specific-tiles");
  // If the stageTypes includes "colour-spesific-tiles", add some to specialTiles
  if (stageTypes && stageTypes.includes("colour-spesific-tiles")) {
    // possible tiles are all tiles that are not null, and don't have a special tile on them
    const colourableTiles = [] as Point[];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (
          grid[y][x] !== null &&
          !specialTiles.some(
            (specialTile) => specialTile.x === x && specialTile.y === y
          )
        ) {
          colourableTiles.push({ x, y });
        }
      }
    }
    // Add random number between 1 and 3 colour-specific tiles, of the colour tile they are on
    const numTiles = Math.max(
      Math.min(Math.floor(Math.random() * 5), colourableTiles.length),
      1
    );

    const colourTiles = [] as Point[];
    for (let i = 0; i < numTiles; i++) {
      const index = Math.floor(Math.random() * colourableTiles.length);
      colourTiles.push(colourableTiles[index]);
      colourableTiles.splice(index, 1);
    }
    if (colourTiles?.length > 0)
      specialTiles.push(
        ...colourTiles.map(({ x, y }) => ({
          x,
          y,
          tileType: "colour-specific",
          color: grid[y][x] || "tomato",
        }))
      );
  }

  console.log("Stage type direction-spesific-tiles");

  let possibleDirectionableTiles = [] as (Point & {
    tileType: string;
    color: string | null;
  })[];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (
        grid[y][x] !== null &&
        !specialTiles.some(
          (specialTile) => specialTile.x === x && specialTile.y === y
        )
      ) {
        // If the tiles above and below match the colour, or the tiles to the left and right match the colour, tileType is either "horizontal-only" or "vertical-only"
        if (
          ((y > 0 &&
            y < gridSize - 1 &&
            grid[y][x] === grid[y - 1][x] &&
            grid[y - 1][x] === grid[y + 1][x]) ||
            (x > 0 &&
              x < gridSize - 1 &&
              grid[y][x] === grid[y][x - 1] &&
              grid[y][x - 1] === grid[y][x + 1])) &&
          grid[y][x] !== "orange" &&
          grid[y][x] !== "yellow"
        ) {
          // For rotating, type is random
          const tileType =
            y > 0 &&
            y < gridSize - 1 &&
            grid[y][x] == grid[y - 1][x] &&
            grid[y - 1][x] === grid[y + 1][x]
              ? "vertical-only"
              : "horizontal-only";

          possibleDirectionableTiles.push({
            x,
            y,
            tileType: tileType,
            color: grid[y][x] || null,
          });
        }
      }
    }
  }

  if (
    stageTypes &&
    stageTypes.includes("rotating-tiles") &&
    colors.includes("orange")
  ) {
    // List all random tiles that are not null, don't have a special tile on them, and have a tile of the same colour on either side of them (horizontally or vertically)

    // Add random number between 1 and 3 direction-specific tiles, either horizontal or vertical
    const numTiles = Math.max(
      Math.min(
        Math.floor(Math.random() * 4 + 1),
        possibleDirectionableTiles.length
      ),
      1
    );

    console.log("numTiles" + numTiles);

    if (possibleDirectionableTiles && possibleDirectionableTiles?.length > 0) {
      const directionTiles = [] as (Point & { tileType: string })[];
      for (let i = 0; i < numTiles; i++) {
        const index = Math.floor(
          Math.random() * possibleDirectionableTiles.length
        );
        directionTiles.push(possibleDirectionableTiles[index]);
        possibleDirectionableTiles.splice(index, 1);
      }

      console.log("possibleDirectionableTiles:" + possibleDirectionableTiles);
      // Tile type to horizontal or vertical depending on the direction

      console.log("directionTiles:" + directionTiles);
      if (directionTiles && directionTiles?.length > 0)
        specialTiles.push(
          ...directionTiles.map(({ x, y, tileType }) => ({
            x,
            y,
            tileType:
              Math.random() > 0.5
                ? "rotating-horizontal-only"
                : "rotating-vertical-only",
            color: grid[y][x] || "tomato",
          }))
        );
      // Remove used tiles from the list of possibleDirectionableTiles
      possibleDirectionableTiles = possibleDirectionableTiles.filter(
        (tile) =>
          !directionTiles.some(
            (directionTile) =>
              directionTile.x === tile.x && directionTile.y === tile.y
          )
      );
    }
  }

  if (stageTypes && stageTypes.includes("painter-box")) {
    // From the list of possibleDirectionableTiles, find two on the same colour.
    const sameColorTiles = [] as {
      TileOne: Point & { tileType: string; color: string | null };
      TileTwo: Point & { tileType: string; color: string | null };
    }[];
    for (let i = 0; i < possibleDirectionableTiles.length; i++) {
      for (let j = i + 1; j < possibleDirectionableTiles.length; j++) {
        if (
          possibleDirectionableTiles[i].color ===
            possibleDirectionableTiles[j].color &&
          Math.abs(
            possibleDirectionableTiles[i].x - possibleDirectionableTiles[j].x
          ) +
            Math.abs(
              possibleDirectionableTiles[i].y - possibleDirectionableTiles[j].y
            ) >
            1
        ) {
          sameColorTiles.push({
            TileOne: possibleDirectionableTiles[i],
            TileTwo: possibleDirectionableTiles[j],
          });
        }
      }
    }

    // If there are at least one set of 2 tiles with the same colour, create two painter boxes
    if (sameColorTiles.length > 0) {
      // Pick one pair of tiles
      const { TileOne, TileTwo } =
        sameColorTiles[Math.floor(Math.random() * sameColorTiles.length)];

      // Add the painter boxes to specialTiles
      specialTiles.push({
        x: TileOne.x,
        y: TileOne.y,
        tileType:
          TileOne.tileType === "horizontal-only"
            ? "painter-box-horizontal"
            : "painter-box-vertical",
        color: TileOne.color || "tomato",
      });
      specialTiles.push({
        x: TileTwo.x,
        y: TileTwo.y,
        tileType:
          TileTwo.tileType === "horizontal-only"
            ? "painter-box-horizontal"
            : "painter-box-vertical",
        color: TileTwo.color || "tomato",
      });
    }
  }

  if (stageTypes && stageTypes.includes("direction-spesific-tiles")) {
    // Add random number between 1 and 3 direction-specific tiles, either horizontal or vertical
    const numTiles = Math.max(
      Math.min(
        Math.floor(Math.random() * 4 + 1),
        possibleDirectionableTiles.length
      ),
      1
    );

    console.log("numTiles" + numTiles);

    if (possibleDirectionableTiles && possibleDirectionableTiles?.length > 0) {
      const directionTiles = [] as (Point & { tileType: string })[];
      for (let i = 0; i < numTiles; i++) {
        const index = Math.floor(
          Math.random() * possibleDirectionableTiles.length
        );
        directionTiles.push(possibleDirectionableTiles[index]);
        possibleDirectionableTiles.splice(index, 1);
      }

      console.log("possibleDirectionableTiles:" + possibleDirectionableTiles);
      // Tile type to horizontal or vertical depending on the direction

      console.log("directionTiles:" + directionTiles);
      if (directionTiles && directionTiles?.length > 0)
        specialTiles.push(
          ...directionTiles.map(({ x, y, tileType }) => ({
            x,
            y,
            tileType,
            color: grid[y][x] || "tomato",
          }))
        );
    }
  }

  console.log("Stage type arrow-tiles");
  // If the stageTypes includes "arrow-tiles", add them to specialTiles
  if (stageTypes && stageTypes.includes("arrow-tiles")) {
    // List all tiles that have at least 1 neighbor of the same colour, and save their direction.
    const arrowableTiles = [] as (Point & { tileType: string })[];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (
          grid[y][x] !== null &&
          !specialTiles.some(
            (specialTile) => specialTile.x === x && specialTile.y === y
          )
        ) {
          for (const { x: dx, y: dy } of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (
              newX >= 0 &&
              newX < gridSize &&
              newY >= 0 &&
              newY < gridSize &&
              grid[y][x] === grid[newY][newX]
            ) {
              arrowableTiles.push({
                x,
                y,
                tileType: `arrow-${
                  dx === 0
                    ? dy === -1
                      ? "up"
                      : "down"
                    : dx === -1
                    ? "left"
                    : "right"
                }`,
              });
            }
          }
        }
      }
    }

    // Add random number between 1 and 3 arrow tiles,
    const numTiles = Math.max(
      Math.min(Math.floor(Math.random() * 3), arrowableTiles.length),
      1
    );
    const arrowTiles = [] as (Point & { tileType: string })[];
    const arrowTileColors = [] as string[];
    for (let i = 0; i < numTiles; i++) {
      const index = Math.floor(Math.random() * arrowableTiles.length);
      const color =
        grid[arrowableTiles[index].y][arrowableTiles[index].x] || "";
      if (
        !arrowTileColors.includes(color) &&
        !specialTiles.some(
          (specialTile) =>
            specialTile.x === arrowableTiles[index].x &&
            specialTile.y === arrowableTiles[index].y
        )
      ) {
        arrowTiles.push(arrowableTiles[index]);
        arrowableTiles.splice(index, 1);
        arrowTileColors.push(color);
      }
    }

    if (arrowTiles?.length > 0)
      specialTiles.push(
        ...arrowTiles.map(({ x, y, tileType }) => ({ x, y, tileType }))
      );
  }
  // Return:
  console.log("Stage type return");
  // The flattened the endpoints into a list of points
  const circles = colors.flatMap((color) =>
    endpoints[color].map((point) => ({ color, x: point.x, y: point.y }))
  );
  // All empty tiles in the grid
  const wallTiles: Point[] = [];
  grid.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile === null) {
        wallTiles.push({ x, y });
      }
    });
  });

  // If the stageTypes includes "bomb", add them to specialTiles over both circles of a random colour
  if (stageTypes && stageTypes.includes("bomb")) {
    // Random number between 1 and 2 / colour lenght bombs
    const numBombs = Math.max(
      Math.min(Math.floor(Math.random() * 3), colors.length),
      1
    );

    // Pick numBombs random colors not yellow
    const bombColours = [] as string[];
    for (let i = 0; i < numBombs; i++) {
      let color = "";
      do {
        color = colors[Math.floor(Math.random() * colors.length)];
      } while (color === "yellow" || bombColours.includes(color));
      bombColours.push(color);
    }

    // Add bombs to specialTiles
    bombColours.forEach((color) => {
      specialTiles.push(
        ...endpoints[color].map(({ x, y }) => ({ x, y, tileType: "bomb" }))
      );
    });
  }

  // If the stageTypes includes "dark, rainy, snow", add them to stageEffects

  const stageEffects = [] as string[];
  if (stageTypes && stageTypes.includes("dark")) {
    // If there are yellow endpoints, add "dark" to stageEffects
    if (Object.keys(endpoints).some((color) => color === "yellow")) {
      stageEffects.push("dark");
    }
  }

  if (stageTypes && stageTypes.includes("summer")) {
    // Find a random wall tile
    const wallTile = wallTiles[Math.floor(Math.random() * wallTiles.length)];
    if (wallTile && wallTile?.x && wallTile?.y) {
      specialTiles.push({
        x: wallTile.x,
        y: wallTile.y,
        tileType: "summer-switch",
      });
      stageEffects.push("summer");
    }
  }

  return { circles, wallTiles, specialTiles, stageEffects };
}
