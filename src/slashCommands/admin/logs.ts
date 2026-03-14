import {
    SlashCommandBuilder,
    type ChatInputCommandInteraction,
    PermissionFlagsBits,
} from 'discord.js';
import type { BotClient } from '../../structures/client.js';
import { getGuildConfig, setLogsChannel } from '../../db/config.js';

export default {
    CMD: new SlashCommandBuilder()
        .setDescription('Configure Calcifer logs.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand((sub) =>
            sub
                .setName('set')
                .setDescription('Set the channel for Calcifer logs.')
                .addChannelOption((opt) =>
                    opt
                        .setName('channel')
                        .setDescription('Channel where logs will be sent.')
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub
                .setName('show')
                .setDescription('Show current log configuration.')
        ),
    async execute(
        _client: BotClient,
        interaction: ChatInputCommandInteraction,
        _prefix: string
    ) {
        if (!interaction.guild) {
            return interaction.reply({
                content: "This command can only be used in a server.",
                ephemeral: true,
            });
        }

        const member = interaction.member;
        if (
            !('permissions' in member) ||
            !member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
            return interaction.reply({
                content: "You need the 'Manage Server' permission to use this.",
                ephemeral: true,
            });
        }

        const sub = interaction.options.getSubcommand(true);

        if (sub === 'set') {
            const channel = interaction.options.getChannel('channel', true);
            if (!channel.isTextBased() || channel.isDMBased()) {
                return interaction.reply({
                    content: 'Please choose a text channel in this server.',
                    ephemeral: true,
                });
            }

            setLogsChannel(interaction.guild.id, channel.id);

            return interaction.reply({
                content: `Message logs will be sent to ${channel}.`,
                ephemeral: true,
            });
        }

        if (sub === 'show') {
            const config = getGuildConfig(interaction.guild.id);
            const channelId = config.logsChannelId;

            return interaction.reply({
                content: channelId
                    ? `Logs channel: <#${channelId}>`
                    : 'No logs channel configured yet.',
                ephemeral: true,
            });
        }
    },
};

