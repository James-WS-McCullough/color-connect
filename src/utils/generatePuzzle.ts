type Point = { x: number; y: number };
type ColourPoint = Point & { color: string };
type Grid = (string | null)[][];

const directions: Point[] = [
  { x: 0, y: -1 }, // up
  { x: 1, y: 0 }, // right
  { x: 0, y: 1 }, // down
  { x: -1, y: 0 }, // left
];

const isValidPuzzle = (puzzle: ColourPoint[], gridSize: number) => {
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

  return true;
};

export function generatePuzzle(
  gridSize: number,
  numColors: number
): { puzzle: ColourPoint[]; wallTiles: Point[] } {
  let puzzle, wallTiles;
  do {
    ({ puzzle, wallTiles } = generateOnePuzzle(gridSize, numColors));
  } while (!isValidPuzzle(puzzle, gridSize));

  return { puzzle, wallTiles };
}

function generateOnePuzzle(
  gridSize: number,
  numColors: number
): { puzzle: ColourPoint[]; wallTiles: Point[] } {
  const colors = [
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "orange",
    "cyan",
    "magenta",
    // Add more colors if needed
  ].slice(0, numColors);

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

  let failures = 0;
  while (failures < 20) {
    // List all colours with endpoints on the same tile
    const colorsOnSameTile = Object.keys(endpoints).filter(
      (color) =>
        endpoints[color][0].x === endpoints[color][1].x &&
        endpoints[color][0].y === endpoints[color][1].y
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

      // Remove directions that will go out of bounds or into a tile that is already filled
      // Or that will be bordered by two tiles of the same color

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

  // Return:
  // The flattened the endpoints into a list of points
  const puzzle = colors.flatMap((color) =>
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

  return { puzzle, wallTiles };
}
