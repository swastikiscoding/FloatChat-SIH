import { useSignIn } from "@clerk/clerk-react";
import { FcGoogle } from "react-icons/fc";
import loginbg from "../assets/Login.png"

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
    <div className='w-full h-screen' style={{backgroundImage:`url(${loginbg})`,display: "flex", flexDirection: "column", alignItems: "center"}}>
      <div className="border-2 border-cyan-500 bg-black  pr-20 pb-10 rounded-md shadow-xl shadow-cyan-500/50 mt-10">
        <div className="ml-2 mt-2">
          <span className="text-cyan-400 text-3xl mr-1">🌊</span>
          <span className="font-semibold text-2xl">FloatChat</span>
        </div>
        <div className="font-semibold text-xl mt-4 pl-3.5">Login</div>
        <div>
          <button onClick={handleGoogleSignIn} className="pl-3 mt-6">
            <div className="flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm  ">
              <FcGoogle className="w-5 h-5 inline bg-white mr-2" />
              <span>Continue with Google</span>
            </div>
          </button>
        </div>
        <div className="mt-4 pl-4 text-[#FFFFFF]">
          <span className="text-gray-200">Don't have an account sign?</span>
          <span className="text-blue-300 ml-2">Sign Up</span>
        </div>
      </div>
    </div>
  );
}
