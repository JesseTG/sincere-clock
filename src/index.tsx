import {definePlugin, ServerAPI, Plugin} from "decky-frontend-lib";
import {FaStopwatch} from "react-icons/fa6";
import {SincereClockPlugin} from "./plugin";
import {staticClasses} from "@decky/ui";
import {routerHook} from "@decky/api";
import {GlobalComponentName} from "./constants";
import {StateManager} from "cotton-box";
import {PluginContext, State} from "./state";

// noinspection JSUnusedGlobalSymbols
export default definePlugin((_serverAPI: ServerAPI): Plugin => {
    // TODO: Define the plugin's state after I get something rendering outside the quick menu
    const state = new StateManager<State>({});

    state.watch(({}) => {
        // TODO: Implement
    });

    routerHook.addGlobalComponent(GlobalComponentName, () => {
        return (
            <PluginContext.Provider value={state}>
                <b style={{"color": "red"}}>Hello!</b>;
            </PluginContext.Provider>
        );
    });

    return {
        title: <div className={staticClasses.Title}>Sincere Clock</div>,
        content:
            <PluginContext.Provider value={state}>
                <b style={{"color": "blue"}}>France</b>;
                <SincereClockPlugin/>
            </PluginContext.Provider>,
        icon: <FaStopwatch/>,
        onDismount() {
            routerHook.removeGlobalComponent(GlobalComponentName);
            // Plugin cleanup code
        },
    };
});
