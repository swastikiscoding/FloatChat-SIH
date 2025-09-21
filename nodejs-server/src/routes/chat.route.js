import {Router} from 'express';
import { getChat, postMessage, fetchAllChats } from '../controllers/chat.controller.js';

export const chatRouter = Router();

chatRouter.get('/all', fetchAllChats);
chatRouter.get('/:chatId', getChat);
chatRouter.post('/:chatId', postMessage);