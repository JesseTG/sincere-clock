#!/usr/bin/env python3

import os
import time
import logging
from logging.handlers import RotatingFileHandler

# Setup logger
log_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "logs")
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, "decky_deck_clock.log")

logger = logging.getLogger("decky_deck_clock")
logger.setLevel(logging.INFO)

handler = RotatingFileHandler(
    log_file,
    maxBytes=1024 * 1024,  # 1MB
    backupCount=3,
    encoding="utf-8"
)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

class Plugin:
    """
    Decky Deck Clock Plugin Backend
    
    This handles any backend logic for the clock widget
    """
    
    # Singleton plugin instance
    __instance = None

    def __init__(self):
        if Plugin.__instance is not None:
            raise Exception("Plugin class is a singleton!")
        
        Plugin.__instance = self
        self.boot_time = time.time()
        self.wake_time = time.time()
        self.steam_start_time = time.time()
        logger.info("Plugin initialized")
    
    @staticmethod
    async def get_boot_time():
        """Get the system boot time"""
        try:
            # This works on Linux systems
            with open('/proc/uptime', 'r') as f:
                uptime_seconds = float(f.readline().split()[0])
            
            boot_time = time.time() - uptime_seconds
            return {"success": True, "boot_time": boot_time}
        except Exception as e:
            logger.error(f"Error getting boot time: {str(e)}")
            return {"success": False, "error": str(e)}
    
    @staticmethod
    async def set_wake_time():
        """Update the wake time (called when system wakes from sleep)"""
        try:
            if Plugin.__instance:
                Plugin.__instance.wake_time = time.time()
                logger.info("Wake time updated")
            return {"success": True}
        except Exception as e:
            logger.error(f"Error setting wake time: {str(e)}")
            return {"success": False, "error": str(e)}

    @staticmethod
    async def get_time_data():
        """Get all time tracking data"""
        try:
            if not Plugin.__instance:
                return {"success": False, "error": "Plugin not initialized"}
            
            return {
                "success": True, 
                "boot_time": Plugin.__instance.boot_time,
                "wake_time": Plugin.__instance.wake_time,
                "steam_start_time": Plugin.__instance.steam_start_time
            }
        except Exception as e:
            logger.error(f"Error getting time data: {str(e)}")
            return {"success": False, "error": str(e)}


if __name__ == "__main__":
    raise RuntimeError("This script is a backend for a Decky plugin, and is not meant to be run directly.")