import {findModuleChild,
} from "@decky/ui";
import {State, StateSetter, usePluginState, ClockPosition} from "../state";
import {CSSProperties, useEffect} from "react";
import {localTime} from "../utils/timeUtils";

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

export type SincereClockDisplayProps = {
    onClockTick: () => string;
};

function SincereClockOverlay(props: SincereClockDisplayProps) {
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

    return (
        <div
            style={dynamicStyle}
            id="sincere-clock-overlay"
            className={positionClass}
        >
            {props.onClockTick()}
        </div>
        // TODO: Use Intl.DateTimeFormat to internationalize the time display
    );
}

export default function SincereClockDisplay() {
    const [state, setState] = usePluginState();

    // Hide the overlay if we've turned it off
    return state.enabled ? <SincereClockOverlay onClockTick={localTime} /> : null;

    // The overlay is in a separate component
    // because you can't call hooks conditionally within a component
    // MagicBlackDecky does the same thing
}
