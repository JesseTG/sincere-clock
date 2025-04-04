import React, { useState, useEffect } from "react";
import { TimeDisplay } from "./TimeDisplay";
import "../styles/ClockWidget.css";

export enum TimeDisplayMode {
  LOCAL_TIME,
  GAME_SESSION,
  BOOT_TIME,
  WAKE_TIME,
  STEAM_TIME
}

interface ClockWidgetProps {
  isGameRunning: boolean;
  gameStartTime: Date | null;
  steamStartTime: Date;
  bootTime: Date;
  wakeTime: Date;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({
  isGameRunning,
  gameStartTime,
  steamStartTime,
  bootTime,
  wakeTime
}) => {
  const [currentDisplay, setCurrentDisplay] = useState<TimeDisplayMode>(TimeDisplayMode.LOCAL_TIME);
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
  const getDisplayLabel = (): string => {
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

  return (
    <div className="clock-widget-container">
      {/* Main QuickAccess view */}
      <div className="clock-widget-main">
        <h3>Time Information</h3>
        
        <div className="clock-display-row">
          <div className="clock-label">Local Time:</div>
          <TimeDisplay mode={TimeDisplayMode.LOCAL_TIME} referenceTime={null} />
        </div>
        
        {isGameRunning && gameStartTime && (
          <div className="clock-display-row">
            <div className="clock-label">Game Session:</div>
            <TimeDisplay mode={TimeDisplayMode.GAME_SESSION} referenceTime={gameStartTime} />
          </div>
        )}
        
        <div className="clock-display-row">
          <div className="clock-label">Since Boot:</div>
          <TimeDisplay mode={TimeDisplayMode.BOOT_TIME} referenceTime={bootTime} />
        </div>
        
        <div className="clock-display-row">
          <div className="clock-label">Since Wake:</div>
          <TimeDisplay mode={TimeDisplayMode.WAKE_TIME} referenceTime={wakeTime} />
        </div>
        
        <div className="clock-display-row">
          <div className="clock-label">Steam Running:</div>
          <TimeDisplay mode={TimeDisplayMode.STEAM_TIME} referenceTime={steamStartTime} />
        </div>
      </div>
      
      {/* Floating widget for corner display */}
      <div className={`clock-widget-float ${isVisible ? 'visible' : 'hidden'}`} onClick={toggleWidget}>
        <div className="clock-widget-label">{getDisplayLabel()}</div>
        <TimeDisplay 
          mode={currentDisplay} 
          referenceTime={
            currentDisplay === TimeDisplayMode.GAME_SESSION ? gameStartTime :
            currentDisplay === TimeDisplayMode.BOOT_TIME ? bootTime :
            currentDisplay === TimeDisplayMode.WAKE_TIME ? wakeTime :
            currentDisplay === TimeDisplayMode.STEAM_TIME ? steamStartTime : null
          } 
        />
      </div>
    </div>
  );
};
