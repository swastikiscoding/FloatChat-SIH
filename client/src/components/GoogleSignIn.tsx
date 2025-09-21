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
    <div className='w-full h-screen flex flex-col items-center bg-gray-900'>
      <div className="border-2 border-white/40 bg-gradient-to-r from-black via-gray-900 to-black pr-11 pb-3  rounded-md shadow-xl shadow-cyan-500/40  mt-20 sm:mt-40">
        <div className="ml-2 mt-2 flex gap-2  ">
          <img src={icon} alt="logo" className="w-9 h-9"/>          
          <span className="font-semibold text-2xl">FloatChat</span>
        </div>
        <div className="font-semibold text-2xl mt-4 ml-5 text-center text-blue-300 ">Sign In</div>
        <div className=" text-center ml-6 mb-9 text-lg">
          <button onClick={handleGoogleSignIn} className="pl-3 mt-6 ">
            <div className="flex items-center justify-center w-full sm:w-auto pr-4 pl-1 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm  ">
              <FcGoogle className="w-5 h-5 inline bg-white mr-2" />
              <span>Continue with Google</span>
            </div>
          </button>
        </div>
        <div className="flex ml-22 gap-1">
          <small className="text-gray-400 ">Powered by clerk</small>
          <img src={clerkSvg} alt="logo" className="w-5 h-5 bg-black"></img>
        </div>
      </div>
    </div>
  );
}
