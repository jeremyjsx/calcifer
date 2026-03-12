import { Client } from "discord.js";

export default (client: Client) => {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
};