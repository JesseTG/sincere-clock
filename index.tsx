import React from "react";
import { definePlugin } from "decky-frontend-lib";
import { FaRegClock } from "react-icons/fa";
import { DeckyDeckClockPlugin } from "./src/index";

export default definePlugin(() => {
  return {
    title: "Decky Deck Clock",
    content: <DeckyDeckClockPlugin />,
    icon: <FaRegClock />,
    onDismount() {
      // Plugin cleanup code
    },
  };
});
