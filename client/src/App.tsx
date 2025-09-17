import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import Features from "./components/landing page/Features";
import Faq from "./components/landing page/Faq";
import DevTeam from "./components/landing page/Team";
import Footer from "./components/landing page/Footer";

import "./App.css";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
    <>
      <div className="main">
        <header>
          <SignedOut>
            <button
              onClick={() => navigate("/google-signin")}
              style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
            >
              Sign In
            </button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
        <div className="mb-15">
          <Features />
        </div>
        <Faq />
        <DevTeam />
        <Footer />
      </div>
    </>
  );
}

export default App;
