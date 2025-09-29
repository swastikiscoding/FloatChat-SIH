import { Waves } from "../ui/waves-background"
import icon from "../../assets/shell_fevicon.svg"
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/clerk-react";

type NavbarProps = {
  onFaqClick: () => void;
  onFeaturesClick: () => void;
  onAboutClick: () => void;
};
const Navbar = ({ onFaqClick, onFeaturesClick, onAboutClick }: NavbarProps) => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth()

  const handleChatClick = () => {
    if (isSignedIn) {
      navigate("/Chatbot");
    } else {
      navigate("/google-signin");
    }
  }

  const handleDashboardClick = () => {
    if (isSignedIn) {
      navigate("/dashboard");
    } else {
      navigate("/google-signin");
    }
  }
  return (

    <div className="relative min-w-full h-[70vh] sm:h-[99vh] ">
      <div className="absolute inset-0 z-0">
        <Waves />
      </div>

      <div className="relative z-10">
        <motion.nav
          className="grid grid-cols-2 sm:grid-cols-3 items-center  px-1 md:px-6 py-2"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Left Column - Logo */}
          <motion.div
            className="flex gap-2 items-center justify-start"
            whileHover={{ scale: 1.04 }}
          >
            <img src={icon} alt="logo" className="w-9 h-9" />
            <div className="font-semibold text-xl">FloatChat</div>
          </motion.div>

          {/* Center Column - Menu (subgrid with 3 items) */}
          <motion.div
            className="hidden sm:grid grid-cols-3 mx-10 gap-0 text-white pr-2 py-1 
                 rounded-2xl border-cyan-600 border-2 sm:max-[800px]:w-[200px] max-[970px]:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div className="cursor-pointer text-center" whileHover={{ scale: 1.2 }} onClick={onFaqClick}>
              FAQ
            </motion.div>
            <motion.div className="cursor-pointer text-center" whileHover={{ scale: 1.2 }} onClick={onFeaturesClick}>
              Features
            </motion.div>
            <motion.div className="cursor-pointer text-center" whileHover={{ scale: 1.2 }} onClick={onAboutClick}>
              About Us
            </motion.div>
          </motion.div>

          {/* Right Column - Sign In / User */}
          <div className="flex justify-end items-center gap-4 mb-2">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "#0c6a85" }}
                className="bg-[#095268] font-semibold px-4 py-2 rounded-2xl cursor-pointer"
                onClick={() => navigate("/google-signin")}
              >
                Sign In
              </motion.button>
            </SignedOut>
          </div>
        </motion.nav>


        <div className="flex flex-col justify-center items-center h-[60vh] sm:h-[75vh] text-white">
          <motion.h1
            className="text-4xl z-10 sm:text-7xl font-bold md:mt-15 text-center md:ml-14"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Dive into the Ocean of Data
          </motion.h1>

          <motion.h2
            className="font-extralight sm:text-xl mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            AI-powered insights from ARGO floats
          </motion.h2>
          <motion.div
            className="text-center mt-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7, delay: 1 }}
          >
            <div className="flex gap-4 justify-center items-center flex-wrap">
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "#0284c7" }}
                className="bg-cyan-600 font-semibold px-6 py-2 text-xl sm:text-2xl rounded-2xl text-center cursor-pointer"
                onClick={handleDashboardClick}
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
          {isSignedIn ?<button
            onClick={handleChatClick}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-10 h-10 md:w-11 md:h-11 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
            style={{
              animation: 'bounce 2s infinite alternate',
            }}
            aria-label="Open Chat"
            title="Chat with FloatChat"
          >
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-200 relative z-10" />

            {/* Pulse effect */}
            <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-20 animate-ping"></div>
          </button>
          :<></>
          }
        </div>
      </div>
    </div>
  )
}

export default Navbar
