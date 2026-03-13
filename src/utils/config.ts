export interface EnvConfig {
    TOKEN: string;
    PREFIX: string;
    STATUS: string;
    STATUS_TYPE: string;
    GROQ_API_KEY: string;
    GROQ_MODEL: string;
    AI_LANGUAGE: string;
    SOPHIE_ID: string;
    HOWL_ID: string;
}

export const env: EnvConfig = {
    TOKEN: process.env.TOKEN ?? '',
    PREFIX: process.env.PREFIX ?? '!',
    STATUS: process.env.STATUS ?? '',
    STATUS_TYPE: process.env.STATUS_TYPE ?? 'Playing',
    GROQ_API_KEY: process.env.GROQ_API_KEY ?? '',
    GROQ_MODEL: process.env.GROQ_MODEL ?? '',
    AI_LANGUAGE: process.env.AI_LANGUAGE ?? 'Spanish',
    SOPHIE_ID: process.env.SOPHIE_ID ?? '',
    HOWL_ID: process.env.HOWL_ID ?? '',
};

