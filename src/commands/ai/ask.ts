import type { Message } from 'discord.js';
import type { BotClient } from '../../structures/client.js';
import { env } from '../../utils/config.js';
import { askCalcifer } from '../../utils/calcifer.js';

export default {
    DESCRIPTION: 'Ask the AI a question. Uses Groq.',
    PERMISSIONS: [],
    OWNER: false,
    async execute(
        _client: BotClient,
        message: Message,
        args: string[],
        _prefix: string
    ) {
        const prompt = args.join(' ').trim();
        if (!prompt) {
            return message.reply('Ask something! Example: `!ask What is the capital of France?`');
        }

        if (!env.GROQ_API_KEY) {
            return message.reply(
                'AI is not configured (missing `GROQ_API_KEY` in .env).'
            );
        }

        try {
            const reply = await askCalcifer(message.author.id, prompt);
            return message.reply(reply);
        } catch (error) {
            console.error('[ask]', error);
            return message.reply(
                'Something went wrong while asking the AI. Check the console for details.'
            );
        }
    },
};
