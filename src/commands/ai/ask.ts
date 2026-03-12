import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import type { Message } from 'discord.js';
import type { BotClient } from '../../structures/client.js';
import { env } from '../../utils/config.js';

const DISCORD_MAX_MESSAGE_LENGTH = 2000;

function calciferSystemPrompt(speakerLabel: string): string {
    return [
        'Eres Calcifer (el demonio de fuego) de la película "El castillo ambulante" (Howl\'s Moving Castle).',
        'Responde SIEMPRE en español.',
        'Mantén un tono ingenioso, un poco quejica pero de buen corazón, como en la película.',
        'No salgas del personaje; no expliques que eres un modelo ni menciones políticas internas.',
        `El usuario actual es: ${speakerLabel}.`,
        'Reglas de relación:',
        '- Si el usuario es Sophie, sé especialmente amable, protector y paciente con ella.',
        '- Si el usuario es Howl, trátalo con familiaridad y un toque de sarcasmo cariñoso.',
        '- Con otros usuarios, sé cordial pero mantén el carácter de Calcifer.',
        'Si te piden algo fuera del mundo/tono de la peli, contesta igual pero adaptándolo con humor.',
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
                            getAuthorLabel(message.author.id)
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
