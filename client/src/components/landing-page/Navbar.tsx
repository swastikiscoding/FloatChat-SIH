import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/bgImage.png"
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
const Navbar = () => {
  const navigate = useNavigate();
  return (
      <div className="min-w-full h-[70vh] sm:h-[99vh] bg-cover bg-center bg-no-repeat overflow-hidden"
            style={{backgroundImage:`url(${bgImage})`,backgroundSize: "101vw"}}>
          <nav className="flex  justify-between pt-5 pl-8 pr-8">
            <div className="flex gap-2 items-center">
              <span className="text-cyan-400 text-2xl">🌊</span>
              <div className="font-semibold text-xl">FloatChat</div>
            </div>
            <div className=" hidden sm:flex text-white gap-8 pl-4 pr-4 pt-1 pb-1 rounded-2xl border-[#00ff9221] border">
              <div className="cursor-pointer">FAQ</div>
              <div className="cursor-pointer">Features</div>
              <div className="cursor-pointer">About Us</div>
            </div>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <button className="bg-[#095268] font-semibold pl-4 pr-4 rounded-2xl cursor-pointer" onClick={() => navigate("/google-signin")}>SignIn</button>
            </SignedOut>
          </nav>
          <h1 className="text-4xl sm:text-7xl font-bold mt-15 text-center">
            Dive into the ocean of data..
          </h1>
          <h2 className="font-extralight sm:text-xl mt-4 text-center">
            AI-powered insights from ARGO floats
          </h2>
          <div className="text-center mt-20">
              <button className="bg-[#095268] hover:bg-sky-700 font-semibold pl-6 pr-6 pt-2 pb-2 text-2xl rounded-2xl text-center cursor-pointer">Start Chatting</button>
          </div>
      </div>
  )
}

export default Navbar
