import type {
    ChatInputCommandInteraction,
    Interaction,
} from 'discord.js';
import type { BotClient } from '../../structures/client.js';
import { env } from '../../utils/config.js';

export default async (
    client: BotClient,
    interaction: Interaction
) => {
    if (!interaction.isChatInputCommand()) return;

    const prefix = env.PREFIX;
    const name = interaction.commandName;

    const command = client.slashCommands.get(name);
    if (!command || typeof (command as any).execute !== 'function') return;

    try {
        await (command as any).execute(
            client,
            interaction as ChatInputCommandInteraction,
            prefix,
        );
    } catch (error) {
        console.error(`[slash command error] ${name}`, error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: 'There was an error executing that command.',
                ephemeral: true,
            });
        }
    }
};

