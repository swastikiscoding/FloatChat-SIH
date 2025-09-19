import { Waves } from "../ui/waves-background"
import icon from "../../../public/favicon.svg"
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
const Navbar = () => {
  const navigate = useNavigate();
  return (
      <div className="relative min-w-full h-[70vh] sm:h-[99vh] bg-cover bg-center bg-no-repeat overflow-hidden">
          <div className="absolute inset-0 z-0 ">
            <Waves/>
          </div>

          <div className="relative z-10 p-8">
            <nav className="flex  justify-between pt-5 pl-8 pr-8">
            <div className="flex gap-2 items-center">
              <img src={icon} alt="Icon" className="w-8 h-8"/>
              <div className="font-semibold text-xl ">FloatChat</div>
            </div>
            <div className=" hidden sm:flex text-white gap-8 pl-4 pr-4 pt-1 pb-1 rounded-2xl border-cyan-600 border-2">
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
          <h1 className="text-4xl z-10 sm:text-7xl font-bold mt-15 text-center ml-14">
            Dive into the Ocean of Data
          </h1>
          <h2 className="font-extralight sm:text-xl mt-4 text-center">
            AI-powered insights from ARGO floats
          </h2>
          <div className="text-center mt-20">
              <button className="bg-cyan-600 hover:bg-sky-700 font-semibold pl-6 pr-6 pt-2 pb-2 text-2xl rounded-2xl text-center cursor-pointer">Start Chatting</button>
          </div>
          </div>
      </div>
  )
}

export default Navbar