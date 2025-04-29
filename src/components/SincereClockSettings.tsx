import {
    PanelSection,
    PanelSectionRow,
    Dropdown,
    ToggleField,
    SliderField,
    ColorPickerModal
} from "@decky/ui";
import {usePluginState, ClockPosition} from "../state";
import {useState} from "react";
import {
    POSITION_OPTIONS,
    FONT_SIZE_MIN,
    FONT_SIZE_MAX,
    FONT_SIZE_STEP
} from "../constants";
import "../assets/style.css";

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
                <div className="color-picker-container">
                    <div>Font Color</div>
                    <div
                        onClick={() => setShowFontColorPicker(true)}
                        className="color-swatch"
                        style={{ backgroundColor: state.fontColor }}
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
                <div className="color-picker-container">
                    <div>Background Color</div>
                    <div
                        onClick={() => setShowBgColorPicker(true)}
                        className="color-swatch"
                        style={{ backgroundColor: state.backgroundColor }}
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
