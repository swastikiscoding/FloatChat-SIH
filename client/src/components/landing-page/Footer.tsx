import icon from "../../assets/shell_fevicon.svg"

export default function Footer() {
  return (
    <>
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 opacity-70 " />
      <footer className="bg-[#0c0f14] text-gray-300 pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
         
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={icon} alt=""  className="w-7 h-7"/>
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
            </ul>
          </div>

          
          {/* <div>
            <h3 className="font-semibold text-white mb-2">Account</h3>
            <ul className="space-y-1 text-sm font-light">
              <li>
                <a href="#" className="hover:text-cyan-400">
                  Profile
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400">
                 Settings
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400">
                  Logout
                </a>
              </li>
               <li>
                <a href="#" className="hover:text-cyan-400">
                  FAQs
                </a>
              </li>
            </ul>
          </div> */}

          
          <div>
            <h3 className="font-semibold text-white mb-2">Help & Features</h3>
           <ul className="space-y-1 text-sm font-light">
              <li>
                <a href="#" className="hover:text-cyan-400">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400">
                 AI features
                </a>
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
