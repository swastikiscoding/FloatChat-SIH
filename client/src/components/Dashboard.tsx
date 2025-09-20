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
      
      {/* Earth Component */}
      <Earth 
        selectedDate={selectedDate} 
        onDateChange={(date) => handleDateChange(date)}
      />
    </div>
  );
};

export default Dashboard;
