import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 opacity-70 " />
      <footer className="bg-[#0c0f14] text-gray-300 pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
         
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-cyan-400 text-2xl">🌊</span>
              <h1 className="text-white font-semibold text-lg">FloatChat</h1>
            </div>
            <p className="text-sm text-gray-400">
              Dive into the ocean of data.
            </p>
          </div>

         
          <div>
            <h3 className="font-semibold text-white mb-2 ">Quick Links</h3>
            <ul className="space-y-1 text-sm font-light">
              <li>
                <a href="#" className="hover:text-cyan-400">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400">
                  Chat
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400">
                  Modes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400">
                  Saved Insights
                </a>
              </li>
            </ul>
          </div>

          
          <div>
            <h3 className="font-semibold text-white mb-2">Extra</h3>
            <ul className="space-y-1 text-sm font-light">
              <li>
                <a href="#" className="hover:text-cyan-400">
                  Settings
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400">
                 Profile
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400">
                  Help
                </a>
              </li>
               <li>
                <a href="#" className="hover:text-cyan-400">
                  Logout
                </a>
              </li>
            </ul>
          </div>

          
          <div>
            <h3 className="font-semibold text-white mb-2">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-cyan-400 text-xl">
                <FaGithub />
              </a>
              <a href="#" className="hover:text-cyan-400 text-xl">
                <FaLinkedin />
              </a>
            </div>
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
