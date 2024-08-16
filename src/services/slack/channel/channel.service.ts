import { Channel } from "@slack/web-api/dist/types/response/ChannelsInfoResponse";
import SlackService from "../slack.service";

export async function getChannels(): Promise<Channel[]> {
    try{
        const conversations = await SlackService.conversations.list({
            types: 'public_channel, private_channel, mpim',
        });

        return conversations.channels || []
    } catch(error) {
        throw new Error(`Error fetching channels: ${error}`);
    }
}