import React from "react";
import {
  UserButton,
} from "@clerk/clerk-react";

const Dashboard: React.FC = () => {
  return (
    <div>
        <UserButton />
      <p>private dashboard</p>
    </div>
  );
};

export default Dashboard;
