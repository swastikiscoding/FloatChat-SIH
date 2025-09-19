import bgImage from "../../assets/bgImage.png"
import bgdark from "../../assets/bgdark.png";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
const Navbar = () => {
  const navigate = useNavigate();

  return (
      <div className="min-w-full h-[70vh] sm:h-[99vh] bg-cover bg-center bg-no-repeat overflow-hidden"
            style={{backgroundImage:`url(${bgdark})`,backgroundSize: "101vw"}}>
          <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex justify-between pt-5 pl-8 pr-8"
      >
            <div className="flex gap-2 items-center">
         <img src="../../../apple-touch-icon.png" alt=""  className="w-9 h-9"/>
              <div className="font-semibold text-xl">FloatChat</div>
            </div>
<motion.div
          className="hidden sm:flex text-white gap-8 pl-4 pr-4 pt-1 pb-1 rounded-2xl border-[#00ff9221] border"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >             
              <div className="cursor-pointer">FAQ</div>
              <div className="cursor-pointer">Features</div>
              <div className="cursor-pointer">About Us</div>
            </motion.div>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-[#095268] font-semibold pl-4 pr-4 rounded-2xl cursor-pointer"
            onClick={() => navigate("/google-signin")}
          >
            SignIn
          </motion.button>
        </SignedOut>
      </motion.nav>
          <motion.h1
        className="text-4xl sm:text-7xl font-bold mt-15 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >            Dive into the ocean of data..
          </motion.h1>
          <motion.h2
        className="font-extralight sm:text-xl mt-4 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        AI-powered insights from ARGO floats
      </motion.h2>
          <motion.div
        className="text-center mt-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.7, type: "spring" }}
      >
        <button className="bg-[#095268] hover:bg-sky-700 font-semibold pl-6 pr-6 pt-2 pb-2 text-2xl rounded-2xl text-center cursor-pointer">
          Start Chatting
        </button>
      </motion.div>
      </div>
  )
}

export default Navbar;
