import { definePlugin, ServerAPI, Plugin } from "decky-frontend-lib";
import { FaRegClock } from "react-icons/fa";
import {SincereClockPlugin} from "./plugin";
import {staticClasses} from "@decky/ui";

// noinspection JSUnusedGlobalSymbols
export default definePlugin((_serverAPI: ServerAPI): Plugin => {
  return {
    title: <div className={staticClasses.Title}>Sincere Clock</div>,
    content: <SincereClockPlugin />,
    icon: <FaRegClock />,
    onDismount() {
      // Plugin cleanup code
    },
  };
});
