import { PanelSection, PanelSectionRow } from "decky-frontend-lib";
import React, { useEffect, useState } from "react";
import { ClockWidget } from "./components/ClockWidget";
// Main Plugin Component
export const DeckyDeckClockPlugin = () => {
    // Application state
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [currentGameStartTime, setCurrentGameStartTime] = useState(null);
    const [steamStartTime] = useState(new Date());
    const [bootTime] = useState(new Date());
    const [wakeTime, setWakeTime] = useState(new Date());
    useEffect(() => {
        // Handle game session tracking
        const checkGameStatus = () => {
            // In a real implementation, this would use actual Steam APIs
            // to check if a game is running and get the current game information
            const gameRunning = window.App?.GameSessions?.GetCurrentGameID() !== 0;
            if (gameRunning && !isGameRunning) {
                // Game just started
                setCurrentGameStartTime(new Date());
                setIsGameRunning(true);
            }
            else if (!gameRunning && isGameRunning) {
                // Game just ended
                setIsGameRunning(false);
                setCurrentGameStartTime(null);
            }
        };
        // Setup sleep/wake event listeners
        const handleWake = () => {
            setWakeTime(new Date());
        };
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                handleWake();
            }
        });
        // Check game status periodically
        const interval = setInterval(checkGameStatus, 5000);
        // Initial check
        checkGameStatus();
        // Cleanup
        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleWake);
        };
    }, [isGameRunning]);
    return (React.createElement(PanelSection, { title: "Deck Clock" },
        React.createElement(PanelSectionRow, null,
            React.createElement(ClockWidget, { isGameRunning: isGameRunning, gameStartTime: currentGameStartTime, steamStartTime: steamStartTime, bootTime: bootTime, wakeTime: wakeTime }))));
};
// Server Plugin
export class Plugin {
    constructor(serverAPI) {
        this.serverAPI = serverAPI;
    }
    async register() {
        // Register plugin backend features here
        return {
            success: true
        };
    }
    async unregister() {
        // Clean up plugin backend features here
    }
}
