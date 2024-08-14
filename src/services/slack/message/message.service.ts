import SlackService from "../slack.service";
import {getUserInfo, replaceUserIdsWithNames} from "../user/user.service";

// Fonction pour obtenir les messages non lus
export async function getUnreadMessages(): Promise<any> {
    try {
        const conversations = await SlackService.conversations.list({
            types: 'public_channel, private_channel, mpim',
        });

        const response: { [key: string]: any[] } = {};

        for (const channel of conversations.channels || []) {
            // Récupérer la position du dernier message lu
            const channelInfo = await SlackService.conversations.info({ channel: channel.id as string });
            const lastRead = channelInfo.channel?.last_read;

            if (!lastRead || !Number(lastRead)) {
                continue;
            }

            // Récupérer les messages depuis la dernière position lue
            const messages = await SlackService.conversations.history({
                channel: channel.id as string,
                limit: 100,
                oldest: lastRead,  // Ne récupérer que les messages après la dernière lecture
            });

            const unreadMessages = messages.messages?.filter(msg => {
                if (!msg.ts) {
                    return false;
                }

                if (msg.ts <= lastRead) {
                    return false;
                }

                return msg.subtype !== 'bot_message';

            });

            if (channel && unreadMessages && unreadMessages.length > 0) {
                const messagesWithUserNames = await Promise.all(unreadMessages.map(async (msg) => {
                    const userInfo = await getUserInfo(msg.user ?? '');
                    const textWithNames = await replaceUserIdsWithNames(msg.text ?? '');

                    return {
                        text: textWithNames,
                        ts: msg.ts,
                        user: {
                            name: userInfo?.name,
                            email: userInfo?.email,
                        },
                    };
                }));

                Object.assign(response, {[channel.name as string]: messagesWithUserNames});
            }
        }

        return response;
    } catch (error) {
        console.error(JSON.stringify(error, null, 2));
    }
}