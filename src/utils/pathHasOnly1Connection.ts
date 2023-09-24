import { GridBoxPath } from "../types";

export const pathKeyHasOnly1Connection = (
  path: { [key: string]: GridBoxPath },
  key: string
) => {
  return (
    (path[key].up && !path[key].down && !path[key].left && !path[key].right) ||
    (!path[key].up && path[key].down && !path[key].left && !path[key].right) ||
    (!path[key].up && !path[key].down && path[key].left && !path[key].right) ||
    (!path[key].up && !path[key].down && !path[key].left && path[key].right)
  );
};
