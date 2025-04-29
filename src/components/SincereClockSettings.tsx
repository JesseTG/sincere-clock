import {
    PanelSection,
    PanelSectionRow,
    Dropdown,
    ToggleField,
    SliderField,
    ColorPickerModal,
    Field,
    showModal
} from "@decky/ui";
import {usePluginState, ClockPosition} from "../state";
import {useState} from "react";
import Color from "color";
import {
    POSITION_OPTIONS,
    FONT_SIZE_MIN,
    FONT_SIZE_MAX,
    FONT_SIZE_STEP
} from "../constants";

export function SincereClockSettings() {
    const [state, setState] = usePluginState();

    function handleToggleChange(checked: boolean) {
        setState((prev) => ({...prev, enabled: checked}));
    }

    function handleFontSizeChange(value: number) {
        setState((prev) => ({...prev, fontSize: value}));
    }

    function noop() {}

    function handleShowBgColorModal(_: CustomEvent | MouseEvent) {
        function handleBgColorChange(color: string) {
            setState((prev) => ({...prev, backgroundColor: Color(color)}));
        }

        const result = showModal(<ColorPickerModal
            onConfirm={handleBgColorChange}
            closeModal={noop}
            title={"Background Color"}
            defaultH={state.fontColor.hue()}
            defaultS={state.fontColor.saturationl()}
            defaultL={state.fontColor.lightness()}
            defaultA={state.fontColor.alpha()}
        />);
    }

    function handleShowFontColorModal(_: CustomEvent | MouseEvent) {
        function handleFontColorChange(color: string) {
            setState((prev) => ({...prev, fontColor: Color(color)}));
        }

        const result = showModal(<ColorPickerModal
            onConfirm={handleFontColorChange}
            closeModal={noop}
            title={"Font Color"}
            defaultH={state.fontColor.hue()}
            defaultS={state.fontColor.saturationl()}
            defaultL={state.fontColor.lightness()}
            defaultA={state.fontColor.alpha()}
        />);
    }

    function handlePositionChange(position: ClockPosition) {
        setState((prev) => ({...prev, position}));
    }

    const swatchPreviewStyle = {
        width: '24px',
        height: '24px',
        border: '1px solid white',
        borderRadius: '4px',
        cursor: 'pointer'
    }; // TODO: I want to move this to the CSS,
    // but the Quick Access Menu has its own Window
    // and I don't know how to get it

    // TODO: Add a reset button to reset the colors to default
    return (
        <div id={"sincere-clock-settings"}>
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
                    <Field label='Font Color' onActivate={handleShowFontColorModal}>
                        <div className={"color-picker-swatch"}
                             style={{
                                 ...swatchPreviewStyle,
                                 backgroundColor: state.fontColor.toString(),
                             }}
                        />
                    </Field>
                </PanelSectionRow>

                <PanelSectionRow>
                    <Field label='Background Color' onActivate={handleShowBgColorModal}>
                        <div className={"color-picker-swatch"}
                             style={{
                                 ...swatchPreviewStyle,
                                 backgroundColor: state.backgroundColor.toString(),
                             }}
                        />
                    </Field>
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
        </div>
    );
}
