import { useSignIn } from "@clerk/clerk-react";
import { FcGoogle } from "react-icons/fc";
import icon from "../assets/shell_fevicon.svg"
import clerkSvg from "../assets/clerkSvg.jpeg"

export default function GoogleSignInButton() {
  const { signIn, isLoaded } = useSignIn();

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      console.error("Google Sign-In failed", err);
    }
  };
  return (
    <div className='w-full h-screen flex items-center justify-center bg-gray-950'>
      <div
        className="rounded-4xl flex flex-col border border-cyan-400
          bg-gradient-to-b from-black via-gray-900/90 to-gray-600/25
          shadow-[6px_6px_20px_-2px_rgba(34,211,238,0.5)]
          w-full max-w-xs h-auto px-4 py-6
          sm:w-108/480 sm:h-3/7 sm:max-w-none sm:px-0 sm:py-0"
      >
        <div className="flex gap-2 items-center rounded-t-4xl p-2 mt-0 mb-2 sm:p-4 sm:mt-1 sm:mb-1">
          <img src={icon} alt="" className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="font-semibold text-lg sm:text-2xl">FloatChat</span>
        </div>
        <div className="rounded-b-4xl flex flex-col items-center justify-around">
          <div className="text-base mt-2 mb-3 p-1 text-cyan-400 font-light sm:text-xl sm:mt-3 sm:mb-3">Login</div>
          <div className="mb-3 rounded-xl w-full flex justify-center">
            <button
              onClick={handleGoogleSignIn}
              className="p-3 my-4 sm:mt-4 flex justify-center items-center text-gray-200 sm:w-auto
                        rounded-2xl bg-gradient-to-b from-gray-600 to-black
                        hover:scale-104 hover:text-gray-300 transition-transform duration-200
                        shadow-[3px_3px_10px_-1px_rgba(34,211,238,0.4)]"
            >
              <FcGoogle className="w-6 h-6 inline rounded-3xl mr-2 sm:w-7 sm:h-7" />
              <span className="text-base font-extralight sm:text-lg">Continue with Google</span>
            </button>
          </div>
          {/* <div className="text-gray-400/70 text-xs mt-2 flex justify-center items-center sm:text-sm">
            <img src={clerkSvg} alt="" className="w-5 h-5 mr-1 rounded-2xl sm:w-6 sm:h-6 sm:mr-2" />
            
          </div> */}
        </div>
      </div>
    </div>
  );
}
