import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { BotClient } from '../../structures/client.js';

export default {
    CMD: new SlashCommandBuilder().setDescription(
        'It is used to see the ping of the bot'
    ),
    async execute(
        _client: BotClient,
        interaction: ChatInputCommandInteraction,
        _prefix: string
    ) {
        const msgLatency = Date.now() - interaction.createdTimestamp;
        return interaction.reply(`\`${msgLatency}ms\``);
    },
};
