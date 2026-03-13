import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { BotClient } from '../../structures/client.js';
import { env } from '../../utils/config.js';
import { askCalcifer } from '../../utils/calcifer.js';

export default {
    CMD: new SlashCommandBuilder()
        .setDescription('Ask Calcifer a question (AI, responds in character).')
        .addStringOption((opt) =>
            opt
                .setName('question')
                .setDescription('What do you want to ask?')
                .setRequired(true)
        ),
    async execute(
        _client: BotClient,
        interaction: ChatInputCommandInteraction,
        _prefix: string
    ) {
        const prompt = interaction.options.getString('question', true).trim();
        if (!prompt) {
            return interaction.reply({
                content: 'Add a question! Use the `question` option.',
                ephemeral: true,
            });
        }

        if (!env.GROQ_API_KEY) {
            return interaction.reply({
                content: 'AI is not configured (missing `GROQ_API_KEY` in .env).',
                ephemeral: true,
            });
        }

        await interaction.deferReply();

        try {
            const reply = await askCalcifer(interaction.user.id, prompt);
            return interaction.editReply(reply);
        } catch (error) {
            console.error('[ask slash]', error);
            return interaction.editReply(
                'Something went wrong while asking the AI. Check the console for details.'
            );
        }
    },
};
