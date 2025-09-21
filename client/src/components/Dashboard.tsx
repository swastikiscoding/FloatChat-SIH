import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Earth from "./Earth";

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2025-09-05');
  const [isChangingDate, setIsChangingDate] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleDateChange = (value: string | React.ChangeEvent<HTMLInputElement>) => {
    setIsChangingDate(true);
    const dateValue = typeof value === 'string' ? value : value.target.value;
    setSelectedDate(dateValue);
    setTimeout(() => setIsChangingDate(false), 500);
    if(isChangingDate) return; 
  };

  const handleChatClick = () => {
    navigate('/chatbot');
  };

  return (
    <div className="relative w-full h-screen">
      
      {/* Earth Component */}
      <Earth 
        selectedDate={selectedDate} 
        onDateChange={(date) => handleDateChange(date)}
      />

      {/* Floating Chat Button */}
      <button
        onClick={handleChatClick}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
        style={{
          animation: 'bounce 2s infinite alternate',
        }}
        aria-label="Open Chat"
        title="Chat with FloatChat"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200 relative z-10" />
        
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-20 animate-ping"></div>
      </button>
    </div>
  );
};

export default Dashboard;
