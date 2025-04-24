import {SteamClient} from "steam-types";
import {definePlugin, ServerAPI, Plugin} from "decky-frontend-lib";
import {FaStopwatch} from "react-icons/fa6";
import {staticClasses} from "@decky/ui";
import {routerHook} from "@decky/api";
import {GlobalComponentName} from "./constants";
import {PluginContext, State} from "./state";
import SincereClockDisplay from "./components/SincereClockDisplay";
import {SincereClockSettings} from "./components/SincereClockSettings";
import {StateManager} from "cotton-box";

// noinspection JSUnusedGlobalSymbols
export default definePlugin((_serverAPI: ServerAPI): Plugin => {
    const state = new StateManager<State>(new State());

    const unwatch = state.watch((context, eventType) => {
        console.debug("State updated:", eventType, context);
    });

    routerHook.addGlobalComponent(GlobalComponentName, () => {
        return (
            <PluginContext.Provider value={state}>
                <SincereClockDisplay/>
            </PluginContext.Provider>
        );
    });

    const suspendRegistration = SteamClient.System.RegisterForOnSuspendRequest(() => {
        const now = new Date();
        console.debug("[SincereClock] Suspending at", now);
        state.set(prev => ({...prev, lastBootTime: now}));
    });

    const wakeRegistration = SteamClient.System.RegisterForOnResumeFromSuspend(() => {
        const now = new Date();
        console.debug("[SincereClock] Waking up at", now);
        state.set(prev => ({...prev, lastWakeTime: now}));
    });

    return {
        title: <div className={staticClasses.Title}>Sincere Clock</div>,
        content:
            <PluginContext.Provider value={state}>
                <SincereClockSettings/>
            </PluginContext.Provider>,
        icon: <FaStopwatch/>,
        onDismount() {
            wakeRegistration.unregister();
            suspendRegistration.unregister();
            routerHook.removeGlobalComponent(GlobalComponentName);
            unwatch();
        },
    };
});
