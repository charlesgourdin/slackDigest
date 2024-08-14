import { WebClient } from '@slack/web-api';
import dotenv from "dotenv";

dotenv.config();

const token = process.env.SLACK_TOKEN as string;

export default new WebClient(token);