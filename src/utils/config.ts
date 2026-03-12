export interface EnvConfig {
    TOKEN: string;
    PREFIX: string;
    STATUS: string;
    STATUS_TYPE: string;
}

export const env: EnvConfig = {
    TOKEN: process.env.TOKEN ?? '',
    PREFIX: process.env.PREFIX ?? '!',
    STATUS: process.env.STATUS ?? '',
    STATUS_TYPE: process.env.STATUS_TYPE ?? 'Playing',
};

