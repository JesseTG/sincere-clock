import {StateManager} from 'cotton-box'
import {useContext, createContext, Dispatch, SetStateAction} from 'react';
import {useStateValue} from "cotton-box-react";
import {
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT_COLOR,
    DEFAULT_BACKGROUND_COLOR,
    DEFAULT_POSITION,
    CLOCK_POSITIONS
} from './constants';

export type ClockPosition = typeof CLOCK_POSITIONS[keyof typeof CLOCK_POSITIONS];

export class State {
    public readonly steamStartTime: Date | null = null;
    public readonly lastBootTime: Date | null = null;
    public readonly lastWakeTime: Date | null = null;
    public readonly gameStartTime: Date | null = null;
    public readonly lastSleepTime: Date | null = null;
    public readonly enabled: boolean = true;

    // Clock customization options
    public readonly fontSize: number = DEFAULT_FONT_SIZE;
    public readonly fontColor = DEFAULT_FONT_COLOR;
    public readonly backgroundColor = DEFAULT_BACKGROUND_COLOR;
    public readonly position: ClockPosition = DEFAULT_POSITION;
}

export type StateSetter<T> = Dispatch<SetStateAction<T>>;

export const PluginContext = createContext(new StateManager<State>({} as State));

export const usePluginState = () => {
    const context = useContext(PluginContext);
    const state = useStateValue(context);

    function setState(setter: (state: State) => State) {
        context.set(setter(context.get()));
    }

    return [state, setState, context] as [State, (setter: (state: State) => State) => void, StateManager<State>];
};
