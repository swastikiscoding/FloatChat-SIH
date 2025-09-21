import React, { useContext } from "react";
import { useUser } from "@clerk/clerk-react";
import BotReply from "./BotReply";
import UserQuerry from "./UserQuery.tsx";
import { Context } from "../context/Context.tsx";

const ChatSection: React.FC = () => {
  const { user, isLoaded } = useUser();
  const {
    askQue,
    recentPrompt,
    setrecentPrompt,
    result,
    loading,
    showResult,
    messages,
  } = useContext(Context);

  // Handle card click
  const handleCardClick = async (prompt: string) => {
    setrecentPrompt(prompt);
    await askQue(prompt);
  };

  // Get user's first name with fallback
  const getGreeting = () => {
    if (!isLoaded) {
      return "Hello...";
    }
    if (user?.firstName) {
      return `Hello, ${user.firstName}.`;
    }
    return "Hello, User.";
  };

  return (
    <div className="bg-gray-950 text-white relative w-full flex-1 mr-7 mt-4 px-6 flex flex-col gap-6 overflow-y-auto scrollbar-none">

      {/* Top Navbar */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
        <h1 className="text-2xl font-bold">FloatChat</h1>
        {/* <img
          className="w-12 h-12 rounded-full border-2 border-gray-600"
          src="https://media.licdn.com/dms/image/D4D03AQH1b0nX4nXr4Q/profile-displayphoto-shrink_800_800/0/1683296326461?e=1701302400&v=beta&t=Yk2f1y8kqf1p3p5iU1K5E6mM2z7c3c3F4b3F6F6F6F6"
          alt="Profile"
        /> */}
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col ">
        {!showResult ? (
          <>
            {/* Greeting */}
            <div className="text-center mt-10">
              <h2 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-100 via-cyan-700 to-blue-900 bg-clip-text text-transparent transition-all duration-300">
                {getGreeting()}
              </h2>
              <p className="text-gray-400 mt-4 text-lg">
                How can I help you today?
              </p>
            </div>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mt-8 ">
              {[
                "What is the current surface temperature and salinity at coordinates [lat, lon]?",
                "What are the current ocean currents (speed and direction) in this area?",
                "What is the water pressure and temperature profile at 50 meters depth?",
                "How has the sea surface temperature changed over the past week at this location?",
              ].map((text, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCardClick(text)}
                  className="bg-[#0f111a] rounded-xl p-6 text-white shadow-[0_0_20px_rgba(0,255,255,0.2)] border border-cyan-400/20 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] transition-shadow duration-300"
                >
                  {text}
                </div>
              ))}
            </div>
          </>
        ) : (
          // Result Section
          <div className="mt-6 space-y-3  max-h-[70vh]">
            {/* Display all chat messages if available */}
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div key={index} className="space-y-3">
                  <UserQuerry Text={message.userMessage} />
                  <BotReply Text={message.AIMessage} />
                </div>
              ))
            ) : (
              // Fallback to current conversation
              <>
                {recentPrompt && <UserQuerry Text={recentPrompt} />}
                <BotReply Text={result} loading={loading} />
              </>
            )}
            
            {/* Show loading for new message if messages exist but we're loading */}
            {loading && messages.length > 0 && (
              <>
                {recentPrompt && <UserQuerry Text={recentPrompt} />}
                <BotReply Text="" loading={true} />
              </>
            )}
          </div>
        )}
      </div>

      {/* Static Example Messages
      <div className="mt-6 space-y-3">
        <UserQuerry Text="hello, i am user hello, i am user hello, i am user" />
        <BotReply Text="hello, i am bot" />
      </div> */}
    </div>
  );
};

export default ChatSection;
