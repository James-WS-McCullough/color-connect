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
  "rotating-tiles",
  "summer",
  "painter-box",
  "zorbie",
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
    level: 35,
    effect: "bomb",
    popupText: "Tick Tock!",
    color: "red",
  },
  {
    level: 40,
    effect: "magic-box",
    popupText: "Magic Box!",
    color: "purple",
  },
  {
    level: 45,
    effect: "rotating-tiles",
    popupText: "Rotating Tiles!",
    color: "orange",
  },
  {
    level: 50,
    effect: "summer",
    popupText: "It's Summer!",
    color: "lime",
  },
  {
    level: 55,
    effect: "painter-box",
    popupText: "Get Painted!",
    color: "cyan",
  },
  {
    level: 60,
    effect: "zorbie",
    popupText: "Zorbies Arrive!",
    color: "magenta",
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
    effects: [
      "colour-spesific-tiles",
      "direction-spesific-tiles",
      "rotating-tiles",
    ],
    startingSize: 4,
    startingColors: 3,
    backgroundColour: "#C19245",
  },
  {
    effects: ["warp", "painter-box"],
    startingSize: 4,
    startingColors: 3,
    backgroundColour: "#E043DD",
  },
  {
    effects: ["dark", "colour-spesific-tiles", "zorbie"],
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
    effects: ["magic-box", "zorbie"],
    startingSize: 4,
    startingColors: 3,
    backgroundColour: "#9900C3",
  },
  {
    effects: ["warp", "direction-spesific-tiles", "painter-box"],
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
    effects: ["summer", "lock", "arrow-tiles", "direction-spesific-tiles"],
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
      "rotating-tiles",
    ],
    startingSize: 6,
    startingColors: 6,
    backgroundColour: "#2783D8",
  },
  {
    effects: ["warp", "magic-box", "painter-box", "arrow-tiles", "zorbie"],
    startingSize: 6,
    startingColors: 6,
    backgroundColour: "#9900C3",
  },
] as World[];
