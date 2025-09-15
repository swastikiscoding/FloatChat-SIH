
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import Navbar from './components/landing-page/Navbar'
import Mainfeatures from './components/landing-page/Features'
import Mode from './components/landing-page/Mode'
import Features from './components/landing-page/Features'
import Faq from './components/landing-page/Faq'
import DevTeam from './components/landing-page/Team'
import Footer from './components/landing-page/Footer'

import "./App.css";

function App() {
  return (
    <>
      <div className="main">
        <header>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
        <Navbar/>
        <Mainfeatures/>
        <Mode/>
        <div className="mb-15">
          <Features />
        </div>
        <Faq />
        <DevTeam />
        <Footer />
      </div>
    </>
  );
}

export default App;
