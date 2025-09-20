import { Waves } from "../ui/waves-background"
import { motion } from "framer-motion";
import icon from "../../../public/favicon.svg"

import { useNavigate } from "react-router-dom";

import { SignedIn, SignedOut, UserButton,useAuth } from "@clerk/clerk-react";


const Navbar = () => {
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
      <div className="relative min-w-full h-[70vh] sm:h-[99vh] bg-cover bg-center bg-no-repeat overflow-hidden">
          <div className="absolute inset-0 z-0 ">
            <Waves/>
          </div>

          <div className="relative z-10 p-8">
            <motion.nav 
          className="flex justify-between pt-5 pl-8 pr-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <motion.div 
            className="flex gap-2 items-center"
            whileHover={{ scale: 1.1 }}
          >
              <span className="text-cyan-600 text-2xl">🌊</span>

              <div className="font-semibold text-xl ">FloatChat</div>
            </motion.div>
            <motion.div 
            className="hidden sm:flex text-white gap-8 pl-4 pr-4 pt-1 pb-1 rounded-2xl border-cyan-600 border-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
              <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">FAQ</motion.div>
            <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">Features</motion.div>
            <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">About Us</motion.div>
            </motion.div>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "#0c6a85" }}
              className="bg-[#095268] font-semibold pl-4 pr-4 rounded-2xl cursor-pointer"
              onClick={() => navigate("/google-signin")}
            >
              Sign In
            </motion.button>
            </SignedOut>
          </motion.nav>
        <motion.h1 
          className="text-4xl z-10 sm:text-7xl font-bold mt-15 text-center ml-14"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Dive into the Ocean of Data..
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
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "#0284c7" }}
            className="bg-cyan-600 font-semibold pl-6 pr-6 pt-2 pb-2 text-2xl rounded-2xl text-center cursor-pointer"
          >
            Start Chatting
          </motion.button>
        </motion.div>

          </div>
      </div>
    </div>
  )
}

export default Navbar
