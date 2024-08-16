import {getUserInfo} from "../slack/user/user.service";
import {getUnreadMessages} from "../slack/message/message.service";
import {resumeWithTitlePrompt} from "../openAi/prompts";
import {createChatCompletion} from "../openAi/openAi.service";

export async function resumeUnreadMessages(userId: string) {
    try{
        const userInfo = await getUserInfo(userId);

        const title = userInfo?.title || 'utilisateur';

        const unreadMessages = await getUnreadMessages();

        const prompt = resumeWithTitlePrompt(title, unreadMessages)

        return await createChatCompletion(prompt);
    } catch (error) {
        throw new Error('Error generating resume');
    }
}