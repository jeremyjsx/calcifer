import type { Message } from 'discord.js';
import type { BotClient } from '../../structures/client.js';

export default {
    DESCRIPTION: "It is used for the bot to say what you want",
    PERMISSIONS: [],
    OWNER: true,
    async execute(
        _client: BotClient,
        message: Message,
        args: string[],
        _prefix: string
    ) {
        const text = args.join(' ').trim();
        if (!text) {
            return message.reply('Say what? Give me something to repeat.');
        }
        if (!message.channel || !('send' in message.channel)) {
            return message.reply("I can't send messages in this channel.");
        }
        return message.channel.send(text);
    },
};
