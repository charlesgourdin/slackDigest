import SlackService from "../slack.service";
import {getUserInfo, replaceUserIdsWithNames} from "../user/user.service";
import {getThreadMessages} from "../thread/thread.service";
import {getChannels} from "../channel/channel.service";
import {MessageElement} from "@slack/web-api/dist/types/response/ConversationsHistoryResponse";
import { Channel } from "@slack/web-api/dist/types/response/ChannelsInfoResponse";


async function getLastRead(channelId: string): Promise<string> {
    try {
        const channelInfo = await SlackService.conversations.info({ channel: channelId });
        return channelInfo.channel?.last_read ?? '';
    } catch (error) {
        throw new Error(`Error fetching last read for channel ${channelId}: ${error}`);
    }
}

async function getMessagesFrom(channelId: string, lastRead: string): Promise<MessageElement[]> {
    try {
        const messages = await SlackService.conversations.history({
            channel: channelId,
            limit: 100,
            oldest: lastRead,  // Ne récupérer que les messages après la dernière lecture
        });

        return messages.messages ?? [];
    } catch (error) {
        throw new Error(`Error fetching messages for channel ${channelId}: ${error}`);
    }
}

function filterUnreadMessages(messages: MessageElement[], lastRead: string): MessageElement[] {
    return messages.filter(msg => {
        if (!msg.ts) {
            return false;
        }

        if (msg.ts <= lastRead) {
            return false;
        }

        return msg.subtype !== 'bot_message';

    });
}

export async function formatMessages(channelId: string, unreadMessages: MessageElement[], isThread: boolean): Promise<any> {
    try {
        return await Promise.all(unreadMessages.map(async (msg) => {
            const userInfo = await getUserInfo(msg.user ?? '');
            const textWithNames = await replaceUserIdsWithNames(msg.text ?? '');

            const message = {
                text: textWithNames,
                ts: msg.ts,
                user: {
                    name: userInfo?.name,
                    email: userInfo?.email,
                }
            };

            if (isThread) {
                return message;
            }
            const threadMessages = await getThreadMessages(channelId, msg.ts!);

            return {
                ...message,
                thread: threadMessages.length > 1 ? threadMessages.slice(1) : [], // Exclure le message parent du thread
            };
        }));
    } catch (error) {
        throw new Error(`Error formatting message from ${channelId} channel: ${error}`);
    }
}

export async function getUnreadMessages(): Promise<any> {
    try {
        const response: { [key: string]: any[] } = {};
        const channels = await getChannels()

        for (const channel of channels) {
            const lastRead = await getLastRead(channel.id as string);

            if (!lastRead || !Number(lastRead)) {
                continue;
            }

            const messages = await getMessagesFrom(channel.id as string, lastRead);

            const unreadMessages = filterUnreadMessages(messages, lastRead);

            if (unreadMessages.length === 0) {
                continue;
            }

            const formattedMessages = await formatMessages(channel.id as string, unreadMessages, false);

            Object.assign(response, {[channel.name as string]: formattedMessages});
        }

        return response;
    } catch (error) {
        console.error(JSON.stringify(error, null, 2));
    }
}