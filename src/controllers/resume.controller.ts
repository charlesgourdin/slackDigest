import { Request, Response } from 'express';
import { resumeUnreadMessages } from "../services/resume/resume.service";
import axios from "axios";

export class ResumeController {
    async resume(req: Request, res: Response) {
        const { user_id, channel_id, response_url } = req.body;

        if (channel_id !== 'D07GRRAKB60') {
            return res.status(200).json({
                response_type: 'ephemeral',
                text: `Désolé, je ne peux pas répondre dans ce channel.`
            });
        }

        // Envoyer la réponse immédiate pour éviter le timeout
        res.status(200).send({
            response_type: 'in_channel',
            text: "Votre demande de résumé est en cours de traitement. Vous recevrez le résumé bientôt."
        });

        try {
            const resume = await resumeUnreadMessages(user_id);

            // Envoyer la réponse finale à Slack via response_url
            await axios.post(response_url, {
                response_type: 'in_channel',
                text: resume
            });
        } catch (error) {
            await axios.post(response_url, {
                response_type: 'in_channel',
                text: `Désolé, une erreur est survenue lors de la génération du résumé.`
            });
        }
    }
}
