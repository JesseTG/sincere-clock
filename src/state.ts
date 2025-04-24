import {StateManager} from 'cotton-box'
import {useContext, createContext, Dispatch, SetStateAction} from 'react';
import {useStateValue} from "cotton-box-react";

export class State {
    public readonly steamStartTime: Date | null = null;
    public readonly lastBootTime: Date | null = null;
    public readonly lastWakeTime: Date | null = null;
    public readonly gameStartTime: Date | null = null;
    public readonly lastSleepTime: Date | null = null;
    public readonly enabled: boolean = true;
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