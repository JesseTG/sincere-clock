import Color from "color";
import {LuClock, LuCoffee, LuGamepad2, LuSquarePower} from "react-icons/lu";
import {SingleDropdownOption} from "@decky/ui";
import {FaSteam} from "react-icons/fa6";
export const GlobalComponentName = "SincereClock";

// Clock display constants
export const DEFAULT_FONT_SIZE = 24;
export const DEFAULT_FONT_COLOR = Color("#d14d4d"); // red
export const DEFAULT_BACKGROUND_COLOR = Color.rgb("rgba(37,37,37,0.63)");

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

// Clock mode constants
export const CLOCK_MODES = {
  CURRENT_TIME: "current-time",
  SINCE_BOOT: "since-boot",
  SINCE_STEAM: "since-steam",
  SINCE_WAKE: "since-wake",
  SINCE_GAME: "since-game"
} as const;

export const DEFAULT_CLOCK_MODE = CLOCK_MODES.CURRENT_TIME;

export const CLOCK_MODE_ICONS = {
    [CLOCK_MODES.CURRENT_TIME]: <LuClock/>,
    [CLOCK_MODES.SINCE_BOOT]: <LuSquarePower/>,
    [CLOCK_MODES.SINCE_STEAM]: <FaSteam/>,
    [CLOCK_MODES.SINCE_WAKE]: <LuCoffee/>,
    [CLOCK_MODES.SINCE_GAME]: <LuGamepad2/>,
} as const;

export const CLOCK_MODE_OPTIONS: SingleDropdownOption[] = [
    { data: CLOCK_MODES.CURRENT_TIME, label: <>{CLOCK_MODE_ICONS[CLOCK_MODES.CURRENT_TIME]}<span>Current Time</span></> },
    { data: CLOCK_MODES.SINCE_BOOT, label: <>{CLOCK_MODE_ICONS[CLOCK_MODES.SINCE_BOOT]}<span>Time Since Boot</span></> },
    { data: CLOCK_MODES.SINCE_STEAM, label: <>{CLOCK_MODE_ICONS[CLOCK_MODES.SINCE_STEAM]}<span>Time Since Steam Started</span></> },
    { data: CLOCK_MODES.SINCE_WAKE, label: <>{CLOCK_MODE_ICONS[CLOCK_MODES.SINCE_WAKE]}<span>Time Since Wake</span></> },
    { data: CLOCK_MODES.SINCE_GAME, label: <>{CLOCK_MODE_ICONS[CLOCK_MODES.SINCE_GAME]}<span>Time Since Game Started</span></> },
];

