import {usePluginState, ClockPosition} from "../state";
import {CSSProperties, useEffect} from "react";
import {getBootTime, getSteamStartTime, getGameStartTime} from "../utils/backend";
import { Temporal } from "temporal-polyfill";
import {UIComposition, useUIComposition} from "../hooks/ui";
import {CLOCK_TYPES} from "./clock/modes";

function getPositionClass(position: ClockPosition): string {
    return `position-${position}`;
}

function SincereClockOverlay() {
    // TODO: Consider using `useCallback` as a performance optimization
    //  (but use `<Profiler>` to measure the render time first)
    const [state, setState] = usePluginState();

    useUIComposition(UIComposition.Notification);

    // Force update every half-second
    // (to keep the display updates a little smoother
    // than the default 1-second interval,
    // as the delay in setInterval is not guaranteed to be exact)
    useEffect(() => {
        const updateInterval = setInterval(() => {
            // Force a re-render by setting a new object (even if its values are the same)
            setState(prev => ({...prev}));
        }, 500);

        return () => clearInterval(updateInterval);
        // TODO: If using a stopwatch, use requestAnimationFrame instead
    }, [setState]);

    const positionClass = getPositionClass(state.position);

    const dynamicStyle: CSSProperties = {
        backgroundColor: state.backgroundColor.toString(),
        color: state.fontColor.toString(),
        fontSize: `${state.fontSize}px`,
    };

    // Find the appropriate clock type and render it
    const now = Temporal.Now.instant();
    const clockType = CLOCK_TYPES[state.clockMode];
    const clockComponent = clockType.render(now, state);

    return (
        <div
            style={dynamicStyle}
            id="sincere-clock-overlay"
            className={positionClass}
        >
            {clockComponent}
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

        if (!state.lastBootTime) {
            // Intentionally not awaited
            // noinspection JSIgnoredPromiseFromCall
            fetchBootTime();
        }
    }, [setState, state.lastBootTime]);

    useEffect(() => {
        async function fetchSteamStartTime() {
            const steamStartTime = await getSteamStartTime();
            if (!steamStartTime) {
                console.warn("Steam start time not found");
                return;
            }

            setState(prev => ({...prev, steamStartTime: steamStartTime}));
        }

        if (!state.steamStartTime) {
            // Intentionally not awaited
            // noinspection JSIgnoredPromiseFromCall
            fetchSteamStartTime();
        }
    }, [setState, state.steamStartTime]);

    useEffect(() => {
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

        if (!state.gameStartTime) {
            // Intentionally not awaited
            // noinspection JSIgnoredPromiseFromCall
            fetchGameStartTime();
        }
    }, [setState, state.gameStartTime]);

    // Hide the overlay if we've turned it off
    return state.enabled ? <SincereClockOverlay /> : null;

    // The overlay is in a separate component
    // because you can't call hooks conditionally within a component
    // MagicBlackDecky does the same thing
}

