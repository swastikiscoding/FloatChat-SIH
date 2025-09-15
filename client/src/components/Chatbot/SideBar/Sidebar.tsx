import React from "react";
import History from "./History";
import Modes from "./Modes";

const Sidebar = () => {

  return (
    <div className="w-1/5 border-r bg-black flex flex-col h-full"> 
      {/* sidebar header */}
      <div className="w-full h-[60px] flex items-center bg-green-950 border-b p-2">
        <svg width="40px" height="40px" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"> <path d="M30 10H10v20h20V10zM16.667 21.667h-3.334v5h3.334v-5zm1.666-8.334h3.334v13.334h-3.334V13.333zm8.334 5h-3.334v8.334h3.334v-8.334z" /> </svg>
        <span className="text-2xl ml-2">FloatChat</span>
      </div>

      {/* mid section */}
      <div className="flex-1 mx-6 flex flex-col pt-4 h-8/10">
        {/* New Chat button */}
        <button className="flex items-center pl-2 rounded-xl bg-gray-900 hover:bg-gray-700 transition h-[42px]">
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 7.2C3 6.07989 3 5.51984 3.21799 5.09202C3.40973 4.71569 3.71569 4.40973 4.09202 4.21799C4.51984 4 5.0799 4 6.2 4H17.8C18.9201 4 19.4802 4 19.908 4.21799C20.2843 4.40973 20.5903 4.71569 20.782 5.09202C21 5.51984 21 6.0799 21 7.2V20L17.6757 18.3378C17.4237 18.2118 17.2977 18.1488 17.1656 18.1044C17.0484 18.065 16.9277 18.0365 16.8052 18.0193C16.6672 18 16.5263 18 16.2446 18H6.2C5.07989 18 4.51984 18 4.09202 17.782C3.71569 17.5903 3.40973 17.2843 3.21799 16.908C3 16.4802 3 15.9201 3 14.8V7.2Z"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="pl-2 font-medium text-gray-200">New Chat</span>
        </button>

        <Modes/>
        
        <History/>
      </div>

      {/* footer */}
      <div className="h-[60px] bg-green-950 flex justify-end items-center pr-5 border-t">
        <div className='p-2 border rounded-4xl bg-black flex justify-center items-center'>YT</div>
      </div>
    </div>
  );
};

export default Sidebar;
