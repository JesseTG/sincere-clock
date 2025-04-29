import Color from "color";
export const GlobalComponentName = "SincereClock";

// Clock display constants
export const DEFAULT_FONT_SIZE = 24;
export const DEFAULT_FONT_COLOR = Color("white");
export const DEFAULT_BACKGROUND_COLOR = Color.rgb(0, 128, 0, 0.7);

export const CLOCK_POSITIONS = {
  TOP_LEFT: "top-left",
  TOP_CENTER: "top-center",
  TOP_RIGHT: "top-right",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_CENTER: "bottom-center",
  BOTTOM_RIGHT: "bottom-right"
} as const;

export const DEFAULT_POSITION = CLOCK_POSITIONS.TOP_LEFT;

export const POSITION_OPTIONS = [
  { data: CLOCK_POSITIONS.TOP_LEFT, label: "Top Left" },
  { data: CLOCK_POSITIONS.TOP_CENTER, label: "Top Center" },
  { data: CLOCK_POSITIONS.TOP_RIGHT, label: "Top Right" },
  { data: CLOCK_POSITIONS.BOTTOM_LEFT, label: "Bottom Left" },
  { data: CLOCK_POSITIONS.BOTTOM_CENTER, label: "Bottom Center" },
  { data: CLOCK_POSITIONS.BOTTOM_RIGHT, label: "Bottom Right" },
];

export const FONT_SIZE_MIN = 12;
export const FONT_SIZE_MAX = 48;
export const FONT_SIZE_STEP = 1;