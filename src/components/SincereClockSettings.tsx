import {
    PanelSection,
    PanelSectionRow,
    Dropdown
} from "decky-frontend-lib";
import {ToggleField, SliderField, ColorPickerModal} from "@decky/ui";
import {usePluginState, ClockPosition} from "../state";
import {useState} from "react";
import {
    POSITION_OPTIONS,
    FONT_SIZE_MIN,
    FONT_SIZE_MAX,
    FONT_SIZE_STEP
} from "../constants";

export function SincereClockSettings() {
    const [state, setState] = usePluginState();
    const [showFontColorPicker, setShowFontColorPicker] = useState(false);
    const [showBgColorPicker, setShowBgColorPicker] = useState(false);

    function handleToggleChange(checked: boolean) {
        setState((prev) => ({...prev, enabled: checked}));
    }

    function handleFontSizeChange(value: number) {
        setState((prev) => ({...prev, fontSize: value}));
    }

    function handleFontColorChange(color: string) {
        setState((prev) => ({...prev, fontColor: color}));
        setShowFontColorPicker(false);
    }

    function handleBgColorChange(color: string) {
        setState((prev) => ({...prev, backgroundColor: color}));
        setShowBgColorPicker(false);
    }

    function handlePositionChange(position: ClockPosition) {
        setState((prev) => ({...prev, position}));
    }

    return (
        <PanelSection title="Sincere Clock">
            <PanelSectionRow>
                <ToggleField
                    label="Enable Clock"
                    checked={state.enabled}
                    onChange={handleToggleChange}
                />
            </PanelSectionRow>

            <PanelSectionRow>
                <SliderField
                    label="Font Size"
                    value={state.fontSize}
                    min={FONT_SIZE_MIN}
                    max={FONT_SIZE_MAX}
                    step={FONT_SIZE_STEP}
                    onChange={handleFontSizeChange}
                />
            </PanelSectionRow>

            <PanelSectionRow>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>Font Color</div>
                    <div
                        onClick={() => setShowFontColorPicker(true)}
                        style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: state.fontColor,
                            border: '1px solid white',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    />
                </div>
                {showFontColorPicker && (
                    <ColorPickerModal
                        closeModal={() => setShowFontColorPicker(false)}
                        onConfirm={handleFontColorChange}
                        //defaultColor={state.fontColor}
                    />
                )}
            </PanelSectionRow>

            <PanelSectionRow>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>Background Color</div>
                    <div
                        onClick={() => setShowBgColorPicker(true)}
                        style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: state.backgroundColor,
                            border: '1px solid white',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    />
                </div>
                {showBgColorPicker && (
                    <ColorPickerModal
                        closeModal={() => setShowBgColorPicker(false)}
                        onConfirm={handleBgColorChange}
                        //defaultColor={state.backgroundColor}
                    />
                )}
            </PanelSectionRow>

            <PanelSectionRow>
                <Dropdown
                    menuLabel="Position"
                    selectedOption={state.position}
                    rgOptions={POSITION_OPTIONS}
                    onChange={(e) => handlePositionChange(e.data as ClockPosition)}
                />
            </PanelSectionRow>
        </PanelSection>
    );
};
