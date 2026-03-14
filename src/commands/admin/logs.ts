import type { Message } from 'discord.js';
import { PermissionFlagsBits } from 'discord.js';
import type { BotClient } from '../../structures/client.js';
import { getGuildConfig, setLogsChannel } from '../../db/config.js';

export default {
    DESCRIPTION:
        'Configure logs channel. Usage: !logs set #channel / !logs show',
    PERMISSIONS: [],
    OWNER: false,
    async execute(
        _client: BotClient,
        message: Message,
        args: string[],
        prefix: string
    ) {
        if (!message.guild) {
            return message.reply('This command can only be used in a server.');
        }

        const member = message.member;
        if (
            !member ||
            !member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
            return message.reply(
                "You need the 'Manage Server' permission to use this."
            );
        }

        const sub = (args.shift() || '').toLowerCase();

        if (sub === 'set') {
            const channelMention = args[0];
            const channelId =
                message.mentions.channels.first()?.id ??
                (channelMention?.match(/^<#(\d+)>$/)?.[1] ?? null);

            if (!channelId) {
                return message.reply(
                    `Mention a channel. Example: \`${prefix}logs set #logs\``
                );
            }

            const channel = message.guild.channels.cache.get(channelId);
            if (!channel || !channel.isTextBased() || channel.isDMBased()) {
                return message.reply(
                    'Please choose a text channel in this server.'
                );
            }

            setLogsChannel(message.guild.id, channelId);
            return message.reply(`Logs will be sent to ${channel}.`);
        }

        if (sub === 'show') {
            const config = getGuildConfig(message.guild.id);
            const channelId = config.logsChannelId;
            return message.reply(
                channelId
                    ? `Logs channel: <#${channelId}>`
                    : 'No logs channel configured yet.'
            );
        }

        return message.reply(
            `Usage:\n\`${prefix}logs set #channel\`\n\`${prefix}logs show\``
        );
    },
};

