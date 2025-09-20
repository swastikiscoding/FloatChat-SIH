import React, { useState } from "react";
import Earth from "./Earth";
import { Calendar } from "lucide-react";

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2025-09-05');
  const [isChangingDate, setIsChangingDate] = useState<boolean>(false);

  const handleDateChange = (value: string | React.ChangeEvent<HTMLInputElement>) => {
    setIsChangingDate(true);
    const dateValue = typeof value === 'string' ? value : value.target.value;
    setSelectedDate(dateValue);
    // Reset the changing state after a brief delay to show visual feedback
    setTimeout(() => setIsChangingDate(false), 500);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Date Picker in Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-gray-950/95 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-xl min-w-[240px] transition-all duration-200 hover:border-white/40">
          <div className="flex items-center mb-3">
            <Calendar className="w-4 h-4 text-cyan-400 mr-2" />
            <label htmlFor="date-picker" className="block text-white text-sm font-medium">
              Select Date
            </label>
          </div>
          <div className="relative">
            <input
              id="date-picker"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full bg-gray-800/50 text-white border border-white/20 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-200 hover:border-white/40 hover:bg-gray-800/70"
              min="2020-01-01"
              max="2025-12-31"
            />
            {isChangingDate && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-white/10">
            <p className="text-xs text-gray-400">
              <span className="text-cyan-400 font-medium">Current:</span> {new Date(selectedDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Earth Component */}
      <Earth 
        selectedDate={selectedDate} 
        onDateChange={(date) => handleDateChange(date)}
      />
    </div>
  );
};

export default Dashboard;
