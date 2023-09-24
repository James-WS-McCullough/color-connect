export type GridBoxPath = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  color: string;
};

export const colors = [
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
  "orange",
  "cyan",
  "magenta",
  "lime",
  "pink",
  "teal",
  "lavender",
  "brown",
  "beige",
  "maroon",
  "mint",
  "olive",
  "coral",
  "navy",
];

export const iconColors = {
  red: "white",
  green: "white",
  blue: "white",
  yellow: "black",
  purple: "white",
  orange: "black",
  cyan: "black",
  magenta: "white",
  lime: "black",
  pink: "black",
  teal: "black",
  lavender: "black",
  brown: "white",
  beige: "black",
  maroon: "white",
  mint: "black",
  olive: "black",
  coral: "black",
  navy: "white",
};

export const unlockableStageTypes = [
  {
    level: 10,
    effect: "warp",
    popupText: "Unlocked Warps!",
    color: "pink",
  },
  {
    level: 20,
    effect: "dark",
    popupText: "Unlocked Dark Mode!",
    color: "yellow",
  },
];
