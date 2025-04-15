import { StateManager } from 'cotton-box';
import { useContext, createContext } from 'react';
import { useStateValue } from 'cotton-box-react';

export type State = {

}

export type StateSetter = (setter: (state: State) => State) => void;

export const PluginContext = createContext(new StateManager<State>({} as State));

export const usePluginState = () => {
    const context = useContext(PluginContext);
    const state = useStateValue(context);

    const setState = (setter: (state: State) => State) =>
        context.set(setter(context.get()));

    return [state, setState, context] as [State, StateSetter, StateManager<State>];
};