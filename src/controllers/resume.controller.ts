import { Request, Response } from 'express';
import {getUnreadMessages} from "../services/slack/message/message.service";

export class ResumeController {
    sayHello(req: Request, res: Response) {
        console.log(req.body);

        const { user_name, text, channel_id } = req.body;

        if (channel_id !== 'D07GRRAKB60') {
            res.status(200).json({
                response_type: 'ephemeral',
                text: `Désolé, je ne peux pas répondre dans ce channel.`
            });
        }

        res.status(200).json({
            response_type: 'in_channel',
            text: `Hello, ${user_name}! Vous avez dit : ${text}`
        });
    }

    async resume(req: Request, res: Response) {
        const { user_name, text, channel_id } = req.body;

        if (channel_id !== 'D07GRRAKB60') {
            res.status(200).json({
                response_type: 'ephemeral',
                text: `Désolé, je ne peux pas répondre dans ce channel.`
            });
        }

        try{
            const messages = await getUnreadMessages()

            res.status(200).json({
                response_type: 'in_channel',
                text: JSON.stringify(messages, null, 2)
            });
        } catch (error) {
            console.error(error);
            res.status(200).json({
                response_type: 'ephemeral',
                text: `Désolé, une erreur est survenue.`
            });
        }
    }
}