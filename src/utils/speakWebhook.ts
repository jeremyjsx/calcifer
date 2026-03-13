import type {
    GuildTextBasedChannel,
    User,
    Webhook,
    WebhookMessageCreateOptions,
} from 'discord.js';

type ChannelWithWebhook = GuildTextBasedChannel & {
    createWebhook: (options: {
        name: string;
        reason?: string;
    }) => Promise<Webhook>;
};

export async function sendAsUser(
    channel: ChannelWithWebhook,
    user: User,
    content: string
): Promise<void> {
    const webhook = await channel.createWebhook({
        name: 'Calcifer Speak',
        reason: 'Temporary webhook for /speak command',
    });

    try {
        const options: WebhookMessageCreateOptions = {
            content,
            username: user.displayName ?? user.username,
            avatarURL: user.displayAvatarURL({ size: 256 }) ?? undefined,
        };
        await webhook.send(options);
    } finally {
        await webhook.delete('Cleanup after /speak');
    }
}
