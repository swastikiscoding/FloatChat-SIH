import {Router} from 'express';
import { getChat, postMessage } from '../controllers/chat.controller.js';

export const chatRouter = Router();

chatRouter.get('/:chatId', getChat);
chatRouter.post('/:chatId', postMessage);