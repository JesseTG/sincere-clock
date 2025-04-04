import React from "react";
import { definePlugin } from "decky-frontend-lib";
import { FaRegClock } from "react-icons/fa";
import { DeckyDeckClockPlugin } from "./src/index";
export default definePlugin(() => {
    return {
        title: "Decky Deck Clock",
        content: React.createElement(DeckyDeckClockPlugin, null),
        icon: React.createElement(FaRegClock, null),
        onDismount() {
            // Plugin cleanup code
        },
    };
});
