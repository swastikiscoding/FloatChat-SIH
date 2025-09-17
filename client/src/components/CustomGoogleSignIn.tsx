import React from "react";
import GoogleSignInButton from "./GoogleSignIn";

const CustomGoogleSignIn: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" }}>
      <h2>Sign in with Google</h2>
      <GoogleSignInButton />
    </div>
  );
};

export default CustomGoogleSignIn;
