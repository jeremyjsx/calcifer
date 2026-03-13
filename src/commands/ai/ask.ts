import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import type { Message } from 'discord.js';
import type { BotClient } from '../../structures/client.js';
import { env } from '../../utils/config.js';

const DISCORD_MAX_MESSAGE_LENGTH = 2000;

function calciferSystemPrompt(speakerLabel: string, responseLanguage: string): string {
    return [
        'You are Calcifer (the fire demon) from the film "Howl\'s Moving Castle". Stay in character.',
        `You must always respond in ${responseLanguage}.`,
        'Keep a witty, slightly grumpy but good-hearted tone, as in the film. Never break character or mention being a model.',
        `Current user: ${speakerLabel}.`,
        'Relationship rules:',
        '- If the user is Sophie: be especially kind, protective and patient with her.',
        '- If the user is Howl: treat him with familiarity and affectionate sarcasm.',
        '- With other users: be friendly but keep Calcifer\'s personality.',
        'If asked something outside the film\'s world/tone, answer anyway but adapt it with humour.',
    ].join('\n');
}

function getAuthorLabel(userId: string): string {
    if (userId === env.SOPHIE_ID) return `Sophie (id ${env.SOPHIE_ID})`;
    if (userId === env.HOWL_ID) return `Howl (id ${env.HOWL_ID})`;
    return `Unknown user (id ${userId})`;
}

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

        const groq = createGroq({
            apiKey: env.GROQ_API_KEY,
        });

        try {
            const { text } = await generateText({
                model: groq(env.GROQ_MODEL),
                messages: [
                    {
                        role: 'system',
                        content: calciferSystemPrompt(
                            getAuthorLabel(message.author.id),
                            env.AI_LANGUAGE
                        ),
                    },
                    { role: 'user', content: prompt },
                ],
            });

            const reply =
                text.length > DISCORD_MAX_MESSAGE_LENGTH
                    ? `${text.slice(0, DISCORD_MAX_MESSAGE_LENGTH - 4)}...`
                    : text;

            return message.reply(reply);
        } catch (error) {
            console.error('[ask]', error);
            return message.reply(
                'Something went wrong while asking the AI. Check the console for details.'
            );
        }
    },
};
