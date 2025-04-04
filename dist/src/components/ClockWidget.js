import React, { useState, useEffect } from "react";
import { TimeDisplay } from "./TimeDisplay";
import "../styles/ClockWidget.css";
export var TimeDisplayMode;
(function (TimeDisplayMode) {
    TimeDisplayMode[TimeDisplayMode["LOCAL_TIME"] = 0] = "LOCAL_TIME";
    TimeDisplayMode[TimeDisplayMode["GAME_SESSION"] = 1] = "GAME_SESSION";
    TimeDisplayMode[TimeDisplayMode["BOOT_TIME"] = 2] = "BOOT_TIME";
    TimeDisplayMode[TimeDisplayMode["WAKE_TIME"] = 3] = "WAKE_TIME";
    TimeDisplayMode[TimeDisplayMode["STEAM_TIME"] = 4] = "STEAM_TIME";
})(TimeDisplayMode || (TimeDisplayMode = {}));
export const ClockWidget = ({ isGameRunning, gameStartTime, steamStartTime, bootTime, wakeTime }) => {
    const [currentDisplay, setCurrentDisplay] = useState(TimeDisplayMode.LOCAL_TIME);
    const [isVisible, setIsVisible] = useState(true);
    // Cycle through display modes
    useEffect(() => {
        const cycleInterval = setInterval(() => {
            setCurrentDisplay((current) => {
                // Skip game session time if no game is running
                if (current === TimeDisplayMode.LOCAL_TIME && !isGameRunning) {
                    return TimeDisplayMode.BOOT_TIME;
                }
                return (current + 1) % Object.keys(TimeDisplayMode).length / 2;
            });
        }, 5000); // Change display every 5 seconds
        return () => clearInterval(cycleInterval);
    }, [isGameRunning]);
    // Force update every second
    useEffect(() => {
        const updateInterval = setInterval(() => {
            // This empty setState forces a re-render
            setIsVisible(true);
        }, 1000);
        return () => clearInterval(updateInterval);
    }, []);
    // Widget toggle handler
    const toggleWidget = () => {
        setIsVisible(!isVisible);
    };
    // Widget display label based on current mode
    const getDisplayLabel = () => {
        switch (currentDisplay) {
            case TimeDisplayMode.LOCAL_TIME:
                return "Local Time";
            case TimeDisplayMode.GAME_SESSION:
                return "Game Session";
            case TimeDisplayMode.BOOT_TIME:
                return "Since Boot";
            case TimeDisplayMode.WAKE_TIME:
                return "Since Wake";
            case TimeDisplayMode.STEAM_TIME:
                return "Steam Running";
            default:
                return "Clock";
        }
    };
    return (React.createElement("div", { className: "clock-widget-container" },
        React.createElement("div", { className: "clock-widget-main" },
            React.createElement("h3", null, "Time Information"),
            React.createElement("div", { className: "clock-display-row" },
                React.createElement("div", { className: "clock-label" }, "Local Time:"),
                React.createElement(TimeDisplay, { mode: TimeDisplayMode.LOCAL_TIME, referenceTime: null })),
            isGameRunning && gameStartTime && (React.createElement("div", { className: "clock-display-row" },
                React.createElement("div", { className: "clock-label" }, "Game Session:"),
                React.createElement(TimeDisplay, { mode: TimeDisplayMode.GAME_SESSION, referenceTime: gameStartTime }))),
            React.createElement("div", { className: "clock-display-row" },
                React.createElement("div", { className: "clock-label" }, "Since Boot:"),
                React.createElement(TimeDisplay, { mode: TimeDisplayMode.BOOT_TIME, referenceTime: bootTime })),
            React.createElement("div", { className: "clock-display-row" },
                React.createElement("div", { className: "clock-label" }, "Since Wake:"),
                React.createElement(TimeDisplay, { mode: TimeDisplayMode.WAKE_TIME, referenceTime: wakeTime })),
            React.createElement("div", { className: "clock-display-row" },
                React.createElement("div", { className: "clock-label" }, "Steam Running:"),
                React.createElement(TimeDisplay, { mode: TimeDisplayMode.STEAM_TIME, referenceTime: steamStartTime }))),
        React.createElement("div", { className: `clock-widget-float ${isVisible ? 'visible' : 'hidden'}`, onClick: toggleWidget },
            React.createElement("div", { className: "clock-widget-label" }, getDisplayLabel()),
            React.createElement(TimeDisplay, { mode: currentDisplay, referenceTime: currentDisplay === TimeDisplayMode.GAME_SESSION ? gameStartTime :
                    currentDisplay === TimeDisplayMode.BOOT_TIME ? bootTime :
                        currentDisplay === TimeDisplayMode.WAKE_TIME ? wakeTime :
                            currentDisplay === TimeDisplayMode.STEAM_TIME ? steamStartTime : null }))));
};
