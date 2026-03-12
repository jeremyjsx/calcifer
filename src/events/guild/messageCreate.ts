import type { Message } from 'discord.js';
import type { BotClient } from '../../structures/client.js';
import { env } from '../../utils/config.js';

export default async (client: BotClient, message: Message) => {
    const prefix = env.PREFIX;

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const name = args.shift()?.toLowerCase();
    if (!name) return;

    const command = client.commands.get(name);
    if (!command || typeof (command as any).execute !== 'function') return;

    try {
        await (command as any).execute(client, message, args, prefix);
    } catch (error) {
        console.error(`[command error] ${name}`, error);
        if (message.channel) {
            await message.reply('There was an error executing that command.');
        }
    }
};

