import Features from "./components/landing-page/Features";
import Faq from "./components/landing-page/Faq";
import DevTeam from "./components/landing-page/Team";
import Footer from "./components/landing-page/Footer";
import "./App.css";
import Navbar from "./components/landing-page/Navbar";
import Mainfeatures from "./components/landing-page/Mainfeatures";
import Mode from "./components/landing-page/Mode";

function App() {
  return (
    <>
      {/* <Waves/> */}
      <div className="main bg-black">
        <header>
          <SignedOut>
            <button
              onClick={() => navigate("/google-signin")}
              style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
            >
              Sign In
            </button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
      <div className="main">
        
        <Navbar/>
        <Mainfeatures/>
        <div className="mb-15">
          <Features />
        </div>
        <Mode/>
        <Faq />
        <DevTeam />
        <Footer />
      </div>
    </>
  );
}

export default App;
