import 'dotenv/config';
import { createClient, start } from './structures/client.js';

const client = createClient();
await start(client);