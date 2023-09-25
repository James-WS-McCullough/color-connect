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

  // - Have no colour endpoints on the same tile as a special tile
  const specialTilePoints = specialTiles.map(({ x, y }) => `${x},${y}`);
  const specialTileSet = new Set(specialTilePoints);
  for (const { color, x, y } of puzzle) {
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
  let circles, wallTiles, specialTiles, stageEffects;
  do {
    ({ circles, wallTiles, specialTiles, stageEffects } = generateOnePuzzle(
      gridSize,
      numColors,
      stageTypes
    ));
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
    specialTiles.push(
      ...lockTiles.map(({ x, y }) => ({ x, y, tileType: "lock" }))
    );
  }

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
    specialTiles.push(
      ...colourTiles.map(({ x, y }) => ({
        x,
        y,
        tileType: "colour-specific",
        color: grid[y][x] || "tomato",
      }))
    );
  }

  // If the stageTypes includes "direction-spesific-tiles", add them to specialTiles
  if (stageTypes && stageTypes.includes("direction-spesific-tiles")) {
    // List all random tiles that are not null, don't have a special tile on them, and have a tile of the same colour on either side of them (horizontally or vertically)
    const directionableTiles = [] as (Point & { tileType: string })[];
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
            (y > 0 &&
              y < gridSize - 1 &&
              grid[y][x] == grid[y - 1][x] &&
              grid[y - 1][x] === grid[y + 1][x]) ||
            (x > 0 &&
              x < gridSize - 1 &&
              grid[y][x] == grid[y][x - 1] &&
              grid[y][x - 1] === grid[y][x + 1])
          ) {
            directionableTiles.push({
              x,
              y,
              tileType:
                y > 0 &&
                y < gridSize - 1 &&
                grid[y][x] == grid[y - 1][x] &&
                grid[y - 1][x] === grid[y + 1][x]
                  ? "vertical-only"
                  : "horizontal-only",
            });
          }
        }
      }
    }
    // Add random number between 1 and 3 direction-specific tiles, either horizontal or vertical
    const numTiles = Math.max(
      Math.min(Math.floor(Math.random() * 4 + 1), directionableTiles.length),
      1
    );
    const directionTiles = [] as (Point & { tileType: string })[];
    for (let i = 0; i < numTiles; i++) {
      const index = Math.floor(Math.random() * directionableTiles.length);
      directionTiles.push(directionableTiles[index]);
      directionableTiles.splice(index, 1);
    }
    // Tile type to horizontal or vertical depending on the direction

    specialTiles.push(
      ...directionTiles.map(({ x, y, tileType }) => ({
        x,
        y,
        tileType,
        color: grid[y][x] || "tomato",
      }))
    );
  }

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

    specialTiles.push(
      ...arrowTiles.map(({ x, y, tileType }) => ({ x, y, tileType }))
    );
  }
  // Return:
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

  // If the stageTypes includes "dark, rainy, snow", add them to stageEffects

  const stageEffects = [] as string[];
  if (stageTypes && stageTypes.includes("dark")) {
    // If there are yellow endpoints, add "dark" to stageEffects
    if (Object.keys(endpoints).some((color) => color === "yellow")) {
      stageEffects.push("dark");
    }
  }

  return { circles, wallTiles, specialTiles, stageEffects };
}
