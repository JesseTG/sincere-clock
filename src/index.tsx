import React from "react";
import { definePlugin } from "decky-frontend-lib";
import { FaRegClock } from "react-icons/fa";
import {SincereClockPlugin} from "./plugin";

export default definePlugin(() => {
  return {
    title: "Sincere Clock",
    content: <SincereClockPlugin />,
    icon: <FaRegClock />,
    onDismount() {
      // Plugin cleanup code
    },
  };
});
