import { call } from '@decky/api';
import { Temporal } from "temporal-polyfill";

export interface StartTimes {
    bootTime: Date,
    gameStartTime: Date | null,
    lastWakeTime: Date,
    pluginStartTime: Date,
    steamStartTime: Date,
}

type StartTimesResponse = {
    boot_time: number,
    game_start_time: number | null,
    last_wake_time: number,
    plugin_start_time: number,
    steam_start_time: number,
}

export async function getStartTimes(): Promise<StartTimes> {
    const times = await call<[], StartTimesResponse>('get_start_times');
    return {
        bootTime: new Date(times.boot_time),
        gameStartTime: times.game_start_time ? new Date(times.game_start_time) : null,
        lastWakeTime: new Date(times.last_wake_time),
        pluginStartTime: new Date(times.plugin_start_time),
        steamStartTime: new Date(times.steam_start_time),
    };
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
    await call('set_setting', key, value);
}

export async function getSetting<T>(key: string): Promise<T> {
    return await call('get_setting', key);
}

export async function getBootTime(): Promise<Temporal.Instant | null> {
    const bootTime = await call<[], string | null>('get_boot_time');

    return bootTime ? Temporal.Instant.from(bootTime) : null;
}

export async function getSteamStartTime(): Promise<Temporal.Instant | null> {
    const steamStartTime = await call<[], string | null>('get_steam_start_time');

    return steamStartTime ? Temporal.Instant.from(steamStartTime) : null;
}

export async function getLastWakeTime(): Promise<Temporal.Instant | null> {
    // Placeholder function - to be implemented later
    // For now, return a time 1 hour ago as a placeholder
    const oneHourAgo = Temporal.Now.instant().subtract({ hours: 1 });
    return oneHourAgo;
}

export async function getGameStartTime(): Promise<Temporal.Instant | null> {
    const gameStartTime = await call<[], string | null>('get_game_start_time');

    return gameStartTime ? Temporal.Instant.from(gameStartTime) : null;
}
