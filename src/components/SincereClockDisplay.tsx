import {findModuleChild,
} from "@decky/ui";
import {State, StateSetter, usePluginState, ClockPosition} from "../state";
import {CSSProperties, useEffect} from "react";

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

    const now = new Date(); // TODO: Get the time from one of the Python backend functions
    const positionClass = getPositionClass(state.position);

    const dynamicStyle: CSSProperties = {
        backgroundColor: state.backgroundColor,
        color: state.fontColor,
        fontSize: `${state.fontSize}px`,
    };

    return (
        <div
            style={dynamicStyle}
            id="sincere-clock-overlay"
            className={positionClass}
        >
            {now.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", second: "2-digit"})}
        </div>
    );
}

export default function SincereClockDisplay() {
    const [state, setState] = usePluginState();

    // Hide the overlay if we've turned it off
    return state.enabled ? <SincereClockOverlay /> : null;

    // The overlay is in a separate component
    // because you can't call hooks conditionally within a component
    // MagicBlackDecky does the same thing
}
