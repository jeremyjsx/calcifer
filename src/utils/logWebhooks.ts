import {
    EmbedBuilder,
    type Guild,
    type TextChannel,
    PermissionFlagsBits,
    type Webhook,
} from 'discord.js';
import { getGuildConfig } from '../db/config.js';

type MessageLogCacheEntry = {
    webhookId: string;
    webhookToken: string;
};

const messageLogCache = new Map<string, MessageLogCacheEntry>();

async function resolveMessageLogWebhook(
    guild: Guild
): Promise<Webhook | null> {
    const { logsChannelId } = getGuildConfig(guild.id);
    if (!logsChannelId) return null;

    const channel = await guild.channels.fetch(logsChannelId);
    if (!channel || !channel.isTextBased() || channel.isDMBased()) return null;

    if (
        !guild.members.me?.permissionsIn(channel).has([
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ManageWebhooks,
        ])
    ) {
        return null;
    }

    const cached = messageLogCache.get(guild.id);
    if (cached) {
        try {
            const existing = await guild.client.fetchWebhook(
                cached.webhookId,
                cached.webhookToken
            );
            return existing;
        } catch {
            messageLogCache.delete(guild.id);
        }
    }

    if (channel.isThread()) {
        return null;
    }

    const textChannel = channel as TextChannel;
    const webhooks = await textChannel.fetchWebhooks();
    const existingWebhook = webhooks.find((wh) => wh.name === 'Calcifer Logs');
    const webhook =
        existingWebhook ??
        (await textChannel.createWebhook({
            name: 'Calcifer Logs',
            reason: 'Logging messages',
        }));

    if (!webhook.token) {
        return webhook;
    }

    messageLogCache.set(guild.id, {
        webhookId: webhook.id,
        webhookToken: webhook.token,
    });

    return webhook;
}

export interface MessageLogPayload {
    title: string;
    description?: string;
    authorTag: string;
    authorId: string;
    channelName: string;
    messageId?: string;
    fields?: { name: string; value: string; inline?: boolean }[];
    color?: number;
}

export async function sendMessageLog(
    guild: Guild,
    payload: MessageLogPayload
): Promise<void> {
    const webhook = await resolveMessageLogWebhook(guild);
    if (!webhook) return;

    const embed = new EmbedBuilder()
        .setTitle(payload.title)
        .setColor(payload.color ?? 0xffa500)
        .addFields(
            {
                name: 'Author',
                value: `${payload.authorTag} (\`${payload.authorId}\`)`,
                inline: true,
            },
            { name: 'Channel', value: `#${payload.channelName}`, inline: true }
        );

    if (payload.description) {
        embed.setDescription(payload.description);
    }

    if (payload.fields?.length) {
        embed.addFields(...payload.fields);
    }

    await webhook.send({ embeds: [embed] });
}

