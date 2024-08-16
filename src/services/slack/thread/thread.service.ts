import SlackService from "../slack.service";
import {formatMessages} from "../message/message.service";

export async function getThreadMessages(channelId: string, parentTs: string): Promise<any[]> {
    try {
        const threadMessages = await SlackService.conversations.replies({
            channel: channelId,
            ts: parentTs,
            limit: 100,
        });


        return await formatMessages(channelId, threadMessages.messages ?? [], true);
    } catch (error) {
        console.error(`Error fetching thread messages for ts ${parentTs}:`, error);
        return [];
    }
}