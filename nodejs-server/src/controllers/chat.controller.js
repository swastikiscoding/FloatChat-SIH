import { Chat } from "../models/chat.model.js";
import { axiosInstance } from "../utils/axiosInstance.js";

export const getChat = async (req, res) => {
    try{
        const { chatId } = req.params;
        const chat = await Chat.findById(chatId);
        if(!chat){
            return res.status(404).json({ error: "Chat not found" });
        }
        res.status(200).json({message: "Chat fetched successfully", chat: chat.messages, chatId});
    }catch(error){
        console.error("Error fetching chat:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const postMessage = async (req, res) => {
    try{
        const { message } = req.body;
        let { chatId } = req.params;
        console.log("Received message:", message, "for chatId:", chatId);
        if(chatId === 'new'){
            // Create title from first message (truncate if too long)
            const chatTitle = message.length > 50 ? message.slice(0, 50) + "..." : message;
            const chat = new Chat({ messages: [] , title: chatTitle});
            await chat.save();
            chatId = chat._id;
        }
        console.log("Using chatId:", chatId);
        const chat = await Chat.findById(String(chatId));
        if(!chat){
            return res.status(404).json({ error: "Chat not found" });
        }
        const context = chat.messages.length > 5 ? chat.messages.slice(-5) : chat.messages;
        const contextMessage = context.map(msg => `User Message: ${msg.userMessage}\nAI Message: ${msg.AIMessage}`).join("\n");
        console.log("Context for AI:", contextMessage);
        const response = await axiosInstance.post('/chat', {
            request: {
                message: `Context: ${contextMessage}\n Query: ${message}`,
                deps: {
                    mode: 0
                }
            }
        });
        const aiMessage = response.data.reply;
        const newChat = await Chat.findByIdAndUpdate(chatId, { $push: { messages: { AIMessage: aiMessage, userMessage: message } } }, { new: true });
        res.status(200).json({message: "Message posted successfully", chat: newChat.messages, chatId});


    }catch(error){
        console.error("Error posting message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const fetchAllChats = async (req, res) => {
    try{
        const chats = await Chat.find({}).sort({ updatedAt: -1 });
        
        // Transform chats to include title with fallback
        const transformedChats = chats.map(chat => ({
            _id: chat._id,
            title: chat.title || (chat.messages.length > 0 ? chat.messages[0].userMessage : "New Chat"),
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
        }));
        
        res.status(200).json({message: "Chats fetched successfully", chats: transformedChats});
    }catch(error){
        console.error("Error fetching chats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}