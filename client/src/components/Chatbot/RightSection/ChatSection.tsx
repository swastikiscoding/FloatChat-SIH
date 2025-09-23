import React, { useContext } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { EarthIcon } from "lucide-react";
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
    <div className="bg-gray-950 text-white relative w-full flex-1 mr-2 md:mr-7 mt-4 px-3 md:px-6 flex flex-col gap-4 md:gap-6 overflow-y-auto scrollbar-none">

      {/* Top Navbar */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
        <h1 className="text-lg md:text-2xl font-bold">FloatChat</h1>
        <Link 
          to="/dashboard" 
          className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors duration-200 text-xs md:text-sm font-medium"
        >
          <EarthIcon size={14} className="md:w-4 md:h-4" />
          <span className="hidden sm:inline">Dashboard</span>
          <span className="sm:hidden">Map</span>
        </Link>
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
            <div className="text-center mt-4 md:mt-10">
              <h2 className="text-2xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-100 via-cyan-700 to-blue-900 bg-clip-text text-transparent transition-all duration-300">
                {getGreeting()}
              </h2>
              <p className="text-gray-400 mt-2 md:mt-4 text-sm md:text-lg">
                How can I help you today?
              </p>
            </div>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mt-4 md:mt-8">
              {[
                "Sea temperature and salinity trends in the central Philippine Sea (126°-130°E, 10°-15°N) over the past month.",
                "What is the surface temperature and salinity at -64.870163 longitude, 42.330696 latitude?",
                "Comparison of temperature profiles between the eastern and western equatorial Indian Ocean.",
                "Sea surface temperature changes over the past week at western equatorial Indian Ocean.",
              ].map((text, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCardClick(text)}
                  className="bg-[#0f111a] cursor-pointer rounded-xl p-3 md:p-6 text-white shadow-[0_0_20px_rgba(0,255,255,0.2)] border border-cyan-400/20 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] transition-shadow duration-300 text-sm md:text-base"
                >
                  {text}
                </div>
              ))}
            </div>
          </>
        ) : (
          // Result Section
          <div className="mt-3 md:mt-6 space-y-2 md:space-y-3 max-h-[70vh] overflow-y-auto scrollbar-none">
            {/* Display all chat messages if available */}
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div key={index} className="space-y-2 md:space-y-3">
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
