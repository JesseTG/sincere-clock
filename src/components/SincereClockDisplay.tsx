import {findModuleChild,
} from "@decky/ui";
import {usePluginState, ClockPosition} from "../state";
import {CSSProperties, useEffect, useState} from "react";
import {format, localTime} from "../utils/timeUtils";
import {getBootTime, getSteamStartTime, getLastWakeTime, getGameStartTime} from "../utils/backend";
import { Temporal } from "temporal-polyfill";
import {CLOCK_MODE_ICONS, CLOCK_MODES} from "../constants";

enum UIComposition {
    Hidden = 0,
    Notification = 1,
    Overlay = 2,
    Opaque = 3,
    OverlayKeyboard = 4,
}

const useUIComposition: (composition: UIComposition) => void = findModuleChild(
    (m) => {
        if (typeof m !== "object") return undefined;
        for (const prop in m) {
            if (
                typeof m[prop] === "function" &&
                m[prop].toString().includes("AddMinimumCompositionStateRequest") &&
                m[prop].toString().includes("ChangeMinimumCompositionStateRequest") &&
                m[prop].toString().includes("RemoveMinimumCompositionStateRequest") &&
                !m[prop].toString().includes("m_mapCompositionStateRequests")
            ) {
                return m[prop];
            }
        }
    }
);

function getPositionClass(position: ClockPosition): string {
    return `position-${position}`;
}

function SincereClockOverlay() {
    const [state, setState] = usePluginState();
    const [wakeTime, setWakeTime] = useState<Temporal.Instant | null>(null);
    const [gameTime, setGameTime] = useState<Temporal.Instant | null>(null);

    useUIComposition(UIComposition.Notification);

    // Fetch game and wake times
    useEffect(() => {
        async function fetchWakeTime() {
            const time = await getLastWakeTime();
            setWakeTime(time);
        }

        async function fetchGameTime() {
            const time = await getGameStartTime();
            setGameTime(time);
        }

        if (state.clockMode === CLOCK_MODES.SINCE_WAKE) {
            fetchWakeTime();
        }

        if (state.clockMode === CLOCK_MODES.SINCE_GAME) {
            fetchGameTime();
        }
    }, [state.clockMode]);

    // Force update every half-second (to keep the display a little more consistent)
    useEffect(() => {
        const updateInterval = setInterval(() => {
            // Force a re-render by setting a new object (even if its values are the same)
            setState(prev => ({...prev}));
        }, 500);

        return () => clearInterval(updateInterval);
    }, [setState]);

    const positionClass = getPositionClass(state.position);

    const dynamicStyle: CSSProperties = {
        backgroundColor: state.backgroundColor.toString(),
        color: state.fontColor.toString(),
        fontSize: `${state.fontSize}px`,
    };

    // Get the appropriate time based on the clock mode
    // TODO: Show a blinking animation when the time isn't available,
    //  make it look like a digital clock that was just powered on
    const now = Temporal.Now.instant();
    let timeString: string;
    switch (state.clockMode) {
        case CLOCK_MODES.CURRENT_TIME:
            timeString = format(now);
            break;
        case CLOCK_MODES.SINCE_BOOT:
            timeString = state.lastBootTime ? format(now.since(state.lastBootTime)) : "--:--:--";
            break;
        case CLOCK_MODES.SINCE_STEAM:
            timeString = state.steamStartTime ? format(now.since(state.steamStartTime)) : "--:--:--";
            break;
        case CLOCK_MODES.SINCE_WAKE:
            timeString = state.lastWakeTime ? format(now.since(state.lastWakeTime)) : "--:--:--";
            break;
        case CLOCK_MODES.SINCE_GAME:
            timeString = state.gameStartTime ? format(now.since(state.gameStartTime)) : "--:--:--";
            break;
        default:
            timeString = format(now);
    }

    return (
        <div
            style={dynamicStyle}
            id="sincere-clock-overlay"
            className={positionClass}
        >
            <span style={{paddingRight: "1ex"}}>{CLOCK_MODE_ICONS[state.clockMode]}</span>
            <span>{timeString}</span>
        </div>
        // TODO: Use Intl.DateTimeFormat to internationalize the time display
    );
}

export default function SincereClockDisplay() {
    const [state, setState] = usePluginState();

    // Fetch boot time on component mount (even if it's hidden)
    useEffect(() => {
        async function fetchBootTime() {
            const bootTime = await getBootTime();
            if (!bootTime) {
                console.warn("Boot time not found");
                return;
            }

            setState(prev => ({...prev, lastBootTime: bootTime}));
        }

        async function fetchSteamStartTime() {
            const steamStartTime = await getSteamStartTime();
            if (!steamStartTime) {
                console.warn("Steam start time not found");
                return;
            }

            setState(prev => ({...prev, steamStartTime: steamStartTime}));
        }

        async function fetchGameStartTime() {
            const gameStartTime = await getGameStartTime();
            if (gameStartTime) {
                setState(prev => ({...prev, gameStartTime}));
            }
            // TODO: Log a warning if we're in the middle of the game
            //  (because then we should be able to find out the process start time)
            // TODO: Should I show a warning to the user if the game start time is null?
            //  That would mean something's really wrong.
        }

        if (!state.lastBootTime) {
            // Intentionally not awaited
            // noinspection JSIgnoredPromiseFromCall
            fetchBootTime();
        }

        if (!state.steamStartTime) {
            // Intentionally not awaited
            // noinspection JSIgnoredPromiseFromCall
            fetchSteamStartTime();
        }

        if (!state.gameStartTime) {
            // Intentionally not awaited
            // noinspection JSIgnoredPromiseFromCall
            fetchGameStartTime();
        }
    }, [setState, state.lastBootTime, state.steamStartTime, state.gameStartTime]);

    // Hide the overlay if we've turned it off
    return state.enabled ? <SincereClockOverlay /> : null;

    // The overlay is in a separate component
    // because you can't call hooks conditionally within a component
    // MagicBlackDecky does the same thing
}
