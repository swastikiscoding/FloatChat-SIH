import React, { createContext, useState, type ReactNode } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";
import { useAuth } from "@clerk/clerk-react";

interface Message {
  userMessage: string;
  AIMessage: string;
}

interface ContextType {
  askQue: (prompt?: string) => Promise<void>;
  prevPrompts: string[];
  setprevPrompts: React.Dispatch<React.SetStateAction<string[]>>;
  setrecentPrompt: React.Dispatch<React.SetStateAction<string>>;
  recentPrompt: string;
  setques: React.Dispatch<React.SetStateAction<string>>;
  result: string;
  loading: boolean;
  showResult: boolean;
  ques: string;
  newChat: () => void;
  currentChatId: string | null;
  messages: Message[];
  loadChat: (chatId: string) => Promise<void>;
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

interface ProviderProps {
  children: ReactNode;
}

// Context
export const Context = createContext<ContextType>({} as ContextType);

const ContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const { getToken } = useAuth();
  const [ques, setques] = useState("");
  const [result, setresult] = useState("");
  const [recentPrompt, setrecentPrompt] = useState("");
  const [loading, setloading] = useState(false);
  const [prevPrompts, setprevPrompts] = useState<string[]>([]);
  const [showResult, setshowResult] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<string>("Student");

  const newChat = () => {
    setloading(false);
    setshowResult(false);
    setresult("");
    setques("");
    setrecentPrompt("");
    setCurrentChatId(null);
    setMessages([]);
    console.log("New chat started");
  };

  // Load existing chat
  const loadChat = async (chatId: string) => {
    try {
      const token = await getToken();
      const response = await axiosInstance.get(`/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const chatData = response.data;
      setCurrentChatId(chatId);
      setMessages(chatData.chat);
      setshowResult(true);
      
      // Set the last message as result for display
      if (chatData.chat.length > 0) {
        const lastMessage = chatData.chat[chatData.chat.length - 1];
        setresult(lastMessage.AIMessage);
        setrecentPrompt(lastMessage.userMessage);
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  // Main Function: askQue
  const askQue = async (prompt?: string) => {
    const currentPrompt = (prompt ?? ques).trim();
    if (!currentPrompt) return;

    // Reset state for new response
    setresult("");
    setloading(true);
    setshowResult(true);
    setrecentPrompt(currentPrompt);
    setprevPrompts((prev) => [...prev, currentPrompt]);

    try {
      // Use existing chatId or create new chat
      const chatId = currentChatId || 'new';
      
      // Convert mode to number for backend
      const modeNumber = mode === "Student" ? 0 : mode === "Research" ? 1 : 2;
      console.log("Sending message with mode:", mode, "->", modeNumber);
      
      const token = await getToken();
      const response = await axiosInstance.post(`/chat/${chatId}`, {
        message: currentPrompt,
        mode: modeNumber,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const chatData = response.data;
      
      // Update chat ID if it was a new chat
      if (!currentChatId) {
        setCurrentChatId(chatData.chatId);
      }
      
      // Update messages
      setMessages(chatData.chat);
      
      // Get the latest AI response
      const latestMessage = chatData.chat[chatData.chat.length - 1];
      const aiResponse = latestMessage.AIMessage;

      // Use the raw response without HTML formatting for ReactMarkdown
      setresult(aiResponse);

    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = "⚠️ Something went wrong. Please try again.";
      setresult(errorMessage);
    }

    setloading(false);
    setques("");
  };

  const contextValue: ContextType = {
    askQue,
    prevPrompts,
    setprevPrompts,
    setrecentPrompt,
    recentPrompt,
    setques,
    result,
    loading,
    showResult,
    ques,
    newChat,
    currentChatId,
    messages,
    loadChat,
    mode,
    setMode,
  };

  return (
    <Context.Provider value={contextValue}>{children}</Context.Provider>
  );
};

export default ContextProvider;
