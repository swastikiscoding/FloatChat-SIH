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
      <Navbar />
            <div className="h-[2px] w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 opacity-70 " />
      <div className="mt-20 "><Mainfeatures /></div>
      <div className="mb-15">
        <Features />
      </div>
      <Mode />
      <Faq />
      <DevTeam />
      <Footer />
    </>
  );
}

export default App;
