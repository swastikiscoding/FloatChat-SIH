import React from "react";
import {
  UserButton,
} from "@clerk/clerk-react";
import Earth from "./Earth";

const Dashboard: React.FC = () => {
  return (
    <div>
        <UserButton />
      <div>
        <Earth/>
      </div>
    </div>
  );
};

export default Dashboard;
