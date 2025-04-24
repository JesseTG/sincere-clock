import {
    PanelSection,
    PanelSectionRow
} from "decky-frontend-lib";
import {ToggleField} from "@decky/ui";
import {usePluginState} from "../state";

export function SincereClockSettings() {
    const [state, setState] = usePluginState();

    function handleToggleChange(checked: boolean) {
        setState((prev) => ({...prev, enabled: checked}));
    }

    return (
        <PanelSection title="Sincere Clock">
            <PanelSectionRow>
                <ToggleField checked={state.enabled} onChange={handleToggleChange}/>
            </PanelSectionRow>
        </PanelSection>
    );
};
