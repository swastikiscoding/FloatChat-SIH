import { useSignIn } from "@clerk/clerk-react";
import { FcGoogle } from "react-icons/fc";
import icon from "../assets/shell_fevicon.svg"

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
      <div className="h-3/7 w-3/14 rounded-4xl flex flex-col border border-cyan-400 
                bg-gradient-to-b from-black via-gray-900 to-gray-600/30
                shadow-[6px_6px_20px_-2px_rgba(34,211,238,0.5)]">
        <div className="flex gap-2 items-center rounded-t-4xl h-2/10 p-4 mt-1 mb-1">
          <img src={icon} alt="" className="w-7 h-7"/>
          <span className="font-semibold text-2xl">FloatChat</span>
        </div>
        <div className="rounded-b-4xl h-8/10 flex flex-col items-center justify-around">
          <div className="text-xl mt-3 mb-2 p-1 text-cyan-400 font-light">Login</div>
          <div className="mb-3 rounded-xl">
            <button 
              onClick={handleGoogleSignIn} 
              className="p-3 flex justify-center items-center text-gray-200
                        rounded-2xl bg-gradient-to-b from-gray-600 to-black
                        hover:scale-104 hover:text-gray-400 transition-transform duration-200
                        shadow-[3px_3px_10px_-1px_rgba(34,211,238,0.4)]">
              <FcGoogle className="w-7 h-7 inline rounded-3xl mr-2" />
              <span className="text-lg font-extralight">Continue with Google</span>
            </button>
          </div>
          <div className="text-gray-400/70 text-sm mt-2">
            Powered by clerk
          </div>
        </div>
</div>



    </div>
  );
}
