import type { Client } from 'discord.js';

export default (_client: Client) => {
    process.removeAllListeners();

    process.on('unhandledRejection', (reason, promise) => {
        console.log('[⚠] Error found');
        console.log(reason, promise);
    });

    process.on('uncaughtException', (error, origin) => {
        console.log('[⚠] Error found');
        console.log(error, origin);
    });

    process.on('uncaughtExceptionMonitor', (error, origin) => {
        console.log('[⚠] Error found');
        console.log(error, origin);
    });

    process.on('multipleResolves', () => { });
};
