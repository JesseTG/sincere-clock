import React, { useEffect, useState } from "react";
import { TimeDisplayMode } from "./ClockWidget";
import { formatElapsedTime, formatLocalTime } from "../utils/timeUtils";

interface TimeDisplayProps {
  mode: TimeDisplayMode;
  referenceTime: Date | null;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({ mode, referenceTime }) => {
  const [currentTime, setCurrentTime] = useState<string>("");
  
  useEffect(() => {
    // Update time immediately
    updateTime();
    
    // Then update each second
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [mode, referenceTime]);
  
  const updateTime = () => {
    switch (mode) {
      case TimeDisplayMode.LOCAL_TIME:
        setCurrentTime(formatLocalTime(new Date()));
        break;
      case TimeDisplayMode.GAME_SESSION:
        if (referenceTime) {
          setCurrentTime(formatElapsedTime(referenceTime));
        } else {
          setCurrentTime("No game running");
        }
        break;
      case TimeDisplayMode.BOOT_TIME:
        if (referenceTime) {
          setCurrentTime(formatElapsedTime(referenceTime));
        }
        break;
      case TimeDisplayMode.WAKE_TIME:
        if (referenceTime) {
          setCurrentTime(formatElapsedTime(referenceTime));
        }
        break;
      case TimeDisplayMode.STEAM_TIME:
        if (referenceTime) {
          setCurrentTime(formatElapsedTime(referenceTime));
        }
        break;
      default:
        setCurrentTime("--:--:--");
    }
  };
  
  return (
    <div className="time-display">
      {currentTime}
    </div>
  );
};
