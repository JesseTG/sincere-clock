import {findModuleChild,
} from "@decky/ui";
import {State, StateSetter, usePluginState, ClockPosition} from "../state";
import {CSSProperties, useEffect} from "react";
import {
    CLOCK_PADDING,
    CLOCK_BORDER_RADIUS,
    CLOCK_Z_INDEX,
    POSITION_OFFSET
} from "../constants";

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

function getPositionStyle(position: ClockPosition): CSSProperties {
    switch (position) {
        case 'top-left':
            return { top: POSITION_OFFSET, left: POSITION_OFFSET };
        case 'top-center':
            return { top: POSITION_OFFSET, left: '50%', transform: 'translateX(-50%)' };
        case 'top-right':
            return { top: POSITION_OFFSET, right: POSITION_OFFSET };
        case 'bottom-left':
            return { bottom: POSITION_OFFSET, left: POSITION_OFFSET };
        case 'bottom-center':
            return { bottom: POSITION_OFFSET, left: '50%', transform: 'translateX(-50%)' };
        case 'bottom-right':
            return { bottom: POSITION_OFFSET, right: POSITION_OFFSET };
        default:
            return { top: POSITION_OFFSET, right: POSITION_OFFSET };
    }
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
    const positionStyle = getPositionStyle(state.position);

    const style: CSSProperties = {
        width: "20vw",
        height: "fit-content",
        background: state.backgroundColor,
        color: state.fontColor,
        fontSize: `${state.fontSize}px`,
        zIndex: CLOCK_Z_INDEX, // Less than MagicBlackDecky's z-value of 7002, so that'll be on top
        position: "fixed",
        pointerEvents: "none",
        padding: CLOCK_PADDING,
        borderRadius: CLOCK_BORDER_RADIUS,
        ...positionStyle
    };

    return (
        <div style={style} id={"sincere-clock-overlay"}>
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
