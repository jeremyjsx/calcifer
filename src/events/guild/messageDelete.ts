import type { Message } from 'discord.js';
import type { BotClient } from '../../structures/client.js';
import { sendMessageLog } from '../../utils/logWebhooks.js';

const MAX_CONTENT_LENGTH = 400;

export default async (_client: BotClient, message: Message) => {
    if (!message.guild || !message.channel || message.author?.bot) return;

    const content = message.content || '';
    const truncated =
        content.length > MAX_CONTENT_LENGTH
            ? `${content.slice(0, MAX_CONTENT_LENGTH)}…`
            : content || '*No content*';

    await sendMessageLog(message.guild, {
        title: 'Message deleted',
        authorTag: message.author?.tag ?? 'Unknown',
        authorId: message.author?.id ?? 'unknown',
        channelName: message.channel.isDMBased()
            ? 'DM'
            : message.channel.name ?? 'unknown',
        messageId: message.id,
        fields: [
            {
                name: 'Content',
                value: truncated,
            },
        ],
    });
};

