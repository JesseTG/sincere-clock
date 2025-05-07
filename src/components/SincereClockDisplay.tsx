import {usePluginState, ClockPosition} from "../state";
import {CSSProperties, ReactElement, useEffect} from "react";
import {getBootTime, getSteamStartTime, getGameStartTime, getLastWakeTime} from "../utils/backend";
import { Temporal } from "temporal-polyfill";
import {CLOCK_MODES} from "../constants";
import {UIComposition, useUIComposition} from "../hooks/ui";
import Clock from "./clock/Clock";
import TimeSinceBoot from "./clock/TimeSinceBoot";
import TimeSinceSteamStarted from "./clock/TimeSinceSteamStarted";
import TimeSinceWake from "./clock/TimeSinceWake";
import TimeSinceGameStarted from "./clock/TimeSinceGameStarted";

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

    // Get the appropriate time based on the clock mode
    // TODO: Show a blinking animation when the time isn't available,
    //  make it look like a digital clock that was just powered on
    const now = Temporal.Now.instant();
    let clockComponent: ReactElement;
    switch (state.clockMode) {
        case CLOCK_MODES.CURRENT_TIME:
            clockComponent = <Clock time={now}/>;
            break;
        case CLOCK_MODES.SINCE_BOOT:
            clockComponent = <TimeSinceBoot now={now} bootTime={state.lastBootTime} />;
            break;
        case CLOCK_MODES.SINCE_STEAM:
            clockComponent = <TimeSinceSteamStarted now={now} startTime={state.steamStartTime} />;
            break;
        case CLOCK_MODES.SINCE_WAKE:
            clockComponent = <TimeSinceWake now={now} wakeTime={state.lastWakeTime} />;
            break;
        case CLOCK_MODES.SINCE_GAME:
            clockComponent = <TimeSinceGameStarted now={now} startTime={state.gameStartTime} />
            break;
        default:
            clockComponent = <Clock time={now}/>
            break;
    }
    // TODO: Put this in an array of ClockTypes instead of using a switch-case

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

    useEffect(() => {
        async function fetchLastWakeTime() {
            const lastWakeTime = await getLastWakeTime();
            if (lastWakeTime) {
                setState(prev => ({...prev, lastWakeTime}));
            }
        }

        if (!state.lastWakeTime) {
            // Intentionally not awaited
            // noinspection JSIgnoredPromiseFromCall
            fetchLastWakeTime();
            // Usually only called after this plugin is installed mid-session,
            // therefore the handler registered with SteamClient.System.RegisterForOnResumeFromSuspend
            // hasn't been called yet.
            // TODO: Maybe I should return the last boot time if we just booted?
        }
    }, [setState, state.lastWakeTime]);

    // Hide the overlay if we've turned it off
    return state.enabled ? <SincereClockOverlay /> : null;

    // The overlay is in a separate component
    // because you can't call hooks conditionally within a component
    // MagicBlackDecky does the same thing
}
