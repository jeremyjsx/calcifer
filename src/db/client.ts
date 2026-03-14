import { Database } from 'bun:sqlite';
import { join } from 'path';

let db: Database | null = null;

export function getDb(): Database {
    if (!db) {
        const file = join(process.cwd(), 'calcifer.db');
        db = new Database(file);
        db.run(`PRAGMA journal_mode = WAL;`);
        db.run(`
            CREATE TABLE IF NOT EXISTS guild_config (
                guildId TEXT PRIMARY KEY,
                logsChannelId TEXT,
                createdAt TEXT NOT NULL DEFAULT (datetime('now')),
                updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
            );
        `);
    }
    return db;
}

