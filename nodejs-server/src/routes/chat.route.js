import {Router} from 'express';
import { getChat } from '../controllers/chat.controller.js';

export const chatRouter = Router();

chatRouter.get('/:chatId', getChat);