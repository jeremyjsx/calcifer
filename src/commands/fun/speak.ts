import type { Message } from 'discord.js';
import type { BotClient } from '../../structures/client.js';
import { sendAsUser } from '../../utils/speakWebhook.js';

export default {
    DESCRIPTION: 'Send a message as another user (via webhook). Usage: !speak @user <message>',
    PERMISSIONS: [],
    OWNER: false,
    async execute(
        _client: BotClient,
        message: Message,
        args: string[],
        _prefix: string
    ) {
        const targetUser = message.mentions.users.first();
        if (!targetUser) {
            return message.reply(
                'Mention someone to speak as. Example: `!speak @user Hello everyone!`'
            );
        }

        const text = args
            .filter((arg) => !arg.startsWith('<@'))
            .join(' ')
            .trim();
        if (!text) {
            return message.reply('Add a message to send. Example: `!speak @user Hello!`');
        }

        const channel = message.channel;
        if (!channel || channel.isDMBased()) {
            return message.reply("Can't use this in DMs.");
        }

        if (!('createWebhook' in channel)) {
            return message.reply("I can't use webhooks in this channel.");
        }

        try {
            await message.delete().catch(() => {});
            await sendAsUser(
                channel as typeof channel & {
                    createWebhook: (options: { name: string; reason?: string }) => Promise<unknown>;
                },
                targetUser,
                text
            );
        } catch (error) {
            console.error('[speak]', error);
            if (channel && !channel.isDMBased()) {
                await channel.send(
                    "Couldn't send the message (need **Manage Webhooks** here). Check the console for details."
                );
            }
        }
    },
};
