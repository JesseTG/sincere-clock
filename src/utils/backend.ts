import { call } from '@decky/api';
import { Temporal } from "temporal-polyfill";

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

export async function getGameStartTime(): Promise<Temporal.Instant | null> {
    const gameStartTime = await call<[], string | null>('get_game_start_time');

    return gameStartTime ? Temporal.Instant.from(gameStartTime) : null;
}
