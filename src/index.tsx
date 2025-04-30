import {SteamClient} from "steam-types";
import {FaStopwatch} from "react-icons/fa6";
import {staticClasses, findSP} from "@decky/ui";
import {routerHook, definePlugin, Plugin} from "@decky/api";
import {GlobalComponentName} from "./constants";
import {PluginContext, State} from "./state";
import SincereClockDisplay from "./components/SincereClockDisplay";
import {SincereClockSettings} from "./components/SincereClockSettings";
import {StateManager} from "cotton-box";

import manifest from "../package.json" with { type: "json" };
import styles from "../defaults/style.css";
import {Temporal} from "temporal-polyfill";

// noinspection JSUnusedGlobalSymbols
export default definePlugin((): Plugin => {
    const state = new StateManager<State>(new State());
    const spWindow = findSP();
    const link = spWindow.document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = styles;
    console.log(link, styles);
    spWindow.document.head.appendChild(link);

    routerHook.addGlobalComponent(GlobalComponentName, () => {
        return (
            <PluginContext.Provider value={state}>
                <SincereClockDisplay/>
            </PluginContext.Provider>
        );
    });

    const suspendRegistration = SteamClient.System.RegisterForOnSuspendRequest(() => {
        const now = Temporal.Now.instant();
        console.debug("[SincereClock] Suspending at", now);
        state.set(prev => ({...prev, lastSleepTime: now}));
    });

    const wakeRegistration = SteamClient.System.RegisterForOnResumeFromSuspend(() => {
        const now = Temporal.Now.instant();
        console.debug("[SincereClock] Waking up at", now);
        state.set(prev => ({...prev, lastWakeTime: now}));
    });

    return {
        name: "Sincere Clock",
        version: manifest.version,
        titleView: <div className={staticClasses.Title}>Sincere Clock</div>,
        content:
            <PluginContext.Provider value={state}>
                <SincereClockSettings/>
            </PluginContext.Provider>,
        icon: <FaStopwatch/>,
        onDismount() {
            wakeRegistration.unregister();
            suspendRegistration.unregister();
            routerHook.removeGlobalComponent(GlobalComponentName);
            link.remove();
        },
    };
});
