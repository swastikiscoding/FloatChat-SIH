import React, { createContext, useState, type ReactNode } from "react";

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
}

interface ProviderProps {
  children: ReactNode;
}

// Context
export const Context = createContext<ContextType>({} as ContextType);

const ContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [ques, setques] = useState("");
  const [result, setresult] = useState("");
  const [recentPrompt, setrecentPrompt] = useState("");
  const [loading, setloading] = useState(false);
  const [prevPrompts, setprevPrompts] = useState<string[]>([]);
  const [showResult, setshowResult] = useState(false);

  // Helpers
  const delayPara = (index: number, nextWord: string) => {
    setTimeout(() => {
      setresult((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setloading(false);
    setshowResult(false);
    setresult("");
    setques("");
    setrecentPrompt("");
    console.log("New chat started");
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

    // Payload for API
    const payload = {
      contents: [
        {
          parts: [{ text: currentPrompt }],
        },
      ],
    };

    // Placeholder: Replace with API call
    let finalResponse = "";
    try {
      
      // const response = await fetch(URL, {
      //   method: "POST",
      //   body: JSON.stringify(payload),
      // });
      // const data = await response.json();
      // finalResponse = data.candidates[0].content.parts[0].text;

      // Dummy response (for testing UI without API)
    } catch (error) {
      console.error("Error fetching response:", error);
      finalResponse = "⚠️ Something went wrong. Please try again.";
    }

    // Format bold and line breaks 
    let formattedResponse = finalResponse
      .split("**")
      .map((chunk, i) => (i % 2 === 1 ? `<b>${chunk}</b>` : chunk))
      .join("");

    formattedResponse = formattedResponse.replace(/\*/g, "<br/>");

    // Simulate typing effect
    const words = formattedResponse.split(" ");
    words.forEach((word, i) => delayPara(i, word + " "));

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
  };

  return (
    <Context.Provider value={contextValue}>{children}</Context.Provider>
  );
};

export default ContextProvider;
