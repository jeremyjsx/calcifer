import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { env } from './config.js';

const DISCORD_MAX_MESSAGE_LENGTH = 2000;

export function calciferSystemPrompt(speakerLabel: string, responseLanguage: string): string {
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

export function getAuthorLabel(userId: string): string {
    if (userId === env.SOPHIE_ID) return `Sophie (id ${env.SOPHIE_ID})`;
    if (userId === env.HOWL_ID) return `Howl (id ${env.HOWL_ID})`;
    return `Unknown user (id ${userId})`;
}

export async function askCalcifer(userId: string, prompt: string): Promise<string> {
    const groq = createGroq({ apiKey: env.GROQ_API_KEY });
    const { text } = await generateText({
        model: groq(env.GROQ_MODEL),
        messages: [
            {
                role: 'system',
                content: calciferSystemPrompt(getAuthorLabel(userId), env.AI_LANGUAGE),
            },
            { role: 'user', content: prompt },
        ],
    });
    return text.length > DISCORD_MAX_MESSAGE_LENGTH
        ? `${text.slice(0, DISCORD_MAX_MESSAGE_LENGTH - 4)}...`
        : text;
}
