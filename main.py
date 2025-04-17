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

class Plugin:
    def __init__(self):
        logger.debug("Initializing Sincere Clock")
        self._plugin_start_time: datetime = datetime.now(UTC)

    async def _main(self):
        logger.debug(f"Python version {sys.version}")
        logger.debug(f"ppid: {os.getppid()}")
        logger.info("Plugin started")
        pass

    # Function used to clean up a plugin when it's told to unload by Decky-Loader
    async def _unload(self):
        logger.info("Plugin unloaded")
        pass

    def _get_boot_time(self):
        # TODO: Check /proc/stat
        return 0

    def _get_game_start_time(self):
        # TODO: Get the time that the current game started
        return None

    def _get_steam_start_time(self):
        # TODO: Get the time that Steam started
        # TODO: Open "~/.steampid"
        # TODO: Open "/home/deck/.steam/steam.pid" if the first one doesn't exist
        # TODO: Read the file to get the PID of Steam
        # TODO: Ensure that the PID still exists
        # TODO: Read /proc/<pid>/stat to get the start time
        return 0

    def _get_last_wake_time(self):
        # TODO: Figure out how to tell when the Deck was last woken up
        return 0

    async def get_start_times(self) -> Times:
        """Get all time tracking data"""
        return Times(
            plugin_start_time=int(self._plugin_start_time.timestamp() * 1000),
            boot_time=self._get_boot_time(),
            game_start_time=self._get_game_start_time(),
            steam_start_time=self._get_steam_start_time(),
            last_wake_time=self._get_last_wake_time(),
        )


if __name__ == "__main__":
    raise RuntimeError("This script is a backend for a Decky plugin, and is not meant to be run directly.")