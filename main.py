#!/usr/bin/env python3
import asyncio
import json
import logging
import subprocess
from datetime import datetime, timezone

import sys
import os
from typing import Optional, Any
import decky
from decky import logger
from settings import SettingsManager

# Setup backend logger
logger.setLevel(logging.DEBUG)
logger.info("[backend] Settings path: {}".format(decky.DECKY_PLUGIN_SETTINGS_DIR))
settings = SettingsManager(name="settings", settings_directory=decky.DECKY_PLUGIN_SETTINGS_DIR)
settings.read()


def get_game_pid() -> int | None:
    try:
        with subprocess.run(["pgrep", "--full", "--oldest", f"/reaper\\s.*\\bAppId=\\d+\\b"], stdout=subprocess.PIPE) as p:
            pid = p.stdout.read().strip()

        if pid:
            return int(pid)
    except ValueError:
        # No game is running, this is normal
        return None
    except subprocess.SubprocessError as e:
        logger.error(f"Error getting game PID: {e}")

    return None

def get_steam_pid() -> Optional[int]:
    # Open "~/.steampid"
    steam_pid_path = os.path.expanduser("~/.steampid")

    # Open "/home/deck/.steam/steam.pid" if the first one doesn't exist
    if not os.path.exists(steam_pid_path):
        steam_pid_path = "/home/deck/.steam/steam.pid"

    if not os.path.exists(steam_pid_path):
        logger.warning(f"Steam PID file not found at {steam_pid_path}")
        return None

    # Read the file to get the PID of Steam
    with open(steam_pid_path, 'r') as f:
        steam_pid = int(f.read().strip())

    # Ensure that the PID still exists
    if not os.path.exists(f"/proc/{steam_pid}"):
        logger.warning(f"Steam process with PID {steam_pid} not found")
        return None

    return steam_pid

def get_boot_time() -> Optional[datetime]:
    # Read the kernel/system stats from /proc/stat
    with open("/proc/stat", 'r') as f:
        for line in f:
            if line.startswith("btime "):
                boot_time_secs = int(line.split()[1])
                return datetime.fromtimestamp(boot_time_secs, timezone.utc)
        else:
            logger.warning("Could not find boot time in /proc/stat")
            return None

def get_process_start_time(pid: int) -> Optional[datetime]:
    try:
        # Read /proc/<pid>/stat
        with open(f"/proc/{pid}/stat", 'r') as f:
            stat_data = f.read().strip()

        # Parse stat data (handling command with spaces in parentheses)
        stat_parts = stat_data.split(')')
        if len(stat_parts) < 2:
            logger.warning(f"Invalid stat data format for PID {pid}")
            return None

        stat_values = stat_parts[1].strip().split()

        # Read the "starttime" field (#22, 1-indexed, which is index 21 in 0-indexed array)
        # But due to our special parsing for the command name, we need to adjust
        start_time_ticks = int(stat_values[19])  # 22 - 2 = 20, then 0-indexed = 19

        # Get clock ticks per second
        clock_ticks = os.sysconf(os.sysconf_names['SC_CLK_TCK'])

        if clock_ticks <= 0:
            logger.warning("Invalid clock ticks value: {}".format(clock_ticks))
            return None

        # Get system boot time
        with open("/proc/stat", 'r') as f:
            for line in f:
                if line.startswith("btime "):
                    boot_time_secs = int(line.split()[1])
                    break
            else:
                logger.warning("Could not find boot time in /proc/stat")
                return None

        # Convert the "starttime" field from clock ticks to seconds since epoch
        start_time_secs = boot_time_secs + (start_time_ticks / clock_ticks)

        return datetime.fromtimestamp(start_time_secs, timezone.utc)

    except Exception as e:
        logger.error(f"Error getting process start time: {e}")
        return None

class Plugin:
    def __init__(self):
        logger.debug("Initializing Sincere Clock")
        logger.debug(f"Python version {sys.version}")
        logger.debug(f"ppid: {os.getppid()}")
        logger.info("Plugin started")
        self._plugin_start_time: datetime = datetime.now(timezone.utc)
        self.loop = asyncio.get_event_loop()

    async def _main(self):
        # I could keep track of when the system was last awoken
        # by watching for large gaps in the clock,
        # even though the frontend uses SteamClient.System.RegisterForOnSuspendRequest.
        # That way the wake-time clock would accurate even if
        # the Deck is awoken by means other than Steam.
        # However, this won't handle the case where
        # the Deck was most recently awoken before this plugin was installed.
        # I would use journalctl to find out when the Deck was last awoken from sleep mode,
        # but that would require root access, and I don't want to ask for that.
        # It probably won't be common unless I update this plugin frequently
        # or it's frequently reinstalled.
        # Not worth it for now.
        pass

    @staticmethod
    async def get_boot_time() -> Optional[str]:
        """Get the boot time of the system"""
        boot_time = get_boot_time()
        return boot_time.isoformat() if boot_time else None

    @staticmethod
    async def get_game_start_time() -> Optional[str]:
        """Get the start time of the game"""
        game_pid = get_game_pid()
        if not game_pid:
            return None

        # TODO: I don't want to count time suspended
        start_time = get_process_start_time(game_pid)
        return start_time.isoformat() if start_time else None

    @staticmethod
    async def get_steam_start_time() -> Optional[str]:
        """Get the start time of Steam"""
        steam_pid = get_steam_pid()
        if not steam_pid:
            return None

        start_time = get_process_start_time(steam_pid)
        return start_time.isoformat() if start_time else None

    @staticmethod
    async def get_setting(key: str, default: Any) -> Any:
        return settings.getSetting(key, default)

    @staticmethod
    async def set_setting(key: str, value: Any):
        settings.setSetting(key, value)


if __name__ == "__main__":
    raise RuntimeError("This script is a backend for a Decky plugin, and is not meant to be run directly.")

