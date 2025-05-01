import {findModuleChild,
} from "@decky/ui";
import {usePluginState, ClockPosition} from "../state";
import {CSSProperties, useEffect} from "react";
import {format, localTime} from "../utils/timeUtils";
import {getBootTime, getSteamStartTime} from "../utils/backend";
import { Temporal } from "temporal-polyfill";

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

    useUIComposition(UIComposition.Notification);

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

    const now = Temporal.Now.instant();
    const timeString = format(now);

    return (
        <div
            style={dynamicStyle}
            id="sincere-clock-overlay"
            className={positionClass}
        >
            {timeString}
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

        if (!state.lastBootTime) {
            fetchBootTime();
        }

        if (!state.steamStartTime) {
            fetchSteamStartTime();
        }
    }, [setState, state.lastBootTime, state.steamStartTime]);

    // Hide the overlay if we've turned it off
    return state.enabled ? <SincereClockOverlay /> : null;

    // The overlay is in a separate component
    // because you can't call hooks conditionally within a component
    // MagicBlackDecky does the same thing
}
