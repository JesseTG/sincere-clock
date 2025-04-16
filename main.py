#!/usr/bin/env python3

import time
from typing import TypedDict
from decky import logger

class Times(TypedDict):
    """Type for time tracking data"""
    boot_time: float
    wake_time: float
    steam_start_time: float

class Plugin:

    async def _main(self):
        logger.info("Plugin started")
        pass

    # Function used to clean up a plugin when it's told to unload by Decky-Loader
    async def _unload(self):
        logger.info("Plugin unloaded")
        pass

    async def get_time_since_boot(self):
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

    async def get_time_since_game_start(self):
        pass

    async def get_time_since_steam_start(self):
        pass

    async def get_time_since_wake(self):
        pass

    async def get_time_since_plugin_start(self):
        pass

    async def get_time_data(self) -> Times:
        """Get all time tracking data"""
        return Times(
            boot_time=Plugin.__instance.boot_time,
            wake_time=Plugin.__instance.wake_time,
            steam_start_time=Plugin.__instance.steam_start_time
        )




if __name__ == "__main__":
    raise RuntimeError("This script is a backend for a Decky plugin, and is not meant to be run directly.")