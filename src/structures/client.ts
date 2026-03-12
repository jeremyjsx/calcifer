import {
    Client,
    GatewayIntentBits,
    Partials,
    ActivityType,
    PresenceUpdateStatus,
    Collection,
} from 'discord.js';
import { pathToFileURL } from 'url';
import { basename } from 'path';
import { loadFiles } from './utils.js';
import { env } from '../utils/config.js';

export type CommandModule = { name?: string;[key: string]: unknown };
export type SlashCommandModule = {
    CMD: { name?: string; toJSON: () => unknown };
    [key: string]: unknown;
};

export interface BotClient extends Client {
    commands: Collection<string, CommandModule>;
    slashCommands: Collection<string, SlashCommandModule>;
    slashArray: unknown[];
    utils: { loadFiles: typeof loadFiles };
}

function getNameFromPath(filePath: string): string {
    return basename(filePath).replace(/\.[^.]+$/, '');
}

const defaultOptions = (): ConstructorParameters<typeof Client>[0] => ({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
    ],
    allowedMentions: {
        parse: ['roles', 'users'],
        repliedUser: false,
    },
    presence: {
        activities: [
            {
                name: env.STATUS,
                type: (ActivityType as unknown as Record<string, number>)[env.STATUS_TYPE || 'Playing'],
            },
        ],
        status: PresenceUpdateStatus.Idle,
    },
});

export function createClient(
    options?: ConstructorParameters<typeof Client>[0]
): BotClient {
    const opts = options ?? defaultOptions();
    const client = new Client(opts) as BotClient;
    client.commands = new Collection();
    client.slashCommands = new Collection();
    client.slashArray = [];
    client.utils = { loadFiles };
    return client;
}

async function loadCommands(client: BotClient): Promise<void> {
    console.log(`(${env.PREFIX}) Cargando comandos`);
    client.commands.clear();

    const filesPath = await loadFiles('src/commands');

    for (const filePath of filesPath) {
        try {
            const url = pathToFileURL(filePath).href;
            const mod = await import(url);
            const command = (mod.default ?? mod) as CommandModule;
            const name = getNameFromPath(filePath);
            command.name = name;

            if (name) client.commands.set(name, command);
        } catch (e) {
            console.log(`Error al cargar el archivo ${filePath}`);
            console.log(e);
        }
    }

    console.log(`(${env.PREFIX}) ${client.commands.size} Comandos cargados`);
}

async function loadSlashCommands(client: BotClient): Promise<void> {
    console.log(`(/) Cargando comandos`);
    client.slashCommands.clear();
    client.slashArray = [];

    const filesPath = await loadFiles('src/slashCommands');

    for (const filePath of filesPath) {
        try {
            const url = pathToFileURL(filePath).href;
            const mod = await import(url);
            const command = (mod.default ?? mod) as SlashCommandModule;
            const name = getNameFromPath(filePath);
            command.CMD.name = name;

            if (name) client.slashCommands.set(name, command);

            client.slashArray.push(command.CMD.toJSON());
        } catch (e) {
            console.log(`Error al cargar el archivo ${filePath}`);
            console.log(e);
        }
    }

    console.log(`(/) ${client.slashCommands.size} Comandos cargados`);

    if (client.application?.commands) {
        await client.application.commands.set(client.slashArray as never[]);
        console.log(`(/) ${client.slashCommands.size} Comandos publicados`);
    }
}

async function loadHandlers(client: BotClient): Promise<void> {
    console.log(`(-) Cargando handlers`);

    const filesPath = await loadFiles('src/handlers');

    for (const filePath of filesPath) {
        try {
            const url = pathToFileURL(filePath).href;
            const mod = await import(url);
            const handler = mod.default ?? mod;
            (typeof handler === 'function' ? handler : handler.default)(client);
        } catch (e) {
            console.log(`Error al cargar el archivo ${filePath}`);
            console.log(e);
        }
    }

    console.log(`(-) ${filesPath.length} Handlers cargados`);
}

async function loadEvents(client: BotClient): Promise<void> {
    console.log(`(+) Cargando eventos`);
    client.removeAllListeners();

    const filesPath = await loadFiles('src/events');

    for (const filePath of filesPath) {
        try {
            const url = pathToFileURL(filePath).href;
            const mod = await import(url);
            const event = mod.default ?? mod;
            const name = getNameFromPath(filePath);
            client.on(name, event.bind(null, client));
        } catch (e) {
            console.log(`Error al cargar el archivo ${filePath}`);
            console.log(e);
        }
    }

    console.log(`(+) ${filesPath.length} Eventos cargados`);
}

export async function start(client: BotClient): Promise<void> {
    await loadEvents(client);
    await loadHandlers(client);
    await loadCommands(client);
    await loadSlashCommands(client);

    client.login(env.TOKEN);
}
