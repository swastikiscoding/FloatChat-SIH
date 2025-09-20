import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

type FooterProps = {
  onFaqClick: () => void;
  onFeaturesClick: () => void;
  onModesClick: () => void;
  onNavClick: () => void;
};
export default function Footer({onFaqClick, onFeaturesClick,onModesClick,onNavClick}:FooterProps) {
  const navigate = useNavigate();
  const {isSignedIn}=useAuth()

  const handleclick=()=>{
    if (isSignedIn) {
      navigate("/Chatbot");  
    } else {
      navigate("/google-signin"); 
    }
  }
  return (
    <>
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 opacity-70 " />
      <footer className="bg-[#0c0f14] text-gray-300 pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
         
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="../../../public/favicon.svg" alt=""  className="w-9 h-9"/>
              <h1 className="text-white font-semibold text-lg">FloatChat</h1>
            </div>
            <p className="text-sm text-gray-400">
              Dive into the ocean of data
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2 ">Quick Links</h3>
            <ul className="space-y-1 text-sm font-light">
              <li>
                <div className="hover:text-cyan-400 cursor-pointer" onClick={onNavClick}>
                  Home
                </div>
              </li>
              <li>
                <div className="hover:text-cyan-400 cursor-pointer" onClick={()=>handleclick()}>
                  Chat
                </div>
              </li>
              <li>
                <div className="hover:text-cyan-400 cursor-pointer" onClick={onModesClick}>
                  Modes
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Help & Features</h3>
           <ul className="space-y-1 text-sm font-light">
              <li>
                <div onClick={onFaqClick} className="hover:text-cyan-400 cursor-pointer">
                  FAQs
                </div>
              </li>
              <li>
                <div onClick={onFeaturesClick} className="hover:text-cyan-400 cursor-pointer">
                 AI features
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} FloatChat. All rights reserved.
        </div>
      </footer>
    </>
  );
}
