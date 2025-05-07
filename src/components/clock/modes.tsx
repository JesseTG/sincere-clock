import {ReactElement} from "react";
import {Temporal} from "temporal-polyfill";
import {ClockMode, State} from "../../state";
import {CLOCK_MODES} from "../../constants";
import {LuClock, LuCoffee, LuGamepad2, LuSquarePower} from "react-icons/lu";
import {FaSteam} from "react-icons/fa";

import Clock from "./Clock";
import TimeSinceBoot from "./TimeSinceBoot";
import TimeSinceSteamStarted from "./TimeSinceSteamStarted";
import TimeSinceWake from "./TimeSinceWake";
import TimeSinceGameStarted from "./TimeSinceGameStarted";
import {SingleDropdownOption} from "@decky/ui";

export interface ClockType {
    id: ClockMode;
    name: string;
    icon: ReactElement;

    render(now: Temporal.Instant, state: State): ReactElement;
}

export type ClockTypes = Record<ClockMode, ClockType>;

export const CLOCK_TYPES: ClockTypes = {
    [CLOCK_MODES.CURRENT_TIME]: {
        id: CLOCK_MODES.CURRENT_TIME,
        name: "Current Time",
        icon: <LuClock/>,
        render(now: Temporal.Instant, _: State) {
            return <Clock time={now}/>;
        }
    },
    [CLOCK_MODES.SINCE_BOOT]: {
        id: CLOCK_MODES.SINCE_BOOT,
        name: "Time Since Boot",
        icon: <LuSquarePower/>,
        render(now, state) {
            return <TimeSinceBoot now={now} bootTime={state.lastBootTime}/>;
        }
    },
    [CLOCK_MODES.SINCE_STEAM]: {
        id: CLOCK_MODES.SINCE_STEAM,
        name: "Time Since Steam Started",
        icon: <FaSteam/>,
        render(now, state) {
            return <TimeSinceSteamStarted now={now} startTime={state.steamStartTime}/>;
        }
    },
    [CLOCK_MODES.SINCE_WAKE]: {
        id: CLOCK_MODES.SINCE_WAKE,
        name: "Time Since Wake",
        icon: <LuCoffee/>,
        render(now, state) {
            return <TimeSinceWake now={now} wakeTime={state.lastWakeTime ?? state.pluginStartTime}/>;
        }
    },
    [CLOCK_MODES.SINCE_GAME]: {
        id: CLOCK_MODES.SINCE_GAME,
        name: "Time Since Game Started",
        icon: <LuGamepad2/>,
        render(now, state) {
            return <TimeSinceGameStarted now={now} startTime={state.gameStartTime}/>;
        }
    }
};

export const CLOCK_MODE_OPTIONS: SingleDropdownOption[] = Object.values(CLOCK_TYPES).map(type => {
    return {
        data: type.id,
        label: <>{type.icon} {type.name}</>
    }
});