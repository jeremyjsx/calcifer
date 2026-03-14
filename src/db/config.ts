import { getDb } from './client.js';

export interface GuildConfig {
    guildId: string;
    logsChannelId?: string | null;
}

const selectStmt = () =>
    getDb().prepare<GuildConfig, [string]>(
        'SELECT guildId, logsChannelId FROM guild_config WHERE guildId = ?'
    );

const upsertStmt = () =>
    getDb().prepare<void, [string, string | null]>(`
        INSERT INTO guild_config (guildId, logsChannelId, createdAt, updatedAt)
        VALUES (?, ?, datetime('now'), datetime('now'))
        ON CONFLICT(guildId) DO UPDATE SET
            logsChannelId = excluded.logsChannelId,
            updatedAt = datetime('now')
    `);

export function getGuildConfig(guildId: string): GuildConfig {
    const row = selectStmt().get(guildId);
    if (!row) {
        return { guildId, logsChannelId: null };
    }
    return row;
}

export function setLogsChannel(
    guildId: string,
    channelId: string | null
): void {
    upsertStmt().run(guildId, channelId);
}

