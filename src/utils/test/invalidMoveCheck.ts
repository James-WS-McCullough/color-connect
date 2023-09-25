import { ColourPoint, Point, SpecialTile } from "../../types";

type invalidMoveCheckProps = {
  diffX: number;
  diffY: number;
  key: string;
  prevKey: string;
  circles: ColourPoint[];
  currentColor: string | null;
  wallTiles: Point[];
  specialTiles: SpecialTile[];
  path: { [key: string]: any };
};

export const invalidMoveCheck = ({
  diffX,
  diffY,
  key,
  prevKey,
  circles,
  currentColor,
  wallTiles,
  specialTiles,
  path,
}: invalidMoveCheckProps) => {
  // If the current path[key] contains a circle of a different color to currentColor, return true
  const x = key.split(",")[0];
  const y = key.split(",")[1];

  console.log("x, y", x, y);

  const circleData = circles.find(
    (p) => p.x === parseInt(x) && p.y === parseInt(y)
  );

  if (circleData && circleData.color !== currentColor) {
    return true;
  }

  // If the current path contains a wall, return true
  if (wallTiles.some((w) => w.x === parseInt(x) && w.y === parseInt(y))) {
    return true;
  }

  // If the current path contains a lock, return true
  if (
    specialTiles.some(
      (s) => s.x === parseInt(x) && s.y === parseInt(y) && s.tileType === "lock"
    )
  ) {
    return true;
  }

  // If the current path contains a colour-specific special tile of a different color, return true
  if (
    specialTiles.some(
      (s) =>
        s.x === parseInt(x) &&
        s.y === parseInt(y) &&
        s.tileType === "colour-specific" &&
        s.color !== currentColor
    )
  ) {
    return true;
  }

  // If traveling horizontally, and the current path contains a specialtile vertical-only path, return true
  if (
    diffX !== 0 &&
    specialTiles.some(
      (s) =>
        s.x === parseInt(x) &&
        s.y === parseInt(y) &&
        s.tileType === "vertical-only"
    )
  ) {
    return true;
  }

  // If traveling horizontally, and the previous path contains a specialtile vertical-only path, return true
  if (
    diffX !== 0 &&
    specialTiles.some(
      (s) =>
        s.x === parseInt(prevKey.split(",")[0]) &&
        s.y === parseInt(prevKey.split(",")[1]) &&
        s.tileType === "vertical-only"
    )
  ) {
    return true;
  }

  // If traveling vertically, and the current path contains a specialtile horizontal-only path, return true
  if (
    diffY !== 0 &&
    specialTiles.some(
      (s) =>
        s.x === parseInt(x) &&
        s.y === parseInt(y) &&
        s.tileType === "horizontal-only"
    )
  ) {
    return true;
  }

  // If traveling vertically, and the previous path contains a specialtile horizontal-only path, return true
  if (
    diffY !== 0 &&
    specialTiles.some(
      (s) =>
        s.x === parseInt(prevKey.split(",")[0]) &&
        s.y === parseInt(prevKey.split(",")[1]) &&
        s.tileType === "horizontal-only"
    )
  ) {
    return true;
  }

  // If the previous path contains an 'arrow-up' special tile, and the current path is not traveling up, return true
  if (
    specialTiles.some(
      (s) =>
        s.x === parseInt(prevKey.split(",")[0]) &&
        s.y === parseInt(prevKey.split(",")[1]) &&
        s.tileType === "arrow-up"
    ) &&
    diffY !== -1
  ) {
    return true;
  }

  // If the previous path contains an 'arrow-down' special tile, and the current path is not traveling down, return true
  if (
    specialTiles.some(
      (s) =>
        s.x === parseInt(prevKey.split(",")[0]) &&
        s.y === parseInt(prevKey.split(",")[1]) &&
        s.tileType === "arrow-down"
    ) &&
    diffY !== 1
  ) {
    return true;
  }

  // If the previous path contains an 'arrow-left' special tile, and the current path is not traveling left, return true
  if (
    specialTiles.some(
      (s) =>
        s.x === parseInt(prevKey.split(",")[0]) &&
        s.y === parseInt(prevKey.split(",")[1]) &&
        s.tileType === "arrow-left"
    ) &&
    diffX !== -1
  ) {
    return true;
  }

  // If the previous path contains an 'arrow-right' special tile, and the current path is not traveling right, return true
  if (
    specialTiles.some(
      (s) =>
        s.x === parseInt(prevKey.split(",")[0]) &&
        s.y === parseInt(prevKey.split(",")[1]) &&
        s.tileType === "arrow-right"
    ) &&
    diffX !== 1
  ) {
    return true;
  }

  // If the current path contains an 'arrow-up' special tile, and the current path is traveling down, return true
  if (
    specialTiles.some(
      (s) =>
        s.x === parseInt(x) && s.y === parseInt(y) && s.tileType === "arrow-up"
    ) &&
    diffY === 1
  ) {
    return true;
  }

  // If the current path contains an 'arrow-down' special tile, and the current path is traveling up, return true
  if (
    specialTiles.some(
      (s) =>
        s.x === parseInt(x) &&
        s.y === parseInt(y) &&
        s.tileType === "arrow-down"
    ) &&
    diffY === -1
  ) {
    return true;
  }

  // If the current path contains an 'arrow-left' special tile, and the current path is traveling right, return true
  if (
    specialTiles.some(
      (s) =>
        s.x === parseInt(x) &&
        s.y === parseInt(y) &&
        s.tileType === "arrow-left"
    ) &&
    diffX === 1
  ) {
    return true;
  }

  // If the current path contains an 'arrow-right' special tile, and the current path is traveling left, return true
  if (
    specialTiles.some(
      (s) =>
        s.x === parseInt(x) &&
        s.y === parseInt(y) &&
        s.tileType === "arrow-right"
    ) &&
    diffX === -1
  ) {
    return true;
  }

  if (!path[key]) return false;
  // If the current path[key] is empty, return false
  if (!path[key].up && !path[key].down && !path[key].left && !path[key].right) {
    return false;
  }

  if (!prevKey) return true;

  // If backtracking along a valid path, return false
  if (diffX === 1) {
    if (path[key].left && path[prevKey].right) {
      return false;
    }
  } else if (diffX === -1) {
    if (path[key].right && path[prevKey].left) {
      return false;
    }
  } else if (diffY === 1) {
    if (path[key].up && path[prevKey].down) {
      return false;
    }
  } else if (diffY === -1) {
    if (path[key].down && path[prevKey].up) {
      return false;
    }
  }
  return true;
};
