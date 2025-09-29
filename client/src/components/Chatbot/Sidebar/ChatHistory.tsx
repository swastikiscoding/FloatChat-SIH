import { useContext, useEffect, useState, useCallback } from "react";
import { Context } from "../context/Context.tsx";
import { axiosInstance } from "../../../utils/axiosInstance";
import { useAuth } from "@clerk/clerk-react";
import { Plus } from "lucide-react";

interface Chat {
  _id: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

const ChatHistory = () => {
   const { loadChat, newChat, currentChatId } = useContext(Context);
   const { getToken } = useAuth();
   const [chatHistory, setChatHistory] = useState<Chat[]>([]);
   const [loading, setLoading] = useState(false);

   // Fetch chat history from API
   const fetchChatHistory = useCallback(async () => {
     try {
       setLoading(true);
       const token = await getToken();
       const response = await axiosInstance.get('/chat/all', {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       });
       // Ensure we have a valid array
       const chats = Array.isArray(response.data.chats) ? response.data.chats : [];
       setChatHistory(chats);
     } catch (error) {
       console.error("Error fetching chat history:", error);
       setChatHistory([]);
     } finally {
       setLoading(false);
     }
   }, [getToken]);

   // Load chat history on component mount
   useEffect(() => {
     fetchChatHistory();
   }, [fetchChatHistory]);

   // Refresh chat history when a new chat is created
   useEffect(() => {
     if (currentChatId) {
       fetchChatHistory();
     }
   }, [currentChatId, fetchChatHistory]);

   const handleChatClick = async (chatId: string) => {
     if (loading) return;
     setLoading(true);
     try {
       await loadChat(chatId);
     } catch (error) {
       console.error("Error loading chat:", error);
     } finally {
       setLoading(false);
     }
   };

   const handleNewChat = () => {
     newChat();
   };

   const getChatTitle = (chat: Chat) => {
     // Handle cases where title might be undefined or empty
     const title = chat.title || "Untitled Chat";
     return title.length > 35 ? title.slice(0, 35) + ".." : title;
   };
  
  return (
    <div className="mx-3 text-white">
      {/* New Chat Button */}
      <div className="mb-3 md:mb-4">
        <button
          onClick={handleNewChat}
          className="w-full text-left rounded-md pl-2 md:pl-3 py-2 text-xs md:text-sm font-medium text-cyan-400 hover:bg-gray-800 transition border border-cyan-400/30 bg-gray-900"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5"
             />
            <span>New Chat</span>
          </div>
        </button>
      </div>

      {/* Chat History */}
      {loading && chatHistory.length === 0 ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 md:h-8 bg-gray-700 rounded-md mr-[10px] md:mr-[15px] ml-2 md:ml-3"></div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {chatHistory.map((chat) => (
            <li
              key={chat._id}
              onClick={() => handleChatClick(chat._id)}
              className={`cursor-pointer rounded-md pl-2 md:pl-3 py-1 mr-[10px] md:mr-[15px] text-xs md:text-sm font-light text-gray-300 hover:bg-gray-800 transition ${
                currentChatId === chat._id ? 'bg-gray-800 border-l-2 border-cyan-400' : ''
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {getChatTitle(chat)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ChatHistory
