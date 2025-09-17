import { useSignIn } from "@clerk/clerk-react";

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
    <button onClick={handleGoogleSignIn}>
      Continue with Google
    </button>
  );
}
