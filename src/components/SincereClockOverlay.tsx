import {usePluginState} from "../state";
import {
    Router,
    WindowRouter,
    getGamepadNavigationTrees, findModuleChild,
} from "@decky/ui";

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
        for (let prop in m) {
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

export default function SincereClockOverlay() {
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
        }} />
    );
}