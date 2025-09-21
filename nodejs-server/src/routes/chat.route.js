import {Router} from 'express';
import { requireAuth, addUserToRequest } from '../middleware/clerk.middleware.js';
import { getChat, postMessage, fetchAllChats } from '../controllers/chat.controller.js';

export const chatRouter = Router();

// Apply authentication to all chat routes
chatRouter.use(requireAuth, addUserToRequest);

chatRouter.get('/all', fetchAllChats);
chatRouter.get('/:chatId', getChat);
chatRouter.post('/:chatId', postMessage);