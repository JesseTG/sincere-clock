import {findModuleChild,
} from "@decky/ui";
import {State, StateSetter, usePluginState} from "../state";

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

function SincereClockOverlay() {
    const [state, setState] = usePluginState();

    useUIComposition(UIComposition.Notification);


    return (
        <div style={{
            height: "1em",
            width: "5vw",
            background: "green",
            opacity: 0.7,
            zIndex: 7002,
            position: "fixed",
            pointerEvents: "none"
        }}/>
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