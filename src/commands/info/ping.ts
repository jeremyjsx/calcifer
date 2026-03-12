import type { Message } from 'discord.js';
import type { BotClient } from '../../structures/client.js';

export default {
    DESCRIPTION: 'It is used to see the ping of the bot',
    PERMISSIONS: [],
    OWNER: true,
    async execute(
        _client: BotClient,
        message: Message,
        _args: string[],
        _prefix: string
    ) {
        const msgLatency = Date.now() - message.createdTimestamp;
        return message.reply(`\`${msgLatency}ms\``);
    },
};
