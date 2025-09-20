import { Chat } from "../models/chat.model.js";

export const getChat = (req, res) => {
    try{
        const { chatId } = req.params;
        const chat = Chat.findById(chatId);
        if(!chat){
            return res.status(404).json({ error: "Chat not found" });
        }
        res.status(200).json(chat);
    }catch(error){
        console.error("Error fetching chat:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}