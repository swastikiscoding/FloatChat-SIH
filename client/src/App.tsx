import Features from "./components/landing-page/Features";
import Faq from "./components/landing-page/Faq";
import DevTeam from "./components/landing-page/Team";
import Footer from "./components/landing-page/Footer";
import "./App.css";
import Navbar from "./components/landing-page/Navbar";
import Mainfeatures from "./components/landing-page/Mainfeatures";
import Mode from "./components/landing-page/Mode";
import { useRef } from "react";

function App() {
  const faqRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const modeRef=useRef<HTMLDivElement | null>(null);
  const navRef=useRef<HTMLDivElement | null>(null);
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <div ref={navRef}>
        <Navbar
          onFaqClick={() => scrollTo(faqRef)}
          onFeaturesClick={() => scrollTo(featuresRef)}
          onAboutClick={() => scrollTo(aboutRef)}
        />
      </div>
      <Mainfeatures />
      <div className="mb-15" ref={featuresRef}>
        <Features />
      </div>
      <div ref={modeRef}><Mode /></div>
      <div ref={faqRef}><Faq /></div>
      <div ref={aboutRef}><DevTeam /></div>
      <Footer
        onFaqClick={() => scrollTo(faqRef)}
        onFeaturesClick={() => scrollTo(featuresRef)} 
        onModesClick={()=>scrollTo(modeRef)}
        onNavClick={()=>scrollTo(navRef)}
      />
    </>
  );
}

export default App;
