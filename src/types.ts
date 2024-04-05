export type GridBoxPath = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  color: string;
};

export type Point = { x: number; y: number };
export type ColourPoint = Point & { color: string };
export type SpecialTile = Point & { tileType: string; color?: string };
export type Grid = (string | null)[][];
export type World = {
  effects: string[];
  startingSize: number;
  startingColors: number;
  backgroundColour?: string;
};

export enum GameMode {
  standard = "standard",
  classic = "classic",
  endless = "endless",
  adventure = "adventure",
}

export const levelTimerStart = 20;

export const allStageEffects = [
  "lock",
  "colour-spesific-tiles",
  "direction-spesific-tiles",
  "warp",
  "arrow-tiles",
  "dark",
  "bomb",
  "magic-box",
];

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
    level: 5,
    effect: "lock",
    popupText: "Unlock Locks with the Key!",
    color: "yellow",
  },
  {
    level: 10,
    effect: "colour-spesific-tiles",
    popupText: "Chroma-Set Tiles are Here!",
    color: "orange",
  },
  {
    level: 15,
    effect: "direction-spesific-tiles",
    popupText: "Tunnels are Here!",
    color: "blue",
  },
  {
    level: 20,
    effect: "warp",
    popupText: "It's Warp Time!",
    color: "pink",
  },
  {
    level: 25,
    effect: "arrow-tiles",
    popupText: "Arrow Tiles Arrive!",
    color: "green",
  },
  {
    level: 30,
    effect: "dark",
    popupText: "Lights Out!",
    color: "black",
  },
  {
    level: 40,
    effect: "bomb",
    popupText: "Tick Tock!",
    color: "red",
  },
  {
    level: 50,
    effect: "magic-box",
    popupText: "Magic Box!",
    color: "purple",
  },
];

export const worlds = [
  {
    effects: [],
    startingSize: 3,
    startingColors: 1,
    backgroundColour: "black",
  },
  {
    effects: ["lock", "arrow-tiles"],
    startingSize: 4,
    startingColors: 2,
    backgroundColour: "#1B780F",
  },
  {
    effects: ["colour-spesific-tiles", "direction-spesific-tiles"],
    startingSize: 4,
    startingColors: 3,
    backgroundColour: "#C19245",
  },
  {
    effects: ["warp"],
    startingSize: 4,
    startingColors: 3,
    backgroundColour: "#E043DD",
  },
  {
    effects: ["dark", "colour-spesific-tiles"],
    startingSize: 5,
    startingColors: 4,
    backgroundColour: "#343434",
  },
  {
    effects: ["bomb"],
    startingSize: 4,
    startingColors: 2,
    backgroundColour: "#980000",
  },
  {
    effects: ["magic-box"],
    startingSize: 4,
    startingColors: 3,
    backgroundColour: "#9900C3",
  },
  {
    effects: ["warp", "direction-spesific-tiles"],
    startingSize: 5,
    startingColors: 4,
    backgroundColour: "#8C4BEC",
  },
  {
    effects: ["bomb", "magic-box", "arrow-tiles"],
    startingSize: 5,
    startingColors: 5,
    backgroundColour: "#FFC841",
  },
  {
    effects: ["dark", "lock", "arrow-tiles", "direction-spesific-tiles"],
    startingSize: 5,
    startingColors: 4,
    backgroundColour: "#154511",
  },
  {
    effects: [
      "lock",
      "arrow-tiles",
      "direction-spesific-tiles",
      "colour-spesific-tiles",
    ],
    startingSize: 6,
    startingColors: 4,
    backgroundColour: "#2783D8",
  },
  {
    effects: ["warp", "magic-box", "arrow-tiles"],
    startingSize: 6,
    startingColors: 4,
    backgroundColour: "#9900C3",
  },
] as World[];
