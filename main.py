#!/usr/bin/env python3
import logging
import sys
import os
import datetime
from datetime import datetime, UTC
from typing import TypedDict, Optional
import decky
from decky import logger
from settings import SettingsManager

# Setup backend logger
logger.setLevel(logging.DEBUG)
logger.info("[backend] Settings path: {}".format(decky.DECKY_PLUGIN_SETTINGS_DIR))
settings = SettingsManager(name="settings", settings_directory=decky.DECKY_PLUGIN_SETTINGS_DIR)
settings.read()

class Times(TypedDict):
    boot_time: int
    game_start_time: Optional[int]
    steam_start_time: int
    last_wake_time: int
    plugin_start_time: int


def get_steam_start_time():
    try:
        # Open "~/.steampid"
        steam_pid_path = os.path.expanduser("~/.steampid")
        # Open "/home/deck/.steam/steam.pid" if the first one doesn't exist
        if not os.path.exists(steam_pid_path):
            steam_pid_path = "/home/deck/.steam/steam.pid"

        if not os.path.exists(steam_pid_path):
            logger.warning(f"Steam PID file not found at {steam_pid_path}")
            return 0

        # Read the file to get the PID of Steam
        with open(steam_pid_path, 'r') as f:
            steam_pid = int(f.read().strip())

        # Ensure that the PID still exists
        if not os.path.exists(f"/proc/{steam_pid}"):
            logger.warning(f"Steam process with PID {steam_pid} not found")
            return 0

        # Read /proc/<pid>/stat
        with open(f"/proc/{steam_pid}/stat", 'r') as f:
            stat_data = f.read().strip()

        # Parse stat data (handling command with spaces in parentheses)
        stat_parts = stat_data.split(')')
        if len(stat_parts) < 2:
            logger.warning(f"Invalid stat data format for PID {steam_pid}")
            return 0

        stat_values = stat_parts[1].strip().split()

        # Read the "starttime" field (#22, 1-indexed, which is index 21 in 0-indexed array)
        # But due to our special parsing for the command name, we need to adjust
        start_time_ticks = int(stat_values[19])  # 22 - 2 = 20, then 0-indexed = 19

        # Get clock ticks per second
        clock_ticks = os.sysconf(os.sysconf_names['SC_CLK_TCK'])

        if clock_ticks <= 0:
            logger.warning("Invalid clock ticks value: {}".format(clock_ticks))
            return 0

        # Get system boot time
        with open("/proc/stat", 'r') as f:
            for line in f:
                if line.startswith("btime "):
                    boot_time_secs = int(line.split()[1])
                    break
            else:
                logger.warning("Could not find boot time in /proc/stat")
                return 0

        # Convert the "starttime" field from clock ticks to milliseconds since epoch
        start_time_secs = boot_time_secs + (start_time_ticks / clock_ticks)
        start_time_ms = int(start_time_secs * 1000)

        return start_time_ms

    except Exception as e:
        logger.error(f"Error getting Steam start time: {e}")
        return 0


class Plugin:
    def __init__(self):
        logger.debug("Initializing Sincere Clock")
        logger.debug(f"Python version {sys.version}")
        logger.debug(f"ppid: {os.getppid()}")
        logger.info("Plugin started")
        self._plugin_start_time: datetime = datetime.now(UTC)

    def _get_boot_time(self):
        # TODO: Check /proc/stat
        return 0

    def _get_game_start_time(self):
        # TODO: Get the time that the current game started
        return None

    def _get_last_wake_time(self):
        # TODO: Figure out how to tell when the Deck was last woken up
        return 0

    async def get_start_times(self) -> Times:
        """Get all time tracking data"""
        return Times(
            plugin_start_time=int(self._plugin_start_time.timestamp() * 1000),
            boot_time=self._get_boot_time(),
            game_start_time=self._get_game_start_time(),
            steam_start_time=get_steam_start_time(),
            last_wake_time=self._get_last_wake_time(),
        )


if __name__ == "__main__":
    raise RuntimeError("This script is a backend for a Decky plugin, and is not meant to be run directly.")
