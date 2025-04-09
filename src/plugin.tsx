import {
  ServerAPI,
  PanelSection,
  PanelSectionRow
} from "decky-frontend-lib";
import React, { useEffect, useState } from "react";
import { ClockWidget } from "./components/ClockWidget";

// Main Plugin Component
export const SincereClockPlugin: React.FC = () => {
  // Application state
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [currentGameStartTime, setCurrentGameStartTime] = useState<Date | null>(null);
  const [steamStartTime] = useState<Date>(new Date());
  const [bootTime] = useState<Date>(new Date());
  const [wakeTime, setWakeTime] = useState<Date>(new Date());

  useEffect(() => {
    // Handle game session tracking
    const checkGameStatus = () => {
      // In a real implementation, this would use actual Steam APIs
      // to check if a game is running and get the current game information
      const gameRunning = (window as any).App?.GameSessions?.GetCurrentGameID() !== 0;

      if (gameRunning && !isGameRunning) {
        // Game just started
        setCurrentGameStartTime(new Date());
        setIsGameRunning(true);
      } else if (!gameRunning && isGameRunning) {
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

  return (
    <PanelSection title="Deck Clock">
      <PanelSectionRow>
        <ClockWidget
          isGameRunning={isGameRunning}
          gameStartTime={currentGameStartTime}
          steamStartTime={steamStartTime}
          bootTime={bootTime}
          wakeTime={wakeTime}
        />
      </PanelSectionRow>
    </PanelSection>
  );
};

// Server Plugin
export class Plugin {
  private serverAPI: ServerAPI;

  constructor(serverAPI: ServerAPI) {
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
