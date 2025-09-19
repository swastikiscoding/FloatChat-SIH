import React, { useState } from "react";
import Earth from "./Earth";

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('2025-09-05');
  const [isChangingDate, setIsChangingDate] = useState<boolean>(false);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChangingDate(true);
    setSelectedDate(event.target.value);
    // Reset the changing state after a brief delay to show visual feedback
    setTimeout(() => setIsChangingDate(false), 500);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Date Picker in Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-zinc-900/90 backdrop-blur-sm rounded-lg p-4 border border-gray-600 shadow-xl min-w-[200px]">
          <label htmlFor="date-picker" className="block text-white text-sm font-medium mb-2">
            📅 Select Date
          </label>
          <div className="relative">
            <input
              id="date-picker"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full bg-zinc-800 text-white border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              min="2020-01-01"
              max="2025-12-31"
            />
            {isChangingDate && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Current: {new Date(selectedDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Earth Component */}
      <Earth selectedDate={selectedDate} />
    </div>
  );
};

export default Dashboard;
