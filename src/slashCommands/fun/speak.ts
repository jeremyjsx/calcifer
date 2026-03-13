import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { BotClient } from '../../structures/client.js';
import { sendAsUser } from '../../utils/speakWebhook.js';

export default {
    CMD: new SlashCommandBuilder()
        .setDescription('Send a message as another user (via webhook).')
        .addUserOption((opt) =>
            opt
                .setName('user')
                .setDescription('User to speak as (name and avatar).')
                .setRequired(true)
        )
        .addStringOption((opt) =>
            opt
                .setName('message')
                .setDescription('The message to send.')
                .setRequired(true)
        ),
    async execute(
        _client: BotClient,
        interaction: ChatInputCommandInteraction,
        _prefix: string
    ) {
        const user = interaction.options.getUser('user', true);
        const content = interaction.options.getString('message', true).trim();

        if (!content) {
            return interaction.reply({
                content: 'Add some text in the `message` option.',
                ephemeral: true,
            });
        }

        const channel = interaction.channel;
        if (!channel || channel.isDMBased()) {
            return interaction.reply({
                content: "Can't use this in DMs.",
                ephemeral: true,
            });
        }

        if (!('createWebhook' in channel)) {
            return interaction.reply({
                content: "I can't use webhooks in this channel.",
                ephemeral: true,
            });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            await sendAsUser(
                channel as typeof channel & {
                    createWebhook: (options: { name: string; reason?: string }) => Promise<unknown>;
                },
                user,
                content
            );
            return interaction.editReply('Done. Message sent as **' + user.displayName + '**.');
        } catch (error) {
            console.error('[speak slash]', error);
            return interaction.editReply(
                "Couldn't send the message (bot may need **Manage Webhooks** here). Check the console for details."
            );
        }
    },
};
