import type { Message, PartialMessage } from 'discord.js';
import type { BotClient } from '../../structures/client.js';
import { sendMessageLog } from '../../utils/logWebhooks.js';

const MAX_CONTENT_LENGTH = 400;

function truncateContent(content: string): string {
    if (!content) return '*No content*';
    return content.length > MAX_CONTENT_LENGTH
        ? `${content.slice(0, MAX_CONTENT_LENGTH)}…`
        : content;
}

export default async (
    _client: BotClient,
    oldMessage: Message | PartialMessage,
    newMessage: Message | PartialMessage
) => {
    if (!newMessage.guild || !newMessage.channel) return;
    if (newMessage.author?.bot) return;

    const oldContent = oldMessage.content ?? '';
    const newContent = newMessage.content ?? '';

    if (!oldContent || oldContent === newContent) return;

    await sendMessageLog(newMessage.guild, {
        title: 'Message edited',
        authorTag: newMessage.author?.tag ?? 'Unknown',
        authorId: newMessage.author?.id ?? 'unknown',
        channelName: newMessage.channel.isDMBased()
            ? 'DM'
            : newMessage.channel.name ?? 'unknown',
        messageId: newMessage.id,
        fields: [
            {
                name: 'Before',
                value: truncateContent(oldContent),
            },
            {
                name: 'After',
                value: truncateContent(newContent || '*No content*'),
            },
        ],
    });
};

